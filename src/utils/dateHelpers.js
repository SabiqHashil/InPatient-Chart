export const getDatesInRange = (startDate, endDate) => {
  const dates = [];
  if (!startDate || !endDate) return dates;

  const current = new Date(startDate);
  const end = new Date(endDate);

  // simple safety check to prevent infinite loops if dates are swapped
  if (current > end) return [];

  while (current <= end) {
    const day = current.getDate();
    // Short month format (e.g., Dec)
    const month = current.toLocaleString("default", { month: "short" });
    dates.push(`${day}-${month}`);
    current.setDate(current.getDate() + 1);
  }
  return dates;
};
