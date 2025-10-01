import { useState } from "react";
import { motion } from "framer-motion";
import { Form, Button, Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../../firebase";
import { toast } from "react-toastify";
import { doc, setDoc } from "firebase/firestore";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false); // ✅ loader state
  const nav = useNavigate();

  // ✅ Register with Email + Password
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); // start loader
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      // Save user to Firestore "users" collection
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: user.email,
        createdAt: new Date(),
      });

      toast.success("User Registered Successfully 🎉");
      nav("/");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false); // stop loader
    }
  };

  // ✅ Google Register/Login
  const signInGoogle = async () => {
    setLoading(true); // start loader
    try {
      let provider = new GoogleAuthProvider();
      const userCred = await signInWithPopup(auth, provider);
      const user = userCred.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        createdAt: new Date(),
      });

      toast.success("Google Sign-in Successful 🎉");
      nav("/");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false); // stop loader
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
                    >
                      Register
                    </motion.h3>

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
                      <Button
                        variant="primary"
                        type="submit"
                        className="w-100"
                        style={{ backgroundColor: "#1e3c72", border: "none" }}
                        disabled={loading} // ✅ disable when loading
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

                      {/* Google Sign In */}
                      <Button
                        variant="outline-danger"
                        className="w-100 mt-3"
                        onClick={signInGoogle}
                        disabled={loading} // ✅ disable during loading
                      >
                        {loading ? "Please wait..." : "Sign up with Google"}
                      </Button>
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