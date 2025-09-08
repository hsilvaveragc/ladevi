import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import ReactTable from "react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const TableSkeleton = ({ columnsCount }) => {
  return (
    <div>
      {/* Fila de encabezados */}
      <div style={{ display: "flex", marginBottom: "2px" }}>
        {[...Array(columnsCount)].map((_, index) => (
          <div key={index} style={{ flex: 1, marginRight: "2px" }}>
            <Skeleton height={30} />
          </div>
        ))}
      </div>

      {/* Filas de contenido */}
      {[...Array(5)].map((_, rowIndex) => (
        <div key={rowIndex} style={{ display: "flex", marginBottom: "2px" }}>
          {[...Array(columnsCount)].map((_, colIndex) => (
            <div key={colIndex} style={{ flex: 1, marginRight: "2px" }}>
              <Skeleton height={25} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const Table = props => {
  const {
    data,
    columns,
    buttonHandler,
    buttonText,
    loading,
    showButton,
    rowClickHandler,
    hideCursor = false,
    element,
    pageDefault,
    setPageDefault,
    pageSizeDefault,
    setPageSizeDefault,
    tableRef,
    defaultSorted,
  } = props;
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(pageSizeDefault ?? 10);
  const [sorted, setSorted] = useState(defaultSorted ?? []);

  const TableContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    z-index: 0;

    .ReactTable {
      border: none !important;
      box-shadow: none !important;
      font-size: 12px;
    }
    .ReactTable .rt-thead.-header {
      background-color: #003e6b !important;
      color: white !important;
      font-weight: bold !important;
      border: none !important;
      text-transform: uppercase;
      padding-top: 5px;
      padding-bottom: 5px;
    }
    .ReactTable .rt-tbody {
      border: 1px solid #ddd !important;
    }
    .ReactTable .rt-tr.-odd {
      background-color: #f5f5f5 !important;
    }
    .ReactTable .rt-tr.-even {
      background-color: #ffffff !important;
    }
    .ReactTable .rt-td {
      cursor: ${hideCursor ? "auto" : "pointer"};
      padding-left: 15px;
      border-right: none !important;
    }
    .ReactTable .rt-tr:hover {
      background-color: ${hideCursor ? "initial" : "inherit !important"};
    }

    .button-container {
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;
    }
    .btn {
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .spinner-small {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `;

  return (
    <>
      <TableContainer>
        {loading && <TableSkeleton columnsCount={columns.length} />}
        {!loading && (
          <>
            <ReactTable
              onFetchData={(state, instance) => {
                if (tableRef) {
                  let sortedData =
                    instance.getResolvedState().sortedData.length > 0
                      ? instance
                          .getResolvedState()
                          .sortedData.map(x => x._original)
                      : [];
                  tableRef.current = sortedData;
                }
              }}
              style={{ width: "100%" }}
              className="-striped"
              data={data}
              columns={columns}
              minRows={0}
              loading={loading}
              pageSizeOptions={props.pageSizeOptions ?? [10, 25, 50, 100]}
              pageDefault={pageSizeDefault ?? 10}
              previousText="Atrás"
              nextText="Siguiente"
              loadingText=""
              noDataText="No hay registros"
              pageText="Página"
              ofText="de"
              rowsText="filas"
              page={pageDefault ? pageDefault : page}
              pageSize={pageSizeDefault ? pageSizeDefault : pageSize}
              onPageChange={newPage => {
                return setPageDefault
                  ? setPageDefault(newPage)
                  : setPage(newPage);
              }}
              expander
              onPageSizeChange={newSize => {
                return setPageSizeDefault
                  ? setPageSizeDefault(newSize)
                  : setPageSize(newSize);
              }}
              getTdProps={(state, rowInfo, column, instance) => ({
                onClick: (e, handleOriginal) => {
                  if (rowClickHandler && column.Header !== "Borrar") {
                    rowClickHandler(
                      e,
                      rowInfo.original ? rowInfo.original : rowInfo
                    );
                  }
                },
              })}
              sorted={sorted}
              onSortedChange={newSorted => {
                setSorted(newSorted);
              }}
              defaultSortMethod={(a, b, desc) => {
                const isEmpty = value =>
                  value === null || value === undefined || value === "";

                if (isEmpty(a) && isEmpty(b)) return 0;
                if (isEmpty(a)) return -1;
                if (isEmpty(b)) return 1;

                const isNumber = value =>
                  !isNaN(parseFloat(value)) && isFinite(value);

                if (isNumber(a) && isNumber(b)) return a - b;
                if (isNumber(a)) return 1;
                if (isNumber(b)) return -1;

                return a.toString().localeCompare(b.toString());
              }}
              {...props}
            />
            <div
              className="pagination-info"
              style={{
                padding: "10px",
                textAlign: "right",
                fontWeight: "bold",
                fontSize: ".9rem",
              }}
            >
              {(() => {
                const startRecord = page * pageSize + 1;
                let endRecord = startRecord + pageSize - 1;
                if (endRecord > data.length) {
                  endRecord = data.length;
                }

                return `Mostrando ${
                  data.length > 0 ? startRecord : 0
                } a ${endRecord} de ${data.length} resultados`;
              })()}
            </div>
          </>
        )}
        {showButton || element ? (
          <div className="button-container">
            {showButton ? (
              <button
                type="button"
                className="btn btn-success"
                onClick={buttonHandler}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner-small"></div>
                    Cargando...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faUserPlus}></FontAwesomeIcon>
                    {buttonText}
                  </>
                )}
              </button>
            ) : null}
            {element ? element : null}
          </div>
        ) : null}
      </TableContainer>
    </>
  );
};

Table.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  buttonHandler: PropTypes.func,
  buttonText: PropTypes.string,
};

export default Table;
