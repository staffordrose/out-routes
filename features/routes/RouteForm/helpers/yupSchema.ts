import * as yup from 'yup';

export const yupFeatureSchema = yup.object({
  databaseId: yup.string(),
  files: yup.array().of(yup.mixed().required()),
  type: yup.string().required(),
  coordinates: yup.array().of(
    yup.object({
      lat: yup.string().required(),
      lng: yup.string().required(),
      ele: yup.string(),
    })
  ),
  title: yup.string().max(60, `Can't be longer than 60 characters`),
  color: yup.string().nullable(),
  symbol: yup.string().nullable(),
  description: yup.string().max(280, `Can't be longer than 280 characters`),
  distance: yup.number(),
  area: yup.number(),
  image_id: yup.string().nullable(),
  image_full: yup.string().nullable(),
  image_large: yup.string().nullable(),
  image_card_banner: yup.string().nullable(),
  image_thumb_360: yup.string().nullable(),
  image_thumb_240: yup.string().nullable(),
  image_thumb_120: yup.string().nullable(),
});

export const yupLayerSchema = yup.object({
  databaseId: yup.string(),
  title: yup.string().max(60, `Can't be longer than 60 characters`),
  color: yup.string().required(),
  symbol: yup.string().required(),
  features: yup.array().of(yupFeatureSchema),
});

export const yupRouteSchema = yup.object({
  files: yup.array().of(yup.mixed().required()),
  id: yup.string(),
  owner: yup.object({
    id: yup.string(),
    username: yup.string(),
  }),
  is_private: yup.string().required(),
  title: yup
    .string()
    .max(60, `Can't be longer than 60 characters`)
    .required(`Title is required`),
  title_alt: yup
    .array()
    .of(
      yup.object({
        text: yup
          .string()
          .max(60, `Can't be longer than 60 characters`)
          .required(),
      })
    )
    .max(3, 'Only three alternate names are allowed'),
  activity_type: yup.string().required(`Activity type is required`),
  region: yup.string(),
  country: yup.string().required(`Country is required`),
  summary: yup.string(),
  image_id: yup.string().nullable(),
  image_full: yup.string().nullable(),
  image_og: yup.string().nullable(),
  image_banner: yup.string().nullable(),
  image_card_banner: yup.string().nullable(),
  image_thumb_360: yup.string().nullable(),
  image_thumb_240: yup.string().nullable(),
  image_thumb_120: yup.string().nullable(),
});

export const yupSchema = yup.object({
  route: yupRouteSchema,
  layers: yup.array().of(yupLayerSchema),
  activeLayerId: yup.string().nullable(),
});
