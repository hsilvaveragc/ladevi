import React from "react";
import { FieldArray } from "formik";
import { ParityGridRow } from "./ParityGridRow";

const ParityGrid = ({ editMode, deleteMode, selectedItem, formikProps }) => {
  const handleAdd = push => {
    const actualDate = new Date();
    push({
      id: 0,
      currencyId: editMode ? selectedItem.id : 0,
      localCurrencyToDollarExchangeRate: "",
      start: "",
      end: new Date(
        actualDate.getFullYear() + 100,
        actualDate.getMonth(),
        actualDate.getDate()
      ),
      shouldDelete: false,
    });
  };

  return (
    <fieldset className="parity-grid-fieldset">
      <legend>Cotizaciones U$S</legend>
      <FieldArray
        name="currencyParities"
        validateOnChange={false}
        render={({ push, remove }) => (
          <>
            {formikProps.values.currencyParities.map((item, index) => (
              <ParityGridRow
                key={index}
                index={index}
                item={item}
                formikProps={formikProps}
                deleteMode={deleteMode}
                onRemove={e => {
                  e.preventDefault();
                  if (
                    !deleteMode &&
                    (
                      formikProps.values.currencyParities.filter(
                        cp => !cp.shouldDelete
                      ) ?? []
                    ).length !== 1
                  ) {
                    if (formikProps.values.currencyParities[index].id === 0) {
                      let itemsNotDeleted = formikProps.values.currencyParities.filter(
                        (_, itemIndex) => itemIndex !== index
                      );
                      formikProps.setFieldValue(
                        "currencyParities",
                        itemsNotDeleted
                      );
                    } else {
                      formikProps.setFieldValue(
                        `currencyParities.${index}.shouldDelete`,
                        true
                      );
                    }
                  }
                }}
                onAdd={e => {
                  e.preventDefault();
                  if (!deleteMode) {
                    handleAdd(push);
                  }
                }}
                selectedItem={selectedItem}
                editMode={editMode}
              />
            ))}
          </>
        )}
      />
    </fieldset>
  );
};

export default ParityGrid;
