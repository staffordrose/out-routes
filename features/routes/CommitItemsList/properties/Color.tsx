import { FC } from 'react';

import { Flex } from '@/components/atoms';
import { ColorCodes, colorLabels } from '@/data/general';
import { styled } from '@/styles';

type ColorProps = {
  color?: string | null;
};

export const Color: FC<ColorProps> = ({ color }) => {
  if (!color) return null;
  return (
    <Flex alignItems='center'>
      <ColorBox
        style={{
          backgroundColor: color,
        }}
      />
      <span>{colorLabels[color as ColorCodes]}</span>
    </Flex>
  );
};

const ColorBox = styled('div', {
  width: '$3',
  height: '$3',
  marginRight: '$1',
  borderRadius: '$sm',
});
