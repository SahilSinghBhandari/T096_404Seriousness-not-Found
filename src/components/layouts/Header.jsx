import { useEffect, useState } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, db } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Header() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState(""); 
  const nav = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserName(userSnap.data().name || "User");
          } else {
            setUserName(currentUser.displayName || "User");
          }
        } catch (err) {
          console.error("Error fetching user name:", err);
          setUserName("User");
        }
      } else {
        setUser(null);
        setUserName("");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
      nav("/login");
    } catch (err) {
      console.error(err);
      toast.error("Error logging out!");
    }
  };

  return (
    <>
      {/* ✅ Navbar */}
      <Navbar
        expand="lg"
        style={{
          background: "linear-gradient(90deg, #1e3c72, #2a5298)",
        }}
        variant="dark"
        className="shadow-sm"
      >
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-white">
            AshaDeep
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link
                as={Link}
                to="/"
                className="fw-semibold px-3 text-white nav-link-custom"
              >
                Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/donate"
                className="fw-semibold px-3 text-white nav-link-custom"
              >
                Donate
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/volunteer"
                className="fw-semibold px-3 text-white nav-link-custom"
              >
                Volunteer
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/job"
                className="fw-semibold px-3 text-white nav-link-custom"
              >
                Jobs
              </Nav.Link>

              {/* ✅ User name + Auth buttons */}
              {user ? (
                <div className="d-flex align-items-center ms-3">
                  <span className="fw-semibold text-white me-3">
                    {userName}
                  </span>
                  <Button
                    variant="outline-light"
                    size="sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  as={Link}
                  to="/login"
                  variant="outline-light"
                  size="sm"
                  className="ms-3"
                >
                  Login
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ✅ Custom Hover CSS */}
      <style>
        {`
          .nav-link-custom {
            transition: color 0.3s, transform 0.2s;
          }
          .nav-link-custom:hover {
            color: #ffd700 !important; /* gold hover */
            transform: translateY(-2px);
          }
        `}
      </style>
    </>
  );
}
