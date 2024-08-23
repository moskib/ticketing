import { BaseConsumer, OrderCancelledEvent, Topics } from '@mkgittix/core';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { kafkaWrapper } from '../../kafka-wrapper';
import { TicketUpdatedProducer } from '../producers/ticket-updated-producer';

export class OrderCancelledConsumer extends BaseConsumer<OrderCancelledEvent> {
  readonly topic = Topics.OrderCancelled;
  groupId = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data']): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ orderId: undefined });
    await ticket.save();

    await new TicketUpdatedProducer(kafkaWrapper.producer).send({
      id: ticket.id,
      orderId: ticket.orderId,
      userId: ticket.userId,
      price: ticket.price,
      title: ticket.title,
      version: ticket.version,
    });
  }
}
