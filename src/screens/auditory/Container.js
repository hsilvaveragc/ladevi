import { bindActionCreators, compose } from "redux";
import { connect } from "react-redux";

import Page from "./Page";

import { getAuditoryEvents } from "./actionCreators";

import { getEvents, getErrors, getLoading } from "./reducer";

const mapStateToProps = state => ({
  data: getEvents(state),
  errors: getErrors(state),
  isLoading: getLoading(state),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getAuditoryEvents,
    },
    dispatch
  ),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Page);
