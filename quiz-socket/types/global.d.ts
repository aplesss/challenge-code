// File global.d.ts
declare global {
    interface IRealtimeEvent {
      type: string;
      payload: any;
    }
    interface ISubscriptionEvent {
      type: 'subscribe' | 'unsubscribe';
      quizId: string;
      userName: string;
    }
  }
  
  export {};