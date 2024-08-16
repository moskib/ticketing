import { EachMessagePayload } from 'kafkajs';
import { Topics } from './topics';
import { KafkaWrapper } from '../kafka-wrapper';

interface Event {
  topic: Topics;
  data: unknown;
}

export abstract class BaseConsumer<T extends Event> {
  private _kakfaWrapper: KafkaWrapper;

  abstract topic: T['topic'];
  abstract groupId: string;
  abstract onMessage(data: T['data']): void;

  constructor(_kakfaWrapper: KafkaWrapper) {
    this._kakfaWrapper = _kakfaWrapper;
  }

  async consume() {
    await this._kakfaWrapper.createConsumer({
      consumerConfig: { groupId: this.groupId },
      runConfig: {
        eachMessage: async ({
          partition,
          topic,
          message,
        }: EachMessagePayload) => {
          console.info(`Mesage received: ${topic} / ${this.groupId}`);
          const jsonString = message.value?.toString() || '';
          const obj = JSON.parse(jsonString);
          await this.onMessage(obj);
        },
      },
      subsciption: {
        topics: [this.topic],
        fromBeginning: true,
      },
    });
  }
}
