import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const ImagePreview = ({
  wrapperClassName,
  centered = false,
  src,
  reset,
  fileType,
}) => {
  // console.log({ src, fileType, ff: fileType?.includes("image") });

  return (
    <div
      className={` custom-image-preview ${centered ? "mx-auto" : ""} ${
        wrapperClassName || ""
      }`}
      style={{ position: "relative" }}
    >
      {src ? (
        <>
          <button type='button' className='btn reset-btn' onClick={reset}>
            <FontAwesomeIcon icon={faClose} />
          </button>
          {fileType?.includes("image") && <img src={src} alt='preview' />}
          {!fileType?.includes("image") && (
            <div
              style={{
                color: "white",
                width: "100%",
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                textAlign: "center",
                fontSize: "18px",
              }}
            >
              No Preview Available
            </div>
          )}
        </>
      ) : (
        <p>File Preview</p>
      )}
    </div>
  );
};

export default ImagePreview;
