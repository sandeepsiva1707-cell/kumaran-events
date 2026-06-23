import React from 'react';
import './MobileLandingPage.css';

/**
 * MobileLandingPage - A premium luxury wedding and event management landing page
 * designed specifically for mobile views (320px - 768px).
 *
 * Implements a dark luxury theme, gold accents, fluid typography, glassmorphism,
 * elegant service list with gold star icons, and interactive elements.
 */
const MobileLandingPage = ({
  tagline = "CREATING HAPPY MOMENTS",
  title = "Transforming Dreams Into Beautiful Celebrations",
  services = [
    "Professional Wedding Decorations",
    "Event Planning",
    "Bride & Groom Entry",
    "Sound & Lighting",
    "Hospitality",
    "Complete Event Management Services"
  ],
  contact = {
    phone: "+91 90438 93525",
    phoneUrl: "+919043893525",
    email: "kumarandecoration@gmail.com",
    instagram: "@kumaran_events",
    instagramUrl: "https://www.instagram.com/kumaran_events"
  },
  whatsappNumber = "919043893525"
}) => {
  
  // Custom WhatsApp message pre-fill matching original site behavior
  const handleWhatsAppRedirect = () => {
    const message = `Hello V. Kumaran Decors & Events,\n\nI would like to enquire about your decoration and event services.\n\nEvent Type:\nEvent Date:\nLocation:\n\nPlease share available packages and pricing.\n\nThank you.`;
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="luxury-mobile-landing">
      {/* Background Slideshow Simulation / Video Overlay */}
      <div className="luxury-bg-overlay"></div>
      
      {/* Premium Glassmorphic Container */}
      <main className="luxury-card-container">
        {/* Soft Inner Glow Pane */}
        <div className="luxury-card-glow"></div>
        
        <div className="luxury-card-content">
          {/* Tagline / Subtitle */}
          <span className="luxury-tagline">{tagline}</span>
          
          {/* Main Title / Slogan */}
          <h1 className="luxury-title">
            {title.split(' ').map((word, index) => {
              // Distribute layout beautifully on separate lines if preferred
              if (word === "Into" || word === "Celebrations") {
                return <React.Fragment key={index}><br />{word} </React.Fragment>;
              }
              return <React.Fragment key={index}>{word} </React.Fragment>;
            })}
          </h1>
          
          {/* Divider */}
          <div className="luxury-divider">
            <span className="luxury-divider-line"></span>
            <span className="luxury-divider-sparkle">✦</span>
            <span className="luxury-divider-line"></span>
          </div>
          
          {/* Services Checklist */}
          <ul className="luxury-services-list">
            {services.map((service, index) => (
              <li key={index} className="luxury-service-item">
                <span className="luxury-service-icon">✨</span>
                <span className="luxury-service-text">{service}</span>
              </li>
            ))}
          </ul>
          
          {/* Contact Details Stack */}
          <section className="luxury-contact-section" aria-label="Contact Information">
            <div className="luxury-contact-row">
              <span className="luxury-contact-label">Call:</span>
              <a href={`tel:${contact.phoneUrl}`} className="luxury-contact-value">
                {contact.phone}
              </a>
            </div>
            <div className="luxury-contact-row">
              <span className="luxury-contact-label">Email:</span>
              <a href={`mailto:${contact.email}`} className="luxury-contact-value">
                {contact.email}
              </a>
            </div>
            <div className="luxury-contact-row">
              <span className="luxury-contact-label">Instagram:</span>
              <a 
                href={contact.instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="luxury-contact-value"
              >
                {contact.instagram}
              </a>
            </div>
          </section>
          
          {/* Action CTAs */}
          <div className="luxury-ctas">
            <a href="#gallery" className="luxury-btn luxury-btn-portfolio">
              View Portfolio
            </a>
          </div>
        </div>
      </main>

      {/* Floating WhatsApp Action Button */}
      <button 
        onClick={handleWhatsAppRedirect}
        className="luxury-whatsapp-float" 
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="luxury-whatsapp-icon">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.817 9.817 0 0 0 12.04 2zm0 1.66c2.2 0 4.27.86 5.83 2.41a8.17 8.17 0 0 1 2.41 5.84c0 4.54-3.7 8.24-8.24 8.24-1.45 0-2.87-.38-4.12-1.11l-.3-.18-3.07.81.82-2.99-.19-.31a8.178 8.178 0 0 1-1.25-4.32c.01-4.54 3.71-8.24 8.25-8.24zm-3.52 4.67c-.19 0-.32.07-.44.22-.12.15-.47.46-.47 1.13 0 .67.49 1.31.56 1.41.07.1 1 1.53 2.43 2.15.34.15.6.24.8.31.34.11.65.09.9.06.27-.04.83-.34.95-.67.12-.34.12-.63.09-.69-.03-.06-.11-.1-.24-.17-.12-.06-.74-.37-.86-.41-.12-.04-.2-.06-.29.07-.09.13-.34.41-.41.49-.07.09-.15.1-.28.03-.13-.06-.54-.2-1.02-.63-.38-.34-.63-.76-.7-0.9-.07-.13-.01-.2.06-.26.06-.06.13-.15.19-.22.06-.07.08-.12.12-.2.04-.08.02-.15-.01-.21-.03-.06-.29-.69-.39-.95-.12-.27-.24-.23-.33-.23z" />
        </svg>
      </button>
    </div>
  );
};

export default MobileLandingPage;
