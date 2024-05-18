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
  permission,
  handleDownload,
  setClearAllPrompt,
  setPublished,
}) => {
  const { xs, sm, md, lg, xl, xxl } = useMyMediaQuery2();

  console.log({ notes });

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
          className={`fw-bold fs-3 lh-base border-2 border p-3 ${
            xs ? "w-100" : sm ? "w-100" : "w-25"
          } `}
        >
          Status:
        </p>
        <div
          className={`fs-3 fw-bold d-flex align-items-center  lh-base px-3 border-2 border  ${
            xs ? "w-100 py-3" : sm ? "w-100 py-3" : "w-75"
          }`}
        >
          <p
            style={{ whiteSpace: "nowrap" }}
            className={`${
              notes?.status === "Approved" ? "text-success  " : "text-danger"
            } ${
              notes?.status === "Approved" ? "bg-success  " : "bg-danger"
            } bg-opacity-10 w-auto px-3 py-2`}
          >
            {notes?.status === "Approved" ? "Approved" : "Not Approved"}
          </p>
        </div>
      </div>
      <div
        className={`d-flex  ${
          xs ? "flex-column" : sm ? "flex-column" : "flex-row"
        }`}
      >
        <p
          className={`fw-bold fs-3 lh-base border-2 border p-3 ${
            xs ? "w-100" : sm ? "w-100" : "w-25"
          } `}
        >
          Topic:
        </p>
        <p
          className={`fs-3 lh-base p-3 border-2 border ${
            xs ? "w-100" : sm ? "w-100" : "w-75"
          }`}
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
          className={`fw-bold fs-3 lh-base border-2 border p-3 ${
            xs ? "w-100" : sm ? "w-100" : "w-25"
          } `}
        >
          Description:
        </p>
        <p
          className={`fs-3 lh-base p-3 border-2 border ${
            xs ? "w-100" : sm ? "w-100" : "w-75"
          }`}
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
          className={`fw-bold fs-3 lh-base border-2 border p-3 ${
            xs ? "w-100" : sm ? "w-100" : "w-25"
          } `}
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
          } p-3 border-2 border ${xs ? "w-100" : sm ? "w-100" : "w-75"}`}
        >
          <p className='fs-3 lh-base'>{notes?.file_name}</p>
          {/* <Button
            variant=''
            className='w-auto'
            onClick={() => {
              // setCreateQuestionPrompt(true);
            }}
          >
            Download
          </Button> */}
        </div>
      </div>
      <div
        className={`d-flex  ${
          xs ? "flex-column" : sm ? "flex-column" : "flex-row"
        }`}
      >
        <p
          className={`fw-bold fs-3 lh-base border-2 border p-3 ${
            xs ? "w-100" : sm ? "w-100" : "w-25"
          } `}
        >
          Submitted By:
        </p>
        <p
          className={`fs-3 lh-base p-3 border-2 border ${
            xs ? "w-100" : sm ? "w-100" : "w-75"
          }`}
        >
          {notes?.submitted_by}
        </p>
      </div>

      <div
        className={`d-flex align-items-center  ${
          xs
            ? "flex-column gap-3"
            : sm
            ? "flex-row justify-content-between"
            : "flex-row justify-content-between"
        } border-2 border p-3`}
      >
        <div className='d-flex align-content-center gap-3'>
          <Button
            variant=''
            className={`${xs ? "w-100" : sm ? "w-100" : "w-auto"} `}
            onClick={() => {
              if (permission?.approve) {
                setPublished(true);
                setClearAllPrompt(true);
              } else {
                setEditTopic(notes?.topic);
                setEditDescription(notes?.description);
                setEditFileName(notes?.file_name);
                setEditSubmittedBy(notes?.submitted_by);
                setEditStatus(notes?.status);
                setEditFile(notes?.file);
                setEditPrompt(true);
                setCreateN((prev) => {
                  return {
                    ...prev,
                    file: notes?.file,
                    file_name: notes?.file_name,
                  };
                });
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
                setPublished(false);
                setClearAllPrompt(true);
              } else {
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
            handleDownload();
          }}
        >
          Download File
        </Button>
      </div>
    </div>
  );
};

export default CreateNoteCard;
