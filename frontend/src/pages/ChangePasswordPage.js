import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import NavbarComponent from "../components/NavbarComponent";

const Welcome = (props) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordNotMatch, setPasswordNotMatch] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const userID = props.match.params.userID;
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function handleSubmit(event) {
    setSubmitting(true);
    event.preventDefault();

    checkPassword().then((res) => {
      console.log(res);
      if (res[0] === "" && !res[1]) {
        axios
          .put(
            process.env.REACT_APP_BACKENDLINKHEAD + "user/changePass/" + userID,
            {
              newPassword: password,
            }
          )
          .then((response) => {
            if (response.data.status === "Failed") {
              setErrorMessage(response.data.error);
            } else {
              handleShow();
              setErrorMessage("");
            }
            setSubmitting(false);
          });
      } else {
        setSubmitting(false);
      }
    });
  }

  function checkPassword() {
    return new Promise((resolve) => {
      let bool;
      if (password !== confirmPassword) {
        bool = true;
      } else {
        bool = false;
      }
      let err = "";
      if (password.length < 8) {
        err = "Password should not be shorter than 8 characters";
      } else if (!/[a-z]/.test(password)) {
        err = "Password needs to contain at least one lowercase letter";
      } else if (!/[A-Z]/.test(password)) {
        err = "Password needs to contain at least one uppercase letter";
      } else if (!/[0-9]/.test(password)) {
        err = "Password needs to contain at least one digit";
      } else if (!/[!@#$%^&*]/.test(password)) {
        err = "Password needs to contain at least one special character";
      } else if (password.length > 20) {
        err = "Password should not be longer than 20 characters";
      } else {
        err = "";
      }
      console.log(err);
      setPasswordError(err);
      setPasswordNotMatch(bool);
      resolve([err, bool]);
    });
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
        <div>
          <Modal show={show} onHide={handleClose} animation={false} centered>
            <Modal.Header closeButton>
              <Modal.Title>Update Changes</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              You have successfully changes your password.
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          <div className="form-background">
            <div className="form-container">
              <form className="form" onSubmit={handleSubmit}>
                <h5>Change Password</h5>
                {errorMessage !== "" && (
                  <div className="change-password-error-message">
                    {errorMessage}
                  </div>
                )}
                <div className="form-inputs">
                  <label className="form-label">Password</label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="form-inputs">
                  <label className="form-label">Confirm Password</label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="Confirm Password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                {passwordNotMatch ? (
                  <div className="login-fail">Password do no match!</div>
                ) : (
                  <div className="login-fail">
                    {passwordError !== "" && (
                      <div className="change-password-error-message">
                        {passwordError}
                      </div>
                    )}
                  </div>
                )}
                <button
                  className={
                    submitting
                      ? "form-input-btn submitting-btn"
                      : "form-input-btn not-submitting-btn"
                  }
                  type="submit"
                >
                  Save
                </button>
                <div className="sign-up-link">
                  Back to <Link to="/login"> login page </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Welcome;
