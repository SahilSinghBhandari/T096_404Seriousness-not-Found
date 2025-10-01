import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Donation = () => {
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const nav = useNavigate();

  const handlePayment = () => {
    if (!amount || !name || !email) {
      alert("Please fill all required fields.");
      return;
    }

    const options = {
      key: "rzp_test_RO6yowrTlsHmWL", // ✅ test key
      amount: amount * 100, // in paise
      currency: "INR",
      name: "Helping Hand",
      description: "Donation",
      handler: async function (response) {
        try {
          // ✅ Create new doc with paymentId
          const ref = doc(db, "payments", response.razorpay_payment_id);
          await setDoc(ref, {
            paymentId: response.razorpay_payment_id,
            status: "success",
            donorName: name,
            donorEmail: email,
            message: message,
            amount: amount,
            timestamp: new Date(),
          });

          toast.success("🎉 Payment successful!");
          setSubmitted(true);

          // Clear form
          setAmount("");
          setName("");
          setEmail("");
          setMessage("");

          nav("/thankyou"); // redirect if needed
        } catch (error) {
          console.error("Error saving payment:", error);
          toast.error("Error saving payment. Please try again.");
        }
      },
      prefill: {
        name: name,
        email: email,
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
            Your donation helps us provide education, healthcare, and shelter to those in need.
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-lg border-0 p-4">
            <Card.Body>
              <h3 className="text-center text-success mb-4">Donate Now</h3>

              {submitted && (
                <Alert variant="success" dismissible onClose={() => setSubmitted(false)}>
                  🎉 Thank you for your generous donation, {name}!
                </Alert>
              )}

              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address *</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Donation Amount (₹) *</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
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
                  <Button variant="success" size="lg" onClick={handlePayment}>
                    Donate Now 💝
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Donation;