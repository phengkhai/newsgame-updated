import React from "react";
import logo from "../images/Logo.png";

function Footer() {
  return (
    <div className="footer">
      <div className="nav-container">
        <div className="footer-row row centralised">
          <div className="footer-items col-lg-4 col-md-12 col-sm-12">
            <h3 className="footer-items-title">Designers: </h3>
            <div>Mr. Lau Zhen Jie </div>
            <div>Mr. Liew Zi Peng</div>
            <div>Mr. Lee Chia Zhe</div>
            <div>NTU School of Computer Science and Engineering</div>
          </div>
          <div className="footer-items col-lg-4 col-md-12 col-sm-12">
            <div className="footer-items-title">
              <img src={logo} alt="logo" className="nav-item logo"></img>
            </div>
            <p>
              Fake News Detective is part of a project funded by the Singapore
              Social Science Research Council (SSRC). Art asset pack created by
              LimeZu (limezu.itch.io). SUREvivors characters and artwork by
              National Library Board, Singapore. All rights reserved 2022.
            </p>
          </div>
          <div className="footer-items col-lg-4 col-md-12 col-sm-12">
            <h3 className="footer-items-title">Supervised by: </h3>
            <div> Dr. Edson C. Tandoc Jr.</div>
            <div>Mr. James Lee Chong Boi</div>
            <div>NTU Wee Kim Wee School of Communication and Information</div>
          </div>
        </div>
        <div className="footer-items centralised">
          <h3 className="footer-items-title">Disclaimer: </h3>
          <div>
            The story, all names, characters, and incidents in this game are
            purely fictional. Any resemblance to actual persons is purely
            coincidental.
          </div>
        </div>
        <hr></hr>
        <div className="copyright centralised">
          All Right Reserved by &copy; Fake News Detective 2021
        </div>
      </div>
    </div>
  );
}

export default Footer;
