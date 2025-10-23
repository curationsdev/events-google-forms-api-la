# CurationsLA Event & Content Submission Form

Event and content submissions for CurationsLA using a custom form interface with Google Forms API integration.

## Overview

This application provides a custom web form hosted at `curations.dev/la` that enables CurationsLA to collect event and content submissions. The form features:

- Dynamic field visibility based on content type (Event vs Content)
- Google Forms API integration for submission handling
- Responsive design with LA-inspired color scheme
- File upload support for media
- Built-in validation and error handling

## Features

### Form Fields

- **Name** - Required text field
- **Type** - Required dropdown (Content or Event)
- **Event Date** - Date picker (Event only, conditional)
- **Venue** - Text field (Event only, conditional)
- **Description** - Required long-form textarea
- **Media** - File upload for images/videos
- **URL** - Optional link field
- **Social Media** - Optional social media link
- **Date** - Required submission date
- **Backlinks** - Links to la.curations.cc and curations.org

### Design

The form uses a vibrant color scheme inspired by la.curations.cc:
- Primary Color: Coral Red (#FF6B6B)
- Background Gradient: Cyan to Magenta (#40C9FF → #E81CFF)

## Prerequisites

- Node.js 16.0.0 or higher
- npm or yarn package manager
- Google Forms API key (to be set in environment variables)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/curationsdev/events-google-forms-api-la.git
cd events-google-forms-api-la
```

2. Install dependencies:
```bash
npm install
```

3. Create environment configuration:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
GOOGLE_FORMS_API_KEY=your_api_key_here
GOOGLE_FORM_ID=your_form_id_here
PORT=3000
NODE_ENV=development
HOST=localhost
```

## Usage

### Development Mode

Run the application with auto-reload:
```bash
npm run dev
```

### Production Mode

Run the application:
```bash
npm start
```

The application will be available at:
- Local: `http://localhost:3000/la`
- Health check: `http://localhost:3000/health`

## API Endpoints

### GET /la
Displays the submission form

### POST /la/submit
Handles form submission
- **Content-Type**: `application/json`
- **Returns**: `{ success: boolean, message: string, data: object }`

### GET /la/schema
Returns the form schema and configuration
- **Returns**: `{ title: string, description: string, fields: array, backlinks: array }`

### GET /health
Health check endpoint
- **Returns**: `{ status: string, message: string }`

## Deployment

### Environment Variables Configuration

In your hosting platform (GitHub Secrets, Vercel, Heroku, etc.), set the following environment variables:

- `GOOGLE_FORMS_API_KEY` - Your Google Forms API key
- `GOOGLE_FORM_ID` - The ID of your Google Form
- `PORT` - The port to run the server on (default: 3000)
- `NODE_ENV` - Set to `production` for production deployment
- `HOST` - Your domain (e.g., curations.dev)

### Domain Configuration

To host at `curations.dev/la`:

1. Configure your DNS settings to point to your hosting server
2. Set up reverse proxy (nginx/Apache) or hosting platform routing
3. Ensure SSL/TLS certificates are configured for HTTPS

Example nginx configuration:
```nginx
location /la {
    proxy_pass http://localhost:3000/la;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

### Vercel Deployment

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Configure environment variables in Vercel dashboard
4. Set up domain routing for `/la` path

### Heroku Deployment

1. Create a new Heroku app
2. Set environment variables:
```bash
heroku config:set GOOGLE_FORMS_API_KEY=your_key
heroku config:set GOOGLE_FORM_ID=your_form_id
```
3. Deploy:
```bash
git push heroku main
```

## Project Structure

```
events-google-forms-api-la/
├── config/
│   └── formConfig.js       # Form configuration and styling
├── controllers/
│   └── formController.js   # Request handlers
├── public/
│   ├── css/
│   │   └── styles.css      # Form styling
│   ├── js/
│   │   └── form.js         # Client-side logic
│   └── index.html          # Form HTML
├── routes/
│   └── formRoutes.js       # Route definitions
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── package.json            # Project dependencies
├── README.md               # Documentation
└── server.js               # Application entry point
```

## Google Forms API Integration

The application is designed to integrate with Google Forms API. To complete the integration:

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable the Google Forms API

2. **Generate API Credentials**
   - Create an API key in the Credentials section
   - Store the API key securely in your environment variables

3. **Create a Google Form**
   - Create a form with fields matching the application schema
   - Note the Form ID from the URL
   - Configure the form to accept responses

4. **Update Environment Variables**
   - Set `GOOGLE_FORMS_API_KEY` with your API key
   - Set `GOOGLE_FORM_ID` with your form ID

## Security Considerations

- API keys are stored in environment variables (never in code)
- Form validation on both client and server side
- CORS configured for security
- Input sanitization implemented
- File upload restrictions in place

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
- Open an issue on GitHub
- Contact: support@curations.dev

## Links

- [CurationsLA](https://la.curations.cc)
- [Curations Main Site](https://curations.org)
- [Form URL](https://curations.dev/la)
