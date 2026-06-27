import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, Row, Col, Card, Table, Badge, Spinner, Alert, 
  Button, Modal, ListGroup, Tabs, Tab, Form, InputGroup 
} from 'react-bootstrap';
import { 
  FaCalendarCheck, FaClock, FaCheck, FaTimes, FaEye, 
  FaPhone, FaEnvelope, FaHome, FaUser, FaSearch,
  FaFilter, FaCalendarAlt, FaCheckCircle, FaHourglassHalf
} from 'react-icons/fa';
import appointmentService from '../../services/appointmentService';
import { useAuth } from '../../context/AuthContext';

const Appointments = () => {
  const [myAppointments, setMyAppointments] = useState([]);
  const [ownerAppointments, setOwnerAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState('my-visits');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    fetchAllAppointments();
  }, []);

  const fetchAllAppointments = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch user's appointments
      const myAppts = await appointmentService.getMyAppointments();
      setMyAppointments(myAppts || []);
      
      // Fetch owner appointments (appointments for user's properties)
      try {
        const ownerAppts = await appointmentService.getOwnerAppointments();
        setOwnerAppointments(ownerAppts || []);
      } catch (err) {
        console.log('Not a property owner or no owner appointments');
        setOwnerAppointments([]);
      }
      
      // Fetch all appointments if admin
      if (isAdmin()) {
        try {
          const allAppts = await appointmentService.getAllAppointments();
          setAllAppointments(allAppts || []);
        } catch (err) {
          console.log('Could not fetch all appointments');
          setAllAppointments([]);
        }
      }
      
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await appointmentService.updateAppointmentStatus(id, status);
      await fetchAllAppointments(); // Refresh data
    } catch (err) {
      alert('Failed to update appointment status');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    
    try {
      await appointmentService.cancelAppointment(id);
      await fetchAllAppointments();
    } catch (err) {
      alert('Failed to cancel appointment');
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const getStatusBadge = (status) => {
    const colors = {
      'PENDING': 'warning',
      'CONFIRMED': 'success',
      'CANCELLED': 'danger',
      'COMPLETED': 'info'
    };
    return <Badge bg={colors[status] || 'secondary'} pill>{status}</Badge>;
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'PENDING': return <FaHourglassHalf className="text-warning" />;
      case 'CONFIRMED': return <FaCheckCircle className="text-success" />;
      case 'CANCELLED': return <FaTimes className="text-danger" />;
      case 'COMPLETED': return <FaCheck className="text-info" />;
      default: return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'N/A';
    }
  };

  const filterAppointments = (appointments) => {
    let filtered = [...appointments];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        app.propertyTitle?.toLowerCase().includes(term) ||
        app.userName?.toLowerCase().includes(term) ||
        app.userEmail?.toLowerCase().includes(term) ||
        app.contactPhone?.includes(term)
      );
    }
    
    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    return filtered;
  };

  const getCurrentAppointments = () => {
    if (activeTab === 'my-visits') return filterAppointments(myAppointments);
    if (activeTab === 'property-requests') return filterAppointments(ownerAppointments);
    if (activeTab === 'all') return filterAppointments(allAppointments);
    return [];
  };

  const getTabCount = (tab) => {
    if (tab === 'my-visits') return myAppointments.length;
    if (tab === 'property-requests') return ownerAppointments.length;
    if (tab === 'all') return allAppointments.length;
    return 0;
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3">Loading appointments...</p>
      </Container>
    );
  }

  const currentAppointments = getCurrentAppointments();

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4 align-items-center">
        <Col md={6}>
          <h2 className="fw-bold mb-0">
            <FaCalendarCheck className="me-2 text-primary" />
            Appointments
          </h2>
          <p className="text-muted mt-2 mb-0">
            Manage your property visits and requests
          </p>
        </Col>
        <Col md={6} className="text-end">
          <Button as={Link} to="/properties" variant="primary">
            <FaHome className="me-2" />
            Browse Properties
          </Button>
        </Col>
      </Row>

      {/* Tabs */}
      <Row className="mb-4">
        <Col>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            <Tab 
              eventKey="my-visits" 
              title={
                <span>
                  My Visits <Badge bg="primary" pill>{myAppointments.length}</Badge>
                </span>
              } 
            />
            <Tab 
              eventKey="property-requests" 
              title={
                <span>
                  Property Requests <Badge bg="success" pill>{ownerAppointments.length}</Badge>
                </span>
              }
            />
            {isAdmin() && (
              <Tab 
                eventKey="all" 
                title={
                  <span>
                    All Appointments <Badge bg="danger" pill>{allAppointments.length}</Badge>
                  </span>
                }
              />
            )}
          </Tabs>
        </Col>
      </Row>

      {/* Search and Filter */}
      {(myAppointments.length > 0 || ownerAppointments.length > 0 || allAppointments.length > 0) && (
        <Row className="mb-4">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search by property, visitor, or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button 
                  variant="outline-secondary" 
                  onClick={() => setSearchTerm('')}
                >
                  Clear
                </Button>
              )}
            </InputGroup>
          </Col>
          <Col md={4}>
            <InputGroup>
              <InputGroup.Text>
                <FaFilter />
              </InputGroup.Text>
              <Form.Select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </Form.Select>
            </InputGroup>
          </Col>
          <Col md={2}>
            <p className="text-muted mb-0 mt-2">
              Showing {currentAppointments.length} of {getTabCount(activeTab)}
            </p>
          </Col>
        </Row>
      )}

      {/* Error Message */}
      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Appointments Table */}
      {currentAppointments.length === 0 ? (
        <Row>
          <Col>
            <Alert variant="info" className="text-center">
              {activeTab === 'my-visits' && (
                <>
                  <h5>No Visits Scheduled</h5>
                  <p>You haven't scheduled any property visits yet.</p>
                  <Button as={Link} to="/properties" variant="primary">
                    Browse Properties
                  </Button>
                </>
              )}
              {activeTab === 'property-requests' && (
                <>
                  <h5>No Property Requests</h5>
                  <p>You don't have any appointment requests for your properties.</p>
                </>
              )}
              {activeTab === 'all' && (
                <>
                  <h5>No Appointments</h5>
                  <p>No appointments in the system yet.</p>
                </>
              )}
            </Alert>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            <Card className="shadow-sm">
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Property</th>
                        <th>Date & Time</th>
                        <th>Visitor</th>
                        <th>Contact</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentAppointments.map((app) => (
                        <tr key={app.id}>
                          <td>
                            <strong>{app.propertyTitle}</strong>
                          </td>
                          <td>
                            <FaClock className="text-primary me-2" />
                            {formatDate(app.scheduledTime)}
                          </td>
                          <td>
                            <FaUser className="text-info me-2" />
                            {app.userName || app.userEmail}
                          </td>
                          <td>
                            {app.contactPhone && (
                              <div>
                                <FaPhone className="text-success me-2" size={12} />
                                {app.contactPhone}
                              </div>
                            )}
                            <div>
                              <FaEnvelope className="text-secondary me-2" size={12} />
                              <small>{app.userEmail}</small>
                            </div>
                          </td>
                          <td>
                            {getStatusIcon(app.status)} {getStatusBadge(app.status)}
                          </td>
                          <td>
                            <Button
                              variant="outline-info"
                              size="sm"
                              className="me-2"
                              onClick={() => handleViewDetails(app)}
                            >
                              <FaEye /> Details
                            </Button>
                            
                            {/* Visitor actions */}
                            {activeTab === 'my-visits' && app.status === 'PENDING' && (
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleCancel(app.id)}
                              >
                                <FaTimes /> Cancel
                              </Button>
                            )}

                            {/* Owner actions */}
                            {activeTab === 'property-requests' && app.status === 'PENDING' && (
                              <>
                                <Button
                                  variant="outline-success"
                                  size="sm"
                                  className="me-2"
                                  onClick={() => handleUpdateStatus(app.id, 'CONFIRMED')}
                                >
                                  <FaCheck /> Confirm
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleUpdateStatus(app.id, 'CANCELLED')}
                                >
                                  <FaTimes /> Reject
                                </Button>
                              </>
                            )}

                            {activeTab === 'property-requests' && app.status === 'CONFIRMED' && (
                              <Button
                                variant="outline-info"
                                size="sm"
                                onClick={() => handleUpdateStatus(app.id, 'COMPLETED')}
                              >
                                <FaCheck /> Complete
                              </Button>
                            )}

                            {/* Admin actions */}
                            {isAdmin() && activeTab === 'all' && app.status === 'PENDING' && (
                              <>
                                <Button
                                  variant="outline-success"
                                  size="sm"
                                  className="me-2"
                                  onClick={() => handleUpdateStatus(app.id, 'CONFIRMED')}
                                >
                                  <FaCheck /> Confirm
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleUpdateStatus(app.id, 'CANCELLED')}
                                >
                                  <FaTimes /> Cancel
                                </Button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
              <Card.Footer className="bg-white text-muted">
                <small>
                  Showing {currentAppointments.length} of {getTabCount(activeTab)} appointments
                </small>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      )}

      {/* Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <FaCalendarCheck className="me-2" />
            Appointment Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <Row>
              <Col md={6}>
                <h5 className="border-bottom pb-2">Property Information</h5>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Property:</strong> {selectedAppointment.propertyTitle}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Scheduled Time:</strong><br />
                    <FaClock className="me-2 text-primary" />
                    {formatDate(selectedAppointment.scheduledTime)}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Status:</strong> {getStatusBadge(selectedAppointment.status)}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Requested on:</strong><br />
                    <FaCalendarAlt className="me-2 text-info" />
                    {new Date(selectedAppointment.requestDate).toLocaleDateString()}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={6}>
                <h5 className="border-bottom pb-2">Contact Information</h5>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Name:</strong> {selectedAppointment.userName || selectedAppointment.userEmail}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Email:</strong> {selectedAppointment.userEmail}
                  </ListGroup.Item>
                  {selectedAppointment.contactPhone && (
                    <ListGroup.Item>
                      <strong>Phone:</strong> {selectedAppointment.contactPhone}
                    </ListGroup.Item>
                  )}
                </ListGroup>

                {selectedAppointment.message && (
                  <>
                    <h5 className="border-bottom pb-2 mt-4">Message</h5>
                    <Card bg="light" className="p-3">
                      <p className="mb-0">{selectedAppointment.message}</p>
                    </Card>
                  </>
                )}
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Appointments;