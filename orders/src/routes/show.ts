import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@mkgittix/core';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';
import { param } from 'express-validator';

const router = express.Router();

router.get(
  '/api/orders/:orderId',
  requireAuth,
  [param('orderId').isMongoId()],
  validateRequest,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    res.send(order);
  }
);

export { router as showOrderRouter };
