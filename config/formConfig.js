module.exports = {
  title: 'CurationsLA Event & Content Submission',
  description: 'Submit your events and content to CurationsLA',
  
  fields: [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      placeholder: 'Enter your name',
      description: 'Your full name'
    },
    {
      id: 'type',
      label: 'Type',
      type: 'select',
      required: true,
      options: ['Content', 'Event'],
      description: 'Select whether this is content or an event'
    },
    {
      id: 'eventDate',
      label: 'Event Date',
      type: 'date',
      required: false,
      conditional: { field: 'type', value: 'Event' },
      description: 'Date of the event (Event only)'
    },
    {
      id: 'venue',
      label: 'Venue',
      type: 'text',
      required: false,
      conditional: { field: 'type', value: 'Event' },
      placeholder: 'Enter venue name',
      description: 'Event venue (Event only)'
    },
    {
      id: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
      placeholder: 'Enter detailed description',
      rows: 6,
      description: 'Long form description of your event or content'
    },
    {
      id: 'media',
      label: 'Media',
      type: 'file',
      required: false,
      accept: 'image/*,video/*',
      description: 'Upload media files (images or videos)'
    },
    {
      id: 'url',
      label: 'URL',
      type: 'url',
      required: false,
      placeholder: 'https://example.com',
      description: 'Related URL or website link'
    },
    {
      id: 'socialMedia',
      label: 'Social Media',
      type: 'url',
      required: false,
      placeholder: 'https://instagram.com/yourprofile',
      description: 'Social media profile or post link'
    },
    {
      id: 'date',
      label: 'Date',
      type: 'date',
      required: true,
      description: 'Submission date'
    }
  ],
  
  backlinks: [
    {
      name: 'Curations LA',
      url: 'https://la.curations.cc',
      description: 'CurationsLA Portal'
    },
    {
      name: 'CURATIONS',
      url: 'https://curations.org',
      description: 'Main Curations Site'
    }
  ],
  
  styling: {
    primaryColor: '#FF6B6B',    // Coral red - typical LA vibrant color
    secondaryColor: '#4ECDC4',  // Turquoise - ocean/beach inspired
    accentColor: '#FFE66D',     // Sunny yellow
    backgroundColor: '#F7F7F7',
    textColor: '#2C3E50',
    borderColor: '#E0E0E0'
  }
};
