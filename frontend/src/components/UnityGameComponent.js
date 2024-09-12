import React, { useState, useMemo, useRef, useEffect } from "react";
import Unity, { UnityContext } from "react-unity-webgl";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import QuizComponent from "../components/QuizComponent";
import QuizAnswered from "../components/QuizAnswered";
import { ScoreContext } from "../Context/ScoreContext";
import ProgressBar from "react-bootstrap/ProgressBar";
import axios from "axios";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
});
window.u = unityContext;

function LoadingModal(props) {
    const {progression}=props
    // const [progression, setProgression] = useState(0);
    const [show, setShow] = useState(true);
    const handleClose = () => setShow(false);

    useEffect(() => {
      if (progression >= 1) {
        handleClose();
      }
    }, [progression]);
    
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
  
const UnityGameComponent = () => {
  const childRefEasy10 = useRef();
  const childRefEasy5 = useRef();
  const childRefMedium10 = useRef();
  const childRefMedium5 = useRef();
  const childRefHard10 = useRef();
  const childRefHard5 = useRef();
  const [show, setShow] = useState(false);
  const [answeredModalShow, setAnsweredModalShow] = React.useState(false);
  const [modalShow1, setModalShow1] = useState(false);
  const [modalShow2, setModalShow2] = useState(false);

  const [modalShow3, setModalShow3] = useState(false);

  const [modalShow4, setModalShow4] = useState(false);

  const [modalShow5, setModalShow5] = useState(false);

  const [modalShow6, setModalShow6] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [easyScore, setEasyScore] = useState(0);
  const [mediumScore, setMediumScore] = useState(0);
  const [hardScore, setHardScore] = useState(0);
  const [answeredQuestionsArray, setAnsweredQuestionsArray] = useState([]);
  const [volume, setVolume] = useState(1);
  const [easyArray, setEasyArray] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
  ]);
  const [mediumArray, setMediumArray] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
  ]);
  const [hardArray, setHardArray] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
  ]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const bossLevelQuestionsCount = 6;
  const normalLevelQuestionsCount = 3;
  const totalQuestionsCount = 9;
  const userData = JSON.parse(sessionStorage.getItem("userData"));
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
      const [progression, setProgression] = useState(0);

  unityContext.on("progress", (progression) => {
    setProgression(progression);
    // if (progression < 1) setShow(true);
  });  

  unityContext.on("StartReactNewsQuestions", function (difficulty, questions) {
    if (difficulty === "easy") {
      if (questions === 5) {
        setModalShow1(true);
      } else {
        setModalShow2(true);
      }
    } else if (difficulty === "medium") {
      if (questions === 5) {
        setModalShow3(true);
      } else {
        setModalShow4(true);
      }
    } else if (difficulty === "hard") {
      if (questions === 5) {
        setModalShow5(true);
      } else {
        setModalShow6(true);
      }
    }
  });

  unityContext.on("GameEnded", function (message) {
    restartEasyFunction();
    restartMediumFunction();
    restartHardFunction();
    if (userData === null) {
      console.log("Game Ended");
      handleShow();
    } else {
      console.log("Game ended");
    }
  });

  //If recieve fail message, call this to restart quiz
  function restartEasyFunction() {
    childRefEasy5.current.restart();
    childRefEasy10.current.restart();
    answeredQuestionsArray.splice(-totalQuestionsCount);
  }

  function restartMediumFunction() {
    childRefMedium5.current.restart();
    childRefMedium10.current.restart();
    answeredQuestionsArray.splice(-totalQuestionsCount);
  }

  function restartHardFunction() {
    childRefHard5.current.restart();
    childRefHard10.current.restart();
    answeredQuestionsArray.splice(-totalQuestionsCount);
  }

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
    if (level === "easy") {
      restartEasyFunction();
    } else if (level === "medium") {
      restartMediumFunction();
    } else if (level === "hard") {
      restartHardFunction();
    }
  });

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_BACKENDLINKHEAD + "totalCountNews/easy")
      .then((response) => {
        const arr = [];
        for (let i = 1; i < response.data.newsTotalCount + 1; i++) {
          arr.push(i);
        }
        setEasyArray(arr);
      });
    axios
      .get(process.env.REACT_APP_BACKENDLINKHEAD + "totalCountNews/medium")
      .then((response) => {
        const arr = [];
        for (let i = 1; i < response.data.newsTotalCount + 1; i++) {
          arr.push(i);
        }
        setMediumArray(arr);
      });
    axios
      .get(process.env.REACT_APP_BACKENDLINKHEAD + "totalCountNews/hard")
      .then((response) => {
        const arr = [];
        for (let i = 1; i < response.data.newsTotalCount + 1; i++) {
          arr.push(i);
        }
        setHardArray(arr);
      });
  }, []);

  useEffect(() => {
    let el = document.querySelector(".unity-content");
    if (el) {
      el.height = (el.width * 9) / 16;
    }
  }, []);

  unityContext.on("PlayerHasReachedLevel", function (level) {
    if (userData === null || userData.level === null) {
      //TODO:store level in sessionStorage, then send it together with the score after login

      console.log("No user data/level. not important");
    } else {
      //TODO:post request to change level if current level<the new level
      if (userData.level < level) {
        userData.level = level - 1;
        sessionStorage.setItem("userData", JSON.stringify(userData));
      }
      console.log("got user data when player reached level");
    }
  });

  unityContext.on("SetSoundVolume", function (newVolume) {
    console.log("react received: ", newVolume);
    setVolume(newVolume);
  });

  unityContext.on("ShowPastAnsweredQuestions", function (message) {
    //temporary exit fullscreen
    if (isFullscreen) {
      unityContext.setFullscreen(false);
    }
    setAnsweredModalShow(true);
  });

  unityContext.on("SetFullScreen", function (isFullScreen) {
    console.log(isFullScreen);
    if (isFullScreen === 1) {
      unityContext.setFullscreen(true);
      setIsFullscreen(true);
    } else {
      unityContext.setFullscreen(false);
      setIsFullscreen(false);
    }
  });

  useEffect(() => {
    if (document.addEventListener) {
      document.addEventListener("fullscreenchange", exitHandler, false);
      document.addEventListener("mozfullscreenchange", exitHandler, false);
      document.addEventListener("MSFullscreenChange", exitHandler, false);
      document.addEventListener("webkitfullscreenchange", exitHandler, false);
    }

    function exitHandler() {
      if (
        !document.webkitIsFullScreen &&
        !document.mozFullScreen &&
        !document.msFullscreenElement
      ) {
        // Run code on exit
        console.log("close");
        setIsFullscreen(false);
        unityContext.send("ReactAgent", "SetFullScreenToggleOff");
      }
    }
    return () => {
      document.removeEventListener("fullscreenchange", exitHandler, false);
      document.removeEventListener("mozfullscreenchange", exitHandler, false);
      document.removeEventListener("MSFullscreenChange", exitHandler, false);
      document.removeEventListener(
        "webkitfullscreenchange",
        exitHandler,
        false
      );
    };
  }, []);

  return (
    <>
      <div>
        <LoadingModal show={false} progression={progression}></LoadingModal>

        <ScoreContext.Provider value={value}>
          <Modal show={show} onHide={handleClose} centered animation={false}>
            <Modal.Body>
              <h5>
                We noticed that you haven't login yet. Please login to save your
                score.
              </h5>
            </Modal.Body>
            <Modal.Footer>
              <button className="after-game-button">
                <Link
                  style={{ textDecoration: "none", color: "black" }}
                  to="/login"
                >
                  Login Now
                </Link>
              </button>
              <button className="after-game-button" onClick={handleClose}>
                Not Now
              </button>
            </Modal.Footer>
          </Modal>
          <div className="unity-flex-container">
            <Unity unityContext={unityContext} className="unity-content" />
          </div>
          <QuizComponent
            ref={childRefEasy10}
            difficulty="easy"
            questionCount={bossLevelQuestionsCount}
            modalShow={modalShow2}
            setModalShow={setModalShow2}
            onHide={() => setModalShow2(false)}
            unityContext={unityContext}
            style={{ height: "1100px" }}
            volume={volume}
            isFullScreen={isFullscreen}
          />
          <QuizComponent
            ref={childRefEasy5}
            difficulty="easy"
            questionCount={normalLevelQuestionsCount}
            modalShow={modalShow1}
            setModalShow={setModalShow1}
            onHide={() => setModalShow1(false)}
            unityContext={unityContext}
            style={{ height: "1100px" }}
            volume={volume}
            isFullScreen={isFullscreen}
          />
          <QuizComponent
            ref={childRefMedium10}
            difficulty="medium"
            questionCount={bossLevelQuestionsCount}
            modalShow={modalShow4}
            setModalShow={setModalShow4}
            onHide={() => setModalShow4(false)}
            unityContext={unityContext}
            style={{ height: "1100px" }}
            volume={volume}
            isFullScreen={isFullscreen}
          />
          <QuizComponent
            ref={childRefMedium5}
            difficulty="medium"
            questionCount={normalLevelQuestionsCount}
            modalShow={modalShow3}
            setModalShow={setModalShow3}
            onHide={() => setModalShow3(false)}
            unityContext={unityContext}
            style={{ height: "1100px" }}
            volume={volume}
            isFullScreen={isFullscreen}
          />
          <QuizComponent
            ref={childRefHard10}
            difficulty="hard"
            questionCount={bossLevelQuestionsCount}
            modalShow={modalShow6}
            setModalShow={setModalShow6}
            onHide={() => setModalShow6(false)}
            unityContext={unityContext}
            style={{ height: "1100px" }}
            volume={volume}
            isFullScreen={isFullscreen}
          />
          <QuizComponent
            ref={childRefHard5}
            difficulty="hard"
            questionCount={normalLevelQuestionsCount}
            modalShow={modalShow5}
            setModalShow={setModalShow5}
            onHide={() => setModalShow5(false)}
            unityContext={unityContext}
            style={{ height: "1100px" }}
            volume={volume}
            isFullScreen={isFullscreen}
          />
          <QuizAnswered
            show={answeredModalShow}
            setShow={setAnsweredModalShow}
            onHide={() => {
              //if isFullscreen set it back
              setAnsweredModalShow(false);
              if (isFullscreen) {
                unityContext.setFullscreen(true);
              }
            }}
          />
        </ScoreContext.Provider>
      </div>
    </>
  );
};

export default UnityGameComponent;
