import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PageContainer } from 'shared/utils';
import FullWidthProgressBar from 'shared/components/FullWidthProgressBar';

import { getLoading } from './reducer';
import SelectorsContainer from './components/SelectorsContainer';
import ProductionGrid from './components/ProductionGrid';

const ProductionPage = () => {
  const dispatch = useDispatch();

  const loading = useSelector(getLoading);

  useEffect(() => {
    // Inicialización si es necesaria
  }, [dispatch]);

  return (
    <>
      <FullWidthProgressBar show={loading} />

      <PageContainer>
        <div className='row' style={{ width: '100%' }}>
          <div className='col-md-12'>
            <SelectorsContainer />
          </div>
        </div>
        <div className='row' style={{ width: '100%' }}>
          <div className='col-md-12'>
            <ProductionGrid />
          </div>
        </div>
      </PageContainer>
    </>
  );
};

export default ProductionPage;
