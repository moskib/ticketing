import { kafkaWrapper } from './kafka-wrapper';
import { TicketCreatedProducer } from './events/ticket-created-producer';

const produce = async () => {
  await kafkaWrapper.connect({
    clientId: 'test',
    brokers: ['localhost:9092'], // Use localhost since you're port-forwarding
  });

  new TicketCreatedProducer(kafkaWrapper.producer).send({
    id: 'abc',
    price: 20,
    title: 'movie',
  });

  kafkaWrapper.disconnect();
};

produce().catch(console.error);

process.on('SIGINT', async () => {
  kafkaWrapper.disconnect();
});
process.on('SIGTERM', async () => {
  kafkaWrapper.disconnect();
});
