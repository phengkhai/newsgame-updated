import React from "react";
import TestVideo from "../video/web_game_trailer.mov";

function HomeGameComponent() {
  return (
    <div className="video-container">
      <video autoPlay muted loop className="video-style">
        <source src={TestVideo} type="video/mp4" />
        <source src={TestVideo} type="video/ogg" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default HomeGameComponent;
