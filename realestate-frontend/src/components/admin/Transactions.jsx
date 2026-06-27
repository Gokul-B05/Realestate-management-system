import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Spinner } from 'react-bootstrap';
import { FaShoppingCart, FaDollarSign, FaCalendar } from 'react-icons/fa';

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    setTimeout(() => {
      setTransactions([
        { id: 1, property: 'Luxury Beach House', amount: 850000, buyer: 'John Doe', seller: 'Jane Smith', date: '2024-03-01', status: 'COMPLETED' },
        { id: 2, property: 'Downtown Apartment', amount: 3200, buyer: 'Bob Johnson', seller: 'Alice Brown', date: '2024-03-02', status: 'PENDING' },
        { id: 3, property: 'Suburban Family Home', amount: 650000, buyer: 'Charlie Wilson', seller: 'David Lee', date: '2024-03-03', status: 'COMPLETED' }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
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
          <h2><FaShoppingCart className="me-2" />Manage Transactions</h2>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Property</th>
                <th>Amount</th>
                <th>Buyer</th>
                <th>Seller</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id}>
                  <td>{t.property}</td>
                  <td><FaDollarSign className="text-success" /> {formatPrice(t.amount)}</td>
                  <td>{t.buyer}</td>
                  <td>{t.seller}</td>
                  <td><FaCalendar className="me-2" />{t.date}</td>
                  <td><Badge bg={t.status === 'COMPLETED' ? 'success' : 'warning'}>{t.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminTransactions;