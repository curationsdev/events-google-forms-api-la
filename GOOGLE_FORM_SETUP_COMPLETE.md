# CurationsLA Google Form Setup - Complete Guide

## ✅ Current Configuration

**Google Form ID**: `1fVCzIK1NYcajiDCZxiLlFI7hf89-K5WEk4gN1Alvblw`  
**Form URL**: https://docs.google.com/forms/d/1fVCzIK1NYcajiDCZxiLlFI7hf89-K5WEk4gN1Alvblw/preview

## 🎯 Next Steps Required

### Step 1: Get Entry IDs from Your Google Form

Since you have the form ready, you need to extract the entry IDs:

1. **Open your Google Form in edit mode**
2. **Click "Preview" (eye icon)**
3. **Right-click → "View Page Source"** 
4. **Search for "entry." in the source code**
5. **Find the entry IDs for each field**

### Step 2: Update Field Mappings

Once you have the entry IDs, update the `fieldMappings` object in `/public/js/form.js`:

```javascript
// Update these with your actual entry IDs from the Google Form source
const fieldMappings = {
    name: 'entry.XXXXXXXXX',           // Field 1: Name
    curationslaEmail: 'entry.XXXXXXXXX', // Field 2: Email Used to Subscribe
    type: 'entry.XXXXXXXXX',           // Field 3: Submission Type
    submitMedia: 'entry.XXXXXXXXX',    // Field 4: Submit Media (file upload)
    eventDates: 'entry.XXXXXXXXX',     // Field 5: Event Date(s)
    venue: 'entry.XXXXXXXXX',          // Field 6: Venue Name
    description: 'entry.XXXXXXXXX',    // Field 7: Description
    url: 'entry.XXXXXXXXX',            // Field 8: Website URL
    socialMedia: 'entry.XXXXXXXXX',    // Field 9: Social Media Link
    date: 'entry.XXXXXXXXX'            // Field 10: Submission Date
};
```

### Step 2: Add Form Fields (Exact Order)

Add these fields in this **exact order** for proper mapping:

#### Field 1: Name
- **Type**: Short answer
- **Question**: "Full Name"
- **Required**: Yes
- **Description**: "Enter your full name"

#### Field 2: CurationsLA Email
- **Type**: Short answer
- **Question**: "CurationsLA Email"
- **Required**: Yes
- **Description**: "Your email address for CurationsLA communications"
- **Validation**: Email format

#### Field 3: Type  
- **Type**: Multiple choice
- **Question**: "Submission Type"
- **Options**: 
  - Content
  - Event
  - Other
- **Required**: Yes
- **Description**: "Select whether this is content, an event, or other submission"

#### Field 4: Event Date
- **Type**: Date
- **Question**: "Event Date"
- **Required**: No
- **Description**: "Date of the event (Events only)"

#### Field 5: Venue
- **Type**: Short answer  
- **Question**: "Venue Name"
- **Required**: No
- **Description**: "Event venue (Events only)"

#### Field 6: Description
- **Type**: Paragraph
- **Question**: "Description"
- **Required**: Yes
- **Description**: "Detailed description of your event or content"

#### Field 7: Upload Media
- **Type**: File upload
- **Question**: "Upload Media"
- **Required**: No
- **Description**: "Upload images or documents (JPG, PNG, GIF, PDF, DOC)"
- **Settings**: 
  - Allow multiple files: Yes
  - File types: Images, Documents
  - Maximum file size: 10MB (Google Forms default)

#### Field 8: URL
- **Type**: Short answer
- **Question**: "Website or Content URL"
- **Required**: No
- **Description**: "Link to your event, content, or website"

#### Field 9: Social Media
- **Type**: Short answer
- **Question**: "Social Media Link"  
- **Required**: No
- **Description**: "Instagram, Twitter, TikTok, or other social media link"

#### Field 10: Submission Date
- **Type**: Date
- **Question**: "Submission Date"
- **Required**: Yes
- **Description**: "Today's date"

### Step 3: Get Form ID and Entry IDs

#### Get Form ID:
1. Click "Send" in your form
2. Copy the form URL: `https://docs.google.com/forms/d/[FORM_ID]/edit`
3. Extract the Form ID (between `/d/` and `/edit`)

#### Get Entry IDs:
1. Click "Preview" (eye icon) in form editor
2. Right-click → "View Page Source"
3. Search for `entry.` to find entry IDs
4. Note the entry ID for each field (e.g., `entry.1234567890`)

