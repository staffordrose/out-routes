export const getFullLine = (str: string, start: number) => {
  const arr = str.split('\n');
  const lines = arr.reduce<{ startIndex: number; content: string }[]>(
    (accum, curr, index) => {
      if (index === 0) {
        accum.push({ startIndex: 0, content: curr });
      } else {
        accum.push({
          startIndex: 1 + accum[index - 1].startIndex + arr[index - 1].length,
          content: curr,
        });
      }

      return accum;
    },
    []
  );

  const reversedLines = Array.from(lines).reverse();

  return reversedLines.find((line) => start >= line.startIndex) || lines[0];
};
