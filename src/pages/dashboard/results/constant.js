export const colors = {
  green: "#008000",
  lightGreen: "#99cc99",
};

export function removeDuplicates(array) {
  const uniqueSubjects = [];

  array?.forEach((subject) => {
    // Check if there's already an object with the same name, category, and topic
    const isDuplicate = uniqueSubjects.some((uniqueSubject) => {
      return (
        uniqueSubject.name === subject.name &&
        uniqueSubject.category === subject.category &&
        JSON.stringify(uniqueSubject.topic) === JSON.stringify(subject.topic)
      );
    });

    // If not a duplicate, add it to the uniqueSubjects array
    if (!isDuplicate) {
      uniqueSubjects.push(subject);
    }
  });

  return uniqueSubjects;
}
export function removeDuplicates2(array) {
  const uniqueSubjects = [];

  array?.forEach((subject) => {
    // Check if there's already an object with the same name, category, and topic
    const isDuplicate = uniqueSubjects.some((uniqueSubject) => {
      return (
        uniqueSubject.subject?.toLowerCase() === subject.subject?.toLowerCase()
        // uniqueSubject.category === subject.category &&
        // JSON.stringify(uniqueSubject.topic) === JSON.stringify(subject.topic)
      );
    });

    // If not a duplicate, add it to the uniqueSubjects array
    if (!isDuplicate) {
      uniqueSubjects.push(subject);
    }
  });

  return uniqueSubjects;
}

export function updateSubjects(subjects, results) {
  results.forEach((result) => {
    const subjectToUpdate = subjects.find(
      (subject) => subject.subject === result.subject
    );

    if (subjectToUpdate) {
      // Update the subject's score and grade
      subjectToUpdate.score = result.score;
      subjectToUpdate.grade = result.grade;
    }
  });
}

export function mergeAndOverrideArrays(arr1, arr2) {
  const mergedArray = [...arr1];

  arr2?.forEach((subject2Item) => {
    const subject1Index = mergedArray.findIndex(
      (subject1Item) => subject1Item.subject === subject2Item.subject
    );

    if (subject1Index !== -1) {
      // If the subject exists in arr1, override the values
      if (
        subject2Item.score !== "0" &&
        subject2Item.grade !== "0" &&
        (mergedArray[subject1Index].score === "0" ||
          mergedArray[subject1Index].grade === "0")
      ) {
        mergedArray[subject1Index].score = subject2Item.score;
        mergedArray[subject1Index].grade = subject2Item.grade;
      }
    } else {
      // If the subject does not exist in arr1, add it to the merged array
      mergedArray.push(subject2Item);
    }
  });

  return mergedArray;
}

export function calculateAge(dateOfBirth) {
  const dob = new Date(dateOfBirth);
  const currentDate = new Date();

  if (isNaN(dob)) {
    return "Invalid date of birth";
  }

  const yearsDiff = currentDate.getFullYear() - dob.getFullYear();
  const monthsDiff = currentDate.getMonth() - dob.getMonth();
  const daysDiff = currentDate.getDate() - dob.getDate();

  if (monthsDiff < 0 || (monthsDiff === 0 && daysDiff < 0)) {
    return yearsDiff - 1;
  } else {
    return yearsDiff;
  }
}

export function calculateAgeWithMonths(dateOfBirth) {
  const dob = new Date(dateOfBirth);
  const currentDate = new Date();

  if (isNaN(dob)) {
    return "Invalid date of birth";
  }

  const yearsDiff = currentDate.getFullYear() - dob.getFullYear();
  const monthsDiff = currentDate.getMonth() - dob.getMonth();
  const daysDiff = currentDate.getDate() - dob.getDate();

  if (monthsDiff < 0 || (monthsDiff === 0 && daysDiff < 0)) {
    if (yearsDiff === 1) {
      return `${yearsDiff} year ${12 + monthsDiff} month(s)`;
    } else {
      return `${yearsDiff} year(s) ${12 + monthsDiff} month(s)`;
    }
  } else {
    if (yearsDiff === 1) {
      return `${yearsDiff} year ${monthsDiff} month(s)`;
    } else {
      return `${yearsDiff} year(s) ${monthsDiff} month(s)`;
    }
  }
}
