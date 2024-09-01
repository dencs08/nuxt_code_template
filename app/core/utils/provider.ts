export const useProvider = () => {
  const userStore = useUserStore();
  const userSession = userStore.getUser;

  const { addToast } = useToastService();

  const checkProvider = (provider: string) => {
    if (userSession.app_metadata.provider !== provider) {
      addToast(
        "error",
        `Login method ${userSession.app_metadata.provider}`,
        `Users using the ${userSession.app_metadata.provider} login method cannot perform this action.`,
        20000
      );
      return false;
    }

    return true;
  };

  return { checkProvider };
};
