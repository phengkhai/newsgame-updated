import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import MainPage from "./pages/MainPage";
import GamePage from "./pages/GamePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import NotFoundPage from "./pages/NotFoundPage";
import Demo from "./pages/Demo";
import {
  Redirect,
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={MainPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/demo" component={Demo} />
        <Route path="/play" component={GamePage} />
        <Route path="/signup" component={SignUpPage} />
        <Route path="/forgotpassword" component={ForgotPasswordPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/changepassword/:userID" component={ChangePasswordPage} />
        <Route path="/404" component={NotFoundPage} />
        <Redirect to="/404" />
      </Switch>
    </Router>
  );
}
