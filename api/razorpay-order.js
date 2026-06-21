/* global process, Buffer */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { amount, currency } = req.body;

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId.includes('YOUR_') || keySecret.includes('YOUR_')) {
      console.warn(
        'Razorpay API keys are not configured. Returning simulated order ID for development testing.',
      );
      // Return a simulated order ID for development testing
      const mockOrderId = `order_${Math.random().toString(36).substring(2, 17)}`;
      return res.status(200).json({
        id: mockOrderId,
        entity: 'order',
        amount: amount || 49900,
        amount_paid: 0,
        amount_due: amount || 49900,
        currency: currency || 'INR',
        receipt: 'receipt_sheet_automation',
        status: 'created',
        attempts: 0,
        notes: [],
        created_at: Math.floor(Date.now() / 1000),
      });
    }

    // Call Razorpay API to create order
    const authString = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify({
        amount: amount || 49900,
        currency: currency || 'INR',
        receipt: 'receipt_sheet_automation',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Razorpay API error response:', errorText);
      return res.status(response.status).json({ error: 'Failed to create order with Razorpay' });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in razorpay-order API route:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
