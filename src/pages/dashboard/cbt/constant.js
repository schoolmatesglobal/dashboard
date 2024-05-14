export function parseDuration(durationString) {
  const [hourStr, minuteStr] = durationString.split(":");
  const hour = parseInt(hourStr, 10);
  const minutes = parseInt(minuteStr, 10);

  return {
    hour,
    minutes,
  };
}

export function calculateNumberOfPages(arrayLength, itemsPerPage) {
  return Math.ceil(arrayLength / itemsPerPage);
}

export const getColumns = ({ indexStatus }) => {
  switch (indexStatus) {
    case "all":
      return [
        {
          Header: "",
          accessor: "image",
        },
        {
          Header: "id",
          accessor: "id",
        },
        {
          Header: "First Name",
          accessor: "firstname",
        },
        {
          Header: "Surname",
          accessor: "surname",
        },
        {
          Header: "Middle Name",
          accessor: "middlename",
        },
        {
          Header: "Phone Number",
          accessor: "phone_number",
        },
        {
          Header: "Status",
          accessor: "status",
        },
        {
          Header: "Admission Number",
          accessor: "admission_number",
        },
        {
          Header: "Present Class",
          accessor: "present_class",
        },
        {
          Header: "Gender",
          accessor: "gender",
        },
      ];
    case "alumni":
      return [
        {
          Header: "",
          accessor: "image",
        },
        {
          Header: "id",
          accessor: "id",
        },
        {
          Header: "First Name",
          accessor: "firstname",
        },
        {
          Header: "Surname",
          accessor: "surname",
        },
        {
          Header: "Middle Name",
          accessor: "middlename",
        },
        {
          Header: "Phone Number",
          accessor: "phone_number",
        },
        {
          Header: "Status",
          accessor: "status",
        },
        {
          Header: "Admission Number",
          accessor: "admission_number",
        },
        {
          Header: "Present Class",
          accessor: "present_class",
        },
        {
          Header: "Gender",
          accessor: "gender",
        },
      ];

    case "myStudents":
      return [
        {
          Header: "id",
          accessor: "id",
        },
        {
          Header: "First Name",
          accessor: "firstname",
        },
        {
          Header: "Surname",
          accessor: "surname",
        },
        {
          Header: "Middle Name",
          accessor: "middlename",
        },
        {
          Header: "Phone Number",
          accessor: "phone_number",
        },
        {
          Header: "Status",
          accessor: "status",
        },
        {
          Header: "Admission Number",
          accessor: "admission_number",
        },
        {
          Header: "Present Class",
          accessor: "present_class",
        },
        {
          Header: "Gender",
          accessor: "gender",
        },
      ];

    case "loginDetails":
      return [
        {
          Header: "First Name",
          accessor: "firstname",
        },
        {
          Header: "Surname",
          accessor: "surname",
        },
        {
          Header: "Middle Name",
          accessor: "middlename",
        },
        {
          Header: "Admission Number",
          accessor: "admission_number",
        },
        {
          Header: "Present Class",
          accessor: "present_class",
        },
        {
          Header: "Password",
          accessor: "pass_word",
        },
      ];

    case "communication":
      return [
        {
          Header: "Campus",
          accessor: "campus",
        },
        {
          Header: "Period",
          accessor: "period",
        },
        {
          Header: "Term",
          accessor: "term",
        },
        {
          Header: "Session",
          accessor: "session",
        },
        {
          Header: "Title",
          accessor: "title",
        },
        {
          Header: "Urgency",
          accessor: "urgency",
        },
        {
          Header: "Admission Number",
          accessor: "admission_number",
        },
        {
          Header: "Message",
          accessor: "message",
        },
        {
          Header: "Sender",
          accessor: "sender",
        },
        {
          Header: "Status",
          accessor: "status",
        },
      ];

    default:
      return [
        {
          Header: "id",
          accessor: "id",
        },
        {
          Header: "Full Name",
          accessor: "student_fullname",
        },
        {
          Header: "Amount Due",
          accessor: "amount_due",
        },
        {
          Header: "Amount Paid",
          accessor: "amount_paid",
        },
        {
          Header: "Total Amount",
          accessor: "total_amount",
        },
        {
          Header: "Session",
          accessor: "session",
        },
        {
          Header: "Term",
          accessor: "term",
        },
        {
          Header: "Status",
          accessor: "status",
        },
        {
          Header: "Account Name",
          accessor: "account_name",
        },
        {
          Header: "Bank Name",
          accessor: "bank_name",
        },
        {
          Header: "Payment Method",
          accessor: "payment_method",
        },
        {
          Header: "Remark",
          accessor: "remark",
        },
      ];
  }
};

