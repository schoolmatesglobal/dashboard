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
        const existingEntry = result.find(entry => parseInt(entry.week) === week);
        if (existingEntry) {
            recreatedArray.push(existingEntry);
        } else {
            recreatedArray.push({
                student_id: result[0].student_id,
                week: week.toString(),
                total_score: 0,
                average_percentage_score: "0.00"
            });
        }
    }

    return recreatedArray;
}