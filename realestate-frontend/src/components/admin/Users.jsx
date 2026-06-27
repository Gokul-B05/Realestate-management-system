import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Table, Badge, Button, Spinner, 
  Alert, Form, InputGroup, Modal 
} from 'react-bootstrap';
import { 
  FaUsers, FaEdit, FaTrash, FaToggleOn, FaToggleOff, 
  FaSearch, FaEye, FaUserShield 
} from 'react-icons/fa';
import adminService from '../../services/adminService';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const filtered = users.filter(user => 
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.role?.toLowerCase().includes(term)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Fetch real users from your backend
      const data = await adminService.getAllUsers();
      setUsers(data || []);
      setFilteredUsers(data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
      setLoading(false);
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    
    setDeleteLoading(true);
    try {
      await adminService.deleteUser(userToDelete.id);
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user');
    } finally {
      setDeleteLoading(false);
    }
  };

  const toggleUserStatus = async (id, currentStatus) => {
    try {
      await adminService.updateUserStatus(id, !currentStatus);
      setUsers(users.map(user => 
        user.id === id ? { ...user, isActive: !currentStatus } : user
      ));
    } catch (err) {
      console.error('Error updating user status:', err);
      alert('Failed to update user status');
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Button onClick={fetchUsers}>Try Again</Button>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2><FaUsers className="me-2" />Manage Users</h2>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={6}>
          <p className="text-muted text-end">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </Col>
      </Row>

      {filteredUsers.length === 0 ? (
        <Alert variant="info">No users found</Alert>
      ) : (
        <Card>
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <Badge bg={user.role === 'ADMIN' ? 'danger' : 'info'}>
                        {user.role === 'ADMIN' ? <FaUserShield className="me-1" /> : null}
                        {user.role}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={user.isActive ? 'success' : 'secondary'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>{user.joined || 'N/A'}</td>
                    <td>
                      <Button 
                        variant="info" 
                        size="sm"
                        className="me-2"
                        onClick={() => handleViewDetails(user)}
                      >
                        <FaEye />
                      </Button>
                      <Button 
                        variant={user.isActive ? 'warning' : 'success'} 
                        size="sm"
                        className="me-2"
                        onClick={() => toggleUserStatus(user.id, user.isActive)}
                      >
                        {user.isActive ? <FaToggleOff /> : <FaToggleOn />}
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDeleteClick(user)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userToDelete && (
            <>
              <p>Are you sure you want to delete this user?</p>
              <p><strong>Name:</strong> {userToDelete.name}</p>
              <p><strong>Email:</strong> {userToDelete.email}</p>
              <p className="text-danger">
                This action cannot be undone. All user data including properties, appointments, and transactions will be permanently deleted.
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
            {deleteLoading ? 'Deleting...' : 'Delete User'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* User Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <p><strong>ID:</strong> {selectedUser.id}</p>
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>Status:</strong> {selectedUser.isActive ? 'Active' : 'Inactive'}</p>
              <p><strong>Joined:</strong> {selectedUser.joined || 'N/A'}</p>
            </>
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

export default AdminUsers;