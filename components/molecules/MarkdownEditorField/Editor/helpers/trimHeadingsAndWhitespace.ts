const trimHeadings = (str: string) => {
  switch (true) {
    case str.startsWith('# '):
      return str.substring(2);
    case str.startsWith('## '):
      return str.substring(3);
    case str.startsWith('### '):
      return str.substring(4);
    default:
      return str;
  }
};

export const trimHeadingsAndWhitespace = (str: string) => {
  return trimHeadings(str).trim();
};
