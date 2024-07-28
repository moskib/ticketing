import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
} from '@mkgittix/core';
import { Message } from 'node-nats-streaming';
import { ORDERS_SERVICE_QUEUE_GROUP_NAME } from './queue-group-name';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = ORDERS_SERVICE_QUEUE_GROUP_NAME;

  async onMessage(
    data: PaymentCreatedEvent['data'],
    msg: Message
  ): Promise<void> {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();

    msg.ack();
  }
}
