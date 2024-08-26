import { Ticket } from '../../models/ticket';
import { BaseConsumer, TicketCreatedEvent, Topics } from '@mkgittix/core';
import { ORDERS_SERVICE_QUEUE_GROUP_NAME } from './queue-group-name';

export class TicketCreatedConsumer extends BaseConsumer<TicketCreatedEvent> {
  readonly topic = Topics.TicketCreated;
  groupId = ORDERS_SERVICE_QUEUE_GROUP_NAME; // needs to be consistent over time

  async onMessage(data: TicketCreatedEvent['data']) {
    const { id, title, price } = data;
    const ticket = Ticket.build({
      id,
      title,
      price,
    });

    await ticket.save();
  }
}
