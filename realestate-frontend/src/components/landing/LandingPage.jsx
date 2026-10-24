import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Container, Row, Col, Card, Button, Badge, Form, 
  InputGroup, Modal, Spinner, Alert 
} from 'react-bootstrap';
import { 
  FaHome, FaSearch, FaMapMarkerAlt, FaCalendarCheck, 
  FaShieldAlt, FaHandshake, FaCamera, FaChartLine, 
  FaArrowRight, FaCheckCircle, FaUserCheck, FaPhoneAlt, 
  FaBuilding, FaRedo, FaInfoCircle, FaTag, FaEnvelope, FaTimes
} from 'react-icons/fa';

import LandingNavbar from './LandingNavbar';
import LandingFooter from './LandingFooter';
import propertyService from '../../services/propertyService';
import { useAuth } from '../../context/AuthContext';
import './LandingPage.css';

// Default architectural placeholder if a property has no uploaded images
const DEFAULT_PROPERTY_IMAGE = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // API State
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [maxPrice, setMaxPrice] = useState('');

  // Quick View Modal
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch real properties from the existing backend API
  const fetchLiveProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await propertyService.getAllProperties();
      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching properties from API:', err);
      setError('Unable to connect to the backend server. Please verify the Spring Boot service and database are running.');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveProperties();
  }, [fetchLiveProperties]);

  // Extract unique locations from actual backend data for dynamic filter dropdown
  const uniqueCities = Array.from(
    new Set(
      properties
        .map((p) => p.location?.trim())
        .filter((loc) => loc && loc.length > 0)
    )
  );

  // Filter properties based on user criteria
  const filteredProperties = properties.filter((property) => {
    // 1. Type filter (SALE, RENT)
    if (selectedType !== 'ALL' && property.propertyType !== selectedType) {
      return false;
    }

    // 2. City filter
    if (selectedCity !== 'ALL' && property.location?.toLowerCase() !== selectedCity.toLowerCase()) {
      return false;
    }

    // 3. Max price filter
    if (maxPrice && property.price && Number(property.price) > Number(maxPrice)) {
      return false;
    }

    // 4. Keyword search (matches title, location, fullAddress, or description)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      const matchTitle = property.title?.toLowerCase().includes(term);
      const matchLocation = property.location?.toLowerCase().includes(term);
      const matchAddress = property.fullAddress?.toLowerCase().includes(term);
      const matchDesc = property.description?.toLowerCase().includes(term);

      if (!matchTitle && !matchLocation && !matchAddress && !matchDesc) {
        return false;
      }
    }

    return true;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedType('ALL');
    setSelectedCity('ALL');
    setMaxPrice('');
  };

  const formatPrice = (price, type) => {
    if (price === null || price === undefined) return 'Price on Request';
    const formatted = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(price);
    
    return type === 'RENT' ? `₹${formatted} / mo` : `₹${formatted}`;
  };

  const getPrimaryImage = (property) => {
    if (property.images && Array.isArray(property.images) && property.images.length > 0) {
      const primary = property.images.find((img) => img.isPrimary);
      return primary?.imageUrl || property.images[0]?.imageUrl || DEFAULT_PROPERTY_IMAGE;
    }
    return DEFAULT_PROPERTY_IMAGE;
  };

  const handleTourAction = (property) => {
    if (isAuthenticated) {
      navigate(`/appointments/new/${property.id}`);
    } else {
      navigate('/login');
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
    <div className="landing-page-wrapper">
      {/* ── 1. Responsive Navbar ────────────────────────────────────────── */}
      <LandingNavbar />

      {/* ── 2. Hero Section ────────────────────────────────────────────── */}
      <section className="landing-hero" id="home">
        <div className="hero-background-shapes" aria-hidden="true">
          <div className="hero-blob-1"></div>
          <div className="hero-blob-2"></div>
        </div>

        <Container className="hero-content">
          <Row className="align-items-center gy-5">
            <Col lg={7}>
              <div className="hero-badge mb-3">
                <FaShieldAlt className="text-primary" /> Verified Real Estate Portal
              </div>
              
              <h1 className="hero-title mb-3">
                Find Your <span className="hero-title-highlight">Dream Home</span> with Complete Confidence
              </h1>
              
              <p className="hero-subtitle mb-4">
                Explore authentic residential properties and commercial spaces. Schedule in-person 
                viewing tours directly with verified owners, backed by seamless transaction tracking.
              </p>

              <div className="d-flex align-items-center gap-3 flex-wrap">
                <Button 
                  href="#properties"
                  onClick={(e) => handleSmoothScroll(e, 'properties')}
                  className="landing-btn-primary d-flex align-items-center gap-2 py-3 px-4"
                  size="lg"
                >
                  <FaSearch /> Explore Properties <FaArrowRight className="small" />
                </Button>

                <Button 
                  as={Link}
                  to={isAuthenticated ? "/properties/new" : "/login"}
                  variant="outline-dark"
                  className="rounded-pill py-3 px-4 fw-semibold"
                  size="lg"
                >
                  <FaHome className="me-2" /> List Your Property
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="d-flex align-items-center gap-4 mt-5 pt-3 border-top text-muted small flex-wrap">
                <div className="d-flex align-items-center gap-2">
                  <FaCheckCircle className="text-success" />
                  <span>Verified Property Records</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <FaCalendarCheck className="text-primary" />
                  <span>Real-Time Visit Scheduling</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <FaHandshake className="text-info" />
                  <span>Direct Owner Contact</span>
                </div>
              </div>
            </Col>

            {/* Right Hero Image Card */}
            <Col lg={5} className="d-none d-lg-block">
              <div className="hero-showcase">
                <img 
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop&q=80" 
                  alt="Modern Luxury Real Estate Architecture" 
                  className="hero-showcase-main-img"
                />

                <div className="hero-floating-stat stat-pos-1">
                  <div className="floating-icon-circle bg-success bg-opacity-10 text-success">
                    <FaCheckCircle />
                  </div>
                  <div>
                    <h5 className="mb-0 fw-bold text-dark">Direct Access</h5>
                    <small className="text-muted">Zero Middleman Markup</small>
                  </div>
                </div>

                <div className="hero-floating-stat stat-pos-2">
                  <div className="floating-icon-circle bg-primary bg-opacity-10 text-primary">
                    <FaBuilding />
                  </div>
                  <div>
                    <h5 className="mb-0 fw-bold text-dark">Active Listings</h5>
                    <small className="text-muted">Live from Database</small>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── 3. Property Search Section (Supported Backend Fields) ────────── */}
      <section className="py-4 bg-white border-bottom" id="search-section">
        <Container>
          <div className="hero-search-card">
            <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <FaSearch className="text-primary" /> Search Properties
            </h5>

            <Form onSubmit={(e) => e.preventDefault()} className="hero-search-form">
              <Row className="g-3 align-items-end">
                {/* Keyword Search */}
                <Col lg={4} md={6}>
                  <Form.Label>Keyword / Address</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-white border-end-0">
                      <FaSearch className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search title, address, or details..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-start-0"
                    />
                    {searchTerm && (
                      <Button 
                        variant="outline-secondary" 
                        className="border-start-0" 
                        onClick={() => setSearchTerm('')}
                        aria-label="Clear Search"
                      >
                        <FaTimes />
                      </Button>
                    )}
                  </InputGroup>
                </Col>

                {/* Property Type (matches backend PropertyType enum) */}
                <Col lg={3} sm={6}>
                  <Form.Label>Property Purpose</Form.Label>
                  <Form.Select 
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    aria-label="Filter by Property Type"
                  >
                    <option value="ALL">All (Sale & Rent)</option>
                    <option value="SALE">For Sale</option>
                    <option value="RENT">For Rent</option>
                  </Form.Select>
                </Col>

                {/* City / Location (matches backend location field) */}
                <Col lg={3} sm={6}>
                  <Form.Label>City / Location</Form.Label>
                  <Form.Select 
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    aria-label="Filter by City"
                  >
                    <option value="ALL">All Locations</option>
                    {uniqueCities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </Form.Select>
                </Col>

                {/* Action Buttons */}
                <Col lg={2} md={12} className="d-flex gap-2">
                  <Button 
                    variant="outline-secondary" 
                    className="w-100 py-2 d-flex align-items-center justify-content-center gap-1"
                    onClick={resetFilters}
                  >
                    <FaRedo className="small" /> Reset
                  </Button>
                </Col>
              </Row>
            </Form>

            {/* Quick Status / Match Indicator */}
            <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top text-muted small flex-wrap gap-2">
              <span>
                Showing <strong>{filteredProperties.length}</strong> of <strong>{properties.length}</strong> available properties
              </span>
              {selectedType !== 'ALL' || selectedCity !== 'ALL' || searchTerm ? (
                <Badge bg="primary" className="fw-normal px-2 py-1">
                  Active Filter Applied
                </Badge>
              ) : null}
            </div>
          </div>
        </Container>
      </section>

      {/* ── 4. Featured Properties (Live API Data) ───────────────────────── */}
      <section className="py-5 bg-light" id="properties">
        <Container>
          <div className="text-center mb-5">
            <span className="section-tag">Direct From API</span>
            <h2 className="section-title">Featured Property Listings</h2>
            <p className="section-subtitle">
              Browse real-time listings retrieved directly from the PostgreSQL database via our Spring Boot REST API.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
              <h5 className="mt-3 fw-bold text-dark">Connecting to Property Services...</h5>
              <p className="text-muted">Fetching latest listings from the server.</p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="my-4">
              <Alert variant="danger" className="p-4 rounded-4 shadow-sm text-center">
                <FaInfoCircle className="fs-1 text-danger mb-3 d-block mx-auto" />
                <h5 className="fw-bold">Unable to Load Properties</h5>
                <p className="mb-3 text-secondary">{error}</p>
                <Button variant="danger" onClick={fetchLiveProperties} className="d-inline-flex align-items-center gap-2">
                  <FaRedo /> Try Again
                </Button>
              </Alert>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredProperties.length === 0 && (
            <Card className="text-center py-5 border-0 rounded-4 shadow-sm my-4">
              <Card.Body>
                <div className="feature-icon-circle bg-secondary bg-opacity-10 text-secondary mx-auto mb-3">
                  <FaBuilding className="fs-2" />
                </div>
                <h4 className="fw-bold text-dark">No Properties Match Your Criteria</h4>
                <p className="text-muted max-w-md mx-auto mb-4">
                  {properties.length === 0 
                    ? "There are currently no properties published in the database. Sign in to add your first listing!"
                    : "Try adjusting your search keywords, location, or price filters to see available homes."
                  }
                </p>
                {properties.length > 0 && (
                  <Button variant="primary" onClick={resetFilters} className="rounded-pill px-4">
                    Reset All Filters
                  </Button>
                )}
              </Card.Body>
            </Card>
          )}

          {/* Success / Property Grid */}
          {!loading && !error && filteredProperties.length > 0 && (
            <Row className="g-4">
              {filteredProperties.map((property) => {
                const imageUrl = getPrimaryImage(property);
                const isSale = property.propertyType === 'SALE';

                return (
                  <Col lg={4} md={6} key={property.id}>
                    <div className="landing-property-card">
                      {/* Property Image & Status Badges */}
                      <div className="card-img-container">
                        <img 
                          src={imageUrl} 
                          alt={property.title || 'Property View'} 
                          loading="lazy"
                        />
                        <Badge 
                          bg={isSale ? 'primary' : 'success'} 
                          className="card-status-badge"
                        >
                          FOR {property.propertyType || 'SALE'}
                        </Badge>
                        <span className="card-type-badge">
                          {property.status || 'AVAILABLE'}
                        </span>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 d-flex flex-column flex-grow-1">
                        <div className="card-price-tag mb-1">
                          {formatPrice(property.price, property.propertyType)}
                        </div>

                        <h3 className="property-title" title={property.title}>
                          {property.title}
                        </h3>

                        <div className="property-address">
                          <FaMapMarkerAlt className="text-danger me-1 flex-shrink-0" />
                          <span>{property.location || property.fullAddress || 'Location on request'}</span>
                        </div>

                        {property.description && (
                          <p className="text-muted small line-clamp-2 mb-3" style={{ minHeight: '2.5rem' }}>
                            {property.description.length > 90 
                              ? `${property.description.substring(0, 90)}...` 
                              : property.description
                            }
                          </p>
                        )}

                        {/* Card Action Buttons */}
                        <div className="mt-auto d-flex gap-2 pt-3 border-top">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            className="flex-grow-1 rounded-pill"
                            onClick={() => {
                              setSelectedProperty(property);
                              setShowModal(true);
                            }}
                          >
                            Quick View
                          </Button>
                          <Button 
                            variant="primary" 
                            size="sm"
                            className="flex-grow-1 rounded-pill d-flex align-items-center justify-content-center gap-1"
                            onClick={() => handleTourAction(property)}
                          >
                            <FaCalendarCheck /> Schedule Tour
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          )}

          {/* Link to Full Catalog */}
          <div className="text-center mt-5">
            <Button 
              as={Link} 
              to={isAuthenticated ? "/properties" : "/login"} 
              variant="outline-primary"
              size="lg"
              className="rounded-pill px-4"
            >
              Browse Full Catalog & Manage Listings <FaArrowRight className="ms-2" />
            </Button>
          </div>
        </Container>
      </section>

      {/* ── 5. Benefits Section ("Why Choose Us") ───────────────────────── */}
      <section className="features-section" id="benefits">
        <Container>
          <div className="text-center mb-5">
            <span className="section-tag">Platform Benefits</span>
            <h2 className="section-title">Why Manage Real Estate with Us</h2>
            <p className="section-subtitle">
              Engineered with Spring Boot security and modern React UI, our system delivers 
              frictionless property transactions.
            </p>
          </div>

          <Row className="g-4">
            <Col lg={4} md={6}>
              <div className="feature-box">
                <div className="feature-icon-circle bg-primary bg-opacity-10 text-primary">
                  <FaShieldAlt />
                </div>
                <h4 className="feature-title">Verified Ownership</h4>
                <p className="feature-desc">
                  Every listed villa and apartment is linked to verified user accounts, ensuring 
                  legitimate documentation and secure property records.
                </p>
              </div>
            </Col>

            <Col lg={4} md={6}>
              <div className="feature-box">
                <div className="feature-icon-circle bg-success bg-opacity-10 text-success">
                  <FaCalendarCheck />
                </div>
                <h4 className="feature-title">Instant In-Person Booking</h4>
                <p className="feature-desc">
                  Pick your preferred date and time online. Owners review and approve viewing requests 
                  directly through their appointment dashboard.
                </p>
              </div>
            </Col>

            <Col lg={4} md={6}>
              <div className="feature-box">
                <div className="feature-icon-circle bg-info bg-opacity-10 text-info">
                  <FaCamera />
                </div>
                <h4 className="feature-title">Multi-Image Galleries</h4>
                <p className="feature-desc">
                  Comprehensive photo uploads with primary thumbnail designation, allowing buyers 
                  to inspect interiors and exteriors before scheduling a tour.
                </p>
              </div>
            </Col>

            <Col lg={4} md={6}>
              <div className="feature-box">
                <div className="feature-icon-circle bg-warning bg-opacity-10 text-warning">
                  <FaHandshake />
                </div>
                <h4 className="feature-title">Direct Communication</h4>
                <p className="feature-desc">
                  Connect buyers and owners directly with verified contact numbers and emails, 
                  cutting out middleman markups.
                </p>
              </div>
            </Col>

            <Col lg={4} md={6}>
              <div className="feature-box">
                <div className="feature-icon-circle bg-danger bg-opacity-10 text-danger">
                  <FaChartLine />
                </div>
                <h4 className="feature-title">Formalized Sales Closure</h4>
                <p className="feature-desc">
                  Close transactions with recorded payment methods (Bank Transfer, Credit Card, Cash) 
                  and automatic ownership updates in PostgreSQL.
                </p>
              </div>
            </Col>

            <Col lg={4} md={6}>
              <div className="feature-box">
                <div className="feature-icon-circle bg-secondary bg-opacity-10 text-dark">
                  <FaUserCheck />
                </div>
                <h4 className="feature-title">Role-Based Access Control</h4>
                <p className="feature-desc">
                  Strict administrative governance with Spring Security method security, separating 
                  standard user actions from admin oversight.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── 6. About Us Section ─────────────────────────────────────────── */}
      <section className="py-5 bg-white" id="about">
        <Container>
          <Row className="align-items-center gy-4">
            <Col lg={6}>
              <span className="section-tag">About Our Platform</span>
              <h2 className="section-title mb-3">Modernizing Real Estate Management</h2>
              <p className="text-secondary mb-3">
                The Real Estate Management System is a full-stack, enterprise-grade portal developed 
                to connect property owners, prospective buyers, and tenants through transparent digital workflows.
              </p>
              <p className="text-secondary mb-4">
                Powered by a high-performance Java Spring Boot backend and responsive React single-page architecture, 
                our system handles property listings, high-resolution media galleries, calendar-based tour scheduling, 
                and sales tracking with maximum reliability and security.
              </p>

              <div className="row g-3">
                <div className="col-sm-6">
                  <div className="p-3 bg-light rounded-3 border">
                    <h5 className="fw-bold text-primary mb-1">Full-Stack Tech</h5>
                    <small className="text-muted">Spring Boot, React 19, PostgreSQL</small>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="p-3 bg-light rounded-3 border">
                    <h5 className="fw-bold text-success mb-1">Stateless Security</h5>
                    <small className="text-muted">JWT Auth & Role-Based Permissions</small>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={6}>
              <div className="p-4 bg-light rounded-4 border shadow-sm">
                <h5 className="fw-bold text-dark mb-3">Platform Capabilities at a Glance</h5>
                <ul className="list-unstyled mb-0">
                  <li className="d-flex align-items-center gap-2 mb-3">
                    <FaCheckCircle className="text-primary flex-shrink-0" />
                    <span><strong>User Authentication:</strong> Secure user registration and BCrypt password encryption.</span>
                  </li>
                  <li className="d-flex align-items-center gap-2 mb-3">
                    <FaCheckCircle className="text-primary flex-shrink-0" />
                    <span><strong>Property CRUD:</strong> Add, edit, manage, and delete residential and commercial properties.</span>
                  </li>
                  <li className="d-flex align-items-center gap-2 mb-3">
                    <FaCheckCircle className="text-primary flex-shrink-0" />
                    <span><strong>Appointment Scheduling:</strong> Request and approve viewing tours with status tracking.</span>
                  </li>
                  <li className="d-flex align-items-center gap-2 mb-3">
                    <FaCheckCircle className="text-primary flex-shrink-0" />
                    <span><strong>Sales Ledger:</strong> Finalize property sales with buyer linking and transaction logging.</span>
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <FaCheckCircle className="text-primary flex-shrink-0" />
                    <span><strong>Admin Dashboard:</strong> Comprehensive metrics, user management, and property moderation.</span>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── 7. How It Works Section ─────────────────────────────────────── */}
      <section className="how-it-works-section" id="how-it-works">
        <Container>
          <div className="text-center mb-5">
            <span className="section-tag">Step-by-Step</span>
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Three straightforward steps from browsing listings to completing your tour.
            </p>
          </div>

          <Row className="g-4">
            <Col md={4}>
              <div className="step-card">
                <div className="step-number-badge">1</div>
                <h4 className="step-title">Explore & Filter</h4>
                <p className="step-desc">
                  Browse authentic listings with exact price details, locations, contact numbers, 
                  and photo galleries.
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div className="step-card">
                <div className="step-number-badge">2</div>
                <h4 className="step-title">Schedule a Tour</h4>
                <p className="step-desc">
                  Pick your desired visit date and time slot. The owner receives your request with 
                  contact details instantly.
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div className="step-card">
                <div className="step-number-badge">3</div>
                <h4 className="step-title">Close With Confidence</h4>
                <p className="step-desc">
                  Finalize your transaction with certified records and clear payment documentation 
                  recorded in the system.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── 8. Call-To-Action Banner ────────────────────────────────────── */}
      <section className="cta-banner-section text-center">
        <Container>
          <h2 className="cta-title">Ready to Experience Modern Real Estate?</h2>
          <p className="cta-subtitle">
            Create your account today to schedule viewing appointments or publish your own properties.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Button 
              as={Link} 
              to={isAuthenticated ? "/properties" : "/register"} 
              className="cta-btn-light d-flex align-items-center gap-2"
              size="lg"
            >
              <FaUserCheck /> {isAuthenticated ? 'Go to Properties' : 'Create Free Account'}
            </Button>
            <Button 
              as={Link} 
              to={isAuthenticated ? "/properties/new" : "/login"} 
              className="cta-btn-outline d-flex align-items-center gap-2"
              size="lg"
            >
              <FaHome /> List Your Property
            </Button>
          </div>
        </Container>
      </section>

      {/* ── 9. Footer ───────────────────────────────────────────────────── */}
      <LandingFooter />

      {/* ── Quick View Modal (Real Backend Data) ────────────────────────── */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        {selectedProperty && (
          <>
            <Modal.Header closeButton className="border-0 pb-0">
              <div>
                <Badge bg={selectedProperty.propertyType === 'SALE' ? 'primary' : 'success'} className="mb-2">
                  FOR {selectedProperty.propertyType || 'SALE'}
                </Badge>
                <h4 className="modal-title fw-bold text-dark">{selectedProperty.title}</h4>
                <div className="text-muted small">
                  <FaMapMarkerAlt className="text-danger me-1" />
                  {selectedProperty.fullAddress || selectedProperty.location || 'Address on file'}
                </div>
              </div>
            </Modal.Header>
            <Modal.Body className="pt-3">
              <div className="rounded-3 overflow-hidden mb-3" style={{ maxHeight: '350px' }}>
                <img 
                  src={getPrimaryImage(selectedProperty)} 
                  alt={selectedProperty.title} 
                  className="w-100 h-100 object-fit-cover"
                />
              </div>

              <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded-3 mb-3 flex-wrap gap-2">
                <div>
                  <small className="text-muted d-block">Listed Price</small>
                  <h3 className="text-primary fw-bold mb-0">
                    {formatPrice(selectedProperty.price, selectedProperty.propertyType)}
                  </h3>
                </div>
                {selectedProperty.contactNumber && (
                  <div className="text-end">
                    <small className="text-muted d-block">Owner Contact</small>
                    <span className="fw-semibold text-dark">
                      <FaPhoneAlt className="text-success me-1 small" />
                      {selectedProperty.contactNumber}
                    </span>
                  </div>
                )}
              </div>

              <h6 className="fw-bold mb-2 text-dark">Property Description</h6>
              <p className="text-secondary">
                {selectedProperty.description || 'No additional description provided for this listing.'}
              </p>

              {selectedProperty.ownerEmail && (
                <div className="mt-3 p-2 bg-light rounded text-muted small d-flex align-items-center gap-2">
                  <FaEnvelope className="text-primary" />
                  <span>Listed by: <strong>{selectedProperty.ownerEmail}</strong></span>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer className="border-0 pt-0">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close Preview
              </Button>
              <Button 
                variant="primary" 
                className="landing-btn-primary"
                onClick={() => {
                  setShowModal(false);
                  handleTourAction(selectedProperty);
                }}
              >
                {isAuthenticated ? 'Schedule Viewing Tour' : 'Sign In to Schedule Tour'}
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
};

export default LandingPage;
