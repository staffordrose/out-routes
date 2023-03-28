import { FC } from 'react';

import { Flex, Icon } from '@/components/atoms';
import { SymbolCodes, symbolIcons, symbolLabels } from '@/data/routes';

type SymbolProps = {
  symbol?: string | null;
};

export const Symbol: FC<SymbolProps> = ({ symbol }) => {
  if (!symbol) return null;

  const SymbolIcon = symbolIcons[symbol as SymbolCodes];

  return (
    <Flex alignItems='center'>
      {SymbolIcon ? <Icon as={SymbolIcon} size='xs' /> : ``}
      <span>{symbolLabels[symbol as SymbolCodes]}</span>
    </Flex>
  );
};
