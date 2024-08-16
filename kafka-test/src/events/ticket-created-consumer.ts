import { BaseConsumer } from './base-consumer';
import { TicketCreatedEvent } from './ticket-created-event';
import { Topics } from './topics';

const groupName = 'tickets';

export class TicketCreatedConsumer extends BaseConsumer<TicketCreatedEvent> {
  readonly topic = Topics.TicketCreated;
  readonly groupId = groupName;

  onMessage(data: TicketCreatedEvent['data']): void {
    console.info('received data: ', data);
  }
}
