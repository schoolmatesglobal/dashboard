import React, { useRef } from "react";
import AuthInput from "../../../../components/inputs/auth-input";
import DetailView from "../../../../components/views/detail-view";
import { Col, Row } from "reactstrap";
import PageSheet from "../../../../components/common/page-sheet";
import GoBack from "../../../../components/common/go-back";
import PageTitle from "../../../../components/common/title";
import qrCode from "../../../../assets/images/schoolmatesqr.jpeg";
import { useMediaQuery } from "react-responsive";
import { useParams } from "react-router-dom";
import { useSkills } from "../../../../hooks/useSkills";
import { useQrcode } from "../../../../hooks/useQrcode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faDownload } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../../components/buttons/button";
import { useReactToPrint } from "react-to-print";

const DownloadDetail = () => {
  //   const { isLoading, addSkill, isEdit, editSkill, skill, skills } = useQrcode();

  const pdfExportComponent = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => pdfExportComponent.current,
  });

  const { id } = useParams();

  const isDesktop = useMediaQuery({ query: "(min-width: 992px)" });
  const isTablet = useMediaQuery({
    query: "(min-width: 768px, max-width: 991px)",
  });
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  // console.log({ id });

  return (
    <div>
      <GoBack />
      <PageSheet
      //   isLoading={isLoading}
      //   pageTitle='Staff Attendance - QR Code'
      //   onFormSubmit={handleSubmit(onSubmit)}
      >
        <div ref={pdfExportComponent} className=''>
          <div className='w-100 d-flex justify-content-center align-items-center mt-5'>
            <PageTitle>{`${
              id === "1" ? "Staff" : "Student"
            } Attendance - QR Code`}</PageTitle>
          </div>
          <div
            style={{}}
            className='w-100 d-flex justify-content-center align-items-center'
          >
            <img
              src={qrCode}
              alt='qr-code'
              style={{
                width: `${
                  isDesktop
                    ? "50%"
                    : isTablet
                    ? "50%"
                    : isMobile
                    ? "80%"
                    : "80%"
                }`,
                height: "auto",
              }}
            />
          </div>
        </div>

        <div className='d-flex justify-content-center gap-4 align-items-center mt-5 mb-5'>
          {/* <Button
            onClick={() => {
              // setChangeTableStyle(true);
              // setTimeout(() => {
              //   if (pdfExportComponent.current) {
              //     handlePrint();
              //   }
              // }, 1000);
              // setTimeout(() => {
              //   setChangeTableStyle(false);
              // }, 3000);
            }}
          >
            <FontAwesomeIcon icon={faDownload} /> Download
          </Button> */}
          <Button
            onClick={() => {
              if (pdfExportComponent.current) {
                handlePrint();
              }
              // setChangeTableStyle(true);
              // setTimeout(() => {
              //   if (pdfExportComponent.current) {
              //     handlePrint();
              //   }
              // }, 1000);
              // setTimeout(() => {
              //   setChangeTableStyle(false);
              // }, 3000);
            }}
          >
            <FontAwesomeIcon icon={faPrint} /> Print
          </Button>
        </div>
      </PageSheet>
    </div>
  );
};

export default DownloadDetail;
