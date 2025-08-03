from http.server import BaseHTTPRequestHandler
import json
import random

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            if not data or 'image' not in data:
                self.send_error_response({'error': 'No image data provided'}, 400)
                return
            
            # Mock prediction for Vercel (ML libraries too heavy)
            has_tumor = random.choice([True, False])
            confidence = random.uniform(0.75, 0.95)
            
            result = {
                'prediction': 'Tumor detected' if has_tumor else 'No tumor detected',
                'has_tumor': has_tumor,
                'confidence': confidence,
                'model_used': 'mock_vercel'
            }
            
            self.send_success_response(result)
            
        except Exception as e:
            self.send_error_response({
                'error': f'Prediction failed: {str(e)}',
                'details': 'Please check your image format and try again'
            }, 500)
    
    def send_success_response(self, data):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    
    def send_error_response(self, data, status_code):
        self.send_response(status_code)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())