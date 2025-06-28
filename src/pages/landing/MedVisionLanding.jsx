import React from 'react';
import './MedVisionLanding.css';

const MedVisionLanding = () => {
  return (
    <div className="medvision-landing">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>MedVision Healthcare Solutions</h1>
          <p className="tagline">Innovative medical care powered by cutting-edge technology</p>
          <div className="cta-buttons">
            <button className="primary-btn">Book Appointment</button>
            <button className="secondary-btn">Virtual Tour</button>
          </div>
        </div>
        <div className="hero-model">
          {/* Embedded 3D model using model-viewer (web component) */}
          <div className="model-container">
            <model-viewer
              alt="Hospital 3D Model"
              src="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
              ar
              ar-modes="webxr scene-viewer quick-look"
              environment-image="neutral"
              auto-rotate
              camera-controls
            ></model-viewer>
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

      {/* About Section */}
      {/* <section className="about-section">
        <div className="about-content">
          <h2>About MedVision</h2>
          <p>
            MedVision is a leading healthcare provider committed to delivering exceptional medical services through innovation and compassion. 
            Our state-of-the-art facility combines advanced technology with personalized care to ensure the best outcomes for our patients.
          </p>
          <p>
            Founded in 2010, we've grown to become a trusted name in healthcare, serving thousands of patients annually with our comprehensive 
            range of medical services.
          </p>
          <button className="primary-btn">Learn More</button>
        </div>
        <div className="about-image">
          <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="Medical team" />
        </div>
      </section> */}

      {/* Contact Section */}
      {/* <section className="contact-section">
        <div className="contact-info">
          <h2>Contact Us</h2>
          <div className="contact-item">
            <span className="contact-icon">📍</span>
            <p>123 Medical Drive, Health City, HC 12345</p>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📞</span>
            <p>(123) 456-7890</p>
          </div>
          <div className="contact-item">
            <span className="contact-icon">⏱️</span>
            <p>Open 24/7 for emergency services</p>
          </div>
        </div>
        <div className="contact-form">
          <h3>Send Us a Message</h3>
          <form>
            <input type="text" placeholder="Your Name" />
            <input type="email" placeholder="Your Email" />
            <textarea placeholder="Your Message"></textarea>
            <button type="submit" className="primary-btn">Send Message</button>
          </form>
        </div>
      </section> */}
    </div>
  );
};

export default MedVisionLanding;