import { BaseConsumer, TicketUpdatedEvent, Topics } from '@mkgittix/core';
import { ORDERS_SERVICE_QUEUE_GROUP_NAME } from './queue-group-name';
import { Ticket } from '../../models/ticket';

export class TicketUpdatedConsumer extends BaseConsumer<TicketUpdatedEvent> {
  readonly topic = Topics.TicketUpdated;
  groupId = ORDERS_SERVICE_QUEUE_GROUP_NAME;

  async onMessage(data: TicketUpdatedEvent['data']): Promise<void> {
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
  }
}
