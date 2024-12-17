import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosInstance } from '../../utils/axiosInstance';

const axiosBaseQuery = ({
  url,
  method,
  data,
}: {
  url: string;
  method: string;
  data?: any;
}) => {
  return axiosInstance({
    url,
    method,
    data,
  })
    .then((response) => ({ data: response.data }))
    .catch((error) => ({
      error: { message: error.response?.data?.message || 'An error occurred' },
    }));
};

export const api = createApi({
  reducerPath: 'quizApi',
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    signIn: builder.mutation<void, ISignInRequest>({
      query: (data) => ({
        url: 'quiz/sign-in',
        method: 'POST',
        data,
      }),
    }),
    getLeaderBoard: builder.query<IUserScores, string>({
      query: (quizId) => ({
        url: `api/quiz/${quizId}/leaderboard`,
        method: 'GET',
      }),
    }),
    getQuiz: builder.query<IQuiz, string>({
      query: (quizId) => ({
        url: `api/quiz/${quizId}`,
        method: 'GET',
      }),
    }),
    startQuiz: builder.mutation<boolean, string>({
      query: (quizId) => ({
        url: `api/quiz/${quizId}/start`,
        method: 'POST',
      }),
    }),
    getQuestion: builder.query<IQuestion, string>({
      query: (quizId) => ({
        url: `api/quiz/${quizId}/question`,
        method: 'GET',
      }),
    }),
    answerQuestion: builder.mutation<
      IAnswerResult,
      { quizId: string; answer: IAnswer }
    >({
      query: ({ quizId, answer }) => ({
        url: `api/quiz/${quizId}/question/answer`,
        method: 'POST',
        data: answer,
      }),
    }),
  }),
});

export const {
  useSignInMutation,
  useGetLeaderBoardQuery,
  useGetQuizQuery,
  useStartQuizMutation,
  useGetQuestionQuery,
  useAnswerQuestionMutation,
  useLazyGetLeaderBoardQuery,
  useLazyGetQuizQuery,
  useLazyGetQuestionQuery,
} = api;
