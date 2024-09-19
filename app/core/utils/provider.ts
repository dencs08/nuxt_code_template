export const useProvider = () => {
  const userStore = useUserStore();
  const userSession = userStore.getUser;

  const { showToast } = useToastService();

  const checkProvider = (provider: string) => {
    if (userSession.app_metadata.provider !== provider) {
      showToast({
        severity: "error",
        summary: `Login method ${userSession.app_metadata.provider}`,
        detail: `Users using the ${userSession.app_metadata.provider} login method cannot perform this action.`,
        life: 20000,
      });
      return false;
    }

    return true;
  };

  return { checkProvider };
};
