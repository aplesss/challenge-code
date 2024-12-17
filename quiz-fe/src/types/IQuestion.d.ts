interface IQuestion {
  quizId: number;
  questionId: number;
  questionType: string;
  questionText: string;
  options: IOption[];
  duration: number;
  isFinished: boolean;
}

interface IOption {
  optionId: number;
  optionText: string;
}
