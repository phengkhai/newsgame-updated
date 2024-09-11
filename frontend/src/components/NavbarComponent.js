import React, { useState, useEffect } from "react";
import { Modal, Button, Dropdown } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "../images/Logo.png";

function NavbarComponent(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { playing } = props;
  const [userData, setUserData] = useState(null);
  const [smallScreen, setSmallScreen] = useState(false);
  const [route, setRoute] = useState("");
  let history = useHistory();

  useEffect(() => {
    if (sessionStorage.getItem("userData")) {
      setUserData(JSON.parse(sessionStorage.getItem("userData")));
    }
  }, []);

  function resizeWindow() {
    if (window.innerWidth < 600) {
      setSmallScreen(true);
    } else {
      setSmallScreen(false);
    }
  }

  useEffect(() => {
    resizeWindow();
    window.addEventListener("resize", resizeWindow);

    return () => window.removeEventListener("resize", resizeWindow);
  }, []);

  function handleLogout() {
    setUserData(null);
    sessionStorage.removeItem("userData");
    history.push("/");
  }

  function handleLogoClick() {
    if (!playing) {
      history.push("/");
    } else {
      handleShow();
    }
  }

  function handleProfileClick() {
    if (!playing) {
      history.push("/profile");
    } else {
      handleShow();
    }
  }

  function handleLogoutClick() {
    if (!playing) {
      handleLogout();
    } else {
      handleShow();
    }
  }

  function changePage() {
    if (route === "logout") {
      handleLogout();
    } else {
      history.push(route);
    }
  }

  return (
    <div className={playing ? "navbar" : "navbar fixed"}>
      <div className="nav-container">
        <span
          onClick={() => (handleLogoClick(), setRoute("/"))}
          className="nav-logo"
        >
          <img src={logo} alt="logo" className="logo"></img>
        </span>
        {!smallScreen && !playing && (
          <button className="nav-item nav-play">
            <Link to="/play" className="login-link">
              PLAY NOW!
            </Link>
          </button>
        )}
        {userData ? (
          <Dropdown className="nav-login">
            <Dropdown.Toggle id="dropdown-autoclose-true">
              {userData.username}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => (handleProfileClick(), setRoute("/profile"))}
              >
                Profile
              </Dropdown.Item>
              {smallScreen && !playing && (
                <Dropdown.Item href="/play">Play Now</Dropdown.Item>
              )}
              <Dropdown.Item>
                <div
                  variant="primary"
                  onClick={() => (setRoute("logout"), handleLogoutClick())}
                >
                  Logout
                </div>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <button className="nav-item nav-play">
            <Link to="/login" className="login-link">
              LOGIN
            </Link>
          </button>
        )}
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Confirmation to Leave</Modal.Title>
        </Modal.Header>
        <Modal.Body>Note: The level will be restarted when you play it next time.</Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleClose}>
            Don't leave
          </Button>
          <Button variant="danger" onClick={changePage}>
            Confirm to leave
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default NavbarComponent;
