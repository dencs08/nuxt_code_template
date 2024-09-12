// middleware/check-reset-token.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.server) return;
  try {
    const data = await $fetch("/api/auth/is-password-reset-token-active");
    if (!data.response.exists) {
      return navigateTo("/login");
    }
  } catch (error) {
    console.error("Failed to check reset token:", error);
    throw error;
  }
});
