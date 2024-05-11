export function formatTime(totalTime, submittedTime) {
  if (totalTime && submittedTime) {
    // Parse total time and submitted time
    let [totalHours, totalMinutes] = totalTime?.split(":")?.map(Number);
    let [subHours, subMinutes, subSeconds] = submittedTime
      ?.split(":")
      ?.map(Number);

    // Calculate difference in mins
    let totalMinutesCount = totalHours * 60 + totalMinutes;
    let subMinutesCount = subHours * 60 + subMinutes;
    let differenceMinutes = totalMinutesCount - subMinutesCount;

    // Format total time
    let totalFormatted = `${totalHours} hr${
      totalHours !== 1 ? "s" : ""
    } : ${totalMinutes} min${totalMinutes !== 1 ? "s" : ""}`;

    // Format submitted time
    let submittedFormatted = `${subHours} hr${
      subHours !== 1 ? "s" : ""
    } : ${subMinutes} min${subMinutes !== 1 ? "s" : ""} : ${subSeconds} sec${
      subSeconds !== 1 ? "s" : ""
    }`;

    // Format difference time
    let differenceFormatted;
    if (differenceMinutes >= 60) {
      let differenceHours = Math.floor(differenceMinutes / 60);
      let remainingMinutes = differenceMinutes % 60;
      differenceFormatted = `${differenceHours} hr${
        differenceHours !== 1 ? "s" : ""
      }`;
      if (remainingMinutes > 0) {
        differenceFormatted += `, : ${remainingMinutes} min${
          remainingMinutes !== 1 ? "s" : ""
        }`;
      }
    } else {
      differenceFormatted = `${differenceMinutes} min${
        differenceMinutes !== 1 ? "s" : ""
      }`;
    }

    // Return formatted times as an object
    return {
      totalTime: totalFormatted,
      submittedTime: submittedFormatted,
      difference: differenceFormatted,
    };
  }
}
