import React, { useState } from "react";
import ReactExport from "react-data-export";
import Moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

import Modal from "shared/components/Modal";
import { DangerButton } from "shared/components/Buttons";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const haederStyle = {
  font: {
    sz: "12",
    bold: true,
    color: { rgb: "ffffff" },
  },
  alignment: { horizontal: "center" },
  fill: {
    patternType: "solid",
    fgColor: { rgb: "003e6b" },
  },
};
const bodySizeText = "12";

const getReporteExcelfile = data => [
  {
    columns: [
      {
        title: "Producto".toLocaleUpperCase(),
        width: { wpx: 300 },
        style: haederStyle,
      },
      {
        title: "Titulo".toLocaleUpperCase(),
        width: { wpx: 300 },
        style: haederStyle,
      },
      {
        title: "Código".toLocaleUpperCase(),
        width: { wpx: 90 },
        style: haederStyle,
      },
      {
        title: "Edición Cerrada".toLocaleUpperCase(),
        width: { wpx: 150 },
        style: haederStyle,
      },
      {
        title: "Fecha Salida".toLocaleUpperCase(),
        width: { wpx: 120 },
        style: haederStyle,
      },
    ],
    data: data.map(d => [
      { value: d.product.name, style: { font: { sz: bodySizeText } } },
      { value: d.name, style: { font: { sz: bodySizeText } } },
      {
        value: d.code,
        style: { font: { sz: bodySizeText } },
      },
      {
        value: d.closed ? "Si" : "No",
        style: { font: { sz: bodySizeText } },
      },
      {
        value: Moment(d.end).format("DD/MM/YYYY"),
        style: { font: { sz: bodySizeText } },
      },
    ]),
  },
];

const encontrarCodigosRepetidos = (arr, pageSize) => {
  const indicesRepetidos = {};

  for (let i = 0; i < arr.length; i++) {
    const code = arr[i].code.toLowerCase();

    if (indicesRepetidos[code] === undefined) {
      indicesRepetidos[code] = [
        { page: Math.ceil((i + 1) / pageSize), row: (i % pageSize) + 1 },
      ];
    } else {
      indicesRepetidos[code].push({
        page: Math.ceil((i + 1) / pageSize),
        row: (i % pageSize) + 1,
      });
    }
  }

  const resultado = {};
  for (const code in indicesRepetidos) {
    if (indicesRepetidos[code].length > 1) {
      resultado[code] = indicesRepetidos[code];
    }
  }

  return resultado;
};

export default function ExcelExport({
  data,
  pageDefault,
  setPageDefault,
  pageSizeDefault,
  setPageSizeDefault,
}) {
  const [showImportError, setShowImportError] = useState(false);
  const [rowsRepeated, setRowsRepeated] = useState([]);
  return (
    <>
      <ExcelFile
        filename={`Espacios publicados por cliente ${Moment(new Date()).format(
          "DD-MM-YYYY HH:mm:ss"
        )}`}
        element={
          <div className="button-container">
            &nbsp;
            <button
              type="button"
              className="btn btn-info"
              onClick={e => {
                let result = encontrarCodigosRepetidos(data, pageSizeDefault);
                if (Object.keys(result).length > 0) {
                  setRowsRepeated(result);
                  setShowImportError(true);
                  e.stopPropagation();
                }
              }}
            >
              <FontAwesomeIcon icon={faDownload}></FontAwesomeIcon>
              Importar
            </button>
          </div>
        }
      >
        <ExcelSheet dataSet={getReporteExcelfile(data)} name="Reporte" />
      </ExcelFile>

      <Modal
        shouldClose={true}
        closeHandler={() => setShowImportError(false)}
        isOpen={showImportError}
      >
        <div style={{ width: "600px", height: "400px", overflowY: "äuto" }}>
          <div>
            <p style={{ color: "red" }}>
              <b>No es posible realizar la exportación</b>
            </p>
            {Object.keys(rowsRepeated).map(code => (
              <div>
                <p>
                  Código <b>{code}</b> repetido en
                </p>
                {Object.keys(
                  Object.groupBy(rowsRepeated[code], ({ page }) => page)
                ).map(pagina => (
                  <p>
                    * Pagina {pagina}. Fila
                    {Object.groupBy(rowsRepeated[code], ({ page }) => page)[
                      pagina
                    ].map((item, index, array) => {
                      return (
                        <>
                          <span>
                            {index === 0 && array.length > 1 ? "s " : " "}
                            {item.row}
                            {index !== array.length - 1 ? ", " : ""}
                          </span>
                        </>
                      );
                    })}
                  </p>
                ))}
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginRight: "50px",
            }}
          >
            <DangerButton onClickHandler={() => setShowImportError(false)}>
              Volver
            </DangerButton>
          </div>
        </div>
      </Modal>
    </>
  );
}
