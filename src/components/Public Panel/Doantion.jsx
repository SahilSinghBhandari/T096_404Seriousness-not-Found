import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";

const Donation=()=> {
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amount || !name || !email) {
      alert("Please fill all required fields.");
      return;
    }

    // ✅ Here you can integrate Razorpay, Stripe, or Firebase Firestore
    setSubmitted(true);
    setAmount("");
    setName("");
    setEmail("");
  };
   const handlePayment = (e) => {
    const options = {
      key: "rzp_test_RO6yowrTlsHmWL", // Razorpay Key ID
      amount: amount*100, // Amount in paisa (₹500)
      currency: "INR",
      name: "Helping Hand",
      description: "Product or Service",
      handler: async function (response) {
        // Save payment ID to Firebase Firestore
        const ref = doc(db, "payments", response.razorpay_payment_id);
        await setDoc(ref, {
          paymentId: response.razorpay_payment_id,
          status: "success",
          amount:amt,
          dietId,
          userId:sessionStorage.getItem("userId"),
          timestamp: Date.now(),
        });
        toast("Payment successful!");
        nav("/managesub")
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#0066cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  
  return (
    <Container className="py-5">
      <Row className="justify-content-center text-center mb-5">
        <Col md={8}>
          <h1 className="text-success fw-bold">Make a Difference Today 💚</h1>
          <p className="text-muted">
            Your donation helps us provide education, healthcare, and shelter to
            those in need. Every contribution counts!
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-lg border-0 p-4">
            <Card.Body>
              <h3 className="text-center text-success mb-4">Donate Now</h3>

              {submitted && (
                <Alert
                  variant="success"
                  onClose={() => setSubmitted(false)}
                  dismissible
                >
                  🎉 Thank you for your generous donation, {name}!
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address *</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Donation Amount (₹) *</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Message (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Write a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button type="submit" variant="success" size="lg" onClick={handlePayment}>
                    Donate Now 💝
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="text-center mt-5">
        <Col>
          <h4 className="fw-bold text-success">Your Support Matters 🌱</h4>
          <p className="text-muted">
            100% of your donation goes directly towards helping those in need.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Donation;