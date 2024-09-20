declare global {
  interface Error {
    statusCode?: number;
    statusMessage?: string;
  }
}

export {};
