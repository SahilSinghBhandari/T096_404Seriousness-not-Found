import { Container, Row, Col, Card, ListGroup, ProgressBar } from "react-bootstrap";

export default function ImpactDashboard() {
  return (
    <Container className="py-5">
      <h2 className="text-center mb-5 fw-bold text-success">Impact Dashboard</h2>

      {/* Summary Section */}
      <Row className="mb-4 text-center">
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h4 className="fw-bold">₹1,25,000</h4>
              <p className="text-muted">Total Donations</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h4 className="fw-bold">350+</h4>
              <p className="text-muted">People Helped</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h4 className="fw-bold">25</h4>
              <p className="text-muted">Active Volunteers</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Category Progress */}
      <h4 className="mb-3">Funds Distribution</h4>
      <ProgressBar>
        <ProgressBar variant="success" now={45} key={1} label="Food 45%" />
        <ProgressBar variant="warning" now={30} key={2} label="Blankets 30%" />
        <ProgressBar variant="info" now={25} key={3} label="Medicines 25%" />
      </ProgressBar>

      {/* Recent Donations */}
      <h4 className="mt-5 mb-3">Recent Contributions</h4>
      <ListGroup>
        <ListGroup.Item>🙋 Aman donated ₹500 for Food</ListGroup.Item>
        <ListGroup.Item>🎁 Simran donated ₹1000 for Medicines</ListGroup.Item>
        <ListGroup.Item>✨ Anonymous donated ₹200 for Blankets</ListGroup.Item>
      </ListGroup>

      {/* Proof of Work */}
      <h4 className="mt-5 mb-3">Proof of Impact</h4>
      <Row>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Img variant="top" src="https://via.placeholder.com/400x200.png?text=Blanket+Distribution" />
            <Card.Body>
              <Card.Text>✅ 60 Blankets distributed this winter</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Img variant="top" src="https://via.placeholder.com/400x200.png?text=Medicines+Supplied" />
            <Card.Body>
              <Card.Text>💊 30 patients received medicines this month</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Top Donors */}
      <h4 className="mt-5 mb-3">Top Supporters</h4>
      <Row>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5>🏆 Top Donor: Simran</h5>
              <p>₹5000 Donated</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5>⭐ Most Active Volunteer: Aman</h5>
              <p>10 Hours this week</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}