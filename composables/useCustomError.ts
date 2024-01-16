export class CustomError extends Error {
    value: any;

    constructor(message: string, value: any) {
        super(message);
        this.value = value;
    }
}

export function useCustomError(): { CustomError: typeof CustomError } {
    return { CustomError };
}
