import React, { useState, useEffect } from "react";
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
  const pingalwada = location.state;
  const storage = getStorage();

  const resetForm = () => {
    setAmount("");
    setName("");
    setEmail("");
    setMessage("");
    setState("");
    setCity("");
    setProfilePic(null);
  };

  useEffect(() => {
    resetForm();
  }, []);

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
    if (!amount || !name || !email || !message) {
      alert("⚠️ Please fill all required fields including message.");
      return;
    }

    if (!pingalwada?.razorpayKey) {
      toast.error("This Pingalwada does not have a Razorpay key.");
      return;
    }

    let createdDocRef = null;
    try {
      const paymentsCol = collection(db, "payments");
      const initDoc = await addDoc(paymentsCol, {
        status: "initiated",
        donorName: name,
        donorEmail: email,
        donorState: state || "",
        donorCity: city || "",
        donorMessage: message,
        donorProfilePic: "",
        amount: Number(amount),
        pingalwadaId: pingalwada.id,
        pingalwadaName: pingalwada.name,
        createdAt: serverTimestamp(),
      });
      createdDocRef = initDoc;
    } catch (err) {
      console.error("Error creating initial payment doc:", err);
      toast.error("❌ Could not initialize payment. Try again.");
      return;
    }

    const docId = createdDocRef.id;

    const options = {
      key: pingalwada.razorpayKey || "rzp_test_ROv4afGSGZTaUy",
      amount: Number(amount) * 100,
      currency: "INR",
      name: pingalwada.name,
      description: `Donation to ${pingalwada.name}`,
      prefill: { name, email, contact: "9999999999" },
      theme: { color: "#198754" }, // green theme

      handler: async function (response) {
        try {
          const paymentId = response?.razorpay_payment_id || "";

          let profileUrl = "";
          if (profilePic) {
            profileUrl = await uploadProfilePic(docId);
          }

          const paymentDocRef = doc(db, "payments", docId);
          await updateDoc(paymentDocRef, {
            status: "success",
            paymentId,
            donorProfilePic: profileUrl,
            donorName: name,
            donorEmail: email,
            donorState: state,
            donorCity: city,
            donorMessage: message,
            pingalwadaId: pingalwada.id,
            pingalwadaName: pingalwada.name,
            updatedAt: serverTimestamp(),
            completedAt: new Date().toISOString(),
          });

          toast.success("🎉 Payment successful!");
          setSubmitted(true);

          resetForm();

          // ✅ Delay navigation so Razorpay modal closes fully
          setTimeout(() => {
            nav("/thankyou");
          }, 500);

        } catch (err) {
          console.error("Error in payment handler:", err);
          toast.error("✅ Payment succeeded, but saving failed.");
        }
      },

      modal: {
        ondismiss: () => {
          toast.info("ℹ️ Payment cancelled by user.");
          resetForm();
        },
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay open error:", err);
      toast.error("❌ Unable to open payment checkout.");
    }
  };

  return (
    <Container className="py-5">
      {/* 🌟 Hero Section */}
      <Row className="justify-content-center text-center mb-4">
        <Col md={10}>
          <h1 className="fw-bold text-success">
            💚 Donate to {pingalwada?.name || "AshaDeep"}
          </h1>
          <p className="text-muted fs-5">
            Together we can bring hope, care, and dignity to those in need.  
            Every contribution makes a difference.
          </p>
        </Col>
      </Row>

      {/* 🌟 Donation Form */}
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
                  🎉 Thank you for your generous donation!
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
                  <Form.Label>Message *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Write a message of support..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button variant="success" size="lg" onClick={handlePayment}>
                    Donate Now 💝
                  </Button>
                  <small className="text-muted mt-2">🔒 Secure Payment via Razorpay</small>
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