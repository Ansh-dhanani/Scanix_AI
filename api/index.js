export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  return res.status(200).json({ 
    status: 'Scanix AI API is running',
    endpoints: {
      health: '/api/health',
      predict: '/api/predict'
    }
  });
}