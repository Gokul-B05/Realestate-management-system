import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Spinner, Alert, Form, InputGroup, Button } from 'react-bootstrap';
import { FaShoppingCart, FaDollarSign, FaCalendar, FaUser, FaSearch, FaFileExport } from 'react-icons/fa';
import saleService from '../../services/saleService';

const AdminSales = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllSales();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const filtered = sales.filter(sale => 
        sale.propertyTitle?.toLowerCase().includes(term) ||
        sale.buyerName?.toLowerCase().includes(term) ||
        sale.sellerName?.toLowerCase().includes(term) ||
        sale.paymentMethod?.toLowerCase().includes(term)
      );
      setFilteredSales(filtered);
    } else {
      setFilteredSales(sales);
    }
  }, [searchTerm, sales]);

  const fetchAllSales = async () => {
    try {
      setLoading(true);
      const data = await saleService.getAllSales();
      setSales(data || []);
      setFilteredSales(data || []);
    } catch (err) {
      setError('Failed to load sales data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    if (!price) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const exportToCSV = () => {
    const headers = ['Property', 'Date', 'Price', 'Seller', 'Buyer', 'Payment Method', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredSales.map(sale => [
        `"${sale.propertyTitle || ''}"`,
        formatDate(sale.saleDate),
        sale.salePrice || '',
        `"${sale.sellerName || ''}"`,
        `"${sale.buyerName || ''}"`,
        sale.paymentMethod || '',
        sale.status || 'COMPLETED'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all_sales_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2><FaShoppingCart className="me-2" />All Sales Transactions</h2>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by property, buyer, seller..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={6} className="text-end">
          <Button variant="success" onClick={exportToCSV}>
            <FaFileExport className="me-2" />Export CSV
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {filteredSales.length === 0 ? (
        <Alert variant="info">No sales found</Alert>
      ) : (
        <Card>
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Date</th>
                  <th>Price</th>
                  <th>Seller</th>
                  <th>Buyer</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map(sale => (
                  <tr key={sale.id}>
                    <td>{sale.propertyTitle}</td>
                    <td><FaCalendar className="me-2" />{formatDate(sale.saleDate)}</td>
                    <td><FaDollarSign className="text-success" /> {formatPrice(sale.salePrice)}</td>
                    <td><FaUser className="me-2" />{sale.sellerName}</td>
                    <td><FaUser className="me-2" />{sale.buyerName}</td>
                    <td>{sale.paymentMethod}</td>
                    <td><Badge bg="success">{sale.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default AdminSales;