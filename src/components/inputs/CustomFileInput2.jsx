import React, { useEffect, useState, useRef } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useMyMediaQuery2 from "../../hooks/useMyMediaQuery2";
import Button from "../buttons/button";

const CustomFileInput2 = ({
  handleFileChange,
  fileName,
  setFileName,
  handleReset,
  error,
}) => {
  const { xs, sm, md, lg } = useMyMediaQuery2();
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const wordCt = xs ? 12 : sm ? 13 : md ? 18 : lg ? 23 : 23;

  const trimString = (str) => {
    return str.length > wordCt ? `${str.slice(0, wordCt)}...` : str;
  };

  return (
    <div>
      <div className='d-flex flex-column gap-3'>
        <div className='d-flex align-items-center gap-3'>
          <div
            className='d-flex align-items-center gap-3'
            style={{
              padding: "10px 10px",
              border: "2px solid #11355c",
              borderRadius: "5px",
              backgroundColor: "#f8f9fa",
              color: "#495057",
              fontSize: "16px",
              cursor: "pointer",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <Button variant='' onClick={handleButtonClick}>
              {fileName ? "Update" : "Choose"}
            </Button>
            <p className='' style={{ whiteSpace: "nowrap" }}>
              {fileName ? trimString(fileName) : "No file selected"}
            </p>
            <input
              ref={fileInputRef}
              id='fileInput'
              type='file'
              accept='.pdf'
              // accept='.doc,.docx,.pdf'
              onChange={handleFileChange}
              className='d-none'
            />
          </div>
          <FontAwesomeIcon
            onClick={() => {
              handleReset();
              if(setFileName){
                setFileName("");
              }
            }}
            icon={faXmark}
            style={{ width: "30px", height: "30px", cursor: "pointer" }}
          />
        </div>
      </div>
      <p className={`fs-4 mt-4 ${error ? "text-danger" : "text-black"}`}>
        {error ? error : "NB: PDF file with max size of 1MB"}
        {/* {error ? error : "NB: Doc or PDF file with max size of 1MB"} */}
      </p>
    </div>
  );
};

export default CustomFileInput2;
