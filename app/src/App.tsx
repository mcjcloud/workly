import React from "react";
import logo from "./logo.svg";
import "./App.css";

import Categories from "./Categories";
import EmbeddedContent from "./EmbeddedContent";

function App() {
  return (
    <div className="flex-1 flex flex-col w-full h-full">
      <h2>Pick a tab, any tab.</h2>
      <div className="flex-1 flex flex-row">
        <Categories />
        <EmbeddedContent />
      </div>
    </div>
  );
}

export default App;
