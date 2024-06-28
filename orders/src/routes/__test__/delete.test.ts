import request from 'supertest';
import { Ticket } from '../../models/ticket';
import { app } from '../../app';
import { OrderStatus } from '@mkgittix/core';

it('marks an order as cancelled', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });

  await ticket.save();

  const user = global.signin();

  // make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  // ensure order is cancelled
  const response = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send();

  expect(response.body.status).toBe(OrderStatus.Cancelled);
});

it.todo('should emit order cancelled event');
