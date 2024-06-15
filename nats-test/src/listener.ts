import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('listener connected to NATS');

  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true) // if an event is not manually acknowledged, nats will send it to another queue group
    .setDeliverAllAvailable() // redeliver all events that were delivered in the past only for the first time
    .setDurableName('accounting-service'); // if a service restarts, only send missed events

  // const subscription = stan.subscribe(
  //   'ticket:created',
  //   'orders-service-queue-group', // ensure taht two replicas of the service don't get the same message
  //   options
  // );

  const subscription = stan.subscribe(
    'ticket:created',
    'service-queue-group',
    options
  );

  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();

    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }

    msg.ack();
  });
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
