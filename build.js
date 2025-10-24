#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Building CurationsLA Forms for GitHub Pages...\n');

// Create dist directory
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Copy and process HTML files
const publicDir = path.join(__dirname, 'public');
const htmlFiles = fs.readdirSync(publicDir).filter(file => file.endsWith('.html'));

htmlFiles.forEach(file => {
    const sourcePath = path.join(publicDir, file);
    const destPath = path.join(distDir, file);
    
    let content = fs.readFileSync(sourcePath, 'utf8');
    
    // Process the HTML (could add template replacements here if needed)
    fs.writeFileSync(destPath, content);
    console.log(`✅ Copied: ${file}`);
});

// Copy CSS directory
const cssSourceDir = path.join(publicDir, 'css');
const cssDestDir = path.join(distDir, 'css');

if (fs.existsSync(cssSourceDir)) {
    if (!fs.existsSync(cssDestDir)) {
        fs.mkdirSync(cssDestDir, { recursive: true });
    }
    
    const cssFiles = fs.readdirSync(cssSourceDir);
    cssFiles.forEach(file => {
        const sourcePath = path.join(cssSourceDir, file);
        const destPath = path.join(cssDestDir, file);
        fs.copyFileSync(sourcePath, destPath);
        console.log(`✅ Copied CSS: css/${file}`);
    });
}

// Process and copy JS files with environment variables
const jsSourceDir = path.join(publicDir, 'js');
const jsDestDir = path.join(distDir, 'js');

if (fs.existsSync(jsSourceDir)) {
    if (!fs.existsSync(jsDestDir)) {
        fs.mkdirSync(jsDestDir, { recursive: true });
    }
    
    const jsFiles = fs.readdirSync(jsSourceDir);
    jsFiles.forEach(file => {
        const sourcePath = path.join(jsSourceDir, file);
        const destPath = path.join(jsDestDir, file);
        
        let content = fs.readFileSync(sourcePath, 'utf8');
        
        // Inject environment variables into JavaScript
        const apiKey = process.env.GOOGLE_FORMS_API_KEY || '';
        const formId = process.env.GOOGLE_FORM_ID || '';
        
        // Replace placeholders in JS files
        content = content
            .replace(/\{\{GOOGLE_FORMS_API_KEY\}\}/g, apiKey)
            .replace(/\{\{GOOGLE_FORM_ID\}\}/g, formId);
        
        fs.writeFileSync(destPath, content);
        console.log(`✅ Processed JS: js/${file}`);
    });
}

// Create a config.js file with environment variables
const configContent = `
// Auto-generated configuration
window.CURATIONS_CONFIG = {
    GOOGLE_FORMS_API_KEY: '${process.env.GOOGLE_FORMS_API_KEY || ''}',
    GOOGLE_FORM_ID: '${process.env.GOOGLE_FORM_ID || ''}',
    ENVIRONMENT: 'production'
};
`;

fs.writeFileSync(path.join(distDir, 'config.js'), configContent);
console.log('✅ Created: config.js');

// Copy form configuration
const configDir = path.join(__dirname, 'config');
if (fs.existsSync(configDir)) {
    const formConfigPath = path.join(configDir, 'formConfig.js');
    if (fs.existsSync(formConfigPath)) {
        const formConfigContent = fs.readFileSync(formConfigPath, 'utf8');
        
        // Convert Node.js module to browser-compatible format
        let browserConfig = formConfigContent
            .replace('module.exports = ', 'window.FORM_CONFIG = ')
            .replace(/require\([^)]+\)/g, '{}'); // Remove any require statements
        
        fs.writeFileSync(path.join(distDir, 'form-config.js'), browserConfig);
        console.log('✅ Converted: form-config.js');
    }
}

console.log('\n🎉 Build completed successfully!');
console.log('📁 Static files are in the ./dist directory');
console.log('\n🔧 Next steps:');
console.log('1. Ensure GitHub Secrets are configured:');
console.log('   - GOOGLE_FORMS_API_KEY');
console.log('   - GOOGLE_FORM_ID');
console.log('2. Enable GitHub Pages in repository settings');
console.log('3. Push to trigger deployment');