import {
  Consumer,
  ConsumerConfig,
  ConsumerRunConfig,
  ConsumerSubscribeTopics,
  Kafka,
  KafkaConfig,
  Producer,
} from 'kafkajs';

export class KafkaWrapper {
  private _client?: Kafka;
  private _producer?: Producer;
  private _consumers: Consumer[] = [];

  get client() {
    if (!this._client) {
      throw new Error('Cannot access kafka without connecting first');
    }
    return this._client;
  }

  get producer() {
    if (!this._producer) {
      throw new Error('Cannot access kafka without connecting first');
    }
    return this._producer;
  }

  async connect(config: KafkaConfig) {
    this._client = new Kafka(config);
    this._producer = this._client.producer();
    console.info('Connecting to Kafka...');
    await this._producer.connect();
    console.info('connected to kafka! ');
  }

  async createConsumer({
    consumerConfig,
    subsciption,
    runConfig,
  }: {
    consumerConfig: ConsumerConfig;
    subsciption: ConsumerSubscribeTopics;
    runConfig: ConsumerRunConfig;
  }) {
    const consumer = this.client.consumer(consumerConfig);
    console.info('Connecting consumer to topics...');
    await consumer.connect();
    await consumer.subscribe(subsciption);
    console.info('Now consuming: ', subsciption.topics);
    await consumer.run(runConfig);
    this._consumers.push(consumer);
    return consumer;
  }

  async disconnect() {
    if (this._producer) {
      this._producer.disconnect();
    }
    for (const consumer of this._consumers) {
      await consumer.disconnect();
    }
  }
}

export const kafkaWrapper = new KafkaWrapper();
