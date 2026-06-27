import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert, Spinner } from 'react-bootstrap';
import api from '../services/api';

const TestApi = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const testBackend = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/test');
      setResult(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testProperties = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/properties');
      setResult(response.data);
      console.log('Properties:', response.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setResult({
      token: token ? 'Present' : 'Missing',
      user: user ? JSON.parse(user) : 'No user',
      isAuthenticated: !!token
    });
  };

  return (
    <Container className="py-4">
      <Card>
        <Card.Header>
          <h3>API Test Page</h3>
        </Card.Header>
        <Card.Body>
          <div className="mb-3">
            <Button onClick={testBackend} variant="info" className="me-2">
              Test Backend
            </Button>
            <Button onClick={testProperties} variant="primary" className="me-2">
              Test Properties
            </Button>
            <Button onClick={checkAuth} variant="warning">
              Check Auth
            </Button>
          </div>

          {loading && <Spinner animation="border" />}
          
          {error && (
            <Alert variant="danger" className="mt-3">
              <strong>Error:</strong> {error}
            </Alert>
          )}
          
          {result && (
            <Alert variant="success" className="mt-3">
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TestApi;