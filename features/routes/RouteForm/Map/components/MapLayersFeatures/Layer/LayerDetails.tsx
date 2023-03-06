import { FC, useState } from 'react';
import { UseFieldArrayRemove, useFormContext, useWatch } from 'react-hook-form';
import { BiTrash, BiEditAlt, BiX } from 'react-icons/bi';

import {
  Button,
  Dialog,
  Flex,
  IconButton,
  TruncatedText,
} from '@/components/atoms';
import { SymbolCodes, symbolIcons } from '@/data/routes';
import { styled } from '@/styles';
import { MapLayer } from '@/types';
import { RouteFormValues } from '../../../../helpers';

type LayerDetailsProps = {
  remove: UseFieldArrayRemove;
  setActiveLayerId: (id: MapLayer['id'] | null) => void;
  layerIndex: number;
  isFieldsVisible: boolean;
  toggleFieldsVisibility: () => void;
};

export const LayerDetails: FC<LayerDetailsProps> = ({
  remove,
  setActiveLayerId,
  layerIndex,
  isFieldsVisible,
  toggleFieldsVisibility,
}) => {
  const { control } = useFormContext<RouteFormValues>();

  const layer = useWatch({
    control,
    name: `layers.${layerIndex}`,
  });

  const [isDialogOpen, setDialogOpen] = useState(false);

  const SymbolIcon =
    symbolIcons[(layer.symbol || SymbolCodes.Marker) as SymbolCodes];

  return (
    <StyledLayerDetails>
      <div>
        <SymbolIcon
          style={{
            fill: layer.color || undefined,
          }}
        />
        <TruncatedText as='h4' lineClamp={1}>
          {layer.title || '[Untitled section]'}
        </TruncatedText>
      </div>
      <div>
        {!isFieldsVisible && (
          <Dialog
            isOpen={isDialogOpen}
            setOpen={setDialogOpen}
            title='Delete section?'
            body={
              <Flex direction='column' gap='md'>
                <p>
                  Are you sure you want to delete this section and its features?
                </p>
                <Flex justifyContent='end'>
                  <Button
                    variant='solid'
                    colorScheme='red'
                    size='lg'
                    onClick={(e) => {
                      e.stopPropagation();

                      remove(layerIndex);
                      setActiveLayerId(null);
                    }}
                  >
                    Yes, Delete It
                  </Button>
                </Flex>
              </Flex>
            }
          >
            <IconButton
              type='button'
              variant='ghost'
              size='xs'
              aria-label='Open modal to delete the section'
            >
              <BiTrash />
            </IconButton>
          </Dialog>
        )}
        <IconButton
          type='button'
          variant='ghost'
          size='xs'
          onClick={toggleFieldsVisibility}
        >
          {isFieldsVisible ? <BiX /> : <BiEditAlt />}
        </IconButton>
      </div>
    </StyledLayerDetails>
  );
};

const StyledLayerDetails = styled('div', {
  position: 'sticky',
  zIndex: 10,
  top: '$14',
  display: 'flex',
  gap: '$1',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '$full',
  minHeight: '$12',
  paddingLeft: '$5',
  paddingRight: '$2',
  borderBottomWidth: '$1',
  borderBottomStyle: 'solid',
  borderBottomColor: '$slate-300',
  backgroundColor: '$white',
  '& > div:first-child': {
    display: 'flex',
    gap: '$0_5',
    alignItems: 'center',
    '& > svg': {
      flexShrink: 0,
      width: '$7',
      height: '$7',
    },
  },
  '& > div:last-child': {
    display: 'flex',
    gap: '$1',
    alignItems: 'center',
  },
});
