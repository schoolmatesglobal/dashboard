import React, { useState } from "react";
import PageSheet from "../../../components/common/page-sheet";
import { useEffect } from "react";
import styles from "../../../assets/scss/pages/dashboard/assignment.module.scss";
import ButtonGroup2 from "../../../components/buttons/button-group2";
import Prompt from "../../../components/modals/prompt";
import { useCBT } from "../../../hooks/useCBT";
import { useStudentCBT } from "../../../hooks/useStudentCBT";
import { useSubject } from "../../../hooks/useSubjects";
import Create from "./create";
import Performances from "./performances";
import Results from "./results";
import Submission from "./submission";
import View from "./student/view";
import StudentResults from "./student/studentResults";
import Performances2 from "./performances/students";
import { useAppContext } from "../../../hooks/useAppContext";
// import Performances2 from "./performances/students";

const CBTPage = () => {
  const {
    user,

    activeTab,
    setActiveTab,
    createQ,
    setCreateQ,
    objectiveQ,
    theoryQ,
    setObjectiveQ,
    setTheoryQ,
    obj,
    setObj,
    permission,
    objMark,
    setObjMark,
    answerQ,
    setAnswerQ,

    answeredObjQ,
    setAnsweredObjQ,
    answeredTheoQ,
    setAnsweredTheoQ,

    markedObjQ,
    setMarkedObjQ,
    markedTheoQ,
    setMarkedTheoQ,

    markedTheoQ2,
    setMarkedTheoQ2,

    markedQ,
    setMarkedQ,

    performanceQ,
    setPerformanceQ,

    answeredObjResults,
    setAnsweredObjResults,
    answeredTheoryResults,
    setAnsweredTheoryResults,

    submissionTab,
    setSubmissionTab,
    ResultTab,
    setResultTab,
  } = useCBT();

  const {
    objectiveQ2,
    setObjectiveQ2,
    theoryQ2,
    setTheoryQ2,
    createQ2,
    setCreateQ2,

    answeredObjectiveQ,
    setAnsweredObjectiveQ,

    answeredTheoryQ,
    setAnsweredTheoryQ,

    studentSubjectsLoading,
    refetchStudentSubjectsLoading,
    studentSubjects,

    assignmentTab,
    setAssignmentTab,

    objectiveSubmitted,
    setObjectiveSubmitted,

    theorySubmitted,
    setTheorySubmitted,
  } = useStudentCBT();

  const {
    isOpen: sideBarIsOpen,
    toggle: toggleSideBar,
    closeSidebar,
    openSidebar,
    close,
    hideAllBars,
    setHideAllBars,
  } = useAppContext();

  const { subjects } = useSubject();

  const [clearAllPrompt, setClearAllPrompt] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [showWarning, setShowWarning] = useState(true);
  const [testEnded, setTestEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [secondleft, setSecondLeft] = useState(null);
  const [hourLeft, setHourLeft] = useState(null);
  const [day, setDay] = useState(0);
  const [hour, setHour] = useState(1);
  const [minute, setMinute] = useState(45);

  const getToggleButtons = () => {
    let arr = [];

    if (permission?.view) {
      arr.push({
        title: "View",
        onClick: () => setActiveTab("5"),
        variant: `${activeTab === "5" ? "" : "outline"}`,
      });
    }

    if (permission?.create) {
      arr.push({
        title: "Create",
        onClick: () => setActiveTab("1"),
        variant: `${activeTab === "1" ? "" : "outline"}`,
      });
    }
    if (permission?.submissions) {
      arr.push({
        title: "Submissions",
        onClick: () => setActiveTab("3"),
        variant: `${activeTab === "3" ? "" : "outline"}`,
      });
    }
    if (permission?.results) {
      arr.push({
        title: "Results",
        onClick: () => setActiveTab("4"),
        variant: `${activeTab === "4" ? "" : "outline"}`,
      });
    }
    if (permission?.student_results) {
      arr.push({
        title: "Results",
        onClick: () => setActiveTab("6"),
        variant: `${activeTab === "6" ? "" : "outline"}`,
      });
    }
    if (permission?.performances) {
      arr.push({
        title: "Performance",
        onClick: () => setActiveTab("7"),
        variant: `${activeTab === "7" ? "" : "outline"}`,
      });
    }
    if (permission?.student_performances) {
      arr.push({
        title: "Performance",
        onClick: () => setActiveTab("8"),
        variant: `${activeTab === "8" ? "" : "outline"}`,
      });
    }

    return arr;
  };

  const clearAllButtons = [
    {
      title: "Ok",
      onClick: () => {
        setClearAllPrompt(false);
      },
      // variant: "outline",
    },
  ];

  useEffect(() => {
    if (permission?.view) {
      setActiveTab("5");
    } else if (permission?.create) {
      setActiveTab("1");
    }
  }, []);

  return (
    <PageSheet>
      <div className={styles.home}>
        {!hideAllBars && <ButtonGroup2 options={getToggleButtons()} />}

        {!hideAllBars && <hr className={styles.home_divider} />}

        {activeTab === "5" && permission?.view && (
          <View
            toggleNavbar={toggleSideBar}
            closeSidebar={closeSidebar}
            objectiveQ2={objectiveQ2}
            setObjectiveQ2={setObjectiveQ2}
            theoryQ2={theoryQ2}
            setTheoryQ2={setTheoryQ2}
            createQ2={createQ2}
            setCreateQ2={setCreateQ2}
            studentSubjects={studentSubjects}
            assignmentTab={assignmentTab}
            setAssignmentTab={setAssignmentTab}
            answeredObjectiveQ={answeredObjectiveQ}
            setAnsweredObjectiveQ={setAnsweredObjectiveQ}
            answeredTheoryQ={answeredTheoryQ}
            setAnsweredTheoryQ={setAnsweredTheoryQ}
            objectiveSubmitted={objectiveSubmitted}
            setObjectiveSubmitted={setObjectiveSubmitted}
            theorySubmitted={theorySubmitted}
            setTheorySubmitted={setTheorySubmitted}
            subjects={subjects}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            showWarning={showWarning}
            setShowWarning={setShowWarning}
            testEnded={testEnded}
            setTestEnded={setTestEnded}
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
            secondleft={secondleft}
            setSecondLeft={setSecondLeft}
            hourLeft={hourLeft}
            setHourLeft={setHourLeft}
            day={day}
            hour={hour}
            minute={minute}
            setDay={setDay}
            setHour={setHour}
            setMinute={setMinute}
          />
        )}

        {activeTab === "1" && permission?.create && (
          <Create
            createQ={createQ}
            setCreateQ={setCreateQ}
            objectiveQ={objectiveQ}
            theoryQ={theoryQ}
            setObjectiveQ={setObjectiveQ}
            setTheoryQ={setTheoryQ}
            obj={obj}
            setObj={setObj}
            objMark={objMark}
            setObjMark={setObjMark}
          />
        )}
        {activeTab === "3" && permission?.submissions && (
          <Submission
            answerQ={answerQ}
            setAnswerQ={setAnswerQ}
            answeredObjQ={answeredObjQ}
            setAnsweredObjQ={setAnsweredObjQ}
            answeredTheoQ={answeredTheoQ}
            setAnsweredTheoQ={setAnsweredTheoQ}
            markedObjQ={markedObjQ}
            setMarkedObjQ={setMarkedObjQ}
            markedTheoQ={markedTheoQ}
            setMarkedTheoQ={setMarkedTheoQ}
            markedTheoQ2={markedTheoQ2}
            setMarkedTheoQ2={setMarkedTheoQ2}
            submissionTab={submissionTab}
            setSubmissionTab={setSubmissionTab}
          />
        )}
        {activeTab === "4" && permission?.results && (
          <Results
            markedQ={markedQ}
            setMarkedQ={setMarkedQ}
            answeredObjResults={answeredObjResults}
            setAnsweredObjResults={setAnsweredObjResults}
            answeredTheoryResults={answeredTheoryResults}
            setAnsweredTheoryResults={setAnsweredTheoryResults}
            ResultTab={ResultTab}
            setResultTab={setResultTab}
          />
        )}
        {activeTab === "6" && permission?.student_results && (
          <StudentResults
            markedQ={markedQ}
            setMarkedQ={setMarkedQ}
            answeredObjResults={answeredObjResults}
            setAnsweredObjResults={setAnsweredObjResults}
            answeredTheoryResults={answeredTheoryResults}
            setAnsweredTheoryResults={setAnsweredTheoryResults}
            ResultTab={ResultTab}
            setResultTab={setResultTab}
          />
        )}
        {activeTab === "7" && permission?.performances && (
          <Performances markedQ={performanceQ} setMarkedQ={setPerformanceQ} />
        )}
        {activeTab === "8" && permission?.student_performances && (
          <Performances2
            markedQ={markedQ}
            setMarkedQ={setMarkedQ}
            studentSubjects={studentSubjects}
          />
        )}
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

export default CBTPage;
