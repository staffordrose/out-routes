import { FC, useState } from 'react';
import { UseFieldArrayUpdate } from 'react-hook-form';

import { MapFeature, MapLayer } from '@/types';
import { RouteFormValues } from '../../../helpers';
import { PopupDetail } from './PopupDetail';
import { PopupEdit } from './PopupEdit';

type PopupProps = {
  update: UseFieldArrayUpdate<RouteFormValues, 'layers'>;
  layers: RouteFormValues['layers'];
  activeLayerId: MapLayer['id'] | null;
  feature: MapFeature;
  closePopup: () => void;
};

export const Popup: FC<PopupProps> = (props) => {
  const [view, setView] = useState('detail');

  if (view === 'edit') {
    return <PopupEdit {...props} viewFeatureDetail={() => setView('detail')} />;
  } else {
    return (
      <PopupDetail
        feature={props.feature}
        viewFeatureEdit={() => setView('edit')}
      />
    );
  }
};
