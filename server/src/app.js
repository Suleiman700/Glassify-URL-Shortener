const express = require('express');
const cors = require('cors');
const urlRoutes = require('./routes/urlRoutes');
const UrlModel = require('./models/UrlModel');

const app = express();
const PORT = 5020;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', urlRoutes);

// Initialize and start server
async function startServer() {
    try {
        await UrlModel.initDB();
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
