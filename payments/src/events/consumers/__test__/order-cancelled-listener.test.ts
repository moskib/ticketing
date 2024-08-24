import mongoose from 'mongoose';
import { Order } from '../../../models/order';
import { OrderCancelledEvent, OrderStatus } from '@mkgittix/core';
import { OrderCancelledConsumer } from '../order-cancelled-consumer';
import { kafkaWrapper } from '../../../kafka-wrapper';

const setup = async () => {
  const consumer = new OrderCancelledConsumer(kafkaWrapper);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: 'adsf',
    version: 0,
  });

  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: 'adsf',
    },
  };

  return { consumer, data, order };
};

it('updatdes the status of the order', async () => {
  const { consumer, data, order } = await setup();

  await consumer.onMessage(data);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});
