import User from "../models/user.model.js";
import stripe from "../utils/stripe.js";
import mongoose from "mongoose";

export const createSubscription = async (req, res) => {
  try {
    const { email, priceId } = req.body;

    if (!email || !priceId) {
      return res.status(400).json({
        message: "email and priceId required"
      });
    }

    // Creates a Stripe Checkout Session:
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], //Only allow card payments. 
      mode: "subscription", //Tells Stripe this is a recurring subscription.
      customer_email: email, //Pre-fills Stripe checkout with the customer’s email.
      line_items: [
        {
          price: priceId, // The plan/price ID from Stripe.
          quantity: 1, //Subscribing to 1 unit of this plan.
        },
      ],
      success_url: "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/cancel",
    });

    res.json({ url: session.url }); //Sends the Stripe checkout URL back to the frontend so the user can complete payment. 

  } catch (error) {
    console.log("Stripe error:", error);
    res.status(500).json({ error: error.message });
  }
};
// webhooks
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  console.log("sig", sig);
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // payment success
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("Webhook event:", event.type);
    console.log("Full session:", JSON.stringify(session, null, 2));
    console.log("MongoDB connection state:", mongoose.connection.readyState); // 0=disconnected, 1=connecting, 2=connected

    const email = session.customer_email || session.customer_details?.email;
    const subscriptionId = session.subscription;

    if (!email) {
      console.log("Webhook checkout.session.completed missing email", {
        sessionId: session.id,
        customer_email: session.customer_email,
        customer_details: session.customer_details,
      });
    } else if (!subscriptionId) {
      console.log("Webhook checkout.session.completed missing subscriptionId", {
        sessionId: session.id,
        subscription: session.subscription,
      });
    } else {
      try {
        const user = await User.findOneAndUpdate(
          { email },
          {
            subscriptionId,
            isSubscribed: true,
          },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
          }
        );
        console.log("User updated/created successfully:", user);
      } catch (dbError) {
        console.error("Database error during user upsert:", dbError);
      }
    }
  }

  
  // subscription cancelled
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;
    console.log("Subscription deleted:", subscription.id);

    try {
      await User.findOneAndUpdate(
        { subscriptionId: subscription.id },
        { isSubscribed: false }
      );
      console.log("User subscription status updated to false");
    } catch (dbError) {
      console.error("Database error during subscription delete update:", dbError);
    }
  }

  res.json({ received: true });
};




// Sir, my internal viva is on 15th. Can you please grant leave on that day?