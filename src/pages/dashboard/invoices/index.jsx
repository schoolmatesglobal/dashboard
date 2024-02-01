import React from "react";
import PageView from "../../../components/views/table-view";
import { useInvoices } from "../../../hooks/useInvoice";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const Invoices = () => {
  const { invoicesLoading, invoicesList } = useInvoices();
  const navigate = useNavigate();

  const getActionOptions = ({ navigate }) => {
    const arr = [];

    return [
      {
        title: "View All Fees",
        onClick: (id, ) => {
          console.log({ id });
          navigate(`/app/invoices/fees/${id}`)
        },
      },
    ];
  };

  console.log({ invoicesList });

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
        {
          Header: "Session",
          accessor: "session",
        },
      ]}
      data={invoicesList}
    />
  );
};

export default Invoices;
