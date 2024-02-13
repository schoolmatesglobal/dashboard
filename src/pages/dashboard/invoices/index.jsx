import React from "react";
import PageView from "../../../components/views/table-view";
import { useInvoices } from "../../../hooks/useInvoice";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { checkDueDate } from "./constant";

const Invoices = () => {
  const { invoicesLoading, invoicesList } = useInvoices();
  const navigate = useNavigate();

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

  const newList = invoicesList?.map((iv, i) => {
    return {
      ...iv,
      invoice_status: checkDueDate(iv?.due_date),
    };
  });

  console.log({ invoicesList, newList });

  return (
    <PageView
      action={getActionOptions({ navigate })}
      rowHasAction={true}
      canCreate={false}
      isLoading={invoicesLoading}
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
          Header: "Invoice Status",
          accessor: "invoice_status",
        },
        // {
        //   Header: "Fee Type",
        //   accessor: "feetype",
        // },
        // {
        //   Header: "Amount",
        //   accessor: "amount",
        // },
        // {
        //   Header: "Discount",
        //   accessor: "discount",
        // },
        // {
        //   Header: "Discount Amount",
        //   accessor: "discount_amount",
        // },
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
    />
  );
};

export default Invoices;
