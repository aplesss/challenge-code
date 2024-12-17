import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { Repository } from 'typeorm';
import { RedisService } from 'src/redis/redis.service';
import { Question } from 'src/questions/entities/questions.entity';
import {
  CURRENT_QUESTION,
  CURRENT_QUESTION_COUNTER,
  DEFAULT_REFERENCE_ID,
  OPTION_STATUS_ENUM,
  OPTIONS_STATUS,
  QUIZ,
  QUIZ_PARTICIPANTS,
} from 'src/const';
import { KafkaService } from 'src/kafka/kafka.service';
import { CreateJoinUsEvent, CreateQuizStartEvent } from 'src/utiils';
import {
  IAnswer,
  IAnswerResultDto,
  IOptionDto,
  IQuestionDto,
  IQuiz,
} from 'src/types/Response';
import { ScoreService } from 'src/score/score.service';
import { IJoinUs } from 'src/types/IDTO';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    private readonly redisService: RedisService,
    private readonly kafkaService: KafkaService,
    private readonly scoreService: ScoreService,
  ) {}

  async findByReference(refId: string): Promise<IQuiz> {
    const query = {
      where: {
        reference_id: refId,
      },
    };
    let responseData = await this.quizRepository.findOne(query);
    if (!responseData) {
      query.where.reference_id = DEFAULT_REFERENCE_ID;
      responseData = await this.quizRepository.findOne(query);
    }
    return {
      quizId: refId,
      title: responseData.title,
      description: responseData.description,
      status: await this.getQuizStatus(refId),
      participants: await this.redisService.getList(refId),
    };
  }
  async getQuizBegin(id: string) {
    const listParticipants = await this.getQuizParticipants(id);
    if (!listParticipants?.length) {
      const query = {
        where: {
          reference_id: id,
        },
      };
      const quizData = await this.quizRepository.findOne(query);
      this.setQuizStatus(id, OPTIONS_STATUS[1]);
      this.setCurrentQuizQuestionId(id, 1);
      this.setQuizQuestions(
        id,
        quizData.questions.reduce((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {}),
      );
      this.kafkaService.sendRealtimeEvent(CreateQuizStartEvent(id));
    }
  }

  async answerQuestion(
    quizId: string,
    answer: IAnswer,
  ): Promise<IAnswerResultDto> {
    const { userName, questionId, optionId } = answer;

    // Validate input parameters
    if (!quizId || !userName || !questionId || !optionId) {
      throw new HttpException('Invalid parameters', HttpStatus.BAD_REQUEST);
    }

    // Fetch the quiz questions from Redis or other storage
    const questions = await this.getQuizQuestions(quizId);
    if (!questions || !questions[questionId]) {
      throw new HttpException(
        'This quiz does not have any questions',
        HttpStatus.BAD_REQUEST,
      );
    }

    const question: IQuestionDto = questions[questionId];
    const options: IOptionDto[] = question.options;

    // Find the user's option and the correct option
    const userOption = options.find((o) => o.optionId === optionId);
    const correctOption = options.find((o) => o.isCorrect);

    if (!correctOption) {
      throw new HttpException(
        'Question is corrupted!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const isCorrect = userOption && correctOption.optionId === optionId;

    // Get the current question ID for the quiz
    const currentQuestionId = await this.getCurrentQuizQuestionId(quizId);

    // If the question is the current one in the quiz, proceed to check the answer
    if (currentQuestionId === questionId) {
      if (isCorrect) {
        // Update the score if the answer is correct
        await this.scoreService.addScore(quizId, userName, 1);
      }

      // Return the answer result
      return {
        questionId,
        correctOptionId: correctOption.optionId,
        isCorrect,
      };
    }

    // If it's not the current question, return false for correctness
    return {
      questionId,
      correctOptionId: correctOption.optionId,
      isCorrect: false,
    };
  }

  async getQuestion(id: string): Promise<IQuestionDto> {
    const status = await this.getQuizStatus(id);
    if (status === OPTION_STATUS_ENUM.WAITING) {
      throw new BadRequestException('Quiz has not started yet!');
    }
    if (status === OPTION_STATUS_ENUM.FINISHED) {
      return {
        isFinished: true,
      };
    }
    const currentID = await this.getCurrentQuizQuestionId(id);
    const question = await this.getQuizQuestions(id);
    const duration = await this.getCurrentQuizQuestionCounter(id);

    if (duration <= 0) {
      await this.setCurrentQuizQuestionId(id, currentID + 1);
    }

    if (!question) {
      this.setQuizStatus(id, OPTION_STATUS_ENUM.FINISHED);
      return {
        isFinished: true,
      };
    }
    return {
      ...question,
      duration: duration,
      isFinished: false,
    };
  }

  async getQuizStatus(id: string) {
    const statusQuiz = await this.redisService.getValue(id);
    return OPTIONS_STATUS?.[statusQuiz];
  }

  async joinUs(signInDto: IJoinUs): Promise<IQuiz> {
    const { quizId, userName } = signInDto;

    // Validate input
    if (!quizId || !userName) {
      throw new HttpException(
        'QuizId and UserName are needed to required',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Get the current quiz status
    const quizStatus = await this.getQuizStatus(quizId);
    if (quizStatus === OPTIONS_STATUS.STARTED) {
      throw new HttpException('Quiz already started!', HttpStatus.BAD_REQUEST);
    }

    // Set quiz status to waiting
    await this.setQuizStatus(quizId, OPTIONS_STATUS.WAITING);

    // Check if the username is already taken
    const isDuplicated = await this.isUserNameDuplicated(quizId, userName);
    if (isDuplicated) {
      throw new HttpException(
        'Username already exists!',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Add the user to the quiz participants
    await this.addQuizParticipants(quizId, userName);

    // Fetch the quiz entity, defaulting if not found
    let quizEntity = await this.findByReference(quizId);
    if (!quizEntity) {
      quizEntity = await this.findByReference(DEFAULT_REFERENCE_ID);
    }

    // Add the user to the leaderboard
    await this.scoreService.addUser(quizId, userName);

    // Create event and send to Kafka
    const event = CreateJoinUsEvent(
      quizId,
      await this.getQuizParticipants(quizId),
    );
    await this.kafkaService.sendRealtimeEvent(event);

    // Return the quiz information with participants and status
    return {
      quizId,
      title: quizEntity.title,
      description: quizEntity.description,
      status: await this.getQuizStatus(quizId),
      participants: await this.getQuizParticipants(quizId),
    };
  }

  getQuizParticipants(id: string) {
    return this.redisService.getList(`${QUIZ_PARTICIPANTS}${id}`);
  }
  setQuizStatus(quizId: string, quizStatus: string): void {
    this.redisService.setValue(`${QUIZ}${quizId}`, quizStatus);
  }

  isUserNameDuplicated(quizId: string, userName: string): Promise<boolean> {
    return this.redisService.isElementInList(
      `${QUIZ_PARTICIPANTS}${quizId}`,
      userName,
    );
  }

  addQuizParticipants(quizId: string, userName: string): void {
    this.redisService.addToList(`${QUIZ_PARTICIPANTS}${quizId}`, userName);
  }

  async setQuizQuestions(
    quizId: string,
    questions: Record<number, Question>,
  ): Promise<void> {
    try {
      const questionAsString = JSON.stringify(questions);
      await this.redisService.setValue(
        `QUIZ_QUESTION_${quizId}`,
        questionAsString,
      );
    } catch (error) {
      throw new Error('Failed to serialize questions: ' + error.message);
    }
  }

  async getQuizQuestions(quizId: string): Promise<IQuestionDto | null> {
    try {
      const questionAsString = await this.redisService.getValue(
        `QUIZ_QUESTION_${quizId}`,
      );
      if (!questionAsString) {
        return null;
      }
      return JSON.parse(questionAsString) as IQuestionDto;
    } catch (error) {
      throw new Error('Failed to deserialize questions: ' + error.message);
    }
  }
  async setCurrentQuizQuestionId(
    quizId: string,
    questionId: number,
  ): Promise<void> {
    // Set the current question ID for the quiz in Redis
    await this.redisService.setValue(
      `CURRENT_QUESTION_${quizId}`,
      questionId.toString(),
    );

    // Set the current question counter for the quiz with a 10-second expiration time
    await this.redisService.setValueWithExpire(
      `CURRENT_QUESTION_COUNTER_${quizId}`,
      questionId.toString(),
      10, // Expiry time in seconds
    );
  }
  async getCurrentQuizQuestionId(quizId: string) {
    const id = this.redisService.getValue(CURRENT_QUESTION + quizId);
    if (id == null) {
      return 0;
    }
    return Number.parseInt(quizId, 10);
  }
  async getCurrentQuizQuestionCounter(quizId: string): Promise<number> {
    const ttl = await this.redisService.getTTL(
      CURRENT_QUESTION_COUNTER + quizId,
    );
    return ttl ? ttl : 0; // Return the TTL as an integer or 0 if TTL is null.
  }
}
