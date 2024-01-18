export default defineNuxtRouteMiddleware(async (to, from) => {
    const errorCode = to.query.errorCode;
    if (errorCode) {
        throw createError({ statusCode: parseInt(errorCode) });
    }
});