import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { OrderCancelledEvent } from '@mkgittix/core';
import { OrderCancelledConsumer } from '../order-cancelled-consumer';
import { kafkaWrapper } from '../../../kafka-wrapper';

const setup = async () => {
  const consumer = new OrderCancelledConsumer(kafkaWrapper);

  const orderId = new mongoose.Types.ObjectId().toHexString();

  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: 'asdf',
  });

  ticket.set({ orderId });
  await ticket.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  return { data, ticket, orderId, consumer };
};

it('updates the ticket, publishes an event, and acks the message', async () => {
  const { data, ticket, consumer } = await setup();

  await consumer.onMessage(data);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).not.toBeDefined();
});

it('publishes and event after update with the correct props', async () => {
  const { data, ticket, orderId, consumer } = await setup();

  await consumer.onMessage(data);

  const sendCB = kafkaWrapper.producer.send as jest.Mock;
  const publishedArgs = JSON.parse(sendCB.mock.calls[0][0].messages[0].value);

  expect(kafkaWrapper.producer.send).toHaveBeenCalled();
  expect(publishedArgs.id).toEqual(ticket.id);
});
