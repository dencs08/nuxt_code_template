// useError.ts
export class CustomError extends Error {
  value: any;

  constructor(message: string, value?: any) {
    super(message);
    this.value = value;
  }
}

export function useCustomError() {
  return { CustomError };
}
