import React from "react";
import { useInvoices } from "../../../hooks/useInvoice";
import PageView from "../../../components/views/table-view";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const InvoiceFees = () => {
  const {
    isLoading: invoicesLoading,
    invoicesList,
    apiServices,
  } = useInvoices();

  const { id } = useParams();

  function fi() {
    return invoicesList?.find((iv) => iv?.id === id);
  }

  const filteredInvoice = fi();
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

  console.log({ invoicesList, invoicesLoading, filteredInvoice, filteredFee });

  return (
    <PageView
      //   action={getActionOptions({ navigate })}
      //   rowHasAction={true}
      hasGoBack
      pageTitle={`${filteredInvoice?.fullname} - Invoice #${filteredInvoice?.invoice_no}`}
      showTableTitle
      canCreate={false}
      //   isLoading={invoicesLoading}
      allLoading={invoicesLoading}
      columns={[
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
      ]}
      data={filteredFee}
    />
  );
};

export default InvoiceFees;
