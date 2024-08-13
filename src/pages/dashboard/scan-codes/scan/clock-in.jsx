import dayjs from "dayjs";
import { Html5QrcodeScanner } from "html5-qrcode";
import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useParams } from "react-router-dom";
import GoBack from "../../../../components/common/go-back";
import PageSheet from "../../../../components/common/page-sheet";
import PageTitle from "../../../../components/common/title";
import { useMutation, useQuery } from "react-query";
import { useQrcode } from "../../../../hooks/useQrcode";
import { toast } from "react-toastify";
import { Spinner } from "reactstrap";

const ClockIn = () => {
  const [scanResult, setScanResult] = useState(null);
  const pdfExportComponent = useRef(null);
  const { id } = useParams();
  const { apiServices, permission } = useQrcode();
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);

  const isDesktop = useMediaQuery({ query: "(min-width: 992px)" });
  const isTablet = useMediaQuery({
    query: "(min-width: 768px) and (max-width: 991px)",
  });
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const date = dayjs(new Date()).format("ddd, MMM D, YYYY");
  const time = dayjs(new Date()).format("h:mm:ss A");

  const { mutateAsync: addSkill, isLoading: addSkillLoading } = useMutation(
    apiServices.postSkill,
    {
      onSuccess() {
        toast.success("Clock-in was successful");
      },
      onError: apiServices.errorHandler,
    }
  );

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: isDesktop ? 500 : 400,
        height: isDesktop ? 500 : 400,
      },
      fps: 5,
    });

    scanner.render(
      (result) => {
        scanner.clear();
        setLoading(true);
        toast.success(`Clock-in at ${time} was successful`);
        setScanResult(result);
        setLoading(false);
      },
      (error) => {
        // toast.error("Something went wrong, try again.");
        console.log(error);
      }
    );

    return () => {
      scanner.clear();
    };
  }, [isDesktop, isTablet, isMobile]);

  console.log({ id });

  return (
    <div>
      <GoBack />
      <PageSheet>
        <div ref={pdfExportComponent} className=''>
          <div className='w-100 d-flex flex-column justify-content-center text-center align-items-center mt-5'>
            <p className='fw-bold fs-1 mb-3'>{`Clock-in Attendance for:`}</p>
            <p className='fw-bold fs-3 mb-5'>{`(${date})`}</p>
          </div>
        </div>

        {loading && (
          <div className='h-100 w-100 d-flex justify-content-center align-items-center'>
            <Spinner /> <p className='fs-3 ml-2'>Submitting...</p>
          </div>
        )}

        {!loading && (
          <div
            style={{
              marginBottom: "100px",
            }}
          >
            {scanResult ? (
              <p className='d-flex justify-content-center gap-4 align-items-center mt-5 mb-5 fs-3 fw-bold'>
                Success:{" "}
                <a href={`https://${scanResult}`} className=''>
                  {scanResult}
                </a>
              </p>
            ) : (
              <div
                id='reader'
                style={{
                  height: "fit",
                }}
              ></div>
            )}
          </div>
        )}
      </PageSheet>
    </div>
  );
};

export default ClockIn;
