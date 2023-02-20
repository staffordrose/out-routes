export enum HeadingTypes {
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
}

export type HeadingType = `${HeadingTypes}`;

export enum HeadingTypesMarkdown {
  H1 = '# ',
  H2 = '## ',
  H3 = '### ',
}

export enum StyleTypes {
  B = 'b',
  I = 'i',
}

export type StyleType = `${StyleTypes}`;

export enum StyleTypesMarkdown {
  BI = '***',
  B = '**',
  I = '*',
}
