import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Table, Badge, Spinner, Alert, 
  Tabs, Tab, Button, Form, InputGroup 
} from 'react-bootstrap';
import { 
  FaShoppingCart, FaDollarSign, FaCalendar, FaUser, 
  FaHome, FaSearch, FaFilter, FaFileExport, FaEye
} from 'react-icons/fa';
import saleService from '../../services/saleService';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const SalesList = () => {
  const [purchases, setPurchases] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('purchases');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    // Filter purchases based on search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const filtered = purchases.filter(item => 
        item.propertyTitle?.toLowerCase().includes(term) ||
        item.sellerName?.toLowerCase().includes(term) ||
        item.paymentMethod?.toLowerCase().includes(term)
      );
      setFilteredPurchases(filtered);
    } else {
      setFilteredPurchases(purchases);
    }
  }, [searchTerm, purchases]);

  useEffect(() => {
    // Filter sales based on search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const filtered = sales.filter(item => 
        item.propertyTitle?.toLowerCase().includes(term) ||
        item.buyerName?.toLowerCase().includes(term) ||
        item.paymentMethod?.toLowerCase().includes(term)
      );
      setFilteredSales(filtered);
    } else {
      setFilteredSales(sales);
    }
  }, [searchTerm, sales]);

  const fetchSales = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching sales data...');
      
      // Fetch purchases and sales in parallel
      const [purchasesData, salesData] = await Promise.all([
        saleService.getMyPurchases(),
        saleService.getMySales()
      ]);
      
      console.log('Purchases received:', purchasesData);
      console.log('Sales received:', salesData);
      
      setPurchases(purchasesData || []);
      setSales(salesData || []);
      setFilteredPurchases(purchasesData || []);
      setFilteredSales(salesData || []);
      
    } catch (err) {
      console.error('Error fetching sales:', err);
      setError('Failed to load sales data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'N/A';
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
      'COMPLETED': 'success',
      'PENDING': 'warning',
      'CANCELLED': 'danger',
      'REFUNDED': 'info'
    };
    return <Badge bg={colors[status] || 'secondary'} pill>{status || 'COMPLETED'}</Badge>;
  };

  const exportToCSV = (data, type) => {
    if (!data || data.length === 0) return;
    
    const headers = ['Property', 'Date', 'Price', type === 'purchases' ? 'Seller' : 'Buyer', 'Payment Method', 'Status'];
    const csvContent = [
      headers.join(','),
      ...data.map(item => [
        `"${item.propertyTitle || ''}"`,
        formatDate(item.saleDate),
        item.salePrice || '',
        `"${type === 'purchases' ? item.sellerName || '' : item.buyerName || ''}"`,
        item.paymentMethod || '',
        item.status || 'COMPLETED'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3">Loading your sales data...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>Error Loading Sales</Alert.Heading>
          <p>{error}</p>
          <hr />
          <Button onClick={fetchSales} variant="primary">
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4 align-items-center">
        <Col md={6}>
          <h2 className="fw-bold mb-0">
            <FaShoppingCart className="me-2 text-primary" />
            Sales & Purchases
          </h2>
          <p className="text-muted mt-2 mb-0">
            Track your property transactions
          </p>
        </Col>
        <Col md={6} className="text-end">
          <Button 
            as={Link} 
            to="/properties" 
            variant="outline-primary"
            className="me-2"
          >
            <FaHome className="me-2" />
            Browse Properties
          </Button>
        </Col>
      </Row>

      {/* Search Bar */}
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by property, person, or payment method..."
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
        <Col md={6} className="text-end">
          <Button 
            variant="outline-success" 
            onClick={() => exportToCSV(activeTab === 'purchases' ? filteredPurchases : filteredSales, activeTab)}
            disabled={activeTab === 'purchases' ? filteredPurchases.length === 0 : filteredSales.length === 0}
          >
            <FaFileExport className="me-2" />
            Export {activeTab === 'purchases' ? 'Purchases' : 'Sales'}
          </Button>
        </Col>
      </Row>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab 
          eventKey="purchases" 
          title={
            <span>
              <FaUser className="me-2" />
              My Purchases <Badge bg="primary" pill>{purchases.length}</Badge>
            </span>
          }
        >
          {filteredPurchases.length === 0 ? (
            <Alert variant="info" className="text-center">
              <h5>No Purchases Yet</h5>
              <p>You haven't purchased any properties yet.</p>
              <Button as={Link} to="/properties" variant="primary">
                Browse Properties
              </Button>
            </Alert>
          ) : (
            <Card className="shadow-sm">
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Property</th>
                        <th>Date</th>
                        <th>Price</th>
                        <th>Seller</th>
                        <th>Payment Method</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPurchases.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <strong>{item.propertyTitle || 'N/A'}</strong>
                          </td>
                          <td>
                            <FaCalendar className="me-2 text-primary" />
                            {formatDate(item.saleDate)}
                          </td>
                          <td>
                            <FaDollarSign className="me-2 text-success" />
                            {formatPrice(item.salePrice)}
                          </td>
                          <td>
                            <FaUser className="me-2 text-info" />
                            {item.sellerName || 'N/A'}
                            {item.sellerEmail && (
                              <div>
                                <small className="text-muted">{item.sellerEmail}</small>
                              </div>
                            )}
                          </td>
                          <td>
                            <Badge bg="secondary" pill>{item.paymentMethod || 'BANK_TRANSFER'}</Badge>
                          </td>
                          <td>{getStatusBadge(item.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
              <Card.Footer className="bg-white text-muted">
                <small>
                  Showing {filteredPurchases.length} of {purchases.length} purchases
                  {filteredPurchases.length !== purchases.length && ' (filtered)'}
                </small>
              </Card.Footer>
            </Card>
          )}
        </Tab>

        <Tab 
          eventKey="sales" 
          title={
            <span>
              <FaHome className="me-2" />
              My Sales <Badge bg="success" pill>{sales.length}</Badge>
            </span>
          }
        >
          {filteredSales.length === 0 ? (
            <Alert variant="info" className="text-center">
              <h5>No Sales Yet</h5>
              <p>You haven't sold any properties yet.</p>
              <Button as={Link} to="/properties" variant="primary">
                List a Property
              </Button>
            </Alert>
          ) : (
            <Card className="shadow-sm">
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Property</th>
                        <th>Date</th>
                        <th>Price</th>
                        <th>Buyer</th>
                        <th>Payment Method</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSales.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <strong>{item.propertyTitle || 'N/A'}</strong>
                          </td>
                          <td>
                            <FaCalendar className="me-2 text-primary" />
                            {formatDate(item.saleDate)}
                          </td>
                          <td>
                            <FaDollarSign className="me-2 text-success" />
                            {formatPrice(item.salePrice)}
                          </td>
                          <td>
                            <FaUser className="me-2 text-info" />
                            {item.buyerName || 'N/A'}
                            {item.buyerEmail && (
                              <div>
                                <small className="text-muted">{item.buyerEmail}</small>
                              </div>
                            )}
                          </td>
                          <td>
                            <Badge bg="secondary" pill>{item.paymentMethod || 'BANK_TRANSFER'}</Badge>
                          </td>
                          <td>{getStatusBadge(item.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
              <Card.Footer className="bg-white text-muted">
                <small>
                  Showing {filteredSales.length} of {sales.length} sales
                  {filteredSales.length !== sales.length && ' (filtered)'}
                </small>
              </Card.Footer>
            </Card>
          )}
        </Tab>
      </Tabs>

      {/* Summary Cards */}
      <Row className="mt-4">
        <Col md={4}>
          <Card className="shadow-sm bg-primary text-white">
            <Card.Body>
              <h6>Total Purchases</h6>
              <h3>{purchases.length}</h3>
              <small>Properties you've bought</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm bg-success text-white">
            <Card.Body>
              <h6>Total Sales</h6>
              <h3>{sales.length}</h3>
              <small>Properties you've sold</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm bg-info text-white">
            <Card.Body>
              <h6>Total Transaction Value</h6>
              <h3>
                {formatPrice(
                  [...purchases, ...sales].reduce((sum, item) => sum + (item.salePrice || 0), 0)
                )}
              </h3>
              <small>Combined value</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SalesList;