### Step 4: Update JavaScript Configuration

Edit `/public/js/form.js` and update the field mappings:

```javascript
const fieldMappings = {
    name: 'entry.YOUR_NAME_ENTRY_ID',        // Field 1 entry ID
    type: 'entry.YOUR_TYPE_ENTRY_ID',        // Field 2 entry ID  
    eventDate: 'entry.YOUR_EVENT_DATE_ID',   // Field 3 entry ID
    venue: 'entry.YOUR_VENUE_ENTRY_ID',      // Field 4 entry ID
    description: 'entry.YOUR_DESCRIPTION_ID', // Field 5 entry ID
    url: 'entry.YOUR_URL_ENTRY_ID',          // Field 6 entry ID
    socialMedia: 'entry.YOUR_SOCIAL_ID',     // Field 7 entry ID
    date: 'entry.YOUR_DATE_ENTRY_ID'         // Field 8 entry ID
};
```

### Step 5: Configure GitHub Secrets

1. Go to: https://github.com/curationsdev/events-google-forms-api-la/settings/secrets/actions
2. Add these secrets:
   - **GOOGLE_FORM_ID**: Your form ID from Step 3
   - **GOOGLE_FORMS_API_KEY**: (Optional - for advanced features)

### Step 6: Link Form to Spreadsheet (Optional)

If you want responses to go to your spreadsheet:

1. In your Google Form, click "Responses" tab
2. Click the green Sheets icon
3. Choose "Create a new spreadsheet" or "Select existing spreadsheet"
4. Link it to your existing sheet: https://docs.google.com/spreadsheets/d/1tPIMsOFDzBsqhjVO9y5o2UvDBZ18m2Rufi57QUjjk2g

## Example Entry ID Mapping

Here's how the entry IDs typically look:

```javascript
// Example - Replace with your actual entry IDs
const fieldMappings = {
    name: 'entry.2005620554',
    curationslaEmail: 'entry.1166974658',
    type: 'entry.1045781291', 
    eventDate: 'entry.839337160',
    venue: 'entry.871781623',
    description: 'entry.1302056879',
    uploadMedia: 'entry.1696159737', // File upload field
    url: 'entry.1871112715',
    socialMedia: 'entry.1234567890',
    date: 'entry.9876543210'
};
```

## Testing Checklist

After setup:

- [ ] Create Google Form with 8 fields in exact order
- [ ] Get Form ID and all 8 entry IDs
- [ ] Update JavaScript field mappings
- [ ] Add Form ID to GitHub Secrets
- [ ] Test form submission manually
- [ ] Verify data appears in Google Form responses
- [ ] Test website form at https://la.curations.dev

## Quick Form Creation Template

**Copy this to create your form quickly:**

```
Form Title: CurationsLA Event & Content Submission
Form Description: Submit your events, content, or PR for consideration by CurationsLA

1. Full Name (Short answer, Required)
2. CurationsLA Email (Short answer, Required, Email validation)
3. Submission Type (Multiple choice: Content/Event/Other, Required) 
4. Event Date (Date, Optional)
5. Venue Name (Short answer, Optional)
6. Description (Paragraph, Required)
7. Upload Media (File upload, Optional - Images & Documents)
8. Website or Content URL (Short answer, Optional)
9. Social Media Link (Short answer, Optional)
10. Submission Date (Date, Required)
```

## Google Forms File Upload Configuration

When adding the file upload field in Google Forms:

1. **Add Question Type**: Select "File upload"
2. **Question**: "Upload Media"
3. **File Upload Settings**:
   - ✅ Allow respondents to upload files
   - **File types**: Select "Images" and "Documents"
   - **Maximum number of files**: 5-10 (your preference)
   - **Maximum file size**: 10MB (Google Forms default)
4. **Required**: No (optional field)

## Need Help?

1. **Creating the form**: Follow Google Forms documentation
2. **Finding entry IDs**: Use browser developer tools  
3. **Testing**: Submit test data through both the form and website
4. **Troubleshooting**: Check browser console for errors

---

**Once completed, you'll have:**
- ✅ Custom domain: https://la.curations.dev
- ✅ Professional form interface  
- ✅ Direct Google Forms integration
- ✅ Data collection in your spreadsheet
- ✅ Automated deployment via GitHub Actions