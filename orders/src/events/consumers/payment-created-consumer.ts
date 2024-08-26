import {
  PaymentCreatedEvent,
  OrderStatus,
  BaseConsumer,
  Topics,
} from '@mkgittix/core';
import { ORDERS_SERVICE_QUEUE_GROUP_NAME } from './queue-group-name';
import { Order } from '../../models/order';

export class PaymentCreatedConsumer extends BaseConsumer<PaymentCreatedEvent> {
  readonly topic = Topics.PaymentCreated;
  groupId = ORDERS_SERVICE_QUEUE_GROUP_NAME;

  async onMessage(data: PaymentCreatedEvent['data']): Promise<void> {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();
  }
}
