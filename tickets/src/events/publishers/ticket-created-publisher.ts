import { Publisher, Subjects, TicketCreatedEvent } from '@mkgittix/core';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
