export const subscribeRealtimeEvent = (
  websocketService: any,
  quizId: string,
  userName: string,
  callback: any
) => {
  websocketService.sendMessage({
    type: 'subscribe',
    quizId,
    userName,
  });
  websocketService.onMessage((message: any) => callback(message));
};
