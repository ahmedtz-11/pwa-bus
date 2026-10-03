// Change the currency symbol here.
export const money = (n) => (n < 0 ? "-" : "") + "$" + Math.abs(n).toFixed(2);
