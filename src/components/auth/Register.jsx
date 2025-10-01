import { useState } from "react";
import { motion } from "framer-motion";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { auth, db } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const nav = useNavigate();

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Update display name
      await updateProfile(userCred.user, {
        displayName: formData.fullName,
      });

      // Save user in Firestore
      await setDoc(doc(db, "users", userCred.user.uid), {
        fullName: formData.fullName,
        email: formData.email,
        createdAt: new Date(),
      });

      toast.success("Registered Successfully 🎉");
      nav("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ✅ Google Sign-up
  const signUpGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Google Sign-up Successful ✅");
      nav("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f7fa", // light professional background
        padding: "20px",
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="shadow-lg rounded-4 overflow-hidden border-0">
                <Row className="g-0">
                  {/* ✅ Left Animation Section */}
                  <Col
                    md={6}
                    className="d-flex align-items-center justify-content-center bg-light"
                  >
                    <DotLottieReact
                      src="https://lottie.host/57b33191-0972-46ad-83a9-72b1ed82157f/Qj79kTJOPn.lottie"
                      loop
                      autoplay
                      style={{ width: "90%", maxWidth: "350px" }}
                    />
                  </Col>

                  {/* ✅ Right Form Section */}
                  <Col md={6} className="p-4">
                    <motion.h3
                      className="text-center mb-4"
                      style={{ color: "#1e3c72", fontWeight: "bold" }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      Create Account
                    </motion.h3>

                    <Form onSubmit={handleRegister}>
                      {/* Full Name */}
                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#1e3c72", fontWeight: "500" }}>
                          Full Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="fullName"
                          placeholder="Enter full name"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      {/* Email */}
                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#1e3c72", fontWeight: "500" }}>
                          Email Address
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Enter email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      {/* Password */}
                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#1e3c72", fontWeight: "500" }}>
                          Password
                        </Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          placeholder="Enter password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      {/* Confirm Password */}
                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#1e3c72", fontWeight: "500" }}>
                          Confirm Password
                        </Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirm password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      {/* Register Button */}
                      <div className="d-grid">
                        <Button
                          variant="primary"
                          type="submit"
                          style={{
                            backgroundColor: "#1e3c72",
                            border: "none",
                            fontWeight: "600",
                          }}
                        >
                          Register
                        </Button>
                      </div>

                      {/* Google Sign Up */}
                      <div className="d-grid mt-3">
                        <Button
                          variant="outline-primary"
                          onClick={signUpGoogle}
                          style={{
                            border: "2px solid #1e3c72",
                            color: "#1e3c72",
                            fontWeight: "600",
                          }}
                        >
                          Sign up with Google
                        </Button>
                      </div>
                    </Form>
                  </Col>
                </Row>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
