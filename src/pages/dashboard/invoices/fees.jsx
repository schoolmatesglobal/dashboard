import React, { useState } from "react";
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

const InvoiceFees = () => {
  const {
    isLoading: invoicesLoading,
    invoicesList,
    apiServices,
    handlePrint,
    pdfExportComponent,
    user,
  } = useInvoices();

  const { bank, isLoading: bankLoading } = useBank();

  const { id } = useParams();

  const [changeTableStyle, setChangeTableStyle] = useState(false);

  function fi() {
    return invoicesList?.find((iv) => iv?.id === id);
  }

  let calcAmount = 0;

  // let calcAmount2 = `₦${apiServices.formatNumberWithCommas(calcAmount ?? 0)}`;

  const filteredInvoice = fi();
  const filteredFee = fi()?.fee?.map((fi, i) => {
    calcAmount = Number(calcAmount) + Number(fi?.discount_amount) ?? 0;

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

  console.log({
    bank,
    calcAmount,
    changeTableStyle,
    invoicesList,
    invoicesLoading,
    filteredInvoice,
    filteredFee,
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
                          fontSize: "18px",
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
                          fontSize: "18px",
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
                      date: `Feb 20, 2023`,
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
                />
              </div>
              <div
                className='d-flex justify-content-end'
                style={{
                  fontWeight: "bold",
                  marginTop: "-20px",
                  textTransform: "uppercase",
                  height: "45px",
                  color: "rgb(39, 39, 39)",
                }}
              >
                <div
                  className='d-flex justify-content-center align-items-center '
                  style={{
                    border: "1px solid rgb(177, 177, 177)",
                    padding: "20px, 30px",
                    width: "300px",
                    fontSize: "20px",
                    // display: "flex"
                  }}
                >
                  <p
                    style={{
                      fontSize: "20px",
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
                    width: "330px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "20px",
                    }}
                  >
                    {/* ₦{apiServices.formatNumberWithCommas(filteredInvoice?.amount)} */}
                    {`₦${apiServices?.formatNumberWithCommas(
                      calcAmount.toString() ?? "0"
                    )}`}
                  </p>
                </div>
              </div>
              <div className=''>
                <p
                  className=''
                  style={{
                    fontWeight: "500",
                    fontSize: "18px",
                    marginTop: "20px",
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
                              fontSize: "18px",
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
                              fontSize: "18px",
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
                              fontSize: "18px",
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
                              fontSize: "18px",
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
                              fontSize: "18px",
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
                              fontSize: "18px",
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
                              fontSize: "18px",
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
      </PageSheet>
    </div>
  );
};

export default InvoiceFees;
