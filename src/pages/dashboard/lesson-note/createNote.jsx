import React, { useEffect, useState, useRef } from "react";

import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../../../assets/scss/pages/dashboard/assignment.module.scss";
import Prompt from "../../../components/modals/prompt";
import { useLessonNote } from "../../../hooks/useLessonNote";
import { addQuestionMarks } from "./constant";
import Button from "../../../components/buttons/button";
import useMyMediaQuery2 from "../../../hooks/useMyMediaQuery2";
import CustomFileInput2 from "../../../components/inputs/CustomFileInput2";
import dayjs from "dayjs";
// import SelectSearch from "../inputs/SelectSearch";

const CreateNote = ({
  createQ,
  setCreateQ,
  createQuestionPrompt,
  setCreateQuestionPrompt,
  apiServices,
  errorHandler,
  permission,
  user,
  subjectsByTeacher,
  lessonNotes,
  setLessonNotes,
  subjects,
  error,
  setError,
  handleFileChange,
  handleReset,
  file,
  setFile,
  fileName,
  setFileName,
  addLessonNote,
  addLessonNoteLoading,
  base64String,
  setBase64String,
  trigger,
}) => {
  const fileInputRef = useRef(null);

  const date = dayjs(new Date()).format("MMM D, YYYY h:mm A");

  const { xs, sm, md, lg, xl, xxl } = useMyMediaQuery2();

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const wordCt = xs ? 12 : sm ? 20 : md ? 25 : lg ? 25 : 25;

  function trimString(str) {
    // Check if the string is longer than 5 characters
    if (str.length > wordCt) {
      // Trim the sting to 5 characters and append "..."
      return str.slice(0, wordCt) + "...";
    }
    // Return the original string if it is 5 characters or less
    return str;
  }

  // const {
  //   createQ,
  //   setCreateQ,
  //   error,
  //   setError,
  //   handleFileChange,
  //   handleReset,
  //   lessonNotes,
  //   setLessonNotes,
  // } = useLessonNote();

  const {
    term,
    period,
    session,
    week,
    class_name,
    submitted_by,
    subject_id,
    status,
    topic,
    description,
    // file,
    file_name,
  } = createQ;

  const handleSubmit = (e) => {
    // e.preventDefault();
    if (file) {
      // Send file to database logic here
      console.log("File to be sent:", file);
      // Reset the form
      alert("File uploaded successfully!");
      handleReset();
    }
  };

  // const handleReset = () => {
  //   setFile(null);
  //   setFileName("");
  //   setError("");
  //   document.getElementById("fileInput").value = null;
  // };
  // const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  // const [imageUpload, setImageUpload] = useState(null);

  const [previewUrl, setPreviewUrl] = useState("");

  const [imageNam, setImageNam] = useState("No file selected");
  // const [activateError, setActivateError] = useState(false);
  // const [fileUploadError, setFileUploadError] = useState("");
  const [activeTab, setActiveTab] = useState("1");

  // const [correctAns, setCorrectAns] = useState("");

  const activatePreview = () => {
    if (!topic || !description || !fileName) {
      return true;
    } else {
      return false;
    }
  };

  const buttonOptions = [
    {
      title: "Cancel",
      onClick: () => setCreateQuestionPrompt(false),
      variant: "outline",
    },
    {
      title: "Submit",
      disabled: activatePreview(),
      isLoading: addLessonNoteLoading,
      onClick: async () => {
        await addLessonNote();
        // trigger(500);
      },
      // variant: "outline",
    },
  ];

  // const date = new Date().toLocaleDateString();

  const subName = subjects?.find(
    (ob) => Number(ob.id) === Number(createQ.subject_id)
  )?.subject;

  // console.log({
  //   createQ,
  //   subjects,
  //   subName,
  //   lessonNotes,
  //   file,
  //   fileName,
  //   // date,
  //   // dt,
  // });

  // console.log({ total_mark, theory_total_mark, total_question, question_mark });
  // console.log({ tl: TheoryQ?.length });

  return (
    <div className={styles.create_question}>
      <Prompt
        isOpen={createQuestionPrompt}
        toggle={() => setCreateQuestionPrompt(!createQuestionPrompt)}
        hasGroupedButtons={true}
        groupedButtonProps={buttonOptions}
        // singleButtonText='Preview'
        promptHeader={`${subName?.toUpperCase()} - (WEEK ${createQ?.week?.toUpperCase()})`}
      >
        <>
          <p className='fs-3 fw-bold mb-4'>Topic</p>
          <div className='auth-textarea-wrapper'>
            <textarea
              className='form-control fs-3 lh-base'
              type='text'
              value={topic}
              placeholder='Type the title of the lesson note'
              onChange={(e) =>
                setCreateQ((prev) => {
                  return { ...prev, topic: e.target.value };
                })
              }
              style={{
                minHeight: "100px",
              }}
            />
          </div>
          <p className='fs-3 fw-bold my-4'>Description</p>
          <div className='auth-textarea-wrapper'>
            <textarea
              className='form-control fs-3 lh-base'
              type='text'
              value={description}
              placeholder='Type the description of the lesson note'
              onChange={(e) =>
                setCreateQ((prev) => {
                  return { ...prev, description: e.target.value };
                })
              }
              style={{
                minHeight: "200px",
              }}
            />
          </div>

          <p className='fs-3 fw-bold my-4'>File Upload</p>
          <CustomFileInput2
            handleFileChange={handleFileChange}
            fileName={fileName}
            handleReset={handleReset}
            error={error}
            loading={addLessonNoteLoading}
          />

          {/* <p className="fs-3 text-center my-4">...Uploading</p> */}
        </>
      </Prompt>
    </div>
  );
};

export default CreateNote;
