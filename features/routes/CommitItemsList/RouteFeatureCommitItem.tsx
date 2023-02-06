import { FC } from 'react';

import { GeometryTypes, routeFeatureActions } from '@/data/routes';
import { RouteFeatureCommitItem as RouteFeatureCommitItemT } from '@/types';
import {
  Area,
  Color,
  Coordinates,
  Distance,
  Elevation,
  GeometryType,
  Image,
  Order,
  Quotes,
  Symbol,
} from './properties';
import { CommitItem, Row } from './shared';

export const RouteFeatureCommitItem: FC<RouteFeatureCommitItemT> = ({
  action,
  payload,
}) => {
  const { prev, next } = payload;

  switch (action) {
    case routeFeatureActions.add_route_feature: {
      const type = next?.type;

      return (
        <CommitItem
          type='add'
          name='Add Feature'
          nextChildren={
            <div>
              <Row name='Order'>
                <Order order={next?.order} />
              </Row>
              <Row name='Type'>
                <GeometryType type={type} />
              </Row>
              <Row name='Coordinates'>
                <Coordinates type={type} coordinates={next?.coordinates} />
              </Row>
              <Row name='Title'>
                <Quotes text={next?.title} />
              </Row>
              <Row name='Color'>
                <Color color={next?.color} />
              </Row>
              <Row name='Symbol'>
                <Symbol symbol={next?.symbol} />
              </Row>
              <Row name='Description'>
                <Quotes text={next?.description} />
              </Row>
              {type === GeometryTypes.Point ? (
                <Row name='Elevation'>
                  <Elevation ele={next?.ele_start} />
                </Row>
              ) : type === GeometryTypes.LineString ? (
                <Row name='Start Elevation'>
                  <Elevation ele={next?.ele_start} />
                </Row>
              ) : null}
              {type === GeometryTypes.LineString && (
                <Row name='End Elevation'>
                  <Elevation ele={next?.ele_end} />
                </Row>
              )}
              {type === GeometryTypes.LineString && (
                <Row name='Distance'>
                  <Distance distance={next?.distance} />
                </Row>
              )}
              {type === GeometryTypes.Polygon && (
                <Row name='Area'>
                  <Area area={next?.area} />
                </Row>
              )}
              <Row name='Image'>
                <Image src={next?.image_thumb_240} alt='New feature image' />
              </Row>
            </div>
          }
        />
      );
    }
    case routeFeatureActions.remove_route_feature: {
      const type = prev?.type;

      return (
        <CommitItem
          type='remove'
          name='Remove Feature'
          prevChildren={
            <div>
              <Row name='Order'>
                <Order order={prev?.order} />
              </Row>
              <Row name='Type'>
                <GeometryType type={type} />
              </Row>
              <Row name='Coordinates'>
                <Coordinates type={type} coordinates={prev?.coordinates} />
              </Row>
              <Row name='Title'>
                <Quotes text={prev?.title} />
              </Row>
              <Row name='Color'>
                <Color color={prev?.color} />
              </Row>
              <Row name='Symbol'>
                <Symbol symbol={prev?.symbol} />
              </Row>
              <Row name='Description'>
                <Quotes text={prev?.description} />
              </Row>
              {type === GeometryTypes.Point ? (
                <Row name='Elevation'>
                  <Elevation ele={prev?.ele_start} />
                </Row>
              ) : type === GeometryTypes.LineString ? (
                <Row name='Start Elevation'>
                  <Elevation ele={prev?.ele_start} />
                </Row>
              ) : null}
              {type === GeometryTypes.LineString && (
                <Row name='End Elevation'>
                  <Elevation ele={prev?.ele_end} />
                </Row>
              )}
              {type === GeometryTypes.LineString && (
                <Row name='Distance'>
                  <Distance distance={prev?.distance} />
                </Row>
              )}
              {type === GeometryTypes.Polygon && (
                <Row name='Area'>
                  <Area area={prev?.area} />
                </Row>
              )}
              <Row name='Image'>
                <Image src={prev?.image_thumb_240} alt='New feature image' />
              </Row>
            </div>
          }
        />
      );
    }
    case routeFeatureActions.update_feature_layer:
      return (
        <CommitItem
          type='update'
          name='Change Layer'
          prevChildren={prev?.layer?.id} // TODO: Change id to title
          nextChildren={next?.layer?.id} // TODO: Change id to title
        />
      );
    case routeFeatureActions.update_feature_order:
      return (
        <CommitItem
          type='update'
          name='Order'
          prevChildren={<Order order={prev?.order} />}
          nextChildren={<Order order={next?.order} />}
        />
      );
    case routeFeatureActions.update_feature_type:
      return (
        <CommitItem
          type='update'
          name='Type'
          prevChildren={<GeometryType type={prev?.type} />}
          nextChildren={<GeometryType type={next?.type} />}
        />
      );
    case routeFeatureActions.add_feature_coordinates:
      return (
        <CommitItem
          type='add'
          name='Coordinates'
          nextChildren={
            <Coordinates type={next?.type} coordinates={next?.coordinates} />
          }
        />
      );
    case routeFeatureActions.update_feature_coordinates:
      return (
        <CommitItem
          type='update'
          name='Coordinates'
          prevChildren={
            <Coordinates type={prev?.type} coordinates={prev?.coordinates} />
          }
          nextChildren={
            <Coordinates type={next?.type} coordinates={next?.coordinates} />
          }
        />
      );
    case routeFeatureActions.remove_feature_coordinates:
      return (
        <CommitItem
          type='remove'
          name='Coordinates'
          prevChildren={
            <Coordinates type={prev?.type} coordinates={prev?.coordinates} />
          }
        />
      );
    case routeFeatureActions.add_feature_title:
      return (
        <CommitItem
          type='add'
          name='Title'
          nextChildren={<Quotes text={next?.title} />}
        />
      );
    case routeFeatureActions.update_feature_title:
      return (
        <CommitItem
          type='update'
          name='Title'
          prevChildren={<Quotes text={prev?.title} />}
          nextChildren={<Quotes text={next?.title} />}
        />
      );
    case routeFeatureActions.remove_feature_title:
      return (
        <CommitItem
          type='remove'
          name='Title'
          prevChildren={<Quotes text={prev?.title} />}
        />
      );
    case routeFeatureActions.add_feature_color:
      return (
        <CommitItem
          type='add'
          name='Color'
          nextChildren={<Color color={next?.color} />}
        />
      );
    case routeFeatureActions.update_feature_color:
      return (
        <CommitItem
          type='update'
          name='Color'
          prevChildren={<Color color={prev?.color} />}
          nextChildren={<Color color={next?.color} />}
        />
      );
    case routeFeatureActions.remove_feature_color:
      return (
        <CommitItem
          type='remove'
          name='Color'
          prevChildren={<Color color={prev?.color} />}
        />
      );
    case routeFeatureActions.add_feature_symbol:
      return (
        <CommitItem
          type='add'
          name='Symbol'
          nextChildren={<Symbol symbol={next?.symbol} />}
        />
      );
    case routeFeatureActions.update_feature_symbol:
      return (
        <CommitItem
          type='update'
          name='Symbol'
          prevChildren={<Symbol symbol={prev?.symbol} />}
          nextChildren={<Symbol symbol={next?.symbol} />}
        />
      );
    case routeFeatureActions.remove_feature_symbol:
      return (
        <CommitItem
          type='remove'
          name='Symbol'
          prevChildren={<Symbol symbol={prev?.symbol} />}
        />
      );
    case routeFeatureActions.add_feature_description:
      return (
        <CommitItem
          type='add'
          name='Description'
          nextChildren={<Quotes text={next?.description} />}
        />
      );
    case routeFeatureActions.update_feature_description:
      return (
        <CommitItem
          type='update'
          name='Description'
          prevChildren={<Quotes text={prev?.description} />}
          nextChildren={<Quotes text={next?.description} />}
        />
      );
    case routeFeatureActions.remove_feature_description:
      return (
        <CommitItem
          type='remove'
          name='Description'
          prevChildren={<Quotes text={prev?.description} />}
        />
      );
    case routeFeatureActions.add_feature_ele_start:
      return (
        <CommitItem
          type='add'
          name='Start Elevation'
          nextChildren={<Elevation ele={next?.ele_start} />}
        />
      );
    case routeFeatureActions.update_feature_ele_start:
      return (
        <CommitItem
          type='update'
          name='Start Elevation'
          prevChildren={<Elevation ele={prev?.ele_start} />}
          nextChildren={<Elevation ele={next?.ele_start} />}
        />
      );
    case routeFeatureActions.remove_feature_ele_start:
      return (
        <CommitItem
          type='remove'
          name='Start Elevation'
          prevChildren={<Elevation ele={prev?.ele_start} />}
        />
      );
    case routeFeatureActions.add_feature_ele_end:
      return (
        <CommitItem
          type='add'
          name='End Elevation'
          nextChildren={<Elevation ele={next?.ele_end} />}
        />
      );
    case routeFeatureActions.update_feature_ele_end:
      return (
        <CommitItem
          type='update'
          name='End Elevation'
          prevChildren={<Elevation ele={prev?.ele_end} />}
          nextChildren={<Elevation ele={next?.ele_end} />}
        />
      );
    case routeFeatureActions.remove_feature_ele_end:
      return (
        <CommitItem
          type='remove'
          name='End Elevation'
          prevChildren={<Elevation ele={prev?.ele_end} />}
        />
      );
    case routeFeatureActions.add_feature_distance:
      return (
        <CommitItem
          type='add'
          name='Distance'
          nextChildren={<Distance distance={next?.distance} />}
        />
      );
    case routeFeatureActions.update_feature_distance:
      return (
        <CommitItem
          type='update'
          name='Distance'
          prevChildren={<Distance distance={prev?.distance} />}
          nextChildren={<Distance distance={next?.distance} />}
        />
      );
    case routeFeatureActions.remove_feature_distance:
      return (
        <CommitItem
          type='remove'
          name='Distance'
          prevChildren={<Distance distance={prev?.distance} />}
        />
      );
    case routeFeatureActions.add_feature_area:
      return (
        <CommitItem
          type='add'
          name='Area'
          nextChildren={<Area area={next?.area} />}
        />
      );
    case routeFeatureActions.update_feature_area:
      return (
        <CommitItem
          type='update'
          name='Area'
          prevChildren={<Area area={prev?.area} />}
          nextChildren={<Area area={next?.area} />}
        />
      );
    case routeFeatureActions.remove_feature_area:
      return (
        <CommitItem
          type='remove'
          name='Area'
          prevChildren={<Area area={prev?.area} />}
        />
      );
    case routeFeatureActions.add_feature_image:
      return (
        <CommitItem
          type='add'
          name='Image'
          nextChildren={
            <Image src={next?.image_thumb_240} alt='New feature image' />
          }
        />
      );
    case routeFeatureActions.update_feature_image:
      return (
        <CommitItem
          type='update'
          name='Image'
          prevChildren={
            <Image src={prev?.image_thumb_240} alt='Old feature image' />
          }
          nextChildren={
            <Image src={next?.image_thumb_240} alt='New feature image' />
          }
        />
      );
    case routeFeatureActions.remove_feature_image:
      return (
        <CommitItem
          type='remove'
          name='Image'
          prevChildren={
            <Image src={prev?.image_thumb_240} alt='Old feature image' />
          }
        />
      );
    default:
      return null;
  }
};
