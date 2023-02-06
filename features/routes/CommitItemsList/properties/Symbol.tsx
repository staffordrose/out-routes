import { FC } from 'react';

import { Flex } from '@/components/atoms';
import { SymbolCodes, symbolIcons, symbolLabels } from '@/data/routes';

type SymbolProps = {
  symbol?: string | null;
};

export const Symbol: FC<SymbolProps> = ({ symbol }) => {
  if (!symbol) return null;

  const SymbolIcon = symbolIcons[symbol as SymbolCodes];

  return (
    <Flex alignItems='center'>
      {SymbolIcon ? <SymbolIcon /> : ``}
      <span>{symbolLabels[symbol as SymbolCodes]}</span>
    </Flex>
  );
};
