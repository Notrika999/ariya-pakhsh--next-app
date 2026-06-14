export const mobileRegex = /^09\d{9}$/;

export const validateMobile = (mobile: string) => {
  return mobileRegex.test(mobile.trim());
};