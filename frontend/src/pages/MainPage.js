import React from "react";
import LeaderboardComponent from "../components/LeaderboardComponent";
import NavbarComponent from "../components/NavbarComponent";
import PlayForFreeComponent from "../components/PlayForFreeComponent";
import ObjectiveComponent from "../components/ObjectiveComponent";
import Footer from "../components/Footer";
import SlickSliderComponent from "../components/SlickSliderComponent";
import VideoComponent from "../components/VideoComponent";
import dotenv from "dotenv";

dotenv.config();

function MainPage() {
  return (
    <div className="main-page">
      <NavbarComponent />
      <div className="empty-space"></div>
      <VideoComponent />
      <ObjectiveComponent />
      <SlickSliderComponent />
      <LeaderboardComponent />
      <PlayForFreeComponent />
      <Footer />
      {/* <div></div> */}
    </div>
  );
}

export default MainPage;
