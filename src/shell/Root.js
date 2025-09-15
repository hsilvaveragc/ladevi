import React from "react";
import { Provider } from "react-redux";
import AppContainer from "../shell/app/AppContainer";

const Root = ({ store }) => (
  <Provider store={store}>
    <AppContainer />
  </Provider>
);

export default Root;
