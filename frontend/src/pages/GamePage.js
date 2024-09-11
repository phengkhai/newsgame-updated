import React from "react";
import UnityGameComponent from "../components/UnityGameComponent";
import NavbarComponent from "../components/NavbarComponent";

function GamePage() {
  return (
    <div>
      <NavbarComponent playing={true} />
      <UnityGameComponent />
    </div>
  );
}

export default GamePage;
