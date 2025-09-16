import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';

import {
  getAllProductTypes,
  addProduct,
  editProduct,
  deleteProduct,
  initialLoad,
  showAddModal,
  showEditModal,
  showDeleteModal,
  getAllProducts,
  filterProducts,
} from './actionCreators.js';
import {
  getProducts,
  getCountries,
  getProductTypes,
  getAdsSpaceLocationType,
  getIsLoading,
  getShowAddModal,
  getShowEditModal,
  getShowDeleteModal,
  getErrors,
  getXubioProducts,
  getXubioProductsComtur,
} from './reducer.js';
import ProductsPage from './ProductsPage';

const mapStateToProps = (state) => ({
  products: getProducts(state),
  availableCountries: getCountries(state),
  availableAdsSpaceLocationType: getAdsSpaceLocationType(state),
  productTypes: getProductTypes(state),
  isLoading: getIsLoading(state),
  showAddModal: getShowAddModal(state),
  showEditModal: getShowEditModal(state),
  showDeleteModal: getShowDeleteModal(state),
  errors: getErrors(state),
  xubioProducts: getXubioProducts(state),
  xubioProductsComtur: getXubioProductsComtur(state),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      initialLoad,
      getAllProductTypes,
      addProduct,
      editProduct,
      deleteProduct,
      showAddModal,
      showEditModal,
      showDeleteModal,
      getAllProducts,
      filterProducts,
    },
    dispatch
  ),
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  ProductsPage
);
