import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Button, Badge, Carousel, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { 
  FaEdit, FaTrash, FaHome, FaMapMarkerAlt, FaDollarSign, 
  FaImages, FaEye, FaStar, FaPhone,
  FaMapPin, FaCheck, FaBan
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import CloseSaleModal from './CloseSaleModal';

const PropertyCard = ({ property, onDelete, onViewDetails, onViewImages }) => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);

  // Early return if property is null or undefined
  if (!property) {
    return null;
  }

  // Check if current user can modify this property
  const canModify = () => {
    return isAdmin() || property.ownerEmail === user?.email;
  };

  // Check if current user is the owner of this property
  const isOwner = () => {
    return property.ownerEmail === user?.email;
  };

  // Check if property is sold
  const isSold = () => {
    return property.status === 'SOLD' || property.status === 'sold';
  };

  // Truncate description
  const truncateDescription = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Format price
  const formatPrice = (price) => {
    if (!price) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Get property type badge color
  const getTypeBadgeColor = () => {
    if (isSold()) return 'secondary';
    return property.propertyType === 'SALE' ? 'success' : 'info';
  };

  // Get property type text
  const getTypeText = () => {
    if (isSold()) return 'Sold';
    return property.propertyType === 'SALE' ? 'For Sale' : 'For Rent';
  };

  // Safe check for images
  const hasImages = property.images && Array.isArray(property.images) && property.images.length > 0;
  const imageCount = hasImages ? property.images.length : 0;

  // Handle complete sale
  const handleCompleteSale = () => {
    setShowSaleModal(true);
  };

  // Handle sale success
  const handleSaleSuccess = () => {
    // Refresh the page or trigger a refresh
    window.location.reload();
  };

  return (
    <Card className="h-100 shadow-sm hover-shadow transition property-card">
      {/* Sold Badge */}
      {isSold() && (
        <Badge 
          bg="secondary" 
          className="position-absolute top-0 start-0 m-2"
          pill
          style={{ zIndex: 10 }}
        >
          <FaBan className="me-1" /> SOLD
        </Badge>
      )}

      {/* Image Carousel */}
      {hasImages ? (
        <div className="position-relative">
          <Carousel 
            indicators={false} 
            controls={imageCount > 1 && !isSold()} 
            className="property-carousel"
            interval={null}
          >
            {property.images.map((img, index) => (
              <Carousel.Item key={img?.id || index}>
                <div 
                  className="property-image" 
                  style={{ 
                    height: '200px', 
                    backgroundImage: `url(${img?.imageUrl || ''})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer',
                    filter: isSold() ? 'grayscale(100%)' : 'none'
                  }}
                  onClick={() => onViewImages(property)}
                >
                  {img?.isPrimary && !isSold() && (
                    <Badge 
                      bg="warning" 
                      className="position-absolute top-0 end-0 m-2"
                      pill
                    >
                      <FaStar className="me-1" /> Primary
                    </Badge>
                  )}
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
          
          {/* Image count badge */}
          <Badge 
            bg="dark" 
            className="position-absolute bottom-0 end-0 m-2"
            pill
          >
            <FaImages className="me-1" />
            {imageCount} {imageCount === 1 ? 'Photo' : 'Photos'}
          </Badge>
        </div>
      ) : (
        <div 
          className="property-image-placeholder d-flex flex-column align-items-center justify-content-center"
          style={{ 
            height: '200px', 
            backgroundColor: '#f8f9fa',
            cursor: 'pointer',
            filter: isSold() ? 'grayscale(100%)' : 'none'
          }}
          onClick={() => onViewImages(property)}
        >
          <FaHome size={50} className="text-muted mb-2" />
          <span className="text-muted">No images yet</span>
          {canModify() && !isSold() && (
            <Button 
              size="sm" 
              variant="outline-primary" 
              className="mt-2"
              onClick={(e) => {
                e.stopPropagation();
                onViewImages(property);
              }}
            >
              <FaImages className="me-1" /> Add Images
            </Button>
          )}
        </div>
      )}

      <Card.Body className="d-flex flex-column">
        {/* Title and Type */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Click to view details</Tooltip>}
          >
            <Card.Title 
              className="fw-bold h5 mb-0 property-title"
              style={{ cursor: 'pointer' }}
              onClick={() => onViewDetails(property)}
            >
              {property.title || 'Untitled Property'}
              {isSold() && <span className="ms-2 text-secondary">(Sold)</span>}
            </Card.Title>
          </OverlayTrigger>
          <Badge 
            bg={getTypeBadgeColor()}
            className="px-2 py-1"
            pill
          >
            {getTypeText()}
          </Badge>
        </div>

        {/* Price */}
        <div className="d-flex align-items-center mb-2">
          <FaDollarSign className={isSold() ? "text-secondary me-1" : "text-primary me-1"} />
          <span className={`fw-bold h5 mb-0 ${isSold() ? 'text-secondary' : 'text-primary'}`}>
            {formatPrice(property.price)}
          </span>
          <small className="text-muted ms-1">
            {!isSold() && property.propertyType === 'RENT' ? '/month' : ''}
          </small>
        </div>

        {/* Location (City) */}
        {property.location && (
          <div className="d-flex align-items-center text-muted mb-2">
            <FaMapMarkerAlt className="text-danger me-1 flex-shrink-0" />
            <small className="text-truncate">{property.location}</small>
          </div>
        )}

        {/* Full Address */}
        {property.fullAddress && (
          <div className="d-flex align-items-center text-muted mb-2">
            <FaMapPin className="text-info me-1 flex-shrink-0" />
            <small className="text-truncate" title={property.fullAddress}>
              {property.fullAddress}
            </small>
          </div>
        )}

        {/* Contact Number */}
        {property.contactNumber && !isSold() && (
          <div className="d-flex align-items-center text-muted mb-2">
            <FaPhone className="text-success me-1 flex-shrink-0" />
            <small>{property.contactNumber}</small>
          </div>
        )}

        {/* Description */}
        {property.description && (
          <Card.Text className="text-muted small mb-3">
            {showFullDescription 
              ? property.description 
              : truncateDescription(property.description)
            }
            {property.description.length > 100 && (
              <Button 
                variant="link" 
                size="sm" 
                className="p-0 ms-1"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? 'less' : 'more'}
              </Button>
            )}
          </Card.Text>
        )}

        {/* Owner Info */}
        {property.ownerEmail && (
          <div className="mb-3">
            <small className="text-muted">
              Owner: {property.ownerEmail}
              {isOwner() && !isSold() && <span className="ms-2 text-primary">(You)</span>}
            </small>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-auto">
          <hr className="my-2" />
          
          {/* Main Actions */}
          <div className="d-flex flex-wrap gap-2 mb-2">
            <OverlayTrigger placement="top" overlay={<Tooltip>View Details</Tooltip>}>
              <Button
                variant="outline-info"
                size="sm"
                onClick={() => onViewDetails(property)}
                className="flex-fill"
              >
                <FaEye /> Details
              </Button>
            </OverlayTrigger>

            <OverlayTrigger placement="top" overlay={<Tooltip>View Images</Tooltip>}>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => onViewImages(property)}
                className="flex-fill"
              >
                <FaImages /> Images
              </Button>
            </OverlayTrigger>

            {/* Complete Sale Button - for Admin OR Owner, only for unsold properties */}
            {(isAdmin() || isOwner()) && !isSold() && (
              <OverlayTrigger placement="top" overlay={<Tooltip>Complete Sale</Tooltip>}>
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={handleCompleteSale}
                  className="flex-fill"
                >
                  <FaCheck /> Complete Sale
                </Button>
              </OverlayTrigger>
            )}
          </div>

          {/* Owner/Admin Actions - hide if sold */}
          {canModify() && !isSold() && (
            <div className="d-flex gap-2">
              <OverlayTrigger placement="top" overlay={<Tooltip>Edit Property</Tooltip>}>
                <Button
                  as={Link}
                  to={`/properties/edit/${property.id}`}
                  variant="warning"
                  size="sm"
                  className="flex-fill"
                >
                  <FaEdit className="me-1" /> Edit
                </Button>
              </OverlayTrigger>

              <OverlayTrigger placement="top" overlay={<Tooltip>Delete Property</Tooltip>}>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(property.id)}
                  className="flex-fill"
                >
                  <FaTrash className="me-1" /> Delete
                </Button>
              </OverlayTrigger>
            </div>
          )}
        </div>
      </Card.Body>

      {/* Close Sale Modal */}
      <CloseSaleModal
        show={showSaleModal}
        onHide={() => setShowSaleModal(false)}
        property={property}
        onSuccess={handleSaleSuccess}
      />
    </Card>
  );
};

// Add custom styles
const styles = `
  .property-card {
    transition: transform 0.2s, box-shadow 0.2s;
    border: none;
    border-radius: 10px;
    overflow: hidden;
  }
  
  .property-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
  }
  
  .property-title {
    color: #333;
    transition: color 0.2s;
  }
  
  .property-title:hover {
    color: #007bff;
  }
  
  .property-carousel .carousel-control-prev,
  .property-carousel .carousel-control-next {
    width: 10%;
    background: rgba(0,0,0,0.2);
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  .property-card:hover .property-carousel .carousel-control-prev,
  .property-card:hover .property-carousel .carousel-control-next {
    opacity: 1;
  }
  
  .property-carousel .carousel-control-prev:hover,
  .property-carousel .carousel-control-next:hover {
    background: rgba(0,0,0,0.4);
  }
  
  .property-image {
    transition: transform 0.3s;
  }
  
  .property-image:hover {
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    .property-carousel .carousel-control-prev,
    .property-carousel .carousel-control-next {
      opacity: 0.5;
    }
  }
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default PropertyCard;