import { useState } from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import ReactModal from "react-modal";
import { Link } from "react-router-dom";

// Modal Styles
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export default function AppNavbar() {
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
   const signInGoogle=()=>
    {
      let provider=new GoogleAuthProvider()
      signInWithPopup(auth , provider)
      .then((userCred)=>
      {
        console.log(userCred.user.uid)
        toast.success("Login Successfully")
        nav("/")
      })
      .catch((error)=>
      {
        toast.error(error.message)
      })
    }
  return (
    <>
      {/* ✅ Navbar */}
      <Navbar bg="success" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">Digital Pingalwara</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/about">About</Nav.Link>
              <Nav.Link href="/urgent">Urgent Needs</Nav.Link>
              <Nav.Link href="/impact">Impact</Nav.Link>
              <Nav.Link href="/donate">Donate</Nav.Link>
              <Nav.Link href="/volunteer">Volunteer</Nav.Link>
              <Nav.Link href="/jobs">Jobs</Nav.Link>

              {/* ✅ Profile Icon Dropdown */}
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
                <NavDropdown.Item onClick={openModal}>Login</NavDropdown.Item>
                <NavDropdown.Item>Register</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item>My Profile</NavDropdown.Item>
                <NavDropdown.Item>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ✅ Login Modal */}
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Login Modal"
      >
        <h2>Login</h2>
        <form>
          <label>Email</label>
          <input type="text" className="form-control" /><br/>
          <label>Password</label>
          <input type="password" className="form-control" />
          <button type="submit" className="btn btn-primary my-2">Login</button><br/>
          <button onClick={signInGoogle} className="btn btn-danger"><i class="bi bi-google">Sign With Google</i></button>
          <div>Don't Have Any Account?<Link to={"/register"}>Register Here </Link></div>
        </form>
      </ReactModal>
    </>
  );
}