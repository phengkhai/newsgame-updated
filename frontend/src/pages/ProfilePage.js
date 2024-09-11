import React, { useState, useEffect } from "react";
import NavbarComponent from "../components/NavbarComponent";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";
import CryptoJS from "crypto-js";
import jwt_decode from "jwt-decode";

function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [userID, setUserID] = useState("");
  const [toggleState, setToggleState] = useState(1);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [oldPasswordEmpty, setOldPasswordEmpty] = useState(false);
  const [passwordNotMatch, setPasswordNotMatch] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [show, setShow] = useState(false);
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const [easyScore, setEasyScore] = useState("");
  const [mediumScore, setMediumScore] = useState("");
  const [hardScore, setHardScore] = useState("");
  const [totalScore, setTotalScore] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  useEffect(() => {
    if (sessionStorage.getItem("userData") !== null) {
      const userData = JSON.parse(sessionStorage.getItem("userData"));
      setUserData(JSON.parse(sessionStorage.getItem("userData")));
      setUserID(JSON.parse(sessionStorage.getItem("userData")).userID);
      const UID = JSON.parse(sessionStorage.getItem("userData")).userID;
      const secretKey = process.env.REACT_APP_CIPHER_SECRETKEY;
      const encryptedToken = JSON.parse(sessionStorage.getItem("token"));
      var bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
      var token = bytes.toString(CryptoJS.enc.Utf8);
      const refreshToken = JSON.parse(sessionStorage.getItem("refreshToken"));
      if (jwt_decode(token).exp < new Date().getTime() / 1000) {
        axios({
          method: "post",
          url: process.env.REACT_APP_BACKENDLINKHEAD + "user/refreshTok",
          data: {
            username: userData.username,
          },
          headers: {
            "Content-Type": "application/json",
            "auth-token": refreshToken,
          },
        }).then((res) => {
          const cipherToken = CryptoJS.AES.encrypt(
            res.data.token,
            secretKey
          ).toString();
          sessionStorage.setItem("token", JSON.stringify(cipherToken));
          axios({
            method: "get",
            url: process.env.REACT_APP_BACKENDLINKHEAD + "user/getScore/" + UID,
            headers: {
              "Content-Type": "application/json",
              "auth-token": res.data.token,
            },
          }).then(
            (res) => (
              setEasyScore(res.data.easyScores),
              setMediumScore(res.data.mediumScores),
              setHardScore(res.data.hardScores),
              setTotalScore(res.data.totalScores)
            )
          );
          return;
        });
      } else {
        axios({
          method: "get",
          url: process.env.REACT_APP_BACKENDLINKHEAD + "user/getScore/" + UID,
          headers: { "Content-Type": "application/json", "auth-token": token },
        }).then(
          (res) => (
            setEasyScore(res.data.easyScores),
            setMediumScore(res.data.mediumScores),
            setHardScore(res.data.hardScores),
            setTotalScore(res.data.totalScores)
          )
        );
      }
    } else {
      setNotLoggedIn(true);
    }
  }, []);

  function handleSave() {
    setSubmitting(true);
    // if (oldPassword.length === 0) {
    //   setOldPasswordEmpty(true);
    // } else {
    //   setOldPasswordEmpty(false);
    // }

    if (newPassword !== confirmPassword) {
      setPasswordNotMatch(true);
    } else {
      setPasswordNotMatch(false);
    }

    if (newPassword.length < 8) {
      setPasswordError("Password should not be shorter than 8 characters");
    } else if (!/[a-z]/.test(newPassword)) {
      setPasswordError(
        "Password needs to contain at least one lowercase letter"
      );
    } else if (!/[A-Z]/.test(newPassword)) {
      setPasswordError(
        "Password needs to contain at least one uppercase letter"
      );
    } else if (!/[0-9]/.test(newPassword)) {
      setPasswordError("Password needs to contain at least one digit");
    } else if (!/[!@#$%^&*]/.test(newPassword)) {
      setPasswordError(
        "Password needs to contain at least one special character"
      );
    } else if (newPassword.length > 20) {
      setPasswordError("Password should not be longer than 20 characters");
    } else {
      setPasswordError("");
    }

    if (passwordError ==="" && !passwordNotMatch ) {
      console.log("here")
      axios
        .put(
          process.env.REACT_APP_BACKENDLINKHEAD +
            "user/loggedin/changePass/" +
            userID,
          {
            oldPass: oldPassword,
            newPass: newPassword,
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
  }

  return (
    <div>
      <Modal show={show} onHide={handleClose} animation={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Changes</Modal.Title>
        </Modal.Header>
        <Modal.Body>You have successfully changes your password.</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <NavbarComponent />
      {notLoggedIn ? (
        <div className="form-background">
          <div className="form-container">
            <div className="form">
              <h5>Please Login</h5>
            </div>
            <div className="form-success">
              <Link to="/login">Go to login page.</Link>
            </div>
          </div>
        </div>
      ) : (
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
          <div
            className="tab-container"
            style={{ zIndex: "1 !important", position: "relative" }}
          >
            {/* <div className="bloc-tabs">
              <button
                className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
                onClick={() => toggleTab(1)}
              >
                My Profile
              </button>
              <button
                className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
                onClick={() => toggleTab(2)}
              >
                <div>Change</div>
                <div>Password</div>
              </button>
            </div> */}
            <div className="content-tabs">
              <div
                className={
                  toggleState === 1 ? "content  active-content" : "content"
                }
              >
                <div className="profile-container">
                  <h3>My Profile</h3>
                  {userData === null ? (
                    <div></div>
                  ) : (
                    <div>
                      <div className="row">
                        <div className="col-12 col-lg-9 col-md-8">
                          <div className="row">
                            <label className="col-6">Username :</label>
                            <div className="col-6">{userData.username}</div>
                            <label className="col-6">Easy Score :</label>
                            <div className="col-6">{easyScore}</div>
                            <label className="col-6">Medium Score :</label>
                            <div className="col-6">{mediumScore}</div>
                            <label className="col-6">Hard Score :</label>
                            <div className="col-6">{hardScore}</div>
                            <label className="col-6">Total Score :</label>
                            <div className="col-6">{totalScore}</div>
                          </div>
                        </div>
                      </div>
                      <FacebookShareButton
                        url="https://fakenewsdetective.com/#/"
                        quote={
                          "Save the world by taking the adventure to defeat the fake news boss today!"
                        }
                        hashtag="#FakeNewsDetective"
                      >
                        <FacebookIcon
                          logoFillColor="white"
                          style={{ width: "40px", height: "40px" }}
                        ></FacebookIcon>
                      </FacebookShareButton>
                      <TwitterShareButton
                        url="https://fakenewsdetective.com/#/"
                        quote={
                          "Save the world by taking the adventure to defeat the fake news boss today!"
                        }
                        hashtag="#FakeNewsDetective"
                      >
                        <TwitterIcon
                          logoFillColor="white"
                          style={{ width: "40px", height: "40px" }}
                        />
                      </TwitterShareButton>
                      <WhatsappShareButton
                        url="https://fakenewsdetective.com/#/"
                        quote={
                          "Save the world by taking the adventure to defeat the fake news boss today!"
                        }
                        hashtag="#FakeNewsDetective"
                      >
                        <WhatsappIcon
                          logoFillColor="white"
                          style={{ width: "40px", height: "40px" }}
                        />
                      </WhatsappShareButton>
                    </div>
                  )}
                </div>
              </div>

              {/* <div
                className={
                  toggleState === 2 ? "content  active-content" : "content"
                }
              >
                <h5>Change Password</h5>
                {passwordError ==="" &&
                  // !oldPasswordEmpty &&
                  errorMessage !== "" && (
                    <div className="change-password-error-message">
                      {errorMessage}
                    </div>
                  )}
                <div>
                  <label className="form-label">Current Password: </label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="Current Password"
                    name="password"
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                  <Link to="/forgotpassword">Forgot Password?</Link>
                </div>
                <div>
                  <label className="form-label">New Password: </label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="New Password"
                    name="password"
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Confirm Password: </label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="Confirm Password"
                    name="password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                {passwordNotMatch ? (
                  <div className="change-password-error-message">
                    Password do no match!
                  </div>
                ) : (
                  <div>
                    {passwordError && (
                      <div className="change-password-error-message">
                        {passwordError}
                      </div>
                    )}
                  </div>
                )}
                <button
                  className={
                    submitting
                      ? "change-password-save-button cpsb-submitting"
                      : "change-password-save-button cpsb-not-submitting"
                  }
                  onClick={() => handleSave()}
                >
                  Save
                </button>
              </div> */}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default ProfilePage;
