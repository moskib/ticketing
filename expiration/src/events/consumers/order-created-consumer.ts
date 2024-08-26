import { BaseConsumer, OrderCreatedEvent, Topics } from '@mkgittix/core';
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queues/expiraiton-queue';

export class OrderCreatedConsumer extends BaseConsumer<OrderCreatedEvent> {
  readonly topic = Topics.OrderCreated;
  groupId = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data']): Promise<void> {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log(`Waiting ${delay} ms`);
    await expirationQueue.add(
      { orderId: data.id },
      {
        delay,
      }
    );
  }
}
