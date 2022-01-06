import React from 'react';

import "./SuggestionsDropDown.css";

function SuggestionsDropDown(props) {
  return <div className="no-added-height">
    <div id="suggestions-container">
      {(() => {
        if (props.suggestions) {
          return props.suggestions.map((ea, index) =>
            <div
              key={index}
              onClick={props.suggestionClickHandler.bind(this, "/issues?r=" + ea.repoUrl)}
              className="suggestion"
            >
              {ea.repoName}
            </div>
          )
        } else {
          return <div id="suggestions-container-status">{props.statusText}</div>
        }
      })()}
    </div>
  </div>;
}

export default SuggestionsDropDown;