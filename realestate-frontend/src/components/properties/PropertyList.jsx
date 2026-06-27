import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Container, Row, Col, Button, Spinner, Alert, Form, InputGroup,
  Modal, ListGroup, Carousel, Card, Badge
} from 'react-bootstrap';
import { 
  FaPlus, FaHome, FaSearch, FaCalendarCheck, FaImages,
  FaDollarSign, FaMapMarkerAlt, FaUser, FaClock, FaTimes,
  FaPhone, FaMapPin, FaEye, FaEdit, FaTrash, FaCheck, FaBan
} from 'react-icons/fa';
import propertyService from '../../services/propertyService';
import propertyImageService from '../../services/propertyImageService';
import { useAuth } from '../../context/AuthContext';
import PropertyCard from './PropertyCard';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [propertyImages, setPropertyImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [showAddImageModal, setShowAddImageModal] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [addingImage, setAddingImage] = useState(false);
  const [showSold, setShowSold] = useState(false);
  
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [properties, searchTerm, filterType, showSold]);

  const fetchProperties = async () => {
    try {
      console.log('Fetching properties...');
      const data = await propertyService.getAllProperties();
      console.log('Properties received:', data);
      
      // Ensure each property has all required fields with defaults
      const propertiesWithDefaults = (data || []).map(prop => ({
        id: prop.id,
        title: prop.title || 'Untitled Property',
        description: prop.description || 'No description available',
        price: prop.price || 0,
        location: prop.location || 'Location not specified',
        fullAddress: prop.fullAddress || 'Address not specified',
        contactNumber: prop.contactNumber || 'Contact not provided',
        propertyType: prop.propertyType || 'SALE',
        status: prop.status || 'AVAILABLE',
        ownerEmail: prop.ownerEmail || 'unknown@email.com',
        userId: prop.userId || null,
        images: prop.images || [],
        createdAt: prop.createdAt || new Date().toISOString()
      }));
      
      console.log('Processed properties:', propertiesWithDefaults);
      setProperties(propertiesWithDefaults);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load properties. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = () => {
    // First filter based on showSold toggle
    let filtered = showSold 
      ? properties // Show all properties including sold
      : properties.filter(p => p.status !== 'SOLD' && p.status !== 'sold'); // Hide sold properties
    
    // Apply type filter
    if (filterType !== 'ALL') {
      filtered = filtered.filter(p => p.propertyType === filterType);
    }
    
    // Apply search term filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.title?.toLowerCase().includes(term) || 
        p.location?.toLowerCase().includes(term) ||
        p.fullAddress?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term)
      );
    }
    
    setFilteredProperties(filtered);
    
    // Log counts for debugging
    const soldCount = properties.filter(p => p.status === 'SOLD' || p.status === 'sold').length;
    console.log(`Total: ${properties.length}, Available: ${properties.length - soldCount}, Sold: ${soldCount}, Showing: ${filtered.length}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      await propertyService.deleteProperty(id);
      setProperties(properties.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete property');
    }
  };

  const handleViewDetails = (property) => {
    setSelectedProperty(property);
    setShowDetailsModal(true);
  };

  const handleViewImages = async (property) => {
    try {
      setSelectedProperty(property);
      setImagesLoading(true);
      setShowImagesModal(true);
      
      console.log(`Fetching images for property ID: ${property.id}`);
      const images = await propertyImageService.getPropertyImages(property.id);
      console.log('Images response:', images);
      
      setPropertyImages(images || []);
    } catch (err) {
      console.error('Error loading images:', err);
      setPropertyImages([]);
    } finally {
      setImagesLoading(false);
    }
  };

  const handleAddImage = async () => {
    if (!newImageUrl.trim()) {
      alert('Please enter an image URL');
      return;
    }

    setAddingImage(true);
    try {
      await propertyImageService.addImage(selectedProperty.id, {
        imageUrl: newImageUrl.trim(),
        isPrimary: isPrimary
      });
      
      // Refresh images
      const updatedImages = await propertyImageService.getPropertyImages(selectedProperty.id);
      setPropertyImages(updatedImages || []);
      
      // Reset form
      setNewImageUrl('');
      setIsPrimary(false);
      setShowAddImageModal(false);
      
    } catch (err) {
      console.error('Error adding image:', err);
      alert('Failed to add image. Please try again.');
    } finally {
      setAddingImage(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    
    try {
      await propertyImageService.deleteImage(imageId);
      const updatedImages = await propertyImageService.getPropertyImages(selectedProperty.id);
      setPropertyImages(updatedImages || []);
    } catch (err) {
      console.error('Error deleting image:', err);
      alert('Failed to delete image');
    }
  };

  const handleSetPrimaryImage = async (imageId) => {
    try {
      await propertyImageService.setPrimaryImage(imageId);
      const updatedImages = await propertyImageService.getPropertyImages(selectedProperty.id);
      setPropertyImages(updatedImages || []);
    } catch (err) {
      console.error('Error setting primary image:', err);
      alert('Failed to set primary image');
    }
  };

  const handleScheduleVisit = (propertyId) => {
    navigate(`/appointments/new/${propertyId}`);
  };

  const canModify = (property) => {
    if (!property) return false;
    if (isAdmin()) return true;
    return user?.email && property.ownerEmail === user.email;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('ALL');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return 'N/A';
    }
  };

  const soldCount = properties.filter(p => p.status === 'SOLD' || p.status === 'sold').length;
  const availableCount = properties.length - soldCount;

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
        <Alert variant="danger" className="text-center">
          <Alert.Heading>Error Loading Properties</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="d-flex justify-content-center gap-2">
            <Button onClick={fetchProperties} variant="primary">
              Try Again
            </Button>
            <Button as={Link} to="/login" variant="secondary">
              Back to Login
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Header Section */}
      <Row className="mb-4 align-items-center">
        <Col lg={4}>
          <h1 className="display-5 fw-bold">
            <FaHome className="me-2 text-primary" />
            Properties
          </h1>
          <p className="text-muted">Discover your perfect property</p>
        </Col>
        
        {/* Search and Filter */}
        <Col lg={5}>
          <InputGroup className="mb-2">
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by title, location, or description..."
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
        
        <Col lg={3}>
          <div className="d-flex gap-2">
            <Form.Select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="flex-grow-1"
            >
              <option value="ALL">All Types</option>
              <option value="SALE">For Sale</option>
              <option value="RENT">For Rent</option>
            </Form.Select>
            
            <Button 
              as={Link} 
              to="/properties/new" 
              variant="primary"
              title="Add New Property"
            >
              <FaPlus />
            </Button>
          </div>
        </Col>
      </Row>

      {/* Filter Controls Row */}
      <Row className="mb-3 align-items-center">
        <Col md={6}>
          <p className="text-muted mb-0">
            Showing <strong>{filteredProperties.length}</strong> properties
            {!showSold && soldCount > 0 && (
              <span className="ms-2">
                ({soldCount} sold properties hidden)
              </span>
            )}
            {(searchTerm || filterType !== 'ALL') && (
              <Button 
                variant="link" 
                size="sm" 
                onClick={clearFilters}
                className="ms-2"
              >
                Clear Filters
              </Button>
            )}
          </p>
        </Col>
        <Col md={6} className="text-end">
          {isAdmin() && (
            <Form.Check
              type="switch"
              id="show-sold-switch"
              label="Show Sold Properties"
              checked={showSold}
              onChange={(e) => setShowSold(e.target.checked)}
              inline
            />
          )}
        </Col>
      </Row>

      {/* Properties Grid */}
      {filteredProperties.length === 0 ? (
        <Alert variant="info" className="text-center">
          {properties.length === 0 ? (
            <>
              <h5>No Properties Found</h5>
              <p>Be the first to add a property!</p>
              <Button as={Link} to="/properties/new" variant="primary">
                <FaPlus className="me-2" />
                Add Property
              </Button>
            </>
          ) : (
            <>
              <h5>No Matching Properties</h5>
              <p>
                {showSold 
                  ? 'No properties match your search criteria.' 
                  : 'No available properties match your search criteria.'}
              </p>
              <Button variant="outline-primary" onClick={clearFilters}>
                Clear Filters
              </Button>
            </>
          )}
        </Alert>
      ) : (
        <Row xs={1} sm={2} md={2} lg={3} xl={4} className="g-4">
          {filteredProperties.map((property) => (
            <Col key={property.id}>
              <PropertyCard
                property={property}
                onDelete={handleDelete}
                onViewDetails={handleViewDetails}
                onViewImages={handleViewImages}
                onScheduleVisit={handleScheduleVisit}
                canModify={canModify(property)}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* Details Modal */}
      <Modal 
        show={showDetailsModal} 
        onHide={() => setShowDetailsModal(false)} 
        size="lg"
        centered
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <FaHome className="me-2" />
            {selectedProperty?.title}
            {selectedProperty?.status === 'SOLD' && (
              <Badge bg="secondary" className="ms-2">SOLD</Badge>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProperty && (
            <Row>
              <Col md={7}>
                <h5 className="border-bottom pb-2">Description</h5>
                <p>{selectedProperty.description || 'No description provided.'}</p>
                
                <h5 className="border-bottom pb-2 mt-4">Property Details</h5>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between">
                    <strong>Price:</strong>
                    <span className={selectedProperty.status === 'SOLD' ? 'text-secondary' : 'text-primary fw-bold'}>
                      ${selectedProperty.price?.toLocaleString()}
                      {selectedProperty.propertyType === 'RENT' && '/month'}
                    </span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <strong><FaMapMarkerAlt className="me-1 text-danger" /> City:</strong>
                    <span>{selectedProperty.location || 'N/A'}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <strong><FaMapPin className="me-1 text-info" /> Full Address:</strong>
                    <span>{selectedProperty.fullAddress || 'N/A'}</span>
                  </ListGroup.Item>
                  {selectedProperty.status !== 'SOLD' && (
                    <ListGroup.Item className="d-flex justify-content-between">
                      <strong><FaPhone className="me-1 text-success" /> Contact:</strong>
                      <span>{selectedProperty.contactNumber || 'N/A'}</span>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item className="d-flex justify-content-between">
                    <strong>Type:</strong>
                    <Badge bg={selectedProperty.propertyType === 'SALE' ? 'success' : 'info'}>
                      {selectedProperty.propertyType === 'SALE' ? 'For Sale' : 'For Rent'}
                    </Badge>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <strong>Status:</strong>
                    <Badge bg={selectedProperty.status === 'SOLD' ? 'secondary' : 'success'}>
                      {selectedProperty.status || 'AVAILABLE'}
                    </Badge>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <strong>Owner:</strong>
                    <span>{selectedProperty.ownerEmail || 'N/A'}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <strong>Listed on:</strong>
                    <span>{formatDate(selectedProperty.createdAt)}</span>
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={5}>
                <h5 className="border-bottom pb-2">Images</h5>
                {selectedProperty.images && selectedProperty.images.length > 0 ? (
                  <Carousel className="property-detail-carousel">
                    {selectedProperty.images.map((img, index) => (
                      <Carousel.Item key={img.id || index}>
                        <img
                          className="d-block w-100"
                          src={img.imageUrl}
                          alt={`Property ${index + 1}`}
                          style={{ 
                            height: '250px', 
                            objectFit: 'cover', 
                            borderRadius: '8px',
                            filter: selectedProperty.status === 'SOLD' ? 'grayscale(100%)' : 'none'
                          }}
                        />
                        {img.isPrimary && (
                          <Badge bg="warning" className="position-absolute top-0 end-0 m-2">
                            Primary
                          </Badge>
                        )}
                      </Carousel.Item>
                    ))}
                  </Carousel>
                ) : (
                  <div className="text-center p-4 bg-light rounded">
                    <FaImages size={40} className="text-muted mb-2" />
                    <p className="text-muted mb-0">No images available</p>
                  </div>
                )}
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
          {selectedProperty && selectedProperty.status !== 'SOLD' && selectedProperty.ownerEmail !== user?.email && (
            <Button 
              variant="success" 
              onClick={() => {
                setShowDetailsModal(false);
                handleScheduleVisit(selectedProperty?.id);
              }}
            >
              <FaCalendarCheck className="me-2" />
              Schedule Visit
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Images Modal */}
      <Modal 
        show={showImagesModal} 
        onHide={() => setShowImagesModal(false)} 
        size="lg"
        centered
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <FaImages className="me-2" />
            {selectedProperty?.title || 'Property'} - Images
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {imagesLoading ? (
            <div className="text-center p-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading images...</p>
            </div>
          ) : propertyImages.length === 0 ? (
            <Alert variant="info" className="text-center">
              <FaImages size={40} className="mb-3 text-muted" />
              <h5>No Images Found</h5>
              <p className="mb-0">This property doesn't have any images yet.</p>
              {selectedProperty && canModify(selectedProperty) && selectedProperty.status !== 'SOLD' && (
                <Button 
                  variant="primary" 
                  className="mt-3"
                  onClick={() => setShowAddImageModal(true)}
                >
                  <FaPlus className="me-2" />
                  Add First Image
                </Button>
              )}
            </Alert>
          ) : (
            <>
              <Row xs={1} sm={2} md={3} className="g-3">
                {propertyImages.map((image, index) => (
                  <Col key={image.id || index}>
                    <Card className="h-100 shadow-sm">
                      <div className="position-relative">
                        <Card.Img 
                          variant="top" 
                          src={image.imageUrl} 
                          style={{ height: '150px', objectFit: 'cover' }}
                        />
                        {selectedProperty && canModify(selectedProperty) && selectedProperty.status !== 'SOLD' && (
                          <div className="position-absolute top-0 end-0 m-1">
                            <Button
                              size="sm"
                              variant="danger"
                              className="me-1"
                              onClick={() => handleDeleteImage(image.id)}
                              title="Delete image"
                            >
                              <FaTimes size={12} />
                            </Button>
                          </div>
                        )}
                      </div>
                      <Card.Body className="p-2">
                        <div className="d-flex justify-content-between align-items-center">
                          {image.isPrimary ? (
                            <Badge bg="warning" pill>Primary</Badge>
                          ) : (
                            selectedProperty && canModify(selectedProperty) && selectedProperty.status !== 'SOLD' && (
                              <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() => handleSetPrimaryImage(image.id)}
                                title="Set as primary image"
                              >
                                Make Primary
                              </Button>
                            )
                          )}
                          <small className="text-muted">
                            {image.uploadDate ? formatDate(image.uploadDate) : 'N/A'}
                          </small>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              
              {selectedProperty && canModify(selectedProperty) && selectedProperty.status !== 'SOLD' && (
                <div className="text-center mt-4">
                  <Button 
                    variant="primary"
                    onClick={() => setShowAddImageModal(true)}
                  >
                    <FaPlus className="me-2" />
                    Add More Images
                  </Button>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImagesModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Image Modal */}
      <Modal show={showAddImageModal} onHide={() => setShowAddImageModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Image to {selectedProperty?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="url"
                placeholder="https://example.com/image.jpg"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
              />
              <Form.Text className="text-muted">
                Enter a valid image URL (jpg, png, gif, etc.)
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Set as primary image"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddImageModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAddImage}
            disabled={addingImage || !newImageUrl.trim()}
          >
            {addingImage ? (
              <>
                <Spinner size="sm" className="me-2" />
                Adding...
              </>
            ) : (
              'Add Image'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PropertyList;