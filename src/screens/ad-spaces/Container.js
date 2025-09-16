import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';

import {
  initialLoad,
  getAllProductAdvertisingSpaces,
  addProductAdvertisingSpace,
  editProductAdvertisingSpace,
  deleteProductAdvertisingSpace,
  showAddModal,
  showEditModal,
  showDeleteModal,
  filterProductAdvertisingSpace,
} from './actionCreators';
import {
  getProducts,
  getProductAdvertisingSpaces,
  getAdsSpaceLocationType,
  getLoading,
  getErrors,
  getShowAddModal,
  getShowEditModal,
  getShowDeleteModal,
} from './reducer';
import ProductAdvertisingSpacePage from './ProductAdvertisingSpacePage';

const mapStateToProps = (state) => ({
  productAdvertisingSpacesAvailable: getProductAdvertisingSpaces(state),
  availableAdsSpaceLocationType: getAdsSpaceLocationType(state),
  productsAvailable: getProducts(state),
  errors: getErrors(state),
  isLoading: getLoading(state),
  showAddModal: getShowAddModal(state),
  showEditModal: getShowEditModal(state),
  showDeleteModal: getShowDeleteModal(state),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      getAllProductAdvertisingSpaces,
      filterProductAdvertisingSpace,
      addProductAdvertisingSpace,
      editProductAdvertisingSpace,
      deleteProductAdvertisingSpace,
      showAddModal,
      showEditModal,
      showDeleteModal,
      initialLoad,
    },
    dispatch
  ),
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  ProductAdvertisingSpacePage
);
