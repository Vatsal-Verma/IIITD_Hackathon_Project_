import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import pat from './side.png';
import './MedicineAnalyzer.css';

const MedicineAnalyzer = () => {
  const [image, setImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [symptom, setSymptom] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [recommending, setRecommending] = useState(false);

  const cleanRawText = (text) => {
    return text
      .split('\n')
      .map(line => line.trim().replace(/\s+/g, ' '))
      .filter(line => line.length > 0 && !/^[0-9\s\W]+$/.test(line))
      .map(line => line.charAt(0).toUpperCase() + line.slice(1))
      .filter((line, index, self) => self.indexOf(line) === index)
      .join('\n');
  };

  const callGeminiApi = async (text) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCBK0u-gNPO_zWGG8y7YDrKIRJMmi-mVgA`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are a JSON-only API. Extract the following fields from the given medicine text and return ONLY valid JSON (no markdown, no commentary).

Text: """${text}"""

Return JSON:
{
  "medicineInfo": { "name": string, "brand": string, "type": string, "dosage": string },
  "saltComposition": [{ "name": string, "percentage": string }],
  "useCases": [string],
  "descriptions": [string]
}`
                  },
                ],
              },
            ],
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      let raw = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
      raw = raw.trim().replace(/^```json\s*|```$/g, '');
      const jsonText = raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1);
      return JSON.parse(jsonText);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Gemini API error:', error.message);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      
      return {
        medicineInfo: { name: 'Unknown', brand: 'Unknown', type: 'Unknown', dosage: 'Unknown' },
        saltComposition: [{ name: 'Unknown', percentage: 'Unknown' }],
        useCases: ['No use cases identified'],
        descriptions: ['Failed to parse Gemini response'],
      };
    }
  };

  const parseMedicineText = async (text) => {
    const geminiResponse = await callGeminiApi(text);
    return {
      medicineInfo: geminiResponse.medicineInfo,
      saltComposition: geminiResponse.saltComposition,
      useCases: geminiResponse.useCases,
      descriptions: geminiResponse.descriptions,
      rawText: cleanRawText(text),
    };
  };

  const getMedicineRecommendations = async (symptomText) => {
    setRecommending(true);
    setRecommendations([]);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCBK0u-gNPO_zWGG8y7YDrKIRJMmi-mVgA`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Suggest 3 over-the-counter medicines or treatments for the symptom: "${symptomText}".
Respond only with pure JSON array format, no markdown.

[
  { "name": "Medicine1", "purpose": "Treats headache", "note": "Take after food", "best": true },
  { "name": "Medicine2", "purpose": "Alternate option", "note": "Avoid alcohol", "best": false },
  { "name": "Medicine3", "purpose": "Another option", "note": "Use with caution", "best": false }
]`
                  }
                ]
              }
            ]
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      let raw = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
      raw = raw.trim().replace(/^```json\s*|```$/g, '');
      const jsonText = raw.slice(raw.indexOf('['), raw.lastIndexOf(']') + 1);

      setRecommendations(JSON.parse(jsonText));
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('Recommendation Error:', err.message);
      
      if (err.name === 'AbortError') {
        setRecommendations([
          { name: 'Paracetamol', purpose: 'General pain relief', note: 'Take as needed', best: true },
          { name: 'Ibuprofen', purpose: 'Anti-inflammatory', note: 'Take with food', best: false },
          { name: 'Consult a doctor', purpose: 'For severe symptoms', note: 'Professional advice recommended', best: false }
        ]);
      } else {
        setRecommendations([
          { name: 'Paracetamol', purpose: 'General pain relief', note: 'Take as needed', best: true },
          { name: 'Ibuprofen', purpose: 'Anti-inflammatory', note: 'Take with food', best: false },
          { name: 'Consult a doctor', purpose: 'For severe symptoms', note: 'Professional advice recommended', best: false }
        ]);
      }
    } finally {
      setRecommending(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImage(URL.createObjectURL(file));
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const { data: { text } } = await Tesseract.recognize(file, 'eng', {
        logger: (m) => console.log(m),
      });

      if (!text) throw new Error('No text detected in the image');

      setRawText(cleanRawText(text));
      const parsedData = await parseMedicineText(text);
      setAnalysis(parsedData);
    } catch (err) {
      setError('Failed to analyze the medicine. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    setAnalysis(null);
    setError(null);
    setRawText('');
  };

  return (
    <div className="medicine-analyzer-container">
      <div className="medicine-analyzer-header">
        <div className="header-content">
          <div className="header-icon">💊</div>
          <div className="header-text">
            <h1>Medicine Analyzer</h1>
            <p>Upload a medicine image to extract its information and get AI-powered recommendations</p>
          </div>
        </div>
      </div>

      <div className="medicine-analyzer-main">
        <div className="upload-section">
          <div className="section-title">
            <h3>📸 Upload Medicine Image</h3>
            <p>Take a clear photo of the medicine packaging or label</p>
          </div>

          <div className="upload-area" onClick={() => document.getElementById('medicine-upload').click()}>
            <div className="upload-icon">📷</div>
            <div className="upload-text">
              <h4>Click to upload or drag & drop</h4>
              <p>Supports JPG, PNG, GIF up to 10MB</p>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="file-input" 
              id="medicine-upload" 
            />
          </div>

          {image && (
            <div className="image-preview">
              <img src={image} alt="Preview" className="preview-image" />
              <button className="remove-btn" onClick={removeImage}>
                Remove Image
              </button>
            </div>
          )}

          {loading && (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <span>Analyzing medicine image...</span>
            </div>
          )}

          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>

        <div className="analysis-section">
          <div className="section-title">
            <h3>🔍 Analysis Results</h3>
            <p>Extracted information and recommendations</p>
          </div>

          {analysis ? (
            <div className="analysis-results">
              <div className="result-item">
                <div className="result-title">📄 Scanned Text</div>
                <div className="result-content">
                  <pre>{analysis.rawText || 'No readable text found in the image.'}</pre>
                </div>
              </div>

              <div className="result-item">
                <div className="result-title">💊 Medicine Information</div>
                <div className="result-content">
                  <p><strong>Name:</strong> {analysis.medicineInfo.name}</p>
                  <p><strong>Brand:</strong> {analysis.medicineInfo.brand}</p>
                  <p><strong>Type:</strong> {analysis.medicineInfo.type}</p>
                  <p><strong>Dosage:</strong> {analysis.medicineInfo.dosage}</p>
                </div>
              </div>

              <div className="result-item">
                <div className="result-title">🧪 Salt Composition</div>
                <div className="result-content">
                  {analysis.saltComposition.map((s, i) => (
                    <p key={i}><strong>{s.name}:</strong> {s.percentage}</p>
                  ))}
                </div>
              </div>

              <div className="result-item">
                <div className="result-title">📋 Use Cases</div>
                <div className="result-content">
                  <ul>
                    {analysis.useCases.map((u, i) => <li key={i}>{u}</li>)}
                  </ul>
                </div>
              </div>

              <div className="result-item">
                <div className="result-title">⚠️ Precautions & Side Effects</div>
                <div className="result-content">
                  <ul>
                    {analysis.descriptions.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="upload-area">
              <div className="upload-icon">🔍</div>
              <div className="upload-text">
                <h4>No analysis yet</h4>
                <p>Upload an image to see the analysis results</p>
              </div>
            </div>
          )}

          <div className="recommendation-section">
            <div className="section-title">
              <h3>💡 Get Medicine Recommendations</h3>
              <p>Enter your symptoms for personalized suggestions</p>
            </div>

            <div className="recommendation-inputs">
              <input
                type="text"
                className="symptom-input"
                placeholder="Enter a symptom (e.g., headache, fever, cough)"
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
              />
              <button
                className="analyze-btn"
                onClick={() => getMedicineRecommendations(symptom)}
                disabled={!symptom || recommending}
              >
                {recommending ? (
                  <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <span>Getting recommendations...</span>
                  </div>
                ) : (
                  "Get Recommendations"
                )}
              </button>
            </div>

            {recommendations.length > 0 && (
              <div className="recommendation-list">
                {recommendations.map((rec, index) => (
                  <div key={index} className={`result-item ${rec.best ? 'best-recommend' : ''}`}>
                    <div className="result-title">
                      {rec.name} {rec.best && <span className="best-tag">⭐ Best</span>}
                    </div>
                    <div className="result-content">
                      <p><strong>Purpose:</strong> {rec.purpose}</p>
                      <p><strong>Note:</strong> {rec.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineAnalyzer;
