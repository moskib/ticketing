import { Publisher, Subjects, TicketUpdatedEvent } from '@mkgittix/core';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
