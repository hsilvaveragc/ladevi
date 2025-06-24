import Moment from "moment";

Number.prototype.toLocaleCurrency = function(options = {}) {
  const defaultOptions = {
    locale: "es-ES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return this.toLocaleString(mergedOptions.locale, {
    minimumFractionDigits: mergedOptions.minimumFractionDigits,
    maximumFractionDigits: mergedOptions.maximumFractionDigits,
  });
};

String.prototype.toLocaleDate = function() {
  // Verifica si es un objeto Moment
  if (Moment.isMoment(this)) {
    return this.format("DD/MM/YYYY");
  }

  return Moment(this).format("DD/MM/YYYY");
};

export {};
