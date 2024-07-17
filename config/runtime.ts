// config/runtime.ts

export default {
  public: {
    global_route_access: process.env.GLOBAL_ROUTE_ACCESS,
    apiBase: process.env.BASE_API_URL,
    authProvider: process.env.AUTH_PROVIDER,
    backendProvider: process.env.BACKEND_PROVIDER,
  },
};
