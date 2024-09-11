import React from "react";
import NavbarComponent from "../components/NavbarComponent";
import sarah from "../images/NLB Fake News Busters Characters_Sarah.png";

function NotFoundPage() {
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
        <div className="page-not-found-container">
          <p>Page not found!</p>
        </div>
      </section>
    </div>
  );
}

export default NotFoundPage;
