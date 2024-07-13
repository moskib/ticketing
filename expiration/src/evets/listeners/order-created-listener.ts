import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from '@mkgittix/core';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queues/expiraiton-queue';
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(
    data: OrderCreatedEvent['data'],
    msg: Message
  ): Promise<void> {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log(`Waiting ${delay} ms`);
    await expirationQueue.add(
      { orderId: data.id },
      {
        delay,
      }
    );

    msg.ack();
  }
}
