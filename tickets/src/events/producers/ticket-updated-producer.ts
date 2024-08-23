import { BaseProducer, TicketUpdatedEvent, Topics } from '@mkgittix/core';

export class TicketUpdatedProducer extends BaseProducer<TicketUpdatedEvent> {
  readonly topic = Topics.TicketUpdated;
}
