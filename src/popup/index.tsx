import * as React from "react";
import * as ReactDOM from "react-dom";

import "./index.scss";

class Hello extends React.Component {
  render() {
    return (
      <div className="popup-padded">
        <h1>{chrome.i18n.getMessage("hello")}</h1>
      </div>
    );
  }
}

// --------------

ReactDOM.render(<Hello />, document.getElementById("root"));
