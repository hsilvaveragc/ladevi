import { formatDateWithSlashes } from './dateHelpers';

Number.prototype.toLocaleCurrency = function (options = {}) {
  const defaultOptions = {
    locale: 'es-ES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return this.toLocaleString(mergedOptions.locale, {
    minimumFractionDigits: mergedOptions.minimumFractionDigits,
    maximumFractionDigits: mergedOptions.maximumFractionDigits,
  });
};

String.prototype.toLocaleDate = function () {
  return formatDateWithSlashes(this.toString());
};

export {};
