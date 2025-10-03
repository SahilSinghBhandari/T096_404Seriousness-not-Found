// src/components/Public Pannel/Donation.jsx
import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { db } from "../../firebase";
import {
  doc,
  addDoc,
  collection,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const Donation = () => {
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [profilePic, setProfilePic] = useState(null);

  const nav = useNavigate();
  const location = useLocation();
  const pingalwada = location.state; // 👈 passed from PingalwadaSection
  const storage = getStorage();

  // ✅ Upload image to Firebase Storage and return public URL
  const uploadProfilePic = async (docId) => {
    if (!profilePic) return "";
    try {
      const storageRef = ref(storage, `donors/${docId}-${profilePic.name}`);
      await uploadBytes(storageRef, profilePic);
      return await getDownloadURL(storageRef);
    } catch (err) {
      console.error("uploadProfilePic error:", err);
      toast.error("Image upload failed.");
      return "";
    }
  };

  const handlePayment = async () => {
    if (!amount || !name || !email) {
      alert("Please fill all required fields.");
      return;
    }

    if (!pingalwada?.paymentGatewayKey) {
      toast.error("This Pingalwada does not have a Razorpay key.");
      return;
    }

    // Step 1: Create initial Firestore doc
    let createdDocRef = null;
    try {
      const paymentsCol = collection(db, "payments");
      const initDoc = await addDoc(paymentsCol, {
        status: "initiated",
        donorName: name,
        donorEmail: email,
        donorState: state || "",
        donorCity: city || "",
        amount: Number(amount),
        message: message || "",
        pingalwadaId: pingalwada.id, // ✅ link to Pingalwada
        createdAt: serverTimestamp(),
      });
      createdDocRef = initDoc;
    } catch (err) {
      console.error("Error creating initial payment doc:", err);
      toast.error("Could not initialize payment. Try again.");
      return;
    }

    const docId = createdDocRef.id;

    // Step 2: Razorpay options
    const options = {
      key: pingalwada.paymentGatewayKey, // ✅ dynamic Razorpay key
      amount: Number(amount) * 100,
      currency: "INR",
      name: pingalwada.name,
      description: `Donation to ${pingalwada.name}`,
      prefill: { name, email, contact: "9999999999" },
      theme: { color: "#0066cc" },

      handler: async function (response) {
        try {
          const paymentId = response?.razorpay_payment_id || "";

          // ✅ Upload profile picture FIRST
          let profileUrl = "";
          if (profilePic) {
            profileUrl = await uploadProfilePic(docId);
          }

          // ✅ Update Firestore with final details
          const paymentDocRef = doc(db, "payments", docId);
          await updateDoc(paymentDocRef, {
            status: "success",
            paymentId,
            donorProfilePic: profileUrl,
            updatedAt: serverTimestamp(),
            completedAt: new Date().toISOString(),
          });

          toast.success("🎉 Payment successful!");
          setSubmitted(true);

          // ✅ Clear form
          setAmount("");
          setName("");
          setEmail("");
          setMessage("");
          setState("");
          setCity("");
          setProfilePic(null);

          nav("/thankyou");
        } catch (err) {
          console.error("Error in payment handler:", err);
          toast.error("Payment succeeded, but saving failed.");
        }
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay open error:", err);
      toast.error("Unable to open payment checkout.");
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center text-center mb-5">
        <Col md={8}>
          <h1 className="text-success fw-bold">
            Donate to {pingalwada?.name || "Pingalwada"} 💚
          </h1>
          <p className="text-muted">
            Your donation will directly support {pingalwada?.name} in{" "}
            {pingalwada?.location}.
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
                  dismissible
                  onClose={() => setSubmitted(false)}
                >
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

                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>State</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Profile Picture (Optional)</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setProfilePic(e.target.files?.[0] || null)
                    }
                  />
                  {profilePic && (
                    <div className="mt-2 text-center">
                      <img
                        src={URL.createObjectURL(profilePic)}
                        alt="preview"
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  )}
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