import "./IssueLabel.css";

function IssueLabel(props) {
  return (
    <div className="issue-label">
      <p className="issue-label-bullet">•</p>
      <p className="issue-label-title">{props.labelText}</p>
    </div>
  );
}

export default IssueLabel;