export const getStudentColumns = ({ indexStatus }) => {
  switch (indexStatus) {
    case "all":
      return [
        {
          Header: "",
          accessor: "image",
        },
        {
          Header: "id",
          accessor: "id",
        },
        {
          Header: "First Name",
          accessor: "firstname",
        },
        {
          Header: "Surname",
          accessor: "surname",
        },
        {
          Header: "Middle Name",
          accessor: "middlename",
        },
        {
          Header: "Present Class",
          accessor: "present_class",
        },
        {
          Header: "Gender",
          accessor: "gender",
        },
      ];

    case "myStudents":
      return [
        {
          Header: "id",
          accessor: "id",
        },
        {
          Header: "First Name",
          accessor: "firstname",
        },
        {
          Header: "Surname",
          accessor: "surname",
        },
        {
          Header: "Middle Name",
          accessor: "middlename",
        },
        {
          Header: "Present Class",
          accessor: "present_class",
        },
      ];

    case "communication":
      return [
        {
          Header: "Campus",
          accessor: "campus",
        },
        {
          Header: "Period",
          accessor: "period",
        },
        {
          Header: "Term",
          accessor: "term",
        },
        {
          Header: "Session",
          accessor: "session",
        },
        {
          Header: "Title",
          accessor: "title",
        },
        {
          Header: "Urgency",
          accessor: "urgency",
        },
        {
          Header: "Admission Number",
          accessor: "admission_number",
        },
        {
          Header: "Message",
          accessor: "message",
        },
        {
          Header: "Sender",
          accessor: "sender",
        },
        {
          Header: "Status",
          accessor: "status",
        },
      ];

    default:
      return [
        {
          Header: "id",
          accessor: "id",
        },
        {
          Header: "Full Name",
          accessor: "student_fullname",
        },
        {
          Header: "Amount Due",
          accessor: "amount_due",
        },
        {
          Header: "Amount Paid",
          accessor: "amount_paid",
        },
        {
          Header: "Total Amount",
          accessor: "total_amount",
        },
        {
          Header: "Session",
          accessor: "session",
        },
        {
          Header: "Term",
          accessor: "term",
        },
        {
          Header: "Status",
          accessor: "status",
        },
        {
          Header: "Account Name",
          accessor: "account_name",
        },
        {
          Header: "Bank Name",
          accessor: "bank_name",
        },
        {
          Header: "Payment Method",
          accessor: "payment_method",
        },
        {
          Header: "Remark",
          accessor: "remark",
        },
      ];
  }
};

export const setVariant = ({ status, indexStatus }) => {
  return indexStatus !== status ? "outline" : null;
};

export function toSentenceCase(str) {
  return str?.replace(/(^\s*\w|[\\.\\!\\?]\s*\w)/g, function (c) {
    return c?.toUpperCase();
  });
}

export const getSortButtonOptions = ({
  permission,
  setIndexStatus,
  user,
  indexStatus,
}) => {
  let arr = [];

  if (permission?.read) {
    arr.push({
      title: "All",
      type: "button",
      onClick: () => setIndexStatus("all"),
      variant: setVariant({ status: "all", indexStatus }),
    });
  }
  if (permission?.readCreditors) {
    arr.push({
      title: "Creditors",
      type: "button",
      onClick: () => setIndexStatus("creditors"),
      variant: setVariant({ status: "creditors", indexStatus }),
    });
  }

  if (permission?.readDebtors) {
    arr.push({
      title: "Debtors",
      type: "button",
      onClick: () => setIndexStatus("debtors"),
      variant: setVariant({ status: "debtors", indexStatus }),
    });
  }

  if (permission?.myStudents) {
    arr.push({
      title: user?.designation_name === "Student" ? "My Class" : "My Students",
      type: "button",
      onClick: () => setIndexStatus("myStudents"),
      variant: setVariant({ status: "myStudents", indexStatus }),
    });
  }

  if (permission?.alumni) {
    arr.push({
      title: "Alumni",
      type: "button",
      onClick: () => setIndexStatus("alumni"),
      variant: setVariant({ status: "alumni", indexStatus }),
    });
  }

  if (permission?.communication) {
    arr.push({
      title: "Communication Book",
      type: "button",
      onClick: () => setIndexStatus("communication"),
      variant: setVariant({ status: "communication", indexStatus }),
    });
  }

  if (permission?.studentLoginDetails) {
    arr.push({
      title: "Login Details",
      type: "button",
      onClick: () => setIndexStatus("loginDetails"),
      variant: setVariant({ status: "loginDetails", indexStatus }),
    });
  }

  return arr.length ? arr : undefined;
};

