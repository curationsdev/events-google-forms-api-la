// Form handling and validation
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('submissionForm');
    const typeSelect = document.getElementById('type');
    const eventDateGroup = document.getElementById('eventDateGroup');
    const venueGroup = document.getElementById('venueGroup');
    const eventDateInput = document.getElementById('eventDate');
    const venueInput = document.getElementById('venue');
    const dateInput = document.getElementById('date');
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    // Handle conditional fields based on type selection
    typeSelect.addEventListener('change', function() {
        const isEvent = this.value === 'Event';
        
        if (isEvent) {
            eventDateGroup.style.display = 'block';
            venueGroup.style.display = 'block';
            eventDateInput.required = true;
            venueInput.required = true;
        } else {
            eventDateGroup.style.display = 'none';
            venueGroup.style.display = 'none';
            eventDateInput.required = false;
            venueInput.required = false;
            eventDateInput.value = '';
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
            // Prepare form data
            const formData = new FormData(form);
            const data = {};
            
            // Convert FormData to JSON (excluding files for now)
            for (const [key, value] of formData.entries()) {
                if (key !== 'media') {
                    data[key] = value;
                }
            }
            
            // Handle file uploads separately
            const mediaInput = document.getElementById('media');
            const mediaFiles = mediaInput ? mediaInput.files : [];
            if (mediaFiles.length > 0) {
                data.mediaCount = mediaFiles.length;
                data.mediaFiles = Array.from(mediaFiles).map(f => f.name);
            }
            
            // Submit to server
            const response = await fetch('/la/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            hideLoading();
            
            if (response.ok) {
                showMessage('success', 'Form submitted successfully! Thank you for your submission.');
                form.reset();
                dateInput.value = today;
                typeSelect.dispatchEvent(new Event('change')); // Reset conditional fields
                
                // Scroll to success message
                document.getElementById('successMessage').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            } else {
                showMessage('error', result.error || 'Failed to submit form. Please try again.');
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
        const type = document.getElementById('type').value;
        const description = document.getElementById('description').value.trim();
        const date = document.getElementById('date').value;
        
        if (!name) {
            showMessage('error', 'Please enter your name.');
            return false;
        }
        
        if (!type) {
            showMessage('error', 'Please select a type (Content or Event).');
            return false;
        }
        
        if (type === 'Event') {
            const eventDate = document.getElementById('eventDate').value;
            const venue = document.getElementById('venue').value.trim();
            
            if (!eventDate) {
                showMessage('error', 'Please enter an event date.');
                return false;
            }
            
            if (!venue) {
                showMessage('error', 'Please enter a venue for the event.');
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
        
        if (socialMedia && !isValidUrl(socialMedia)) {
            showMessage('error', 'Please enter a valid social media URL.');
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

    // Load form schema on page load
    async function loadFormSchema() {
        try {
            const response = await fetch('/la/schema');
            if (response.ok) {
                const schema = await response.json();
                console.log('Form schema loaded:', schema);
            }
        } catch (error) {
            console.error('Error loading form schema:', error);
        }
    }

    loadFormSchema();
});
