import React from "react";
import ReactDOM from "react-dom";
import configureStore from "./shared/store";
import Root from "shell/Root";

import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import "react-table/react-table.css";
import "react-datepicker/dist/react-datepicker.css";
import "./globalStyles.css";

const startApp = () => {
  const store = configureStore();
  const rootEl = document.getElementById("root");
  ReactDOM.render(<Root store={store} />, rootEl);
};

startApp();
