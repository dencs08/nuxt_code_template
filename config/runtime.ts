// config/runtime.ts
import mainConfig from "./common/main";

export default {
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  public: {
    global_route_access: mainConfig.GLOBAL_ROUTE_ACCESS,
    authProvider: mainConfig.AUTH_PROVIDER,
    backendProvider: mainConfig.BACKEND_PROVIDER,
    apiBase: process.env.BASE_API_URL,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_SECURE: process.env.SMTP_SECURE,
    SMTP_FROM: process.env.SMTP_FROM,
  },
};
