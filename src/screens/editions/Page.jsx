import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { PageContainer } from 'shared/utils';

import { initialLoad } from './actionCreators';
import Filters from './components/Filters';
import ExcelImport from './components/ExcelImport';
import EditionsTable from './components/EditionsTable';
import EditionModal from './components/EditionModal';

const EditionsPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initialLoad());
  }, [dispatch]);

  return (
    <PageContainer>
      <Filters />
      <EditionsTable element={<ExcelImport />} />
      <EditionModal />
    </PageContainer>
  );
};

export default EditionsPage;
