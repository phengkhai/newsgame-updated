import express from "express";
import NewsCtrl from "./newsController.js";
import UserCtrl from "./userController.js";
import ScoreCtrl from "./scoreController.js";
import TrackLinkCtrl from "./trackLinkController.js"
import verifyTok from "./verifyTokenController.js";
import TrackTimeCtrl from "./trackTimeController.js"

const router = express.Router();

//get all the news from database
router
  .route("/allNews")
  .get(verifyTok.verTok, NewsCtrl.apiGetNews);

//get random specific news from database
router
  .route("/totalCountNews/:difficulty")
  .get(NewsCtrl.apiGetNewsTotalCount);

//get specific news based on difficulty and index
router
  .route("/allNews/:difficulty/:index")
  .get(NewsCtrl.apiGetSpecificNews)

router
  .route("/user/getScore/:userID")
  .get(verifyTok.verTok, ScoreCtrl.retrieveUserScore)

//route for user signup (create user)
router
  .route("/user/signup")
  .post(UserCtrl.apiPostUserSignup);

//user signup account activation via email
// router
//   .route("/user/activate/:activateTok")
//   .get(UserCtrl.apiActivateAcct);

//route for user signin
router
  .route("/user/signin")
  .post(UserCtrl.apiPostUserSignin);

//route for forget password to send verification email
// router
//   .route("/user/reqChangePass/:email")
//   .get(UserCtrl.apiSendChangePassEmail);

//route for change password
// router
//   .route("/user/changePass/:userID")
//   .put(UserCtrl.apiChangePassword);

//route for change password when logged in
// router
//   .route("/user/loggedin/changePass/:userID")
//   .put(UserCtrl.apiLoggedInChangePassword);

//route for user character
// router
//   .route("/user/updateChar/:username")
//   .put(verifyTok.verTok, UserCtrl.apiChangeCharacter);

//rute for getting top 10 scores and players
router
  .route("/user/getTopScores")
  .get(ScoreCtrl.apiGetTop10Score);

//route for updating easy level and score
router
  .route("/user/score/easy")
  .put(verifyTok.verTok, ScoreCtrl.apiUpdateEasyScoreNLevel);

//route for updating medium level and score
router
  .route("/user/score/medium")
  .put(verifyTok.verTok, ScoreCtrl.apiUpdateMediumScoreNLevel);

//route for updating hard level and score
router
  .route("/user/score/hard")
  .put(verifyTok.verTok, ScoreCtrl.apiUpdateHardScoreNLevel);

//get the spicific track links surfed by player, used by admin only
router
  .route("/user/getTrackLink/:userID")
  .get(verifyTok.verTok, TrackLinkCtrl.apiGetUserLink);

//get all the data from Track Link collection, used by admin only
router
  .route("/user/getAllTrackLink")
  .get(verifyTok.verTok, TrackLinkCtrl.apiGetAllUserLinks);

//create a track link whenever player press a link
router
  .route("/user/createTrackLink")
  .post(verifyTok.verTok, TrackLinkCtrl.apiCreateUserTrackLink);

//generate new token for user using the refreshtoken  
router
  .route("/user/refreshTok")
  .post(verifyTok.refreshTok, verifyTok.generateTok)

//get the spicific track time of player, used by admin only
router
  .route("/user/getTrackTimeByUser/:userID")
  .get(verifyTok.verTok, TrackTimeCtrl.apiGetUserPlayTime);

//get the spicific track time of player, used by admin only
router
  .route("/user/getTrackTimeByDifficulty/:difficulty")
  .get(verifyTok.verTok, TrackTimeCtrl.apiGetPlayTimeByDifficulty);

//get all the data from Track Time collection, used by admin only
router
  .route("/user/getAllTrackTime")
  .get(verifyTok.verTok, TrackTimeCtrl.apiGetAllUserPlayTime);  

//create track time whenever player finish solving a quiz set (3 or 8)
router
  .route("/user/tracktime")
  .post(verifyTok.verTok, TrackTimeCtrl.apiCreateUserTrackTime);

export default router;
