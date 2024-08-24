import mongoose from 'mongoose';
import { OrderCreatedEvent, OrderStatus } from '@mkgittix/core';
import { Order } from '../../../models/order';
import { OrderCreatedConsumer } from '../order-created-consumer';
import { kafkaWrapper } from '../../../kafka-wrapper';

const setup = async () => {
  const consumer = new OrderCreatedConsumer(kafkaWrapper);

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: 'asdf',
    status: OrderStatus.Created,
    ticket: {
      id: 'asdf',
      price: 10,
    },
    userId: 'asdf',
  };

  return { data, consumer };
};

it('replicates the order info', async () => {
  const { data, consumer } = await setup();

  await consumer.onMessage(data);

  const order = await Order.findById(data.id);

  expect(order).toBeDefined();
  expect(order?.price).toEqual(data.ticket.price);
});
