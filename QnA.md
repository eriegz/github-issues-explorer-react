# QnA

### Planning

> What do you think are the greatest areas of risk in completing the project?

- getting the app to behave exactly the same across multiple different browsers and operating systems
- handling different browser zoom levels properly
- completing the task within 4 hours without encountering any major setbacks

> What changes/additions would you make to the design?

- Colours! :)
- I'm a big fan of material design, so I would love to utilize a library like [mui](https://mui.com/) to give the app a polished, modern look
- Next, there's a lot of empty space around the "search bar" in the first screen that could be used for other widgets / data presentation.
- Add some small visual separation between the "All Issues" button and the other 3 buttons to reflect the difference in their functionality (i.e.: 3 of them are filters, while the 4th one *resets* all filters)
- And maybe add a "`Filter By:`" label before the Open / Closed / Pull Requests buttons.

> List a two or three features that you would consider implementing in the future that would add significant value to the project.

- Allow searching for a repo by description / keyword(s), as well as by pasting in a repo URL:
  - begin searching as user types in input field
  - have drop-down list of search results
- Next, I would add another search bar inside the "grid view" issues page to allow quickly filtering the issues by keyword(s)
- Add some "stats" information at the top of the results page indicating how many issues were found in that repo, and how many of each status (e.g.: "623 Open, 10,143 Closed", etc.).
- We could also give more "preview information" of the issue inside each square tile, for example:
  - A speech bubble icon with a number next to it indicating how many comments there are in that issue
  - The date the issue was opened
  - The date of the most recent comment

---

### Looking Back

> Describe the major design/build decisions and why you made them.

- I decided to write my submission in React because:
  - React is fast becoming my personal favourite frontend framework to use (as compared to Vue.js and Angular), and
  - React is part of the tech stack at many companies
- Next, I decided that my submission would take the form of a single-page web application, using routing from the "react-router-dom" module for a snappy, responsive feel.
- I chose to use Axios for the HTTP client due to its great support, dependability, and features.
- Then finally, I chose to write all React components as functional components using React Hooks, for a lot of the same reasons that the developers introduced Hooks in the first place, i.e.:
  - Less boilerplate
  - More elegant / readable code
  - Better optimization during future build / minification pipeline stages

> How long did the assignment take (in hours)? Please break down your answer into buckets (e.g. "Learning Framework", "Coding", "Debugging").

- 4 hours researching (CSS grids, CSS Flexbox, GitHub API tokens, GraphQL queries)
- 5 hours development
- 3 hours testing / debugging
- 2 hours polishing / writing documentation / adding missing features

> If you could go back and give yourself advice at the beginning of the project, what would it be?

- *"Most of the time you spend on this assignment will be learning CSS grids"*
- *"Don't forget to eat lunch!"*

> Did you learn anything new?

- Yes. I gained a strong understanding of CSS grids, including:
  - fractional units (i.e.: `1fr`)
  - `minmax()` function
  - `repeat()` function
  - `auto-fit`
- Then relating to the above bullet point, I learned that we still need to use `@media` queries in conjunction with grid view in order to allow that last single column to scale all the way down to the lowest screen sizes (see code comments for more information)
- Learned how to perform some basic GraphQL queries (even if I didn't end up using them in my final submission), and use GitHub's [GraphQL Explorer](https://docs.github.com/en/graphql/overview/explorer)
- Learned how to limit how many times the `useEffect()` React Hook gets fired over the component's lifecycle (i.e.: by passing in an empty dependency array as the 2nd parameter, or at least, an array that *doesn't* include any variables whose inclusion would result in the hook being called!)
- I learned that GitHub does not yet grant API tokens at the organization level, only the individual level
- Building on that point, I learned that all GraphQL requests require GitHub API keys whereas only *certain* REST requests (e.g.: "write" operations, or reading protected user content) require one.
  - all GraphQL requests take the form of a POST request to a single API endpoint: https://api.github.com/graphql
  - So unlike REST where we can call, say, the https://api.github.com/repos/facebook/react/issues/ endpoint *without* having to pass an API token in the headers, we need a token for every single call to `/graphql`
- So this means that any version of this web application which used GraphQL queries instead of the existing REST API calls would need an API token. And so that raises a bunch of questions, namely:
  - which API key to use?
  - which account would this key be tied to; personal or "dedicated organization account"?
  - any security considerations involed in passing this key in calls made from the frontend?

> Do you feel that this assignment allowed you to showcase your abilities effectively?

- Yes!

> Are there any significant web development-related skills that you possess that were not demonstrated in this exercise? If so, what are they?

- ***UI / UX design***.
  - From birth I've always had an artistic side, and an interest in design
  - I love the challenge of:
    - designing and building the most intuitive, beautiful, and smoothest user interface & user experience possible
    - reducing the number of clicks, keystrokes, and page loads between the user and their end goal
    - creating an elegant solution to a complex problem
  - I believe that an application's overall design, coupled with small "finishing touches" like fonts / colours, spacing / layouts, animations / transitions, etc. all add up to make a huge difference for the end user, and affect:
    - how much a user enjoys using the application
    - how likely they are to *keep* using it again after that / recommend it to their friends and family
    - how much trust the user puts in the application, and in the organization itself