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
        }}
        disallowedElements={['h4', 'h5', 'h6', 'img']}
      >
        {markdown}
      </ReactMarkdown>
    </StyledMarkdownPreview>
  );
};

const StyledMarkdownPreview = styled('div', {
  width: '$full',
  '& h3, h4, h5': {
    marginTop: '$4',
    marginBottom: '$4',
    borderBottomWidth: '$1',
    borderBottomStyle: 'solid',
    borderBottomColor: '$slate-200',
  },
  '& > p': {
    marginBottom: '$4',
  },
  '& blockquote': {
    position: 'relative',
    marginBottom: '$4',
    padding: '$2',
    paddingLeft: '$3_5',
    backgroundColor: '$slate-100',
    '&::before': {
      content: '',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '$1_5',
      height: '$full',
      backgroundColor: '$slate-400',
    },
  },
  '& ul': {
    paddingLeft: '$5',
    marginBottom: '$4',
  },
  '& ol': {
    paddingLeft: '$5',
    marginBottom: '$4',
  },
  '&:not(pre) code': {
    paddingX: '$1',
    paddingY: '$0_5',
    borderRadius: '$sm',
    backgroundColor: '$slate-200',
  },
  '& pre:has(code)': {
    marginBottom: '$4',
    padding: '$2',
    borderRadius: '$sm',
    backgroundColor: '$slate-200',
  },
});
