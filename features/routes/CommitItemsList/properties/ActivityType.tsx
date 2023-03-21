import { FC } from 'react';

import { activityTypeLabels, ActivityTypes } from '@/data/routes';

type ActivityTypeProps = {
  activity_type?: string | null;
};

export const ActivityType: FC<ActivityTypeProps> = ({ activity_type }) => {
  if (!activity_type) return null;
  return <span>{activityTypeLabels[activity_type as ActivityTypes]}</span>;
};
