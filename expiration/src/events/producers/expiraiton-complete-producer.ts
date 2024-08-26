import { BaseProducer, ExpirationCompleteEvent, Topics } from '@mkgittix/core';

export class ExpirationCompleteConsumer extends BaseProducer<ExpirationCompleteEvent> {
  readonly topic = Topics.ExpirationComplete;
}
