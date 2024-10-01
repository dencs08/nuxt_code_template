import type { DefaultFormKitInputProps } from "@formkit/vue";

declare global {
  namespace FormKit {
    interface FormKitInputProps<T extends string = string> {
      type:
        | DefaultFormKitInputProps["type"]
        | "primeInputText"
        | "primePassword"
        | "primeSelect"
        | T;
    }
  }
}

export {};
