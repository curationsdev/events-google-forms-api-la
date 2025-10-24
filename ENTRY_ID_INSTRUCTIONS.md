# 🎯 Quick Entry ID Setup Guide

## Your Google Form
**Form ID**: `1fVCzIK1NYcajiDCZxiLlFI7hf89-K5WEk4gN1Alvblw`  
**Preview URL**: https://docs.google.com/forms/d/1fVCzIK1NYcajiDCZxiLlFI7hf89-K5WEk4gN1Alvblw/preview

## Quick Steps to Complete Integration

### 1. Get Entry IDs (2 minutes)
1. Open your form preview: https://docs.google.com/forms/d/1fVCzIK1NYcajiDCZxiLlFI7hf89-K5WEk4gN1Alvblw/preview
2. Right-click → "View Page Source"
3. Press `Ctrl+F` (or `Cmd+F`) and search for `entry.`
4. You'll see lines like: `<input name="entry.1234567890"`

### 2. Field Order in Your Form
Your form should have these fields in this exact order:
1. **Name** → `entry.XXXXXXXXX`
2. **Email Used to Subscribe** → `entry.XXXXXXXXX`  
3. **Submission Type** → `entry.XXXXXXXXX`
4. **Submit Media** → `entry.XXXXXXXXX`
5. **Event Date(s)** → `entry.XXXXXXXXX`
6. **Venue Name** → `entry.XXXXXXXXX`
7. **Description** → `entry.XXXXXXXXX`
8. **Website URL** → `entry.XXXXXXXXX`
9. **Social Media Link** → `entry.XXXXXXXXX`
10. **Submission Date** → `entry.XXXXXXXXX`

### 3. Update the Code
Edit `/public/js/form.js` and replace this section:

```javascript
// Find this around line 120-130
const fieldMappings = {
    name: 'entry.1234567890',           // Replace with your Name entry ID
    curationslaEmail: 'entry.2345678901', // Replace with your Email entry ID
    type: 'entry.3456789012',           // Replace with your Type entry ID
    submitMedia: 'entry.4567890123',    // Replace with your Media entry ID
    eventDates: 'entry.5678901234',     // Replace with your Event Dates entry ID
    venue: 'entry.6789012345',          // Replace with your Venue entry ID
    description: 'entry.7890123456',    // Replace with your Description entry ID
    url: 'entry.8901234567',            // Replace with your URL entry ID
    socialMedia: 'entry.9012345678',    // Replace with your Social Media entry ID
    date: 'entry.0123456789'            // Replace with your Date entry ID
};
```

### 4. Test the Integration
After updating the entry IDs:
1. Test your form at https://la.curations.dev
2. Submit a test entry
3. Check if it appears in your Google Form responses

## ✅ Current Status
- ✅ Form ID configured
- ✅ Website deployed and working
- ⏳ **Waiting for entry ID mapping** (your next step)

## Need Help?
If you can't find the entry IDs or need assistance:
1. Share the page source text where you see the `entry.` values
2. I can help map them to the correct fields

---

**Everything else is ready - just need those entry IDs to complete the integration!** 🚀