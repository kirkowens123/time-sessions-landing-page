exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { email } = JSON.parse(event.body);

    // Validate email
    if (!email || !email.includes('@')) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Valid email is required' })
      };
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
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'Successfully subscribed!' })
      };
    } else {
      throw new Error(data.message || 'Failed to subscribe');
    }

  } catch (error) {
    console.error('Subscription error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to subscribe. Please try again.' })
    };
  }
};
