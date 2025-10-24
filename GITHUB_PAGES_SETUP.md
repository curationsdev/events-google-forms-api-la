# GitHub Pages Deployment Setup

## Quick Setup Guide

This guide will help you deploy the CurationsLA Events Google Forms API to GitHub Pages.

### Prerequisites Checklist ✅

- [x] GitHub account with repository access
- [ ] Google Form created (see GOOGLE_FORMS_SETUP.md)
- [ ] Google Form ID obtained
- [ ] Google Forms API Key (optional - for advanced features)

## Step 1: Configure GitHub Secrets

1. **Navigate to Repository Settings**
   - Go to your repository: https://github.com/curationsdev/events-google-forms-api-la
   - Click on the "Settings" tab
   - Select "Secrets and variables" → "Actions"

2. **Add Required Secrets**
   Click "New repository secret" and add:

   **Secret Name:** `GOOGLE_FORM_ID`  
   **Secret Value:** Your Google Form ID (from the form URL)
   
   **Secret Name:** `GOOGLE_FORMS_API_KEY`  
   **Secret Value:** Your Google Forms API key (if using API features)

## Step 2: Enable GitHub Pages

1. **Navigate to Pages Settings**
   - In your repository, go to "Settings" → "Pages"

2. **Configure Source**
   - Source: "GitHub Actions"
   - This will automatically use our custom workflow

3. **Save Configuration**
   - Click "Save"

## Step 3: Configure Field Mappings

Before deployment, you need to map your Google Form fields to the correct entry IDs:

1. **Get Entry IDs from your Google Form**
   - Follow the instructions in `GOOGLE_FORMS_SETUP.md`

2. **Update Field Mappings**
   - Edit `/public/js/form.js`
   - Update the `fieldMappings` object with your actual entry IDs:

```javascript
const fieldMappings = {
    name: 'entry.YOUR_NAME_ENTRY_ID',
    type: 'entry.YOUR_TYPE_ENTRY_ID',
    eventDate: 'entry.YOUR_EVENT_DATE_ENTRY_ID',
    venue: 'entry.YOUR_VENUE_ENTRY_ID',
    description: 'entry.YOUR_DESCRIPTION_ENTRY_ID',
    url: 'entry.YOUR_URL_ENTRY_ID',
    socialMedia: 'entry.YOUR_SOCIAL_MEDIA_ENTRY_ID',
    date: 'entry.YOUR_DATE_ENTRY_ID'
};
```

## Step 4: Deploy

1. **Commit and Push Changes**
   ```bash
   git add .
   git commit -m "Configure Google Forms integration for GitHub Pages"
   git push origin main
   ```

2. **Monitor Deployment**
   - Go to "Actions" tab in your repository
   - Watch the "Deploy to GitHub Pages" workflow
   - Deployment typically takes 2-5 minutes

3. **Access Your Site**
   - Your site will be available at: `https://curationsdev.github.io/events-google-forms-api-la/`
   - Or your custom domain if configured

## Step 5: Custom Domain (Optional)

To use `curations.dev/la`:

1. **Add CNAME File**
   ```bash
   echo "curations.dev" > dist/CNAME
   ```

2. **Update DNS Settings**
   Add these DNS records:
   ```
   Type: CNAME
   Name: curations.dev (or subdomain)
   Value: curationsdev.github.io
   ```

3. **Configure in GitHub**
   - Go to "Settings" → "Pages"
   - Add custom domain: `curations.dev`
   - Enable "Enforce HTTPS"

## Verification Checklist

After deployment, verify:

- [ ] Site loads correctly at GitHub Pages URL
- [ ] Form displays properly
- [ ] Conditional fields work (Event vs Content)
- [ ] Form validation works
- [ ] Test submission goes to Google Form
- [ ] Response appears in Google Form responses
- [ ] Custom domain works (if configured)

## Troubleshooting

### Deployment Fails
- Check "Actions" tab for error details
- Verify GitHub Secrets are configured
- Ensure branch name matches workflow (main/master)

### Form Not Submitting
- Check browser console for errors
- Verify Google Form entry IDs are correct
- Ensure Google Form accepts responses
- Test Google Form manually first

### Missing Styles or Scripts
- Check that all files are included in build
- Verify paths in HTML are correct
- Ensure `.nojekyll` file is present

### CORS Issues
- Google Forms submissions use `no-cors` mode
- Cannot read response status - this is normal
- Form will assume success if no error thrown

## Advanced Configuration

### Environment-Specific Settings

You can modify the build script to handle different environments:

```javascript
// In build.js
const environment = process.env.NODE_ENV || 'production';
const apiKey = environment === 'development' ? 
    'test_key' : process.env.GOOGLE_FORMS_API_KEY;
```

### Custom Styling

The form uses a brutalist design with purple and green colors. To customize:

1. Edit `/public/css/styles.css`
2. Modify CSS variables in `:root` selector
3. Rebuild and redeploy

### Analytics Integration

Add Google Analytics or other tracking:

1. Include tracking script in `index.html`
2. Add tracking events in `form.js`
3. Configure in build process

## Production Best Practices

### Security
- Never commit API keys to repository
- Use GitHub Secrets for sensitive data
- Regularly rotate API keys
- Monitor form submissions for spam

### Performance
- Optimize images and assets
- Use CDN for large files
- Implement caching headers
- Monitor Core Web Vitals

### Monitoring
- Set up uptime monitoring
- Track form submission success rates
- Monitor for errors and failures
- Regular functionality testing

---

## Support

**Documentation:**
- [Google Forms Setup](./GOOGLE_FORMS_SETUP.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Security Guidelines](./SECURITY.md)

**Need Help?**
- GitHub Issues: Report bugs or request features
- Email: support@curations.dev
- Check existing documentation first

**Links:**
- [Repository](https://github.com/curationsdev/events-google-forms-api-la)
- [CurationsLA](https://la.curations.cc)
- [Curations Main](https://curations.org)