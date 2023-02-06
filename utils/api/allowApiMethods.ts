import { NextApiRequest, NextApiResponse } from 'next/types';

export const allowApiMethods = (
  req: NextApiRequest,
  res: NextApiResponse,
  allowedMethods: NextApiRequest['method'][]
): void => {
  if (!allowedMethods.length) {
    return res
      .status(501)
      .json({ message: `No methods have been implemented for this route` });
  } else if (!allowedMethods.includes(req.method || '')) {
    return res
      .status(405)
      .json({ message: `Only ${allowedMethods.join(', ')} requests allowed` });
  }
};
