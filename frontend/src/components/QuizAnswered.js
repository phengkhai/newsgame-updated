import React, { useState, useContext } from "react";
import { Modal, Card } from "react-bootstrap";
import { ScoreContext } from "../Context/ScoreContext";
import ReactPaginate from "react-paginate";

function QuizAnswered(props) {
  const { answeredQuestionsArray } = useContext(ScoreContext);
  const { onHide } = props;

  const [pageNumber, setPageNumber] = useState(0);

  const questionPerPage = 1;
  const pagesVisited = pageNumber * questionPerPage;
  const pageCount = Math.ceil(answeredQuestionsArray.length / questionPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const displayUsers = answeredQuestionsArray
    .slice(pagesVisited, pagesVisited + questionPerPage)
    .map((question, index) => {
      return (
        <div className="quiz-container" key={index}>
          <div className="question-count">
            <span className="firsthalf">Question {pagesVisited + 1}</span>/
            {answeredQuestionsArray.length}
          </div>
          <div className="question-section">
            <Card className="question-card" border="dark">
              <Card.Header className="question-card-header">
                <div
                  className="question-header"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {question.articleTitle}
                </div>
              </Card.Header>
              {question.imageURL !== "NULL" && (
                <img className="image" src={question.imageURL} alt="pic" />
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
                    <a href={question.sourceURL} target="blank">
                      <b>here</b>
                    </a>{" "}
                    to view the full article
                  </div>
                )}
              </Card.Body>
            </Card>
            <h2
              className={question.isCorrect ? "correct-answer" : "wrong-answer"}
            >
              Your Answer: {question.answer}
            </h2>
            <div className="question-body">
              {question.factCheck}{" "}
              {question.factCheckURL !== "NULL" && (
                <a href={question.factCheckURL} target="blank">
                  {question.factCheckURL}
                </a>
              )}
            </div>
          </div>
        </div>
      );
    });

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <div className="questions-answered">
        <button onClick={() => onHide()} className="close-modal-button">
          X
        </button>
        {answeredQuestionsArray.length === 0 ? (
          <div className="not-answered-part">
            You have not answer any questions yet.
          </div>
        ) : (
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={"paginationBttns"}
            previousLinkClassName={"previousBttn"}
            nextLinkClassName={"nextBttn"}
            //   disabledClassName={"paginationDisabled"}
            activeClassName={"paginationActive"}
          />
        )}

        {displayUsers}
      </div>
    </Modal>
  );
}

export default QuizAnswered;
