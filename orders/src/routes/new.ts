import { requireAuth, validateRequest } from '@mkgittix/core';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';

const router = express.Router();

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .isMongoId()
      .withMessage('TicketId must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    res.send({});
  }
);

export { router as newOrderRouter };
