import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import pat from './side.png';
import './MedicineAnalyzer.css';

const apiKey = 'YOUR_GEMINI_API_KEY';

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
        }
      );

      const result = await response.json();
      let raw = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
      raw = raw.trim().replace(/^```json\s*|```$/g, '');
      const jsonText = raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1);
      return JSON.parse(jsonText);
    } catch (error) {
      console.error('Gemini API error:', error.message);
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
        }
      );

      const result = await response.json();
      let raw = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
      raw = raw.trim().replace(/^```json\s*|```$/g, '');
      const jsonText = raw.slice(raw.indexOf('['), raw.lastIndexOf(']') + 1);

      setRecommendations(JSON.parse(jsonText));
    } catch (err) {
      console.error('Recommendation Error:', err.message);
      setRecommendations([{ name: 'Unknown', purpose: 'Error', note: 'Try again later', best: false }]);
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

  return (
    <div className="medicine-analyzer">
      <div className="pat"><img src={pat} alt="" /></div>
      <div className="pat1"><img src={pat} alt="" /></div>

      <h1 className="analyzer-title">Medicine Analyzer</h1>
      <p className="para">Upload a medicine image to extract its information. You can also get medicine suggestions based on your symptoms.</p>

      <div className="upload-section">
        <input type="file" accept="image/*" onChange={handleImageUpload} className="upload-input" id="medicine-upload" />
        <label htmlFor="medicine-upload" className="upload-label">Upload Medicine Photo</label>
        {image && <div className="preview-container"><img src={image} alt="Preview" className="preview-image" /></div>}
      </div>

      {loading && <p className="loading">Analyzing...</p>}
      {error && <p className="error">{error}</p>}

      {analysis && (
        <div className="analysis-grid">
          <div className="analysis-card">
            <h2>📄 Scanned Text</h2>
            <pre className="raw-text">{analysis.rawText || 'No readable text found in the image.'}</pre>
          </div>

          <div className="analysis-card">
            <h2>💊 Medicine Report</h2>

            <section>
              <h3>🧾 Basic Info</h3>
              <ul>
                <li><strong>Name:</strong> {analysis.medicineInfo.name}</li>
                <li><strong>Brand:</strong> {analysis.medicineInfo.brand}</li>
                <li><strong>Type:</strong> {analysis.medicineInfo.type}</li>
                <li><strong>Dosage:</strong> {analysis.medicineInfo.dosage}</li>
              </ul>
            </section>

            <section>
              <h3>🧪 Salt Composition</h3>
              <ul>
                {analysis.saltComposition.map((s, i) => (
                  <li key={i}><strong>{s.name}:</strong> {s.percentage}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3>📋 Use Cases</h3>
              <ul>{analysis.useCases.map((u, i) => <li key={i}>{u}</li>)}</ul>
            </section>

            <section>
              <h3>📌 Precautions / Side Effects</h3>
              <ul>{analysis.descriptions.map((d, i) => <li key={i}>{d}</li>)}</ul>
            </section>
          </div>

          <div className="analysis-card">
            <h2>💡 Medicine Recommendation</h2>

            <div className="recommendation-inputs">
              <input
                type="text"
                className="symptom-input"
                placeholder="Enter a symptom (e.g., headache)"
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
              />
              <button
                className="recommend-btn"
                onClick={() => getMedicineRecommendations(symptom)}
                disabled={!symptom || recommending}
              >
                {recommending ? "Fetching..." : "Get Recommendations"}
              </button>
            </div>

            {recommendations.length > 0 && (
              <div className="recommendation-list">
                {recommendations.map((rec, index) => (
                  <div key={index} className={`recommend-card ${rec.best ? 'best-recommend' : ''}`}>
                    <div className="recommend-title">
                      <strong>{rec.name}</strong>
                      {rec.best && <span className="best-tag">Best</span>}
                    </div>
                    <p><strong>Purpose:</strong> {rec.purpose}</p>
                    <p><strong>Note:</strong> {rec.note}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineAnalyzer;