export const getActionOptions = ({ permission, navigate }) => {
  const arr = [];

  if (permission?.promote) {
    arr.push({
      title: "Promote",
      onClick: (id) => navigate(`/app/students/promote/${id}`),
    });
  }

  if (permission?.transfer) {
    arr.push({
      title: "Transfer",
      onClick: (id) => navigate(`/app/students/transfer/${id}`),
    });
  }

  if (permission?.invoice) {
    arr.push({
      title: "Create Invoice",
      onClick: (id) => navigate(`/app/students/invoice/${id}`),
    });
  }

  if (permission?.payment) {
    arr.push({
      title: "Register Payment",
      onClick: (id) => navigate(`/app/payment/${id}`),
    });
  }

  if (permission["health-report"]) {
    arr.push({
      title: "Health Report",
      onClick: (id) => navigate(`/app/students/health-report/${id}`),
    });
  }

  if (permission["bus-routing"]) {
    arr.push({
      title: "Bus Routing",
      onClick: (id) => navigate(`/app/students/bus-routing/${id}`),
    });
  }

  if (permission["create-communication"]) {
    arr.push({
      title: "Communication Book",
      onClick: (id) => navigate(`/app/students/communication/${id}`),
    });
  }

  return arr.length ? arr : undefined;
};

export const searchPlaceholder = {
  session: "Sort by session (2021/2022)",
  "admission-number": "Enter Admission Number",
  class: "Select Class",
};

export function countCorrectAnswers(questions) {
  // Initialize a variable to keep track of the count of correct answers
  let correctCount = 0;

  // Loop through each object in the 'questions' array
  for (const question of questions) {
    // Check if the 'answer' is equal to the 'correct_answer'
    if (question.answer === question.correct_answer) {
      // If they are the same, increment the correctCount
      correctCount++;
    }
  }

  // Return the total count of correct answers
  return correctCount;
}

export function convertToPercentage(score) {
  // Split the input string by '/' to get numerator and denominator
  const parts = score.split("/");

  if (parts.length !== 2) {
    // Handle invalid input
    return "Invalid input";
  }

  // Convert numerator and denominator to numbers
  const numerator = parseFloat(parts[0]);
  const denominator = parseFloat(parts[1]);

  if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
    // Handle invalid numbers or division by zero
    return "Invalid input";
  }

  // Calculate the percentage
  const percentage = (numerator / denominator) * 100;

  return `${percentage}%`;
}

export function sortQuestionsByNumber(questions) {
  // Use the sort method with a custom comparator function
  questions.sort((a, b) => {
    const questionNumberA = Number(a.question_number);
    const questionNumberB = Number(b.question_number);

    if (questionNumberA < questionNumberB) {
      return -1; // a should come before b
    } else if (questionNumberA > questionNumberB) {
      return 1; // b should come before a
    } else {
      return 0; // both have the same question_number
    }
  });

  return questions;
}

