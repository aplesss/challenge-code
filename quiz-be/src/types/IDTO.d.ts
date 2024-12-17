export interface IRealtimeEventDto<T> {
  type: string;
  payload: T;
}

export interface IBaseEventDto {
  eventType: string;
  userId?: string;
  quizId?: string;
  score?: any;
  participants?: string[];
}
export interface IJoinUs {
  quizId: string;
  userName: string;
}
