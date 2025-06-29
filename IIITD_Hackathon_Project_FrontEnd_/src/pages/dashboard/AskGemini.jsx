import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Button, CircularProgress, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import axios from 'axios';
import './AskGemini.css'

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#667eea',
      paper: '#ffffff',
    },
    text: {
      primary: '#2d3748',
    },
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
});

function Email() { 
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post("https://email-assist-4.onrender.com/api/email/generate", {
       emailContent,
       tone 
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setError('Failed to generate email reply. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedReply);
  };

  return (
    <div className="doctor-ai-container">
      <div className="doctor-ai-card">
        <div className="doctor-ai-header">
          <div className="header-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.36 14.83C16.36 15.33 15.96 15.73 15.46 15.73H8.54C8.04 15.73 7.64 15.33 7.64 14.83V9.17C7.64 8.67 8.04 8.27 8.54 8.27H15.46C15.96 8.27 16.36 8.67 16.36 9.17V14.83Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="header-text">
            <h1>Doctor AI Assistant</h1>
            <p>Get professional medical advice and responses to your health questions</p>
          </div>
        </div>

        <div className="doctor-ai-content">
          <div className="input-section">
            <div className="input-group">
              <label htmlFor="question">Ask Your Doctor</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17 13H7V11H17V13ZM13 17H7V15H13V17ZM7 7V9H17V7H7Z" fill="currentColor"/>
                </svg>
                <textarea
                  id="question"
                  placeholder="Describe your symptoms, ask medical questions, or seek health advice..."
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  className="question-input"
                  rows={6}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="tone">Response Tone (Optional)</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.1 6 14 6.9 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6ZM12 20C9.33 20 7 17.67 7 15H17C17 17.67 14.67 20 12 20Z" fill="currentColor"/>
                </svg>
                <select
                  id="tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="tone-select"
                >
                  <option value="">Select tone (optional)</option>
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="friendly">Friendly</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!emailContent || loading}
              className="generate-btn"
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
                  </svg>
                  Generate Response
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="error-message">
              <div className="error-icon">⚠</div>
              <p>{error}</p>
            </div>
          )}

          {generatedReply && (
            <div className="response-section">
              <div className="response-header">
                <h3>AI Doctor Response</h3>
                <button onClick={handleCopyToClipboard} className="copy-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
                  </svg>
                  Copy
                </button>
              </div>
              <div className="response-content">
                <p>{generatedReply}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Email;