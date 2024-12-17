interface IWebsocketServiceInterface {
  connect(url: string): void;

  sendMessage(data: any): void;

  onMessage(callback: (data: any) => void): void;

  close(): void;
}
