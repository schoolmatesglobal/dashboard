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

const InvoiceFees = () => {
  const {
    isLoading: invoicesLoading,
    invoicesList,
    apiServices,
    handlePrint,
    pdfExportComponent,
    user,
  } = useInvoices();

  const { id } = useParams();

  const [changeTableStyle, setChangeTableStyle] = useState(false);

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
    <div className='results-sheet'>
      <PageSheet>
        <div className='mb-3'>
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
            <FontAwesomeIcon icon={faPrint} /> Print
          </Button>
        </div>

        <div
          ref={pdfExportComponent}
          className=''
          className='first-level-results-sheet preschool first-half'
        >
          <InvoiceHeader
            user={user}
            InvoiceDetails={filteredInvoice}
            changeTableStyle={changeTableStyle}
            // studentImage={studentData?.image}
          />
        </div>
      </PageSheet>
    </div>
  );
};

export default InvoiceFees;
