const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');

// GET route - Display the form
router.get('/', formController.displayForm);

// POST route - Handle form submission
router.post('/submit', formController.submitForm);

// GET route - Get form schema
router.get('/schema', formController.getFormSchema);

module.exports = router;
