import React from "react";
import SignUpWithUsername from "../components/SignUpWithUsername";
import NavbarComponent from "../components/NavbarComponent";

const Form = () => {
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
            <SignUpWithUsername />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Form;
