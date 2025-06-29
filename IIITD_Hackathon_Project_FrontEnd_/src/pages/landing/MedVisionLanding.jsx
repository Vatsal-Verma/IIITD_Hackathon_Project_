import React, { useState, useEffect, useRef } from 'react';
import './MedVisionLanding.css';
import { useNavigate } from 'react-router';
import vid from './video.mp4';

const MedVisionLanding = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    professionals: 0,
    specialties: 0,
    satisfaction: 0,
    prescriptions: 0,
  });
  const statsRef = useRef(null);
  const hasAnimated = useRef(false);

  const animateCount = (target, key, duration) => {
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      setCounts((prev) => ({ ...prev, [key]: Math.floor(current) }));
    }, 16);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateCount(250, 'professionals', 2000);
          animateCount(50, 'specialties', 2000);
          animateCount(98, 'satisfaction', 2000);
          animateCount(10000, 'prescriptions', 2000);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  return (
    <div className="medvision-landing">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>MedVision Healthcare Solutions</h1>
          <p className="tagline">Transforming medical care with AI-driven innovation</p>
          <div className="cta-buttons">
            <button className="primary-btn">Book Appointment</button>
            <button className="secondary-btn" onClick={() => navigate('/analyse')}>
              Let's Analyse
            </button>
            <button className="tertiary-btn" onClick={() => navigate('/simulator')}>
              Explore Simulators
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
              aria-label="MedVision AI healthcare introductory video"
              poster="https://via.placeholder.com/900x450?text=MedVision+Video+Placeholder"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* AI-Powered Features Section */}
      <section className="ai-features-section">
        <h2>AI-Powered Healthcare</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💊</div>
            <h3>Prescription Analysis</h3>
            <p>AI-driven analysis identifies drug interactions, dosage errors, and provides personalized recommendations.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🦴</div>
            <h3>Medical Simulators</h3>
            <p>Interactive 3D simulations for nerves, bones, and more, aiding education and surgical planning.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>Intelligent Diagnostics</h3>
            <p>Advanced AI algorithms assist in accurate and timely medical diagnoses.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section" ref={statsRef}>
        <h2>Our Impact</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <h3>{counts.professionals}+</h3>
            <p>Medical Professionals</p>
          </div>
          <div className="stat-item">
            <h3>{counts.specialties}+</h3>
            <p>Specialties</p>
          </div>
          <div className="stat-item">
            <h3>{counts.satisfaction}%</h3>
            <p>Patient Satisfaction</p>
          </div>
          <div className="stat-item">
            <h3>{counts.prescriptions / 1000}K+</h3>
            <p>Prescriptions Analyzed</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>What Our Patients Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>"The AI prescription analysis saved me from a potential drug interaction!"</p>
            <h4>— Sarah M., Patient</h4>
          </div>
          <div className="testimonial-card">
            <p>"The bone simulator helped me understand my surgery better."</p>
            <h4>— John D., Patient</h4>
          </div>
          <div className="testimonial-card">
            <p>"Exceptional care and cutting-edge technology."</p>
            <h4>— Emily R., Patient</h4>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <h2>Stay Updated</h2>
        <p>Join our newsletter for the latest in healthcare innovation.</p>
        <div className="newsletter-form">
          <input type="email" placeholder="Enter your email" aria-label="Email for newsletter" />
          <button className="primary-btn">Subscribe</button>
        </div>
      </section>
    </div>
  );
};

export default MedVisionLanding;