import { useState } from "react";
import { motion } from "framer-motion";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  // ✅ Check if user is Admin
  const isAdmin = (userEmail) => {
    return userEmail?.toLowerCase() === "sahil@gmail.com"; // admin email
  };

  // ✅ Handle Login (email + password)
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);

      // ✅ Save/update user login info in Firestore
      await setDoc(
        doc(db, "users", userCred.user.uid),
        {
          uid: userCred.user.uid,
          email: userCred.user.email,
          lastLogin: serverTimestamp(),
        },
        { merge: true }
      );

      toast.success("✅ Login Successful!");

      // ✅ Redirect based on role
      if (isAdmin(userCred.user.email)) {
        nav("/admin"); // redirect admin
      } else {
        nav("/"); // redirect normal user
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.message || "Login failed");
    }
  };

  // ✅ Google Sign-in
  const signInGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCred = await signInWithPopup(auth, provider);

      // ✅ Save/update user info in Firestore
      await setDoc(
        doc(db, "users", userCred.user.uid),
        {
          uid: userCred.user.uid,
          email: userCred.user.email,
          name: userCred.user.displayName || "",
          photoURL: userCred.user.photoURL || "",
          lastLogin: serverTimestamp(),
        },
        { merge: true }
      );

      toast.success("✅ Logged in with Google!");

      // ✅ Redirect based on role
      if (isAdmin(userCred.user.email)) {
        nav("/admin");
      } else {
        nav("/");
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      toast.error(error.message || "Google login failed");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f7fa",
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
                  {/* ✅ Left Form Section */}
                  <Col md={6} className="p-4">
                    <motion.h3
                      className="text-center mb-4"
                      style={{ color: "#1e3c72", fontWeight: "bold" }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      Login
                    </motion.h3>

                    <Form onSubmit={handleLogin}>
                      {/* Email */}
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <Form.Group className="mb-3">
                          <Form.Label style={{ color: "#1e3c72", fontWeight: "500" }}>
                            Email Address
                          </Form.Label>
                          <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </motion.div>

                      {/* Password */}
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        <Form.Group className="mb-3">
                          <Form.Label style={{ color: "#1e3c72", fontWeight: "500" }}>
                            Password
                          </Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </motion.div>

                      {/* Login Button */}
                      <motion.div
                        className="d-grid"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1 }}
                      >
                        <Button
                          variant="primary"
                          type="submit"
                          style={{
                            backgroundColor: "#1e3c72",
                            border: "none",
                            fontWeight: "600",
                          }}
                        >
                          Login
                        </Button>
                      </motion.div>

                      {/* Google Sign In */}
                      <motion.div
                        className="d-grid mt-3"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.2 }}
                      >
                        <Button
                          variant="outline-danger"
                          onClick={signInGoogle}
                          style={{
                            border: "2px solid #dc3545",
                            fontWeight: "600",
                          }}
                        >
                          Sign in with Google
                        </Button>
                      </motion.div>
                    </Form>
                  </Col>

                  {/* ✅ Right Animation Section */}
                  <Col
                    md={6}
                    className="d-flex align-items-center justify-content-center bg-light"
                  >
                    <DotLottieReact
                      src="https://lottie.host/4ac3e52c-4d07-4f3c-b2e4-c39df5efefcf/y3RQY9gctT.lottie"
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
