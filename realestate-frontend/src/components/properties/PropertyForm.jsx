import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaSave, FaTimes, FaPhone, FaMapMarkerAlt, FaHome, FaDollarSign } from 'react-icons/fa';
import propertyService from '../../services/propertyService';

const PropertyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(!!id);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    fullAddress: '',
    contactNumber: '',
    propertyType: 'SALE'
  });

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      const properties = await propertyService.getAllProperties();
      const property = properties.find(p => p.id === parseInt(id));
      if (property) {
        setFormData({
          title: property.title || '',
          description: property.description || '',
          price: property.price || '',
          location: property.location || '',
          fullAddress: property.fullAddress || '',
          contactNumber: property.contactNumber || '',
          propertyType: property.propertyType || 'SALE'
        });
      }
    } catch (err) {
      setError('Failed to load property');
    } finally {
      setFetchLoading(false);
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

    // Log the data being sent
    console.log('Submitting property data:', formData);

    try {
      if (id) {
        await propertyService.updateProperty(id, formData);
      } else {
        await propertyService.createProperty(formData);
      }
      navigate('/properties');
    } catch (err) {
      console.error('Error saving property:', err);
      setError(err.response?.data?.message || 'Failed to save property');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading property...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col xs={12} lg={8}>
          <Card className="shadow border-0">
            <Card.Header className="bg-white py-3">
              <h4 className="mb-0 fw-bold">
                <FaHome className="me-2 text-primary" />
                {id ? 'Edit Property' : 'Add New Property'}
              </h4>
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Title *</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        placeholder="Enter property title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Property Type *</Form.Label>
                      <Form.Select
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleChange}
                        required
                      >
                        <option value="SALE">For Sale</option>
                        <option value="RENT">For Rent</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    rows={4}
                    placeholder="Describe the property"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">
                        <FaDollarSign className="me-1 text-success" />
                        Price *
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        placeholder="Enter price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">
                        <FaMapMarkerAlt className="me-1 text-danger" />
                        City/Location *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="location"
                        placeholder="e.g., Los Angeles, CA"
                        value={formData.location}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">
                        <FaPhone className="me-1 text-primary" />
                        Contact Number *
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        name="contactNumber"
                        placeholder="e.g., +1 (555) 123-4567"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">
                    <FaMapMarkerAlt className="me-1 text-danger" />
                    Full Address *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="fullAddress"
                    placeholder="Enter complete address (street, city, state, zip)"
                    value={formData.fullAddress}
                    onChange={handleChange}
                    required
                  />
                  <Form.Text className="text-muted">
                    Enter the complete address for accurate location mapping
                  </Form.Text>
                </Form.Group>

                <hr className="my-4" />

                <div className="d-flex gap-3">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="px-5"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave className="me-2" />
                        {id ? 'Update' : 'Save'} Property
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate('/properties')}
                    size="lg"
                  >
                    <FaTimes className="me-2" />
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

export default PropertyForm;