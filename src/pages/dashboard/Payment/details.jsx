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
        onClick: () => {
          console.log("hello");
        },
        // onClick: (id) => navigate(`/app/payment/${id}`),
      },
    ];
  };

  const { paymentLoading, payment, apiServices } = useAccounts();

  function filterPayment() {
    const pt = payment?.filter((pi) => Number(pi?.student_id) === Number(id));
    return pt[0]?.payment?.map((py, i) => {
      return {
        ...py,
        id: "",
        amount_paid: `₦${apiServices.formatNumberWithCommas(py?.amount_paid)}`,
        total_amount: `₦${apiServices.formatNumberWithCommas(
          py?.total_amount
        )}`,
        // amount_paid: py?.amount_paid,
      };
    });
  }

  console.log({ payment, filterPayment: filterPayment(), id });

  return (
    <div>
      <GoBack />
      <PageView
        canCreate={false}
        // action={getActionOptions({ navigate })}
        // rowHasAction={true}
        // pageTitle="Man"
        showTableTitle={true}
        pageTitle={`Invoice payment for ${
          payment[0]?.student_fullname || "---"
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
            Header: "Account Name",
            accessor: "account_name",
          },

          {
            Header: "Bank Name",
            accessor: "bank_name",
          },
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
        data={filterPayment()}
      />
    </div>
  );
};

export default PaymentDetails;
