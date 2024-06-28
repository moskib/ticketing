import { OrderCancelledEvent, Publisher, Subjects } from '@mkgittix/core';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
