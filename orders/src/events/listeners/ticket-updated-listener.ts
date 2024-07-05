import { Listener, Subjects, TicketUpdatedEvent } from '@mkgittix/core';
import { ORDERS_SERVICE_QUEUE_GROUP_NAME } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = ORDERS_SERVICE_QUEUE_GROUP_NAME;

  async onMessage(
    data: TicketUpdatedEvent['data'],
    msg: Message
  ): Promise<void> {
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const { title, price } = data;
    ticket.set({
      title,
      price,
    });

    await ticket.save();

    msg.ack();
  }
}
