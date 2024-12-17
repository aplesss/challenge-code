interface ImportMetaEnv {
  readonly VITE_CHALLENGE_WEBSOCKET_URL: string;
  readonly VITE_CHALLENGE_API_URL?: string;
  readonly VITE_NODE_ENV?: 'development' | 'production' | 'test';
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
