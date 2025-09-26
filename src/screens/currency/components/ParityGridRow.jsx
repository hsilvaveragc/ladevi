import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import InputDatePickerField from "shared/components/InputDatePickerField";
import InputTextField from "shared/components/InputTextField";

export const ParityGridRow = ({
  index,
  item,
  formikProps,
  deleteMode,
  onRemove,
  onAdd,
  selectedItem,
  editMode,
}) => (
  <div
    className="form-row"
    style={{
      display: item.shouldDelete ? "none" : "flex",
    }}
  >
    <div className="col-md-5">
      <InputTextField
        labelText="Paridad U$S y moneda local"
        name={`currencyParities.${index}.localCurrencyToDollarExchangeRate`}
        disabled={deleteMode || formikProps.values.useEuro}
        error={
          formikProps.errors.currencyParities &&
          formikProps.errors.currencyParities[index]
            ?.localCurrencyToDollarExchangeRate
        }
      />
    </div>
    <div className="col-md-5">
      <InputDatePickerField
        labelText="Paridad Fecha Inicio"
        name={`currencyParities[${index}].start`}
        disabled={deleteMode || formikProps.values.useEuro}
        error={
          formikProps.errors.currencyParities &&
          formikProps.errors.currencyParities[index]?.start
        }
      />
    </div>
    <div className="col-md-2">
      <div className="button-container">
        <button
          className="btn btn-outline-secondary"
          onClick={onRemove}
          disabled={deleteMode || formikProps.values.useEuro}
        >
          <FontAwesomeIcon icon={faMinus} size="xs" />
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={onAdd}
          disabled={deleteMode || formikProps.values.useEuro}
        >
          <FontAwesomeIcon icon={faPlus} size="xs" />
        </button>
      </div>
    </div>
  </div>
);
