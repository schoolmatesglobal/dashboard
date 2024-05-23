import { faEye, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import styles from "../../../assets/scss/pages/dashboard/assignment.module.scss";
import PageSheet from "../../../components/common/page-sheet";
import Prompt from "../../../components/modals/prompt";
import { useLessonNote } from "../../../hooks/useLessonNote";
import { useStudentAssignments } from "../../../hooks/useStudentAssignment";
import { useSubject } from "../../../hooks/useSubjects";
import Create from "./create";

const LessonNote = () => {
  const {
    createN,
    setCreateN,
    createQuestionPrompt,
    setCreateQuestionPrompt,
    apiServices,
    errorHandler,
    permission,
    user,
    subjectsByTeacher,
    lessonNotes,
    setLessonNotes,
    error,
    setError,
    handleFileChange,
    handleReset,
    file,
    setFile,
    fileName,
    setFileName,
    handleDownload,
    handleViewFile,
    iframeUrl,
    setIframeUrl,
  } = useLessonNote();

  const { subjects } = useSubject();

  const [clearAllPrompt, setClearAllPrompt] = useState(false);

  //   const getToggleButtons = () => {
  //     let arr = [];

  //     if (permission?.create) {
  //       arr.push({
  //         title: (
  //           <>
  //             <FontAwesomeIcon icon={faPen} /> Create
  //           </>
  //         ),
  //         onClick: () => setActiveTab("1"),
  //         variant: `${activeTab === "1" ? "" : "outline"}`,
  //       });
  //     }

  //     if (permission?.view) {
  //       arr.push({
  //         title: (
  //           <>
  //             <FontAwesomeIcon icon={faEye} /> View
  //           </>
  //         ),
  //         onClick: () => setActiveTab("3"),
  //         variant: `${activeTab === "3" ? "" : "outline"}`,
  //       });
  //     }

  //     return arr;
  //   };

  const clearAllButtons = [
    {
      title: "Ok",
      onClick: () => {
        setClearAllPrompt(false);
      },
      // variant: "outline",
    },
  ];

  //   useEffect(() => {
  //     if (permission?.view && !permission?.create) {
  //       setActiveTab("3");
  //     } else if (permission?.create && permission?.view) {
  //       setActiveTab("1");
  //     }
  //   }, []);

  console.log({
    window,
    href: window.location.href,
  });
  return (
    <PageSheet>
      <div className={styles.home}>
        <Create
          createN={createN}
          setCreateN={setCreateN}
          createQuestionPrompt={createQuestionPrompt}
          setCreateQuestionPrompt={setCreateQuestionPrompt}
          apiServices={apiServices}
          errorHandler={errorHandler}
          permission={permission}
          user={user}
          subjectsByTeacher={subjectsByTeacher}
          lessonNotes={lessonNotes}
          setLessonNotes={setLessonNotes}
          error={error}
          setError={setError}
          handleFileChange={handleFileChange}
          handleReset={handleReset}
          file={file}
          setFile={setFile}
          fileName={fileName}
          setFileName={setFileName}
          handleDownload={handleDownload}
          handleViewFile={handleViewFile}
          iframeUrl={iframeUrl}
          setIframeUrl={setIframeUrl}
        />
      </div>

      <Prompt
        promptHeader={`COMPLETE CREATION PROCESS`}
        toggle={() => setClearAllPrompt(!clearAllPrompt)}
        isOpen={clearAllPrompt}
        hasGroupedButtons={true}
        groupedButtonProps={clearAllButtons}
      >
        <p
          className={styles.create_question_question}
          // style={{ fontSize: "15px", lineHeight: "20px" }}
        >
          Please complete creation process before leaving this section.
        </p>
      </Prompt>
    </PageSheet>
  );
};

export default LessonNote;
