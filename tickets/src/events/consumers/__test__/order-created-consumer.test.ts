import { OrderCreatedEvent, OrderStatus } from '@mkgittix/core';
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { OrderCreatedConsumer } from '../order-created-consumer';
import { kafkaWrapper } from '../../../kafka-wrapper';
afterEach(() => {
  jest.resetAllMocks();
});

const setup = async () => {
  // Create an instance of the listener
  const consumer = new OrderCreatedConsumer(kafkaWrapper);

  // Create and save a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  // Create the fake data event
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'asdfasdf',
    expiresAt: 'asdfasdf',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  return { consumer, ticket, data };
};

it('sets the orderId of the ticket', async () => {
  const { data, consumer, ticket } = await setup();

  await consumer.onMessage(data);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('throws an error if the ticket was not found', async () => {
  const { consumer, data } = await setup();

  const invalidTicketId = new mongoose.Types.ObjectId().toHexString();
  data.ticket.id = invalidTicketId;

  let thrownError: Error | null = null;

  try {
    await consumer.onMessage(data);
  } catch (err) {
    if (err instanceof Error) {
      thrownError = err;
    }
  }

  expect(thrownError).toBeInstanceOf(Error);
  expect(thrownError?.message).toBe('Ticket not found');
});

it('produces a ticket updated event', async () => {
  const { data, consumer } = await setup();

  await consumer.onMessage(data);

  expect(kafkaWrapper.producer.send).toHaveBeenCalled();
});
