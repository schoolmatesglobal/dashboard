import React, { useState } from "react";
import PageView from "../../../components/views/table-view";
import { useAccounts } from "../../../hooks/useAccounts";
import { useInvoices } from "../../../hooks/useInvoice";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useBank } from "../../../hooks/useBank";
import PageSheet from "../../../components/common/page-sheet";
import GoBack from "../../../components/common/go-back";

const Accounts = () => {
  const {
    permission,
    apiServices,
    isLoading,
    indexStatus,
    setIndexStatus,
    feeHistory,
    previousInvoice,
    invoice,
    user,
  } = useAccounts();

  const [lastSection, setlastSection] = useState("");
  const [currentSection, setCurrentSection] = useState("");

  const navigate = useNavigate();

  const {
    isLoading: invoicesLoading,
    invoicesList,
    // apiServices,
    handlePrint,
    pdfExportComponent,
    // user,
  } = useInvoices();
  const { bank, isLoading: bankLoading } = useBank();

  function fi() {
    const ffs = invoicesList?.find(
      (inv) =>
        inv?.admission_number === user?.admission_number &&
        inv?.term === user?.term
    );
    return ffs;
  }
  function fi2() {
    const ffs = invoicesList?.filter(
      (inv) =>
        inv?.admission_number === user?.admission_number &&
        inv?.term !== user?.term
    );
    return ffs;
  }
  function fi3() {
    const ffs = invoicesList?.filter(
      (inv) =>
        inv?.admission_number === user?.admission_number &&
        inv?.term === user?.term
    );
    return ffs;
  }

  const filteredInvoice = fi3();
  const filteredAllInvoice = fi2() ?? [];
  const filteredFee = fi()?.fee?.map((fi, i) => {
    return {
      sn: i + 1,
      ...fi,
      discount: `${fi?.discount}%`,
      amount: `₦${apiServices.formatNumberWithCommas(fi?.amount)}`,
      discount_amount: `₦${apiServices.formatNumberWithCommas(
        fi?.discount_amount
      )}`,
    };
  });

  const getSortButtonOptions = () => {
    const arr = [];

    if (permission?.myInvoice) {
      arr.push({
        title: "My Invoice",
        type: "button",
        variant: indexStatus !== "my-invoice" ? "outline" : null,
        onClick: () => {
          setIndexStatus("my-invoice");
          setCurrentSection("my-invoice");
          setlastSection(currentSection);
        },
      });
    }

    if (permission?.previousInvoice) {
      arr.push({
        title: "Previous Invoice",
        type: "button",
        variant: indexStatus !== "previous-invoice" ? "outline" : null,
        onClick: () => {
          setIndexStatus("previous-invoice");
          setCurrentSection("previous-invoice");
        },
      });
    }
    
    if (permission?.feeHistory) {
      arr.push({
        title: "Fee History",
        type: "button",
        variant: indexStatus !== "fee-history" ? "outline" : null,
        onClick: () => {
          setIndexStatus("fee-history");
          setCurrentSection("fee-history");
        },
      });
    }

    if (permission?.paymentReciept) {
      arr.push({
        title: "Payment Reciept",
        type: "button",
        variant: indexStatus !== "payment-reciept" ? "outline" : null,
        onClick: () => {
          setIndexStatus("payment-reciept");
          setCurrentSection("payment-reciept");
        },
      });
    }

    return arr;
  };

  const getActionOptions = ({ navigate }) => {
    const arr = [];

    return [
      {
        title: "View / Print Invoice",
        onClick: (id) => {
          console.log({ id });
          navigate(`/app/invoices/fees/${id}`);
        },
      },
    ];
  };

  const dataMapper = {
    "my-invoice": {
      columns: [
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
          Header: "Term",
          accessor: "term",
        },
        {
          Header: "Session",
          accessor: "session",
        },
      ],
      data: filteredInvoice,
      rowHasAction: true,
      action: getActionOptions({ navigate }),
    },
    "previous-invoice": {
      columns: [
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
          Header: "Term",
          accessor: "term",
        },
        {
          Header: "Session",
          accessor: "session",
        },
      ],
      data: filteredAllInvoice,
      rowHasAction: true,
      action: getActionOptions({ navigate }),
    },
    "fee-history": {
      columns: [
        {
          Header: "Full Name",
          accessor: "student_fullname",
        },
        {
          Header: "Status",
          accessor: "status",
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
          Header: "Amount Due",
          accessor: "amount_due",
        },
        {
          Header: "Payment Method",
          accessor: "payment_method",
        },
        {
          Header: "Account Name",
          accessor: "account_name",
        },
        {
          Header: "Bank",
          accessor: "bank_name",
        },
        {
          Header: "Remark",
          accessor: "remark",
        },
        {
          Header: "Term",
          accessor: "term",
        },
        {
          Header: "Session",
          accessor: "session",
        },
      ],
      data: feeHistory,
      rowHasAction: false,
      action: {},
    },
    "payment-reciept": {
      columns: [],
      data: [],
      rowHasAction: false,
      action: {},
    },
  };

  console.log({
    lastSection,
    currentSection,
    // indexStatus,
    // feeHistory,
    // invoice,
    // previousInvoice,
    // invoicesList,
    // user,
    // filteredInvoice,
    // filteredFee,
    // filteredAllInvoice,
  });

  return (
    <div className=''>
      {
        <PageView
          canCreate={permission?.canCreate}
          hasSortOptions={permission?.sort}
          isLoading={isLoading}
          groupedButtonOptions={getSortButtonOptions()}
          columns={dataMapper[indexStatus].columns}
          data={dataMapper[indexStatus].data}
          rowHasAction={dataMapper[indexStatus].rowHasAction}
          action={dataMapper[indexStatus].action}
        />
      }
      {/* {indexStatus === "my-invoice" && (
        <div className=''>
          <GoBack
            // onGoBack={() => {
            //   setIndexStatus(lastSection);
            // }}
          />
          <PageSheet></PageSheet>
        </div>
      )} */}
    </div>
  );
};

export default Accounts;
