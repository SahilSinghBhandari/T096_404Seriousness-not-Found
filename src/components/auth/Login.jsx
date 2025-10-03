// // src/components/auth/Login.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  // ✅ Redirect based on user role
  const redirectByRole = async (uid, email) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      let role = "user";
      if (userSnap.exists()) {
        role = userSnap.data().role || "user";
      }

      if (role === "admin" || email?.toLowerCase() === "sahil@gmail.com") {
        nav("/admin");
      } else if (role === "pingalwada-admin") {
        nav("/pingalwada-admin");
      } else {
        nav("/");
      }
    } catch (err) {
      console.error("Role fetch error:", err);
      nav("/");
    }
  };

  // ✅ Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warn("⚠️ Please fill in both email and password");
      return;
    }

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          email: user.email,
          lastLogin: serverTimestamp(),
        },
        { merge: true }
      );

      toast.success("✅ Login Successful!");
      redirectByRole(user.uid, user.email);
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        toast.error("❌ Incorrect password, please try again.");
      } else if (error.code === "auth/user-not-found") {
        toast.error("❌ No account found with this email.");
      } else if (error.code === "auth/invalid-email") {
        toast.error("⚠️ Please enter a valid email.");
      } else {
        toast.error(error.message || "Login failed");
      }
    }
  };

  // ✅ Google Sign-in
  const signInGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCred = await signInWithPopup(auth, provider);
      const user = userCred.user;

      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          email: user.email,
          name: user.displayName || "",
          photoURL: user.photoURL || "",
          lastLogin: serverTimestamp(),
        },
        { merge: true }
      );

      toast.success("✅ Logged in with Google!");
      redirectByRole(user.uid, user.email);
    } catch (error) {
      toast.error(error.message || "Google login failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff", // ✅ White background
        padding: "20px",
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            {/* ✅ Animate the whole card only */}
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
                      Login
                    </h3>

                    <Form onSubmit={handleLogin}>
                      {/* Email */}
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

                      {/* Password */}
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

                      {/* Login Button */}
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
                          Login
                        </Button>
                      </div>

                      {/* Google Sign In */}
                      <div className="d-grid mt-3">
                        <Button
                          variant="outline-primary"
                          onClick={signInGoogle}
                          style={{
                            border: "2px solid #1e3c72",
                            fontWeight: "600",
                            color: "#1e3c72",
                          }}
                        >
                          Sign in with Google
                        </Button>
                      </div>

                      {/* Register Now Link */}
                      <div className="text-center mt-3">
                        <span style={{ color: "#555" }}>Don't have an account? </span>
                        <Link
                          to="/register"
                          style={{ color: "#1e3c72", fontWeight: "bold" }}
                        >
                          Register Now
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
                      src="https://lottie.host/c33ffb93-39f4-4d89-94d9-0e976378e57e/bnXRulriGi.lottie"
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
