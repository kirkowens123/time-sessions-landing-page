export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // Add contact to Brevo
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        listIds: [5],
        updateEnabled: false
      })
    });

    const data = await response.json();

    if (response.ok || response.status === 400) {
      // 400 might mean contact already exists, which is fine
      return res.status(200).json({ success: true, message: 'Successfully subscribed!' });
    } else {
      throw new Error(data.message || 'Failed to subscribe');
    }

  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({ error: 'Failed to subscribe. Please try again.' });
  }
}
