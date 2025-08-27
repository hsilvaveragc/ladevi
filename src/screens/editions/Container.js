import { bindActionCreators, compose } from "redux";
import { connect } from "react-redux";
import {
  initialLoad,
  addEdition,
  editEdition,
  deleteEdition,
  showEditionsAddModal,
  showEditionsEditModal,
  showEditionsDeleteModal,
  editionsFilterBy,
  getAllEditions,
  importEditions,
  importEditionsFailure,
} from "./actionCreators.js";

import {
  getEditions,
  getProducts,
  getLoading,
  getErrors,
  getShowAddModal,
  getShowEditModal,
  getShowDeleteModal,
} from "./reducer.js";

import EditionsPage from "./Page.jsx";

const mapStateToProps = state => ({
  editionsAvailable: getEditions(state),
  productsAvailable: getProducts(state),
  errors: getErrors(state),
  isLoading: getLoading(state),
  showAddModal: getShowAddModal(state),
  showEditModal: getShowEditModal(state),
  showDeleteModal: getShowDeleteModal(state),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      initialLoad,
      addEdition,
      editEdition,
      deleteEdition,
      getAllEditions,
      showAddModal: showEditionsAddModal,
      showEditModal: showEditionsEditModal,
      showDeleteModal: showEditionsDeleteModal,
      filterEditions: editionsFilterBy,
      importEditions,
      importEditionsFailure,
    },
    dispatch
  ),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(EditionsPage);
