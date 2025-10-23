const { google } = require('googleapis');
const formConfig = require('../config/formConfig');
const path = require('path');

// Initialize Google Forms API
const forms = google.forms('v1');

// Display the form
exports.displayForm = (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
};

// Get form schema
exports.getFormSchema = (req, res) => {
  try {
    res.json({
      title: 'CurationsLA Event & Content Submission',
      description: 'Submit events and content for CurationsLA',
      fields: formConfig.fields,
      backlinks: formConfig.backlinks
    });
  } catch (error) {
    console.error('Error fetching form schema:', error);
    res.status(500).json({ 
      error: 'Failed to fetch form schema',
      message: error.message 
    });
  }
};

// Submit form data
exports.submitForm = async (req, res) => {
  try {
    const formData = req.body;
    
    // Validate required fields
    const validation = validateFormData(formData);
    if (!validation.valid) {
      return res.status(400).json({ 
        error: 'Validation failed',
        errors: validation.errors 
      });
    }

    // In a real implementation, this would submit to Google Forms
    // For now, we'll log and return success
    console.log('Form submission received:', formData);

    // Here you would integrate with Google Forms API
    // const response = await submitToGoogleForms(formData);

    res.json({
      success: true,
      message: 'Form submitted successfully',
      data: formData
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ 
      error: 'Failed to submit form',
      message: error.message 
    });
  }
};

// Validate form data
function validateFormData(data) {
  const errors = [];
  
  // Required fields
  if (!data.name || data.name.trim() === '') {
    errors.push('Name is required');
  }
  
  if (!data.type) {
    errors.push('Type is required (Content or Event)');
  }
  
  if (data.type === 'Event') {
    if (!data.eventDate) {
      errors.push('Event date is required for events');
    }
    if (!data.venue || data.venue.trim() === '') {
      errors.push('Venue is required for events');
    }
  }
  
  if (!data.description || data.description.trim() === '') {
    errors.push('Description is required');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Function to submit to Google Forms (placeholder)
async function submitToGoogleForms(formData) {
  // This would use the Google Forms API to submit data
  // Requires proper authentication and form ID
  const apiKey = process.env.GOOGLE_FORMS_API_KEY;
  const formId = process.env.GOOGLE_FORM_ID;
  
  if (!apiKey || !formId) {
    throw new Error('Google Forms API credentials not configured');
  }
  
  // Implementation would go here
  return { success: true };
}
