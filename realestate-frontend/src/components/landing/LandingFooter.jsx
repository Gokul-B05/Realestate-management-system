import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { 
  FaHome, FaPhone, FaEnvelope, FaMapMarkerAlt, 
  FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, 
  FaPaperPlane, FaLock, FaCheckCircle
} from 'react-icons/fa';

const LandingFooter = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="landing-footer bg-dark text-white pt-5 pb-4" id="contact">
      <Container>
        <Row className="gy-4 mb-5">
          {/* Brand Info & Mission */}
          <Col lg={4} md={6}>
            <div className="d-flex align-items-center mb-3">
              <div className="footer-brand-icon-wrapper me-2">
                <FaHome className="text-primary fs-3" />
              </div>
              <h4 className="fw-bold mb-0 text-white">
                Real<span className="text-primary">Estate</span>
              </h4>
            </div>
            <p className="text-secondary pe-lg-3">
              A comprehensive real estate management platform connecting verified property owners, 
              buyers, and tenants. Browse authentic listings, book in-person visits, and conduct 
              transparent transactions with ease.
            </p>
            <div className="d-flex gap-3 mt-4">
              <a href="#facebook" className="social-icon-btn" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="#twitter" className="social-icon-btn" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#linkedin" className="social-icon-btn" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
              <a href="#instagram" className="social-icon-btn" aria-label="Instagram">
                <FaInstagram />
              </a>
            </div>
          </Col>

          {/* Quick Navigation */}
          <Col lg={2} sm={6}>
            <h5 className="footer-title fw-semibold text-white mb-3">Navigation</h5>
            <ul className="list-unstyled footer-links">
              <li>
                <a href="#home" onClick={(e) => handleSmoothScroll(e, 'home')}>
                  Home
                </a>
              </li>
              <li>
                <a href="#properties" onClick={(e) => handleSmoothScroll(e, 'properties')}>
                  Properties
                </a>
              </li>
              <li>
                <a href="#about" onClick={(e) => handleSmoothScroll(e, 'about')}>
                  About Us
                </a>
              </li>
              <li>
                <a href="#benefits" onClick={(e) => handleSmoothScroll(e, 'benefits')}>
                  Benefits
                </a>
              </li>
              <li>
                <a href="#how-it-works" onClick={(e) => handleSmoothScroll(e, 'how-it-works')}>
                  How It Works
                </a>
              </li>
            </ul>
          </Col>

          {/* Portal Access */}
          <Col lg={2} sm={6}>
            <h5 className="footer-title fw-semibold text-white mb-3">Portal Access</h5>
            <ul className="list-unstyled footer-links">
              <li><Link to="/login">Account Login</Link></li>
              <li><Link to="/register">User Registration</Link></li>
              <li><Link to="/properties">Property Catalog</Link></li>
              <li><Link to="/login">Owner Dashboard</Link></li>
              <li><Link to="/login">Admin Gateway</Link></li>
            </ul>
          </Col>

          {/* Newsletter & Contact Details */}
          <Col lg={4} md={6}>
            <h5 className="footer-title fw-semibold text-white mb-3">Get in Touch</h5>
            <div className="contact-details text-secondary small mb-3">
              <div className="d-flex align-items-start mb-2">
                <FaMapMarkerAlt className="text-primary me-2 mt-1 flex-shrink-0" />
                <span>Real Estate Plaza, Main Road, Chennai, Tamil Nadu 600028</span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <FaPhone className="text-primary me-2 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <FaEnvelope className="text-primary me-2 flex-shrink-0" />
                <span>contact@realestate-management.com</span>
              </div>
              <div className="d-flex align-items-center">
                <FaLock className="text-success me-2 flex-shrink-0" />
                <span>Encrypted & Verified REST API Gateway</span>
              </div>
            </div>

            <h6 className="text-white-50 small fw-bold text-uppercase mt-4 mb-2">Subscribe to Market Updates</h6>
            {subscribed ? (
              <Alert variant="success" className="py-2 small d-flex align-items-center gap-2">
                <FaCheckCircle /> Thank you for subscribing!
              </Alert>
            ) : (
              <Form onSubmit={handleSubscribe}>
                <div className="input-group">
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    className="border-0 bg-secondary bg-opacity-25 text-white"
                  />
                  <Button variant="primary" type="submit" className="px-3" aria-label="Subscribe">
                    <FaPaperPlane />
                  </Button>
                </div>
              </Form>
            )}
          </Col>
        </Row>

        <hr className="border-secondary opacity-25 my-4" />

        <Row className="align-items-center text-secondary small gy-2">
          <Col md={6} className="text-center text-md-start">
            &copy; {new Date().getFullYear()} Real Estate Management System. Built with Spring Boot & React.
          </Col>
          <Col md={6} className="text-center text-md-end">
            <span className="me-3"><a href="#terms" className="text-secondary text-decoration-none">Terms of Service</a></span>
            <span className="me-3"><a href="#privacy" className="text-secondary text-decoration-none">Privacy Policy</a></span>
            <span><a href="#security" className="text-secondary text-decoration-none">Security</a></span>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default LandingFooter;
