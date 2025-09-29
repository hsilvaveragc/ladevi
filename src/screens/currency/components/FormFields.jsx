import InputTextField from 'shared/components/InputTextField';
import InputSelectField from 'shared/components/InputSelectField';
import InputCheckboxField from 'shared/components/InputCheckboxField';

export const CurrencyFields = ({
  availableCountries,
  formikProps,
  errors,
  deleteMode,
  isSupervisor,
  handleNameChange,
  handleCheckboxChange,
}) => (
  <>
    <div className='form-group'>
      <InputSelectField
        labelText='País:'
        name='countryId'
        options={availableCountries}
        disabled={deleteMode || isSupervisor}
        error={errors.CountryId}
      />
    </div>
    <div className='form-group'>
      <InputCheckboxField
        labelText='Usar Euro'
        name='useEuro'
        disabled={!!formikProps.values.name || deleteMode || isSupervisor}
        onChangeHandler={handleCheckboxChange}
        checked={formikProps.values.useEuro}
        inline
      />
    </div>
    <div className='form-group'>
      <InputTextField
        labelText='Símbolo:'
        name='name'
        disabled={deleteMode || formikProps.values.useEuro}
        error={errors.Name}
        onChangeHandler={handleNameChange}
        value={formikProps.values.name}
      />
    </div>
  </>
);
