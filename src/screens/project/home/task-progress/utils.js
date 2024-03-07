export const calculateDays = (startDate, endDate) => {
  const startTimestamp = new Date(startDate).getTime();
  const endTimestamp = new Date(endDate).getTime();
  const differenceInMilliseconds = endTimestamp - startTimestamp;
  const differenceInDays = Math.ceil(
    differenceInMilliseconds / (1000 * 60 * 60 * 24),
  );
  return differenceInDays;
};
