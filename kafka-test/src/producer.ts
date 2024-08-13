import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'test',
  brokers: ['localhost:9092'], // Use localhost since you're port-forwarding
});

// const admin = kafka.admin();
const producer = kafka.producer();

const produce = async () => {
  // console.log('Connecting admin...');
  // await admin.connect();
  // console.log('Creating test-topic...');
  // const success = await admin.createTopics({
  //   topics: [
  //     {
  //       topic: 'test-topic',
  //     },
  //   ],
  // });

  // if (!success) {
  //   throw new Error('Failed to create topic');
  // }
  // console.info('Created topic successfully!');

  console.info('Connecting producer...');
  await producer.connect();
  console.info('Producer connected!');

  console.info('Sending a message...');
  await producer.send({
    topic: 'test-topic',
    messages: [{ value: 'Hello world!' }],
  });
  await producer.disconnect();
  // await admin.disconnect();
};

produce().catch(console.error);

process.on('SIGINT', async () => {
  await producer.disconnect();
  // await admin.disconnect();
});
process.on('SIGTERM', async () => {
  await producer.disconnect();
  // await admin.disconnect();
});
