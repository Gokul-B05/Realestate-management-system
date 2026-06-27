import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import propertyImageService from '../../services/propertyImageService';

const ImageUpload = ({ show, onHide, propertyId, onSuccess }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      setError('Please enter an image URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await propertyImageService.addImage(propertyId, {
        imageUrl: imageUrl.trim(),
        isPrimary: isPrimary
      });
      
      // Reset form
      setImageUrl('');
      setIsPrimary(false);
      
      // Call success callback
      if (onSuccess) onSuccess();
      
      // Close modal
      onHide();
      
    } catch (err) {
      setError('Failed to add image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Image</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
            />
            <Form.Text className="text-muted">
              Enter a valid image URL (must end with .jpg, .png, etc.)
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
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
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
  );
};

export default ImageUpload;