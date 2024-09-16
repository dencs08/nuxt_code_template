import { useToast } from "primevue/usetoast";
import { type Severity } from "~~/types/common";

export function useToastService() {
  const toast = useToast();

  //severity options: success, info, warn, error
  const showToast = ({
    severity,
    summary,
    detail,
    life,
  }: {
    severity: Severity;
    summary: string;
    detail?: string;
    life?: number;
  }) => {
    toast.add({ severity, summary, detail, life: life ? life : 5000 });
  };

  //old way of calling the function, now we use showToast
  const addToast = (
    severity: Severity,
    summary: string,
    detail?: string,
    life?: number
  ) => {
    toast.add({ severity, summary, detail, life: life ? life : 5000 });
  };

  return { addToast, showToast };
}
