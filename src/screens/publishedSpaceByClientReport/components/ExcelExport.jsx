import React from "react";
import ReactExport from "react-data-export";
import Moment from "moment";
import excelIcon from "shared/images/iconExcel.png";

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
        title: "Edición".toLocaleUpperCase(),
        width: { wpx: 80 },
        style: haederStyle,
      },
      {
        title: "Salida".toLocaleUpperCase(),
        width: { wpx: 80 },
        style: haederStyle,
      },
      {
        title: "Tipo de Espacio".toLocaleUpperCase(),
        width: { wpx: 300 },
        style: haederStyle,
      },
      {
        title: "Cantidad".toLocaleUpperCase(),
        width: { wpx: 80 },
        style: haederStyle,
      },
      {
        title: "Moneda".toLocaleUpperCase(),
        width: { wpx: 80 },
        style: haederStyle,
      },
      {
        title: "Importe".toLocaleUpperCase(),
        width: { wpx: 80 },
        style: haederStyle,
      },
      {
        title: "Nº Factura".toLocaleUpperCase(),
        width: { wpx: 100 },
        style: haederStyle,
      },
      {
        title: "N°Cont.".toLocaleUpperCase(),
        width: { wpx: 90 },
        style: haederStyle,
      },
      {
        title: "Contrato".toLocaleUpperCase(),
        width: { wpx: 400 },
        style: haederStyle,
      },
    ],
    data: data.map(d => [
      { value: d.edicion, style: { font: { sz: bodySizeText } } },
      {
        value: Moment(d.salida).format("DD-MM-YYYY"),
        style: {
          font: { sz: bodySizeText },
          alignment: { horizontal: "center" },
        },
      },
      {
        value: d.tipoEspacio,
        style: { font: { sz: bodySizeText } },
      },
      {
        value: d.cantidad,
        style: { font: { sz: bodySizeText } },
      },
      {
        value: d.moneda,
        style: { font: { sz: bodySizeText } },
      },
      {
        value: d.importe,
        style: { font: { sz: bodySizeText }, numFmt: "0.00" },
      },
      {
        value: `${d.billingCondition} ${d.factura}`,
        style: { font: { sz: bodySizeText } },
      },
      {
        value: d.numero,
        style: { font: { sz: bodySizeText } },
      },
      {
        value: d.contrato,
        style: { font: { sz: bodySizeText } },
      },
    ]),
  },
];

export default function ExcelExport({ data }) {
  return (
    <ExcelFile
      filename={`Espacios publicados por cliente ${Moment(new Date()).format(
        "DD-MM-YYYY HH:mm:ss"
      )}`}
      element={
        <button type="button" className="btn">
          <img src={excelIcon} width="26" height="32" />
        </button>
      }
    >
      <ExcelSheet dataSet={getReporteExcelfile(data)} name="Reporte" />
    </ExcelFile>
  );
}
