# Scanix AI - Brain Tumor Detection

## Simple Deployment Guide

### Backend (Flask API)
1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run locally:**
   ```bash
   python api.py
   ```

3. **Deploy to any Python hosting service:**
   - Railway: Connect GitHub repo
   - Render: Connect GitHub repo  
   - Heroku: Connect GitHub repo
   - PythonAnywhere: Upload files

### Frontend (React)
1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Update API URL in `.env.production`:**
   ```
   VITE_API_URL=https://your-api-url.com
   ```

3. **Deploy to Netlify:**
   - Connect GitHub repo
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Base directory: `frontend`

### Complete Setup
1. Deploy backend first, get URL
2. Update frontend `.env.production` with backend URL
3. Deploy frontend
4. Done! 🚀

### API Endpoints
- `GET /` - API info
- `GET /health` - Health check
- `POST /predict` - Tumor prediction