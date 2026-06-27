import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Spinner, Alert, Nav, Button } from 'react-bootstrap';
import { FaShoppingCart, FaDollarSign, FaCalendar, FaDownload, FaFilter } from 'react-icons/fa';
import transactionService from '../../services/transactionService';
import { useAuth } from '../../context/AuthContext';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('purchases');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    fetchTransactions();
  }, [activeTab]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      let data = [];
      
      if (activeTab === 'purchases') {
        data = await transactionService.getMyPurchases();
      } else if (activeTab === 'sales') {
        data = await transactionService.getMySales();
      } else if (activeTab === 'all' && isAdmin) {
        data = await transactionService.getAllTransactions();
      }
      
      setTransactions(data || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStatusBadge = (status) => {
    const colors = {
      'PENDING': 'warning',
      'COMPLETED': 'success',
      'FAILED': 'danger',
      'REFUNDED': 'info',
      'CANCELLED': 'secondary'
    };
    return <Badge bg={colors[status?.toUpperCase()] || 'secondary'}>{status || 'N/A'}</Badge>;
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

  const formatPrice = (price) => {
    if (!price) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getTabTitle = () => {
    if (activeTab === 'purchases') return 'My Purchases';
    if (activeTab === 'sales') return 'My Sales';
    return 'All Transactions';
  };

  const getTabCount = () => {
    return transactions.length;
  };

  const filteredTransactions = transactions.filter(t => {
    if (filterStatus === 'ALL') return true;
    return t.paymentStatus?.toUpperCase() === filterStatus;
  });

  const handleExport = () => {
    // Create CSV content
    const headers = ['Property', 'Date', 'Price', 'Buyer', 'Seller', 'Status', 'Payment Method'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => [
        `"${t.propertyTitle || ''}"`,
        formatDate(t.transactionDate),
        t.price || '',
        `"${t.buyerName || ''}"`,
        `"${t.sellerName || ''}"`,
        t.paymentStatus || '',
        t.paymentMethod || ''
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${getTabTitle().toLowerCase().replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3">Loading transactions...</p>
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
            Transactions
          </h2>
          <p className="text-muted mt-2 mb-0">
            View and manage your transaction history
          </p>
        </Col>
        <Col md={6} className="text-end">
          {transactions.length > 0 && (
            <Button 
              variant="outline-primary" 
              onClick={handleExport}
              className="me-2"
            >
              <FaDownload className="me-2" />
              Export CSV
            </Button>
          )}
        </Col>
      </Row>

      {/* Tabs */}
      <Row className="mb-4">
        <Col>
          <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
            <Nav.Item>
              <Nav.Link eventKey="purchases">
                My Purchases {activeTab === 'purchases' && transactions.length > 0 && 
                  <Badge bg="primary" className="ms-2">{transactions.length}</Badge>
                }
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="sales">
                My Sales {activeTab === 'sales' && transactions.length > 0 && 
                  <Badge bg="primary" className="ms-2">{transactions.length}</Badge>
                }
              </Nav.Link>
            </Nav.Item>
            {isAdmin && (
              <Nav.Item>
                <Nav.Link eventKey="all">
                  All Transactions {activeTab === 'all' && transactions.length > 0 && 
                    <Badge bg="primary" className="ms-2">{transactions.length}</Badge>
                  }
                </Nav.Link>
              </Nav.Item>
            )}
          </Nav>
        </Col>
      </Row>

      {/* Filter Bar */}
      {transactions.length > 0 && (
        <Row className="mb-4">
          <Col md={4}>
            <div className="d-flex align-items-center">
              <FaFilter className="text-muted me-2" />
              <Form.Select 
                size="sm" 
                style={{ width: 'auto' }}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
                <option value="REFUNDED">Refunded</option>
              </Form.Select>
            </div>
          </Col>
          <Col md={8} className="text-end">
            <p className="text-muted mb-0">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </p>
          </Col>
        </Row>
      )}

      {/* Error Message */}
      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Transactions Table */}
      {transactions.length === 0 ? (
        <Row>
          <Col>
            <Alert variant="info" className="text-center">
              <h5>No {activeTab === 'purchases' ? 'purchases' : activeTab === 'sales' ? 'sales' : 'transactions'} found</h5>
              <p className="mb-0">
                {activeTab === 'purchases' 
                  ? 'You haven\'t made any purchases yet.'
                  : activeTab === 'sales'
                  ? 'You haven\'t made any sales yet.'
                  : 'No transactions in the system yet.'
                }
              </p>
            </Alert>
          </Col>
        </Row>
      ) : filteredTransactions.length === 0 ? (
        <Row>
          <Col>
            <Alert variant="info" className="text-center">
              <h5>No transactions match the selected filter</h5>
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={() => setFilterStatus('ALL')}
                className="mt-2"
              >
                Clear Filter
              </Button>
            </Alert>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
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
                        <th>Seller</th>
                        <th>Status</th>
                        <th>Payment Method</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td>
                            <strong>{transaction.propertyTitle || 'N/A'}</strong>
                          </td>
                          <td>
                            <FaCalendar className="me-2 text-primary" />
                            {formatDate(transaction.transactionDate)}
                          </td>
                          <td>
                            <FaDollarSign className="me-2 text-success" />
                            {formatPrice(transaction.price)}
                          </td>
                          <td>
                            <div>{transaction.buyerName || 'N/A'}</div>
                            {transaction.buyerEmail && (
                              <small className="text-muted">{transaction.buyerEmail}</small>
                            )}
                          </td>
                          <td>
                            <div>{transaction.sellerName || 'N/A'}</div>
                            {transaction.sellerEmail && (
                              <small className="text-muted">{transaction.sellerEmail}</small>
                            )}
                          </td>
                          <td>{getPaymentStatusBadge(transaction.paymentStatus)}</td>
                          <td>{transaction.paymentMethod || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
              <Card.Footer className="bg-white text-muted">
                <small>
                  Showing {filteredTransactions.length} of {transactions.length} transactions
                </small>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

// Add missing import for Form at the top
import { Form } from 'react-bootstrap';

export default TransactionList;