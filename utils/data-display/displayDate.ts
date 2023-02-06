type Options = {
  dateStyle?: 'short';
  timeStyle?: 'short';
};

export const displayDate = (date: Date | string, options?: Options): string => {
  const { dateStyle = 'short', timeStyle = 'short' } = options || {};

  return new Intl.DateTimeFormat('en-US', {
    dateStyle,
    timeStyle,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }).format(new Date(date));
};
