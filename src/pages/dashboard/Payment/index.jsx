import React from "react";
import { useNavigate } from "react-router-dom";
import PageView from "../../../components/views/table-view";
import { useAccounts } from "../../../hooks/useAccounts";
import { sortByDateDescending } from "./constant";

const Payment = () => {
  const { paymentLoading, payment, apiServices } = useAccounts();

  const navigate = useNavigate();

  function newPayment() {
    const np = payment?.map((pt, i) => {
      // let newpy =
      let totalAmtPaid = 0;
      // let totalAmount = pt[0]?.total_amount;

      pt?.payment?.forEach((pi, i) => {
        return (totalAmtPaid =
          Number(totalAmtPaid) + Number(pi?.amount_paid) ?? 0);
        // (Number(totalAmtPaid) + Number(pi?.amount_paid)).toFixed(2) ?? 0);
      });

      return {
        ...pt,
        payment: sortByDateDescending(pt?.payment ?? []),
        numberOfPayment: pt?.payment?.length,
        totalAmtPaid: `₦${apiServices.formatNumberWithCommas(
          totalAmtPaid?.toString()
        )}`,
        // totalAmtPaid: totalAmtPaid?.toString(),
        totalAmount: `₦${apiServices.formatNumberWithCommas(
          pt?.payment[0]?.total_amount
        )}`,
        id: pt?.student_id,
        amountDue: `₦${apiServices.formatNumberWithCommas(
          (
            Number(pt?.payment[0]?.total_amount) - Number(totalAmtPaid)
          )?.toString()
        )}`,
      };
    });

    return np ?? [];
  }

  const getActionOptions = ({ navigate }) => {
    const arr = [];

    return [
      {
        title: "Views Details",
        onClick: (id) => navigate(`/app/payment/details/${id}`),
      },
    ];
  };

  console.log({ payment, newPayment: newPayment() });

  return (
    <PageView
      canCreate={false}
      isLoading={paymentLoading}
      rowHasAction={true}
      action={getActionOptions({ navigate })}
      columns={[
        {
          Header: "Student Fullname",
          accessor: "student_fullname",
        },
        // {
        //   Header: "School Id",
        //   accessor: "sch_id",
        // },
        {
          Header: "Class",
          accessor: "class_name",
        },
        {
          Header: "Installments",
          accessor: "numberOfPayment",
        },
        // {
        //   Header: "Payment Method",
        //   accessor: "payment_method",
        // },
        {
          Header: "Invoice Amount",
          accessor: "totalAmount",
        },

        {
          Header: "Amount Paid",
          accessor: "totalAmtPaid",
        },
        {
          Header: "Amount Due",
          accessor: "amountDue",
        },
        // {
        //   Header: "Account Name",
        //   accessor: "account_name",
        // },

        // {
        //   Header: "Bank Name",
        //   accessor: "bank_name",
        // },
        {
          Header: "Term",
          accessor: "term",
        },
        // {
        //   Header: "Session",
        //   accessor: "session",
        // },
        // {
        //   Header: "Remark",
        //   accessor: "remark",
        // },
      ]}
      data={newPayment()}
    />
  );
};

export default Payment;
