import type { IconType } from 'react-icons';
import {
  BiArch,
  BiBuildingHouse,
  BiDirections,
  BiMap,
  BiMapPin,
  BiWorld,
} from 'react-icons/bi';
import { MdOutlineMarkunreadMailbox } from 'react-icons/md';

import { GeocodingDataTypes } from './geocodingDataTypes';

export const geocodingDataTypeIcons: Record<GeocodingDataTypes, IconType> = {
  [GeocodingDataTypes.ADDRESS]: BiBuildingHouse,
  [GeocodingDataTypes.COUNTRY]: BiWorld,
  [GeocodingDataTypes.DISTRICT]: BiMapPin,
  [GeocodingDataTypes.LOCALITY]: BiMapPin,
  [GeocodingDataTypes.NEIGHBORHOOD]: BiDirections,
  [GeocodingDataTypes.PLACE]: BiMap,
  [GeocodingDataTypes.POI]: BiArch,
  [GeocodingDataTypes.POSTCODE]: MdOutlineMarkunreadMailbox,
  [GeocodingDataTypes.REGION]: BiMapPin,
};
