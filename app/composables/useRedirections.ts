import redirects from "~~/config/common/redirects";

export const useRedirections = () => {
  const passwordChangePage = () => redirects.onPasswordChange();
  const generalPage = () => redirects.onGeneralRedirect();
  const emailRequestChangePage = () => redirects.onEmailRequestChange();

  return {
    passwordChangePage,
    generalPage,
    emailRequestChangePage,
  };
};
