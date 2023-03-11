export const trimFeatureSymbolCode = (symbol?: string): string | undefined => {
  // remove 'maki-' from string
  return symbol?.includes('maki-') ? symbol.slice(5) : symbol;
};
