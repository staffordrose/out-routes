import type { NextApiResponse } from 'next/types';

import { StatusError } from '../misc';

export const catchApiResponse = (
  res: NextApiResponse,
  error: StatusError | Error | unknown,
  fallbackMessage?: string
) => {
  if (error instanceof StatusError) {
    return res.status(error.status).json({ message: error.message });
  } else if (error instanceof Error) {
    return res.status(400).json({ message: error.message });
  } else {
    return res.status(400).json({
      message: fallbackMessage || `Something went wrong`,
    });
  }
};
