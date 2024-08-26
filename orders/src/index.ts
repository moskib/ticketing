import mongoose from 'mongoose';
import { app } from './app';
import { TicketCreatedConsumer } from './events/consumers/ticket-created-consumer';
import { TicketUpdatedConsumer } from './events/consumers/ticket-updated-consumer';
import { ExpirationCompleteConsumer } from './events/consumers/expiration-complete-consumer';
import { PaymentCreatedConsumer } from './events/consumers/payment-created-consumer';
import { kafkaWrapper } from './kafka-wrapper';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  if (!process.env.KAFKA_BROKERS) {
    throw new Error('KAFKA_BROKERS is required');
  }
  if (!process.env.KAFKA_CLIENT_ID) {
    throw new Error('KAKFA_CLIENT_ID is required');
  }
  try {
    kafkaWrapper.connect({
      brokers: process.env.KAFKA_BROKERS.split(','),
      clientId: process.env.KAFKA_CLIENT_ID,
    });

    process.on('SIGINT', () => kafkaWrapper.disconnect());
    process.on('SIGTERM', () => kafkaWrapper.disconnect());

    new TicketCreatedConsumer(kafkaWrapper).consume();
    new TicketUpdatedConsumer(kafkaWrapper).consume();
    new ExpirationCompleteConsumer(kafkaWrapper).consume();
    new PaymentCreatedConsumer(kafkaWrapper).consume();

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to mongodb!');
  } catch (error) {
    console.error(error);
    kafkaWrapper.disconnect();
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!');
  });
};

start();
