export function formatCurrency(value) {
  // Convert the number to a string and use a regular expression to add commas as thousand separators
  return `₦${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}
