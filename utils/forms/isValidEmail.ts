// Regexp from: https://stackoverflow.com/questions/52456065/how-to-format-and-validate-email-node-js

const regexp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const isValidEmail = (str: string): boolean => {
  return regexp.test(str);
};
