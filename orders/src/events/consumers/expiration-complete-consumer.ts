import {
  BaseConsumer,
  ExpirationCompleteEvent,
  OrderStatus,
  Topics,
} from '@mkgittix/core';
import { Message } from 'node-nats-streaming';
import { ORDERS_SERVICE_QUEUE_GROUP_NAME } from './queue-group-name';
import { Order } from '../../models/order';
import { OrderCancelledProducer } from '../producers/order-cancelled-producer';
import { kafkaWrapper } from '../../kafka-wrapper';

export class ExpirationCompleteConsumer extends BaseConsumer<ExpirationCompleteEvent> {
  readonly topic = Topics.ExpirationComplete;
  groupId = ORDERS_SERVICE_QUEUE_GROUP_NAME;

  async onMessage(data: ExpirationCompleteEvent['data']): Promise<void> {
    const order = await Order.findById(data.orderId).populate('ticket');

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === OrderStatus.Complete) {
      console.log('order status is already complete');
      return;
    }

    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();

    new OrderCancelledProducer(kafkaWrapper.producer).send({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });
  }
}
