import { BaseProducer, TicketCreatedEvent, Topics } from '@mkgittix/core';

export class TicketCreatedProducer extends BaseProducer<TicketCreatedEvent> {
  readonly topic = Topics.TicketCreated;
}
