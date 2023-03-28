import * as yup from 'yup';

export const yupSchema = yup.object({
  is_private: yup.string().required(),
  title: yup
    .string()
    .max(60, `Can't be longer than 60 characters`)
    .required(`Please enter a route title`),
  title_alt: yup
    .array()
    .of(
      yup.object({
        text: yup
          .string()
          .max(60, `Can't be longer than 60 characters`)
          .required(`Please enter a name`),
      })
    )
    .max(3, 'Only three alternate names are allowed'),
  activity_type: yup.string().required(`Please select an activity type`),
  region: yup.string(),
  country: yup.string().required(`Please select a country`),
});
