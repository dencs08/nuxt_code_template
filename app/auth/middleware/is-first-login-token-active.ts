// middleware/check-reset-token.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.server) return;
  try {
    const response = await $fetch("/api/v1/auth/is-first-login-token-active");
    if (!response.data.exists) {
      return navigateTo("/login");
    }
  } catch (error) {
    console.error("Failed to check reset token:", error);
    throw error;
  }
});
