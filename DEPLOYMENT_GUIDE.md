# Deployment Guide - Scanix AI

## Backend Deployment (Vercel)

### Prerequisites
- Vercel account
- Vercel CLI installed (`npm i -g vercel`)

### Steps to Deploy Backend to Vercel

1. **Navigate to backend directory:**
   ```bash
   cd scanix_AI2
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy the backend:**
   ```bash
   vercel --prod
   ```

4. **Follow the prompts:**
   - Set the project name
   - Keep default settings
   - Deploy to production

5. **Note the deployment URL** - This will be your API base URL

### Backend Configuration
The backend is configured in `vercel.json` to:
- Use Python runtime
- Route all requests to `api_server.py`
- Support Flask application structure

## Frontend Deployment (Netlify)

### Prerequisites
- Netlify account
- Netlify CLI installed (`npm install -g netlify-cli`)

### Steps to Deploy Frontend to Netlify

1. **Navigate to frontend directory:**
   ```bash
   cd scanix_AI2/frontend
   ```

2. **Build the frontend:**
   ```bash
   npm run build
   ```

3. **Login to Netlify:**
   ```bash
   netlify login
   ```

4. **Initialize Netlify site:**
   ```bash
   netlify init
   ```

5. **Deploy to Netlify:**
   ```bash
   netlify deploy --prod
   ```

6. **Configure environment variables in Netlify dashboard:**
   - `VITE_API_URL`: Your Vercel backend URL (from step 4 above)

### Frontend Configuration
The frontend is configured in `netlify.toml` to:
- Build from the `dist` directory
- Use Node.js 18
- Handle SPA routing with redirects

## Environment Variables

### Backend (Vercel)
Configure in Vercel dashboard:
- No specific environment variables needed for basic deployment

### Frontend (Netlify)
Configure in Netlify dashboard:
- `VITE_API_URL`: The URL of your deployed backend API

## Testing the Deployment

1. **Test backend health endpoint:**
   ```
   GET https://your-vercel-app.vercel.app/api/health
   ```

2. **Test frontend:**
   Visit your Netlify URL and test:
   - Home page loads
   - Contact form works
   - Image upload functionality

## Troubleshooting

### Common Issues

1. **Backend 404 errors:**
   - Check Vercel deployment logs
   - Ensure `vercel.json` is correctly configured

2. **Frontend build errors:**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json

3. **CORS issues:**
   - Backend already has CORS configured in `api_server.py`

4. **API connection issues:**
   - Verify `VITE_API_URL` is set correctly in Netlify

## Maintenance

### Updating Backend
```bash
cd scanix_AI2
vercel --prod
```

### Updating Frontend
```bash
cd scanix_AI2/frontend
netlify deploy --prod
```

## Support
For deployment issues, check:
- Vercel documentation: https://vercel.com/docs
- Netlify documentation: https://docs.netlify.com
- Project README for additional setup instructions
