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
        title: "País del producto".toLocaleUpperCase(),
        width: { wpx: 150 },
        style: haederStyle,
      },
      {
        title: "Salida".toLocaleUpperCase(),
        width: { wpx: 80 },
        style: haederStyle,
      },
      {
        title: "Página".toLocaleUpperCase(),
        width: { wpx: 60 },
        style: haederStyle,
      },
      {
        title: "Marca".toLocaleUpperCase(),
        width: { wpx: 150 },
        style: haederStyle,
      },
      {
        title: "Razón Social".toLocaleUpperCase(),
        width: { wpx: 200 },
        style: haederStyle,
      },
      {
        title: "Vendedor".toLocaleUpperCase(),
        width: { wpx: 180 },
        style: haederStyle,
      },
      {
        title: "Número".toLocaleUpperCase(),
        width: { wpx: 90 },
        style: haederStyle,
      },
      {
        title: "Contrato".toLocaleUpperCase(),
        width: { wpx: 200 },
        style: haederStyle,
      },
      {
        title: "Tipo de Espacio".toLocaleUpperCase(),
        width: { wpx: 180 },
        style: haederStyle,
      },
      {
        title: "Comisión sin castigo".toLocaleUpperCase(),
        width: { wpx: 160 },
        style: haederStyle,
      },
      {
        title: "Comisión con castigo".toLocaleUpperCase(),
        width: { wpx: 160 },
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
    ],
    data: data.map(d => [
      { value: d.edicion, style: { font: { sz: bodySizeText } } },
      {
        value: d.productCountry,
        style: { font: { sz: bodySizeText } },
      },
      {
        value: Moment(d.fechaSalida).format("DD-MM-YYYY"),
        style: {
          font: { sz: bodySizeText },
          alignment: { horizontal: "center" },
        },
      },
      {
        value: !d.pagina ? "" : isNaN(d.pagina) ? d.pagina : Number(d.pagina),
        style: { font: { sz: bodySizeText } },
      },
      {
        value: d.marca,
        style: { font: { sz: bodySizeText } },
      },
      {
        value: d.razonSocial,
        style: { font: { sz: bodySizeText } },
      },
      {
        value: d.vendedor,
        style: { font: { sz: bodySizeText } },
      },
      {
        value: Number(d.numero),
        style: { font: { sz: bodySizeText } },
      },
      {
        value: d.contrato,
        style: { font: { sz: bodySizeText } },
      },
      {
        value: d.tipoEspacio,
        style: { font: { sz: bodySizeText } },
      },
      {
        value: d.comisionData.comisionAntes,
        style: { font: { sz: bodySizeText }, numFmt: "0.00" },
      },
      {
        value: d.comisionData.comisionDespues,
        style: { font: { sz: bodySizeText }, numFmt: "0.00" },
      },
      {
        value: !d.quantity
          ? ""
          : isNaN(d.quantity)
          ? d.quantity
          : Number(d.quantity),
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
        value: `${d.billingCondition} ${d.invoice}`,
        style: { font: { sz: bodySizeText } },
      },
    ]),
  },
];

const getResumenPorVendedorExcelfile = data => [
  {
    columns: [
      {
        title: "Vendedor".toLocaleUpperCase(),
        width: { wpx: 250 },
        style: haederStyle,
      },
      {
        title: "Espacios Moneda Local".toLocaleUpperCase(),
        width: { wpx: 200 },
        style: haederStyle,
      },
      {
        title: "Comisiones Moneda Local".toLocaleUpperCase(),
        width: { wpx: 200 },
        style: haederStyle,
      },
      {
        title: "Espacios Dólares".toLocaleUpperCase(),
        width: { wpx: 150 },
        style: haederStyle,
      },
      {
        title: "Comisiones Dólares".toLocaleUpperCase(),
        width: { wpx: 150 },
        style: haederStyle,
      },
    ],
    data: data.map(d => [
      { value: d.seller, style: { font: { sz: bodySizeText } } },
      {
        value: d.totals.spacesLocalCurrency,
        style: { font: { sz: bodySizeText }, numFmt: "0.00" },
      },
      {
        value: d.totals.comisionsLocalCurrency,
        style: { font: { sz: bodySizeText }, numFmt: "0.00" },
      },
      {
        value: d.totals.spacesDolares,
        style: { font: { sz: bodySizeText }, numFmt: "0.00" },
      },
      {
        value: d.totals.comisionDolares,
        style: { font: { sz: bodySizeText }, numFmt: "0.00" },
      },
    ]),
  },
];

