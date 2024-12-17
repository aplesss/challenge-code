import { configureStore } from '@reduxjs/toolkit';
import quizReducer from './quizSlice';
import { api } from './api';

export const store = configureStore({
  reducer: {
    quiz: quizReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware), // Add RTK Query middleware
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
