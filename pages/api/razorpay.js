import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_KEY_KEY_ID,
  key_secret: process.env.NEXT_PUBLIC_KEY_PRIVATE_KEY_ID,
});

export default function handler(req, res) {
  const { payment } = req.body;
  const options = {
    amount: payment * 100,
    currency: "INR",
    receipt: "order_rcptid_11",
  };
  razorpay.orders.create(options, (err, order) => {
    if (err) {
      res.json(err);
      return;
    }
    res.json(order);
  });
}
