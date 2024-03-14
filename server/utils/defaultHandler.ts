import type { EventHandler, EventHandlerRequest, H3Event } from 'h3'
import { serverSupabaseUser } from "#supabase/server";

type ExtendedEventHandler<T extends EventHandlerRequest, D> = (event: H3Event<T>, userSession: any) => Promise<D>;

export const defineWrappedResponseHandler = <T extends EventHandlerRequest, D> (
    handler: ExtendedEventHandler<T, D>,
    minRole?: string
): EventHandler<T, D> =>
    defineEventHandler<T>(async event => {
        try {
            const userSession = await serverSupabaseUser(event)

            if (minRole) {
                await checkUserRole(event, minRole);
            }

            const response = await handler(event, userSession)
            return { response }
        } catch (err: any) {
            throw createError({
                statusCode: err.statusCode || 500,
                statusMessage: err.statusMessage
            })
        }
    });