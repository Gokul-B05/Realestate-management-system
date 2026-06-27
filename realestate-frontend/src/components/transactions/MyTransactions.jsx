import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Spinner, Alert, Nav } from 'react-bootstrap';
import { FaShoppingCart, FaDollarSign, FaCalendar } from 'react-icons/fa';
import transactionService from '../../services/transactionService';

const MyTransactions = () => {
  const [purchases, setPurchases] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('purchases');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const [purchasesData, salesData] = await Promise.all([
        transactionService.getMyPurchases(),
        transactionService.getMySales()
      ]);
      setPurchases(purchasesData);
      setSales(salesData);
    } catch (err) {
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Container className="text-center py-5"><Spinner animation="border" /></Container>;

  return (
    <Container className="py-4">
      <h2 className="mb-4"><FaShoppingCart className="me-2" />My Transactions</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
        <Nav.Item><Nav.Link eventKey="purchases">Purchases ({purchases.length})</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="sales">Sales ({sales.length})</Nav.Link></Nav.Item>
      </Nav>

      {activeTab === 'purchases' && (
        <Card>
          <Card.Body>
            {purchases.length === 0 ? (
              <Alert variant="info">No purchases yet</Alert>
            ) : (
              <Table responsive hover>
                <thead>
                  <tr><th>Property</th><th>Date</th><th>Price</th><th>Seller</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {purchases.map(t => (
                    <tr key={t.id}>
                      <td>{t.propertyTitle}</td>
                      <td><FaCalendar className="me-2" />{new Date(t.transactionDate).toLocaleDateString()}</td>
                      <td><FaDollarSign className="text-success" /> {t.price}</td>
                      <td>{t.sellerName}</td>
                      <td><Badge bg="success">{t.paymentStatus}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      )}

      {activeTab === 'sales' && (
        <Card>
          <Card.Body>
            {sales.length === 0 ? (
              <Alert variant="info">No sales yet</Alert>
            ) : (
              <Table responsive hover>
                <thead>
                  <tr><th>Property</th><th>Date</th><th>Price</th><th>Buyer</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {sales.map(t => (
                    <tr key={t.id}>
                      <td>{t.propertyTitle}</td>
                      <td><FaCalendar className="me-2" />{new Date(t.transactionDate).toLocaleDateString()}</td>
                      <td><FaDollarSign className="text-success" /> {t.price}</td>
                      <td>{t.buyerName}</td>
                      <td><Badge bg="success">{t.paymentStatus}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default MyTransactions;