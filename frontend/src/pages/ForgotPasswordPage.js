import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import axios from "axios";
import NavbarComponent from "../components/NavbarComponent";

function ForgotPasswordPage() {
  const [modalShow, setModalShow] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    if (email === "") {
      setError("Email must not be blank");
    } else {
      setSubmitting(true);
      axios
        .get(
          process.env.REACT_APP_BACKENDLINKHEAD + "user/reqChangePass/" + email
        )
        .then((res) => {
          setSubmitting(false);
          if (res.data.status === "Failed") {
            setError(res.data.message);
          } else {
            setError(false);
            setModalShow(true);
          }
        });
    }
  }

  return (
    <div>
      <NavbarComponent />
      <section class="area">
        <ul class="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <div className="form-background">
          <div className="form-container">
            <div>
              <form className="form" onSubmit={handleSubmit}>
                <h5>
                  Please enter your email address below and we'll email you
                  instructions to reset it
                </h5>
                <div className="form-inputs">
                  <label className="form-label">Email</label>
                  <input
                    className="form-input"
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {error && <div className="login-fail">{error}</div>}
                <button
                  className={
                    submitting
                      ? "form-input-btn submitting-btn"
                      : "form-input-btn not-submitting-btn"
                  }
                  type="submit"
                >
                  Send Code
                </button>
                <div className="sign-up-link">
                  Back to <Link to="/login"> login page </Link>
                </div>
              </form>
            </div>
            <PopupMessage show={modalShow} onHide={() => setModalShow(false)} />
          </div>
        </div>
      </section>
    </div>
  );
}

function PopupMessage(props) {
  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header>
        <h2>Email Sent</h2>
      </Modal.Header>
      <Modal.Body>
        <p className="forgot-password-text">
          Please check your email to change your password
        </p>
        <button className="forgot-password-button" onClick={props.onHide}>
          OK
        </button>
      </Modal.Body>
    </Modal>
  );
}

export default ForgotPasswordPage;
