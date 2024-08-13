import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'test',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'test-group' });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received message: ${message.value?.toString()}`);
    },
  });
};

run().catch(console.error);

process.on('SIGINT', async () => {
  await consumer.disconnect();
});
process.on('SIGTERM', async () => {
  await consumer.disconnect();
});
