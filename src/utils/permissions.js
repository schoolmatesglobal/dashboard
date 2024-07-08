export const permissions = {
  Superadmin: {
    superAdmin: {
      read: true,
    },
    campus: {
      create: true,
      read: true,
      update: true,
      delete: true,
      statusToggle: true,
    },
    classes: {
      create: false,
      read: true,
      update: false,
      delete: false,
      statusToggle: false,
    },
    departments: {
      create: true,
      read: true,
      update: true,
      delete: true,
      statusToggle: false,
    },
    staffs: {
      create: true,
      read: true,
      readAttendance: true,
      update: true,
      delete: true,
      statusToggle: true,
      sort: true,
      staffLoginDetails: true,
      "assign-class": true,
      action: false,
      "create-attendance": false,
    },
    students: {
      create: false,
      read: true,
      readCreditors: true,
      readDebtors: true,
      update: false,
      delete: false,
      statusToggle: false,
      sort: true,
      sortSession: true,
      sortAdmissionNumber: true,
      alumni: true,
      graduateStudent: false,
      readClass: true,
      studentLoginDetails: true,
    },
    reports: {
      read: true,
    },
    vehicles: {
      create: false,
      read: true,
      readLogs: true,
      update: false,
      delete: true,
      statusToggle: false,
      sort: true,
    },
    vendors: {
      create: false,
      read: true,
      update: false,
      delete: false,
      statusToggle: false,
      sort: false,
    },
  },

  Teacher: {
    teacher: {
      read: true,
    },
    students: {
      create: true,
      read: false,
      readCreditors: false,
      readDebtors: false,
      update: true,
      delete: false,
      statusToggle: false,
      sort: true,
      sortSession: true,
      sortAdmissionNumber: true,
      myStudents: true,
      alumni: false,
      graduateStudent: true,
      readClass: true,
      studentLoginDetails: false,
      communication: false,
      withdraw: false,
    },
    results: {
      compute: true,
      view: true,
      preSchool: true,
    },
    broadsheet: {
      compute: true,
      view: true,
      preSchool: true,
    },
    "communication-book": {
      create: true,
      view: true,
      approve: false,
    },
    "lesson-note": {
      create: true,
      view: true,
      approve: false,
    },
    assignments: {
      view: false,
      create: true,
      created: true,
      submissions: true,
      results: true,
      student_results: false,
      performances: true,
      student_performances: false,
    },
    cbt: {
      view: false,
      create: true,
      created: true,
      submissions: true,
      results: true,
      student_results: false,
      performances: true,
      student_performances: false,
    },
    skills: {
      create: false,
      read: true,
      update: false,
      delete: false,
    },
    reporting: {
      create: false,
      read: true,
      update: false,
      delete: false,
    },
    attendance: {
      retrieve: true,
      save: true,
    },
    "dress-code": {
      read: true,
    },
  },

  Principal: {
    principal: {
      read: true,
    },
    "dress-code": {
      read: true,
    },
    comment: {
      create: true,
    },
    "communication-book": {
      create: true,
      view: true,
      approve: true,
    },
    staffs: {
      create: false,
      read: true,
      readAttendance: true,
      update: false,
      delete: false,
      statusToggle: false,
      sort: true,
      staffLoginDetails: true,
    },
    students: {
      create: false,
      read: true,
      readCreditors: false,
      readDebtors: false,
      update: false,
      delete: false,
      statusToggle: false,
      sort: true,
      sortSession: true,
      sortAdmissionNumber: true,
      sortStudentByClass: true,
      myStudents: false,
      alumni: true,
      graduateStudent: true,
      readClass: true,
      studentLoginDetails: false,
      action: true,
      transfer: true,
      promote: true,
      communication: false,
      "health-report": false,
      "bus-routing": false,
    },
    results: {
      compute: false,
      view: true,
      preSchool: true,
    },
    broadsheet: {
      compute: true,
      view: true,
      preSchool: true,
    },
    "lesson-note": {
      create: false,
      view: true,
      approve: false,
    },
    skills: {
      create: false,
      read: true,
      update: false,
      delete: false,
    },
    reporting: {
      create: false,
      read: true,
      update: false,
      delete: false,
    },
  },

  Student: {
    "student-home": {
      read: true,
    },
    assignments: {
      view: true,
      create: false,
      created: false,
      submissions: false,
      results: false,
      student_results: true,
      performances: false,
      student_performances: true,
      // compute: true,
      // view: true,
      // preSchool: true,
    },
    cbt: {
      view: true,
      create: false,
      created: false,
      submissions: false,
      results: false,
      student_results: true,
      performances: false,
      student_performances: true,
      // compute: true,
      // view: true,
      // preSchool: true,
    },
    "communication-book": {
      create: true,
      view: true,
      approve: false,
    },
    vehicles: {
      create: false,
      read: true,
      readLogs: false,
      update: false,
      delete: false,
      sort: true,
      assignedBus: true,
    },
    skills: {
      create: false,
      read: true,
      update: false,
      delete: false,
    },
    reporting: {
      create: false,
      read: true,
      update: false,
      delete: false,
    },
    results: {
      compute: false,
      view: true,
      preSchool: true,
    },
    students: {
      create: false,
      read: true,
      readCreditors: false,
      readDebtors: false,
      update: false,
      delete: false,
      statusToggle: false,
      sort: true,
      sortSession: false,
      sortAdmissionNumber: false,
      myStudents: true,
      alumni: false,
      graduateStudent: false,
      readClass: true,
      studentLoginDetails: false,
      action: false,
      transfer: false,
      promote: false,
      communication: true,
      "health-report": false,
      "bus-routing": false,
    },
    "dress-code": {
      read: true,
    },
    accounts: {
      canCreate: false,
      sort: true,
      feeHistory: true,
      paymentReciept: true,
      myInvoice: true,
      previousInvoice: true,
    },
    invoices: {
      create: true,
      read: true,
      update: false,
      delete: false,
      statusToggle: false,
      sort: false,
    },
  },

  Admin: {
    admin: {
      read: true,
    },
    calendar: {
      create: true,
    },
    timetable: {
      create: true,
    },
    "resumption-date": {
      read: true,
    },
    campus: {
      read: true,
    },
    classes: {
      create: true,
      read: true,
      update: true,
      delete: true,
      statusToggle: false,
      subjects: true,
    },
    vehicles: {
      create: true,
      read: true,
      readLogs: true,
      createLogs: true,
      update: true,
      delete: true,
      sort: true,
      assignedBus: false,
      allAssignedBus: true,
    },
    "vehicle-logs": {
      create: true,
    },
    departments: {
      create: true,
      read: true,
      update: true,
      delete: true,
      statusToggle: false,
    },
    skills: {
      create: true,
      read: true,
      update: true,
      delete: true,
    },
    reporting: {
      create: true,
      read: true,
      update: true,
      delete: true,
    },
    "communication-book": {
      create: true,
      view: true,
      approve: true,
    },
    "lesson-note": {
      create: false,
      view: true,
      approve: true,
    },
    "pre-school": {
      create: true,
      read: true,
      update: true,
      delete: true,
      subject: true,
      sort: true,
    },
    students: {
      create: true,
      read: true,
      readCreditors: false,
      readDebtors: false,
      update: true,
      // delete: false,
      delete: true,
      statusToggle: true,
      sort: true,
      sortSession: true,
      sortAdmissionNumber: true,
      myStudents: false,
      alumni: true,
      graduateStudent: true,
      readClass: true,
      studentLoginDetails: true,
      action: true,
      transfer: true,
      promote: true,
      communication: false,
      imported: true,
      withdraw: true,
      "health-report": true,
      "bus-routing": true,
      "create-communication": true,
    },
    subjects: {
      read: true,
      create: true,
      update: true,
      delete: true,
    },
    activities: {
      read: true,
      create: true,
      update: true,
      delete: true,
    },
    activities2: {
      read: true,
      create: true,
      update: true,
      delete: true,
    },
    attendance: {
      retrieve: true,
      save: true,
    },
    grading: {
      create: true,
    },
    staffs: {
      create: true,
      read: true,
      readAttendance: true,
      update: true,
      delete: true,
      statusToggle: true,
      sort: true,
      staffLoginDetails: true,
      action: true,
      "create-attendance": true,
      "assign-class": true,
    },
  },

  Account: {
    account: {
      read: true,
    },
    reports: {
      read: true,
    },
    "communication-book": {
      create: true,
      view: true,
      approve: true,
    },
    expense: {
      canCreate: true,
      sort: true,
      feeHistory: true,
      paymentReciept: true,
      myInvoice: true,
      previousInvoice: true,
    },
    vendors: {
      create: true,
      read: true,
      update: false,
      delete: false,
      statusToggle: false,
      sort: false,
    },
    transfer: {
      create: true,
      read: true,
      update: true,
      delete: true,
    },
    "chart-account": {
      create: false,
      read: true,
      update: false,
      delete: false,
      statusToggle: false,
      sort: false,
    },

    "fee-list": {
      create: false,
      read: true,
      update: false,
      delete: false,
      statusToggle: false,
      sort: false,
    },
    payment: {
      create: false,
      read: true,
      update: false,
      delete: false,
      statusToggle: false,
      sort: false,
    },
    invoice: {
      create: true,
      read: true,
      update: false,
      delete: false,
      statusToggle: false,
      sort: false,
    },
    invoices: {
      create: true,
      read: true,
      update: false,
      delete: false,
      statusToggle: false,
      sort: false,
    },
    bank: {
      create: true,
      read: true,
      update: true,
      delete: true,
      statusToggle: false,
      sort: false,
    },
    vehicles: {
      create: false,
      read: true,
      readLogs: false,
      update: false,
      delete: false,
      sort: false,
      assignedBus: false,
      maintenance: true,
      action: true,
    },
    "vehicle-maintenance": {
      read: true,
    },
    discount: {
      create: true,
      read: true,
      sort: false,
    },
    departments: {
      read: true,
    },
    academic: {
      create: true,
      read: true,
      sort: false,
    },
    students: {
      create: false,
      read: true,
      readCreditors: true,
      readDebtors: true,
      action: true,
      update: false,
      delete: false,
      statusToggle: false,
      sort: true,
      sortSession: true,
      sortAdmissionNumber: true,
      myStudents: false,
      alumni: false,
      graduateStudent: false,
      readClass: false,
      studentLoginDetails: false,
      transfer: false,
      promote: false,
      invoice: true,
      payment: true,
      communication: false,
      "health-report": false,
      "bus-routing": false,
    },
  },
};
