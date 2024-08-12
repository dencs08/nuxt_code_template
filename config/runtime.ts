// config/runtime.ts
import mainConfig from "./common/main";

export default {
  public: {
    global_route_access: mainConfig.GLOBAL_ROUTE_ACCESS,
    authProvider: mainConfig.AUTH_PROVIDER,
    backendProvider: mainConfig.BACKEND_PROVIDER,
    apiBase: process.env.BASE_API_URL,
  },
};
