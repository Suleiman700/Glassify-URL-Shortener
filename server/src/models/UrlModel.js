const fs = require('fs').promises;
const { DB_PATH, DEFAULT_DB_STRUCTURE } = require('../config/database');

class UrlModel {
    static async initDB() {
        try {
            await fs.access(DB_PATH);
            // Verify and fix structure if needed
            const data = await this.getUrls();
            if (!data.urls || !data.userUrls) {
                await this.saveUrls(DEFAULT_DB_STRUCTURE);
            }
        } catch {
            await fs.writeFile(DB_PATH, JSON.stringify(DEFAULT_DB_STRUCTURE));
        }
    }

    static async getUrls() {
        try {
            const data = await fs.readFile(DB_PATH, 'utf8');
            const parsed = JSON.parse(data);
            // Ensure the structure is correct
            if (!parsed.urls || !parsed.userUrls) {
                return DEFAULT_DB_STRUCTURE;
            }
            return parsed;
        } catch (error) {
            return DEFAULT_DB_STRUCTURE;
        }
    }

    static async saveUrls(data) {
        // Ensure the structure is correct before saving
        const safeData = {
            urls: data.urls || {},
            userUrls: data.userUrls || {}
        };
        await fs.writeFile(DB_PATH, JSON.stringify(safeData, null, 2));
    }

    static async createUrl(shortId, url, clientIP) {
        const data = await this.getUrls();
        
        // Store URL with IP information
        data.urls[shortId] = {
            originalUrl: url,
            created: new Date().toISOString(),
            visits: 0,
            createdBy: clientIP
        };

        // Add to user's URLs
        if (!data.userUrls[clientIP]) {
            data.userUrls[clientIP] = [];
        }
        data.userUrls[clientIP].push(shortId);

        await this.saveUrls(data);
        return data.urls[shortId];
    }

    static async getUserUrls(clientIP) {
        const data = await this.getUrls();
        const userUrlIds = data.userUrls[clientIP] || [];
        return userUrlIds.map(shortId => ({
            shortId,
            ...data.urls[shortId]
        }));
    }

    static async getUrl(shortId) {
        const data = await this.getUrls();
        return data.urls[shortId];
    }

    static async incrementVisits(shortId) {
        const data = await this.getUrls();
        if (data.urls[shortId]) {
            data.urls[shortId].visits += 1;
            await this.saveUrls(data);
        }
        return data.urls[shortId];
    }

    static async deleteUrl(shortId, clientIP) {
        const data = await this.getUrls();
        
        if (!data.urls[shortId]) {
            return null;
        }

        if (data.urls[shortId].createdBy !== clientIP) {
            throw new Error('Not authorized to delete this URL');
        }

        // Remove from urls
        const deletedUrl = data.urls[shortId];
        delete data.urls[shortId];

        // Remove from user's URLs
        if (data.userUrls[clientIP]) {
            data.userUrls[clientIP] = data.userUrls[clientIP].filter(id => id !== shortId);
        }

        await this.saveUrls(data);
        return deletedUrl;
    }
}

module.exports = UrlModel;
