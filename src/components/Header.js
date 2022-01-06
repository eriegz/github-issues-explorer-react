import React from 'react';
import {
  useLocation
} from "react-router-dom";

import "./Header.css";

function Header() {
  let repoUrl = new URLSearchParams(useLocation().search).get("r");
  return (
    <div id="header-container">
      <span id="header-app-title">GitHub Issue Viewer</span>
      <span id="header-repo-url">{repoUrl}</span>
    </div>
  );
}

export default Header;