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
