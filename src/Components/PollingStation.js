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

const PollingStation = (props) => {
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
      console.log(
        "🚀 ~ file: PollingStation.js:53 ~ getInfo ~ didUserVote",
        didUserVote
      );

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
  // console.log("🚀 ~ file: PollingStation.js:64 ~ addVote ~ window.ccc", window.localStorage)
  console.log(
    "🚀 ~ file: PollingStation.js:68 ~ addVote ~ window.contract",
    window.contract.contractId
  );

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

              <Row>
                <div className="vote">{window.localStorage.Candidate1}</div>
              </Row>

              <Row className="b1">
                <Button disabled={buttonStatus} onClick={() => addVote(0)}>
                  Vote
                </Button>
              </Row>
            </Container>
          </Col>

          <Col className="column">
            <Container>
              <Row>
                <div>
                  <img className="images" src={candidate2URL}></img>
                </div>
              </Row>

              <Row className="">
                <div className="vote">{window.localStorage.Candidate2}</div>
              </Row>

              <Row className="b1">
                <Button disabled={buttonStatus} onClick={() => addVote(1)}>
                  Vote
                </Button>
              </Row>
            </Container>
          </Col>
        </Row>

        {showresults ? (
          <div>
            <Nav.Link href="/check">Check Status</Nav.Link>
            <div className="vote">{window.contract.contractId}</div>
          </div>
        ) : null}
      </div>
    </Container>
  );
};

export default PollingStation;
