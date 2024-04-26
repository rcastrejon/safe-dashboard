/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_HOST: string;
  readonly VITE_SESSION_TOKEN_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
