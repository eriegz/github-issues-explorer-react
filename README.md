# **GitHub Issues Explorer (React.js)**

This is a simple frontend web application that allows users to paste in the URL of any public GitHub repo and output all issues (well, the first 100 anyways) associated with that repo. The issues are displayed in a responsive grid, each with a short snippet of the description, any associated labels, and icons to indicate whether the issue is open, closed, or a pull request.

Users can also click on 4 different filter buttons to show only open issues, closed issues, pull request issues, or all issues.

## **How To Run:**

Clone the repository to your local machine and open up a terminal at the root level. Next:

Install your Node modules:

`npm i`

Then run the application:

`npm run start`

The application will automatically open up in a new window in your computer's default web browser.

## **Notes:**

The following functionality were not implemented as they were deemed out of scope / low priority for this assignment:
- Transitions or animations between screens
- Any alt text on icons indicating what they represent (e.g.: "closed" icon)
- Any GraphQL queries, as the GitHub REST API already has a single endpoint that returns all of the data we need, and a GraphQL query would just bring performance optimizations
- Exact fonts to match those on the Figma designs (i.e.: only the default fonts from `create-react-app` were used)