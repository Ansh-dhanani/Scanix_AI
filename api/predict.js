export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ status: 'OK' });
  }

  if (req.method === 'POST') {
    try {
      const { image } = req.body;
      
      if (!image) {
        return res.status(400).json({ error: 'No image provided' });
      }

      // Mock prediction
      const has_tumor = Math.random() > 0.5;
      const confidence = Math.random() * 0.3 + 0.7; // 70-100%

      const result = {
        prediction: has_tumor ? 'Tumor detected' : 'No tumor detected',
        has_tumor: has_tumor,
        confidence: confidence
      };

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Health check
  return res.status(200).json({ status: 'Scanix AI API is running' });
}