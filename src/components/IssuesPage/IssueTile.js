import "./IssueTile.css";

import IssueLabel from "./IssueLabel";

import pullReqSvg from "../../assets/pullRequest.svg";
import closedSvg from "../../assets/closedIssue.svg";

function IssueTile(props) {
  function getTruncatedDescription(fullDesc) {
    let maxDescLength = 250;
    if (typeof fullDesc === "string" && fullDesc.length > 0) {
      if (fullDesc.length <= maxDescLength) {
        return <p>{fullDesc}</p>;
      } else {
        return <p className="description-preview">{fullDesc.slice(0, maxDescLength) + "..."}</p>;
      }
    } else {
      return <p className="no-description">No description provided</p>;
    }
  }
  
  const url = props?.pullRequest?.html_url ?? props?.htmlUrl; 

  return (
    <a href={url} className="issue-tile" title="Check the issue page"  target="_blank" rel="noopener noreferrer">

      {/* Below: We always want issue labels to appear at the bottom, so a simple way of doing this is to separate the
        labels from everything else, and then push the two groups apart vertically: */}

      {/* "Top half" */}
      <div>
        <div className="title-and-icons-tray">
          <p className="issue-tile-title">{props.title}</p>
          <div className="icon-tray">
            {props.pullRequest && <img src={pullReqSvg} alt="pull-request" className="icon-spacing" />}
            {props.status === "closed" && <img src={closedSvg} alt="closed-issue" className="icon-spacing" />}
          </div>
        </div>
        {getTruncatedDescription(props.description)}
      </div>
      {/* "Bottom half" */}
      <div className="issue-labels-tray">
        {props.labels.map((ea, index) =>
          <IssueLabel key={index} labelText={ea.name} />
        )}
      </div>
    </a>
  );
}

export default IssueTile;