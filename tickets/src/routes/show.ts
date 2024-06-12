import { NotFoundError, validateRequest } from '@mkgittix/core';
import { param } from 'express-validator';
import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get(
  '/api/tickets/:id',
  param('id').isMongoId().withMessage('Needs to be a valid id'),
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    res.send(ticket);
  }
);

export { router as showTicketRouter };
