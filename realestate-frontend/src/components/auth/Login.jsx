import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Clean the data before sending
    const cleanData = {
      email: formData.email.trim(),
      password: formData.password.trim()
    };

    console.log('📤 Submitting clean login data:', cleanData);

    try {
      const result = await login(cleanData);
      console.log('📥 Login result:', result);
      
      if (result.success) {
        navigate('/properties');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center bg-light py-5">
      <Row className="justify-content-center w-100">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-primary">Welcome Back</h2>
                <p className="text-muted">Sign in to manage your properties</p>
              </div>

              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    size="lg"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    size="lg"
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>

                {/* <div className="text-center mt-3">
                  <Link to="/register">Don't have an account? Sign up</Link>
                </div> */}
                
                <div className="text-center">
                                  <p className="mb-0">
                                    Don't have an account?{' '}
                                    <Link to="/register" className="text-primary fw-bold text-decoration-none">
                                      Sign up
                                    </Link>
                                  </p>
                                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;