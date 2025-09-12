// eslint-disable-next-line
import { bindActionCreators, compose } from "redux";
import { connect } from "react-redux";
import SettingsPage from "./SettingsPage";

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SettingsPage);
