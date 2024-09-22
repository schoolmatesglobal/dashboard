import React, { useEffect, useState } from "react";
import GoBack from "../../../components/common/go-back";
import PageSheet from "../../../components/common/page-sheet";
import PageView from "../../../components/views/table-view";
import { useAccounts } from "../../../hooks/useAccounts";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useBank } from "../../../hooks/useBank";
import { formatCurrency } from "./constant";
import dayjs from "dayjs";

const BankDetails = () => {
  const { id } = useParams();

  const [payments, setPayments] = useState([]);
  const [sortDate, setSortDate] = useState("");

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

  const {
    createBank,
    bank,
    deleteBank,
    handleUpdateBank,
    isLoading: bankLoading,
    isEdit,
    // id,
  } = useBank();

  const filteredBank = (function fb() {
    const bk = bank?.find((bnk) => bnk?.id === id);
    return bk;
  })();

  const totalAmtPaid = payments?.reduce(
    (accumulator, currentValue) =>
      accumulator + Number(currentValue?.amount_paid2),
    0
  );

  const val = dayjs(sortDate).format("D MMM YYYY");

  useEffect(() => {
    setPayments(filteredBank?.payments);
  }, []);

  useEffect(() => {
    const filtPay = filteredBank?.payments?.filter((py) =>
      py?.date?.includes(val)
    );
    if (sortDate) {
      setPayments(filtPay);
    } else {
      setPayments(filteredBank?.payments);
    }
  }, [sortDate]);
  // const { paymentLoading, payment, apiServices } = useAccounts();

  // function filterPayment() {
  //   const pt = payment?.filter((pi) => Number(pi?.student_id) === Number(id));
  //   const filteredMap = pt[0]?.payment?.map((py, i) => {
  //     return {
  //       ...py,
  //       id: py?.id,
  //       amount_paid: `₦${apiServices.formatNumberWithCommas(py?.amount_paid)}`,
  //       total_amount: `₦${apiServices.formatNumberWithCommas(
  //         py?.total_amount
  //       )}`,
  //       // amount_paid: py?.amount_paid,
  //     };
  //   });
  //   return {
  //     data: pt[0],
  //     payment: filteredMap,
  //   };
  // }

  console.log({
    bank,
    id,
    filteredBank,
    payments,
    totalAmtPaid,
    sortDate,
    val,
  });

  return (
    <div>
      <GoBack />
      {/* <PageSheet> */}
      <PageView
        canCreate={false}
        // action={getActionOptions({ navigate })}
        // rowHasAction={true}
        // pageTitle="Man"
        showTableTitle={true}
        hasSortOptions
        hasDateSort
        dateSortLabel='Sort by date'
        dateSortValue={sortDate}
        clearDateSortValue={() => setSortDate("")}
        onDateSortChange={(e) => {
          return setSortDate(e.target.value);
        }}
        pageTitle={`Payment details for ${filteredBank?.bank_name}`}
        isLoading={bankLoading}
        columns={[
          {
            Header: "S/N",
            accessor: "sn",
          },
          {
            Header: "Date",
            accessor: "date",
          },

          {
            Header: "Student's Name",
            accessor: "student_fullname",
          },
          {
            Header: "Admission Number",
            accessor: "admission_number",
          },
          {
            Header: "Amount Paid",
            accessor: "amount_paid",
          },
          {
            Header: "Total Amount Owed",
            accessor: "total_amount",
          },
        ]}
        data={payments}
        footer={
          payments?.length > 0 && (
            <div
              className='d-flex justify-content-end'
              style={{
                fontWeight: "bold",
                marginTop: "0px",
                height: "45px",
                color: "rgb(39, 39, 39)",
                // padding: "0px 40px",
              }}
            >
              <div
                className='d-flex justify-content-center align-items-center '
                style={{
                  border: "1px solid rgb(177, 177, 177)",
                  padding: "20px, 30px",
                  width: "250px",
                  fontSize: "17px",
                  backgroundColor: "rgba(1, 21, 59, 0.15)",
                  // display: "flex"
                }}
              >
                <p
                  style={{
                    fontSize: "16px",
                    textTransform: "uppercase",
                  }}
                >
                  Total payments
                </p>
              </div>
              <div
                className='d-flex justify-content-center align-items-center'
                style={{
                  border: "1px solid rgb(177, 177, 177)",
                  padding: "20px, 30px",
                  width: "300px",
                }}
              >
                <p
                  style={{
                    fontSize: "16px",
                    textTransform: "uppercase",
                  }}
                >
                  {formatCurrency(totalAmtPaid)}
                  {/* {`₦${apiServices?.formatNumberWithCommas(
                            calcAmount.toString() ?? "0"
                          )}`} */}
                </p>
              </div>
            </div>
          )
        }
      />

      {/* </PageSheet> */}
    </div>
  );
};

export default BankDetails;
