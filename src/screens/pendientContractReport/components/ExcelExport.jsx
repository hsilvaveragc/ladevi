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
        title: "Cliente".toLocaleUpperCase(),
        width: { wpx: 300 },
        style: haederStyle,
      },
      {
        title: "N°Cont.".toLocaleUpperCase(),
        width: { wpx: 90 },
        style: haederStyle,
      },
      {
        title: "Contrato".toLocaleUpperCase(),
        width: { wpx: 300 },
        style: haederStyle,
      },
      {
        title: "Tipo de Espacio".toLocaleUpperCase(),
        width: { wpx: 180 },
        style: haederStyle,
      },
      {
        title: "Cant. Publicada".toLocaleUpperCase(),
        width: { wpx: 120 },
        style: haederStyle,
      },
      {
        title: "Saldo".toLocaleUpperCase(),
        width: { wpx: 80 },
        style: haederStyle,
      },
      {
        title: "Moneda".toLocaleUpperCase(),
        width: { wpx: 80 },
        style: haederStyle,
      },
      {
        title: "Importe Unitario".toLocaleUpperCase(),
        width: { wpx: 120 },
        style: haederStyle,
      },
      {
        title: "Moneda".toLocaleUpperCase(),
        width: { wpx: 80 },
        style: haederStyle,
      },
      {
        title: "Imp. no publicado".toLocaleUpperCase(),
        width: { wpx: 120 },
        style: haederStyle,
      },
      {
        title: "Factura".toLocaleUpperCase(),
        width: { wpx: 160 },
        style: haederStyle,
      },
    ],
    data: data.map(d => [
      { value: d.client, style: { font: { sz: bodySizeText } } },
      { value: Number(d.numero), style: { font: { sz: bodySizeText } } },
      {
        value: d.contrato,
        style: { font: { sz: bodySizeText } },
      },
      {
        value: d.spaceType,
        style: { font: { sz: bodySizeText } },
      },
      {
        value: d.selledQuantity,
        style: { font: { sz: bodySizeText } },
      },
      {
        value: d.balance,
        style: { font: { sz: bodySizeText } },
      },
      {
        value: d.moneda,
        style: { font: { sz: bodySizeText } },
      },
      {
        value: d.amount,
        style: { font: { sz: bodySizeText }, numFmt: "0.00" },
      },
      {
        value: d.moneda,
        style: { font: { sz: bodySizeText } },
      },
      {
        value: d.pendientAmount,
        style: { font: { sz: bodySizeText }, numFmt: "0.00" },
      },
      {
        value: `${d.billingCondition} ${d.invoice}`,
        style: { font: { sz: bodySizeText } },
      },
    ]),
  },
];

export default function ExcelExport({ data }) {
  return (
    <ExcelFile
      filename={`Contratos pendientes por vendedor ${Moment(new Date()).format(
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
