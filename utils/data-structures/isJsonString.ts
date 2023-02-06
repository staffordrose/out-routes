// https://stackoverflow.com/questions/3710204/how-to-check-if-a-string-is-a-valid-json-string

export const isJsonString = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};
