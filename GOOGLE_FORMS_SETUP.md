# Google Forms API Setup Guide

## Overview
This guide will help you configure the Google Forms integration for the CurationsLA Events submission form.

## Step 1: Create a Google Form

1. Go to [Google Forms](https://forms.google.com)
2. Click "Create a new form"
3. Set the title: "CurationsLA Event & Content Submission"
4. Add the following questions **in this exact order**:

### Required Form Fields:

1. **Name** (Short answer, Required)
   - Question: "Full Name"
   
2. **Type** (Multiple choice, Required)
   - Question: "Submission Type"
   - Options: "Content", "Event"
   
3. **Event Date** (Date, Optional)
   - Question: "Event Date (Events only)"
   
4. **Venue** (Short answer, Optional)
   - Question: "Venue Name (Events only)"
   
5. **Description** (Paragraph, Required)
   - Question: "Description"
   
6. **URL** (Short answer, Optional)
   - Question: "Website or Content URL"
   
7. **Social Media** (Short answer, Optional)
   - Question: "Social Media Link"
   
8. **Submission Date** (Date, Required)
   - Question: "Submission Date"

## Step 2: Get Form ID

1. Click "Send" button in your form
2. Copy the form URL, it will look like:
   `https://docs.google.com/forms/d/1ABC123def456GHI789jkl/edit`
3. Extract the Form ID from the URL (the part between `/d/` and `/edit`)
   - Example: `1ABC123def456GHI789jkl`

## Step 3: Get Entry IDs

To get the entry IDs for each field:

1. In your Google Form editor, click "Preview" (eye icon)
2. Right-click on the page and select "View Page Source" or "Inspect Element"
3. Search for `entry.` in the source code
4. You'll find lines like: `<input name="entry.1234567890">`

### Map Entry IDs:

Update the `fieldMappings` object in `/public/js/form.js`:

```javascript
const fieldMappings = {
    name: 'entry.XXXXXXXXX',        // Replace with your Name field entry ID
    type: 'entry.XXXXXXXXX',        // Replace with your Type field entry ID  
    eventDate: 'entry.XXXXXXXXX',   // Replace with your Event Date field entry ID
    venue: 'entry.XXXXXXXXX',       // Replace with your Venue field entry ID
    description: 'entry.XXXXXXXXX', // Replace with your Description field entry ID
    url: 'entry.XXXXXXXXX',         // Replace with your URL field entry ID
    socialMedia: 'entry.XXXXXXXXX', // Replace with your Social Media field entry ID
    date: 'entry.XXXXXXXXX'         // Replace with your Submission Date field entry ID
};
```

## Step 4: Configure GitHub Secrets

1. Go to your GitHub repository
2. Click "Settings" tab
3. Navigate to "Secrets and variables" → "Actions"
4. Add the following secrets:

   - **GOOGLE_FORM_ID**: Your form ID (from Step 2)
   - **GOOGLE_FORMS_API_KEY**: Your Google Forms API key (if using API)

## Step 5: Update Form Mapping

1. Open `/public/js/form.js` in your repository
2. Update the `fieldMappings` object with the entry IDs you found in Step 3
3. Commit and push your changes

## Step 6: Test Submission

1. After deployment, test the form by submitting a test entry
2. Check your Google Form responses to verify data is being received
3. Verify all fields are mapping correctly

## Alternative: Using Formspree or Netlify Forms

If you prefer not to use Google Forms directly, you can integrate with:

### Formspree Setup:
1. Sign up at [Formspree.io](https://formspree.io)
2. Create a new form endpoint
3. Replace the `submitToGoogleForms` function with Formspree API call

### Netlify Forms Setup:
1. Add `netlify` attribute to your form in HTML
2. Deploy to Netlify
3. Forms will automatically be handled by Netlify

## Troubleshooting

### Form Not Submitting:
- Check browser console for errors
- Verify entry IDs are correct
- Ensure Google Form is set to accept responses

### CORS Issues:
- Google Forms requires `no-cors` mode
- Cannot read response status - assume success if no error thrown

### Missing Data:
- Verify field names match exactly between HTML form and mapping object
- Check that all required fields are included
- Ensure Google Form fields are properly configured

## Security Notes

- Form ID is public and safe to expose
- API keys should only be stored in GitHub Secrets
- Never commit API keys to repository
- Consider rate limiting for production use

---

**Need Help?**
- Check the GitHub Issues for common problems
- Review the DEPLOYMENT.md file for setup instructions
- Contact: support@curations.dev