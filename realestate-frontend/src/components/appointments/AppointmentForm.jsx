import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaCalendarCheck, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import appointmentService from '../../services/appointmentService';
import propertyService from '../../services/propertyService';

const AppointmentForm = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [propertyLoading, setPropertyLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [property, setProperty] = useState(null);
  const [formData, setFormData] = useState({
    propertyId: propertyId,
    scheduledTime: '',
    message: '',
    contactPhone: ''
  });

  useEffect(() => {
    fetchPropertyDetails();
  }, [propertyId]);

  const fetchPropertyDetails = async () => {
    try {
      setPropertyLoading(true);
      const properties = await propertyService.getAllProperties();
      const foundProperty = properties.find(p => p.id === parseInt(propertyId));
      setProperty(foundProperty);
    } catch (err) {
      setError('Failed to load property details');
    } finally {
      setPropertyLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await appointmentService.createAppointment(formData);
      setSuccess('Appointment request sent successfully!');
      setTimeout(() => navigate('/my-appointments'), 2000);
    } catch (err) {
      setError(err.response?.data || 'Failed to schedule appointment');
    } finally {
      setLoading(false);
    }
  };

  if (propertyLoading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading property details...</p>
      </Container>
    );
  }

  if (!property) {
    return (
      <Container className="py-5">
        <Alert variant="danger">Property not found</Alert>
        <Button onClick={() => navigate('/properties')}>Back to Properties</Button>
      </Container>
    );
  }

  // Get tomorrow's date for min datetime
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateTime = tomorrow.toISOString().slice(0, 16);

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">
                <FaCalendarCheck className="me-2" />
                Schedule a Visit
              </h4>
            </Card.Header>
            <Card.Body>
              {/* Property Summary */}
              <Card className="bg-light mb-4">
                <Card.Body>
                  <Row>
                    <Col md={8}>
                      <h5>{property.title}</h5>
                      <p className="text-muted mb-1">{property.location}</p>
                      <p className="mb-0">
                        <strong>Price:</strong> ${property.price?.toLocaleString()}
                      </p>
                    </Col>
                    <Col md={4}>
                      <div className="text-end">
                        <span className={`badge bg-${property.propertyType === 'SALE' ? 'success' : 'info'} p-2`}>
                          {property.propertyType === 'SALE' ? 'For Sale' : 'For Rent'}
                        </span>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaClock className="me-2 text-primary" />
                    Preferred Date & Time *
                  </Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="scheduledTime"
                    value={formData.scheduledTime}
                    onChange={handleChange}
                    required
                    min={minDateTime}
                    className="form-control-lg"
                  />
                  <Form.Text className="text-muted">
                    Please select a date and time at least 24 hours in advance
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaPhone className="me-2 text-success" />
                    Contact Phone
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    name="contactPhone"
                    placeholder="Enter your phone number"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className="form-control-lg"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    <FaEnvelope className="me-2 text-info" />
                    Message (Optional)
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="message"
                    placeholder="Any specific questions or requests? (e.g., 'I'd like to see the backyard', 'Will parking be available?', etc.)"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </Form.Group>

                <div className="d-flex gap-3">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="flex-grow-1"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Scheduling...
                      </>
                    ) : (
                      <>
                        <FaCalendarCheck className="me-2" />
                        Schedule Visit
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="lg"
                    onClick={() => navigate(`/properties`)}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AppointmentForm;