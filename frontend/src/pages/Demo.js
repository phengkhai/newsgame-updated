import React, { useState, useEffect, useRef, useMemo } from "react";
import Unity, { UnityContext } from "react-unity-webgl";
import QuizComponent from "../components/QuizComponent";
import Modal from "react-bootstrap/Modal";
import ProgressBar from "react-bootstrap/ProgressBar";
import { ScoreContext } from "../Context/ScoreContext";

const unityContext = new UnityContext({
  loaderUrl: "demo-build/myunityapp.loader.js",
  dataUrl: "demo-build/myunityapp.data",
  frameworkUrl: "demo-build/myunityapp.framework.js",
  codeUrl: "demo-build/myunityapp.wasm",
});
window.u = unityContext;

function Demo() {
  const [modalShow1, setModalShow1] = useState(false);
  const [modalShow2, setModalShow2] = useState(false);
  const childRefEasy5 = useRef();
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const userData = JSON.parse(sessionStorage.getItem("userData"));

  const [easyScore, setEasyScore] = useState(0);
  const [mediumScore, setMediumScore] = useState(0);
  const [hardScore, setHardScore] = useState(0);
  const [answeredQuestionsArray, setAnsweredQuestionsArray] = useState([]);
  const [easyArray, setEasyArray] = useState([1, 2]);
  const [mediumArray, setMediumArray] = useState([1, 2]);
  const [hardArray, setHardArray] = useState([1, 2]);
  const value = useMemo(
    () => ({
      easyScore,
      setEasyScore,
      mediumScore,
      setMediumScore,
      hardScore,
      setHardScore,
      easyArray,
      setEasyArray,
      mediumArray,
      setMediumArray,
      hardArray,
      setHardArray,
      answeredQuestionsArray,
      setAnsweredQuestionsArray,
    }),
    [
      easyScore,
      setEasyScore,
      mediumScore,
      setMediumScore,
      hardScore,
      setHardScore,
      easyArray,
      setEasyArray,
      mediumArray,
      setMediumArray,
      hardArray,
      setHardArray,
      answeredQuestionsArray,
      setAnsweredQuestionsArray,
    ]
  );

  unityContext.on("StartReactNewsQuestions", function (difficulty, questions) {
    console.log(difficulty, questions);
    if (questions === 5) setModalShow1(true);
    else setModalShow2(true);
  });

  unityContext.on("GameEnded", function (message) {
    // restartEasyFunction();
    // restartMediumFunction();
    // restartHardFunction();
    // if (userData === null) {
    //   console.log("Game Ended");
    //   handleShow();
    // } else {
    //   console.log("Game ended");
    // }
  });

  unityContext.on("GameStarted", function (message) {
    console.log(message);
    //paste your code here
    if (userData === null || userData.level === null) {
      console.log("No user data/level.");
    } else {
      //min magic
      unityContext.send(
        "ReactAgent",
        "SetPlayerPrefsLevel",
        Math.min(userData.level + 1, 3)
      );

      console.log(userData.level);
      console.log("got user data when game started");
    }
  });

  unityContext.on("RestartLevel", function (level) {
    console.log("restarting from unity...");
    console.log(level);
    // if (level === "easy") {
    //   restartEasyFunction();
    // } else if (level === "medium") {
    //   restartMediumFunction();
    // } else if (level === "hard") {
    //   restartHardFunction();
    // }
  });

  function LoadingModal() {
    const [progression, setProgression] = useState(0);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    useEffect(() => {
      if (progression >= 1) {
        handleClose();
      }
    }, [progression]);
    unityContext.on("progress", (progression) => {
      setProgression(progression);
      if (progression < 1) setShow(true);
    });
    return (
      <div>
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header>Loading...</Modal.Header>
          <Modal.Body>
            <ProgressBar
              animated
              now={progression * 100}
              label={`${Math.round(progression * 100)}%`}
            />
          </Modal.Body>
        </Modal>
      </div>
    );
  }

  useEffect(() => {
    let el = document.querySelector(".unity-content");
    if (el) {
      el.height = (el.width * 9) / 16;
    }
  }, []);

  return (
    <>
      <LoadingModal show={false}></LoadingModal>
      <ScoreContext.Provider value={value}>
        <div className="unity-flex-container">
          <Unity unityContext={unityContext} className="unity-content" />
        </div>
        <QuizComponent
          ref={childRefEasy5}
          difficulty="easy"
          questionCount={1}
          modalShow={modalShow1}
          setModalShow={setModalShow1}
          onHide={() => setModalShow1(false)}
          unityContext={unityContext}
          style={{ height: "1100px" }}
          volume={volume}
          isFullScreen={isFullscreen}
        />
        <QuizComponent
          ref={childRefEasy5}
          difficulty="easy"
          questionCount={1}
          modalShow={modalShow2}
          setModalShow={setModalShow1}
          onHide={() => setModalShow1(false)}
          unityContext={unityContext}
          style={{ height: "1100px" }}
          volume={volume}
          isFullScreen={isFullscreen}
        />
      </ScoreContext.Provider>
    </>
  );
}

export default Demo;
