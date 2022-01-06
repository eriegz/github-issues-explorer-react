import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import * as Axios from "axios";

import "./index.css";

import IssueTile from "./IssueTile";

function Issues() {
  const filterTabs = [
    {
      id: "all",
      displayName: "All Issues",
    },
    {
      id: "open",
      displayName: "Open Issues",
    },
    {
      id: "closed",
      displayName: "Closed Issues",
    },
    {
      id: "pr",
      displayName: "Pull Requests",
    },
  ];

  const repoUrl = new URLSearchParams(useLocation().search).get("r");
  const history = useHistory();

  // useEffect by default gets called every render, and so to make it execute only once the typical practice is to pass
  // an empty dependency array to "useEffect" as the 2nd argument. The array below is not empty (for reasons explained
  // below), but the end result is the same (i.e.: this function only executes once per page load).
  useEffect(
    () => {
      (function () {
        // Catch malformed / missing "r" query param errors in case users navigate directly to this page:
        if (typeof repoUrl !== "string" || repoUrl.length === 0) {
          return history.push("/");
        }

        let orgAndRepo = repoUrl.split("github.com/")[1];
        let [orgName, repoName] = orgAndRepo.split("/");
        // TODO: Call GitHub's "/graphql" endpoint instead in order to cut down on the response size:
        Axios.get(
          `https://api.github.com/repos/${orgName}/${repoName}/issues`,
          {
            params: {
              state: "all",
              per_page: 100,
            },
          }
        )
          .then((result) => {
            setBackendReqInProgress(false);
            setIssues(result.data);
            setDisplayedIssues(result.data);
          })
          .catch((e) => {
            setBackendReqInProgress(false);
            setErrors([e.response.data]);
          });
      })();
    },
    // Below: React complains if any dependencies are omitted from this array, regardless if they are actually watched
    // or not:
    [repoUrl, history]
  );

  const [backendCallInProgress, setBackendReqInProgress] = useState(true);
  const [issues, setIssues] = useState([]);
  const [errors, setErrors] = useState([]);
  const [displayedIssues, setDisplayedIssues] = useState([]);
  const [selectedTab, setSelectedTab] = useState(filterTabs[0].id);
  const [withinIssueSearch, setWithinIssueSearch] = useState("");

  // ----------------- Helper functions: ------------------
  function getIssuesOrPlaceholderTextElements() {
    // This function generates what we show to the user while the page is initializing (including waiting for the
    // backend call to complete):
    //   - If the HTTP request is still "in-flight", show a "loading" placeholder text
    //   - Else, once we've received the HTTP response:
    //     - if there are more than 0 issues found, display them
    //     - else, show the "no issues" text
    if (backendCallInProgress) {
      return (
        <div className="full-height-centered-container">
          <p className="placeholder-text">Loading . . .</p>
        </div>
      );
    }

    if (errors.length > 0) {
      return (
        <div className="full-height-centered-container">
          <p className="placeholder-text error">
            Invalid URL entered, or repo permissions are set to private. Please
            try again.
          </p>
        </div>
      );
    }

    if (displayedIssues.length > 0) {
      return (
        <div id="issues-grid-view">
          {displayedIssues.map((ea, index) => (
            <IssueTile
              key={index}
              title={ea.title}
              pullRequest={ea.pull_request}
              status={ea.state}
              description={ea.body}
              labels={ea.labels}
              htmlUrl={ea.html_url}
            />
          ))}
        </div>
      );
    } else {
      return (
        <div className="full-height-centered-container">
          <p className="placeholder-text">
            Hmmm, there doesn't appear to be any issues here...
          </p>
        </div>
      );
    }
  }

  // -------------- Event handler functions: --------------
  function selectTab(tabId) {
    setSelectedTab(tabId);
    filterBy(tabId);
  }

  function filterBy(filterValue) {
    switch (filterValue) {
      case "all":
        setDisplayedIssues(issues);
        break;
      case "open":
        setDisplayedIssues(issues.filter((ea) => ea.state === "open"));
        break;
      case "closed":
        setDisplayedIssues(issues.filter((ea) => ea.state === "closed"));
        break;
      case "pr":
        setDisplayedIssues(
          issues.filter((ea) => ea.pull_request !== undefined)
        );
        break;
      default:
        break;
    }
  }

  function filterIssuesByKeywords(searchQuery) {
    // @NOTE: light-weight client-side test to search for keywords in issue description bodies.
    setDisplayedIssues(issues.filter((ea) => ea.body && ea.body.includes(withinIssueSearch)));
  }

  function handleSearchChange(event) {
    const value = event.target.value;
    return setWithinIssueSearch(value);
  }

  // ---------------- Main render function: ---------------
  return (
    <div id="issues-page-container">
      <div className="issues-button-tray">
        {filterTabs.map((ea, index) => (
          <button
            key={index}
            className={`issues-filter-button ${selectedTab === ea.id ? "selected" : ""
              }`}
            onClick={selectTab.bind(this, ea.id)}
          >
            {ea.displayName}
          </button>
        ))}
        <input
          value={withinIssueSearch}
          onChange={handleSearchChange}
          placeholder="search within issues"
        />
        <button disabled={withinIssueSearch.length === 0} onClick={filterIssuesByKeywords}>Search Issues</button>
      </div>
      {getIssuesOrPlaceholderTextElements()}
    </div>
  );
}

export default Issues;
