import React, {
  useEffect,
  useRef,
  useState
} from 'react';
import {
  Link,
  useHistory
} from "react-router-dom";
import * as Axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

import SuggestionsDropDown from "./SuggestionsDropDown";

import "./index.css";

function Homepage() {
  const history = useHistory();

  // This function makes the backend request to GitHub's API to get search suggestions:
  const searchAsYouTypeDebounce = useRef(null);

  // State variables and update hooks:
  const [userInput, setUserInput] = useState("");
  const [userInputIsAUrl, setUserInputIsAUrl] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState(null);
  const [searchQueryInProgress, setSearchQueryInProgress] = useState(false);

  // Below: After triggering the backend call to get suggestions, and BEFORE the response comes back, it's possible for
  // the user to put the page back into a state that's incompatible with displaying search suggestions (e.g.: if they
  // were to quickly press "Ctrl + A, Ctrl + V" to paste in a URL before the suggestions loaded). Ergo, if this ever
  // happens, we must once again hide suggestions after rendering has completed, inside a 'useEffect' function:
  useEffect(
    () => {
      if (userInputIsAUrl !== false) {
        setSearchSuggestions(null);
      }
    },
    [searchSuggestions, userInputIsAUrl]
  )

  // Important: This function gets called after *every single key press* inside the input field:
  async function updatePageAfterKeyPress(e) {
    const userInput = e.target.value;

    // Below: every execution of 'updatePageAfterKeyPress' first clears any 'setTimeout's that were queued up by
    // previous executions, thus ensuring that the "debounce" function executes only ONCE, after the user is "done"
    // typing ("done" defined as "no further user input for X milliseconds"):
    clearTimeout(searchAsYouTypeDebounce.current);

    // Next, update the frontend with the user's new input, and "reset" all other states, as they'll all need to get
    // re-calculated based on what the user has just entered:
    setUserInput(userInput);
    setUserInputIsAUrl(false);
    setSearchQueryInProgress(false);
    setSearchSuggestions(null);

    // If the user has just deleted everything inside the input field then we're finished at this point:
    if (userInput.length === 0) {
      return;
    }

    // Now, because the input field is multi-functional, the next frontend update depends on the field's contents:
    //   - if user has entered a URL then activate the submit button
    //   - otherwise, if the user has entered text that's NOT a URL then make an HTTP request to GitHub's API to find
    //     any repos whose names match this text, and display the suggestions beneath the input field
    try {
      // A simple way to test if the user's input constitutes a URL is to use JavaScript's 'URL' constructor:
      new URL(userInput);
      // If the above hasn't thrown an error yet then we know the user's input is a URL, so proceed:
      setUserInputIsAUrl(true);
    } catch (e) {
      // Not a URL, therefore display search suggestions:
      setSearchQueryInProgress(true);
      setSearchSuggestions(await getSearchSuggestionsFromBackend(userInput));
      setSearchQueryInProgress(false);
    }
  }

  function getSearchSuggestionsFromBackend(userInputString) {
    return new Promise((resolve, reject) => {
      // Next, set our timeout, which will perform the HTTP request once the user has stopped typing, or 500 ms after
      // their last keystroke:
      searchAsYouTypeDebounce.current = setTimeout(
        () => {
          let maxTopResults = 15;
          Axios.get(
            `https://api.github.com/search/repositories`,
            {
              params: {
                q: `${userInputString} in:name`,
                page: 1,
                per_page: maxTopResults
              }
            }
          ).then((result) => {
            let output = [];
            result.data.items.forEach(ea => {
              output.push({
                repoName: ea.full_name,
                repoUrl: ea.html_url
              });
            });
            resolve(output);
          }).catch((e) => {
            // Being unable to display search suggestions isn't the end of the world, so displaying a simple toast
            // message and resolving (not rejecting) the promise is sufficient. One way in which this error scenario can
            // happen is if too many requests are sent to GitHub's API in a given time span.
            toast.error("Error: Could not fetch search suggestions",);
            resolve(null);
          });
        },
        500
      );
    });
  }

  function navigateToRepoIssuesPage(nextPageUrl) {
    return history.push(nextPageUrl);
  }

  return (
    <div id="homepage-container">
      <section id="repo-url-search-container">
        <h1 id="app-title">GitHub Issues Viewer</h1>
        <Link
          id="submit-button"
          className={`${userInputIsAUrl ? "" : " disabled"}`}
          to={"/issues?r=" + userInput}
        >
          {/* Below: Hard-coding this one here because for some reason the "path" portions of the SVG image actually get
            filled in with colour (they should be empty) when importing the SVG as the source inside an <img> tag. */}
          <svg width="36" height="33" viewBox="0 0 36 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M25.0449 20.8022C24.5047 21.6574 23.8716 22.4479 23.1598 23.1598L33 33L35.1213 30.8787L25.0449 20.8022Z"
              fill={userInputIsAUrl ? "black" : "var(--light-grey)"}
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.5667 24.1333C19.4025 24.1333 24.1333 19.4025 24.1333 13.5667C24.1333 7.73086 19.4025 3 13.5667 3C7.73086 3 3 7.73086 3 13.5667C3 19.4025 7.73086 24.1333 13.5667 24.1333ZM13.5667 27.1333C21.0593 27.1333 27.1333 21.0593 27.1333 13.5667C27.1333 6.074 21.0593 0 13.5667 0C6.074 0 0 6.074 0 13.5667C0 21.0593 6.074 27.1333 13.5667 27.1333Z"
              fill={userInputIsAUrl ? "black" : "var(--light-grey)"}
            />
          </svg>
        </Link>
        <input
          id="url-search-input-field"
          type="url"
          placeholder="Paste GitHub URL or search for repo by name"
          value={userInput}
          onChange={updatePageAfterKeyPress}
        />
        {/* Below: The 'SuggestionsDropDown' component can contain either the list of suggestions themselves or a status
          message, as required: */}
        {(() => {
          if (Array.isArray(searchSuggestions)) {
            if (searchSuggestions.length > 0) {
              return <SuggestionsDropDown suggestions={searchSuggestions} suggestionClickHandler={navigateToRepoIssuesPage} />;
            } else {
              return <SuggestionsDropDown statusText={"Hmmm, no repositories found with that name..."} />;
            }
          } else {
            if (searchQueryInProgress) {
              return <SuggestionsDropDown statusText={"Searching for repositories..."} />;
            } else {
              return null;
            }
          }
        })()}
      </section>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default Homepage;