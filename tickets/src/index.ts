import mongoose from 'mongoose';
import { app } from './app';
import { kafkaWrapper } from './kafka-wrapper';
import { OrderCreatedConsumer } from './events/consumers/order-created-consumer';
import { OrderCancelledConsumer } from './events/consumers/order-cancelled-consumer';

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
    throw new Error('KAFKA_CLIENT_ID is required');
  }
  try {
    kafkaWrapper.connect({
      brokers: process.env.KAFKA_BROKERS.split(','),
      clientId: process.env.KAFKA_CLIENT_ID,
    });

    process.on('SIGINT', () => kafkaWrapper.disconnect());
    process.on('SIGTERM', () => kafkaWrapper.disconnect());

    new OrderCreatedConsumer(kafkaWrapper).consume();
    new OrderCancelledConsumer(kafkaWrapper).consume();

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to mongodb!');
  } catch (error) {
    console.error(error);
  } finally {
    console.log('Disconnecting from kafka');
    kafkaWrapper.disconnect();
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!');
  });
};

start();
