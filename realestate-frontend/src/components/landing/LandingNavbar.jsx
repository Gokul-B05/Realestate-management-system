import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { 
  FaHome, FaBuilding, FaSignInAlt, FaUserPlus, 
  FaShieldAlt, FaSignOutAlt
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const LandingNavbar = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [navExpanded, setNavExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    setNavExpanded(false);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Navbar 
      expand="lg" 
      fixed="top" 
      expanded={navExpanded}
      className={`landing-navbar transition-all duration-300 ${
        scrolled ? 'landing-navbar-scrolled shadow-sm' : 'landing-navbar-transparent'
      }`}
    >
      <Container>
        {/* Brand */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center fw-bold brand-logo">
          <div className="brand-icon-wrapper me-2">
            <FaHome className="brand-icon" />
          </div>
          <span className="brand-text">
            Real<span className="brand-highlight">Estate</span>
          </span>
        </Navbar.Brand>

        {/* Responsive Mobile Toggle */}
        <Navbar.Toggle 
          aria-controls="landing-navbar-nav" 
          className="border-0 shadow-none"
          onClick={() => setNavExpanded(!navExpanded)}
        >
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>

        <Navbar.Collapse id="landing-navbar-nav">
          {/* Main Links: Home, Properties, About, Contact */}
          <Nav className="mx-auto align-items-lg-center">
            <Nav.Link 
              href="#home" 
              onClick={(e) => handleSmoothScroll(e, 'home')}
              className="landing-nav-link"
            >
              Home
            </Nav.Link>
            <Nav.Link 
              href="#properties" 
              onClick={(e) => handleSmoothScroll(e, 'properties')}
              className="landing-nav-link"
            >
              Properties
            </Nav.Link>
            <Nav.Link 
              href="#about" 
              onClick={(e) => handleSmoothScroll(e, 'about')}
              className="landing-nav-link"
            >
              About
            </Nav.Link>
            <Nav.Link 
              href="#contact" 
              onClick={(e) => handleSmoothScroll(e, 'contact')}
              className="landing-nav-link"
            >
              Contact
            </Nav.Link>
          </Nav>

          {/* Right Action Items: Login and Register */}
          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0 flex-wrap">
            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <span className="text-muted small d-none d-xl-inline">
                  Signed in as <strong>{user?.name || user?.email?.split('@')[0]}</strong>
                </span>
                {isAdmin() ? (
                  <Button 
                    as={Link} 
                    to="/admin/dashboard" 
                    variant="primary" 
                    className="landing-btn-primary d-flex align-items-center gap-1"
                    onClick={() => setNavExpanded(false)}
                  >
                    <FaShieldAlt /> Admin Dashboard
                  </Button>
                ) : (
                  <Button 
                    as={Link} 
                    to="/properties" 
                    variant="primary" 
                    className="landing-btn-primary d-flex align-items-center gap-1"
                    onClick={() => setNavExpanded(false)}
                  >
                    <FaBuilding /> Manage Properties
                  </Button>
                )}
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={() => {
                    setNavExpanded(false);
                    logout();
                    navigate('/login');
                  }}
                  className="rounded-pill px-3 d-flex align-items-center gap-1"
                >
                  <FaSignOutAlt /> Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="link" 
                  className="landing-login-btn text-decoration-none fw-semibold text-dark px-3"
                  onClick={() => setNavExpanded(false)}
                >
                  <FaSignInAlt className="me-1 text-primary" /> Login
                </Button>
                <Button 
                  as={Link} 
                  to="/register" 
                  className="landing-btn-primary d-flex align-items-center gap-1"
                  onClick={() => setNavExpanded(false)}
                >
                  <FaUserPlus /> Register
                </Button>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default LandingNavbar;
