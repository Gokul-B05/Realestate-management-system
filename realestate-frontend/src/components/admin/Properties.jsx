import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Table, Badge, Button, Spinner, Alert, 
  Form, InputGroup, Modal 
} from 'react-bootstrap';
import { 
  FaHome, FaEdit, FaTrash, FaCheck, FaBan, FaSearch, 
  FaFilter, FaEye, FaTimes, FaPlus, FaDollarSign, FaMapMarkerAlt
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import propertyService from '../../services/propertyService';
import { useAuth } from '../../context/AuthContext';

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [properties, searchTerm, filterType, filterStatus]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      console.log('Fetching all properties for admin...');
      
      // Fetch real data from your backend
      const data = await propertyService.getAllProperties();
      
      setProperties(data || []);
      setFilteredProperties(data || []);
      setLoading(false);
      
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties');
      setLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = [...properties];
    
    // Filter by type (SALE/RENT)
    if (filterType !== 'ALL') {
      filtered = filtered.filter(p => p.propertyType === filterType);
    }
    
    // Filter by status
    if (filterStatus !== 'ALL') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.title?.toLowerCase().includes(term) || 
        p.location?.toLowerCase().includes(term) ||
        p.fullAddress?.toLowerCase().includes(term) ||
        p.ownerEmail?.toLowerCase().includes(term) ||
        p.ownerName?.toLowerCase().includes(term)
      );
    }
    
    setFilteredProperties(filtered);
  };

  const handleViewDetails = (property) => {
    setSelectedProperty(property);
    setShowDetailsModal(true);
  };

  const handleDeleteClick = (property) => {
    setPropertyToDelete(property);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!propertyToDelete) return;
    
    setDeleteLoading(true);
    try {
      // Call API to delete property
      await propertyService.deleteProperty(propertyToDelete.id);
      
      // Update local state
      setProperties(properties.filter(p => p.id !== propertyToDelete.id));
      setShowDeleteModal(false);
      setPropertyToDelete(null);
      setDeleteLoading(false);
      
    } catch (err) {
      console.error('Error deleting property:', err);
      alert('Failed to delete property');
      setDeleteLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      // In a real app, you might have an admin API for this
      // For now, we'll use the regular property service
      const property = properties.find(p => p.id === id);
      if (property) {
        const updatedProperty = { ...property, status: newStatus };
        await propertyService.updateProperty(id, updatedProperty);
        
        // Update local state
        setProperties(properties.map(p => 
          p.id === id ? { ...p, status: newStatus } : p
        ));
      }
      
    } catch (err) {
      console.error('Error updating property status:', err);
      alert('Failed to update property status');
    }
  };

  const formatPrice = (price, type) => {
    if (!price) return '$0';
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
    return type === 'RENT' ? `${formatted}/mo` : formatted;
  };

  const getStatusBadge = (status) => {
    const colors = {
      'AVAILABLE': 'success',
      'SOLD': 'secondary',
      'RENTED': 'info',
      'PENDING': 'warning'
    };
    return <Badge bg={colors[status] || 'secondary'} pill>{status || 'AVAILABLE'}</Badge>;
  };

  const getTypeBadge = (type) => {
    return <Badge bg={type === 'SALE' ? 'primary' : 'info'} pill>{type || 'SALE'}</Badge>;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('ALL');
    setFilterStatus('ALL');
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3">Loading properties...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Button onClick={fetchProperties}>Try Again</Button>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4 align-items-center">
        <Col md={6}>
          <h2 className="fw-bold mb-0">
            <FaHome className="me-2 text-primary" />
            Manage Properties
          </h2>
          <p className="text-muted mt-2 mb-0">
            View and manage all property listings
          </p>
        </Col>
        <Col md={6} className="text-end">
          <Button as={Link} to="/properties/new" variant="success">
            <FaPlus className="me-2" />
            Add New Property
          </Button>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by title, location, owner..."
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
        <Col md={3}>
          <InputGroup>
            <InputGroup.Text>
              <FaFilter />
            </InputGroup.Text>
            <Form.Select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="ALL">All Types</option>
              <option value="SALE">For Sale</option>
              <option value="RENT">For Rent</option>
            </Form.Select>
          </InputGroup>
        </Col>
        <Col md={3}>
          <InputGroup>
            <InputGroup.Text>
              <FaFilter />
            </InputGroup.Text>
            <Form.Select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="AVAILABLE">Available</option>
              <option value="SOLD">Sold</option>
              <option value="RENTED">Rented</option>
              <option value="PENDING">Pending</option>
            </Form.Select>
          </InputGroup>
        </Col>
        <Col md={2}>
          <Button variant="outline-secondary" onClick={clearFilters} className="w-100">
            Clear Filters
          </Button>
        </Col>
      </Row>

      {/* Summary */}
      <Row className="mb-3">
        <Col>
          <p className="text-muted">
            Showing <strong>{filteredProperties.length}</strong> of <strong>{properties.length}</strong> properties
          </p>
        </Col>
      </Row>

      {/* Properties Table */}
      {filteredProperties.length === 0 ? (
        <Alert variant="info">
          No properties found matching your criteria.
        </Alert>
      ) : (
        <Card className="shadow-sm">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Location</th>
                    <th>Owner</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProperties.map(property => (
                    <tr key={property.id}>
                      <td>#{property.id}</td>
                      <td>
                        <strong>{property.title}</strong>
                        {property.description && (
                          <div>
                            <small className="text-muted">{property.description.substring(0, 30)}...</small>
                          </div>
                        )}
                      </td>
                      <td>
                        <FaDollarSign className="text-success me-1" />
                        {formatPrice(property.price, property.propertyType)}
                      </td>
                      <td>
                        <FaMapMarkerAlt className="text-danger me-1" />
                        {property.location}
                      </td>
                      <td>
                        <div>{property.ownerName || 'N/A'}</div>
                        <small className="text-muted">{property.ownerEmail}</small>
                      </td>
                      <td>{getTypeBadge(property.propertyType)}</td>
                      <td>{getStatusBadge(property.status)}</td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          className="me-2"
                          onClick={() => handleViewDetails(property)}
                          title="View Details"
                        >
                          <FaEye />
                        </Button>
                        <Button
                          as={Link}
                          to={`/properties/edit/${property.id}`}
                          variant="warning"
                          size="sm"
                          className="me-2"
                          title="Edit Property"
                        >
                          <FaEdit />
                        </Button>
                        {property.status === 'AVAILABLE' && (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              className="me-2"
                              onClick={() => handleUpdateStatus(property.id, 'SOLD')}
                              title="Mark as Sold"
                            >
                              <FaCheck />
                            </Button>
                            <Button
                              variant="info"
                              size="sm"
                              className="me-2"
                              onClick={() => handleUpdateStatus(property.id, 'RENTED')}
                              title="Mark as Rented"
                            >
                              <FaHome />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteClick(property)}
                          title="Delete Property"
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
          <Card.Footer className="bg-white">
            <small className="text-muted">
              Total: {properties.length} properties | 
              Available: {properties.filter(p => p.status === 'AVAILABLE').length} |
              Sold: {properties.filter(p => p.status === 'SOLD').length} |
              Rented: {properties.filter(p => p.status === 'RENTED').length}
            </small>
          </Card.Footer>
        </Card>
      )}

      {/* Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <FaHome className="me-2" />
            Property Details - {selectedProperty?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProperty && (
            <Row>
              <Col md={6}>
                <h6 className="border-bottom pb-2">Basic Information</h6>
                <p><strong>ID:</strong> #{selectedProperty.id}</p>
                <p><strong>Title:</strong> {selectedProperty.title}</p>
                <p><strong>Description:</strong> {selectedProperty.description || 'N/A'}</p>
                <p><strong>Price:</strong> {formatPrice(selectedProperty.price, selectedProperty.propertyType)}</p>
                <p><strong>Location:</strong> {selectedProperty.location}</p>
                <p><strong>Full Address:</strong> {selectedProperty.fullAddress || 'N/A'}</p>
                <p><strong>Contact:</strong> {selectedProperty.contactNumber || 'N/A'}</p>
              </Col>
              <Col md={6}>
                <h6 className="border-bottom pb-2">Owner Information</h6>
                <p><strong>Name:</strong> {selectedProperty.ownerName || 'N/A'}</p>
                <p><strong>Email:</strong> {selectedProperty.ownerEmail}</p>
                
                <h6 className="border-bottom pb-2 mt-3">Status</h6>
                <p><strong>Type:</strong> {getTypeBadge(selectedProperty.propertyType)}</p>
                <p><strong>Status:</strong> {getStatusBadge(selectedProperty.status)}</p>
                <p><strong>Listed:</strong> {selectedProperty.createdAt ? new Date(selectedProperty.createdAt).toLocaleDateString() : 'N/A'}</p>
                
                <h6 className="border-bottom pb-2 mt-3">Images</h6>
                <p><strong>Total Images:</strong> {selectedProperty.images?.length || 0}</p>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
          <Button 
            variant="warning" 
            as={Link} 
            to={`/properties/edit/${selectedProperty?.id}`}
            onClick={() => setShowDetailsModal(false)}
          >
            <FaEdit className="me-2" /> Edit Property
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>
            <FaTrash className="me-2" />
            Confirm Delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {propertyToDelete && (
            <>
              <p>Are you sure you want to delete this property?</p>
              <p><strong>Title:</strong> {propertyToDelete.title}</p>
              <p><strong>Owner:</strong> {propertyToDelete.ownerName || propertyToDelete.ownerEmail}</p>
              <p className="text-danger mb-0">
                <strong>Warning:</strong> This action cannot be undone. All associated data including images and appointments will be permanently deleted.
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteConfirm}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              <>
                <FaTrash className="me-2" />
                Delete Property
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminProperties;