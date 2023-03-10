import { Writable } from 'stream';
import type {
  NextApiHandler,
  NextApiRequest,
  NextApiResponse,
} from 'next/types';
import { unstable_getServerSession } from 'next-auth';
import formidable from 'formidable';

import { MemberRoles, memberRoles } from '@/data/routes';
import { getRouteIdByFeatureId } from '@/lib/v1/routes';
import { uploadFeatureImage } from '@/lib/v1/uploads';
import { getAuthRouteMemberRoleById, getUserIdOrThrow } from '@/lib/v1/user';
import { RouteFeatureImageIdUrls } from '@/types/routes';
import {
  allowApiMethods,
  catchApiResponse,
  getQueryParam,
  StatusError,
} from '@/utils';
import { authOptions } from '../../../auth/[...nextauth]';

const FORMIDABLE_CONFIG = {
  allowEmptyFiles: false,
  keepExtensions: false,
  maxFields: 0,
  maxFiles: 1,
  maxFileSize: 8_000_000,
};

type PostResponse = NextApiResponse<RouteFeatureImageIdUrls> | void;

const handler: NextApiHandler = async (req, res): Promise<PostResponse> => {
  allowApiMethods(req, res, ['POST']);

  switch (req.method) {
    case 'POST':
    default:
      return (await createHandler(req, res)) as PostResponse;
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

// POST: feature image
const createHandler: NextApiHandler = async (
  req,
  res
): Promise<PostResponse> => {
  const id = getQueryParam(req.query, 'id');

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
      `You must be signed in to upload an image`
    );

    const routeId = await getRouteIdByFeatureId(id);

    const authRouteMemberRole = await getAuthRouteMemberRoleById(
      authUserId,
      routeId
    );

    // only admins & moderators can upload route images
    if (
      ![memberRoles.admin, memberRoles.moderator].includes(
        authRouteMemberRole as MemberRoles
      )
    ) {
      throw new StatusError(
        403,
        `You don't have the required permissions to change the route image`
      );
    }

    const imageIdAndUrls = await uploadFeatureImage(id, rawData);

    return res.status(200).json(imageIdAndUrls);
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong uploading the image`
    );
  }
};
