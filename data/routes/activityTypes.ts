// activity types
export enum ActivityTypes {
  BACKPACKING = 'backpacking',
  BIKEPACKING = 'bikepacking',
  CANYONEERING = 'canyoneering',
  CANOEING = 'canoeing',
  CLIMBING = 'climbing',
  CYCLING = 'cycling',
  FISHING = 'fishing',
  HIKING = 'hiking',
  HUNTING = 'hunting',
  KAYAKING = 'kayaking',
  OVERLANDING = 'overlanding',
  PACKRAFTING = 'packrafting',
  SAILING = 'sailing',
  SKIING = 'skiing',
}

// activity type labels
export enum ActivityTypeLabels {
  BACKPACKING = 'Backpacking',
  BIKEPACKING = 'Bikepacking',
  CANYONEERING = 'Canyoneering',
  CANOEING = 'Canoeing',
  CLIMBING = 'Climbing',
  CYCLING = 'Cycling',
  FISHING = 'Fishing',
  HIKING = 'Hiking',
  HUNTING = 'Hunting',
  KAYAKING = 'Kayaking',
  OVERLANDING = 'Overlanding',
  PACKRAFTING = 'Packrafting',
  SAILING = 'Sailing',
  SKIING = 'Skiing',
}

export const activityTypes: Record<ActivityTypes, ActivityTypeLabels> = {
  [ActivityTypes.BACKPACKING]: ActivityTypeLabels.BACKPACKING,
  [ActivityTypes.BIKEPACKING]: ActivityTypeLabels.BIKEPACKING,
  [ActivityTypes.CANYONEERING]: ActivityTypeLabels.CANYONEERING,
  [ActivityTypes.CANOEING]: ActivityTypeLabels.CANOEING,
  [ActivityTypes.CLIMBING]: ActivityTypeLabels.CLIMBING,
  [ActivityTypes.CYCLING]: ActivityTypeLabels.CYCLING,
  [ActivityTypes.FISHING]: ActivityTypeLabels.FISHING,
  [ActivityTypes.HIKING]: ActivityTypeLabels.HIKING,
  [ActivityTypes.HUNTING]: ActivityTypeLabels.HUNTING,
  [ActivityTypes.KAYAKING]: ActivityTypeLabels.KAYAKING,
  [ActivityTypes.OVERLANDING]: ActivityTypeLabels.OVERLANDING,
  [ActivityTypes.PACKRAFTING]: ActivityTypeLabels.PACKRAFTING,
  [ActivityTypes.SAILING]: ActivityTypeLabels.SAILING,
  [ActivityTypes.SKIING]: ActivityTypeLabels.SKIING,
};

export const activityTypeSelectOptions: Array<{
  value: ActivityTypes;
  label: ActivityTypeLabels;
}> = (
  Object.entries(activityTypes) as Array<[ActivityTypes, ActivityTypeLabels]>
).map((a) => ({
  value: a[0],
  label: a[1],
}));
