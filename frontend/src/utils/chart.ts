export const percentageSeries = (
  values: number[]
): number[] => {
  const base = values[0];

  return values.map(
    (value) =>
      ((value - base) / base) * 100
  );
};