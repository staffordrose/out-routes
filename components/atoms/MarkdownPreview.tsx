import { FC } from 'react';
import ReactMarkdown from 'react-markdown';

import { styled } from '@/styles';

export type MarkdownPreviewProps = {
  markdown: string;
};

export const MarkdownPreview: FC<MarkdownPreviewProps> = ({ markdown }) => {
  return (
    <StyledMarkdownPreview>
      <ReactMarkdown
        components={{
          h1: 'h3',
          h2: 'h4',
          h3: 'h5',
          h4: 'h6',
          h5: 'h6',
          h6: 'h6',
        }}
      >
        {markdown}
      </ReactMarkdown>
    </StyledMarkdownPreview>
  );
};

const StyledMarkdownPreview = styled('div', {
  width: '$full',
  '& > ul': {
    paddingLeft: '$5',
  },
  '& > ol': {
    paddingLeft: '$5',
  },
  '& > p > code': {
    paddingX: '$1',
    paddingY: '$0_5',
    borderRadius: '$sm',
    backgroundColor: '$slate-100',
  },
  '& > pre:has(code)': {
    paddingX: '$2',
    paddingY: '$1',
    borderRadius: '$sm',
    backgroundColor: '$slate-100',
  },
});
