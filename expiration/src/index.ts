import { OrderCreatedConsumer } from './events/consumers/order-created-consumer';
import { kafkaWrapper } from './kafka-wrapper';

const start = async () => {
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

    new OrderCreatedConsumer(kafkaWrapper).consume();

    process.on('SIGINT', () => kafkaWrapper.disconnect());
    process.on('SIGTERM', () => kafkaWrapper.disconnect());
  } catch (error) {
    console.error(error);
    kafkaWrapper.disconnect();
  }
};

start();
