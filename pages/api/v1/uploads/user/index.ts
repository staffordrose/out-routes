import { Writable } from 'stream';
import type {
  NextApiHandler,
  NextApiRequest,
  NextApiResponse,
} from 'next/types';
import { unstable_getServerSession } from 'next-auth';
import formidable from 'formidable';

import { deleteProfileImage, uploadProfileImage } from '@/lib/v1/uploads';
import { getUserIdOrThrow, getUserPropertiesOrThrow } from '@/lib/v1/user';
import { allowApiMethods, catchApiResponse, StatusError } from '@/utils';
import { authOptions } from '../../../auth/[...nextauth]';

const FORMIDABLE_CONFIG = {
  allowEmptyFiles: false,
  keepExtensions: false,
  maxFields: 0,
  maxFiles: 1,
  maxFileSize: 4_000_000,
};

type SharedResponse = NextApiResponse<object> | void;

const handler: NextApiHandler = async (req, res): Promise<SharedResponse> => {
  allowApiMethods(req, res, ['POST', 'DELETE']);

  switch (req.method) {
    case 'DELETE':
      return (await deleteHandler(req, res)) as SharedResponse;
    case 'POST':
    default:
      return (await createHandler(req, res)) as SharedResponse;
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;

const formidablePromise = (
  req: NextApiRequest,
  opts?: Parameters<typeof formidable>[0]
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise((accept, reject) => {
    const form = formidable(opts);

    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      return accept({ fields, files });
    });
  });
};

const fileConsumer = <T = unknown>(acc: T[]) => {
  const writable = new Writable({
    write: (chunk, _enc, next) => {
      acc.push(chunk);
      next();
    },
  });

  return writable;
};

// POST: profile image
const createHandler: NextApiHandler = async (
  req,
  res
): Promise<SharedResponse> => {
  try {
    const chunks: never[] = [];

    const { files } = await formidablePromise(req, {
      ...FORMIDABLE_CONFIG,
      fileWriteStreamHandler: () => fileConsumer(chunks),
    });

    const { file } = files;

    // file was not sent
    if (!(file as formidable.File).filepath) {
      throw new StatusError(400, `File attachment is missing`);
    }

    const rawData = Buffer.concat(chunks);

    const session = await unstable_getServerSession(req, res, authOptions);

    // auth required
    const authUserId = await getUserIdOrThrow(
      session,
      `You must be signed in to upload a profile image`
    );

    await uploadProfileImage(authUserId, rawData);

    return res.status(200).json({});
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong uploading the image`
    );
  }
};

// DELETE: profile image
const deleteHandler: NextApiHandler = async (
  req,
  res
): Promise<SharedResponse> => {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    // auth required
    const authUser = await getUserPropertiesOrThrow(
      session,
      ['image_full'],
      `You must be signed in to delete your profile image`
    );

    await deleteProfileImage(authUser);

    return res.status(200).json({});
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong attempting to delete the image`
    );
  }
};
