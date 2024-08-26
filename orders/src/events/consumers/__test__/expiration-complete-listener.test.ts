import mongoose from 'mongoose';
import { Order, OrderStatus } from '../../../models/order';
import { Ticket } from '../../../models/ticket';
import { ExpirationCompleteConsumer } from '../expiration-complete-consumer';
import { ExpirationCompleteEvent } from '@mkgittix/core';
import { kafkaWrapper } from '../../../kafka-wrapper';

const setup = async () => {
  const consumer = new ExpirationCompleteConsumer(kafkaWrapper);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'asdf',
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  return { consumer, order, ticket, data };
};

it('updates the order status to cancelled', async () => {
  const { consumer, order, data } = await setup();

  await consumer.onMessage(data);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emit an OrderCancelled event', async () => {
  const { consumer, order, data } = await setup();

  await consumer.onMessage(data);

  expect(kafkaWrapper.producer.send).toHaveBeenCalled();

  const eventData = JSON.parse(
    (kafkaWrapper.producer.send as jest.Mock).mock.calls[0][0].messages[0].value
  );

  expect(eventData.id).toEqual(order.id);
});
