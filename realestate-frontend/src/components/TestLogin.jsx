import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const TestLogin = () => {
  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('your-password');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testLogin = async () => {
    try {
      setError(null);
      setResult(null);
      
      console.log('Testing direct axios call...');
      
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: email.trim(),
        password: password.trim()
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Success!', response.data);
      setResult(response.data);
      
    } catch (err) {
      console.error('Error:', err.response || err);
      setError({
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
    }
  };

  return (
    <Container className="py-5">
      <Card>
        <Card.Header>
          <h3>Direct Login Test</h3>
        </Card.Header>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            
            <Button onClick={testLogin} variant="primary">
              Test Login
            </Button>
          </Form>
          
          {result && (
            <Alert variant="success" className="mt-3">
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </Alert>
          )}
          
          {error && (
            <Alert variant="danger" className="mt-3">
              <h5>Error {error.status}</h5>
              <pre>{JSON.stringify(error.data, null, 2)}</pre>
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TestLogin;