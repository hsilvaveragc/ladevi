import React, { useEffect } from 'react';
import styled from 'styled-components';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';

import { format } from 'date-fns';
const { SearchBar } = Search;

const PageContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  h2 {
    margin-bottom: 3rem;
  }
  .table .thead-light th {
    background-color: #003e6b;
    color: #ffffff;
  }
`;

const AuditoryPage = (props) => {
  useEffect(() => {
    props.actions.getAuditoryEvents();
  }, [props.actions]);

  const customTotal = (from, to, size) => (
    <span
      className='react-bootstrap-table-pagination-total'
      style={{ marginLeft: '15px' }}
    >
      Mostrando {from} de {to} de {size} Resultados
    </span>
  );

  const columns = [
    {
      dataField: 'date',
      text: 'Fecha',
      headerStyle: () => ({ width: '15%', fontSize: '12px' }),
      formatter: (fecha) => format(fecha, 'DD-MM-YYYY HH:mm:ss'),
      style: () => ({ fontSize: '12px' }),
    },
    {
      dataField: 'user',
      text: 'Usuario',
      headerStyle: () => ({ width: '15%', fontSize: '12px' }),
      style: () => ({ fontSize: '12px' }),
    },
    {
      dataField: 'entity',
      text: 'Entidad',
      headerStyle: () => ({ width: '15%', fontSize: '12px' }),
      style: () => ({ fontSize: '12px' }),
    },
    {
      dataField: 'auditMessage',
      text: 'Evento',
      headerStyle: () => ({ width: '55%', fontSize: '12px' }),
      style: () => ({ fontSize: '12px' }),
    },
  ];

  const options = {
    // Tooltips botones de paginación
    prePageTitle: 'página previa',
    nextPageTitle: 'próxima página',
    firstPageTitle: 'primer página',
    lastPageTitle: 'última página',
    showTotal: true,
    paginationTotalRenderer: customTotal,
  };

  return (
    <PageContainer>
      {props.data.length > 0 && (
        <div style={{ margin: '15px 15px auto 15px' }}>
          <ToolkitProvider
            keyField='id'
            data={props.data}
            columns={columns}
            search
          >
            {(props) => (
              <div>
                <SearchBar {...props.searchProps} placeholder='Buscar' />
                <hr />
                <BootstrapTable
                  {...props.baseProps}
                  striped
                  hover
                  condensed
                  bootstrap4
                  headerClasses='thead-light'
                  pagination={paginationFactory(options)}
                />
              </div>
            )}
          </ToolkitProvider>
        </div>
      )}
    </PageContainer>
  );
};

export default AuditoryPage;