export function analyzeQuestions(questions) {
  // Initialize variables to keep track of the correct number and the result for each question.
  let correctNumber = 0;
  const analyzedQuestions = [];
  let totalDuration;
  let submittedDuration;
  // let unAttemptedQuestions;

  const unAtp = questions?.filter(
    (qf) => qf.answer === "No option was selected"
  ) ?? []

  const totalMarks = questions?.reduce(
    (acc, question) => acc + Number(question.question_mark),
    0
  );

  if (questions?.length > 0) {
    totalDuration = questions[0]?.duration;
    submittedDuration = questions[0]?.submitted_time;
  }

  // Loop through each object in the 'questions' array

  // Iterate through each question object.
  for (const question of questions) {
    // Check if the answer and correct_answer are the same.
    const isCorrect = question.answer === question.correct_answer;

    // Create a new object with the "correct_number" and "answer_state" keys.
    const analyzedQuestion = {
      ...question, // Spread the original question object.
      correct_number: isCorrect ? 1 : 0, // 1 if correct, 0 if incorrect.
      answer_state: isCorrect ? question.question_mark : 0, // 'pass' if correct, 'fail' if incorrect.
    };

    // Increment correctNumber if the question was answered correctly.
    if (isCorrect) {
      correctNumber++;
    }

    // Push the analyzed question to the result array.
    analyzedQuestions.push(analyzedQuestion);
  }

  const score = correctNumber * (totalMarks / analyzedQuestions?.length);
  const IncorrectNumber =
    analyzedQuestions?.length - correctNumber - unAtp?.length;

  const percentage = (score / totalMarks) * 100;

  // Return the result object with the correct_number and analyzed questions.
  return {
    // correct_number: correctNumber,
    score,
    questions: analyzedQuestions,
    correctNumber,
    unAttemptedNumber: unAtp?.length,
    IncorrectNumber,
    totalNumber: questions?.length,
    total_marks: totalMarks,
    percentage: percentage.toFixed(),
    totalDuration,
    submittedDuration,
    // percentage: `${percentage.toFixed()}%`,
  };
}

export function updateMarkedValue(arrayOfObjects, qn) {
  for (let i = 0; i < arrayOfObjects.length; i++) {
    if (arrayOfObjects[i].question_number === qn) {
      arrayOfObjects[i].marked = "marked";
      break; // Assuming there is only one object with question_number 1
    }
  }
  return arrayOfObjects;
}

export function addSumMark(questions) {
  const score = questions.reduce(
    (acc, question) => acc + Number(question.teacher_mark),
    0
  );
  const total_marks = questions.reduce(
    (acc, question) => acc + Number(question.question_mark),
    0
  );
  const percentage = (score / total_marks) * 100;
  const ss = questions?.map((question) => ({ ...question, sum_mark: score }));

  return {
    questions: ss,
    score,
    total_marks,
    percentage: percentage.toFixed(),
    // percentage: `${percentage.toFixed()}%`,
  };
}

export function addQuestionMarks(questions) {
  const sumMark = questions?.reduce(
    (acc, question) => acc + Number(question.question_mark),
    0
  );
  return questions.map((question) => ({ ...question, total_mark: sumMark }));
}

export function addQuestionMarkTotal(questions) {
  const sumMark = questions.reduce(
    (acc, question) => acc + Number(question.question_mark),
    0
  );
  return sumMark;
}

// export function findHighestTotalMark(questions) {
//   if (!questions || questions.length === 0) {
//     return null; // Handle edge cases where the array is empty or undefined
//   }

//   let highestMark = questions[0].total_mark; // Initialize with the first element's total_mark

//   for (let i = 1; i < questions.length; i++) {
//     const currentMark = questions[i].total_mark;
//     if (currentMark > highestMark) {
//       highestMark = currentMark; // Update the highest mark if the current mark is greater
//     }
//   }

//   return highestMark;
// }

export function findHighestTotalMark(questions) {
  let highestMark = 0;
  for (let i = 0; i < questions.length; i++) {
    const totalMark = Number(questions[i].total_mark);
    if (totalMark > highestMark) {
      highestMark = totalMark;
    }
  }
  return highestMark;
}

export function updateQuestionNumbers(arr) {
  // Use the map() function to create a new array with modified objects
  return arr?.map((obj, index) => {
    // Create a new object with the same properties as the original object
    const newObj = { ...obj };
    // Update the question_number property to be the index + 1
    newObj.question_number = index + 1;
    return newObj;
  });
}

export function updateObjQuestionMarkValue(arrayOfObjects, newValue) {
  for (let i = 0; i < arrayOfObjects.length; i++) {
    arrayOfObjects[i].question_mark = newValue;
  }
}

export function updateObjectiveTotals(arrayOfObjects) {
  const newArray = arrayOfObjects.map((obj) => ({
    ...obj,
    total_question: arrayOfObjects.length,
    total_mark: obj.question_mark * arrayOfObjects.length,
  }));

  return newArray;
}
