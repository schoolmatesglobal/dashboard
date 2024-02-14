import React, { useState, useEffect } from "react";
import { useInvoices } from "../../../hooks/useInvoice";
import PageView from "../../../components/views/table-view";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import PageSheet from "../../../components/common/page-sheet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../components/buttons/button";
import ResultHeader from "../../../components/common/result-header";
import InvoiceHeader from "../../../components/common/invoice-header";
import CustomTable from "../../../components/tables/table";
import InvoiceTable from "../../../components/tables/invoiceTable";
import { useBank } from "../../../hooks/useBank";
import GoBack from "../../../components/common/go-back";
import moment from "moment";
import dayjs from "dayjs";
import { useAccounts } from "../../../hooks/useAccounts";
import { Spinner } from "reactstrap";

const InvoiceFees = () => {
  const {
    isLoading: invoicesLoading,
    invoicesList,
    apiServices,
    handlePrint,
    pdfExportComponent,
    user,
  } = useInvoices();

  const { paymentLoading, payment } = useAccounts();

  const { bank, isLoading: bankLoading } = useBank();

  const { id } = useParams();

  const [changeTableStyle, setChangeTableStyle] = useState(false);
  const [payedAmount, setPayedAmount] = useState("");

  function fi() {
    return invoicesList?.find((iv) => iv?.id === id);
  }

  let calcAmount = 0;
  let calcAmount2 = 0;

  // let calcAmount2 = `₦${apiServices.formatNumberWithCommas(calcAmount ?? 0)}`;

  const filteredInvoice = fi();
  const filteredFee = fi()?.fee?.map((fi, i) => {
    calcAmount =
      (Number(calcAmount) + Number(fi?.discount_amount)).toFixed(0) ?? 0;

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

  function filterPayment() {
    if (payment?.length > 0) {
      const pt = payment?.filter(
        (pi) => Number(pi?.student_id) === Number(filteredInvoice?.student_id)
      );
      return pt[0]?.payment?.map((py, i) => {
        calcAmount2 = calcAmount2 + Number(py?.amount_paid);
        return {
          ...py,
          amount_paid: `₦${apiServices.formatNumberWithCommas(
            py?.amount_paid
          )}`,
          total_amount: `₦${apiServices.formatNumberWithCommas(
            py?.total_amount
          )}`,
          sum_amount: calcAmount2,
          // sum_amount: `₦${apiServices.formatNumberWithCommas(calcAmount2)}`,
        };
      });
    } else {
      return [];
    }
  }

  const fp = filterPayment() ?? [];

  // let payedAmount;

  // useEffect(() => {
  //   const filteredPayments = fp();
  //   if (filteredPayments?.length > 0) {
  //     setPayedAmount(
  //       filteredPayments[filteredPayments()?.length - 1]?.sum_amount
  //     );
  //   }
  //   // payedAmount = filterPayment()[filterPayment()?.length - 1];
  // }, [payment]);

  // const payedAmount = filterPayment()[filterPayment?.length - 1];

  console.log({
    bank,
    payedAmount,
    calcAmount,
    changeTableStyle,
    invoicesList,
    invoicesLoading,
    filteredInvoice,
    filteredFee,
    fp,
    fp2: fp[fp?.length - 1]?.sum_amount,
    // filterPayment: fp(),
    // flength: fp()?.length,
    payment,
  });

  return (
    // <PageView

    //   hasGoBack
    //   pageTitle={`${filteredInvoice?.fullname} - Invoice #${filteredInvoice?.invoice_no}`}
    //   showTableTitle
    //   canCreate={false}
    //   //   isLoading={invoicesLoading}
    //   allLoading={invoicesLoading}
    //   columns={[
    //     {
    //       Header: "S/N",
    //       accessor: "sn",
    //     },
    //     {
    //       Header: "Fee Type",
    //       accessor: "feetype",
    //     },
    //     {
    //       Header: "Amount",
    //       accessor: "amount",
    //     },
    //     {
    //       Header: "Discount",
    //       accessor: "discount",
    //     },
    //     {
    //       Header: "Discounted Amount",
    //       accessor: "discount_amount",
    //     },
    //   ]}
    //   data={filteredFee}
    // />
    <div className=''>
      <GoBack />
      <PageSheet>
        {!paymentLoading && (
          <div className=''>
            <div className='' style={{ marginBottom: "30px" }}>
              <Button
                onClick={() => {
                  setChangeTableStyle(true);
                  setTimeout(() => {
                    if (pdfExportComponent.current) {
                      handlePrint();
                    }
                  }, 1000);
                  setTimeout(() => {
                    setChangeTableStyle(false);
                  }, 3000);
                }}
              >
                <FontAwesomeIcon icon={faPrint} /> Print Invoice
              </Button>
            </div>
            <div ref={pdfExportComponent} className='invoice'>
              <div className={`${changeTableStyle ? "view1" : "view2"}`}>
                <InvoiceHeader user={user} />
                {/* bill to table */}
                <div className='d-flex justify-content-between gap-5'>
                  <div className='' style={{ flex: "1" }}>
                    <InvoiceTable
                      centered
                      data={[
                        {
                          title: "Bill To:",
                          sub: `${filteredInvoice?.fullname?.toUpperCase()}`,
                        },
                      ]}
                      columns={[
                        {
                          Header: "Bill To:",
                          accessor: "sub",
                        },
                      ]}
                    />
                  </div>
                  <div className='' style={{ flex: "1" }}>
                    <div
                      className=''
                      style={{
                        margin: "10px 0px",
                      }}
                    >
                      <h3
                        style={{
                          fontWeight: "bold",
                          color: "red",
                          fontSize: "3rem",
                          lineHeigth: "1rem",
                          textTransform: "uppercase",
                        }}
                      >
                        {filteredInvoice?.term} Term Bill
                      </h3>
                      {filteredInvoice?.invoice_no && (
                        <div
                          className='d-flex gap-3'
                          style={{
                            marginTop: "10px",
                          }}
                        >
                          <p
                            style={{
                              fontWeight: "bold",
                              fontSize: "17px",
                              marginTop: "10px",
                              textTransform: "uppercase",
                            }}
                          >
                            INVOICE NUMBER:
                          </p>
                          <p
                            // className='motto'
                            style={{
                              fontWeight: "semi-bold",
                              fontSize: "17px",
                              marginTop: "10px",
                              textTransform: "uppercase",
                            }}
                          >
                            {filteredInvoice?.invoice_no}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className=''>
                  {/* bill to table */}
                  <div className='' style={{}}>
                    <InvoiceTable
                      centered
                      data={[
                        {
                          sub: `${filteredInvoice?.admission_number}`,
                          class: `${filteredInvoice?.class}`,
                          date: `${
                            dayjs(filteredInvoice?.due_date).format(
                              "MMM D, YYYY"
                            ) ?? ""
                          }`,
                        },
                      ]}
                      columns={[
                        {
                          Header: "Student's Admission No.",
                          accessor: "sub",
                        },
                        {
                          Header: "Class",
                          accessor: "class",
                        },
                        {
                          Header: "Due Date",
                          accessor: "date",
                        },
                      ]}
                    />
                  </div>
                  {/* fees table */}
                  <div className='' style={{ marginTop: "-30px" }}>
                    <InvoiceTable
                      centered
                      data={filteredFee}
                      columns={[
                        {
                          Header: "S/N",
                          accessor: "sn",
                        },
                        {
                          Header: "Fee Type",
                          accessor: "feetype",
                        },
                        // {
                        //   Header: "Amount",
                        //   accessor: "amount",
                        // },
                        // {
                        //   Header: "Discount",
                        //   accessor: "discount",
                        // },
                        {
                          Header: "Amount",
                          accessor: "discount_amount",
                        },
                      ]}
                    />
                  </div>
                  {/* total section */}
                  <div
                    className='d-flex justify-content-end'
                    style={{
                      fontWeight: "bold",
                      marginTop: "-10px",
                      height: "45px",
                      color: "rgb(39, 39, 39)",
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
                          fontSize: "17px",
                          textTransform: "uppercase",
                        }}
                      >
                        Total Amount
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
                          fontSize: "17px",
                          textTransform: "uppercase",
                        }}
                      >
                        {/* ₦{apiServices.formatNumberWithCommas(filteredInvoice?.amount)} */}
                        {`₦${apiServices?.formatNumberWithCommas(
                          calcAmount.toString() ?? "0"
                        )}`}
                      </p>
                    </div>
                    <div
                      className='d-flex justify-content-center align-items-center'
                      style={{
                        border: "1px solid rgb(177, 177, 177)",
                        padding: "20px, 30px",
                        width: "200px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "17px",
                          color: "white",
                        }}
                      >
                        As at 12, Feb 2024
                      </p>
                    </div>
                  </div>
                  {/* payment section */}
                  {filterPayment()?.map((fp, i) => {
                    return (
                      <div
                        key={i}
                        className='d-flex justify-content-end'
                        style={{
                          fontWeight: "bold",
                          marginTop: "0px",
                          height: "45px",
                          color: "rgb(39, 39, 39)",
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
                              fontSize: "17px",
                              textTransform: "uppercase",
                            }}
                          >
                            Payment {i + 1}
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
                              fontSize: "17px",
                              textTransform: "uppercase",
                            }}
                          >
                            {/* {`₦${apiServices?.formatNumberWithCommas(
                            calcAmount.toString() ?? "0"
                          )}`} */}
                            {fp?.amount_paid}
                          </p>
                        </div>
                        <div
                          className='d-flex justify-content-center align-items-center'
                          style={{
                            border: "1px solid rgb(177, 177, 177)",
                            padding: "20px, 30px",
                            width: "200px",
                          }}
                        >
                          <p
                            style={{
                              fontSize: "17px",
                              // color: "white",
                            }}
                          >
                            As at {fp?.paid_at}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {/* balance section */}
                  <div
                    className='d-flex justify-content-end'
                    style={{
                      fontWeight: "bold",
                      marginTop: "0px",
                      height: "45px",
                      color: "rgb(39, 39, 39)",
                    }}
                  >
                    <div
                      className='d-flex justify-content-center align-items-center '
                      style={{
                        border: "2px solid rgb(0, 0, 0)",
                        padding: "20px, 30px",
                        width: "250px",
                        fontSize: "17px",
                        backgroundColor: "rgba(1, 21, 59, 0.15)",
                        // display: "flex"
                      }}
                    >
                      <p
                        style={{
                          fontSize: "17px",
                          textTransform: "uppercase",
                        }}
                      >
                        Balance
                      </p>
                    </div>
                    <div
                      className='d-flex justify-content-center align-items-center'
                      style={{
                        border: "2px solid rgb(0, 0, 0)",
                        padding: "20px, 30px",
                        width: "300px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "17px",
                          textTransform: "uppercase",
                        }}
                      >
                        {/* ₦{apiServices.formatNumberWithCommas(filteredInvoice?.amount)} */}
                        {`₦${apiServices?.formatNumberWithCommas(
                          Number(calcAmount) -
                            (fp[fp?.length - 1]?.sum_amount ?? 0)
                        )}`}
                      </p>
                    </div>
                    <div
                      className='d-flex justify-content-center align-items-center'
                      style={{
                        border: "2px solid rgb(0, 0, 0)",
                        padding: "20px, 30px",
                        width: "200px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "17px",
                          color: "white",
                        }}
                      >
                        As at 12, Feb 2024
                      </p>
                    </div>
                  </div>
                  {/* bank details */}
                  <div className=''>
                    <p
                      className=''
                      style={{
                        fontWeight: "500",
                        fontSize: "17px",
                        marginTop: "50px",
                        marginBottom: "20px",
                        // textTransform: "uppercase",
                        // height: "45px",
                        color: "rgb(0, 0, 0)",
                      }}
                    >
                      Kindly pay fees into the bank below:
                    </p>
                    {bank?.map((bk, i) => {
                      return (
                        <div key={i} className=''>
                          <div
                            className='bankview'
                            // style={{
                            //   border: "1px solid rgb(177, 177, 177)",
                            //   // padding: "20px, 30px",
                            //   width: "30vw",
                            //   // height: "45px",
                            // }}
                          >
                            <div className='d-flex justify-content-start align-items-center px-5 pt-3'>
                              <p
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "17px",
                                  marginTop: "0px",
                                  color: "midnightblue",
                                  textTransform: "uppercase",
                                  // padding: "20px, 30px",
                                }}
                              >
                                {/* ₦{apiServices.formatNumberWithCommas(filteredInvoice?.amount)} */}
                                {bk?.account_purpose}
                              </p>
                            </div>
                            <div className='d-flex justify-content-start gap-3 align-items-center px-5 py-3'>
                              <p
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "17px",
                                  marginTop: "0px",
                                  color: "rgb(0, 0, 0)",
                                  textTransform: "uppercase",
                                  // padding: "20px, 30px",
                                }}
                              >
                                {/* ₦{apiServices.formatNumberWithCommas(filteredInvoice?.amount)} */}
                                ACCOUNT NAME:
                              </p>
                              <p
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "17px",
                                  marginTop: "0px",
                                  color: "rgb(0, 0, 0)",
                                  textTransform: "uppercase",
                                  // padding: "20px, 30px",
                                }}
                              >
                                {bk?.account_name}
                              </p>
                            </div>
                            {/* account number */}
                            <div className='d-flex justify-content-start gap-3 align-items-center px-5 pb-3'>
                              <p
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "17px",
                                  marginTop: "0px",
                                  color: "rgb(0, 0, 0)",
                                  textTransform: "uppercase",
                                  // padding: "20px, 30px",
                                }}
                              >
                                {/* ₦{apiServices.formatNumberWithCommas(filteredInvoice?.amount)} */}
                                ACCOUNT NUMBER:
                              </p>
                              <p
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "17px",
                                  marginTop: "0px",
                                  color: "rgb(0, 0, 0)",
                                  textTransform: "uppercase",
                                  // padding: "20px, 30px",
                                }}
                              >
                                {bk?.account_number}
                              </p>
                            </div>
                            {/*  */}
                            <div className='d-flex justify-content-start gap-3 align-items-center px-5 pb-3'>
                              <p
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "17px",
                                  marginTop: "0px",
                                  color: "rgb(0, 0, 0)",
                                  textTransform: "uppercase",
                                  // padding: "20px, 30px",
                                }}
                              >
                                {/* ₦{apiServices.formatNumberWithCommas(filteredInvoice?.amount)} */}
                                BANK NAME:
                              </p>
                              <p
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "17px",
                                  marginTop: "0px",
                                  color: "rgb(0, 0, 0)",
                                  textTransform: "uppercase",
                                  // padding: "20px, 30px",
                                }}
                              >
                                {bk?.bank_name}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {paymentLoading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              padding: "50px 0px",
            }}
          >
            {/* <p className='' style={{ fontSize: "16px" }}>
                No records
              </p> */}
            <Spinner />
          </div>
        )}
      </PageSheet>
    </div>
  );
};

export default InvoiceFees;
