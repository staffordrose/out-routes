import * as yup from 'yup';

export const yupSchema = yup.object({
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
          .required(`Name is required`),
      })
    )
    .max(3, 'Only three alternate names are allowed'),
  activity_type: yup.string().required(`Activity type is required`),
  region: yup.string(),
  country: yup.string().required(`Country is required`),
});
