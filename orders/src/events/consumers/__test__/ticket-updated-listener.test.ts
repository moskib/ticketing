import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { TicketUpdatedConsumer } from '../ticket-updated-consumer';
import { TicketUpdatedEvent } from '@mkgittix/core';
import { kafkaWrapper } from '../../../kafka-wrapper';

const setup = async () => {
  // Create a consumer
  const consumer = new TicketUpdatedConsumer(kafkaWrapper);

  // Create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // Create a fake data object
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'new concert',
    price: 999,
    userId: 'asdlfkj',
  };

  return { data, ticket, consumer };
};

it('finds, updates, and saves a ticket', async () => {
  const { consumer, data, ticket } = await setup();

  await consumer.onMessage(data);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('does not call ack if the event has a skipped version number', async () => {
  const { data, consumer } = await setup();

  data.version = 10;

  let error;

  try {
    await consumer.onMessage(data);
  } catch (err) {
    error = err;
  }

  expect(error).toBeDefined();
  expect(error).toBeInstanceOf(Error);
});
