

import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export default function PublicNavbar() {
  return (
    <Navbar bg="success" variant="dark" expand="lg" fixed="top">
      <Container>
        {/* Logo / Brand */}
        <Navbar.Brand href="#home" className="fw-bold">
          Digital Pingalwara
        </Navbar.Brand>

        {/* Toggle for Mobile */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Nav Links */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link as={NavLink} to="/urgent">Urgent Needs</Nav.Link>
            <Nav.Link href="#impact">Impact</Nav.Link>
            <Nav.Link href="#donate">Donate</Nav.Link>
            <Nav.Link href="#volunteer">Volunteer</Nav.Link>
            <Nav.Link href="#jobs">Jobs</Nav.Link>
             <NavDropdown
              title={
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="user"
                  className="rounded-circle"
                  width="32"
                  height="32"
                />
              }
              id="profile-dropdown"
              align="end"
            >
              <NavDropdown.Item href="#login">Login</NavDropdown.Item>
              <NavDropdown.Item href="#register">Register</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#profile">My Profile</NavDropdown.Item>
              <NavDropdown.Item href="#logout">Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}