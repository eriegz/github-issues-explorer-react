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
import SearchIcon from 'components/icons/SearchIcon';
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

  // Below: After triggering the backend call to get suggestions, and BEFORE the response comes
  // back, it's possible for the user to put the page into a state that's incompatible with
  // displaying the search suggestions (e.g.: if they were to quickly press "Ctrl + A, Ctrl + V" to
  // paste in a URL before the suggestions loaded).
  // If this ever happens, we must once again hide suggestions after rendering has completed, using
  // a 'useEffect' hook, which according to React replaces `componentDidUpdate`:
  useEffect(
    () => {
      if (userInputIsAUrl === true || userInput === "") {
        setSearchSuggestions(null);
      }
    },
    [searchSuggestions, userInputIsAUrl]
  );

  // Important: This function gets called after *every single key press* inside the input field:
  async function updatePageAfterKeyPress(e) {
    const userInput = e.target.value;

    // Below: every execution of 'updatePageAfterKeyPress' first clears any 'setTimeout's that were
    // queued up by previous executions, thus ensuring that the "debounce" function executes only
    // ONCE, after the user is "done" typing ("done" defined as "no user input for X milliseconds"):
    clearTimeout(searchAsYouTypeDebounce.current);

    // Next, update the frontend with the user's new input:
    setUserInput(userInput);
    // ...and "reset" the search suggestions:
    setSearchSuggestions(null);

    // If the user has just deleted everything inside the input field then we're finished:
    if (userInput.length === 0) {
      return;
    }

    // Now, because the input field is multi-functional, the next frontend update depends on the
    // field's contents:
    //   - if user has entered a URL then activate the submit button
    //   - otherwise, if the user has entered text that's NOT a URL then make an HTTP request to
    //     GitHub's API to find any repos whose names match this text, and display the suggestions
    //     beneath the input field
    try {
      // A simple way to test if the user's input constitutes a URL is to use JavaScript's `URL`
      // constructor:
      new URL(userInput);
      // If the above hasn't thrown an error yet then we know the user's input is a URL, so proceed:
      setUserInputIsAUrl(true);
    } catch (e) {
      // Not a URL, therefore query the backend for search suggestions:
      setUserInputIsAUrl(false);
      setSearchQueryInProgress(true);
      setSearchSuggestions(await getSearchSuggestionsFromBackend(userInput));
      setSearchQueryInProgress(false);
    }
  }

  function getSearchSuggestionsFromBackend(userInputString) {
    return new Promise((resolve) => {
      // Next, set our timeout, which will perform the HTTP request once the user has stopped
      // typing, or 500 ms after their last keystroke:
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
            // Being unable to display search suggestions isn't the end of the world, so displaying
            // a simple toast message and resolving (not rejecting) the promise is sufficient. One
            // way in which this error scenario can happen is if too many requests are sent to
            // GitHub's API in a given time span.
            toast.error("Error: Could not fetch search suggestions");
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
          <SearchIcon disabled={userInputIsAUrl} />
        </Link>
        <input
          id="url-search-input-field"
          type="url"
          placeholder="Paste GitHub URL or search for repo by name"
          value={userInput}
          onChange={updatePageAfterKeyPress}
        />
        {/* Below: The 'SuggestionsDropDown' component can contain either the list of suggestions
          themselves or a status message, as required: */}
        {(() => {
          if (Array.isArray(searchSuggestions)) {
            if (searchSuggestions.length > 0) {
              return <SuggestionsDropDown
                key={userInput}
                suggestions={searchSuggestions}
                suggestionClickHandler={navigateToRepoIssuesPage}
              />;
            } else {
              return <SuggestionsDropDown
                statusText={"Hmmm, no repositories found with that name..."}
              />;
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