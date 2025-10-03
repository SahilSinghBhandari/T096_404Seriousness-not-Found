import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { db, auth } from "../../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
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
  const pingalwada = location.state; // ✅ Should contain { id, name, location }
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

  // Upload donor profile pic if added
  const uploadProfilePic = async (docId) => {
    if (!profilePic) return "";
    try {
      const storageRef = ref(storage, `donors/${docId}-${profilePic.name}`);
      await uploadBytes(storageRef, profilePic);
      return await getDownloadURL(storageRef);
    } catch (err) {
      console.error("🔥 uploadProfilePic error:", err);
      toast.error("Image upload failed.");
      return "";
    }
  };

  // Save transaction in Firestore
  const saveTransaction = async (txnData) => {
    try {
      await addDoc(collection(db, "transactions"), txnData);
      console.log("✅ Transaction saved");
    } catch (error) {
      console.error("🔥 Error saving transaction:", error);
      toast.error("Error saving transaction: " + error.message);
    }
  };

  // Handle payment
  const handlePayment = async () => {
    if (!amount || !name || !email || !message) {
      alert("⚠️ Please fill all required fields including message.");
      return;
    }

    if (!window.Razorpay) {
      toast.error("❌ Razorpay SDK not loaded. Check your script include.");
      return;
    }

    console.log("🔥 pingalwada received:", pingalwada);

    const user = auth.currentUser;

    const options = {
      key: pingalwada?.razorpayKey || "rzp_test_RP9VlGnNBImdLC", // ⚠️ replace with your Key ID
      amount: Number(amount) * 100,
      currency: "INR",
      name: pingalwada?.name || "Pingalwada",
      description: `Donation to ${pingalwada?.name}`,
      prefill: { name, email, contact: "9999999999" },
      theme: { color: "#198754" },

      handler: async function (response) {
        try {
          console.log("✅ Razorpay success response:", response);
          const paymentId = response?.razorpay_payment_id || "";
          let profileUrl = "";

          if (profilePic) {
            profileUrl = await uploadProfilePic(paymentId);
          }

          const donationData = {
            userId: user ? user.uid : "guest",
            donorName: name,
            donorEmail: email,
            donorState: state || "Not Provided",
            donorCity: city || "Not Provided",
            donorProfilePic: profileUrl || "",
            donorMessage: message,
            amount: Number(amount),

            // ✅ Fixed: No undefined values
            pingalwadaId: pingalwada?.id || null,
            pingalwadaName: pingalwada?.name || "AshaDeep Foundation",
            associationName: pingalwada?.name || "AshaDeep Foundation",
            associationLocation: pingalwada?.location || "Not Specified",

            paymentId,
            status: "success",
            createdAt: serverTimestamp(),
            completedAt: new Date().toISOString(),
          };

          // Save in Firestore (payments)
          await addDoc(collection(db, "payments"), donationData);
          console.log("✅ Payment saved in Firestore");

          // Save in Firestore (transactions)
          await saveTransaction(donationData);

          toast.success("🎉 Payment successful!");
          setSubmitted(true);
          resetForm();
          setTimeout(() => nav("/thankyou"), 600);
        } catch (err) {
          console.error("🔥 Error after payment:", err);
          toast.error("✅ Payment done, but saving failed.");
        }
      },

      modal: {
        ondismiss: () => {
          toast.info("ℹ️ Payment cancelled by user.");
        },
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("🔥 Razorpay open error:", err);
      toast.error("❌ Unable to open payment checkout.");
    }
  };

  return (
    <Container className="py-5">
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
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button variant="success" size="lg" onClick={handlePayment}>
                    Donate Now 💝
                  </Button>
                  <small className="text-muted mt-2">
                    🔒 Secure Payment via Razorpay
                  </small>
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