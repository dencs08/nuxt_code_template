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
    PATCH: { auth: true, accessLevel: 9999 }, //disable possibility of changing roles
    POST: { auth: true, accessLevel: 9999 }, //disable possibility of changing roles
    PUT: { auth: true, accessLevel: 9999 }, //disable possibility of changing roles
  },
  "/api/v1/permissions": {
    GET: { auth: true, accessLevel: 0 },
    PUT: { auth: true, accessLevel: 75 },
    POST: { auth: true, accessLevel: 75 },
  },
  "/api/v1/users": {
    GET: { auth: true, accessLevel: 10 },
    PATCH: { auth: true, accessLevel: 75 },
    PUT: { auth: true, accessLevel: 75 },
    POST: { auth: true, accessLevel: 75 },
  },
  "/api/v1/users/**": {
    GET: { auth: true, accessLevel: 10 },
    PATCH: { auth: true, accessLevel: 75 },
    PUT: { auth: true, accessLevel: 75 },
    POST: { auth: true, accessLevel: 75 },
  },
  "/api/v1/users/role": {
    POST: { auth: true, accessLevel: 75 },
  },
  "/api/v1/users/ban": {
    POST: { auth: true, accessLevel: 75 },
  },
  "/api/v1/newsletter": {
    GET: { auth: true, accessLevel: 75 },
    POST: { auth: false, accessLevel: 0 },
  },
  "/api/v1/mail/mjml/render": {
    POST: { auth: true, accessLevel: 25 },
  },
  "/api/v1/mail/mjml": {
    POST: { auth: true, accessLevel: 25 },
  },
  "/api/v1/upload": {
    POST: { auth: true, accessLevel: 0 },
    DELETE: { auth: true, accessLevel: 0 },
  },
  "/api/v1/analytics": {
    GET: { auth: true, accessLevel: 5 },
  },
  "/api/v1/analytics/**": {
    GET: { auth: true, accessLevel: 5 },
  },
  "/api/v1/auth/confirm-email": {
    POST: { auth: true, accessLevel: 0 },
  },
  "/api/v1/auth/is-first-login-token-active": {
    GET: { auth: true, accessLevel: 0 },
  },
  "/api/v1/auth/is-password-reset-token-active": {
    GET: { auth: true, accessLevel: 0 },
  },
  "/api/v1/invalidate-cache": {
    POST: { auth: true, accessLevel: 75 },
  },

  //publicy available
  "/api/v1/validate-captcha": {
    POST: { auth: false, accessLevel: 0 },
  },
  "/api/v1/analytics/page-views": {
    POST: { auth: false, accessLevel: 0 },
  },
  "/api/_content/**": {
    "*": { auth: false, accessLevel: 0 },
  },
};
