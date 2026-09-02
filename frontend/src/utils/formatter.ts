export const formatCurrency = (
  value: number
): string => {
  return `₹${value.toFixed(2)}`;
};

export const formatPercentage = (
  value: number
): string => {
  return `${value.toFixed(2)}%`;
};