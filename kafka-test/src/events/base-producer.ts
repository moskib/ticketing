import { Producer } from 'kafkajs';
import { Topics } from './topics';

interface Event {
  topic: Topics;
  data: any;
}

export abstract class BaseProducer<T extends Event> {
  abstract topic: T['topic'];
  private _producer: Producer;

  constructor(producer: Producer) {
    this._producer = producer;
  }

  async send(data: T['data']): Promise<void> {
    await this._producer.send({
      topic: this.topic,
      messages: [{ value: JSON.stringify(data) }],
    });
  }
}
