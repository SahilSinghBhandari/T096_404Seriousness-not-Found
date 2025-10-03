// src/components/auth/Register.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Spinner,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { toast } from "react-toastify";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  // ✅ Register with Email + Password
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCred.user;

      // Save user to Firestore "users" collection with role = user
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          name: name,
          email: user.email,
          role: "user",
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      toast.success("User Registered Successfully");
      nav("/");
    } catch (error) {
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google Register/Login
  const signInGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCred = await signInWithPopup(auth, provider);
      const user = userCred.user;

      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          name: user.displayName || "",
          email: user.email,
          photo: user.photoURL || "",
          role: "user",
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      toast.success("Google Sign-in Successful");
      nav("/");
    } catch (error) {
      toast.error(error.message || "Google Sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        padding: "20px",
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            {/* ✅ Whole card animation only */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="shadow-lg rounded-4 overflow-hidden border-0">
                <Row className="g-0">
                  {/* ✅ Left Form Section */}
                  <Col md={6} className="p-4">
                    <h3
                      className="text-center mb-4"
                      style={{ color: "#1e3c72", fontWeight: "bold" }}
                    >
                      Register
                    </h3>

                    <Form onSubmit={handleRegister}>
                      {/* Name */}
                      <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </Form.Group>

                      {/* Email */}
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Enter email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </Form.Group>

                      {/* Password */}
                      <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Enter password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </Form.Group>

                      {/* Register Button */}
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Button
                          variant="primary"
                          type="submit"
                          className="w-100"
                          style={{ backgroundColor: "#1e3c72", border: "none" }}
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />{" "}
                              Registering...
                            </>
                          ) : (
                            "Register"
                          )}
                        </Button>
                      </motion.div>

                      {/* Google Sign In */}
                      <motion.div
                        className="mt-3"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Button
                          variant="outline-primary"
                          className="w-100"
                          onClick={signInGoogle}
                          disabled={loading}
                          style={{
                            border: "2px solid #1e3c72",
                            color: "#1e3c72",
                            fontWeight: "600",
                          }}
                        >
                          {loading ? "Please wait..." : "Sign up with Google"}
                        </Button>
                      </motion.div>

                      {/* ✅ Go to Login */}
                      <div className="text-center mt-3">
                        <span style={{ color: "#555" }}>Already have an account? </span>
                        <Link
                          to="/login"
                          style={{ color: "#1e3c72", fontWeight: "bold" }}
                        >
                          Login
                        </Link>
                      </div>
                    </Form>
                  </Col>

                  {/* ✅ Right Animation Section */}
                  <Col
                    md={6}
                    className="d-flex align-items-center justify-content-center bg-light"
                  >
                    <DotLottieReact
                      src="https://lottie.host/eb282d4f-670d-4e4e-8e4f-cdeddba51b71/Qi86efPBr5.lottie"
                      loop
                      autoplay
                      style={{ width: "90%", maxWidth: "350px" }}
                    />
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
