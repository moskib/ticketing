import { BaseProducer, OrderCreatedEvent, Topics } from '@mkgittix/core';

export class OrderCreatedProducer extends BaseProducer<OrderCreatedEvent> {
  readonly topic = Topics.OrderCreated;
}
