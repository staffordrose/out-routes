export const readFile = (file: File): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const loader = new FileReader();
    loader.onload = () => {
      resolve(loader.result);
    };
    loader.onerror = reject;
    loader.readAsText(file);
  });
};
