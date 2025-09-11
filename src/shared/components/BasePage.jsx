import { useState, useEffect } from 'react';
import { PageContainer } from 'shared/utils';

const BasePage = ({
  // Componentes
  FilterComponent,
  TableComponent,
  ModalComponent,

  // Props y datos
  filterProps,
  tableProps,
  tableData,
  modalProps,
  actions,
  isLoading,

  // Callbacks
  initialLoad,
  beforeEdit,
  beforeDelete,

  // Props adicionales
  ...otherProps
}) => {
  const [selectedItem, setSelectedItem] = useState({});
  const [params, setParams] = useState();

  useEffect(() => {
    if (initialLoad) {
      initialLoad();
    }
  }, [initialLoad]);

  const handleEdit = (item) => {
    setSelectedItem(item);

    if (beforeEdit) {
      beforeEdit(item, actions);
    }

    if (actions.showEditModal) {
      actions.showEditModal();
    }
  };

  const handleDelete = (item) => {
    setSelectedItem(item);

    if (beforeDelete) {
      beforeDelete(item, actions);
    }

    if (actions.showDeleteModal) {
      actions.showDeleteModal();
    }
  };

  const handleChangeParams = (newParams) => {
    setParams(newParams);
  };

  // Propiedades comunes para todos los componentes
  const commonProps = {
    isLoading,
    ...otherProps,
  };

  return (
    <PageContainer>
      {FilterComponent && (
        <FilterComponent
          {...commonProps}
          {...filterProps}
          handleChangeParams={handleChangeParams}
        />
      )}

      {TableComponent && (
        <TableComponent
          {...commonProps}
          {...tableProps}
          data={tableData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          showAddModal={actions.showAddModal}
        />
      )}
      {ModalComponent && (
        <ModalComponent
          {...commonProps}
          {...modalProps}
          params={params}
          selectedItem={selectedItem}
        />
      )}
    </PageContainer>
  );
};

export default BasePage;
