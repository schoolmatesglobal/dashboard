export function sortByDateDescending(array) {
  // Define a mapping of month names to their respective numerical values
  const monthMap = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  // Custom comparison function to sort dates in descending order
  function compareDates(a, b) {
    const [dayA, monthA, yearA] = a.paid_at.split(" ");
    const [dayB, monthB, yearB] = b.paid_at.split(" ");

    const dateA = new Date(yearA, monthMap[monthA], dayA);
    const dateB = new Date(yearB, monthMap[monthB], dayB);

    // console.log({dateA, dateB})

    return dateA - dateB;
  }

  return array.sort(compareDates);
}
