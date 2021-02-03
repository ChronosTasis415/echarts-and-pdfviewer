export default class DisplayOptionHelper {
  static transform(val, displayOptions) {
    if (val === null) return null;
    displayOptions = displayOptions || {};
    let result = val;
    let originResult = {};
    if (displayOptions) {
      let numValue = val;
      const unit = displayOptions.unit || '';
      // error handling, if val is a string, just try to parse it to number
      numValue = +numValue;
      // process unit
      if (unit === '万') {
        numValue /= 10000;
      } else if (unit === '百万') {
        numValue /= 1000000;
      } else if (unit === '千万') {
        numValue /= 10000000;
      } else if (unit === '亿') {
        numValue /= 100000000;
      } else if (unit === 'percent') {
        numValue *= 100;
      }
      
      // process precision
      if (numValue !== undefined && !Number.isNaN(numValue)) {
        if (displayOptions.precision) {
          // const sign = numValue < 0 ? '-' : ''; // new Intl.NumberFormat().format('-0') === '0', to fix this;
          // numValue = Math.abs(numValue);
          // const precision = displayOptions.precision;
          // const valueStr = numValue.toFixed(precision);
          // const parts = valueStr.split('.');
          // const valueIntFormat = new Intl.NumberFormat().format(parts[0]);
          // if (parts.length === 1) { // no decimal part
          //   result = sign + valueIntFormat;
          // } else if (parts.length === 2) {
          //   result = `${sign}${valueIntFormat}.${parts[1]}`;
          // }
          result = new Intl.NumberFormat(['en-US'], {
            maximumFractionDigits: displayOptions.precision,
            minimumFractionDigits: displayOptions.precision
          }).format(numValue);
          originResult = {
            result,
            numValue
          };
        } else {
          result = new Intl.NumberFormat(['en-US']).format(numValue);
          originResult = {
            result,
            numValue
          };
        }
      } else { // if not a number
        result = undefined;
      }
    }
    return originResult;
  }

  static getUnit(displayOptions) {
    let result = '';
    if (displayOptions) {
      const unit = displayOptions.unit || '';
      if (unit === 'percent') {
        result = '%';
      } else {
        result = unit;
      }
    }
    return result;
  }
}
