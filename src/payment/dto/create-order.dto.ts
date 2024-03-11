import { OrderItem } from '../entity/order-item.entity';

export type CreateOrderDto = {
  userId: string;
  orderItems: OrderItem[];
  couponId?: string;
  pointAmountToUse?: number;
  shippingAddress?: string;
};
