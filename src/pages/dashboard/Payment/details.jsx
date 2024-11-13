import React from "react";
import GoBack from "../../../components/common/go-back";
import PageSheet from "../../../components/common/page-sheet";
import PageView from "../../../components/views/table-view";
import { useAccounts } from "../../../hooks/useAccounts";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const PaymentDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const getActionOptions = ({ navigate }) => {
    const arr = [];

    return [
      {
        title: "Edit Payment",
        // onClick: () => {
        //   console.log("hello");
        // },
        onClick: (id) => navigate(`/app/payment/edit/${id}`),
      },
    ];
  };

  const { paymentLoading, payment, apiServices } = useAccounts();

  function filterPayment() {
    const pt = payment?.filter((pi) => Number(pi?.student_id) === Number(id));
    const filteredMap = pt[0]?.payment?.map((py, i) => {
      return {
        ...py,
        id: py?.id,
        amount_paid: `₦${apiServices.formatNumberWithCommas(py?.amount_paid)}`,
        total_amount: `₦${apiServices.formatNumberWithCommas(
          py?.total_amount
        )}`,
        // amount_paid: py?.amount_paid,
      };
    });
    return {
      data: pt[0],
      payment: filteredMap,
    };
  }

  // console.log({ payment, filterPayment: filterPayment(), id });

  return (
    <div>
      <GoBack />
      <PageView
        canCreate={false}
        action={getActionOptions({ navigate })}
        rowHasAction={true}
        // pageTitle="Man"
        showTableTitle={true}
        pageTitle={`Invoice payment for ${
          filterPayment()?.data?.student_fullname || "---"
        } - ₦${
          apiServices.formatNumberWithCommas(
            filterPayment()?.data?.payment[0]?.total_amount ?? "0"
          ) || "---"
        }`}
        isLoading={paymentLoading}
        columns={[
          // {
          //   Header: "Student Fullname",
          //   accessor: "student_fullname",
          // },
          // {
          //   Header: "School Id",
          //   accessor: "sch_id",
          // },
          {
            Header: "Bank Details",
            accessor: "account_name",
          },

          // {
          //   Header: "Bank Name",
          //   accessor: "bank_name",
          // },
          {
            Header: "Amount Paid",
            accessor: "amount_paid",
          },
          // {
          //   Header: "Total Amount",
          //   accessor: "total_amount",
          // },
          {
            Header: "Payment Method",
            accessor: "payment_method",
          },
          {
            Header: "Payment Type",
            accessor: "type",
          },
          {
            Header: "Payment Date",
            accessor: "paid_at",
          },
          // {
          //   Header: "Term",
          //   accessor: "term",
          // },
          // {
          //   Header: "Session",
          //   accessor: "session",
          // },
          // {
          //   Header: "Remark",
          //   accessor: "remark",
          // },
        ]}
        data={filterPayment()?.payment}
      />
    </div>
  );
};

export default PaymentDetails;
