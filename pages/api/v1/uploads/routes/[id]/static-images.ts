import fs from 'fs';
import type {
  NextApiHandler,
  NextApiRequest,
  NextApiResponse,
} from 'next/types';
import { unstable_getServerSession } from 'next-auth';
import formidable from 'formidable';

import { MemberRoles, memberRoles } from '@/data/routes';
import {
  deleteRouteStaticImages,
  uploadRouteStaticImages,
} from '@/lib/v1/uploads';
import { getAuthRouteMemberRoleById, getUserIdOrThrow } from '@/lib/v1/user';
import { RouteStaticImageUrls, StaticImageNames } from '@/types/routes';
import {
  allowApiMethods,
  catchApiResponse,
  getQueryParam,
  StatusError,
} from '@/utils';
import { authOptions } from '../../../../auth/[...nextauth]';

const FORMIDABLE_CONFIG = {
  allowEmptyFiles: false,
  keepExtensions: false,
  maxFields: 0,
  maxFiles: 5,
  maxFileSize: 8_000_000,
};

type PostResponse = NextApiResponse<RouteStaticImageUrls> | void;
type DeleteResponse = NextApiResponse<void> | void;

const handler: NextApiHandler = async (
  req,
  res
): Promise<PostResponse | DeleteResponse> => {
  allowApiMethods(req, res, ['POST', 'DELETE']);

  switch (req.method) {
    case 'DELETE':
      return (await deleteHandler(req, res)) as DeleteResponse;
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

// POST: route static images
const createHandler: NextApiHandler = async (
  req,
  res
): Promise<PostResponse> => {
  const id = getQueryParam(req.query, 'id');

  try {
    const { files } = await formidablePromise(req, FORMIDABLE_CONFIG);

    const { og, card_banner, thumb_360, thumb_240, thumb_120 } = files;

    // get each image buffer individually
    const ogBuffer = (og as formidable.File).filepath
      ? fs.readFileSync((og as formidable.File).filepath)
      : null;
    const cardBannerBuffer = (card_banner as formidable.File).filepath
      ? fs.readFileSync((card_banner as formidable.File).filepath)
      : null;
    const thumb360Buffer = (thumb_360 as formidable.File).filepath
      ? fs.readFileSync((thumb_360 as formidable.File).filepath)
      : null;
    const thumb240Buffer = (thumb_240 as formidable.File).filepath
      ? fs.readFileSync((thumb_240 as formidable.File).filepath)
      : null;
    const thumb120Buffer = (thumb_120 as formidable.File).filepath
      ? fs.readFileSync((thumb_120 as formidable.File).filepath)
      : null;

    // throw an error if any required image is missing
    if (!ogBuffer) {
      throw new StatusError(400, `og file attachment is missing`);
    }
    if (!cardBannerBuffer) {
      throw new StatusError(400, `card_banner file attachment is missing`);
    }
    if (!thumb360Buffer) {
      throw new StatusError(400, `thumb_360 file attachment is missing`);
    }
    if (!thumb240Buffer) {
      throw new StatusError(400, `thumb_240 file attachment is missing`);
    }
    if (!thumb120Buffer) {
      throw new StatusError(400, `thumb_120 file attachment is missing`);
    }

    const session = await unstable_getServerSession(req, res, authOptions);

    // auth required
    const authUserId = await getUserIdOrThrow(
      session,
      `You must be signed in to upload route static images`
    );

    const authRouteMemberRole = await getAuthRouteMemberRoleById(
      authUserId,
      id
    );

    // only admins & moderators can upload route static images
    if (
      ![memberRoles.admin, memberRoles.moderator].includes(
        authRouteMemberRole as MemberRoles
      )
    ) {
      throw new StatusError(
        403,
        `You don't have the required permissions to change the route static images`
      );
    }

    const staticImageUrls = await uploadRouteStaticImages(id, [
      {
        name: StaticImageNames.OG,
        width: 1200,
        height: 630,
        content: ogBuffer,
      },
      {
        name: StaticImageNames.CARD_BANNER,
        width: 320,
        height: 180,
        content: cardBannerBuffer,
      },
      {
        name: StaticImageNames.THUMB_360,
        width: 360,
        height: 360,
        content: thumb360Buffer,
      },
      {
        name: StaticImageNames.THUMB_240,
        width: 240,
        height: 240,
        content: thumb240Buffer,
      },
      {
        name: StaticImageNames.THUMB_120,
        width: 120,
        height: 120,
        content: thumb120Buffer,
      },
    ]);

    return res.status(200).json(staticImageUrls);
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong uploading the route static images`
    );
  }
};

// DELETE: route static images
const deleteHandler: NextApiHandler = async (
  req,
  res
): Promise<DeleteResponse> => {
  const id = getQueryParam(req.query, 'id');

  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    // auth required
    const authUserId = await getUserIdOrThrow(
      session,
      `You must be signed in to delete route static images`
    );

    const authRouteMemberRole = await getAuthRouteMemberRoleById(
      authUserId,
      id
    );

    // only admins & moderators can upload route static images
    if (
      ![memberRoles.admin, memberRoles.moderator].includes(
        authRouteMemberRole as MemberRoles
      )
    ) {
      throw new StatusError(
        403,
        `You don't have the required permissions to change the route static images`
      );
    }

    await deleteRouteStaticImages(id);

    return res.status(200).json({});
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong attempting to delete the route static images`
    );
  }
};
