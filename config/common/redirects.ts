// config/redirect.config.ts
export default {
  onPasswordChange: () => "/auth/update-password",
  onGeneralRedirect: () => "index",
  welcomePage: () => "/auth/welcome",
};
