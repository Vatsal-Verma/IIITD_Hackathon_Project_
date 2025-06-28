import React from 'react';
import './MedVisionLanding.css';
import { useNavigate } from 'react-router';
import vid from './video.mp4';

const MedVisionLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="medvision-landing">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>MedVision Healthcare Solutions</h1>
          <p className="tagline">Innovative medical care powered by cutting-edge technology</p>
          <div className="cta-buttons">
            <button className="primary-btn">Book Appointment</button>
            <button className="secondary-btn" onClick={() => navigate('/analyse')}>
              Let's Analyse
            </button>
          </div>
        </div>
        <div className="hero-model">
          <div className="model-container">
            <video
              src={vid}
              controls
              loop
              playsInline
              muted
              autoPlay
              aria-label="MedVision introductory video"
              poster="https://via.placeholder.com/900x450?text=MedVision+Video+Placeholder"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Our Advanced Services</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👨‍⚕️</div>
            <h3>Expert Specialists</h3>
            <p>Board-certified physicians with specialized training in their fields.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚑</div>
            <h3>Emergency Care</h3>
            <p>24/7 emergency services with rapid response times.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">❤️</div>
            <h3>Preventive Care</h3>
            <p>Comprehensive health screenings and preventive programs.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏥</div>
            <h3>Modern Facilities</h3>
            <p>State-of-the-art medical equipment and technology.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat-item">
          <h3>250+</h3>
          <p>Medical Professionals</p>
        </div>
        <div className="stat-item">
          <h3>50+</h3>
          <p>Specialties</p>
        </div>
        <div className="stat-item">
          <h3>24/7</h3>
          <p>Emergency Services</p>
        </div>
        <div className="stat-item">
          <h3>98%</h3>
          <p>Patient Satisfaction</p>
        </div>
      </section>
    </div>
  );
};

export default MedVisionLanding;