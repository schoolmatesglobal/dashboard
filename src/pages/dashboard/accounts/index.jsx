import React from "react";
import PageView from "../../../components/views/table-view";
import { useAccounts } from "../../../hooks/useAccounts";
import { useInvoices } from "../../../hooks/useInvoice";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

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

  const navigate = useNavigate();

  const { invoicesLoading, invoicesList } = useInvoices();

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
      (inv) => inv?.admission_number === user?.admission_number
    );
    return ffs;
  }

  const filteredInvoice = fi();
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
    if (permission?.feeHistory) {
      arr.push({
        title: "Fee History",
        type: "button",
        variant: indexStatus !== "fee-history" ? "outline" : null,
        onClick: () => setIndexStatus("fee-history"),
      });
    }

    if (permission?.paymentReciept) {
      arr.push({
        title: "Payment Reciept",
        type: "button",
        variant: indexStatus !== "payment-reciept" ? "outline" : null,
        onClick: () => setIndexStatus("payment-reciept"),
      });
    }

    if (permission?.myInvoice) {
      arr.push({
        title: "My Invoice",
        type: "button",
        variant: indexStatus !== "my-invoice" ? "outline" : null,
        onClick: () => setIndexStatus("my-invoice"),
      });
    }

    if (permission?.previousInvoice) {
      arr.push({
        title: "Previous Invoice",
        type: "button",
        variant: indexStatus !== "previous-invoice" ? "outline" : null,
        onClick: () => setIndexStatus("previous-invoice"),
      });
    }

    return arr;
  };

  const getActionOptions = ({ navigate }) => {
    const arr = [];

    return [
      {
        title: "View All Fees",
        onClick: (id) => {
          console.log({ id });
          navigate(`/app/invoices/fees/${id}`);
        },
      },
    ];
  };

  const dataMapper = {
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
    "my-invoice": {
      columns: [
        {
          Header: "S/N",
          accessor: "sn",
        },
        {
          Header: "Fee Type",
          accessor: "feetype",
        },
        {
          Header: "Amount",
          accessor: "amount",
        },
        {
          Header: "Discount",
          accessor: "discount",
        },
        {
          Header: "Discounted Amount",
          accessor: "discount_amount",
        },
      ],
      data: filteredFee,
      rowHasAction: false,
      action: {},
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
  };

  console.log({
    feeHistory,
    invoice,
    previousInvoice,
    invoicesList,
    user,
    filteredInvoice,
    filteredFee,
    filteredAllInvoice,
  });

  return (
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
  );
};

export default Accounts;
