import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Table, Badge, Button, Spinner, Alert,
  Form, InputGroup
} from 'react-bootstrap';
import { 
  FaCalendarCheck, FaCheck, FaTimes, FaEye, FaSearch,
  FaFilter, FaUser, FaHome, FaClock
} from 'react-icons/fa';
import adminService from '../../services/adminService';
import { Link } from 'react-router-dom';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchTerm, statusFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      console.log('Fetching all appointments...');
      
      // Fetch real data from backend
      const data = await adminService.getAllAppointments();
      console.log('Appointments received:', data);
      
      setAppointments(data || []);
      setFilteredAppointments(data || []);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];
    
    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        app.propertyTitle?.toLowerCase().includes(term) ||
        app.userName?.toLowerCase().includes(term) ||
        app.userEmail?.toLowerCase().includes(term) ||
        app.property?.toLowerCase().includes(term) ||
        app.visitor?.toLowerCase().includes(term)
      );
    }
    
    setFilteredAppointments(filtered);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await adminService.updateAppointmentStatus(id, newStatus);
      // Refresh the list
      fetchAppointments();
    } catch (err) {
      alert('Failed to update appointment status');
    }
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading appointments...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Button onClick={fetchAppointments}>Try Again</Button>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">
            <FaCalendarCheck className="me-2 text-primary" />
            Manage Appointments
          </h2>
          <p className="text-muted">View and manage all appointment requests</p>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={5}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by property or visitor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
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
        <Col md={3}>
          <Button variant="outline-secondary" onClick={clearFilters} className="w-100">
            Clear Filters
          </Button>
        </Col>
      </Row>

      {/* Summary */}
      <Row className="mb-3">
        <Col>
          <p className="text-muted">
            Showing <strong>{filteredAppointments.length}</strong> of <strong>{appointments.length}</strong> appointments
          </p>
        </Col>
      </Row>

      {/* Appointments Table */}
      {filteredAppointments.length === 0 ? (
        <Alert variant="info">No appointments found</Alert>
      ) : (
        <Card className="shadow-sm">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Property</th>
                    <th>Visitor</th>
                    <th>Date & Time</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map(app => (
                    <tr key={app.id}>
                      <td>
                        <FaHome className="me-2 text-primary" />
                        <strong>{app.propertyTitle || app.property}</strong>
                      </td>
                      <td>
                        <FaUser className="me-2 text-info" />
                        {app.userName || app.visitor}
                      </td>
                      <td>
                        <FaClock className="me-2 text-success" />
                        {formatDate(app.scheduledTime || app.date)}
                      </td>
                      <td>
                        {app.userEmail || app.visitorEmail || 'N/A'}
                        {app.contactPhone && <div><small>📞 {app.contactPhone}</small></div>}
                      </td>
                      <td>{getStatusBadge(app.status)}</td>
                      <td>
                        <Button variant="info" size="sm" className="me-2">
                          <FaEye />
                        </Button>
                        {app.status === 'PENDING' && (
                          <>
                            <Button 
                              variant="success" 
                              size="sm" 
                              className="me-2"
                              onClick={() => handleUpdateStatus(app.id, 'CONFIRMED')}
                            >
                              <FaCheck />
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm"
                              onClick={() => handleUpdateStatus(app.id, 'CANCELLED')}
                            >
                              <FaTimes />
                            </Button>
                          </>
                        )}
                        {app.status === 'CONFIRMED' && (
                          <Button 
                            variant="info" 
                            size="sm"
                            onClick={() => handleUpdateStatus(app.id, 'COMPLETED')}
                          >
                            Mark Complete
                          </Button>
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
              Total: {appointments.length} | 
              Pending: {appointments.filter(a => a.status === 'PENDING').length} |
              Confirmed: {appointments.filter(a => a.status === 'CONFIRMED').length} |
              Completed: {appointments.filter(a => a.status === 'COMPLETED').length} |
              Cancelled: {appointments.filter(a => a.status === 'CANCELLED').length}
            </small>
          </Card.Footer>
        </Card>
      )}
    </Container>
  );
};

export default AdminAppointments;