import { convertToEthiopianDateMoreEnhanced } from "./dateConverter";

export const formatEthiopianDate = (date) => {
  const ethiopianDate = convertToEthiopianDateMoreEnhanced(date);
  return `${ethiopianDate.dayName} ${ethiopianDate.day}-${ethiopianDate.month}-${ethiopianDate.year}`;
};
