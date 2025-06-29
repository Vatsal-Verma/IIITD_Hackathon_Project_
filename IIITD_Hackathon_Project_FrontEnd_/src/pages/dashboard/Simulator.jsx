import React, { useCallback, useState, useEffect, useRef } from "react";
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
	const [isListening, setIsListening] = useState(false);
	const [isSpeechSupported, setIsSpeechSupported] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const recognitionRef = useRef(null);
	const fileInputRef = useRef(null);

	// Replace this with your actual Gemini API key
	const API_KEY = "AIzaSyCRf4FB6Klv2Ruo5mCBr77xiPkYICmBsjY";

	// Initialize speech recognition
	useEffect(() => {
		if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
			const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
			recognitionRef.current = new SpeechRecognition();
			
			recognitionRef.current.continuous = false;
			recognitionRef.current.interimResults = false;
			recognitionRef.current.lang = 'en-US';
			
			recognitionRef.current.onstart = () => {
				setIsListening(true);
			};
			
			recognitionRef.current.onresult = (event) => {
				const transcript = event.results[0][0].transcript;
				setInputValue(prev => prev + (prev ? ' ' : '') + transcript);
				setIsListening(false);
			};
			
			recognitionRef.current.onerror = (event) => {
				console.error('Speech recognition error:', event.error);
				setIsListening(false);
			};
			
			recognitionRef.current.onend = () => {
				setIsListening(false);
			};
			
			setIsSpeechSupported(true);
		} else {
			setIsSpeechSupported(false);
		}
	}, []);

	// Cleanup speech recognition on unmount
	useEffect(() => {
		return () => {
			if (recognitionRef.current) {
				recognitionRef.current.stop();
			}
		};
	}, []);

	const startListening = () => {
		if (recognitionRef.current && !isListening) {
			try {
				recognitionRef.current.start();
			} catch (error) {
				console.error('Error starting speech recognition:', error);
			}
		}
	};

	const stopListening = () => {
		if (recognitionRef.current && isListening) {
			recognitionRef.current.stop();
		}
	};

	const handleImageUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			// Check file type
			if (!file.type.startsWith('image/')) {
				alert('Please select an image file.');
				return;
			}
			
			// Check file size (max 5MB)
			if (file.size > 5 * 1024 * 1024) {
				alert('Image size should be less than 5MB.');
				return;
			}

			setSelectedImage(file);
			
			// Create preview
			const reader = new FileReader();
			reader.onload = (e) => {
				setImagePreview(e.target.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const removeImage = () => {
		setSelectedImage(null);
		setImagePreview(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

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
				const responseText = data.candidates[0].content.parts[0].text;
				const formattedResponse = formatAIResponse(responseText);
				
				// Add to chat messages
				setChatMessages(prev => [...prev, {
					role: 'assistant',
					content: formattedResponse,
					timestamp: new Date()
				}]);
				
				// Parse and set results
				const lines = responseText.split('\n').filter(line => line.trim());
				setResult(lines);
			} else {
				throw new Error('Invalid response format from Gemini API');
			}
		} catch (error) {
			console.error('Error calling Gemini API:', error);
			setChatMessages(prev => [...prev, {
				role: 'assistant',
				content: 'Sorry, I encountered an error while processing your request. Please try again.',
				timestamp: new Date()
			}]);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const handleInputChange = (e) => {
		setInputValue(e.target.value);
	};

	const sendToGemini = async (prompt, imageFile = null) => {
		try {
			setIsLoading(true);
			
			// Add user message to chat
			setChatMessages(prev => [...prev, {
				role: 'user',
				content: prompt,
				image: imagePreview,
				timestamp: new Date()
			}]);

			let requestBody = {
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
			};

			// If there's an image, add it to the request
			if (imageFile) {
				// Convert image to base64
				const base64Image = await new Promise((resolve) => {
					const reader = new FileReader();
					reader.onload = () => {
						const base64 = reader.result.split(',')[1];
						resolve(base64);
					};
					reader.readAsDataURL(imageFile);
				});

				requestBody.contents[0].parts.push({
					inlineData: {
						mimeType: imageFile.type,
						data: base64Image
					}
				});
			}

			const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody)
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			
			if (data.candidates && data.candidates[0] && data.candidates[0].content) {
				const responseText = data.candidates[0].content.parts[0].text;
				const formattedResponse = formatAIResponse(responseText);
				
				// Add AI response to chat
				setChatMessages(prev => [...prev, {
					role: 'assistant',
					content: formattedResponse,
					timestamp: new Date()
				}]);
			} else {
				throw new Error('Invalid response format from Gemini API');
			}
		} catch (error) {
			console.error('Error calling Gemini API:', error);
			setChatMessages(prev => [...prev, {
				role: 'assistant',
				content: 'Sorry, I encountered an error while processing your request. Please try again.',
				timestamp: new Date()
			}]);
		} finally {
			setIsLoading(false);
		}
	};

	const formatAIResponse = (response) => {
		// Format the response for better display
		return response
			.split('\n')
			.map(line => {
				// Make headings bold
				if (line.match(/^\d+\./)) {
					return `**${line}**`;
				}
				// Add bullet points
				if (line.trim().startsWith('-')) {
					return `• ${line.trim().substring(1)}`;
				}
				return line;
			})
			.join('\n');
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		if (!inputValue.trim() && !selectedImage) return;
		
		const prompt = inputValue.trim();
		const imageToSend = selectedImage;
		
		// Clear input and image
		setInputValue("");
		setSelectedImage(null);
		setImagePreview(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
		
		await sendToGemini(prompt, imageToSend);
	};

	const handleUpload = () => {
		fileInputRef.current?.click();
	};

	return (
		<div className="simulator-container">
			<div className="simulator-header">
				<div className="header-content">
					<div className="header-icon">
						<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.36 14.83C16.36 15.33 15.96 15.73 15.46 15.73H8.54C8.04 15.73 7.64 15.33 7.64 14.83V9.17C7.64 8.67 8.04 8.27 8.54 8.27H15.46C15.96 8.27 16.36 8.67 16.36 9.17V14.83Z" fill="currentColor"/>
						</svg>
					</div>
					<div className="header-text">
						<h1>Fitness AI Simulator</h1>
						<p>Click on muscles to learn exercises or ask questions about fitness</p>
					</div>
				</div>
			</div>

			<div className="simulator-main">
				<div className="left-panel">
					<div className="models-section">
						<div className="section-title">
							<h3>Interactive Body Model</h3>
							<p>Click on any muscle to learn exercises</p>
						</div>
						<div className="models-container">
							<div className="model-wrapper">
								<h4>Front View</h4>
								<Model
									data={data}
									style={{ width: "100%", maxWidth: "300px", padding: "1rem" }}
									onClick={handleClick}
									highlightedColors={["rgb(255, 255, 255)", "rgb(255, 255, 255)"]}
									bodyColor="rgb(255, 255, 255)"
								/>
							</div>
							<div className="model-wrapper">
								<h4>Back View</h4>
								<Model
									type="posterior"
									data={data}
									style={{ width: "100%", maxWidth: "300px", padding: "1rem" }}
									onClick={handleClick}
									highlightedColors={["rgb(255, 255, 255)", "rgb(255, 255, 255)"]}
									bodyColor="rgb(255, 255, 255)"
								/>
							</div>
						</div>
					</div>

					<div className="exercise-section">
						<div className="section-title">
							<h3>Exercise Information</h3>
							<p>Detailed exercises for selected muscle</p>
						</div>
						<div className="exercise-content">
							{isLoading ? (
								<div className="loading-state">
									<div className="loading-spinner"></div>
									<p>Getting exercise information for {muscle}...</p>
								</div>
							) : results.length > 0 ? (
								<>
									<div className="muscle-title">
										<h4>{muscle}</h4>
									</div>
									<div className="exercise-list">
										{results.map((result, i) => (
											<div key={i} className="exercise-item">
												<span className="exercise-icon">💪</span>
												<p>{result}</p>
											</div>
										))}
									</div>
								</>
							) : (
								<div className="empty-state">
									<div className="empty-icon">🎯</div>
									<h4>No Exercise Selected</h4>
									<p>Click on a muscle in the body model above to see exercises</p>
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="right-panel">
					<div className="chat-section">
						<div className="section-title">
							<h3>AI Fitness Assistant</h3>
							<p>Ask questions about exercises, upload images, or get fitness advice</p>
						</div>
						
						<div className="chat-container">
							<div className="chat-messages">
								{chatMessages.length > 0 ? (
									<div className="messages-list">
										{chatMessages.map((message, index) => (
											<div key={index} className={`message ${message.role}`}>
												<div className="message-header">
													<span className="message-role">
														{message.role === 'user' ? 'You' : 'AI Assistant'}
													</span>
													<span className="message-time">
														{message.timestamp.toLocaleTimeString()}
													</span>
												</div>
												<div className="message-content">
													{message.image && (
														<div className="message-image">
															<img src={message.image} alt="Uploaded" />
														</div>
													)}
													{message.role === 'assistant' ? (
														<div className="ai-formatted-content">
															{message.content.split('\n').map((line, lineIndex) => {
																if (line.includes('**')) {
																	const parts = line.split('**');
																	return (
																		<div key={lineIndex} className="ai-line">
																			{parts.map((part, partIndex) => 
																				partIndex % 2 === 1 ? 
																					<strong key={partIndex}>{part}</strong> : 
																					<span key={partIndex}>{part}</span>
																			)}
																		</div>
																	);
																} else if (line.trim().startsWith('•')) {
																	return (
																		<div key={lineIndex} className="ai-bullet-point">
																			{line}
																		</div>
																	);
																} else if (line.trim().startsWith('  •')) {
																	return (
																		<div key={lineIndex} className="ai-sub-bullet-point">
																			{line}
																		</div>
																	);
																} else if (line.trim()) {
																	return (
																		<div key={lineIndex} className="ai-line">
																			{line}
																		</div>
																	);
																}
																return <div key={lineIndex} className="ai-spacing"></div>;
															})}
														</div>
													) : (
														<p>{message.content}</p>
													)}
												</div>
											</div>
										))}
									</div>
								) : (
									<div className="chat-welcome">
										<div className="welcome-icon">🤖</div>
										<h4>Welcome to Fitness AI!</h4>
										<p>I'm here to help you with:</p>
										<ul>
											<li>Exercise recommendations</li>
											<li>Workout planning</li>
											<li>Fitness advice</li>
											<li>Image analysis</li>
										</ul>
										<p>Just ask me anything about fitness!</p>
									</div>
								)}
								
								{isLoading && (
									<div className="message assistant">
										<div className="message-content">
											<div className="typing-indicator">
												<span></span>
												<span></span>
												<span></span>
											</div>
										</div>
									</div>
								)}
							</div>

							{imagePreview && (
								<div className="image-preview">
									<img src={imagePreview} alt="Preview" />
									<button 
										type="button" 
										onClick={removeImage}
										className="remove-image-btn"
										title="Remove image"
									>
										<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
										</svg>
									</button>
								</div>
							)}

							<form onSubmit={handleSubmit} className="chat-input-form">
								<div className="input-wrapper">
									<input
										type="text"
										value={inputValue}
										onChange={handleInputChange}
										placeholder={isLoading ? "AI is thinking..." : "Ask about exercises, upload images..."}
										className="chat-input"
										disabled={isLoading}
									/>
									<div className="input-buttons">
										{isSpeechSupported && (
											<button 
												type="button" 
												onClick={isListening ? stopListening : startListening}
												className={`mic-btn ${isListening ? 'listening' : ''}`}
												disabled={isLoading}
												title={isListening ? "Stop listening" : "Start voice input"}
											>
												<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
													<path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
													<line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
													<line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
												</svg>
											</button>
										)}
										<button type="button" onClick={handleUpload} className="upload-btn" disabled={isLoading}>
											<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M12 16L12 8M12 8L15 11M12 8L9 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
												<path d="M3 15V16C3 18.8284 3 20.2426 3.87868 21.1213C4.75736 22 6.17157 22 9 22H15C17.8284 22 19.2426 22 20.1213 21.1213C21 20.2426 21 18.8284 21 16V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</button>
										<button type="submit" className="send-btn" disabled={isLoading || (!inputValue.trim() && !selectedImage)}>
											<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</button>
									</div>
								</div>
							</form>

							<input
								ref={fileInputRef}
								type="file"
								accept="image/*"
								onChange={handleImageUpload}
								style={{ display: 'none' }}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}