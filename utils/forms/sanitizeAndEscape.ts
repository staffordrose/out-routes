import sanitizeHtml from 'sanitize-html';

export const sanitizeAndEscape = (str: string): string => {
  return sanitizeHtml(str, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: 'escape',
  });
};
