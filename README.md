# 🌟 Glass-themed URL Shortener

A modern, elegant URL shortener with a stunning glassmorphism design. Built with React, Node.js, and Tailwind CSS, this application offers a beautiful user interface while providing powerful URL shortening capabilities.

![screencapture-localhost-3001-2024-12-09-01_28_35](https://github.com/user-attachments/assets/4ef5e819-fc23-4468-b42b-8c3cceba51ae)

## ✨ Features

- **Beautiful Glassmorphism Design**: Modern UI with frosted glass effects and smooth animations
- **URL Shortening**: Generate short, memorable URLs
- **Visit Tracking**: Track the number of visits for each shortened URL
- **IP-Based History**: Automatically save and display your URL history based on IP
- **Interactive Particles**: Dynamic background with interactive particle effects
- **Responsive Design**: Fully responsive layout that works on all devices
- **Copy to Clipboard**: One-click copying of shortened URLs
- **Delete URLs**: Remove URLs from your history

## 🛠️ Tech Stack

- **Frontend**:
  - React (Create React App)
  - Tailwind CSS for styling
  - React Particles for background effects
  - Axios for API requests

- **Backend**:
  - Node.js
  - Express.js
  - JSON file-based storage
  - nanoid for generating short URLs

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd url-shortener
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Start the development servers:

```bash
# Start backend server (from server directory)
npm run dev

# Start frontend development server (from client directory)
npm start
```

The application will be available at `http://localhost:3000`, with the backend running on `http://localhost:5020`.

## 🎨 Design Features

- **Glassmorphism Effects**: Sophisticated blur and transparency effects
- **Gradient Backgrounds**: Beautiful color transitions
- **Interactive Elements**: Hover animations and smooth transitions
- **Modern Typography**: Clean and readable text hierarchy
- **Responsive Cards**: Elegant card design with glass effects
- **Dynamic Particles**: Interactive background particles

## 📝 API Endpoints

- `POST /shorten`: Create a shortened URL
- `GET /urls`: Get URL history for current IP
- `DELETE /urls/:id`: Delete a shortened URL
- `GET /:shortId`: Redirect to original URL

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Tailwind CSS for the amazing utility-first CSS framework
- React Particles for the beautiful background effects
- The glassmorphism design trend for inspiration
