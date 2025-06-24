// eslint-disable-next-line
import { bindActionCreators, compose } from "redux";
import { connect } from "react-redux";
import HomePage from "./HomePage";

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(HomePage);
