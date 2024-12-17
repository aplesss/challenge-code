import { Controller, Post, Get, Body, Param, HttpCode } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { IJoinUs } from 'src/types/IDTO';
import {
  IAnswer,
  IAnswerResult,
  ILeaderBoard,
  IQuestionDto,
} from 'src/types/Response';
import { ScoreService } from 'src/score/score.service';

//quiz/${quizId}/question`,
@Controller('api/quiz')
export class QuizController {
  constructor(
    private readonly quizService: QuizService,
    private readonly scoreService: ScoreService,
  ) {}

  // SignIn Endpoint (POST /quiz/join-us)
  @Post('join-us')
  async signIn(@Body() signInDto: IJoinUs): Promise<IQuiz> {
    return this.quizService.joinUs(signInDto);
  }

  // Get Quiz Information (GET /quiz/:quizId)
  @Get(':quizId')
  async getQuiz(@Param('quizId') quizId: string): Promise<IQuiz> {
    return this.quizService.findByReference(quizId);
  }

  // Start Quiz (POST /quiz/:quizId/start)
  @Post(':quizId/start')
  @HttpCode(200)
  async startQuiz(@Param('quizId') quizId: string): Promise<void> {
    return this.quizService.getQuizBegin(quizId);
  }

  // Get Next Question (GET /quiz/:quizId/question)
  @Get(':quizId/question')
  async nextQuestion(@Param('quizId') quizId: string): Promise<IQuestionDto> {
    return this.quizService.getQuestion(quizId);
  }

  // Answer Question (POST /quiz/:quizId/question/answer)
  @Post(':quizId/question/answer')
  async answerQuestion(
    @Param('quizId') quizId: string,
    @Body() answerDto: IAnswer,
  ): Promise<IAnswerResult> {
    return this.quizService.answerQuestion(quizId, answerDto);
  }

  // Get Leaderboard (GET /quiz/:quizId/leaderboard)
  @Get(':quizId/leaderboard')
  async getLeaderBoard(@Param('quizId') quizId: string): Promise<ILeaderBoard> {
    return this.scoreService.getLeaderBoard(quizId);
  }
}
