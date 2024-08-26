import { BaseProducer, OrderCancelledEvent, Topics } from '@mkgittix/core';

export class OrderCancelledProducer extends BaseProducer<OrderCancelledEvent> {
  readonly topic = Topics.OrderCancelled;
}
