/* global process */
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Graceful developer bypass if Razorpay API secret is unconfigured
    if (!keySecret || keySecret.includes('YOUR_')) {
      console.warn(
        'Razorpay secret key is not set. Permitting signature verification for development testing.',
      );
      return res
        .status(200)
        .json({ status: 'ok', verified: true, message: 'Developer simulation success' });
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature === razorpay_signature) {
      return res.status(200).json({ status: 'ok', verified: true });
    } else {
      console.warn(
        'Signature verification failed. Expected:',
        generatedSignature,
        'Received:',
        razorpay_signature,
      );
      return res.status(400).json({ error: 'Invalid payment signature verification failed' });
    }
  } catch (error) {
    console.error('Error in signature verification API endpoint:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
