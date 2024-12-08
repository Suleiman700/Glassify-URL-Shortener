const { nanoid } = require('nanoid');
const UrlModel = require('../models/UrlModel');
const { getClientIP } = require('../utils/ipUtils');

class UrlController {
    static async shortenUrl(req, res) {
        try {
            const { url } = req.body;
            if (!url) {
                return res.status(400).json({ error: 'URL is required' });
            }

            // Check if the URL is from our own service
            const serverUrl = `${req.protocol}://${req.get('host')}/`;
            if (url.startsWith(serverUrl)) {
                return res.status(400).json({ 
                    error: 'Cannot shorten URLs that are already shortened by this service'
                });
            }

            const shortId = nanoid(6);
            const clientIP = getClientIP(req);
            
            await UrlModel.createUrl(shortId, url, clientIP);
            
            res.json({
                shortId,
                shortUrl: `${req.protocol}://${req.get('host')}/${shortId}`
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async getMyUrls(req, res) {
        try {
            const clientIP = getClientIP(req);
            const userUrls = await UrlModel.getUserUrls(clientIP);
            
            const urlsWithShortUrl = userUrls.map(url => ({
                ...url,
                shortUrl: `${req.protocol}://${req.get('host')}/${url.shortId}`
            }));

            res.json(urlsWithShortUrl);
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async redirectToUrl(req, res) {
        try {
            const { shortId } = req.params;
            const url = await UrlModel.getUrl(shortId);

            if (!url) {
                return res.status(404).json({ error: 'URL not found' });
            }

            await UrlModel.incrementVisits(shortId);
            res.redirect(url.originalUrl);
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async getUrlStats(req, res) {
        try {
            const { shortId } = req.params;
            const url = await UrlModel.getUrl(shortId);

            if (!url) {
                return res.status(404).json({ error: 'URL not found' });
            }

            res.json(url);
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async deleteUrl(req, res) {
        try {
            const { shortId } = req.params;
            const clientIP = getClientIP(req);
            
            const deletedUrl = await UrlModel.deleteUrl(shortId, clientIP);
            
            if (!deletedUrl) {
                return res.status(404).json({ error: 'URL not found' });
            }

            res.json({ message: 'URL deleted successfully' });
        } catch (error) {
            if (error.message === 'Not authorized to delete this URL') {
                return res.status(403).json({ error: error.message });
            }
            res.status(500).json({ error: 'Server error' });
        }
    }
}

module.exports = UrlController;
