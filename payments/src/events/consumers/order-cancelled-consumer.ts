import {
  BaseConsumer,
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
  Topics,
} from '@mkgittix/core';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCancelledConsumer extends BaseConsumer<OrderCancelledEvent> {
  readonly topic = Topics.OrderCancelled;
  groupId = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data']): Promise<void> {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Cancelled });

    await order.save();
  }
}
