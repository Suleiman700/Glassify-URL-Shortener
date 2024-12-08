const express = require('express');
const router = express.Router();
const UrlController = require('../controllers/urlController');

// Create short URL
router.post('/shorten', UrlController.shortenUrl);

// Get user's URLs
router.get('/my-urls', UrlController.getMyUrls);

// Get URL stats
router.get('/stats/:shortId', UrlController.getUrlStats);

// Delete URL
router.delete('/urls/:shortId', UrlController.deleteUrl);

// Redirect to original URL
router.get('/:shortId', UrlController.redirectToUrl);

module.exports = router;
