import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

function NewLeaderboardComponent() {
  const [topScorer, setTopScorer] = useState([]);
  const [topScorerName, setTopScorerName] = useState([]);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_BACKENDLINKHEAD + "user/getTopScores")
      .then(
        (response) => ((
          setTopScorer(response.data.top10List),
          setTopScorerName(response.data.top10Players)
        ))
      );
  }, []);

  for (let i = 0; i < topScorer.length; i++) {
    topScorer[i].name = topScorerName[i];
    topScorer[i].rank = i + 1;
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard">
        <p
          className="section-header"
        >
          Leaderboard
        </p>
        <div className="leaderboard-grid">
          <span className="leaderboard-grid-header lb-span">Rank</span>
          <span className="leaderboard-grid-header lb-span">Username</span>
          <span className="leaderboard-grid-header lb-span">Score</span>
        </div>
        {topScorer.length === 0 ? (
          <div className="top1 animated-box in">
            <div className="leaderboard-grid-data top1">
              <div className="leaderboard-grid-child">
                <span className="lb-span-start"></span>
                <span className="lb-span">Loading...</span>
                <span className="lb-span-end"></span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="top1 animated-box in">
              <div className="leaderboard-grid-data top1">
                <div className="leaderboard-grid-child top1">
                  <span className="lb-span-start">
                    <img src="https://img.icons8.com/emoji/50/000000/1st-place-medal-emoji.png" alt="1st"/>
                    {topScorer[0]?.rank}
                  </span>
                  <span className="lb-span">{topScorer[0]?.name}</span>
                  <span className="lb-span-end">{topScorer[0]?.totalScore}</span>
                </div>
              </div>
            </div>
            <div className="top2 animated-box in">
              <div className="leaderboard-grid-data">
                <div className="leaderboard-grid-child">
                  <span className="lb-span-start">
                    <img src="https://img.icons8.com/office/50/000000/olympic-medal-silver.png" alt="2nd"/>
                    {topScorer[1]?.rank}
                  </span>
                  <span className="lb-span">{topScorer[1]?.name}</span>
                  <span className="lb-span-end">{topScorer[1]?.totalScore}</span>
                </div>
              </div>
            </div>
            <div className="top3 animated-box in">
              <div className="leaderboard-grid-data">
                <div className="leaderboard-grid-child">
                  <span className="lb-span-start">
                    <img src="https://img.icons8.com/office/50/000000/olympic-medal-bronze.png" alt="3rd"/>
                    {topScorer[2]?.rank}
                  </span>
                  <span className="lb-span">{topScorer[2]?.name}</span>
                  <span className="lb-span-end">{topScorer[2]?.totalScore}</span>
                </div>
              </div>
            </div>
            {topScorer.slice(3, 10).map((scorer, i) => (
              <div key={i} className="leaderboard-grid-data">
                <div className="leaderboard-grid-child">
                  <span className="lb-span-start">{scorer?.rank}</span>
                  <span className="lb-span">{scorer?.name}</span>
                  <span className="lb-span-end">{scorer?.totalScore}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NewLeaderboardComponent;
