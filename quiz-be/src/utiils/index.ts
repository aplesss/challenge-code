import {
  JOIN_US_TOPIC_KAFKA,
  QUIZ_TOPIC_KAFKA,
  SCORE_TOPIC_KAFKA,
} from 'src/const';
import { IBaseEventDto, IRealtimeEventDto } from 'src/types/IDTO';

export const CreateQuizStartEvent = (
  id: string,
): IRealtimeEventDto<IBaseEventDto> => {
  return {
    type: QUIZ_TOPIC_KAFKA,
    payload: {
      eventType: QUIZ_TOPIC_KAFKA,
      userId: id,
    },
  };
};

export const CreateScoreEvent = (
  id: string,
  score: any,
): IRealtimeEventDto<IBaseEventDto> => {
  return {
    type: QUIZ_TOPIC_KAFKA,
    payload: {
      eventType: SCORE_TOPIC_KAFKA,
      quizId: id,
      score: score,
    },
  };
};

export const CreateJoinUsEvent = (
  id: string,
  listUsers: string[],
): IRealtimeEventDto<IBaseEventDto> => {
  return {
    type: JOIN_US_TOPIC_KAFKA,
    payload: {
      eventType: JOIN_US_TOPIC_KAFKA,
      quizId: id,
      participants: listUsers,
    },
  };
};
