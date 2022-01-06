import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import './App.css';

import Homepage from "./components/Homepage/index";
import Header from "./components/Header";
import Issues from "./components/IssuesPage/index";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Homepage />
          </Route>

          <Route path="/issues">
            <div id="header-and-content-wrapper">
              <Header />
              <Issues />
            </div>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
