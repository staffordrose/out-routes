import { FC } from 'react';

import { routeLayerActions } from '@/data/routes';
import { RouteLayerCommitItem as RouteLayerCommitItemT } from '@/types/commits';
import { Color, Order, Quotes, Symbol } from './properties';
import { CommitItem, Row } from './shared';

export const RouteLayerCommitItem: FC<RouteLayerCommitItemT> = ({
  action,
  payload,
}) => {
  const { prev, next } = payload;

  switch (action) {
    case routeLayerActions.add_route_layer: {
      return (
        <CommitItem
          type='add'
          name='Add Section'
          nextChildren={
            <div>
              <Row name='Order'>
                <Order order={next?.order} />
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
            </div>
          }
        />
      );
    }
    case routeLayerActions.remove_route_layer:
      return (
        <CommitItem
          type='remove'
          name='Remove Section'
          prevChildren={
            <div>
              <Row name='Order'>
                <Order order={prev?.order} />
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
            </div>
          }
        />
      );
    case routeLayerActions.update_layer_order:
      return (
        <CommitItem
          type='update'
          name='Order'
          prevChildren={<Order order={prev?.order} />}
          nextChildren={<Order order={next?.order} />}
        />
      );
    case routeLayerActions.add_layer_title:
      return (
        <CommitItem
          type='add'
          name='Title'
          nextChildren={<Quotes text={next?.title} />}
        />
      );
    case routeLayerActions.update_layer_title:
      return (
        <CommitItem
          type='update'
          name='Title'
          prevChildren={<Quotes text={prev?.title} />}
          nextChildren={<Quotes text={next?.title} />}
        />
      );
    case routeLayerActions.remove_layer_title:
      return (
        <CommitItem
          type='remove'
          name='Title'
          prevChildren={<Quotes text={prev?.title} />}
        />
      );
    case routeLayerActions.add_layer_color:
      return (
        <CommitItem
          type='add'
          name='Color'
          nextChildren={<Color color={next?.color} />}
        />
      );
    case routeLayerActions.update_layer_color:
      return (
        <CommitItem
          type='update'
          name='Color'
          prevChildren={<Color color={prev?.color} />}
          nextChildren={<Color color={next?.color} />}
        />
      );
    case routeLayerActions.remove_layer_color:
      return (
        <CommitItem
          type='remove'
          name='Color'
          prevChildren={<Color color={prev?.color} />}
        />
      );
    case routeLayerActions.add_layer_symbol:
      return (
        <CommitItem
          type='add'
          name='Symbol'
          nextChildren={<Symbol symbol={next?.symbol} />}
        />
      );
    case routeLayerActions.update_layer_symbol:
      return (
        <CommitItem
          type='update'
          name='Symbol'
          prevChildren={<Symbol symbol={prev?.symbol} />}
          nextChildren={<Symbol symbol={next?.symbol} />}
        />
      );
    case routeLayerActions.remove_layer_symbol:
      return (
        <CommitItem
          type='remove'
          name='Symbol'
          prevChildren={<Symbol symbol={prev?.symbol} />}
        />
      );
    default:
      return null;
  }
};
