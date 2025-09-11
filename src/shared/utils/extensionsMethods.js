import { format, isValid, parseISO } from 'date-fns'; // ← Cambio: date-fns en lugar de Moment

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
  try {
    // Intentar parsear la fecha string
    const date = parseISO(this.toString());

    // Verificar si es una fecha válida
    if (isValid(date)) {
      return format(date, 'dd/MM/yyyy');
    }

    // Si no es válida, intentar crear nueva fecha
    const fallbackDate = new Date(this.toString());
    if (isValid(fallbackDate)) {
      return format(fallbackDate, 'dd/MM/yyyy');
    }

    // Si nada funciona, devolver string original
    return this.toString();
  } catch (error) {
    return this.toString();
  }
};

export {};
