// services/userService.ts
import { type User } from "../utils/types";

export const fetchPublicUserSession = async () => {
    const client = useSupabaseClient();
    const userAuthSession = useSupabaseUser();
    if (!userAuthSession.value) {
        return null;
    }
    try {
        const { data: user } = (await client
            .from("users")
            .select(`*, user_roles!inner(role)`)
            .eq("id", userAuthSession.value.id)
            .single()) as { data: User | null };
        if (user) {
            user.role = user.user_roles.role;
            delete user.user_roles;
            user.provider = userAuthSession.value.app_metadata.provider;
        }
        return user;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw error;
        }
    }
};
