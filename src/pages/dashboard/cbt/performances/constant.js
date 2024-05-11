export function formatTime2(totalTime, submittedTime) {
  if (totalTime && submittedTime) {
    // Parse total time and submitted time
    let [totalHours, totalMinutes] = totalTime?.split(":")?.map(Number);
    let [subHours, subMinutes, subSeconds] = submittedTime
      ?.split(":")
      ?.map(Number);

    // Calculate difference in minutes
    let totalMinutesCount = totalHours * 60 + totalMinutes;
    let subMinutesCount = subHours * 60 + subMinutes;
    let differenceMinutes = totalMinutesCount - subMinutesCount;

    // Format total time
    let totalFormatted = `${totalHours} hour${
      totalHours !== 1 ? "s" : ""
    }, ${totalMinutes} minute${totalMinutes !== 1 ? "s" : ""}`;

    // Format submitted time
    let submittedFormatted = `${subHours} hour${
      subHours !== 1 ? "s" : ""
    }, ${subMinutes} minute${
      subMinutes !== 1 ? "s" : ""
    }, ${subSeconds} second${subSeconds !== 1 ? "s" : ""}`;

    console.log({ totalMinutesCount, subMinutesCount, differenceMinutes });

    // Return formatted times as an object
    return {
      totalTime: totalFormatted,
      submittedTime: submittedFormatted,
      difference: differenceMinutes,
      totalTimeInMinutes: totalMinutesCount,
    };
  }
}

export function recreateArray(result) {
  // Find the highest week value
  let highestWeek = 0;
  for (const entry of result) {
    const week = parseInt(entry.week);
    if (week > highestWeek) {
      highestWeek = week;
    }
  }

  // Recreate the array with missing weeks
  const recreatedArray = [];
  for (let week = 1; week <= highestWeek; week++) {
    const existingEntry = result.find((entry) => parseInt(entry.week) === week);
    if (existingEntry) {
      recreatedArray.push(existingEntry);
    } else {
      recreatedArray.push({
        student_id: result[0].student_id,
        week: week.toString(),
        total_score: 0,
        average_percentage_score: "0.00",
      });
    }
  }

  return recreatedArray;
}

function recreateArray2(result) {
  // Find the highest week value
  let highestWeek = 0;
  for (const entry of result) {
    const week = parseInt(entry.week);
    if (week > highestWeek) {
      highestWeek = week;
    }
  }

  // Recreate the array with missing weeks
  const recreatedArray = [];
  for (let week = 1; week <= highestWeek; week++) {
    const existingEntry = result.find((entry) => parseInt(entry.week) === week);
    if (existingEntry) {
      recreatedArray.push(existingEntry);
    } else {
      recreatedArray.push({
        student_id: result[0].student_id,
        week: week.toString(),
        total_score: 0,
        average_percentage_score: "0.00",
      });
    }
  }

  return recreatedArray;
}

export function generateNewArray(result) {
  // Group entries by student_id
  const groupedByStudent = {};
  for (const entry of result) {
    if (!groupedByStudent[entry.student_id]) {
      groupedByStudent[entry.student_id] = [];
    }
    groupedByStudent[entry.student_id].push(entry);
  }

  // Recreate array for each student and sum up scores for each week
  const newArray = [];
  for (const studentId in groupedByStudent) {
    const recreatedResult = recreateArray2(groupedByStudent[studentId]);
    const weekScores = Array.from({ length: recreatedResult.length }, () => 0);
    for (let i = 0; i < recreatedResult.length; i++) {
      weekScores[i] = parseInt(recreatedResult[i].total_score);
    }
    newArray.push({ student_id: studentId, weekScores: weekScores });
  }

  return newArray;
}
