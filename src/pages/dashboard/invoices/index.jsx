import React from "react";
import PageView from "../../../components/views/table-view";
import { useInvoices } from "../../../hooks/useInvoice";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { checkDueDate } from "./constant";
import { useAccounts } from "../../../hooks/useAccounts";

const Invoices = () => {
  const { invoicesLoading, invoicesList } = useInvoices();
  const { paymentLoading, payment, apiServices } = useAccounts();

  const navigate = useNavigate();

  // function getPaymentDetails(id) {
  //   const inv = payment?.find((iv) => Number(iv.id) === Number(id));
  //   return {
  //     ...inv,
  //   };
  // }

  // const getPaymentDetails =
  function checkPayStatus(pay, amt) {
    console.log({ pay, amt });
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
          console.log({ id });
          navigate(`/app/invoices/fees/${id}`);
        },
      },
      {
        title: "Register Payment",
        onClick: (id) => navigate(`/app/payment/${id}`),
      },
    ];
  };

  console.log({ invoicesList, newList, payment, newPayment });

  return (
    <PageView
      action={getActionOptions({ navigate })}
      rowHasAction={true}
      canCreate={false}
      isLoading={invoicesLoading || paymentLoading}
      columns={[
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
        // {
        //   Header: "Session",
        //   accessor: "session",
        // },
      ]}
      data={newList}
      // data={newList}
    />
  );
};

export default Invoices;
