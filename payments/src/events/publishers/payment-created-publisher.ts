import { PaymentCreatedEvent, Publisher, Subjects } from '@mkgittix/core';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
