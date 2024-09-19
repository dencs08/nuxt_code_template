export type MethodConfig = {
  auth: boolean;
  accessLevel?: number;
};
export type RouteConfig = {
  [method: string]: MethodConfig;
};

export const routeConfigs: Record<string, RouteConfig> = {
  "/api/**": {
    "*": { auth: true, accessLevel: 100 },
  },
  "/api/v1/me/**": {
    "*": { auth: true, accessLevel: 0 },
  },
  "/api/v1/me": {
    "*": { auth: true, accessLevel: 0 },
  },
  "/api/v1/roles": {
    GET: { auth: false, accessLevel: 0 },
    PATCH: { auth: true, accessLevel: 75 },
  },
  "/api/v1/users": {
    GET: { auth: true, accessLevel: 10 },
    PATCH: { auth: true, accessLevel: 75 },
    PUT: { auth: true, accessLevel: 75 },
    POST: { auth: true, accessLevel: 75 },
  },
  "/api/v1/newsletter": {
    GET: { auth: true, accessLevel: 75 },
    POST: { auth: false, accessLevel: 0 },
  },
  "/api/v1/analytics/page-views": {
    POST: { auth: false, accessLevel: 0 },
  },
  "/api/v1/mail/mjml/render": {
    POST: { auth: true, accessLevel: 25 },
  },

  //don't touch this line
  "/api/_content/**": {
    "*": { auth: false, accessLevel: 0 },
  },
};
