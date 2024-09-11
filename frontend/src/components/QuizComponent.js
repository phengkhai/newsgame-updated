import React, {
  useState,
  useEffect,
  useContext,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Modal, Card } from "react-bootstrap";
import { Fragment } from "react";
import axios from "axios";
import { ScoreContext } from "../Context/ScoreContext";
import CryptoJS from "crypto-js";
import jwt_decode from "jwt-decode";
import useSound from "use-sound";
import boopSfx from "../video/wrong_choice.wav";
import boopSfx1 from "../video/correct.mp3";

const QuizComponent = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    restart() {
      console.log("restarting");
      setLevelFailed(false);
      setStart(false);
      setCurrentQuestion(1);
      setShowScore(false);
      setShow(false);
      setIsCorrect(false);
      setAnswered(false);
      setScore(0);
      setEasyScore(0);
      setMediumScore(0);
      setHardScore(0);
      // Timer
      setDisable(false);
      setPercentage(10);
      setTimesUp(false);
      setMinutes(0);
      setSeconds(0);
      setCount(0);
      const encryptedToken = JSON.parse(sessionStorage.getItem("token"));
      if (difficulty === "easy") {
        fetchEasy();
        if (encryptedToken === null) {
          sessionStorage.setItem("easyScore", 0);
        }
      } else if (difficulty === "medium") {
        fetchMedium();
        if (encryptedToken === null) {
          sessionStorage.setItem("mediumScore", 0);
        }
      } else {
        fetchHard();
        if (encryptedToken === null) {
          sessionStorage.setItem("hardScore", 0);
        }
      }
    },
  }));
  const {
    unityContext,
    modalShow,
    questionCount,
    difficulty,
    volume,
    isFullScreen,
  } = props;
  const [start, setStart] = useState(false);
  const [show, setShow] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [question, setQuestion] = useState([]);
  const [questionArray, setQuestionArray] = useState([]);
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const [levelFailed, setLevelFailed] = useState(false);
  const bossLevelQuestionsCount = 6;
  const normalLevelQuestionsCount = 3;
  const passingScore = 3;
  const handleToggle = () => {
    setShow(!show);
    props.setModalShow(!show);
  };

  const {
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
  } = useContext(ScoreContext);

  // For Timer
  const [count, setCount] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [disable, setDisable] = useState(false);
  const [percentage, setPercentage] = useState(10);
  const [timesUp, setTimesUp] = useState(false);
  useEffect(() => {
    let intervalId;
    if (count === 0) {
      if (disable) {
        setTimesUp(true);
        setShowScore(true);
      }
      setDisable(false);
      setMinutes(10);
      setSeconds(0);
      setCount(-1);
    }
    if (count > 0 && disable) {
      intervalId = setInterval(() => {
        const x = count - 1;
        const sec = x % 60;
        const min = Math.floor(x / 60) % 60;
        setCount(x);
        setMinutes(min);
        setSeconds(sec);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [count, minutes, seconds, disable, percentage]);

  function startTimer() {
    const x = seconds + minutes * 60;
    setPercentage(x);
    setCount(x);
    setDisable(true);
  }

  function stopTimer() {
    setDisable(false);
  }

  useEffect(() => {
    fetchQuestion();
  }, []);

  useEffect(() => {
    setShow(modalShow);
    //temporary setfullscreen false
    //when end quiz set it true
    if (isFullScreen && modalShow) {
      unityContext.setFullscreen(false);
    }
  }, [modalShow]);

  function fetchEasy() {
    console.log("Fetch Easy called");
    let quizNumber = 0,
      randomNum = 0;
    let tempQuestion = [];
    for (let i = 0; i < questionCount; i++) {
      randomNum = Math.floor(Math.random() * easyArray.length);
      quizNumber = easyArray[randomNum];
      easyArray.splice(randomNum, 1);
      axios
        .get(
          process.env.REACT_APP_BACKENDLINKHEAD + "allNews/easy/" + quizNumber
        )
        .then((response) => tempQuestion.push(response.data.news));
    }
    setQuestionArray(tempQuestion);
    if (questionCount === normalLevelQuestionsCount) {
      axios
        .get(process.env.REACT_APP_BACKENDLINKHEAD + "totalCountNews/easy")
        .then((response) => {
          const arr = [];
          for (let i = 1; i < response.data.newsTotalCount + 1; i++) {
            arr.push(i);
          }
          setEasyArray(arr);
        });
    }
  }

  function fetchMedium() {
    console.log("Fetch Medium called");
    let quizNumber = 0,
      randomNum = 0;
    let tempQuestion = [];
    for (let i = 0; i < questionCount; i++) {
      randomNum = Math.floor(Math.random() * mediumArray.length);
      quizNumber = mediumArray[randomNum];
      mediumArray.splice(randomNum, 1);
      axios
        .get(
          process.env.REACT_APP_BACKENDLINKHEAD + "allNews/medium/" + quizNumber
        )
        .then((response) => tempQuestion.push(response.data.news));
    }
    setQuestionArray(tempQuestion);
    if (questionCount === normalLevelQuestionsCount) {
      axios
        .get(process.env.REACT_APP_BACKENDLINKHEAD + "totalCountNews/medium")
        .then((response) => {
          const arr = [];
          for (let i = 1; i < response.data.newsTotalCount + 1; i++) {
            arr.push(i);
          }
          setMediumArray(arr);
        });
    }
  }

  function fetchHard() {
    console.log("Fetch Hard called");
    let quizNumber = 0,
      randomNum = 0;
    let tempQuestion = [];
    for (let i = 0; i < questionCount; i++) {
      randomNum = Math.floor(Math.random() * hardArray.length);
      quizNumber = hardArray[randomNum];
      hardArray.splice(randomNum, 1);
      axios
        .get(
          process.env.REACT_APP_BACKENDLINKHEAD + "allNews/hard/" + quizNumber
        )
        .then((response) => tempQuestion.push(response.data.news));
    }
    setQuestionArray(tempQuestion);
    if (questionCount === normalLevelQuestionsCount) {
      axios
        .get(process.env.REACT_APP_BACKENDLINKHEAD + "totalCountNews/hard")
        .then((response) => {
          const arr = [];
          for (let i = 1; i < response.data.newsTotalCount + 1; i++) {
            arr.push(i);
          }
          setHardArray(arr);
        });
    }
  }

  function fetchQuestion() {
    if (JSON.parse(sessionStorage.getItem("userData")) === null) {
      setNotLoggedIn(true);
    }
    if (difficulty === "easy") {
      fetchEasy();
    } else if (difficulty === "medium") {
      fetchMedium();
    } else {
      fetchHard();
    }
  }

  const [wrong] = useSound(boopSfx, { volume: volume });
  const [correct] = useSound(boopSfx1, { volume: volume });
  function handleAnswerOptionClick(isCorrect) {
    let answer;
    if (isCorrect === question.fake) {
      answer = "Fake";
    } else {
      answer = "Real";
    }
    let tempArray = {
      articleBody: question.articleBody,
      articleTitle: question.articleTitle,
      factCheck: question.factCheck,
      factCheckURL: question.factCheckURL,
      sourceURL: question.sourceURL,
      answer: answer,
      imageURL: question.imageURL,
      fake: question.fake,
      isCorrect: isCorrect,
    };
    setAnsweredQuestionsArray([...answeredQuestionsArray, tempArray]);
    if (isCorrect) {
      setScore(score + 1);
      setIsCorrect(true);
      correct();
    } else {
      wrong();
    }
    setAnswered(true);
  }

  function handleNextQuestion() {
    if (currentQuestion < questionCount) {
      setQuestion(questionArray[currentQuestion]);
      setCurrentQuestion(currentQuestion + 1);
      setIsCorrect(false);
      setAnswered(false);
    } else {
      setShowScore(true);
      stopTimer();
      if (questionCount === bossLevelQuestionsCount && score < passingScore) {
        setLevelFailed(true);
        console.log("fail");
        // Add the send fail message to unity, maybe need to pass the difficulty level also to call the restart function accordingly
        // unityContext.send()
      }
    }
  }

  function handleStart() {
    if (questionArray.length !== 0) {
      setQuestion(questionArray[0]);
      setStart(true);
      startTimer();
      // if (questionCount === bossLevelQuestionsCount) {
      // }
    }
  }

  function handleTrackLinks(trackLink, isFactCheck) {
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    if (userData !== null) {
      const secretKey = process.env.REACT_APP_CIPHER_SECRETKEY;
      const encryptedToken = JSON.parse(sessionStorage.getItem("token"));
      var bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
      var token = bytes.toString(CryptoJS.enc.Utf8);
      const refreshToken = JSON.parse(sessionStorage.getItem("refreshToken"));
      if (jwt_decode(token).exp < new Date().getTime() / 1000) {
        axios({
          method: "post",
          url: process.env.REACT_APP_BACKENDLINKHEAD + "user/refreshTok",
          data: {
            username: userData.username,
          },
          headers: {
            "Content-Type": "application/json",
            "auth-token": refreshToken,
          },
        }).then((res) => {
          const cipherToken = CryptoJS.AES.encrypt(
            res.data.token,
            secretKey
          ).toString();
          sessionStorage.setItem("token", JSON.stringify(cipherToken));
          axios({
            method: "post",
            url: process.env.REACT_APP_BACKENDLINKHEAD + "user/createTrackLink",
            data: {
              userID: userData.userID,
              trackLink: trackLink,
              isFactCheck: isFactCheck,
            },
            headers: {
              "Content-Type": "application/json",
              "auth-token": res.data.token,
            },
          }).then();

          return;
        });
      } else {
        axios({
          method: "post",
          url: process.env.REACT_APP_BACKENDLINKHEAD + "user/createTrackLink",
          data: {
            userID: userData.userID,
            trackLink: trackLink,
            isFactCheck: isFactCheck,
          },
          headers: { "Content-Type": "application/json", "auth-token": token },
        }).then();
      }
    }
  }

  // Used in handleEndQuiz
  function endQuizPutEasyScore(secretKey, userData, token, time) {
    const escore = easyScore + score * 100 + minutes * 20 + (seconds % 30) * 10;
    var cipherEasyScore = CryptoJS.AES.encrypt(
      JSON.stringify(escore),
      secretKey
    ).toString();
    unityContext.send("ReactAgent", "SetScore", escore);
    if (userData !== null) {
      handleTimeTaken(
        userData.userID,
        difficulty,
        true,
        time,
        easyScore,
        token
      );
      axios({
        method: "put",
        url: process.env.REACT_APP_BACKENDLINKHEAD + "user/score/easy",
        data: {
          userID: userData.userID,
          newScore: cipherEasyScore,
        },
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      }).then();
    } else {
      sessionStorage.setItem("easyScore", JSON.stringify(escore));
      console.log("score saved");
    }
  }

  // Used in handleEndQuiz
  function endQuizPutMediumScore(secretKey, userData, token, time) {
    const mscore =
      mediumScore + score * 120 + minutes * 22 + (seconds % 30) * 11;
    var cipherMediumScore = CryptoJS.AES.encrypt(
      JSON.stringify(mscore),
      secretKey
    ).toString();
    unityContext.send("ReactAgent", "SetScore", mscore);
    if (userData !== null) {
      handleTimeTaken(userData.userID, difficulty, true, time, mscore, token);
      axios({
        method: "put",
        url: process.env.REACT_APP_BACKENDLINKHEAD + "user/score/medium",
        data: {
          userID: userData.userID,
          newScore: cipherMediumScore,
        },
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      }).then();
    } else {
      sessionStorage.setItem("mediumScore", JSON.stringify(mscore));
      console.log("score saved");
    }
  }

  // Used in handleEndQuiz
  function endQuizPutHardScore(secretKey, userData, token, time) {
    const hscore = hardScore + score * 150 + minutes * 24 + (seconds % 30) * 12;
    var cipherHardScore = CryptoJS.AES.encrypt(
      JSON.stringify(hscore),
      secretKey
    ).toString();
    unityContext.send("ReactAgent", "SetScore", hscore);
    if (userData !== null) {
      handleTimeTaken(userData.userID, difficulty, true, time, hscore, token);
      axios({
        method: "put",
        url: process.env.REACT_APP_BACKENDLINKHEAD + "user/score/hard",
        data: {
          userID: userData.userID,
          newScore: cipherHardScore,
        },
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      }).then();
    } else {
      sessionStorage.setItem("hardScore", JSON.stringify(hscore));
      console.log("score saved");
    }
  }

  // Used in handleEndQuiz
  function handleTimeTaken(userID, difficulty, isBossRoom, time, score, token) {
    const TOTAL_TIME = 600;
    axios({
      method: "post",
      url: process.env.REACT_APP_BACKENDLINKHEAD + "user/trackTime",
      data: {
        userID: userID,
        difficulty: difficulty,
        isBossRoom: isBossRoom,
        trackTime: TOTAL_TIME - time,
        scoreObtained: score,
      },
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
    }).then();
  }

  function getRefreshToken(refreshToken, secretKey, username) {
    console.log("refreshing token");
    return new Promise((resolve) => {
      axios({
        method: "post",
        url: process.env.REACT_APP_BACKENDLINKHEAD + "user/refreshTok",
        data: {
          username: username,
        },
        headers: {
          "Content-Type": "application/json",
          "auth-token": refreshToken,
        },
      }).then((res) => {
        const cipherToken = CryptoJS.AES.encrypt(
          res.data.token,
          secretKey
        ).toString();
        sessionStorage.setItem("token", JSON.stringify(cipherToken));
        resolve(res.data.token);
      });
    });
  }

  function handleEndQuiz() {
    const time = parseInt(minutes) * 60 + parseInt(seconds);
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    const secretKey = process.env.REACT_APP_CIPHER_SECRETKEY;
    const encryptedToken = JSON.parse(sessionStorage.getItem("token"));
    const refreshToken = JSON.parse(sessionStorage.getItem("refreshToken"));
    let token;
    unityContext.send("ReactAgent", "SetNumberofCorrectAnswers", score);

    if (isFullScreen) {
      unityContext.setFullscreen(true);
    }

    if (encryptedToken !== null) {
      var bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
      token = bytes.toString(CryptoJS.enc.Utf8);
    }

    // For Boss Level End Quiz
    if (questionCount === bossLevelQuestionsCount) {
      // Failed the level
      if (score < passingScore) {
        unityContext.send("ReactAgent", "SetScore", 0);
        unityContext.send("ReactAgent", "SetScoreWithoutRaisingSignal", 0);
        unityContext.send("ReactAgent", "LevelFailed", difficulty);
        return;
      }
      // When user is login and the token is invalid
      if (
        encryptedToken !== null &&
        jwt_decode(token).exp < new Date().getTime() / 1000
      ) {
        getRefreshToken(refreshToken, secretKey, userData.username).then(
          (res) => {
            switch (difficulty) {
              case "easy":
                endQuizPutEasyScore(secretKey, userData, res, time);
                break;
              case "medium":
                endQuizPutMediumScore(secretKey, userData, res, time);
                break;
              default:
                endQuizPutHardScore(secretKey, userData, res, time);
                break;
            }
          }
        );
      } else {
        switch (difficulty) {
          case "easy":
            endQuizPutEasyScore(secretKey, userData, token, time);
            break;
          case "medium":
            endQuizPutMediumScore(secretKey, userData, token, time);
            break;
          default:
            endQuizPutHardScore(secretKey, userData, token, time);
            break;
        }
      }
    } // End For Boss Level End Quiz
    else {
      // For Normal Level End Quiz
      const userScore = score * 50;
      unityContext.send("ReactAgent", "SetScore", userScore);
      // If user login
      if (userData) {
        // If login and token expired
        if (
          encryptedToken !== null &&
          jwt_decode(token).exp < new Date().getTime() / 1000
        ) {
          getRefreshToken(refreshToken, secretKey, userData.username).then(
            (res) => {
              handleTimeTaken(
                userData.userID,
                difficulty,
                false,
                time,
                userScore,
                res
              );
            }
          );
        } else {
          //Login but token not expired
          handleTimeTaken(
            userData.userID,
            difficulty,
            false,
            time,
            userScore,
            token
          );
        }
      }
      switch (difficulty) {
        case "easy":
          setEasyScore(userScore);
          console.log("Easy score updated: " + userScore);
          break;
        case "medium":
          setMediumScore(userScore);
          console.log("Medium score updated: " + userScore);
          break;
        default:
          setHardScore(userScore);
          console.log("Hard score updated: " + userScore);
          break;
      }
    }
    // End For Normal Level End Quiz
  }

  return (
    <Fragment>
      {/* <button variant="primary" onClick={handleToggle}>
        Start {questionCount + difficulty} questions quiz
      </button> */}
      {/* <button onClick={() => checktoken()}>cl</button> */}

      <Modal
        show={show}
        onHide={handleToggle}
        backdrop="static"
        centered
        animation={false}
        size="lg"
        className="quiz-modal"
      >
        {/* <button
          onClick={() => {
            console.log(easyArray, mediumArray, hardArray);
          }}
        >
          Check Array
        </button> */}
        {!start ? (
          <div className="quiz-container quiz-instructions">
            <h1 className="quiz-title">
              Identify whether the news are fake or real.
            </h1>
            <h4 className="quiz-inst1">
              Please click the button to start when you are ready!
            </h4>
            <button className="start-quiz-button" onClick={handleStart}>
              Start
            </button>
          </div>
        ) : (
          <div className="quiz-container">
            {questionCount === bossLevelQuestionsCount && (
              <div className="timer">
                <center>
                  <div className="ProgressBar">
                    <div
                      className="fill"
                      style={{ width: `${(count / percentage) * 100}%` }}
                    >
                      <div>
                        {minutes.toString().padStart(2, "0")}:
                        {seconds.toString().padStart(2, "0")}
                      </div>
                    </div>
                  </div>
                </center>
              </div>
            )}
            {showScore ? (
              <div>
                {timesUp && <div>Times Up!</div>}
                <div className="question-header">
                  <h1>
                    You scored {score} out of {questionCount}
                  </h1>
                  {levelFailed && (
                    <h5>
                      You had been fooled by the boss. You need to improve your
                      skills on detecting fake news. The level will be
                      restarted.
                    </h5>
                  )}
                  {/* {notLoggedIn && (
                    <div style={{ color: "red", fontSize: "16px" }}>
                      You haven't login, please login AFTER THE GAME to save
                      your scores.
                    </div>
                  )} */}
                  <button
                    className="quiz-button next-button"
                    onClick={() => (handleToggle(), handleEndQuiz())}
                  >
                    End Quiz
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {answered ? (
                  <Fragment>
                    <div>
                      <div className="question-body">
                        {isCorrect ? (
                          <h3>Your answer is correct!</h3>
                        ) : (
                          <h3>Your answer is wrong!</h3>
                        )}
                      </div>
                      <div className="question-body">
                        {question.factCheck}{" "}
                        {question.factCheckURL !== "NULL" && (
                          <a
                            href={question.factCheckURL}
                            onClick={() =>
                              handleTrackLinks(question.factCheckURL, true)
                            }
                            target="blank"
                          >
                            {question.factCheckURL}
                          </a>
                        )}
                      </div>
                      <div>
                        {currentQuestion === questionCount ? (
                          <button
                            className="quiz-button next-button"
                            onClick={() => handleNextQuestion()}
                          >
                            View Result
                          </button>
                        ) : (
                          <button
                            className="quiz-button next-button"
                            onClick={() => handleNextQuestion()}
                          >
                            Next Question
                          </button>
                        )}
                      </div>
                    </div>
                  </Fragment>
                ) : (
                  <div>
                    <div className="question-section">
                      <div className="question-count quiz-animation">
                        <span className="firsthalf">
                          Question {currentQuestion}
                        </span>
                        /{questionCount}
                      </div>
                      <div className="question-question quiz-animation">
                        Do you think this article is real or fake?
                      </div>
                      <Card
                        className="question-card quiz-animation"
                        border="dark"
                      >
                        <Card.Header className="question-card-header">
                          <div
                            className="question-header"
                            style={{ whiteSpace: "pre-wrap" }}
                          >
                            {question.articleTitle}
                          </div>
                        </Card.Header>
                        <div className="scrollable">
                          {question.imageURL !== "NULL" && (
                            <img
                              className="image"
                              src={question.imageURL}
                              alt="pic"
                            />
                          )}
                          <Card.Body>
                            <div
                              className="question-body"
                              style={{ whiteSpace: "pre-wrap" }}
                            >
                              {question.articleBody}
                            </div>
                            <br></br>
                            {question.sourceURL !== "NULL" && (
                              <div className="question-body">
                                Click{" "}
                                <a
                                  href={question.sourceURL}
                                  onClick={() =>
                                    handleTrackLinks(question.sourceURL, false)
                                  }
                                  target="blank"
                                >
                                  <b>here</b>
                                </a>{" "}
                                to view the full article
                              </div>
                            )}
                          </Card.Body>
                        </div>
                      </Card>
                    </div>
                    <div className="answer-section quiz-animation">
                      <div>
                        <button
                          className="quiz-button fake-button"
                          onClick={() => handleAnswerOptionClick(question.fake)}
                        >
                          Fake
                        </button>
                        <button
                          className="quiz-button real-button"
                          onClick={() =>
                            handleAnswerOptionClick(!question.fake)
                          }
                        >
                          Real
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </Fragment>
  );
});

export default QuizComponent;
