# Troubleshooting Guide - Memory Issues on Vercel

## Memory Optimization for Vercel Deployment

### Issue: Build Fails Due to Memory (OOM) Errors

Vercel builds are failing with "Out of Memory" warnings, which can occur when the build process consumes more memory than allocated.

### Solutions:

#### 1. Optimize Dependencies
Review your `requirements.txt` and consider:

```txt
# Current requirements.txt - consider optimizing:
torch==2.0.1  # Consider using a lighter version if possible
torchvision==0.15.2
flask==2.3.3
flask-cors==4.0.0
pillow==10.0.0
# datasets  # Consider removing if not absolutely necessary
```

#### 2. Use Lighter PyTorch Versions
Consider using CPU-only versions or smaller builds:

```txt
# Alternative for CPU-only deployment
torch==2.0.1+cpu
torchvision==0.15.2+cpu
```

#### 3. Split Dependencies
Create separate requirements files for development vs production:

**requirements-prod.txt**
```txt
flask==2.3.3
flask-cors==4.0.0
pillow==10.0.0
```

#### 4. Vercel Configuration Optimization
Update `vercel.json` with memory optimizations:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api_server.py",
      "use": "@vercel/python",
      "config": {
        "maxLambdaSize": "50mb"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api_server.py"
    }
  ]
}
```

#### 5. Model Optimization
If the model file is large (>100MB), consider:
- Using a smaller model architecture
- Quantizing the model
- Hosting the model separately (e.g., on S3)

#### 6. Build Process Optimization
Create a pre-build script to handle large dependencies:

**pre-build.sh**
```bash
#!/bin/bash
# Download large dependencies during build
pip install --no-cache-dir -r requirements.txt
```

### Alternative Deployment Options

If Vercel continues to have memory issues, consider:

1. **Heroku**: Better for Python applications with larger memory requirements
2. **AWS Lambda**: Serverless with configurable memory
3. **Google Cloud Run**: Container-based with flexible resources
4. **DigitalOcean App Platform**: Simple Python app deployment

### Testing Locally

Test memory usage locally before deploying:

```bash
# Monitor memory usage during local testing
python api_server.py &
pid=$!
ps -o rss= -p $pid
```

### Contact Vercel Support

If issues persist, contact Vercel support with:
- Build logs
- Memory usage details
- Project structure

### Emergency Workaround

For immediate deployment, consider:
1. Removing non-essential dependencies
2. Using a lighter model
3. Deploying to alternative platform temporarily
