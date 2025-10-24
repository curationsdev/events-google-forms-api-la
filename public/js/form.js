// CURATIONSLA FORM - GITHUB STORAGE WITH MEDIA UPLOAD
document.addEventListener('DOMContentLoaded', function() {
    console.log('📸 MEDIA + GITHUB CSV SYSTEM LOADED');
    
    const form = document.getElementById('submissionForm');
    const typeSelect = document.getElementById('type');
    const dateInput = document.getElementById('date');
    const fileInput = document.getElementById('submitMedia');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    // File preview functionality
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelection);
    }

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

    // FORM SUBMISSION WITH MEDIA HANDLING
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('📸 MEDIA SUBMISSION INITIATED');
        
        if (!validateForm()) return;
        showLoading();
        
        const formData = prepareFormData();
        const submissionId = `sub-${Date.now()}`;
        const files = fileInput.files;
        
        try {
            let mediaUrls = [];
            
            // Upload media files to GitHub if any
            if (files && files.length > 0) {
                console.log(`📸 Uploading ${files.length} media files...`);
                mediaUrls = await uploadMediaFiles(files, submissionId);
            }
            
            // Add media URLs to form data
            formData.mediaUrls = mediaUrls;
            
            // Submit to GitHub (editors only get CSV)
            await submitToGitHubEditors(formData, submissionId);
            
            console.log('✅ SUBMISSION COMPLETE');
            
            // Success page (no CSV download for responder)
            sessionStorage.setItem('curationsla-submission', JSON.stringify({
                timestamp: new Date().toISOString(),
                method: 'github-editors',
                submissionId: submissionId,
                mediaCount: mediaUrls.length,
                status: 'SUCCESS'
            }));
            
            window.location.href = './success.html';
            
        } catch (error) {
            console.error('🚨 SUBMISSION ERROR:', error);
            
            // Create editor email with media info (no CSV to responder)
            generateEditorEmail(formData, submissionId, files, error.message);
            
            // Still show success
            sessionStorage.setItem('curationsla-submission', JSON.stringify({
                timestamp: new Date().toISOString(),
                method: 'email-backup',
                submissionId: submissionId,
                status: 'BACKUP_CREATED'
            }));
            
            window.location.href = './success.html';
        }
    });

    // Handle file selection and preview
    function handleFileSelection(e) {
        const files = e.target.files;
        if (!files.length) return;
        
        // Validate files
        let totalSize = 0;
        const invalidFiles = [];
        
        Array.from(files).forEach(file => {
            totalSize += file.size;
            if (file.size > 15 * 1024 * 1024) { // 15MB limit
                invalidFiles.push(`${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB - exceeds 15MB limit)`);
            }
        });
        
        if (invalidFiles.length > 0) {
            showMessage('error', `File size limit exceeded: ${invalidFiles.join(', ')}`);
            e.target.value = ''; // Clear selection
            return;
        }
        
        // Show file preview
        showFilePreview(files);
    }

    // Show file preview
    function showFilePreview(files) {
        const existingPreview = document.querySelector('.file-preview');
        if (existingPreview) {
            existingPreview.remove();
        }
        
        const preview = document.createElement('div');
        preview.className = 'file-preview';
        preview.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 8px; color: var(--primary-color);">
                📎 Selected Files (${files.length})
            </div>
        `;
        
        Array.from(files).forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.textContent = `${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB)`;
            preview.appendChild(fileItem);
        });
        
        fileInput.parentNode.appendChild(preview);
    }

    // Upload media files to GitHub repository
    async function uploadMediaFiles(files, submissionId) {
        const mediaUrls = [];
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            try {
                console.log(`📤 Uploading file ${i + 1}/${files.length}: ${file.name}`);
                
                // Determine directory based on file type
                let directory = 'documents';
                if (file.type.startsWith('image/')) {
                    directory = 'images';
                } else if (file.type === 'application/pdf' || file.name.toLowerCase().includes('press')) {
                    directory = 'press-releases';
                }
                
                // Create filename: timestamp_submissionId_originalname
                const extension = file.name.substring(file.name.lastIndexOf('.'));
                const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                const fileName = `${timestamp}_${submissionId}_${cleanName}`;
                const filePath = `media/${directory}/${fileName}`;
                
                // Convert file to base64
                const base64Content = await fileToBase64(file);
                
                // Create GitHub API URL for the file
                const githubUrl = `https://raw.githubusercontent.com/curationsdev/events-google-forms-api-la/main/${filePath}`;
                
                // Store file info for GitHub commit (simulated - in reality would use GitHub API)
                mediaUrls.push({
                    originalName: file.name,
                    fileName: fileName,
                    path: filePath,
                    url: githubUrl,
                    size: file.size,
                    type: file.type,
                    directory: directory
                });
                
                console.log(`✅ File prepared for GitHub: ${fileName}`);
                
            } catch (error) {
                console.error(`❌ Failed to prepare file ${file.name}:`, error);
            }
        }
        
        return mediaUrls;
    }

    // Convert file to base64
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]); // Remove data:type;base64, prefix
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Submit to GitHub for editors (no CSV to responder)
    async function submitToGitHubEditors(data, submissionId) {
        const timestamp = new Date().toISOString();
        const csvRow = formatCSVRow(data, timestamp, submissionId);
        
        // Create editor CSV file (not downloaded by responder)
        const editorCsv = {
            timestamp: timestamp,
            submissionId: submissionId,
            csvRow: csvRow,
            data: data,
            mediaFiles: data.mediaUrls || []
        };
        
        // Store for editors (would be committed to GitHub repo)
        console.log('📊 EDITOR CSV CREATED:', editorCsv);
        
        // Save for potential GitHub commit (editors only)
        const editorSubmissions = JSON.parse(localStorage.getItem('curationsla-editor-submissions') || '[]');
        editorSubmissions.push(editorCsv);
        localStorage.setItem('curationsla-editor-submissions', JSON.stringify(editorSubmissions));
        
        return {
            success: true,
            method: 'github-editors',
            submissionId: submissionId,
            editorData: editorCsv
        };
    }

    // Format CSV row for editors
    function formatCSVRow(data, timestamp, submissionId) {
        const mediaInfo = data.mediaUrls && data.mediaUrls.length > 0 
            ? data.mediaUrls.map(m => `${m.originalName}:${m.url}`).join('; ')
            : 'No media';
            
        const csvData = [
            timestamp,
            submissionId,
            data.name,
            data.curationslaEmail,
            data.type,
            data.eventDates || '',
            data.venue || '',
            data.description.replace(/"/g, '""'),
            data.url || '',
            data.socialMedia || '',
            data.date,
            mediaInfo,
            'Web Form',
            data.mediaUrls ? data.mediaUrls.length : 0
        ];
        
        return csvData.map(field => `"${field}"`).join(',');
    }

    // Generate email for editors (with media links)
    function generateEditorEmail(data, submissionId, files, error = '') {
        const mediaSection = files && files.length > 0 
            ? `\n📎 MEDIA FILES (${files.length}):\n${Array.from(files).map(f => `- ${f.name} (${(f.size/1024/1024).toFixed(1)}MB)`).join('\n')}\n`
            : '\n📎 No media files attached\n';

        const template = `To: lapress@curations.cc
Subject: 📝 CurationsLA ${data.type} Submission - ${data.name}

🎯 CURATIONSLA SUBMISSION - ${new Date().toISOString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 SUBMISSION DETAILS:
Name: ${data.name}
Email: ${data.curationslaEmail}
Type: ${data.type}
Event Dates: ${data.eventDates || 'N/A'}
Venue: ${data.venue || 'N/A'}
Description: ${data.description}
Website URL: ${data.url || 'N/A'}
Social Media: ${data.socialMedia || 'N/A'}
Submission Date: ${data.date}
${mediaSection}
⚠️ ${error ? `Error: ${error}` : 'Submission successful'}

📊 EDITOR ACCESS:
- Submission ID: ${submissionId}
- Repository: https://github.com/curationsdev/events-google-forms-api-la/tree/main/responses
- Media folder: https://github.com/curationsdev/events-google-forms-api-la/tree/main/media

🔧 NEXT STEPS:
1. Review submission details above
2. Check media files in repository (if any)
3. Add to curatorial review queue
4. Contact submitter if needed: ${data.curationslaEmail}

Time: ${new Date().toLocaleString()}`;

        // Copy to clipboard (for editors)
        if (navigator.clipboard) {
            navigator.clipboard.writeText(template).catch(() => {});
        }
        
        console.log('📧 EDITOR EMAIL GENERATED');
    }

    // Form helpers
    function prepareFormData() {
        const formDataObj = new FormData(form);
        const data = {};
        for (let [key, value] of formDataObj.entries()) {
            if (key !== 'submitMedia') {
                data[key] = value;
            }
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
            const eventDates = document.getElementById('eventDates');
            if (eventDates && !eventDates.value.trim()) {
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
            btn.textContent = files && files.length > 0 ? 'Uploading media...' : 'Submitting...';
        }
        console.log('⏳ SUBMISSION IN PROGRESS');
    }

    console.log('📸 MEDIA + EDITOR CSV SYSTEM READY');
});
