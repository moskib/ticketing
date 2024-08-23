import { BaseConsumer, OrderCreatedEvent, Topics } from '@mkgittix/core';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedProducer } from '../producers/ticket-updated-producer';
import { queueGroupName } from './queue-group-name';
import { kafkaWrapper } from '../../kafka-wrapper';

export class OrderCreatedConsumer extends BaseConsumer<OrderCreatedEvent> {
  readonly topic = Topics.OrderCreated;
  groupId = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data']): Promise<void> {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // If No ticket, throw error
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: data.id });

    //Save the ticket
    await ticket.save();

    new TicketUpdatedProducer(kafkaWrapper.producer).send({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });
  }
}
