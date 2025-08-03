from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def handler(request):
    """Vercel serverless function handler"""
    with app.app_context():
        return app.full_dispatch_request()

@app.route('/', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'API is running',
        'model_loaded': True
    })