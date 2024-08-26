import { TicketCreatedEvent } from '@mkgittix/core';
import { TicketCreatedConsumer } from '../ticket-created-consumer';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { kafkaWrapper } from '../../../kafka-wrapper';

const setup = async () => {
  // create an instance of the consumer
  const consumer = new TicketCreatedConsumer(kafkaWrapper);

  // create a fake data event
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  return { consumer, data };
};

it('creates and saves aticket', async () => {
  const { data, consumer } = await setup();

  // call the onMessage function with the data object + message object
  await consumer.onMessage(data);

  // write assertions to make sure a ticket was created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});
