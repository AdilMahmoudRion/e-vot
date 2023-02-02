import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import LoadingCircles from "../assets/loadingcircles.svg";

function Check() {
  const [candidate1URL, changeCandidate1Url] = useState(LoadingCircles);
  const [candidate2URL, changeCandidate2Url] = useState(LoadingCircles);
  const [showresults, changeResultsDisplay] = useState(false);
  console.log("🚀 ~ file: Check.js:9 ~ Check ~ showresults", showresults)
  const [buttonStatus, changeButtonStatus] = useState(false);
  console.log("🚀 ~ file: Check.js:10 ~ Check ~ buttonStatus", buttonStatus)
  const [candidate1Votes, changeVote1] = useState("--");
  console.log("🚀 ~ file: Check.js:11 ~ Check ~ candidate1Votes", candidate1Votes)
  const [candidate2Votes, changeVote2] = useState("--");
  console.log("🚀 ~ file: Check.js:12 ~ Check ~ candidate2Votes", candidate2Votes)
  const [prompt, changePrompt] = useState("--");
  console.log("🚀 ~ file: Check.js:17 ~ Check ~ prompt", prompt)

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
      console.log("🚀 ~ file: Check.js:49 ~ getInfo ~ didUserVote", didUserVote)

      

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
    console.log(window.accountId)

    let voteCount = await window.contract.getVotes({
      prompt: localStorage.getItem("prompt"),
    });
    changeVote1(voteCount[0]);
    changeVote2(voteCount[1]);
    changeResultsDisplay(true);
  };
  return (
    <section>
      <h1>check</h1>
      <div>
        {showresults ? (
          <Row>
            <div className="vote">{candidate1Votes}</div>
            <div className="vote">{candidate2Votes}</div>
          </Row>
        ) : null}
      </div>
    </section>
  );
}

export default Check;
