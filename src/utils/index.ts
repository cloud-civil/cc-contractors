export const months = {
  0: 'Jan',
  1: 'Feb',
  2: 'Mar',
  3: 'Apr',
  4: 'May',
  5: 'Jun',
  6: 'Jul',
  7: 'Aug',
  8: 'Sep',
  9: 'Oct',
  10: 'Nov',
  11: 'Dec',
};

export const formatDate = (data: any) => {
  if (!data) {
    return '';
  }
  var d = new Date();
  if (typeof data === 'object') {
    d = data;
  } else {
    d = new Date(data);
  }
  // const d = new Date(data);
  const date = d.getDate();
  const month_ = d.getMonth();
  const month = months[month_];
  const year = d.getFullYear();
  const dateString = `${date} ${month} ${year}`;
  return dateString;
};

// export const formateAmount = (number: any) => {
//   if (number) {
//     const str = number.toString();
//     let result = '';
//     for (let i = str.length - 1, count = 0; i >= 0; i--, count++) {
//       result = (count > 0 && count % 2 === 0 ? ',' : '') + str[i] + result;
//     }
//     if (result[0] === ',') {
//       result = result.slice(1);
//     }
//     return result;
//   }
// };

export const formateAmount = (number: any, decimal: any) => {
  if (number) {
    return Number(parseFloat(number).toFixed(2)).toLocaleString('en-In', {
      minimumFractionDigits: decimal || 0,
    });
  }
};

export const getDateRange = (start_date: any, end_date: any) => {
  const [start, end] = [new Date(start_date), new Date(end_date)];
  const [startDate, endDate] = [start.getDate(), end.getDate()];
  const [startMonth, endMonth] = [start.getMonth(), end.getMonth()];
  const [startYear, endYear] = [start.getFullYear(), end.getFullYear()];
  const sameYear = startYear === endYear;
  const sameMonth = startMonth === endMonth;
  let dateRangeString = '';
  if (!sameYear) {
    return formatDate(start_date) + ' - ' + formatDate(end_date);
  }
  if (sameYear) {
    dateRangeString += startYear.toString();
    if (!sameMonth) {
      return (
        `${startDate} ${months[startMonth]}-${endDate} ${months[endMonth]} ` +
        dateRangeString
      );
    } else {
      dateRangeString = months[startMonth] + ' ' + dateRangeString;
      return startDate + '-' + endDate + ' ' + dateRangeString;
    }
  }
};

export const calculateDaysLeft = (date: any) => {
  const currentDate = new Date();
  const targetDate = new Date(date);

  // Calculate the time difference in milliseconds
  const timeDifference = targetDate.getTime() - currentDate.getTime();

  // Convert the time difference from milliseconds to days
  const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  // Calculate the remaining years, months, and days
  const remainingYears = Math.floor(daysLeft / 365);
  const remainingMonths = Math.floor((daysLeft % 365) / 30);
  const remainingDays = (daysLeft % 365) % 30;

  // Generate the output message
  let result = '';
  if (remainingYears > 0) {
    result += `${remainingYears} ${remainingYears === 1 ? 'year' : 'years'}`;
    if (remainingMonths > 0 || remainingDays > 0) {
      result += ` `;
    }
  }
  if (remainingMonths > 0) {
    result += `${remainingMonths} ${
      remainingMonths === 1 ? 'month' : 'months'
    }`;
    if (remainingDays > 0) {
      result += ` `;
    }
  }
  if (remainingDays > 0) {
    result += `${remainingDays} ${remainingDays === 1 ? 'day' : 'days'}`;
  }

  return result.trim();
};

// export const getPermissions = (pm: any, id: any) => {
//   const m = (pm && pm.asObject && pm.asObject[id]) || null;
//   return (m && m.permission && JSON.parse(m.permission)) || null;
// };

export const getPermissions = (pm: any, id: any) => {
  if (Array.isArray(id)) {
    const thisids = {};
    id.forEach(ids => {
      const m = (pm && pm.asObject && pm.asObject[ids]) || null;
      thisids[ids] = m;
    });
    return thisids;
  } else if (typeof id === 'number') {
    return (pm && pm.asObject && pm.asObject[id]) || null;
  }
};
