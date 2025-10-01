import { Container, Row, Col, Card } from "react-bootstrap";

const ThankYou = () => {
  return (
    <Container className="py-5 text-center">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg border-0 p-5">
            <h1 className="text-success fw-bold">🎉 Thank You!</h1>
            <p className="mt-3 text-muted">
              Your donation has been received successfully.  
              We truly appreciate your support in helping us make a difference. 💚
            </p>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ThankYou;