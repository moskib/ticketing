import { BaseProducer, PaymentCreatedEvent, Topics } from '@mkgittix/core';

export class PaymentCreatedProducer extends BaseProducer<PaymentCreatedEvent> {
  readonly topic = Topics.PaymentCreated;
}
