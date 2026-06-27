import React, { useState, useEffect } from 'react';
import { 
  Modal, Form, Button, Alert, Spinner, Table, Badge  // Add Badge here
} from 'react-bootstrap';
import { 
  FaDollarSign, FaUser, FaCreditCard, FaCheck, FaSearch, FaTimes 
} from 'react-icons/fa';
import saleService from '../../services/saleService';
import userService from '../../services/userService';
import { useAuth } from '../../context/AuthContext';

const CloseSaleModal = ({ show, onHide, property, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [step, setStep] = useState(1); // 1: select buyer, 2: enter sale details
  const [formData, setFormData] = useState({
    propertyId: property?.id,
    buyerId: '',
    salePrice: property?.price || '',
    paymentMethod: 'BANK_TRANSFER',
    saleDate: new Date().toISOString().slice(0, 16)
  });

  useEffect(() => {
    if (show && property) {
      resetForm();
      fetchUsers();
    }
  }, [show, property]);

  useEffect(() => {
    // Filter users based on search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const filtered = users.filter(user => 
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const resetForm = () => {
    setStep(1);
    setSelectedBuyer(null);
    setSearchTerm('');
    setFormData({
      propertyId: property?.id,
      buyerId: '',
      salePrice: property?.price || '',
      paymentMethod: 'BANK_TRANSFER',
      saleDate: new Date().toISOString().slice(0, 16)
    });
    setError('');
    setSuccess('');
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await userService.getAllUsers();
      // Filter out the property owner and current user
      const filtered = data.filter(u => 
        u.id !== property?.userId && 
        u.email !== property?.ownerEmail &&
        u.email !== user?.email // Also filter out current user
      );
      setUsers(filtered || []);
      setFilteredUsers(filtered || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSelectBuyer = (buyer) => {
    setSelectedBuyer(buyer);
    setFormData({
      ...formData,
      buyerId: buyer.id
    });
    setStep(2);
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
      await saleService.completeSale({
        ...formData,
        salePrice: parseFloat(formData.salePrice)
      });
      
      setSuccess('Sale completed successfully!');
      
      // Call success callback
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
          onHide();
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data || 'Failed to complete sale');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setSelectedBuyer(null);
  };

  const handleClose = () => {
    resetForm();
    onHide();
  };

  // Determine if current user can complete sale (admin or owner)
  const canCompleteSale = () => {
    const isAdmin = user?.role === 'ROLE_ADMIN';
    const isOwner = property?.ownerEmail === user?.email;
    return isAdmin || isOwner;
  };

  // Line 165 is likely where Badge is used - check your file
  // If you're using Badge anywhere, make sure it's imported

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton className="bg-success text-white">
        <Modal.Title>
          <FaCheck className="me-2" />
          {step === 1 ? 'Select Buyer' : 'Complete Sale'} - {property?.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        {step === 1 ? (
          // Step 1: Select Buyer
          <>
            <div className="mb-3">
              <h6>Property Details:</h6>
              <p className="mb-1"><strong>Title:</strong> {property?.title}</p>
              <p className="mb-1"><strong>Price:</strong> ${property?.price?.toLocaleString()}</p>
              <p className="mb-1"><strong>Owner:</strong> {property?.ownerEmail}</p>
              {property?.ownerEmail === user?.email && (
                <Badge bg="info" className="mt-2">You are the owner of this property</Badge>
              )}
            </div>

            <Form.Group className="mb-3">
              <Form.Label>
                <FaSearch className="me-2 text-primary" />
                Search Buyer
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>

            {loadingUsers ? (
              <div className="text-center py-4">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <Alert variant="info">
                No buyers found. {searchTerm ? 'Try a different search term.' : 'Register some users first.'}
              </Alert>
            ) : (
              <div className="buyer-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <Table hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(buyer => (
                      <tr key={buyer.id}>
                        <td>{buyer.name}</td>
                        <td>{buyer.email}</td>
                        <td>
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleSelectBuyer(buyer)}
                          >
                            Select
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </>
        ) : (
          // Step 2: Enter Sale Details
          <>
            <div className="mb-3">
              <h6>Selected Buyer:</h6>
              <div className="bg-light p-3 rounded">
                <p className="mb-1"><strong>Name:</strong> {selectedBuyer?.name}</p>
                <p className="mb-1"><strong>Email:</strong> {selectedBuyer?.email}</p>
              </div>
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaDollarSign className="me-2 text-success" />
                  Sale Price *
                </Form.Label>
                <Form.Control
                  type="number"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                />
                <Form.Text className="text-muted">
                  Original price: ${property?.price?.toLocaleString()}
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  <FaCreditCard className="me-2 text-info" />
                  Payment Method *
                </Form.Label>
                <Form.Select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  required
                >
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="CASH">Cash</option>
                  <option value="CHECK">Check</option>
                  <option value="FINANCING">Financing/Mortgage</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Sale Date</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="saleDate"
                  value={formData.saleDate}
                  onChange={handleChange}
                />
              </Form.Group>

              <Alert variant="warning">
                <FaCheck className="me-2" />
                After completing this sale, the property will be removed from public listings and only visible in transaction history.
              </Alert>

              <div className="d-flex gap-2 justify-content-end">
                <Button variant="secondary" onClick={handleBack}>
                  Back
                </Button>
                <Button 
                  type="submit" 
                  variant="success"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaCheck className="me-2" />
                      Complete Sale
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Add custom styles
const styles = `
  .buyer-list::-webkit-scrollbar {
    width: 8px;
  }
  
  .buyer-list::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  .buyer-list::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  
  .buyer-list::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default CloseSaleModal;