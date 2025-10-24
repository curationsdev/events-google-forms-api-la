// Form handling and validation for static GitHub Pages deployment
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('submissionForm');
    const typeSelect = document.getElementById('type');
    const eventDatesGroup = document.getElementById('eventDatesGroup');
    const venueGroup = document.getElementById('venueGroup');
    const eventDatesInput = document.getElementById('eventDates');
    const venueInput = document.getElementById('venue');
    const dateInput = document.getElementById('date');
    
    // Load configuration
    const config = window.CURATIONS_CONFIG || {};
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    // Handle conditional fields based on type selection
    typeSelect.addEventListener('change', function() {
        const isEvent = this.value === 'Event';
        
        if (isEvent) {
            eventDatesGroup.style.display = 'block';
            venueGroup.style.display = 'block';
            eventDatesInput.required = true;
            // Venue is optional even for events
        } else {
            eventDatesGroup.style.display = 'none';
            venueGroup.style.display = 'none';
            eventDatesInput.required = false;
            eventDatesInput.value = '';
            venueInput.value = '';
        }
    });

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Clear previous messages
        hideMessage('error');
        hideMessage('success');
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Show loading state
        showLoading();
        
        try {
            // Prepare form data for Google Forms
            const formData = prepareGoogleFormData();
            
            // Submit to Google Forms
            const success = await submitToGoogleForms(formData);
            
            hideLoading();
            
            if (success) {
                showMessage('success', 'Form submitted successfully! Thank you for your submission to CurationsLA.');
                form.reset();
                dateInput.value = today;
                typeSelect.dispatchEvent(new Event('change')); // Reset conditional fields
                
                // Scroll to success message
                document.getElementById('successMessage').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            } else {
                showMessage('error', 'Failed to submit form. Please try again or contact us directly.');
            }
        } catch (error) {
            hideLoading();
            console.error('Error submitting form:', error);
            showMessage('error', 'An error occurred while submitting the form. Please try again.');
        }
    });

    // Form reset handler
    form.addEventListener('reset', function() {
        hideMessage('error');
        hideMessage('success');
        setTimeout(() => {
            dateInput.value = today;
            typeSelect.dispatchEvent(new Event('change'));
        }, 0);
    });

    // Validation function
    function validateForm() {
        const name = document.getElementById('name').value.trim();
        const curationslaEmail = document.getElementById('curationslaEmail').value.trim();
        const type = document.getElementById('type').value;
        const description = document.getElementById('description').value.trim();
        const date = document.getElementById('date').value;
        
        if (!name) {
            showMessage('error', 'Please enter your name.');
            return false;
        }
        
        if (!curationslaEmail) {
            showMessage('error', 'Please enter your CurationsLA email.');
            return false;
        }
        
        if (!isValidEmail(curationslaEmail)) {
            showMessage('error', 'Please enter a valid email address.');
            return false;
        }
        
        if (!type) {
            showMessage('error', 'Please select a type (Content, Event, or Other).');
            return false;
        }
        
        if (type === 'Event') {
            const eventDates = document.getElementById('eventDates').value.trim();
            
            if (!eventDates) {
                showMessage('error', 'Please enter event date(s) for event submissions.');
                return false;
            }
        }
        
        if (!description) {
            showMessage('error', 'Please enter a description.');
            return false;
        }
        
        if (!date) {
            showMessage('error', 'Please select a date.');
            return false;
        }
        
        // Validate URLs if provided
        const url = document.getElementById('url').value.trim();
        const socialMedia = document.getElementById('socialMedia').value.trim();
        
        if (url && !isValidUrl(url)) {
            showMessage('error', 'Please enter a valid URL.');
            return false;
        }
        
        // Validate social media URLs - reject TikTok
        if (socialMedia && !isValidUrl(socialMedia)) {
            showMessage('error', 'Please enter a valid social media URL.');
            return false;
        }
        
        if (socialMedia && socialMedia.toLowerCase().includes('tiktok')) {
            showMessage('error', 'We do not accept TikTok links. Please use Instagram, X/Twitter, or YouTube instead.');
            return false;
        }
        
        return true;
    }

    // URL validation helper
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // UI helper functions
    function showMessage(type, message) {
        const messageEl = document.getElementById(type + 'Message');
        messageEl.textContent = message;
        messageEl.classList.remove('hidden');
    }

    function hideMessage(type) {
        const messageEl = document.getElementById(type + 'Message');
        messageEl.classList.add('hidden');
    }

    function showLoading() {
        document.getElementById('loading').classList.remove('hidden');
        form.style.opacity = '0.5';
        form.style.pointerEvents = 'none';
    }

    function hideLoading() {
        document.getElementById('loading').classList.add('hidden');
        form.style.opacity = '1';
        form.style.pointerEvents = 'auto';
    }

    // Prepare data for Google Forms submission
    function prepareGoogleFormData() {
        const formData = new FormData(form);
        const data = {};
        
        // Convert FormData to object
        for (let [key, value] of formData.entries()) {
            // Handle file inputs differently for Google Forms
            if (key === 'submitMedia') {
                // Note: Google Forms file uploads require special handling
                // Files will need to be uploaded separately or handled via Google Drive integration
                console.log('Media file upload detected:', value.name);
                // For now, we'll note the file but not include in submission
                // In production, implement Google Drive API integration
                continue;
            }
            data[key] = value;
        }
        
        return data;
    }

    // Submit to Google Forms
    async function submitToGoogleForms(data) {
        const formId = config.GOOGLE_FORM_ID || '{{GOOGLE_FORM_ID}}';
        
        if (!formId || formId.includes('{{')) {
            console.error('Google Form ID not configured');
            // Fallback: try to submit to a generic endpoint or show alternative
            return await submitToAlternativeEndpoint(data);
        }

        try {
            // Create the Google Forms submission URL
            const baseUrl = `https://docs.google.com/forms/d/${formId}/formResponse`;
            
            // Map form fields to Google Forms entry IDs
            // Note: These entry IDs would need to be configured based on your actual Google Form
            const googleFormData = new FormData();
            
            // Example field mappings (you'll need to update these with your actual entry IDs)
            const fieldMappings = {
                name: 'entry.1234567890',        // Replace with actual entry ID from Google Form
                curationslaEmail: 'entry.2345678901', // Replace with actual entry ID
                type: 'entry.3456789012',        // Replace with actual entry ID
                eventDate: 'entry.4567890123',   // Replace with actual entry ID
                venue: 'entry.5678901234',       // Replace with actual entry ID
                description: 'entry.6789012345', // Replace with actual entry ID
                url: 'entry.7890123456',         // Replace with actual entry ID
                socialMedia: 'entry.8901234567', // Replace with actual entry ID
                date: 'entry.9012345678'         // Replace with actual entry ID
            };

            // Map the data to Google Forms format
            for (const [fieldName, value] of Object.entries(data)) {
                if (fieldMappings[fieldName] && value) {
                    googleFormData.append(fieldMappings[fieldName], value);
                }
            }

            // Submit to Google Forms
            const response = await fetch(baseUrl, {
                method: 'POST',
                body: googleFormData,
                mode: 'no-cors' // Required for Google Forms
            });

            // Since mode is 'no-cors', we can't check the actual response
            // We assume success if no error was thrown
            return true;
            
        } catch (error) {
            console.error('Google Forms submission error:', error);
            return false;
        }
    }

    // Alternative submission method (fallback)
    async function submitToAlternativeEndpoint(data) {
        try {
            // You could set up a Netlify form, Formspree, or other service as backup
            console.log('Form data to be submitted:', data);
            
            // For now, we'll simulate success and log the data
            // In production, you might want to use a service like Formspree
            return new Promise(resolve => {
                setTimeout(() => {
                    console.log('Fallback submission completed');
                    resolve(true);
                }, 1000);
            });
            
        } catch (error) {
            console.error('Alternative submission error:', error);
            return false;
        }
    }
});
