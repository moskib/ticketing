import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { Listener, Subjects, TicketCreatedEvent } from '@mkgittix/core';
import { ORDERS_SERVICE_QUEUE_GROUP_NAME } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = ORDERS_SERVICE_QUEUE_GROUP_NAME; // needs to be consistent over time

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;
    const ticket = Ticket.build({
      id,
      title,
      price,
    });

    await ticket.save();

    msg.ack();
  }
}
