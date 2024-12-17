export const OPTIONS_TYPE = [
  'Multiple choice',
  'True or False',
  'Short answer',
];
export enum OPTION_STATUS_ENUM {
  WAITING = 'WAITING',
  STARTED = 'STARTED',
  FINISHED = 'FINISHED',
}
export const OPTIONS_STATUS = {
  WAITING: OPTION_STATUS_ENUM.WAITING,
  STARTED: OPTION_STATUS_ENUM.STARTED,
  FINISHED: OPTION_STATUS_ENUM.FINISHED,
};

export const DEFAULT_REFERENCE_ID = 'DEFAULT';
export const QUIZ = 'quiz-';
export const QUIZ_PARTICIPANTS = 'participants-';
export const QUIZ_QUESTION = 'question-';
export const CURRENT_QUESTION = 'current-question-';
export const CURRENT_QUESTION_COUNTER = 'current-question-counter';

export const QUIZ_TOPIC_KAFKA = 'quiz-started';

export const SCORE_TOPIC_KAFKA = 'leader-board-changed';

export const JOIN_US_TOPIC_KAFKA = 'new-participant-joined';
