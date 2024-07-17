// config/turnstile.ts

export default {
  siteKey: process.env.NUXT_TURNSTILE_SECRET_KEY,
  addValidateEndpoint: true,
  hidebadge: true,
};
