import { FC } from 'react';

type OrderProps = {
  order?: number | null;
};

export const Order: FC<OrderProps> = ({ order }) => {
  return <span>{(Number(order) || 0) + 1}</span>;
};
