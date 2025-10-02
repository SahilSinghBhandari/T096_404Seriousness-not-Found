import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Header() {
  
  return (
    <>
      {/* ✅ Navbar */}
      <Navbar bg="success" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Digital Pingalwara</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {/* <Nav.Link as={Link} to="/">Home</Nav.Link> */}
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              {/* <Nav.Link as={Link} to="/urgent">Urgent Needs</Nav.Link> */}
              {/* <Nav.Link as={Link} to="/impact">Impact</Nav.Link> */}
              <Nav.Link as={Link} to="/donate">Donate</Nav.Link>
              <Nav.Link as={Link} to="/volunteer">Volunteer</Nav.Link>
              <Nav.Link as={Link} to="/jobs">Jobs</Nav.Link>

              {/* ✅ Profile Dropdown */}
              <NavDropdown
                title={
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    alt="profile"
                    width="30"
                    height="30"
                    style={{ borderRadius: "50%" }}
                  />
                }
                id="profile-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/login">
                  Login
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/register">
                  Register
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/profile">
                  My Profile
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => toast.info("Logged out!")}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}