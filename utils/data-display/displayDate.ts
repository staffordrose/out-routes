type Options = {
  dateStyle?: 'short';
  timeStyle?: 'short';
  timeZone?: string;
};

export const displayDate = (date: Date | string, options?: Options): string => {
  const { dateStyle = 'short', timeStyle = 'short', timeZone } = options || {};

  return new Intl.DateTimeFormat('en-US', {
    dateStyle,
    timeStyle,
    timeZone: timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
  }).format(new Date(date));
};
