import React, { useRef } from "react";
import Button from "../buttons/button";

const CustomFileInput = ({
  activateError,
  previewUrl,
  setPreviewUrl,
  setImageUpload,
  imageUpload,
  imageName,
  setImageName,
  setFileUploadError,
  fileUploadError,
  // data,
  //   handleButtonClick,
  //   handleFileInputChange,
  //   fileInputRef,
}) => {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  let file;

  const handleFileInputChange = (event) => {
    file = event.target.files[0];

    if (file) {
      //   if (file.size <= 1024 * 1024) {
      if (file.size <= 1024 * 1024 * 2) {
        // 1MB as an example size limit
        setImageUpload(file);
        setImageName(file.name);

        // console.log(file);
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
        setFileUploadError("");
      } else {
        setImageUpload(null);
        setFileUploadError("Image size exceeds the limit (2MB), upload again.");
      }
    }
  };

  return (
    <div className="">
      <div className="custom-file-input">
        {/* <div
        className={`${
          activateError && (!previewUrl || fileUploadError)
            ? "flex ring !ring-red-500 rounded-[10px] w-full"
            : "flex rounded-[10px] w-full"
        } "flex items-center  border !border-primary w-full !h-[43px]"`}
      > */}

        <Button
          // color="primary"
          // onPress={onClose}
          onClick={handleButtonClick}
          // size="md"
          // radius="sm"
          className=""
        >
          {previewUrl && !fileUploadError ? "Update File" : "Choose File"}
        </Button>
        <p className="input-text">
          {previewUrl && !fileUploadError // ? imageUpload?.name || details.firebaseMoverDetails.profilePictureName
            ? imageName
            : imageName}
        </p>
      </div>
      {!fileUploadError && (
        <p className="file-input-message">
          Accepted file types: PNG, JPG, JPEG; File size: 2MB max.
        </p>
      )}
      {fileUploadError && (
        <p className=" file-input-error">{fileUploadError}</p>
      )}
      <input
        type="file"
        className="file-input"
        // accept="image/png, image/gif, image/jpeg"
        accept="image/png, image/jpeg, image/jpg"
        onChange={handleFileInputChange}
        ref={fileInputRef}
      />
    </div>
  );
};

export default CustomFileInput;
