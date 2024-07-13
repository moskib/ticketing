import { ExpirationCompleteEvent, Publisher, Subjects } from '@mkgittix/core';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
