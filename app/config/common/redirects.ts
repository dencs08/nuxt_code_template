// config/redirect.config.ts
export default {
  onPasswordChange: () => "update-password",
  onGeneralRedirect: () => "index",
  onEmailRequestChange: () => "dashboard/account/confirm-email-change",
};
