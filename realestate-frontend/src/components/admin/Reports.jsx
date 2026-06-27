import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FaChartLine, FaDownload } from 'react-icons/fa';

const AdminReports = () => {
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const handleChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    });
  };

  const generateReport = () => {
    alert('Report generation feature coming soon!');
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2><FaChartLine className="me-2" />Reports</h2>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Header>
              <h5>Generate Report</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={5}>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="startDate"
                      value={dateRange.startDate}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={5}>
                  <Form.Group className="mb-3">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="endDate"
                      value={dateRange.endDate}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <Button variant="primary" onClick={generateReport} className="w-100">
                    <FaDownload className="me-2" />Generate
                  </Button>
                </Col>
              </Row>

              <hr />

              <h6>Available Reports:</h6>
              <div className="d-flex flex-wrap gap-2">
                <Button variant="outline-primary" size="sm">Sales Report</Button>
                <Button variant="outline-success" size="sm">Revenue Report</Button>
                <Button variant="outline-info" size="sm">User Activity</Button>
                <Button variant="outline-warning" size="sm">Property Stats</Button>
                <Button variant="outline-danger" size="sm">Appointment Analytics</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm bg-primary text-white">
            <Card.Body>
              <h6>Quick Stats</h6>
              <hr className="bg-white" />
              <p>Total Revenue: $12.5M</p>
              <p>Total Sales: 45</p>
              <p>Active Users: 120</p>
              <p>Properties Listed: 89</p>
              <p>Appointments: 234</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminReports;