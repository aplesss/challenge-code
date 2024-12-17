interface IAnswer {
  userName: string;
  questionId: number;
  optionId: number;
}

interface IAnswerResult {
  questionId: number;
  correctOptionId: number;
  isCorrect: boolean;
}
