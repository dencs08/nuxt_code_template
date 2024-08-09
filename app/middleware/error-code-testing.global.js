// This middleware is used to test error handling in the application.
// This will navigate to the /home route and trigger a 500 Internal Server Error.
// URL: http://localhost:3000/home?errorCode=500

export default defineNuxtRouteMiddleware(async (to, from) => {
  const errorCode = to.query.errorCode;
  if (errorCode) {
    throw createError({ statusCode: parseInt(errorCode) });
  }
});
