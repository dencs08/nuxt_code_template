import { type Severity } from "@/utils/types";

export enum ConfirmationGroup {
  Changes = "changes",
  PasswordConfirm = "password",
  Popup = "popup",
  // Add other groups as needed. Remember to also create new Confirm component in the GlobalComponents component
}

interface ConfirmationOptions {
  message: string;
  header: string;
  icon?: string;
  acceptClass?: string;
  iconClass?: string;
  target?: HTMLElement;
  severity?: Severity;
  showToastOnAccept?: boolean;
  showToastOnReject?: boolean;
}

// Default options
const defaultOptions: ConfirmationOptions = {
  message: "Are you sure?",
  header: "Confirmation Required",
  icon: "pi pi-exclamation-triangle",
  showToastOnAccept: true,
  showToastOnReject: true,
};

function getSeverityOptions(
  severity: Severity = "info"
): Partial<ConfirmationOptions> {
  switch (severity) {
    case "warn":
      return {
        icon: "pi pi-exclamation-circle",
        acceptClass:
          "!bg-yellow-500 hover:!bg-yellow-600 !border-yellow-500 dark:!border-yellow-500",
        iconClass: "text-yellow-700 dark:text-yellow-500",
      };
    case "error":
      return {
        icon: "pi pi-times-circle",
        acceptClass:
          "!bg-red-500 hover:!bg-red-600 !border-red-500 dark:!border-red-500",
        iconClass: "text-red-600 dark:text-red-500",
      };
    case "success":
      return {
        icon: "pi pi-check-circle",
        acceptClass:
          "!bg-green-500 hover:!bg-green-600 !border-green-500 dark:!border-green-500",
        iconClass: "text-green-700 dark:text-green-500",
      };
    case "info":
    default:
      return {
        icon: "pi pi-info-circle",
        acceptClass:
          "!bg-blue-500 hover:!bg-blue-600 !border-blue-500 dark:!border-blue-500",
        iconClass: "text-blue-700 dark:text-blue-500",
      };
  }
}

export function useConfirmation() {
  const confirm = useConfirm();
  const { addToast } = useToastService();

  const confirmAction = (
    action: () => void,
    options: Partial<ConfirmationOptions> = {},
    group: ConfirmationGroup = ConfirmationGroup.Popup
  ) => {
    const severityOptions = getSeverityOptions(options.severity);
    const finalOptions = { ...defaultOptions, ...severityOptions, ...options };
    confirm.require({
      ...finalOptions,
      group,
      accept: () => {
        action();
        if (finalOptions.showToastOnAccept) {
          addToast("success", "Success", "Successfully completed action", 3000);
        }
      },
      reject: () => {
        if (finalOptions.showToastOnReject) {
          addToast("warn", "Cancelled", "Action cancelled", 3000);
        }
      },
    });
  };

  return { confirmAction };
}
