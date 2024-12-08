import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

function App() {
  const [url, setUrl] = useState('');
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUrls, setLoadingUrls] = useState(true);
  const [error, setError] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [deletingIds, setDeletingIds] = useState(new Set());
  const [showSuccess, setShowSuccess] = useState(false);

  const particlesInit = useCallback(async engine => {
    await loadFull(engine);
  }, []);

  const particlesOptions = {
    particles: {
      number: {
        value: 50,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: "#ffffff"
      },
      opacity: {
        value: 0.2
      },
      size: {
        value: 3
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        bounce: false,
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "repulse"
        }
      }
    },
    retina_detect: true
  };

  useEffect(() => {
    fetchMyUrls();
  }, []);

  const fetchMyUrls = async () => {
    try {
      const response = await axios.get('http://localhost:5020/my-urls');
      setUrls(response.data);
    } catch (err) {
      console.error('Failed to fetch URLs:', err);
    } finally {
      setLoadingUrls(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShortUrl('');
    setCopyStatus('');
    setShowSuccess(false);

    try {
      const response = await axios.post('http://localhost:5020/shorten', { url });
      setShortUrl(response.data.shortUrl);
      setShowSuccess(true);
      fetchMyUrls();
      setUrl(''); // Clear input after success
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (shortId) => {
    try {
      setDeletingIds(prev => new Set([...prev, shortId]));
      await axios.delete(`http://localhost:5020/urls/${shortId}`);
      await fetchMyUrls();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete URL');
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(shortId);
        return newSet;
      });
    }
  };

  const copyToClipboard = async (urlToCopy) => {
    try {
      await navigator.clipboard.writeText(urlToCopy);
      setCopyStatus(urlToCopy);
      setTimeout(() => setCopyStatus(''), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-10 flex flex-col justify-center relative overflow-hidden sm:py-20">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0"
      />
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-100 mb-3 drop-shadow-2xl">URL Shortener</h1>
          <p className="text-lg font-medium text-indigo-100 tracking-wide">Transform your long URLs into short, memorable links</p>
        </div>

        <div className="relative">
          <div className="relative backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_70px_-15px_rgba(0,0,0,0.3)] p-10 z-10 border border-white/20">
            {/* URL Input Form */}
            <div className="bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-xl rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8 mb-8 border border-white/40">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative group">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter your URL here..."
                    className="w-full px-6 py-5 text-base bg-white/80 backdrop-blur-xl rounded-xl border-0 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.08)] focus:shadow-[0_2px_15px_-3px_rgba(99,102,241,0.25)] focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 placeholder:text-gray-400"
                    required
                  />
                  {loading && (
                    <div className="absolute right-5 top-1/2 -translate-y-1/2">
                      <svg className="animate-spin h-6 w-6 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-5 px-6 text-base rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 shadow-[0_10px_20px_-5px_rgba(79,70,229,0.4)] hover:shadow-[0_20px_25px_-5px_rgba(79,70,229,0.4),0_10px_10px_-5px_rgba(79,70,229,0.04)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0"
                >
                  {loading ? 'Shortening...' : 'Shorten URL'}
                </button>
              </form>

              {error && (
                <div className="mt-6 p-4 bg-red-50/60 backdrop-blur-xl rounded-xl border border-red-100/50 shadow-sm">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              {showSuccess && shortUrl && (
                <div className="mt-6 p-4 bg-green-50/60 backdrop-blur-xl rounded-xl border border-green-100/50 shadow-sm animate-fade-in">
                  <p className="text-green-800 font-semibold mb-3 text-base">URL shortened successfully! 🎉</p>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={shortUrl}
                      readOnly
                      className="flex-1 p-3 bg-white/70 backdrop-blur-xl rounded-xl border-0 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 text-sm font-medium"
                    />
                    <button
                      onClick={() => copyToClipboard(shortUrl)}
                      className="p-3 text-green-700 hover:text-green-800 hover:bg-green-50/60 rounded-lg backdrop-blur-xl transition-all duration-300 hover:scale-105"
                      title={copyStatus === shortUrl ? "Copied!" : "Copy URL"}
                    >
                      {copyStatus === shortUrl ? (
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* URL History */}
            <div className="bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-xl rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8 border border-white/40">
              <h2 className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6">Your Shortened URLs</h2>
              
              {loadingUrls ? (
                <div className="flex justify-center py-10">
                  <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : urls.length > 0 ? (
                <div className="space-y-4">
                  {urls.map((item) => (
                    <div
                      key={item.shortId}
                      className="group bg-gradient-to-br from-white/95 to-white/90 rounded-xl border border-white/40 p-6 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span className="font-medium">{formatDate(item.created)}</span>
                          <span className="flex items-center space-x-1.5">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span className="font-medium">{item.visits}</span>
                          </span>
                        </div>
                        <a
                          href={item.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 text-sm truncate hover:text-gray-800 transition-colors duration-200"
                        >
                          {item.originalUrl}
                        </a>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <a
                              href={item.shortUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-700 text-base font-semibold transition-colors duration-200"
                            >
                              {item.shortUrl}
                            </a>
                            <button
                              onClick={() => copyToClipboard(item.shortUrl)}
                              className="p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50/60 rounded-lg backdrop-blur-xl transition-all duration-300 hover:scale-105"
                              title={copyStatus === item.shortUrl ? "Copied!" : "Copy URL"}
                            >
                              {copyStatus === item.shortUrl ? (
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                              )}
                            </button>
                          </div>
                          <button
                            onClick={() => handleDelete(item.shortId)}
                            disabled={deletingIds.has(item.shortId)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50/60 rounded-lg backdrop-blur-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                            title="Delete URL"
                          >
                            {deletingIds.has(item.shortId) ? (
                              <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <h3 className="mt-2 text-base font-medium text-gray-900">No shortened URLs</h3>
                  <p className="mt-1 text-base text-gray-500">Get started by shortening your first URL above.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;