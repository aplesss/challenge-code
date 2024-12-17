import { OPTIONS_TYPE } from 'src/const';

export interface IOptionDto {
  optionId: string;
  optionText: string;
  isCorrect: boolean;
}
export interface IAnswer {
  userName: string;
  questionId: string | number;
  optionId: string | number;
}
export interface IAnswerResultDto {
  questionId: string | number;
  correctOptionId: string | number;
  isCorrect: boolean;
}
export interface IQuestionDto {
  quizId?: number;
  questionId?: number;
  questionText?: string;
  questionType?: typeof OPTIONS_TYPE;
  options?: IOptionDto[];
  duration?: number;
  userAnswer?: IAnswerResultDto;
  isFinished: boolean;
}
// IUserScore interface
export interface IUserScore {
  userName: string;
  score: number;
}

// IAnswerResult interface
export interface IAnswerResult {
  questionId: string | number;
  correctOptionId: string | number;
  isCorrect: boolean;
}

// IOption interface
export interface IOption {
  optionId: number;
  optionText: string;
  isCorrect: boolean;
}

// ILeaderBoard interface
export interface ILeaderBoard {
  leaderboard: IUserScore[];
}

// IQuestion interface
export interface IQuestion {
  quizId: number;
  questionId: number;
  questionText: string;
  questionType: QuestionType;
  options: IOption[];
  duration: number;
  userAnswer?: IAnswerResult;
  isFinished: boolean;
}

// IQuiz interface
export interface IQuiz {
  quizId: string;
  title: string;
  description: string;
  status: QuizStatus;
  participants: string[];
}
