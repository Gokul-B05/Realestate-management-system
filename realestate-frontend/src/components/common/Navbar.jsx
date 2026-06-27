import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { 
  FaHome, FaPlus, FaCalendarCheck, FaShoppingCart, 
  FaUser, FaCog, FaSignOutAlt, 
  FaChartBar, FaBuilding, FaUsers, FaMoneyBillWave,
  FaChevronDown
} from 'react-icons/fa';

const NavigationBar = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // STRONG CHECK: Absolutely hide on these paths
  const authPaths = ['/', '/login', '/register'];
  if (authPaths.includes(location.pathname)) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // If not authenticated, don't render anything
  if (!isAuthenticated) {
    return null;
  }

  // Get user's display name
  const getDisplayName = () => {
    if (!user) return 'User';
    return user.name || user.email?.split('@')[0] || 'User';
  };

  // Check if user is admin
  const userIsAdmin = isAdmin();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-lg">
      <Container fluid>
        {/* Brand Logo */}
        <Navbar.Brand as={Link} to="/properties" className="fw-bold text-white">
          <FaHome className="me-2 text-primary" />
          RealEstate
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0">
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>
        
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Main Navigation Links */}
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/properties" className="text-white-50 hover-text-white">
              <FaBuilding className="me-1" />
              Properties
            </Nav.Link>

            <Nav.Link as={Link} to="/properties/new" className="text-white-50 hover-text-white">
              <FaPlus className="me-1" />
              Add Property
            </Nav.Link>

            <Nav.Link as={Link} to="/appointments" className="text-white-50 hover-text-white">
              <FaCalendarCheck className="me-1" />
              Appointments
            </Nav.Link>

            <Nav.Link as={Link} to="/transactions" className="text-white-50 hover-text-white">
              <FaShoppingCart className="me-1" />
              Transactions
            </Nav.Link>

            <Nav.Link as={Link} to="/sales" className="text-white-50 hover-text-white">
              <FaMoneyBillWave className="me-1" />
              Sales
            </Nav.Link>

            {/* Admin Only Links */}
            {userIsAdmin && (
              <>
                <Nav.Link as={Link} to="/admin/dashboard" className="text-white-50 hover-text-white">
                  <FaChartBar className="me-1" />
                  Dashboard
                </Nav.Link>

                <Nav.Link as={Link} to="/admin/users" className="text-white-50 hover-text-white">
                  <FaUsers className="me-1" />
                  Users
                </Nav.Link>
              </>
            )}
          </Nav>

          {/* User Dropdown - IMPROVED SCROLLING */}
          <NavDropdown 
            title={
              <span className="text-white fw-semibold">
                <FaUser className="me-2 text-primary" />
                {getDisplayName()}
                <FaChevronDown className="ms-2 small-dropdown-icon" />
              </span>
            }
            id="user-dropdown"
            align="end"
            className="user-dropdown custom-dropdown"
            renderMenuOnMount={true}
          >
            <div className="dropdown-header-info bg-primary text-white p-3">
              <FaUser className="me-2" size={20} />
              <strong>{getDisplayName()}</strong>
              <small className="d-block text-white-50 mt-1">{user?.email}</small>
            </div>
            
            <div className="dropdown-scrollable">
              <NavDropdown.Item as={Link} to="/profile" className="py-2">
                <FaUser className="me-3 text-primary" />
                My Profile
              </NavDropdown.Item>

              <NavDropdown.Item as={Link} to="/my-properties" className="py-2">
                <FaBuilding className="me-3 text-success" />
                My Properties
              </NavDropdown.Item>

              <NavDropdown.Item as={Link} to="/appointments" className="py-2">
                <FaCalendarCheck className="me-3 text-info" />
                My Appointments
              </NavDropdown.Item>

              <NavDropdown.Item as={Link} to="/my-transactions" className="py-2">
                <FaShoppingCart className="me-3 text-warning" />
                My Transactions
              </NavDropdown.Item>

              <NavDropdown.Item as={Link} to="/sales" className="py-2">
                <FaMoneyBillWave className="me-3 text-success" />
                Sales & Purchases
              </NavDropdown.Item>

              {userIsAdmin && (
                <>
                  <NavDropdown.Divider />
                  <NavDropdown.Header className="text-muted small text-uppercase">
                    Admin Tools
                  </NavDropdown.Header>
                  <NavDropdown.Item as={Link} to="/admin/users" className="py-2">
                    <FaUsers className="me-3 text-danger" />
                    Manage Users
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/properties" className="py-2">
                    <FaBuilding className="me-3 text-danger" />
                    All Properties
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/appointments" className="py-2">
                    <FaCalendarCheck className="me-3 text-danger" />
                    All Appointments
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/transactions" className="py-2">
                    <FaShoppingCart className="me-3 text-danger" />
                    All Transactions
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/sales" className="py-2">
                    <FaMoneyBillWave className="me-3 text-danger" />
                    All Sales
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/reports" className="py-2">
                    <FaChartBar className="me-3 text-danger" />
                    Reports
                  </NavDropdown.Item>
                </>
              )}

              <NavDropdown.Divider />
              
              <NavDropdown.Item as={Link} to="/settings" className="py-2">
                <FaCog className="me-3 text-secondary" />
                Settings
              </NavDropdown.Item>

              <NavDropdown.Item onClick={handleLogout} className="py-2 text-danger fw-bold">
                <FaSignOutAlt className="me-3 text-danger" />
                Logout
              </NavDropdown.Item>
            </div>
          </NavDropdown>
        </Navbar.Collapse>
      </Container>

      {/* Custom CSS for better visibility and scrolling */}
      <style jsx="true">{`
        .hover-text-white:hover {
          color: white !important;
          transition: color 0.2s ease;
        }
        
        .small-dropdown-icon {
          font-size: 0.8rem;
          opacity: 0.8;
        }
        
        .custom-dropdown .dropdown-toggle {
          background: rgba(255,255,255,0.1) !important;
          border-radius: 8px !important;
          padding: 8px 16px !important;
          border: 1px solid rgba(255,255,255,0.2) !important;
          transition: all 0.3s ease !important;
        }
        
        .custom-dropdown .dropdown-toggle:hover {
          background: rgba(255,255,255,0.2) !important;
          border-color: rgba(255,255,255,0.3) !important;
        }
        
        .custom-dropdown .dropdown-toggle::after {
          display: none !important;
        }
        
        .custom-dropdown .dropdown-menu {
          margin-top: 10px !important;
          border: none !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2) !important;
          overflow: hidden !important;
          min-width: 280px !important;
          max-width: 320px !important;
          animation: dropdownFade 0.3s ease;
          position: absolute !important;
          right: 0 !important;
          left: auto !important;
          max-height: 80vh !important; /* Limit height to 80% of viewport */
        }
        
        /* Scrollable dropdown content */
        .dropdown-scrollable {
          max-height: 60vh !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
        }
        
        /* Custom scrollbar styling */
        .dropdown-scrollable::-webkit-scrollbar {
          width: 6px;
        }
        
        .dropdown-scrollable::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .dropdown-scrollable::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        
        .dropdown-scrollable::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        
        @keyframes dropdownFade {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .dropdown-header-info {
          border-bottom: 1px solid rgba(255,255,255,0.1);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        
        .custom-dropdown .dropdown-item {
          padding: 12px 20px !important;
          transition: all 0.2s ease !important;
          border-left: 3px solid transparent;
          white-space: normal !important; /* Allow text wrapping */
          word-wrap: break-word !important;
        }
        
        .custom-dropdown .dropdown-item:hover {
          background-color: #f8f9fa !important;
          border-left-color: #007bff !important;
          transform: translateX(5px);
        }
        
        .custom-dropdown .dropdown-item.text-danger:hover {
          background-color: #dc3545 !important;
          color: white !important;
          border-left-color: white !important;
        }
        
        .custom-dropdown .dropdown-item.text-danger:hover svg {
          color: white !important;
        }
        
        .custom-dropdown .dropdown-divider {
          margin: 8px 0 !important;
          opacity: 0.2;
        }
        
        .custom-dropdown .dropdown-header {
          padding: 8px 20px !important;
          font-weight: 600 !important;
          letter-spacing: 0.5px !important;
          position: sticky;
          top: 0;
          background: white;
          z-index: 5;
        }
        
        /* Mobile Responsive */
        @media (max-width: 991px) {
          .custom-dropdown .dropdown-menu {
            position: static !important;
            float: none !important;
            width: 100% !important;
            margin-top: 5px !important;
            background: rgba(255,255,255,0.1) !important;
            box-shadow: none !important;
            max-height: none !important;
          }
          
          .dropdown-scrollable {
            max-height: none !important;
            overflow-y: visible !important;
          }
          
          .custom-dropdown .dropdown-item {
            color: rgba(255,255,255,0.9) !important;
          }
          
          .custom-dropdown .dropdown-item:hover {
            background: rgba(255,255,255,0.2) !important;
            color: white !important;
          }
          
          .dropdown-header-info {
            background: rgba(255,255,255,0.1) !important;
          }
        }
      `}</style>
    </Navbar>
  );
};

export default NavigationBar;