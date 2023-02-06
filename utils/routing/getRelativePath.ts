export const getRelativePath = (path?: string): string => {
  return path?.replace(process.env.NEXT_PUBLIC_NEXTAUTH_URL || '', '') || '/';
};
