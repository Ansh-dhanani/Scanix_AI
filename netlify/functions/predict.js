exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { image } = JSON.parse(event.body);
    
    const mockResult = {
      prediction: Math.random() > 0.5 ? 'Tumor detected' : 'No tumor detected',
      has_tumor: Math.random() > 0.5,
      confidence: Math.random() * 0.3 + 0.7
    };

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mockResult)
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message })
    };
  }
};