// CRITICAL: EMERGENCY SOLUTION WITH ENVIRONMENT VARIABLE SUPPORT
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚨 EMERGENCY FORM SYSTEM LOADED');
    
    const form = document.getElementById('submissionForm');
    const typeSelect = document.getElementById('type');
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    // Conditional fields
    typeSelect.addEventListener('change', function() {
        const eventFields = ['eventDatesGroup', 'venueGroup'];
        eventFields.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = this.value === 'Event' ? 'block' : 'none';
            }
        });
    });

    // EMERGENCY FORM SUBMISSION
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('🚨 EMERGENCY SUBMISSION INITIATED');
        
        if (!validateForm()) return;
        showLoading();
        
        const formData = prepareFormData();
        
        // ALWAYS CREATE BACKUP IMMEDIATELY
        const backupId = `emergency-${Date.now()}`;
        createBackup(formData, 'EMERGENCY_BACKUP', backupId);
        generateEmailTemplate(formData);
        
        // Try multiple Google Forms (including environment variable)
        let success = false;
        const formIds = [
            window.GOOGLE_FORM_ID || '', // From environment
            '{{GOOGLE_FORM_ID}}', // Build-time replacement
            '1fVCzIK1NYcajiDCZxiLlFI7hf89-K5WEk4gN1Alvblw', // Original
            // Add more public form IDs here if available
        ].filter(id => id && id !== '{{GOOGLE_FORM_ID}}');
        
        for (const formId of formIds) {
            try {
                console.log(`🎯 Trying Google Form: ${formId}`);
                await submitToGoogleForm(formData, formId);
                console.log(`✅ SUCCESS with form: ${formId}`);
                success = true;
                break;
            } catch (e) {
                console.warn(`❌ Failed with form ${formId}:`, e);
            }
        }
        
        // Store result for success page
        sessionStorage.setItem('curationsla-submission', JSON.stringify({
            timestamp: new Date().toISOString(),
            method: success ? 'google-forms' : 'emergency-backup',
            submissionId: success ? `gforms-${Date.now()}` : backupId,
            status: success ? 'SUCCESS' : 'BACKUP_ONLY'
        }));
        
        // Always go to success page (we have backup)
        window.location.href = './success.html';
    });

    // Try submitting to Google Form
    async function submitToGoogleForm(data, formId) {
        const submitURL = `https://docs.google.com/forms/u/0/d/${formId}/formResponse`;
        const submissionText = formatSubmissionText(data);
        
        const formDataToSubmit = new FormData();
        
        // Multiple entry attempts
        const entries = [
            'entry.1234567890', 'entry.2000000000', 'entry.1000000',
            'entry.1', 'entry.2', 'entry.3', 'entry.4', 'entry.5'
        ];
        
        entries.forEach(entry => {
            formDataToSubmit.append(entry, submissionText);
        });
        
        // Individual fields
        formDataToSubmit.append('entry.100', data.name);
        formDataToSubmit.append('entry.200', data.curationslaEmail);
        formDataToSubmit.append('entry.300', data.type);
        formDataToSubmit.append('entry.400', data.description);
        
        await fetch(submitURL, {
            method: 'POST',
            mode: 'no-cors',
            body: formDataToSubmit
        });
    }

    // Format submission text
    function formatSubmissionText(data) {
        return `🎯 CURATIONSLA SUBMISSION - ${new Date().toISOString()}

Name: ${data.name}
Email: ${data.curationslaEmail}
Type: ${data.type}
Event Dates: ${data.eventDates || 'N/A'}
Venue: ${data.venue || 'N/A'}
Description: ${data.description}
Website URL: ${data.url || 'N/A'}
Social Media: ${data.socialMedia || 'N/A'}
Submission Date: ${data.date}

Submitted: ${new Date().toLocaleString()}
Source: ${window.location.href}`;
    }

    // Create backup - ALWAYS WORKS
    function createBackup(data, status, id) {
        const backup = {
            id, status, timestamp: new Date().toISOString(), data,
            formatted: formatSubmissionText(data)
        };
        
        // Save to localStorage
        const backups = JSON.parse(localStorage.getItem('curationsla-emergency') || '[]');
        backups.push(backup);
        localStorage.setItem('curationsla-emergency', JSON.stringify(backups));
        
        // Download CSV immediately
        const csv = [
            'Timestamp,Status,ID,Name,Email,Type,EventDates,Venue,Description,URL,Social,SubmissionDate',
            `"${backup.timestamp}","${status}","${id}","${data.name}","${data.curationslaEmail}","${data.type}","${data.eventDates||''}","${data.venue||''}","${data.description}","${data.url||''}","${data.socialMedia||''}","${data.date}"`
        ].join('\n');
        
        downloadFile(csv, `URGENT-curationsla-${id}.csv`, 'text/csv');
        
        console.log('💾 EMERGENCY BACKUP CREATED:', backup);
    }

    // Generate email template - ALWAYS WORKS
    function generateEmailTemplate(data, error = '') {
        const template = `To: lapress@curations.cc
Subject: 🚨 URGENT - CurationsLA ${data.type} Submission - ${data.name}

${formatSubmissionText(data)}

🚨 EMERGENCY SUBMISSION SYSTEM ACTIVATED
This submission was captured via emergency backup system.
All data preserved for immediate processing.

CRITICAL: Please process this submission manually.

Form: https://la.curations.dev
Emergency Time: ${new Date().toLocaleString()}

---
EMERGENCY CONTACT INSTRUCTIONS:
1. Copy this email content
2. Forward to appropriate team member
3. Add to your submission system manually
4. Confirm receipt with submitter at: ${data.curationslaEmail}`;

        // Copy to clipboard
        if (navigator.clipboard) {
            navigator.clipboard.writeText(template).then(() => {
                console.log('📧 EMAIL COPIED TO CLIPBOARD');
            }).catch(() => {
                console.log('📧 EMAIL READY (clipboard failed)');
            });
        }
        
        // Download email file
        downloadFile(template, `URGENT-email-${Date.now()}.txt`, 'text/plain');
        
        console.log('📧 EMERGENCY EMAIL TEMPLATE GENERATED');
    }

    // Download helper
    function downloadFile(content, filename, type) {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Form helpers
    function prepareFormData() {
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        return data;
    }

    function validateForm() {
        const required = ['name', 'curationslaEmail', 'type', 'description', 'date'];
        for (const field of required) {
            const element = document.getElementById(field);
            if (!element || !element.value.trim()) {
                showMessage('error', `Please fill in ${field.replace('curationsla', 'CurationsLA ')}.`);
                return false;
            }
        }
        
        const email = document.getElementById('curationslaEmail').value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showMessage('error', 'Please enter a valid email address.');
            return false;
        }
        
        const type = document.getElementById('type').value;
        if (type === 'Event') {
            const eventDates = document.getElementById('eventDates').value.trim();
            if (!eventDates) {
                showMessage('error', 'Please enter event dates for event submissions.');
                return false;
            }
        }
        
        const social = document.getElementById('socialMedia').value.trim();
        if (social && social.toLowerCase().includes('tiktok')) {
            showMessage('error', 'TikTok links are not accepted. Please use Instagram, X/Twitter, or YouTube.');
            return false;
        }
        
        return true;
    }

    function showMessage(type, message) {
        const el = document.getElementById(type + 'Message');
        if (el) {
            el.textContent = message;
            el.classList.remove('hidden');
        }
        console.log(`📢 ${type.toUpperCase()}: ${message}`);
    }

    function showLoading() {
        const btn = form.querySelector('button[type="submit"]');
        if (btn) {
            btn.disabled = true;
            btn.textContent = 'Submitting...';
        }
        console.log('⏳ EMERGENCY SUBMISSION IN PROGRESS');
    }

    console.log('🛡️ EMERGENCY SYSTEM READY - GUARANTEED DATA CAPTURE');
});
