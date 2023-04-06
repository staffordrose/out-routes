import { FC, useState } from 'react';
import {
  UseFieldArrayMove,
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import {
  BiCheck,
  BiDotsVerticalRounded,
  BiDownArrowAlt,
  BiEditAlt,
  BiTrash,
  BiUpArrowAlt,
} from 'react-icons/bi';

import {
  Button,
  Dialog,
  DropdownMenu,
  Flex,
  IconButton,
  TruncatedText,
} from '@/components/atoms';
import { colorCodes, ColorNames } from '@/data/general';
import { SymbolCodes, symbolIcons } from '@/data/routes';
import { styled } from '@/styles';
import { MapLayer } from '@/types/maps';
import { LayerValues, RouteFormValues } from '../../../../../helpers';
import { LayerEdit } from './LayerEdit';

type LayerDetailsProps = {
  move: UseFieldArrayMove;
  remove: UseFieldArrayRemove;
  update: UseFieldArrayUpdate<RouteFormValues, 'layers'>;
  setActiveLayerId: (id: MapLayer['id'] | null) => void;
  layersCount: number;
  layerIndex: number;
  closePopup: () => void;
  isLayerFeaturesReordering: boolean;
  toggleLayerFeaturesReordering: (layerId: LayerValues['databaseId']) => void;
};

export const LayerDetails: FC<LayerDetailsProps> = ({
  move,
  remove,
  update,
  setActiveLayerId,
  layersCount,
  layerIndex,
  closePopup,
  isLayerFeaturesReordering,
  toggleLayerFeaturesReordering,
}) => {
  const { control } = useFormContext<RouteFormValues>();

  const layer = useWatch({
    control,
    name: `layers.${layerIndex}`,
  });

  const featuresLength =
    (Array.isArray(layer.features) && layer.features.length) || 0;

  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const SymbolIcon =
    symbolIcons[(layer.symbol || SymbolCodes.Marker) as SymbolCodes];

  return (
    <>
      <Dialog
        maxWidth='sm'
        isOpen={isEditDialogOpen}
        setOpen={setEditDialogOpen}
        title='Edit Section'
        body={
          <LayerEdit update={update} layerIndex={layerIndex} layer={layer} />
        }
      />
      <Dialog
        maxWidth='sm'
        isOpen={isDeleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        title='Delete section?'
        body={
          <Flex direction='column' gap='md'>
            <p>
              This section has {featuresLength || ''} feature
              {featuresLength === 1 ? '' : 's'}. Are you sure you want to delete
              it?
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
                  closePopup();
                }}
              >
                Yes, Delete It
              </Button>
            </Flex>
          </Flex>
        }
      />
      <StyledLayerDetails>
        <div>
          <SymbolIcon
            style={{
              fill: layer.color
                ? colorCodes[layer.color as ColorNames]
                : undefined,
            }}
          />
          <TruncatedText as='h4'>
            {layer.title || '[Untitled section]'}
          </TruncatedText>
        </div>
        <div>
          {isLayerFeaturesReordering ? (
            <IconButton
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => {
                toggleLayerFeaturesReordering(layer.databaseId);
              }}
            >
              <BiCheck />
            </IconButton>
          ) : (
            <DropdownMenu
              items={[
                <DropdownMenu.Item
                  key='edit-layer'
                  size='sm'
                  aria-label='Open modal to edit the section'
                  onSelect={() => {
                    closePopup();
                    setEditDialogOpen(!isEditDialogOpen);
                  }}
                >
                  <BiEditAlt />
                  <span>Edit Section</span>
                </DropdownMenu.Item>,
                <DropdownMenu.Separator key='edit-separator' />,
                <DropdownMenu.Item
                  key='move-layer-up'
                  size='sm'
                  disabled={layerIndex === 0}
                  onSelect={() => {
                    move(layerIndex, layerIndex - 1);
                  }}
                >
                  <BiUpArrowAlt />
                  <span>Move Section Up</span>
                </DropdownMenu.Item>,
                <DropdownMenu.Item
                  key='move-layer-down'
                  size='sm'
                  disabled={layerIndex === layersCount - 1}
                  onSelect={() => {
                    move(layerIndex, layerIndex + 1);
                  }}
                >
                  <BiDownArrowAlt />
                  <span>Move Section Down</span>
                </DropdownMenu.Item>,
                <DropdownMenu.Separator key='delete-separator' />,
                <DropdownMenu.Item
                  key='delete-layer'
                  size='sm'
                  colorScheme='red'
                  aria-label='Open modal to delete the section'
                  onSelect={() => {
                    // if layer has features, open dialog, otherwise delete
                    if (
                      Array.isArray(layer.features) &&
                      layer.features.length
                    ) {
                      setDeleteDialogOpen(!isDeleteDialogOpen);
                    } else {
                      remove(layerIndex);
                      setActiveLayerId(null);
                    }
                  }}
                >
                  <BiTrash />
                  <span>Delete Section</span>
                </DropdownMenu.Item>,
              ]}
            >
              <IconButton type='button' variant='ghost' size='sm'>
                <BiDotsVerticalRounded />
              </IconButton>
            </DropdownMenu>
          )}
        </div>
      </StyledLayerDetails>
    </>
  );
};

const StyledLayerDetails = styled('div', {
  position: 'sticky',
  zIndex: 10,
  top: 0,
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
