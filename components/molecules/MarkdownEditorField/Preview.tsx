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
  borderWidth: '$1',
  borderStyle: 'solid',
  borderColor: '$slate-200',
  borderRadius: '$md',
  backgroundColor: '$slate-50',
  '& > div:first-child': {
    display: 'flex',
    alignItems: 'center',
    minHeight: '$12',
    paddingX: '$2',
    borderBottomWidth: '$1',
    borderBottomStyle: 'solid',
    borderBottomColor: '$slate-200',
  },
  '& > div:last-child': {
    padding: '$2',
    minHeight: '360px',
  },
});
