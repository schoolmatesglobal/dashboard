import React, { useEffect, useState, useRef } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useMyMediaQuery2 from "../../hooks/useMyMediaQuery2";
import Button from "../buttons/button";

const CustomFileInput2 = ({
  handleFileChange,
  fileName,
  handleReset,
  error,
}) => {
  const { xs, sm, md, lg, xl, xxl } = useMyMediaQuery2();

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const wordCt = xs ? 12 : sm ? 13 : md ? 18 : lg ? 23 : 23;

  function trimString(str) {
    // Check if the string is longer than 5 characters
    if (str.length > wordCt) {
      // Trim the sting to 5 characters and append "..."
      return str.slice(0, wordCt) + "...";
    }
    // Return the original string if it is 5 characters or less
    return str;
  }

  return (
    <div className=''>
      <div className='d-flex flex-column gap-3'>
        {/*Question Mark */}
        <div className='d-flex align-items-center gap-3 '>
          <div
            className='d-flex align-items-center gap-3 '
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
            {/* trimString */}
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
              accept='.doc, .docx'
              //   accept='.pdf, .doc, .docx'
              onChange={handleFileChange}
              // style={{
              //   display: "hidden",
              // }}
              className='d-none'
            />
          </div>
          <FontAwesomeIcon
            onClick={handleReset}
            icon={faXmark}
            style={{ width: "30px", height: "30px", cursor: "pointer" }}
          />
        </div>
      </div>
      <p className={`fs-4  mt-4 ${error ? "text-danger" : "text-black"}`}>
        {error ? error : "NB: Doc File with max size of 1mb"}
      </p>
    </div>
  );
};

export default CustomFileInput2;
