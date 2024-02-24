export function checkDueDate(inputDate) {
  // Parse the input date string
  const inputDateObj = new Date(inputDate);

  // Get the current date
  const currentDateObj = new Date();

  // Check if the input date is equal or greater than the current date
  if (inputDateObj >= currentDateObj) {
    return "Due";
  } else {
    return "Not Due";
  }
}

export const getColumns = ({ indexStatus }) => {
  switch (indexStatus) {
    case "all":
      return [
        {
          Header: "Invoice Number",
          accessor: "invoice_no",
        },
        {
          Header: " Name",
          accessor: "fullname",
        },
        {
          Header: "Class",
          accessor: "class",
        },
        {
          Header: "Admission Number",
          accessor: "admission_number",
        },

        {
          Header: "Payment Status",
          accessor: "payment_status",
        },
        // {
        //   Header: "Total Amount",
        //   accessor: "total_amount",
        // },
        // {
        //   Header: "Amount Paid",
        //   accessor: "amount_paid",
        // },
        // {
        //   Header: "Amount Due",
        //   accessor: "amount_due",
        // },

        {
          Header: "Term",
          accessor: "term",
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
          accessor: "new_id",
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
          Header: "Invoice Number",
          accessor: "invoice_no",
        },
        {
          Header: " Name",
          accessor: "fullname",
        },
        {
          Header: "Class",
          accessor: "class",
        },
        {
          Header: "Admission Number",
          accessor: "admission_number",
        },

        {
          Header: "Payment Status",
          accessor: "payment_status",
        },

        {
          Header: "Term",
          accessor: "term",
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

export const searchPlaceholder = {
  session: "Sort by session (2021/2022)",
  "admission-number": "Enter Admission Number",
  class: "Select Class",
};

export const setVariant = ({ status, indexStatus }) => {
  return indexStatus !== status ? "outline" : null;
};

export const getSortButtonOptions = ({
  permission,
  setIndexStatus,
  user,
  indexStatus,
  setAllData,
  newList,
  newList2,
  newList3,
}) => {
  let arr = [];

  if (permission?.read) {
    arr.push({
      title: "All",
      type: "button",
      onClick: () => {
        setIndexStatus("all");
        setAllData(newList);
      },
      variant: setVariant({ status: "all", indexStatus }),
    });
  }
  if (permission?.readCreditors) {
    arr.push({
      title: "Creditors",
      type: "button",
      onClick: () => {
        setIndexStatus("creditors");
        setAllData(newList2);
      },
      variant: setVariant({ status: "creditors", indexStatus }),
    });
  }

  if (permission?.readDebtors) {
    arr.push({
      title: "Debtors",
      type: "button",
      onClick: () => {
        setIndexStatus("debtors");
        setAllData(newList3);
      },
      variant: setVariant({ status: "debtors", indexStatus }),
    });
  }

  //   if (permission?.myStudents) {
  //     arr.push({
  //       title: user?.designation_name === "Student" ? "My Class" : "My Students",
  //       type: "button",
  //       onClick: () => setIndexStatus("myStudents"),
  //       variant: setVariant({ status: "myStudents", indexStatus }),
  //     });
  //   }

  //   if (permission?.alumni) {
  //     arr.push({
  //       title: "Alumni",
  //       type: "button",
  //       onClick: () => setIndexStatus("alumni"),
  //       variant: setVariant({ status: "alumni", indexStatus }),
  //     });
  //   }

  //   if (permission?.communication) {
  //     arr.push({
  //       title: "Communication Book",
  //       type: "button",
  //       onClick: () => setIndexStatus("communication"),
  //       variant: setVariant({ status: "communication", indexStatus }),
  //     });
  //   }

  //   if (permission?.studentLoginDetails) {
  //     arr.push({
  //       title: "Login Details",
  //       type: "button",
  //       onClick: () => setIndexStatus("loginDetails"),
  //       variant: setVariant({ status: "loginDetails", indexStatus }),
  //     });
  //   }

  return arr.length ? arr : undefined;
};
