import Queeu from 'bull';
import { ExpirationCompleteConsumer } from '../events/producers/expiraiton-complete-producer';
import { kafkaWrapper } from '../kafka-wrapper';

interface Payload {
  orderId: string;
}

const expirationQueue = new Queeu<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  new ExpirationCompleteConsumer(kafkaWrapper.producer).send({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
