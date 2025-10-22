import React, { useState } from 'react';
import { Shield, AlertCircle, Loader2, Moon, Sun, Github } from 'lucide-react';

export default function PhishingDetector() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('dark'); // 'dark' or 'light'

  const checkUrl = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (url.toLowerCase() === 'quit') {
      alert('Thank you for using the Phishing Detection System!');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('https://phishing-detector-backend-ahb5.onrender.com/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      });

      if (!response.ok) {
        throw new Error('Failed to check URL. Make sure the backend is running.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred while checking the URL');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkUrl();
    }
  };

  const setExampleUrl = (exampleUrl) => {
    setUrl(exampleUrl);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const themes = {
    dark: {
      bg: 'bg-gradient-to-br from-slate-900 to-slate-800',
      card: 'bg-slate-800 border-slate-700',
      input: 'bg-slate-900 border-slate-600 text-white placeholder-gray-500',
      text: 'text-white',
      textSecondary: 'text-gray-400',
      textMuted: 'text-gray-500',
      hover: 'hover:bg-slate-700',
      border: 'border-slate-700',
      resultBg: 'bg-slate-900'
    },
    light: {
      bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
      card: 'bg-white border-gray-200',
      input: 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-500',
      hover: 'hover:bg-gray-100',
      border: 'border-gray-200',
      resultBg: 'bg-gray-50'
    }
  };

  const t = themes[theme];

  return (
    <div className={`min-h-screen ${t.bg} p-8 transition-colors duration-300`}>
      <div className="max-w-5xl mx-auto">
        {/* Header with Theme Toggle */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-blue-600 p-3 rounded-xl shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className={`text-4xl font-bold ${t.text}`}>
                  Phishing Detection System
                </h1>
                <p className={`${t.textSecondary} text-sm mt-1`}>
                  AI-Powered URL Security Analysis
                </p>
              </div>
            </div>
          </div>
          
          <button
            onClick={toggleTheme}
            className={`${t.card} border p-3 rounded-xl ${t.hover} transition-all shadow-sm`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className={`w-6 h-6 ${t.text}`} />
            ) : (
              <Moon className="w-6 h-6 text-gray-900" />
            )}
          </button>
        </div>

        {/* Main Card */}
        <div className={`${t.card} border rounded-2xl shadow-xl p-8 mb-6`}>
          <div className="mb-6">
            <label className={`block ${t.text} font-semibold mb-3 text-lg`}>
              Enter URL for Analysis
            </label>
            <div className="relative">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="https://example.com/page"
                className={`w-full p-4 ${t.input} border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg transition-all`}
                disabled={loading}
              />
            </div>
          </div>

          <button
            onClick={checkUrl}
            disabled={loading}
            className="w-full bg-blue-600 text-white p-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-98"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin h-5 w-5" />
                Analyzing...
              </span>
            ) : (
              'Check URL'
            )}
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className={`${t.card} border rounded-2xl p-8 text-center mb-6`}>
            <Loader2 className="inline-block animate-spin h-12 w-12 text-blue-600 mb-4" />
            <p className={`${t.text} text-lg font-medium`}>Analyzing URL with DistilBERT model...</p>
            <p className={`${t.textSecondary} text-sm mt-2`}>This may take a few moments</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <p className="text-red-900 font-bold text-lg">Error</p>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="mb-6">
            <div className={`${t.card} border-4 rounded-2xl p-8 shadow-2xl ${
              result.is_phishing ? 'border-red-500' : 'border-green-500'
            }`}>
              <div className={`border-b ${t.border} pb-4 mb-6`}>
                <h2 className={`text-2xl font-bold ${t.text} flex items-center gap-2`}>
                  <Shield className="w-6 h-6" />
                  Analysis Results
                </h2>
              </div>

              {/* URL Display */}
              <div className={`mb-6 ${t.resultBg} rounded-xl p-4 border ${t.border}`}>
                <p className={`${t.textSecondary} text-sm font-medium mb-1`}>Analyzed URL</p>
                <p className={`${t.text} font-mono text-sm break-all`}>{result.url}</p>
              </div>

              {/* Main Prediction */}
              <div className={`rounded-xl p-8 mb-6 text-center border-2 ${
                result.is_phishing 
                  ? 'bg-red-50 border-red-300' 
                  : 'bg-green-50 border-green-300'
              }`}>
                <div className="text-6xl mb-3">
                  {result.is_phishing ? '⚠️' : '✅'}
                </div>
                <p className={`text-2xl font-bold mb-2 ${
                  result.is_phishing ? 'text-red-700' : 'text-green-700'
                }`}>
                  {result.is_phishing ? 'Phishing Detected' : 'Legitimate Site'}
                </p>
                <p className={`text-sm ${result.is_phishing ? 'text-red-600' : 'text-green-600'}`}>
                  {result.is_phishing ? 'This URL appears to be malicious' : 'This URL appears to be safe'}
                </p>
              </div>

              {/* Probabilities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-red-50 border-2 border-red-300 rounded-xl p-5">
                  <p className="text-red-700 text-sm font-semibold mb-2">Phishing Probability</p>
                  <p className="text-red-600 text-4xl font-bold">
                    {(result.phishing_probability * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-green-50 border-2 border-green-300 rounded-xl p-5">
                  <p className="text-green-700 text-sm font-semibold mb-2">Legitimate Probability</p>
                  <p className="text-green-600 text-4xl font-bold">
                    {(result.legitimate_probability * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className={`${t.resultBg} rounded-xl p-4 text-center border ${t.border}`}>
                  <p className={`${t.textSecondary} text-xs font-medium mb-2`}>Classification</p>
                  <p className={`${t.text} font-bold text-lg`}>{result.prediction}</p>
                </div>
                <div className={`${t.resultBg} rounded-xl p-4 text-center border ${t.border}`}>
                  <p className={`${t.textSecondary} text-xs font-medium mb-2`}>Confidence</p>
                  <p className={`${t.text} font-bold text-lg`}>{(result.confidence * 100).toFixed(1)}%</p>
                </div>
                <div className={`${t.resultBg} rounded-xl p-4 text-center border ${t.border}`}>
                  <p className={`${t.textSecondary} text-xs font-medium mb-2`}>Risk Level</p>
                  <p className={`font-bold text-lg ${
                    result.risk_level === 'HIGH RISK' ? 'text-red-600' :
                    result.risk_level === 'MEDIUM RISK' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {result.risk_level}
                  </p>
                </div>
              </div>

              {/* Recommendation */}
              <div className={`rounded-xl p-5 border-2 ${
                result.is_phishing
                  ? 'bg-red-50 border-red-300'
                  : 'bg-green-50 border-green-300'
              }`}>
                <p className={`text-sm font-semibold mb-1 ${
                  result.is_phishing ? 'text-red-900' : 'text-green-900'
                }`}>
                  Recommendation
                </p>
                <p className={`text-base font-bold ${
                  result.is_phishing ? 'text-red-700' : 'text-green-700'
                }`}>
                  {result.is_phishing 
                    ? '🛑 Do not visit this website or enter any personal information' 
                    : '✓ Proceed with normal security caution'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Example URLs */}
        <div className={`${t.card} border rounded-2xl p-6`}>
          <h3 className={`${t.text} font-bold mb-4 text-lg`}>Test with Example URLs</h3>
          <div className="space-y-3">
            <button
              onClick={() => setExampleUrl('www.dghjdgf.com/paypal.co.uk/cycgi-bin/webscrcmd=_home-customer&nav=1/loading.php')}
              className={`w-full text-left px-4 py-3 ${t.resultBg} ${t.hover} rounded-lg ${t.text} transition border ${t.border} font-mono text-sm`}
            >
              <span className="text-red-500 font-semibold mr-2">⚠</span>
              www.dghjdgf.com/paypal.co.uk/cycgi-bin/webscrcmd...
            </button>
            <button
              onClick={() => setExampleUrl('https://github.com/security/advisories')}
              className={`w-full text-left px-4 py-3 ${t.resultBg} ${t.hover} rounded-lg ${t.text} transition border ${t.border} font-mono text-sm`}
            >
              <span className="text-green-500 font-semibold mr-2">✓</span>
              https://github.com/security/advisories
            </button>
            <button
              onClick={() => setExampleUrl('http://paypal-secure-login.tk/verify-account')}
              className={`w-full text-left px-4 py-3 ${t.resultBg} ${t.hover} rounded-lg ${t.text} transition border ${t.border} font-mono text-sm`}
            >
              <span className="text-red-500 font-semibold mr-2">⚠</span>
              http://paypal-secure-login.tk/verify-account
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className={`${t.textSecondary} text-sm mb-3`}>
            Powered by DistilBERT Machine Learning Model
          </p>
          <a 
            href="https://github.com/Machireddyswathi/phishing-detection.git"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 ${t.textSecondary} hover:text-blue-500 transition-colors text-sm`}
          >
            <Github className="w-4 h-4" />
            View on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}