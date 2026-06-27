import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaHome, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';
import propertyService from '../../services/propertyService';
import { useAuth } from '../../context/AuthContext';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const fetchMyProperties = async () => {
    try {
      const allProperties = await propertyService.getAllProperties();
      const myProps = allProperties.filter(p => p.ownerEmail === user?.email);
      setProperties(myProps);
    } catch (err) {
      setError('Failed to load your properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property?')) return;
    try {
      await propertyService.deleteProperty(id);
      setProperties(properties.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete property');
    }
  };

  if (loading) return <Container className="text-center py-5"><Spinner animation="border" /></Container>;

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2><FaHome className="me-2" />My Properties</h2>
        </Col>
        <Col xs="auto">
          <Button as={Link} to="/properties/new" variant="primary">
            <FaPlus className="me-2" />Add New
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}
      
      {properties.length === 0 ? (
        <Alert variant="info">You haven't listed any properties yet.</Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {properties.map(property => (
            <Col key={property.id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <Card.Title>{property.title}</Card.Title>
                    <Badge bg={property.propertyType === 'SALE' ? 'success' : 'info'}>
                      {property.propertyType}
                    </Badge>
                  </div>
                  <Card.Text className="text-muted">
                    {property.description.substring(0, 100)}...
                  </Card.Text>
                  <p><FaDollarSign className="text-success" /> {property.price}</p>
                  <p><FaMapMarkerAlt className="text-danger" /> {property.location}</p>
                  <div className="d-flex gap-2">
                    <Button as={Link} to={`/properties/edit/${property.id}`} size="sm" variant="warning">
                      <FaEdit /> Edit
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(property.id)}>
                      <FaTrash /> Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyProperties;