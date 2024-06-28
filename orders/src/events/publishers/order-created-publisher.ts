import { OrderCreatedEvent, Publisher, Subjects } from '@mkgittix/core';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
