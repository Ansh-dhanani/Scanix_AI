# Scanix AI Frontend

React frontend for brain tumor detection system.

## Development
```bash
npm install
npm run dev
```

## Netlify Deployment

1. **Update API URL**: Edit `.env.production` with your deployed Flask API URL
2. **Deploy**: Connect GitHub repo to Netlify
3. **Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Base directory: `frontend`

## Environment Variables
- `VITE_API_URL`: Flask API URL (set in Netlify dashboard)
