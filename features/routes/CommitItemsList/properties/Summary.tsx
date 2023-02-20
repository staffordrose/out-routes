import { FC, useMemo } from 'react';

const MAX_ROWS = 6;

type SummaryProps = {
  summary?: string | null;
};

export const Summary: FC<SummaryProps> = ({ summary }) => {
  const rows = useMemo(() => summary?.split('\n'), [summary]);

  if (!summary || !Array.isArray(rows)) return null;

  return (
    <div>
      {rows.slice(0, MAX_ROWS).map((row, i) => {
        return (
          <p key={i} style={{ minHeight: 8 }}>
            {row || '\t'}
          </p>
        );
      })}
      {rows.length > MAX_ROWS && (
        <p>
          ...{rows.length - MAX_ROWS} more row
          {rows.length - MAX_ROWS === 1 ? `` : `s`}
        </p>
      )}
    </div>
  );
};
