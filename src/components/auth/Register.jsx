import ReactModal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "20px",
    borderRadius: "12px",
    width: "400px",
  },
};

export default function Register({ isOpen, onClose }) {
  return (
    <ReactModal isOpen={isOpen} onRequestClose={onClose} style={customStyles}>
      <h2>Register</h2>
      <form>
        <input
          type="text"
          placeholder="Full Name"
          className="form-control mb-2"
        />
        <input type="email" placeholder="Email" className="form-control mb-2" />
        <input
          type="password"
          placeholder="Password"
          className="form-control mb-2"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="form-control mb-3"
        />
        <button type="submit" className="btn btn-success w-100 mb-2">
          Register
        </button>
      </form>
      <button className="btn btn-secondary w-100" onClick={onClose}>
        Close
      </button>
    </ReactModal>
  );
}