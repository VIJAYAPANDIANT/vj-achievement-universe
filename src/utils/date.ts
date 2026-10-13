const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Formats a YYYY-MM-DD or YYYY-MM date string into "Month DD, YYYY" (e.g. "October 07, 2026")
 */
export const formatDateWithMonth = (dateStr: string): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  const year = parts[0];
  const monthNum = parts[1] ? parseInt(parts[1], 10) : null;
  const day = parts[2] ? parseInt(parts[2], 10) : null;

  if (monthNum && monthNum >= 1 && monthNum <= 12) {
    const month = MONTH_NAMES[monthNum - 1];
    return day ? `${month} ${day < 10 ? '0' + day : day}, ${year}` : `${month} ${year}`;
  }
  return dateStr;
};

/**
 * Formats a YYYY-MM-DD or YYYY-MM date string into short "Mon DD, YYYY" (e.g. "Oct 07, 2026")
 */
export const formatShortDateWithMonth = (dateStr: string): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  const year = parts[0];
  const monthNum = parts[1] ? parseInt(parts[1], 10) : null;
  const day = parts[2] ? parseInt(parts[2], 10) : null;

  if (monthNum && monthNum >= 1 && monthNum <= 12) {
    const month = MONTH_NAMES_SHORT[monthNum - 1];
    return day ? `${month} ${day < 10 ? '0' + day : day}, ${year}` : `${month} ${year}`;
  }
  return dateStr;
};

export const getMonthName = (monthNumOrStr: number | string): string => {
  const m = typeof monthNumOrStr === 'string' ? parseInt(monthNumOrStr, 10) : monthNumOrStr;
  return MONTH_NAMES[m - 1] || '';
};
