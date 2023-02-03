import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Row,
  Navbar,
  Nav,
  NavDropdown,
} from "react-bootstrap";
import LoadingCircles from "../assets/loadingcircles.svg";
import "./style.css";

function Check() {
  const [candidate1URL, changeCandidate1Url] = useState(LoadingCircles);
  const [candidate2URL, changeCandidate2Url] = useState(LoadingCircles);
  const [showresults, changeResultsDisplay] = useState(false);
  const [buttonStatus, changeButtonStatus] = useState(false);
  const [candidate1Votes, changeVote1] = useState("--");

  const [candidate2Votes, changeVote2] = useState("--");
  const [prompt, changePrompt] = useState("--");

  useEffect(() => {
    const getInfo = async () => {
      // vote count stuff
      let voteCount = await window.contract.getVotes({
        prompt: localStorage.getItem("prompt"),
      });
      changeVote1(voteCount[0]);
      changeVote2(voteCount[1]);

      // image stuff

      changeCandidate1Url(
        await window.contract.getUrl({
          name: localStorage.getItem("Candidate1"),
        })
      );
      changeCandidate2Url(
        await window.contract.getUrl({
          name: localStorage.getItem("Candidate2"),
        })
      );

      changePrompt(localStorage.getItem("prompt"));

      // vote checking stuff

      let didUserVote = await window.contract.didParticipate({
        prompt: localStorage.getItem("prompt"),
        user: window.accountId,
      });

      changeResultsDisplay(didUserVote);
      changeButtonStatus(didUserVote);
    };

    getInfo();
  }, []);

  const addVote = async (index) => {
    changeButtonStatus(true);
    await window.contract.addVote({
      prompt: localStorage.getItem("prompt"),
      index: index,
    });

    await window.contract.recordUser({
      prompt: localStorage.getItem("prompt"),
      user: window.accountId,
    });

    let voteCount = await window.contract.getVotes({
      prompt: localStorage.getItem("prompt"),
    });
    changeVote1(voteCount[0]);
    changeVote2(voteCount[1]);
    changeResultsDisplay(true);
  };

  const [candidate1, setCandidate1] = useState([]);
  const [candidate2, setCandidate2] = useState([]);

  useEffect(() => {
    let candidate1 = [];
    let candidate2 = [];
    for (let i = 0; i < candidate1Votes; i++) {
      candidate1.push(Math.random().toString(36).substring(2, 52));
    }
    for (let i = 0; i < candidate2Votes; i++) {
      candidate2.push(Math.random().toString(36).substring(2, 52));
    }
    setCandidate1(candidate1);
    setCandidate2(candidate2);
  }, [candidate1Votes, candidate2Votes]);

  return (
    <Container className="c">
      <div className="card">
        <Row className="main-row">
          <p className="title-p">{prompt}</p>
          <Col className="column">
            <Container>
              <Row>
                <div>
                  <img className="images" src={candidate1URL}></img>
                </div>
              </Row>
              {showresults ? (
                <Row>
                  <div className="vote">{window.localStorage.Candidate1}</div>

                  <div className="vote">{candidate1Votes}</div>

                  <div>
                    Voter List:
                    <ul>
        {candidate1.map((hash, index) => (
          <li key={index}>{hash}</li>
        ))}
      </ul>
                  </div>
                </Row>
              ) : null}
            </Container>
          </Col>

          <Col className="column">
            <Container>
              <Row>
                <div>
                  <img className="images" src={candidate2URL}></img>
                </div>
              </Row>
              {showresults ? (
                <Row className="">
                  <div className="vote">{window.localStorage.Candidate2}</div>

                  <div className="vote">{candidate2Votes}</div>
                  <div>
                    Voter List:
                    <ul>
        {candidate2.map((hash, index) => (
          <li key={index}>{hash}</li>
        ))}
      </ul>
      </div>
                </Row>
              ) : null}
            </Container>
          </Col>
        </Row>
      </div>
     
    </Container>
  );
}

export default Check;
