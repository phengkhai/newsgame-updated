import React from "react";
import { Link } from "react-router-dom";

function PlayForFreeComponent() {
  return (
    <div className="play-for-free-container">
      <div className="play-for-free-now">
        <div>
          <div className="play-for-free-content">
            <div className="text-effect">
              <div className="play-for-free-text" data-text="Neon">
                Play For Free Today!
              </div>
              <div className="spotlight"></div>
            </div>
            <div className="play-for-free-note">
              This version can only be played in a desktop or laptop as it
              requires the use of arrow keys.
            </div>
            <button className="play-for-free-button">
              <Link to="/play" className="login-link">
                PLAY NOW!
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayForFreeComponent;
