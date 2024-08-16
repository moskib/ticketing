import { Topics } from './topics';

export interface TicketCreatedEvent {
  topic: Topics.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}
