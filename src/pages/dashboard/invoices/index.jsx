import React, { useEffect, useState } from "react";
import PageView from "../../../components/views/table-view";
import { useInvoices } from "../../../hooks/useInvoice";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  checkDueDate,
  getColumns,
  getSortButtonOptions,
  getStudentColumns,
  searchPlaceholder,
} from "./constant";
import { useAccounts } from "../../../hooks/useAccounts";
import { useClasses } from "../../../hooks/useClasses";
import { useStudent } from "../../../hooks/useStudent";
import { useAcademicSession } from "../../../hooks/useAcademicSession";

const Invoices = () => {
  const { invoicesLoading, invoicesList } = useInvoices();
  const { paymentLoading, payment, apiServices } = useAccounts();
  const { data: sessions } = useAcademicSession();
  const { state } = useLocation();

  const { classes } = useClasses();

  const [indexStatus, setIndexStatus] = useState("all");
  const [sorted, setSorted] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [classes2, setClasses2] = useState({
    present_class: "",
    sub_class: "",
  });
  const [session, setSession] = useState("");

  const handleSortBy = ({ target: { value } }) => {
    setSortBy(value);
  };

  const {
    students,
    isLoading,
    onDeleteStudent,
    // setSession,
    sortedStudents,
    // sorted,
    // setSorted,
    // indexStatus,
    // setIndexStatus,
    studentDebtors,
    studentCreditors,
    permission,
    // handleSortBy,
    // sortBy,
    // setAdmissionNumber,
    // setSortBy,
    studentByClass2,
    user,
    graduatedStudents,
    // setClasses,
    studentLoginDetailsStudents,
    communicationList,
  } = useStudent();

  const navigate = useNavigate();

  const [_, setSearchParams] = useSearchParams();

  // function getPaymentDetails(id) {
  //   const inv = payment?.find((iv) => Number(iv.id) === Number(id));
  //   return {
  //     ...inv,
  //   };
  // }

  // const getPaymentDetails =
  function checkPayStatus(pay, amt) {
    // console.log({ pay, amt });
    if (!amt) {
      return "Not Paid";
    } else if (Number(pay) === Number(amt)) {
      return "Fully Paid";
    } else if (Number(amt) > Number(pay)) {
      return "Partly Paid";
    } else {
      return "Fully Paid";
    }
  }

  function newP() {
    return payment?.map((py, i) => {
      return {
        ...py,
        invoiceId: py?.payment[0]?.invoice_id ?? "",
        // invoice_no: getInvoiceId(py?.payment[0]?.invoice_id ?? []),
        total_amount: py?.payment[py?.payment?.length - 1]?.total_amount ?? "",
        amount_due: py?.payment[py?.payment?.length - 1]?.amount_due ?? "",
      };
    });
  }
  const newPayment = newP();

  function getPaymentDetails(id) {
    const inv = newPayment?.find((iv) => Number(iv.invoiceId) === Number(id));
    return {
      ...inv,
    };
  }

  const newList = invoicesList?.map((iv, i) => {
    return {
      ...iv,
      invoice_status: checkDueDate(iv?.due_date),
      // payDetails: getPaymentDetails(iv.id),
      amount_due: getPaymentDetails(iv.id)?.amount_due,
      payment: getPaymentDetails(iv.id)?.payment,
      total_amount: getPaymentDetails(iv.id)?.total_amount,
      amount_paid:
        Number(getPaymentDetails(iv.id)?.total_amount) -
        Number(getPaymentDetails(iv.id)?.amount_due),
      payment_status: checkPayStatus(
        Number(getPaymentDetails(iv.id)?.total_amount) -
          Number(getPaymentDetails(iv.id)?.amount_due),
        getPaymentDetails(iv.id)?.total_amount
      ),
    };
  });

  const [allData, setAllData] = useState(newList);

  const newList2 = newList?.filter(
    (nl) =>
      nl.payment_status === "Fully Paid" || nl.payment_status === "Partly Paid"
  );

  const newList3 = newList?.filter((nl) => nl.payment_status === "Not Paid");

  const newListByClass = allData?.filter(
    (nl) => nl.class.toUpperCase() === classes2?.present_class.toUpperCase()
  );

  const newListBySession = allData?.filter(
    (nl) => nl.session.toUpperCase() === session.toUpperCase()
  );

  const newListByAdmissionNo = allData?.filter(
    (nl) => nl.admission_number.toUpperCase() === admissionNumber.toUpperCase()
  );

  const data = {
    all:
      sorted === true && sortBy === "class"
        ? newListByClass
        : sorted === true && sortBy === "session"
        ? newListBySession
        : sorted === true && sortBy === "admission-number"
        ? newListByAdmissionNo
        : sorted === false
        ? allData
        : allData,
    creditors:
      sorted === true && sortBy === "class"
        ? newListByClass
        : sorted === true && sortBy === "session"
        ? newListBySession
        : sorted === true && sortBy === "admission-number"
        ? newListByAdmissionNo
        : allData,
    debtors:
      sorted === true && sortBy === "class"
        ? newListByClass
        : sorted === true && sortBy === "session"
        ? newListBySession
        : sorted === true && sortBy === "admission-number"
        ? newListByAdmissionNo
        : allData,
    // all: newList,
    // fullyPaid: newList?.filter((nl) => nl.payment_status === "Fully Paid"),
    // partlyPaid: newList?.filter((nl) => nl.payment_status === "Partly Paid"),
    // NotPaid: newList?.filter((nl) => nl.payment_status === "Not Paid"),
  };

  const searchByClass = (value) => {
    const findClass = classes?.find((each) => each?.class_name === value) || {};
    setClasses2({
      present_class: findClass?.class_name,
      sub_class: findClass?.sub_class,
    });
  };

  const getSelectSearchOptions = () => {
    if (sortBy === "class")
      return (classes || [])?.map((x) => ({
        value: x?.class_name,
        title: x?.class_name,
      }));
    if (sortBy === "session")
      return (sessions || [])?.map((session) => ({
        value: session?.academic_session,
        title: session?.academic_session,
      }));
  };

  const onSearch = (value) => {
    const search = {
      session: setSession,
      "admission-number": setAdmissionNumber,
      class: searchByClass,
    };

    setSorted(true);

    return search[sortBy || "admission-number"](value);
  };

  useEffect(() => {
    if (state?.status) {
      setIndexStatus(state.status);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.status]);

  useEffect(() => {
    setAllData(newList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoicesList]);

  // function checkPaymentStatus(invoiceId) {
  //   const pt = payment?.filter(
  //     (pi) => Number(pi?.invoice_id) === Number(invoiceId)
  //   );
  //   if (pt[0]?.payment?.length > 0) {
  //     return true;
  //   }
  // }

  const getActionOptions = ({ navigate }) => {
    const arr = [];

    return [
      {
        title: "View / Print Invoice",
        onClick: (id) => {
          // console.log({ id });
          navigate(`/app/invoices/fees/${id}`);
        },
      },
      {
        title: "Register Payment",
        onClick: (id) => navigate(`/app/payment/${id}`),
      },
    ];
  };

  console.log({
    allData,
    session,
    sorted,
    admissionNumber,
    classes2,
    sortBy,
    newListByClass,
    // onSearch: onSearch(),
    classes,
    indexStatus,
    data,
    // invoicesList,
    newList,
    // payment,
    // newPayment,
  });

  return (
    <PageView
      selectValue={sortBy}
      onSearchClear={() => {
        setSorted(false);
        setSortBy("");
      }}
      onSelectChange={handleSortBy}
      hasSortOptions={permission?.sort}
      searchIsSelect={sortBy === "class" || sortBy === "session"}
      hasSelect={permission?.sortSession}
      hasSearch={permission?.sortSession}
      searchSelectOptions={getSelectSearchOptions()}
      selectOptions={[
        { value: "admission-number", title: "Admission Number" },
        { value: "session", title: "Session" },
        { value: "class", title: "Class" },
      ]}
      onSearch={onSearch}
      searchPlaceholder={searchPlaceholder[sortBy] || "Enter Admission Number"}
      action={getActionOptions({ navigate })}
      rowHasAction={true}
      canCreate={false}
      isLoading={invoicesLoading || paymentLoading}
      groupedButtonOptions={getSortButtonOptions({
        permission,
        user,
        indexStatus,
        setAllData,
        newList,
        newList2,
        newList3,
        setIndexStatus: (index) => {
          setIndexStatus(index);
          setSearchParams({});
        },
      })}
      // columns={[
      //   {
      //     Header: "Invoice Number",
      //     accessor: "invoice_no",
      //   },
      //   {
      //     Header: " Name",
      //     accessor: "fullname",
      //   },
      //   {
      //     Header: "Class",
      //     accessor: "class",
      //   },
      //   {
      //     Header: "Admission Number",
      //     accessor: "admission_number",
      //   },

      //   {
      //     Header: "Payment Status",
      //     accessor: "payment_status",
      //   },

      //   {
      //     Header: "Term",
      //     accessor: "term",
      //   },
      //   // {
      //   //   Header: "Session",
      //   //   accessor: "session",
      //   // },
      // ]}
      columns={
        user?.designation_name === "Student"
          ? getStudentColumns({ indexStatus })
          : getColumns({ indexStatus })
      }
      data={data[indexStatus]}
      // data={newList}
    />
  );
};

export default Invoices;