const getResumenPorEdicionExcelfile = data => [
  {
    columns: [
      {
        title: "Edición".toLocaleUpperCase(),
        width: { wpx: 250 },
        style: haederStyle,
      },
      {
        title: "Espacios Moneda Local".toLocaleUpperCase(),
        width: { wpx: 200 },
        style: haederStyle,
      },
      {
        title: "Comisiones Moneda Local".toLocaleUpperCase(),
        width: { wpx: 200 },
        style: haederStyle,
      },
      {
        title: "Espacios Dólares".toLocaleUpperCase(),
        width: { wpx: 150 },
        style: haederStyle,
      },
      {
        title: "Comisiones Dólares".toLocaleUpperCase(),
        width: { wpx: 150 },
        style: haederStyle,
      },
    ],
    data: data.map(d => [
      { value: d.productEdition, style: { font: { sz: bodySizeText } } },
      {
        value: d.totals.spacesLocalCurrency,
        style: { font: { sz: bodySizeText }, numFmt: "0.00" },
      },
      {
        value: d.totals.comisionsLocalCurrency,
        style: { font: { sz: bodySizeText }, numFmt: "0.00" },
      },
      {
        value: d.totals.spacesDolares,
        style: { font: { sz: bodySizeText }, numFmt: "0.00" },
      },
      {
        value: d.totals.comisionDolares,
        style: { font: { sz: bodySizeText }, numFmt: "0.00" },
      },
    ]),
  },
];

const getResumenPorCuentaExcelfile = data => [
  {
    columns: [
      {
        title: "Moneda".toLocaleUpperCase(),
        width: { wpx: 100 },
        style: haederStyle,
      },
      {
        title: "IVA".toLocaleUpperCase(),
        width: { wpx: 100 },
        style: haederStyle,
      },
      {
        title: "Espacios Moneda Local".toLocaleUpperCase(),
        width: { wpx: 200 },
        style: haederStyle,
      },
      {
        title: "Comisiones Moneda Local".toLocaleUpperCase(),
        width: { wpx: 200 },
        style: haederStyle,
      },
      {
        title: "Espacios Dólares".toLocaleUpperCase(),
        width: { wpx: 150 },
        style: haederStyle,
      },
      {
        title: "Comisiones Dólares".toLocaleUpperCase(),
        width: { wpx: 150 },
        style: haederStyle,
      },
    ],
    data: data.map(d => [
      { value: d.currency, style: { font: { sz: bodySizeText } } },
      { value: d.iva, style: { font: { sz: bodySizeText }, numFmt: "0.00" } },
      {
        value: d.totals.spacesLocalCurrency,
        style: { font: { sz: bodySizeText }, numFmt: "0.00" },
      },
      {
        value: d.totals.comisionsLocalCurrency,
        style: { font: { sz: bodySizeText }, numFmt: "0.00" },
      },
      {
        value: d.totals.spacesDolares,
        style: { font: { sz: bodySizeText }, numFmt: "0.00" },
      },
      {
        value: d.totals.comisionDolares,
        style: { font: { sz: bodySizeText }, numFmt: "0.00" },
      },
    ]),
  },
];

export default function ExcelExport({ data }) {
  return (
    <ExcelFile
      filename={`Espacios publicados por vendedor ${Moment(new Date()).format(
        "DD-MM-YYYY HH:mm:ss"
      )}`}
      element={
        <button type="button" className="btn">
          <img src={excelIcon} width="26" height="32" />
        </button>
      }
    >
      <ExcelSheet dataSet={getReporteExcelfile(data.main)} name="Reporte" />
      <ExcelSheet
        dataSet={getResumenPorVendedorExcelfile(data.bySeller)}
        name="Resumen por vendedor"
      />
      <ExcelSheet
        dataSet={getResumenPorEdicionExcelfile(data.byEdition)}
        name="Resumen por edición"
      />
      <ExcelSheet
        dataSet={getResumenPorCuentaExcelfile(data.byCuenta)}
        name="Resumen por cuenta"
      />
    </ExcelFile>
  );
}
