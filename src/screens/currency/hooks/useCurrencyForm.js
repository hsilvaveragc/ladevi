import { useState } from "react";

export const useCurrencyForm = formikProps => {
  const [backupParities, setBackupParities] = useState(null);
  const dummyParity = {
    id: 0,
    start: "",
    end: "",
    localCurrencyToDollarExchangeRate: "",
    shouldDelete: false,
  };

  const handleCheckboxChange = e => {
    const { checked } = e.target;
    formikProps.setFieldValue("useEuro", checked);

    if (checked) {
      setBackupParities([...formikProps.values.currencyParities]);
      formikProps.setFieldValue("currencyParities", [dummyParity]);
      formikProps.setFieldValue("name", "");
    } else if (backupParities) {
      formikProps.setFieldValue("currencyParities", backupParities);
    }
  };

  const handleNameChange = e => {
    const { value } = e.target;
    formikProps.setFieldValue("name", value);
    if (value) {
      formikProps.setFieldValue("useEuro", false);
      if (backupParities) {
        formikProps.setFieldValue("currencyParities", backupParities);
        setBackupParities(null);
      }
    }
  };

  return {
    handleCheckboxChange,
    handleNameChange,
    backupParities,
  };
};
