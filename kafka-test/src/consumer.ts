import { TicketCreatedConsumer } from './events/ticket-created-consumer';
import { kafkaWrapper } from './kafka-wrapper';

const run = async () => {
  await kafkaWrapper.connect({
    clientId: 'test',
    brokers: ['localhost:9092'],
  });

  const ticketCreatedConsumer = new TicketCreatedConsumer(kafkaWrapper);
  await ticketCreatedConsumer.consume();
};

run().catch(console.error);

process.on('SIGINT', async () => {
  await kafkaWrapper.disconnect();
});
process.on('SIGTERM', async () => {
  await kafkaWrapper.disconnect();
});
