export const useProvider = () => {
    const userSession = useSupabaseUser();
    const { addToast } = useToastService();

    const checkProvider = (provider: string) => {
        if (userSession.value.app_metadata.provider !== provider) {
            addToast(
                "error",
                `Login method ${userSession.value.app_metadata.provider}`,
                `Users using the ${userSession.value.app_metadata.provider} login method cannot perform this action.`,
                20000
            );
            return false;
        }

        return true;
    };

    return { checkProvider };
};
