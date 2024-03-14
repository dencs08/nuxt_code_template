export function useAccount() {
    const { CustomError } = useCustomError();

    const deleteAccount = async () => {
        try {
            const { error } = (await $fetch("/api/me", {
                method: "DELETE",
            })) as { error?: any };
            if (error) {
                throw new CustomError("Error deleting the account", error);
            }
        } catch (error) {
            // console.error(error);
            throw new CustomError("Failed to delete the account", error);
        }
    };

    const confirmEmailChange = async () => {
        try {
            const { data, error } = (await $fetch("/api/auth/confirm-email", {method: "POST"})) as {
                data?: any;
                error?: any;
            };
            if (error) {
                throw new CustomError("Error occured during confirmation", error);
            }

            return data;
        } catch (error) {
            console.error(error);
            throw new CustomError("Error occured during confirmation", error);
        }
    };
    return { deleteAccount, confirmEmailChange };
}
