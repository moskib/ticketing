import nats from 'node-nats-streaming';
import { TicketcreatedPublisher } from './events/ticket-created-publisher';

console.clear();

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('publisher connected to NATS');

  const publisher = new TicketcreatedPublisher(stan);

  try {
    await publisher.publish({
      id: '123',
      title: 'concert',
      price: 20,
    });
  } catch (error) {
    console.log('here');
  }
});
