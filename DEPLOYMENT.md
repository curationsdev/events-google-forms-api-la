# Deployment Guide

## Quick Deployment Checklist

### Pre-Deployment
- [ ] Google Forms API key obtained
- [ ] Google Form created with matching fields
- [ ] Domain configured (curations.dev)
- [ ] SSL/TLS certificate ready
- [ ] Environment variables prepared

### Steps to Deploy

#### 1. Prepare Google Forms API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Forms API
4. Create API credentials (API Key)
5. Restrict API key to your domain
6. Save the API key securely

#### 2. Create Google Form

Create a Google Form with these fields:
- Name (Short answer)
- Type (Multiple choice: Content, Event)
- Event Date (Date)
- Venue (Short answer)
- Description (Paragraph)
- Media (File upload)
- URL (Short answer)
- Social Media (Short answer)
- Date (Date)

Note the Form ID from the URL.

#### 3. Configure Environment

Set these environment variables in your hosting platform:

```bash
GOOGLE_FORMS_API_KEY=your_actual_api_key
GOOGLE_FORM_ID=your_form_id
PORT=3000
NODE_ENV=production
HOST=curations.dev
```

#### 4. Deploy to Hosting Platform

##### Option A: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Configure domain: curations.dev with path /la
```

##### Option B: Heroku

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create curationsla-forms

# Set environment variables
heroku config:set GOOGLE_FORMS_API_KEY=your_key
heroku config:set GOOGLE_FORM_ID=your_form_id
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Add custom domain
heroku domains:add curations.dev
```

##### Option C: AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p node.js curationsla-forms

# Create environment
eb create curationsla-forms-env

# Set environment variables
eb setenv GOOGLE_FORMS_API_KEY=your_key GOOGLE_FORM_ID=your_form_id NODE_ENV=production

# Deploy
eb deploy
```

##### Option D: Traditional Server (Ubuntu)

```bash
# SSH into server
ssh user@your-server

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone https://github.com/curationsdev/events-google-forms-api-la.git
cd events-google-forms-api-la

# Install dependencies
npm install --production

# Create .env file
nano .env
# Add environment variables and save

# Install PM2 for process management
sudo npm install -g pm2

# Start application
pm2 start server.js --name curationsla-forms

# Configure PM2 to start on boot
pm2 startup
pm2 save

# Configure nginx
sudo nano /etc/nginx/sites-available/curations.dev
```

Nginx configuration:
```nginx
server {
    listen 80;
    server_name curations.dev;

    location /la {
        proxy_pass http://localhost:3000/la;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/curations.dev /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Install SSL with Let's Encrypt
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d curations.dev
```

#### 5. Configure Domain

##### DNS Settings
Add these records to your DNS:
```
A     curations.dev     your.server.ip.address
AAAA  curations.dev     your:server:ipv6:address (if available)
```

##### Path Routing
Ensure your web server or hosting platform routes `/la` to the application.

#### 6. Test Deployment

```bash
# Test health endpoint
curl https://curations.dev/health

# Test form endpoint
curl https://curations.dev/la

# Test schema endpoint
curl https://curations.dev/la/schema

# Test submission (replace with actual data)
curl -X POST https://curations.dev/la/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "type": "Event",
    "eventDate": "2025-11-15",
    "venue": "Test Venue",
    "description": "Test description",
    "date": "2025-10-23"
  }'
```

#### 7. Post-Deployment

- [ ] Test form submission
- [ ] Verify Google Forms integration
- [ ] Check SSL certificate
- [ ] Test on mobile devices
- [ ] Monitor error logs
- [ ] Set up uptime monitoring
- [ ] Configure rate limiting (see SECURITY.md)
- [ ] Set up backup strategy
- [ ] Document admin access

## Production Recommendations

### Performance
- Enable gzip compression
- Add CDN for static assets
- Implement caching headers
- Consider Redis for session management

### Security
- Implement rate limiting (express-rate-limit)
- Add CSRF protection
- Enable helmet.js for security headers
- Monitor for suspicious activity
- Regular security audits
- Keep dependencies updated

### Monitoring
- Set up error tracking (Sentry, Rollbar)
- Configure uptime monitoring (UptimeRobot, Pingdom)
- Set up log aggregation (Datadog, LogRocket)
- Monitor API usage and quotas
- Track form submission metrics

### Backup
- Regular database backups (if storing submissions)
- Code repository backups
- Configuration backups
- Document recovery procedures

## Troubleshooting

### Application won't start
- Check environment variables are set
- Verify Node.js version (>= 16.0.0)
- Check port availability
- Review error logs

### Form not loading
- Check static file serving
- Verify path routing configuration
- Check browser console for errors
- Verify CORS settings

### Submissions failing
- Verify Google Forms API key
- Check API key restrictions
- Review server logs
- Test API connectivity
- Verify form ID is correct

### Performance issues
- Check server resources
- Monitor API rate limits
- Review database queries
- Check for memory leaks
- Consider scaling options

## Support

For deployment assistance:
- GitHub Issues: [Create an issue](https://github.com/curationsdev/events-google-forms-api-la/issues)
- Email: support@curations.dev
- Documentation: README.md, SECURITY.md

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Review security advisories
- Monitor API quotas
- Check error logs weekly
- Test form functionality
- Backup data regularly

### Updates
```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Test after updates
npm start
# Test all endpoints
```

## Rollback Plan

If deployment fails:
1. Keep previous version running
2. Test new version in staging
3. Have rollback command ready:
   ```bash
   git revert HEAD
   # Or for specific commit
   git reset --hard <previous-commit-hash>
   # Redeploy
   ```
4. Document the issue
5. Fix and redeploy

---

Last updated: 2025-10-23
