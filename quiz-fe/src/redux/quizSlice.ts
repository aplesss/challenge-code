import { createSlice } from '@reduxjs/toolkit';

export interface QuizState {
  quiz: IQuiz | null;
  leaderboard: IUserScores | null;
  question: IQuestion | null;
  loading: boolean;
  error: string | null;
}

const initialState: QuizState = {
  quiz: null,
  leaderboard: null,
  question: null,
  loading: false,
  error: null,
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
});

export const { resetError } = quizSlice.actions;

export default quizSlice.reducer;
