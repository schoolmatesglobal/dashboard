import React from "react";
import styles from "../../../assets/scss/pages/dashboard/assignment.module.scss";
import ButtonGroup from "../../../components/buttons/button-group";
import useMyMediaQuery from "../../../hooks/useMyMediaQuery";
import useMyMediaQuery2 from "../../../hooks/useMyMediaQuery2";
import Button from "../../../components/buttons/button";

const CreateNoteCard = ({
  setCreateN,
  setEditPrompt,
  notes,
  setDeletePrompt,
  setEditTopic,
  setEditDescription,
  setEditFileName,
  setEditSubmittedBy,
  setEditStatus,
  setEditFile,
  setEditLessonNoteId,
  permission,
  handleDownload,
  setClearAllPrompt,
  setPublished,
  handleViewFile,
  iframeUrl,
  setIframeUrl,
  selectedDocs,
  setSelectedDocs,
  base64String,
  setBase64String,
  setFile,
  setFileName,
}) => {
  const { xs, sm, md, lg, xl, xxl } = useMyMediaQuery2();

  // console.log({ notes });

  return (
    <div
      // className={styles.create__questions_container}
      style={{ border: "3px solid #2f2e41" }}
      className='w-100 bg-white '
    >
      <div
        className={`d-flex  ${
          xs ? "flex-column" : sm ? "flex-column" : "flex-row"
        }`}
      >
        <p
          className={`fw-bold fs-3 lh-base border-2 border py-3 px-4`}
          style={{ width: `${xs ? "100%" : sm ? "100%" : "20%"}` }}
        >
          Status:
        </p>
        <div
          className={`fs-3 fw-bold d-flex align-items-center  lh-base px-4 border-2 border  ${
            xs ? " py-3" : sm ? " py-3" : ""
          }`}
          style={{ width: `${xs ? "100%" : sm ? "100%" : "80%"}` }}
        >
          <div className='d-flex align-items-center gap-2'>
            <p
              style={{ whiteSpace: "nowrap" }}
              className={`${
                notes?.status === "approved" ? "text-success  " : "text-danger"
              } ${
                notes?.status === "approved" ? "bg-success  " : "bg-danger"
              } bg-opacity-10 w-auto px-3 py-2`}
            >
              {notes?.status === "approved" ? "Approved" : "Not Approved"}
            </p>

            {notes?.date_approved && (
              <p className='fw-normal'>--- {notes?.date_approved}</p>
            )}
          </div>
        </div>
      </div>
      <div
        className={`d-flex  ${
          xs ? "flex-column" : sm ? "flex-column" : "flex-row"
        }`}
      >
        <p
          className={`fw-bold fs-3 lh-base border-2 border py-3 px-4`}
          style={{ width: `${xs ? "100%" : sm ? "100%" : "20%"}` }}
        >
          Topic:
        </p>
        <p
          className={`fs-3 lh-base py-3 px-4 border-2 border `}
          style={{ width: `${xs ? "100%" : sm ? "100%" : "80%"}` }}
        >
          {notes?.topic}
        </p>
      </div>
      <div
        className={`d-flex  ${
          xs ? "flex-column" : sm ? "flex-column" : "flex-row"
        }`}
      >
        <p
          className={`fw-bold fs-3 lh-base border-2 border py-3 px-4`}
          style={{ width: `${xs ? "100%" : sm ? "100%" : "20%"}` }}
        >
          Description:
        </p>
        <p
          className={`fs-3 lh-base py-3 px-4 border-2 border `}
          style={{ width: `${xs ? "100%" : sm ? "100%" : "80%"}` }}
        >
          {notes?.description}
        </p>
      </div>
      <div
        className={`d-flex  ${
          xs ? "flex-column" : sm ? "flex-column" : "flex-row"
        }`}
      >
        <p
          className={`fw-bold fs-3 lh-base border-2 border py-3 px-4`}
          style={{ width: `${xs ? "100%" : sm ? "100%" : "20%"}` }}
        >
          File Name:
        </p>
        <div
          className={`d-flex gap-3 ${
            xs
              ? "flex-column"
              : sm
              ? "flex-column"
              : "flex-row align-items-center"
          } py-3 px-4 border-2 border`}
          style={{ width: `${xs ? "100%" : sm ? "100%" : "80%"}` }}
        >
          <p className='fs-3 lh-base'>{notes?.file_name}</p>
        </div>
      </div>
      <div
        className={`d-flex  ${
          xs ? "flex-column" : sm ? "flex-column" : "flex-row"
        }`}
      >
        <p
          className={`fw-bold fs-3 lh-base border-2 border py-3 px-4`}
          style={{ width: `${xs ? "100%" : sm ? "100%" : "20%"}` }}
        >
          Submitted By:
        </p>
        <p
          className={`fs-3 lh-base py-3 px-4 border-2 border`}
          style={{ width: `${xs ? "100%" : sm ? "100%" : "80%"}` }}
        >
          {notes?.submitted_by} <span className="">--- {notes?.date_submitted}</span>
        </p>
      </div>

      <div
        className={`d-flex align-items-center  ${
          xs
            ? "flex-column gap-3"
            : sm
            ? "flex-row justify-content-between"
            : "flex-row justify-content-between"
        } border-2 border py-3 px-4`}
      >
        <div className='d-flex align-content-center gap-4'>
          <Button
            variant=''
            className={`${xs ? "w-100" : sm ? "w-100" : "w-auto"} `}
            onClick={() => {
              if (permission?.approve) {
                setEditLessonNoteId(notes?.id);
                setPublished(true);
                setClearAllPrompt(true);
              } else {
                const base64 = notes?.file;
                setEditTopic(notes?.topic);
                setEditDescription(notes?.description);
                setEditFileName(notes?.file_name);
                setEditSubmittedBy(notes?.submitted_by);
                setEditStatus(notes?.status);
                setEditFile(notes?.file);
                setEditLessonNoteId(notes?.id);
                setEditPrompt(true);
                setFile(null);
                setFileName("");
                // setCreateN((prev) => {
                //   return {
                //     ...prev,
                //     file: notes?.file,
                //     file_name: notes?.file_name,
                //   };
                // });
              }
              // setCreateQuestionPrompt(true);
            }}
          >
            {permission?.approve ? "Approve" : "Edit"}
          </Button>
          <Button
            variant='outline-danger'
            className={`${xs ? "w-100" : sm ? "w-100" : "w-auto"} `}
            onClick={() => {
              if (permission?.approve) {
                setEditLessonNoteId(notes?.id);
                setPublished(false);
                setClearAllPrompt(true);
              } else {
                setEditLessonNoteId(notes?.id);
                setDeletePrompt(true);
              }
              // setCreateQuestionPrompt(true);
            }}
          >
            {permission?.approve ? "Unapprove" : "Delete"}
          </Button>
        </div>

        <Button
          variant=''
          className='w-auto'
          onClick={() => {
            handleViewFile(notes?.file);
          }}
        >
          View Note
        </Button>
      </div>
    </div>
  );
};

export default CreateNoteCard;
