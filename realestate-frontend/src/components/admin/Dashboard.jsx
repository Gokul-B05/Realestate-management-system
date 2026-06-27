import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Table, Badge, Button } from 'react-bootstrap';
import { 
  FaUsers, FaHome, FaCalendarCheck, FaShoppingCart, 
  FaDollarSign, FaChartLine, FaBuilding, FaMoneyBillWave
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalAppointments: 0,
    totalTransactions: 0,
    totalSales: 0,
    totalRevenue: 0,
    recentUsers: [],
    recentProperties: [],
    recentSales: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      console.log('Fetching dashboard data...');
      
      // Fetch users with error handling
      const users = await adminService.getAllUsers().catch(err => {
        console.error('Error fetching users:', err);
        return [];
      });
      
      // Fetch properties with error handling
      const properties = await adminService.getAllProperties().catch(err => {
        console.error('Error fetching properties:', err);
        return [];
      });
      
      // Fetch sales with error handling
      const sales = await adminService.getAllSales().catch(err => {
        console.error('Error fetching sales:', err);
        return [];
      });
      
      // Fetch appointments with error handling
      const appointments = await adminService.getAllAppointments().catch(err => {
        console.error('Error fetching appointments:', err);
        return [];
      });
      
      // 🚫 Transactions temporarily disabled due to backend 400 error
      // const transactions = await adminService.getAllTransactions().catch(() => []);
      
      console.log('Dashboard data received:', {
        users: users.length,
        properties: properties.length,
        sales: sales.length,
        appointments: appointments.length
      });
      
      // Calculate total revenue from sales
      const totalRevenue = sales.reduce((sum, sale) => sum + (sale.salePrice || 0), 0);
      
      setStats({
        totalUsers: users.length || 0,
        totalProperties: properties.length || 0,
        totalAppointments: appointments.length || 0,
        totalTransactions: 0, // Temporarily set to 0
        totalSales: sales.length || 0,
        totalRevenue: totalRevenue,
        recentUsers: users.slice(0, 5) || [],
        recentProperties: properties.slice(0, 5) || [],
        recentSales: sales.slice(0, 5) || []
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getStatusBadge = (status) => {
    const colors = {
      'AVAILABLE': 'success',
      'SOLD': 'secondary',
      'RENTED': 'info',
      'PENDING': 'warning'
    };
    return <Badge bg={colors[status] || 'secondary'}>{status}</Badge>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3">Loading dashboard...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Button onClick={fetchDashboardData} variant="primary">Try Again</Button>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Welcome Header */}
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">
            <FaChartLine className="me-2 text-primary" />
            Admin Dashboard
          </h2>
          <p className="text-muted">
            Welcome back, {user?.name || 'Admin'}! Here's what's happening with your platform.
          </p>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={4} lg={2}>
          <Card className="shadow-sm bg-primary text-white">
            <Card.Body>
              <FaUsers size={30} className="mb-2" />
              <h3>{stats.totalUsers}</h3>
              <small>Total Users</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} lg={2}>
          <Card className="shadow-sm bg-success text-white">
            <Card.Body>
              <FaHome size={30} className="mb-2" />
              <h3>{stats.totalProperties}</h3>
              <small>Properties</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} lg={2}>
          <Card className="shadow-sm bg-info text-white">
            <Card.Body>
              <FaCalendarCheck size={30} className="mb-2" />
              <h3>{stats.totalAppointments}</h3>
              <small>Appointments</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} lg={2}>
          <Card className="shadow-sm bg-warning text-white">
            <Card.Body>
              <FaShoppingCart size={30} className="mb-2" />
              <h3>{stats.totalTransactions}</h3>
              <small>Transactions</small>
              <div><small className="text-white-50">(Temporarily Disabled)</small></div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} lg={2}>
          <Card className="shadow-sm bg-danger text-white">
            <Card.Body>
              <FaMoneyBillWave size={30} className="mb-2" />
              <h3>{stats.totalSales}</h3>
              <small>Sales</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} lg={2}>
          <Card className="shadow-sm bg-secondary text-white">
            <Card.Body>
              <FaDollarSign size={30} className="mb-2" />
              <h3>{formatPrice(stats.totalRevenue)}</h3>
              <small>Revenue</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Users */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0"><FaUsers className="me-2 text-primary" />Recent Users</h5>
              <Link to="/admin/users" className="btn btn-sm btn-outline-primary">View All</Link>
            </Card.Header>
            <Card.Body>
              {stats.recentUsers.length === 0 ? (
                <p className="text-muted text-center">No recent users</p>
              ) : (
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentUsers.map(user => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{formatDate(user.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Properties */}
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0"><FaHome className="me-2 text-success" />Recent Properties</h5>
              <Link to="/admin/properties" className="btn btn-sm btn-outline-primary">View All</Link>
            </Card.Header>
            <Card.Body>
              {stats.recentProperties.length === 0 ? (
                <p className="text-muted text-center">No recent properties</p>
              ) : (
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Price</th>
                      <th>Location</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentProperties.map(property => (
                      <tr key={property.id}>
                        <td>{property.title}</td>
                        <td>{property.propertyType === 'RENT' ? `${formatPrice(property.price)}/mo` : formatPrice(property.price)}</td>
                        <td>{property.location}</td>
                        <td>{getStatusBadge(property.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Sales */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0"><FaMoneyBillWave className="me-2 text-success" />Recent Sales</h5>
              <Link to="/admin/sales" className="btn btn-sm btn-outline-primary">View All</Link>
            </Card.Header>
            <Card.Body>
              {stats.recentSales.length === 0 ? (
                <p className="text-muted text-center">No recent sales</p>
              ) : (
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Price</th>
                      <th>Buyer</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentSales.map(sale => (
                      <tr key={sale.id}>
                        <td>{sale.propertyTitle}</td>
                        <td>{formatPrice(sale.salePrice)}</td>
                        <td>{sale.buyerName}</td>
                        <td>{formatDate(sale.saleDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mt-4">
        <Col>
          <Card className="shadow-sm bg-light">
            <Card.Body>
              <h5 className="mb-3">Quick Actions</h5>
              <div className="d-flex gap-2 flex-wrap">
                <Link to="/admin/users" className="btn btn-outline-primary">
                  <FaUsers className="me-2" />Manage Users
                </Link>
                <Link to="/admin/properties" className="btn btn-outline-success">
                  <FaHome className="me-2" />Manage Properties
                </Link>
                <Link to="/admin/appointments" className="btn btn-outline-info">
                  <FaCalendarCheck className="me-2" />Manage Appointments
                </Link>
                <Link to="/admin/transactions" className="btn btn-outline-warning">
                  <FaShoppingCart className="me-2" />Manage Transactions
                </Link>
                <Link to="/admin/sales" className="btn btn-outline-danger">
                  <FaMoneyBillWave className="me-2" />Manage Sales
                </Link>
                <Link to="/admin/reports" className="btn btn-outline-secondary">
                  <FaChartLine className="me-2" />View Reports
                </Link>
              </div>
              <div className="mt-3">
                <Alert variant="info" className="mb-0 py-2">
                  <small>
                    <strong>Note:</strong> Transactions are temporarily disabled while we fix the backend API. 
                    Other features are working normally.
                  </small>
                </Alert>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;