// GEMINI API KEY : AIzaSyBYourGeminiAPIKeyHere

import React, { useCallback, useState } from "react";
import Model from "react-body-highlighter";
import data from "./data.json";
import { motion } from "framer-motion";
import "./Simulator.css";

export default function Simulator() {
	const [results, setResult] = useState([]);
	const [muscle, setMuscle] = useState("");
	const [inputValue, setInputValue] = useState("");
	const [chatMessages, setChatMessages] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	// Replace this with your actual Gemini API key
	const API_KEY = "AIzaSyCloS0KBg0wQuqqS3G6IT9r2hntRRixIj8";

	const handleClick = useCallback(async ({ muscle, data }) => {
		try {
			setIsLoading(true);
			setMuscle(muscle);
			
			// Add the muscle name as a pill to the input
			setInputValue(prev => {
				const currentValue = prev.trim();
				const musclePill = `#${muscle}`;
				
				// If input is empty, just add the pill
				if (!currentValue) {
					return musclePill;
				}
				
				// If input already contains this muscle pill, don't add it again
				if (currentValue.includes(musclePill)) {
					return currentValue;
				}
				
				// Add the pill to the existing input
				return `${currentValue} ${musclePill}`;
			});
			
			// Create a prompt for Gemini about the clicked muscle
			const prompt = `Tell me about exercises for ${muscle} muscle. Provide a detailed list of effective exercises, including:
			1. Different types of exercises (strength, flexibility, etc.)
			2. How to perform each exercise correctly
			3. Recommended sets and reps
			4. Tips for targeting this muscle group
			5. Common mistakes to avoid
			
			Please format the response in a clear, easy-to-read list format.`;
			
			// Call Gemini API
			const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					contents: [
						{
							parts: [
								{
									text: `You are a helpful fitness and exercise assistant. Provide detailed, accurate information about exercises, workout routines, and fitness advice. Be encouraging and professional. User question: ${prompt}`
								}
							]
						}
					],
					generationConfig: {
						temperature: 0.7,
						topK: 40,
						topP: 0.95,
						maxOutputTokens: 800,
					},
					safetySettings: [
						{
							category: "HARM_CATEGORY_HARASSMENT",
							threshold: "BLOCK_MEDIUM_AND_ABOVE"
						},
						{
							category: "HARM_CATEGORY_HATE_SPEECH",
							threshold: "BLOCK_MEDIUM_AND_ABOVE"
						},
						{
							category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
							threshold: "BLOCK_MEDIUM_AND_ABOVE"
						},
						{
							category: "HARM_CATEGORY_DANGEROUS_CONTENT",
							threshold: "BLOCK_MEDIUM_AND_ABOVE"
						}
					]
				})
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			
			if (data.candidates && data.candidates[0] && data.candidates[0].content) {
				const aiResponse = data.candidates[0].content.parts[0].text;
				
				// Process the response to create cleaner bullet points
				const exerciseList = aiResponse
					.split('\n')
					.filter(line => line.trim().length > 0)
					.map(line => {
						const trimmedLine = line.trim();
						
						// Remove common numbering patterns and convert to bullet points
						const cleanLine = trimmedLine
							.replace(/^\d+\.\s*/, '• ') // Replace "1. " with "• "
							.replace(/^-\s*/, '• ') // Replace "- " with "• "
							.replace(/^\*\s*/, '• ') // Replace "* " with "• "
							.replace(/^→\s*/, '• ') // Replace "→ " with "• "
							.replace(/^▶\s*/, '• ') // Replace "▶ " with "• "
							.replace(/^●\s*/, '• ') // Replace "● " with "• "
							.replace(/^○\s*/, '• ') // Replace "○ " with "• "
							.replace(/^▪\s*/, '• ') // Replace "▪ " with "• "
							.replace(/^▫\s*/, '• ') // Replace "▫ " with "• ";
						
						// If line doesn't start with a bullet, add one
						if (!cleanLine.startsWith('• ')) {
							return `• ${cleanLine}`;
						}
						
						return cleanLine;
					})
					.map(line => line.trim());
				
				setResult(exerciseList);
			} else {
				throw new Error('Invalid response format from Gemini API');
			}
		} catch (error) {
			console.error('Error calling Gemini API:', error);
			// Fallback to original data if API fails
			const { exercises } = data;
			setResult(exercises || []);
		} finally {
			setIsLoading(false);
		}
	}, [API_KEY]);

	const handleInputChange = (e) => {
		setInputValue(e.target.value);
	};

	const sendToGemini = async (prompt) => {
		try {
			setIsLoading(true);

			console.log('Sending request to Gemini API...');
			console.log('API Key:', API_KEY.substring(0, 10) + '...');

			const requestBody = {
				contents: [
					{
						parts: [
							{
								text: `You are a helpful fitness and exercise assistant. Provide detailed, accurate information about exercises, workout routines, and fitness advice. Be encouraging and professional. User question: ${prompt}`
							}
						]
					}
				],
				generationConfig: {
					temperature: 0.7,
					topK: 40,
					topP: 0.95,
					maxOutputTokens: 500,
				},
				safetySettings: [
					{
						category: "HARM_CATEGORY_HARASSMENT",
						threshold: "BLOCK_MEDIUM_AND_ABOVE"
					},
					{
						category: "HARM_CATEGORY_HATE_SPEECH",
						threshold: "BLOCK_MEDIUM_AND_ABOVE"
					},
					{
						category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
						threshold: "BLOCK_MEDIUM_AND_ABOVE"
					},
					{
						category: "HARM_CATEGORY_DANGEROUS_CONTENT",
						threshold: "BLOCK_MEDIUM_AND_ABOVE"
					}
				]
			};

			console.log('Request body:', requestBody);

			// Try alternative endpoint first
			let response;
			try {
				response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(requestBody)
				});
			} catch (firstError) {
				console.log('First endpoint failed, trying alternative...');
				// Fallback to original endpoint
				response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(requestBody)
				});
			}

			console.log('Response status:', response.status);
			console.log('Response headers:', response.headers);

			if (!response.ok) {
				const errorText = await response.text();
				console.error('API Error Response:', errorText);
				throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
			}

			const data = await response.json();
			console.log('API Response data:', data);

			if (data.candidates && data.candidates[0] && data.candidates[0].content) {
				const aiResponse = data.candidates[0].content.parts[0].text;
				console.log('AI Response:', aiResponse);

				// Add the conversation to chat messages
				setChatMessages(prev => [
					...prev,
					{ role: 'user', content: prompt, timestamp: new Date() },
					{ role: 'assistant', content: aiResponse, timestamp: new Date() }
				]);

				return aiResponse;
			} else {
				console.error('Invalid response structure:', data);
				throw new Error('Invalid response format from Gemini API');
			}
		} catch (error) {
			console.error('Error calling Gemini API:', error);
			console.error('Error details:', {
				message: error.message,
				stack: error.stack,
				name: error.name
			});

			let errorMessage = "Sorry, I'm having trouble connecting right now. Please try again later.";

			// Provide more specific error messages
			if (error.message.includes('400')) {
				errorMessage = "Invalid request. Please check your API key and try again.";
			} else if (error.message.includes('401')) {
				errorMessage = "Authentication failed. Please check your API key.";
			} else if (error.message.includes('403')) {
				errorMessage = "Access denied. Please check your API key permissions.";
			} else if (error.message.includes('429')) {
				errorMessage = "Rate limit exceeded. Please wait a moment and try again.";
			} else if (error.message.includes('CORS')) {
				errorMessage = "CORS error. Please check your browser settings.";
			}

			setChatMessages(prev => [
				...prev,
				{ role: 'user', content: prompt, timestamp: new Date() },
				{ role: 'assistant', content: errorMessage, timestamp: new Date() }
			]);

			return errorMessage;
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (inputValue.trim() && !isLoading) {
			const prompt = inputValue.trim();
			setInputValue("");
			await sendToGemini(prompt);
		}
	};

	const handleUpload = () => {
		// Handle file upload here
		console.log("Upload clicked");
	};

	return (
		<>
			<div>
			</div>


			<div className="main-container">
				<div className="alert">
					<h2>Guess What!</h2>
					<p>You can learn more by clicking on a muscle!</p>
				</div>
				<div className="models">
					<Model
						data={data}
						style={{ width: "30vw", padding: "3rem" }}
						onClick={handleClick}
						highlightedColors={["rgb(255, 255, 255)", "rgb(255, 255, 255)"]}
						bodyColor="rgb(255, 255, 255)"
					/>
					<Model
						type="posterior"
						data={data}
						style={{ width: "30vw", padding: "3rem" }}
						onClick={handleClick}
						highlightedColors={["rgb(255, 255, 255)", "rgb(255, 255, 255)"]}
						bodyColor="rgb(255, 255, 255)"
					/>
				</div>

				<motion.div
					className="result-box"
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					{isLoading ? (
						<div className="loading-state">
							<h1 className="result-title">Processing...</h1>
							<div className="typing-indicator">
								<span></span>
								<span></span>
								<span></span>
							</div>
							<p className="loading-text">Getting exercise information for {muscle}...</p>
						</div>
					) : results.length > 0 ? (
						<>
							<h1 className="result-title">{muscle}</h1>
							{results.map((result, i) => (
								<p key={i} className="exercise">{result}</p>
							))}
						</>
					) : (
						<p className="empty-msg">Nothing was found</p>
					)}
				</motion.div>
				{/* AI Prompt Box with Response Display */}
				<div className="ai-prompt-box">
					{/* Show AI Response if available */}
					{chatMessages.length > 0 && (
						<div className="ai-response-display">
							{chatMessages.map((message, index) => (
								<div key={index} className={`response-message ${message.role}`}>
									<div className="response-content">
										{message.content}
									</div>
									<div className="response-timestamp">
										{message.timestamp.toLocaleTimeString()}
									</div>
								</div>
							))}
							{isLoading && (
								<div className="response-message assistant">
									<div className="response-content">
										<div className="typing-indicator">
											<span></span>
											<span></span>
											<span></span>
										</div>
									</div>
								</div>
							)}
						</div>
					)}

					<form onSubmit={handleSubmit} className="prompt-form">
						<input
							type="text"
							value={inputValue}
							onChange={handleInputChange}
							placeholder={isLoading ? "Gemini is thinking..." : "Ask me anything about exercises..."}
							className="prompt-input"
							disabled={isLoading}
						/>
						<button type="button" onClick={handleUpload} className="upload-btn" disabled={isLoading}>
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M12 16L12 8M12 8L15 11M12 8L9 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
								<path d="M3 15V16C3 18.8284 3 20.2426 3.87868 21.1213C4.75736 22 6.17157 22 9 22H15C17.8284 22 19.2426 22 20.1213 21.1213C21 20.2426 21 18.8284 21 16V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</button>
						<button type="submit" className="send-btn" disabled={isLoading || !inputValue.trim()}>
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</button>
					</form>
				</div>
			</div>
		</>
	);
}
