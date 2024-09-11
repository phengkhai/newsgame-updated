import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function SignUpWithUsername() {
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setErrors(validate(userName, password, confirmPassword));

    if (
      Object.keys(validate(userName, password, confirmPassword)).length === 0
    ) {
      console.log(errors);
      setIsSubmitting(true);
    }
  };

  useEffect(() => {
    if (isSubmitting === true) {
      console.log("Submitting..");
      axios
        .post(process.env.REACT_APP_BACKENDLINKHEAD + "user/signup ", {
          username: userName.toLowerCase(),
          password: password,
        })
        .then((res) => {
          setIsSubmitting(false);
          console.log(res.status);
          if (res.data.status === "Failed") {
            console.log("Error in submitting...");
            setBackendError(res.data.message);
          } else {
            console.log("Submitted");
            setIsSubmitted(true);
          }
        });
    }
  }, [isSubmitting]);

  function validate(username, password, confirmPassword) {
    let errors = {};

    if (username.length === 0) {
      errors.username = "Username required";
    } else if (!/^[A-Za-z]+/.test(username.trim())) {
      errors.username = "Enter a valid name";
    } else if (/\s/.test(username.trim())) {
      errors.username = "Please enter a username without whitespace";
    } else if (username.length < 6) {
      errors.username = "Please enter a username with at least 6 characters";
    } else if (username.length > 12) {
      errors.username = "Please enter a username with at most 12 characters";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password needs to be 8 characters or more";
    } else if (!/[a-z]/.test(password)) {
      errors.password =
        "Password needs to contain at least one lowercase letter";
    } else if (!/[A-Z]/.test(password)) {
      errors.password =
        "Password needs to contain at least one uppercase letter";
    } else if (!/[0-9]/.test(password)) {
      errors.password = "Password needs to contain at least one digit";
    } else if (!/[!@#$%^&*]/.test(password)) {
      errors.password =
        "Password needs to contain at least one special character";
    } else if (password.length > 20) {
      errors.password = "Password should not be longer than 20 characters";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Password is required";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match";
    }
    return errors;
  }

  return (
    <>
      {isSubmitted ? (
        <div className="form">
          <h5>We have received your request!</h5>
          <p className="form-success">You may login now.</p>
          <div className="form-success">
            <Link to="/login">Back to login page.</Link>
          </div>
        </div>
      ) : (
        <div>
          <form onSubmit={handleSubmit} className="form">
            <h5>Create a new account.</h5>
            <div className="form-inputs">
              <label className="form-label">Username</label>
              <input
                className="form-input"
                type="text"
                name="username"
                placeholder="Enter your username"
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value.toLowerCase());
                }}
              />
              {errors.username && <p>{errors.username}</p>}
            </div>
            <div className="form-inputs">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              {errors.password && <p>{errors.password}</p>}
            </div>
            <div className="form-inputs">
              <label className="form-label">Confirm Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
              {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
            </div>
            {backendError && <div className="login-fail">{backendError}</div>}
            <button
              className={
                isSubmitting
                  ? "form-input-btn submitting-btn"
                  : "form-input-btn not-submitting-btn"
              }
              type="submit"
            >
              Sign up
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default SignUpWithUsername;
