const queryKeys = {
  GET_CBT_CREATED: "GET_CBT_CREATED",
  GET_CBT_ANSWERS: "GET_CBT_ANSWERS",
  GET_CBT_SETTINGS: "GET_CBT_SETTINGS",
  GET_SUBMITTED_CBT_STUDENT: "GET_SUBMITTED_CBT_STUDENT",
  GET_UNPUBLISHED_ASSIGNMENT: "GET_UNPUBLISHED_ASSIGNMENT",
  GET_CREATED_ASSIGNMENT: "GET_CREATED_ASSIGNMENT",
  GET_ASSIGNMENT: "GET_ASSIGNMENT",
  GET_ACTIVITIES: "GET_ACTIVITIES",
  GET_ASSIGNMENT_RESULT: "GET_ASSIGNMENT_RESULT",
  GET_BROAD_SHEET_RESULT: "GET_BROAD_SHEET_RESULT",
  GET_FIRST_ASSESSMENT: "GET_FIRST_ASSESSMENT",
  GET_SECOND_ASSESSMENT: "GET_SECOND_ASSESSMENT",
  GET_MIDTERM: "GET_MIDTERM",
  GET_PAYMENT_BY_ID: "GET_PAYMENT_BY_ID",
  GET_ASSIGNMENT_RESULT_STUDENTID: "GET_ASSIGNMENT_RESULT_STUDENTID",
  GET_SUBMITTED_ASSIGNMENT: "GET_SUBMITTED_ASSIGNMENT",
  GET_PERFORMANCE: "GET_PERFORMANCE",
  GET_ALL_PERFORMANCE: "GET_ALL_PERFORMANCE",
  GET_MARKED_ASSIGNMENT: "GET_MARKED_ASSIGNMENT",
  GET_MARKED_ASSIGNMENT_FOR_RESULTS: "GET_MARKED_ASSIGNMENT_FOR_RESULTS",
  GET_MARKED_ASSIGNMENT_STUDENTID: "GET_MARKED_ASSIGNMENT_STUDENTID",
  GET_MARKED_OBJECTIVE_ASSIGNMENT: "GET_MARKED_OBJECTIVE_ASSIGNMENT",
  GET_MARKED_THEORY_ASSIGNMENT: "GET_MARKED_THEORY_ASSIGNMENT",
  GET_SUBMITTED_ASSIGNMENT_STUDENT: "GET_SUBMITTED_ASSIGNMENT_STUDENT",
  GET_OBJECTIVE_SUBMITTED_ASSIGNMENT: "GET_OBJECTIVE_SUBMITTED_ASSIGNMENT",
  GET_THEORY_SUBMITTED_ASSIGNMENT: "GET_THEORY_SUBMITTED_ASSIGNMENT",
  GET_ASSIGNMENT_BY_STUDENT: "GET_ASSIGNMENT_BY_STUDENT",
  GET_CBT_BY_STUDENT: "GET_CBT_BY_STUDENT",
  GET_DESIGNATION: "GET_DESIGNATION",
  GET_ALL_CLASSES: "GET_ALL_CLASSES",
  GET_ALL_CAMPUSES: "GET_ALL_CAMPUSES",
  GET_CAMPUS: "GET_CAMPUS",
  GET_ACADEMIC_SESSIONS: "GET_ACADEMIC_SESSIONS",
  GET_RESULT_CUMMULATIVE_SCORES: "GET_RESULT_CUMMULATIVE_SCORES",
  GET_STAFF: "GET_STAFF",
  GET_DIRECTOR_OF_STUDIES: "GET_DIRECTOR_OF_STUDIES",
  GET_STUDENT: "GET_STUDENT",
  GET_SUBJECTS: "GET_SUBJECTS",
  GET_SUBJECTS_BY_CLASS2: "GET_SUBJECTS_BY_CLASS2",
  GET_SUBJECTS2: "GET_SUBJECTS2",
  GET_ALL_STAFFS: "GET_ALL_STAFFS",
  GET_ALL_SKILLS: "GET_ALL_SKILLS",
  GET_ALL_REPORTS: "GET_ALL_REPORTS",
  GET_ALL_PRE_SCHOOLS: "GET_ALL_PRE_SCHOOLS",
  GET_ALL_PRE_SCHOOL_SUBJECTS: "GET_ALL_PRE_SCHOOL_SUBJECTS",
  GET_ALL_STAFFS_BY_ATTENDANCE: "GET_ALL_STAFFS_BY_ATTENDANCE",
  GET_ALL_STUDENTS: "GET_ALL_STUDENTS",
  GET_ALL_STUDENTS_BY_SESSION: "GET_ALL_STUDENTS_BY_SESSION",
  GET_ALL_STUDENTS_BY_ADMISSION_NUMBER: "GET_ALL_STUDENTS_BY_ADMISSION_NUMBER",
  GET_ALL_STUDENTS_BY_CLASS: "GET_ALL_STUDENTS_BY_CLASS",
  GET_ALL_STUDENTS_BY_CLASS2: "GET_ALL_STUDENTS_BY_CLASS2",
  GET_ALL_STUDENTS_DEBTORS: "GET_ALL_STUDENTS_DEBTORS",
  GET_ALL_STUDENTS_CREDITORS: "GET_ALL_STUDENTS_CREDITORS",
  GET_ALL_VEHICLES: "GET_ALL_VEHICLES",
  GET_ALL_VEHICLE_MAINTENANCE: "GET_ALL_VEHICLE_MAINTENANCE",
  GET_ALL_VEHICLE_LOGS: "GET_ALL_VEHICLE_LOGS",
  GET_ALL_VENDORS: "GET_ALL_VENDORS",
  GET_ALL_DEPARTMENTS: "GET_ALL_DEPARTMENTS",
  GET_ALL_INCOME_REPORTS: "GET_ALL_INCOME_REPORTS",
  GET_ALL_INVOICE_REPORTS: "GET_ALL_INVOICE_REPORTS",
  GET_ALL_EXPENSES_REPORTS: "GET_ALL_EXPENSES_REPORTS",
  GET_ALL_OUTSTANDING: "GET_ALL_OUTSTANDING",
  GET_ALL_EXPECTED_INCOME: "GET_ALL_EXPECTED_INCOME",
  GET_ALL_DISCOUNT: "GET_ALL_DISCOUNT",
  GET_ALL_TOTAL_EXPENSES: "GET_ALL_TOTAL_EXPENSES",
  GET_ALL_ACCOUNT_BALANCE: "GET_ALL_ACCOUNT_BALANCE",
  GET_ALL_RECEIVED_INCOME: "GET_ALL_RECEIVED_INCOME",
  GET_DRESS_CODE: "GET_DRESS_CODE",
  GET_STUDENTS_BY_ATTENDANCE: "GET_STUDENTS_BY_ATTENDANCE",
  GET_ACADEMIC_DATE: "GET_ACADEMIC_DATE",
  GET_ALL_SUBJECTS: "GET_ALL_SUBJECTS",
  GET_ACADEMIC_CALENDER: "GET_ACADEMIC_CALENDER",
  GET_ACADEMIC_PERIOD: "GET_ACADEMIC_PERIOD",
  GET_TIME_TABLE: "GET_TIME_TABLE",
  GET_MAX_SCORES: "GET_MAX_SCORES",
  GET_SCORES: "GET_SCORES",
  GET_STUDENT_RESULTS: "GET_STUDENT_RESULTS",
  GET_GRADUATED_STUDENTS: "GET_GRADUATED_STUDENTS",
  GET_STUDENT_END_OF_TERM_RESULTS: "GET_STUDENT_END_OF_TERM_RESULTS",
  GET_SUBJECTS_BY_CLASS: "GET_SUBJECTS_BY_CLASS",
  GET_PRE_SCHOOL_SUBJECTS_BY_CLASS: "GET_PRE_SCHOOL_SUBJECTS_BY_CLASS",
  GET_PRE_SCHOOL_RESULTS: "GET_PRE_SCHOOL_RESULTS",
  GET_PRE_SCHOOL_COMPILED_RESULTS: "GET_PRE_SCHOOL_COMPILED_RESULTS",
  GET_SCHOOL: "GET_SCHOOL",
  GET_VEHICLE: "GET_VEHICLE",
  GET_GRADING: "GET_GRADING",
  GET_CLASS_POPULATION: "GET_CLASS_POPULATION",
  GET_SCHOOL_POPULATION: "GET_SCHOOL_POPULATION",
  GET_STAFF_POPULATION: "GET_STAFF_POPULATION",
  GET_STUDENT_POPULATION: "GET_STUDENT_POPULATION",
  GET_TEACHER_POPULATION: "GET_TEACHER_POPULATION",
  GET_PRINCIPAL_COMMENTS: "GET_PRINCIPAL_COMMENTS",
  GET_FEE_HISTORY: "GET_FEE_HISTORY",
  GET_PREVIOUS_INVOICE: "GET_PREVIOUS_INVOICE",
  GET_INVOICE: "GET_INVOICE",
  GET_CHART_ACCOUNTS: "GET_CHART_ACCOUNTS",
  GET_PAYMENT: "GET_PAYMENT",
  GET_ASSIGNED_BUS: "GET_ASSIGNED_BUS",
  GET_ALL_ASSIGNED_BUS: "GET_ALL_ASSIGNED_BUS",
  GET_COMMUNICATION_BOOK: "GET_COMMUNICATION_BOOK",
  GET_STUDENT_LOGIN_DETAILS: "GET_STUDENT_LOGIN_DETAILS",
  GET_STAFF_LOGIN_DETAILS: "GET_STAFF_LOGIN_DETAILS",
  GET_DEBTORS: "GET_DEBTORS",
  GET_CREDITORS: "GET_CREDITORS",
  GET_FEE_LIST: "GET_FEE_LIST",
  GET_BANK_LIST: "GET_BANK_LIST",
  GET_ALL_INVOICES: "GET_ALL_INVOICES",
  GET_FUNDS: "GET_FUNDS",
  GET_AUDIT_LOGS: "GET_AUDIT_LOGS",
  GET_IMPORTED_STUDENTS: "GET_IMPORTED_STUDENTS",
  GET_YEARLY_CLASS_AVERAGE: "GET_YEARLY_CLASS_AVERAGE",
  GET_CLASS_AVERAGE: "GET_CLASS_AVERAGE",
};

export default queryKeys;
