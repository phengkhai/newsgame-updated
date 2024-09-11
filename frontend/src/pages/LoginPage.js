import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useHistory } from "react-router-dom";
import CryptoJS from "crypto-js";
import NavbarComponent from "../components/NavbarComponent";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showLoginError, setShowLoginError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  let history = useHistory();

  function handleSubmit(event) {
    setSubmitting(true);
    event.preventDefault();
    axios
      .post(process.env.REACT_APP_BACKENDLINKHEAD + "user/signin", {
        username: username,
        password: password,
      })
      .then((res) => {
        if (res.data.status === "Failed") {
          setShowLoginError(true);
          setErrorMessage(res.data.message);
        } else {
          const tokenSecretKey = process.env.REACT_APP_CIPHER_SECRETKEY;
          const cipherToken = CryptoJS.AES.encrypt(
            res.data.token,
            tokenSecretKey
          ).toString();
          sessionStorage.setItem("userData", JSON.stringify(res.data.user));
          sessionStorage.setItem("token", JSON.stringify(cipherToken));
          sessionStorage.setItem(
            "refreshToken",
            JSON.stringify(res.data.refreshToken)
          );
          if (
            JSON.parse(sessionStorage.getItem("easyScore")) ||
            JSON.parse(sessionStorage.getItem("mediumScore")) ||
            JSON.parse(sessionStorage.getItem("hardScore"))
          ) {
            const secretKey = process.env.REACT_APP_CIPHER_SECRETKEY;
            var cipherEasyScore = CryptoJS.AES.encrypt(
              sessionStorage.getItem("easyScore"),
              secretKey
            ).toString();
            var cipherMediumScore = CryptoJS.AES.encrypt(
              sessionStorage.getItem("mediumScore"),
              secretKey
            ).toString();
            var cipherHardScore = CryptoJS.AES.encrypt(
              sessionStorage.getItem("hardScore"),
              secretKey
            ).toString();
            axios({
              method: "put",
              url: process.env.REACT_APP_BACKENDLINKHEAD + "user/score/easy",
              data: {
                userID: res.data.user.userID,
                newScore: cipherEasyScore,
              },
              headers: {
                "Content-Type": "application/json",
                "auth-token": res.data.token,
              },
            }).then((response) => {
              axios({
                method: "put",
                url:
                  process.env.REACT_APP_BACKENDLINKHEAD + "user/score/medium",
                data: {
                  userID: res.data.user.userID,
                  newScore: cipherMediumScore,
                },
                headers: {
                  "Content-Type": "application/json",
                  "auth-token": res.data.token,
                },
              }).then((response) => {
                axios({
                  method: "put",
                  url:
                    process.env.REACT_APP_BACKENDLINKHEAD + "user/score/hard",
                  data: {
                    userID: res.data.user.userID,
                    newScore: cipherHardScore,
                  },
                  headers: {
                    "Content-Type": "application/json",
                    "auth-token": res.data.token,
                  },
                }).then((response) => {
                  sessionStorage.removeItem("easyScore");
                  sessionStorage.removeItem("mediumScore");
                  sessionStorage.removeItem("hardScore");
                });
              });
            });
          }
          history.push("/");
        }
        setSubmitting(false);
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
        <div className="form-container">
          <div>
            <form className="form" onSubmit={handleSubmit}>
              <h5>Welcome Back</h5>
              <div className="form-inputs">
                <label className="form-label">Username</label>
                <input
                  className="form-input"
                  id="first-name"
                  type="text"
                  placeholder="Username"
                  name="firstName"
                  value={username}
                  onChange={(e) => (setUsername(e.target.value.toLowerCase()), console.log(e.target.value.toLowerCase()))}
                />
              </div>
              <div className="form-inputs">
                <label className="form-label">Password</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {showLoginError && (
                <div className="login-fail">{errorMessage}</div>
              )}
              <button
                className={
                  submitting
                    ? "form-input-btn submitting-btn"
                    : "form-input-btn not-submitting-btn"
                }
                type="submit"
              >
                Login
              </button>
              <div className="sign-up-link">
                No account? <Link to="/signup"> Sign up </Link> now
              </div>
              {/* <div className="forgot-password-link">
                <Link to="/forgotpassword">Forgot Password</Link>
              </div> */}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
