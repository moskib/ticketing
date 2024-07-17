import Stripe from 'stripe';

if (!process.env.STRIPE_KEY) {
  throw new Error('STRIPE_KEY cannot be undefined');
}

export const stripe = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: '2024-06-20',
});
