// eslint-disable-next-line
import { bindActionCreators, compose } from "redux";
import { connect } from "react-redux";

import {
  initialLoad,
  editUserInit,
  addUserInit,
  deleteUserInit,
  showAddModal,
  showEditModal,
  showDeleteModal,
  getUsersInit,
  filterUsers,
} from "./actionCreators";

import {
  getUsers,
  getCountries,
  getAppRoles,
  getLoading,
  getErrors,
  getShowAddModal,
  getShowEditModal,
  getShowDeleteModal,
} from "./reducer";

import UsersPage from "./UsersPage";

const mapStateToProps = state => ({
  users: getUsers(state),
  isLoading: getLoading(state),
  errors: getErrors(state),
  showAddModal: getShowAddModal(state),
  showEditModal: getShowEditModal(state),
  showDeleteModal: getShowDeleteModal(state),
  availableCountries: getCountries(state),
  availableAppRoles: getAppRoles(state),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      initialLoad,
      editUserInit,
      addUserInit,
      deleteUserInit,
      showAddModal,
      showDeleteModal,
      showEditModal,
      getUsersInit,
      filterUsers,
    },
    dispatch
  ),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(UsersPage);
