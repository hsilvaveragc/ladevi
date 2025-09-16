import React, { useEffect, useState } from 'react';
import { PageContainer } from 'shared/utils';

import EuroPage from '../euro-parity/components/Page';

import Modals from './components/Modals';
import CurrencyTable from './components/CurrencyTable';

export default function Page(props) {
  const [selectedItem, setSelectedItem] = useState({});

  useEffect(() => {
    props.actions.initialLoad();
  }, [props.actions]);

  const handleEdit = (item) => {
    setSelectedItem(item);
    props.actions.showEditModal();
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    props.actions.showDeleteModal();
  };

  return (
    <PageContainer>
      <Modals
        {...props}
        selectedItem={selectedItem}
        isLoading={props.isLoading}
      />
      <CurrencyTable
        data={props.data}
        isLoading={props.isLoading}
        showAddModal={props.actions.showAddModal}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <EuroPage {...props} />
    </PageContainer>
  );
}
