import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaCog, FaBell, FaMoon, FaGlobe, FaSave } from 'react-icons/fa';

const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    darkMode: false,
    language: 'en',
    currency: 'USD'
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setSettings({
      ...settings,
      [e.target.name]: value
    });
  };

  const handleSave = () => {
    // Save to localStorage or backend
    localStorage.setItem('userSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0"><FaCog className="me-2" />Settings</h4>
            </Card.Header>
            <Card.Body>
              {saved && <Alert variant="success">Settings saved successfully!</Alert>}

              <h5 className="mb-3"><FaBell className="me-2" />Notifications</h5>
              <Form.Group className="mb-4">
                <Form.Check
                  type="switch"
                  id="emailNotifications"
                  name="emailNotifications"
                  label="Email Notifications"
                  checked={settings.emailNotifications}
                  onChange={handleChange}
                />
              </Form.Group>

              <h5 className="mb-3"><FaMoon className="me-2" />Appearance</h5>
              <Form.Group className="mb-4">
                <Form.Check
                  type="switch"
                  id="darkMode"
                  name="darkMode"
                  label="Dark Mode"
                  checked={settings.darkMode}
                  onChange={handleChange}
                />
              </Form.Group>

              <h5 className="mb-3"><FaGlobe className="me-2" />Preferences</h5>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Language</Form.Label>
                    <Form.Select name="language" value={settings.language} onChange={handleChange}>
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Currency</Form.Label>
                    <Form.Select name="currency" value={settings.currency} onChange={handleChange}>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Button variant="primary" onClick={handleSave} className="mt-3">
                <FaSave className="me-2" />Save Settings
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;