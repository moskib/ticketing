import { BaseConsumer, OrderCreatedEvent, Topics } from '@mkgittix/core';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCreatedConsumer extends BaseConsumer<OrderCreatedEvent> {
  readonly topic = Topics.OrderCreated;
  groupId = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data']): Promise<void> {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });

    await order.save();
  }
}
