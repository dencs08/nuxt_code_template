import redirects from "~~/config/common/redirects";

export const useRedirections = () => {
  const passwordChangePage = () => redirects.onPasswordChange();
  const generalPage = () => redirects.onGeneralRedirect();
  const welcomePage = () => redirects.welcomePage();
  return {
    passwordChangePage,
    generalPage,
    welcomePage,
  };
};
