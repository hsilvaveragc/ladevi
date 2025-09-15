import { bindActionCreators, compose } from "redux";
import { connect } from "react-redux";
import { getAllApiData } from "../../shared/actions/apiData";

import { logoutInit } from "../../screens/login/actionCreators";
import Routes from "./Routes";

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ logoutInit, getAllApiData }, dispatch),
});
export default compose(
  connect(
    null,
    mapDispatchToProps
  )
)(Routes);
