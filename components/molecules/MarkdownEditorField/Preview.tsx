import { FC } from 'react';

import { MarkdownPreview, Text } from '@/components/atoms';
import { styled } from '@/styles';

export type PreviewProps = {
  value: string;
};

export const Preview: FC<PreviewProps> = ({ value }) => {
  return (
    <StyledPreview>
      <div>
        <Text fontWeight='medium'>Summary Preview</Text>
      </div>
      <MarkdownPreview markdown={value} />
    </StyledPreview>
  );
};

const StyledPreview = styled('div', {
  minHeight: '360px',
  borderWidth: '$2',
  borderStyle: 'solid',
  borderColor: '$slate-50',
  borderRadius: '$md',
  backgroundColor: '$slate-50',
  '& > div:first-child': {
    display: 'flex',
    alignItems: 'center',
    minHeight: '$12',
    paddingX: '$2',
    borderBottomWidth: '$2',
    borderBottomStyle: 'solid',
    borderBottomColor: '$slate-100',
  },
  '& > div:last-child': {
    padding: '$2',
  },
});
