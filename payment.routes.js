import express from 'express'
import { checkPaymentStatus, confirmPayment, createPayment } from '../controller/payment.controller.js'
import { createSubscription, stripeWebhook } from '../controller/webhook.controller.js'

const paymentRouter = express.Router()

paymentRouter.post("/create-payment-intent",createPayment)
paymentRouter.get("/check-payment-status",checkPaymentStatus)
paymentRouter.post("/confirm-payment",confirmPayment)


paymentRouter.post("/create-subscription", createSubscription);

// webhook route
paymentRouter.post(
  "/webhook",
  stripeWebhook
);

export default paymentRouter