import React, { useState } from "react";
import PageSheet from "../../../components/common/page-sheet";
import Create from "./create";
import Submission from "./submission";
import Results from "./results";
import ButtonGroup from "../../../components/buttons/button-group";
import { useAssignments } from "../../../hooks/useAssignments";
import styles from "../../../assets/scss/pages/dashboard/assignment.module.scss";
import View from "./student/view";
import { useEffect } from "react";
import StudentResults from "./student/studentResults";
import { useStudentAssignments } from "../../../hooks/useStudentAssignment";
import Prompt from "../../../components/modals/prompt";
import { useSubject } from "../../../hooks/useSubjects";
import Performances from "./performances";

const Assignments = () => {
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

    answeredObjResults,
    setAnsweredObjResults,
    answeredTheoryResults,
    setAnsweredTheoryResults,
  } = useAssignments();

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
  } = useStudentAssignments();

  const { subjects } = useSubject();

  const [clearAllPrompt, setClearAllPrompt] = useState(false);

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

  // console.log({ permission, user });

  return (
    <PageSheet>
      <div className={styles.home}>
        <ButtonGroup options={getToggleButtons()} />

        <hr className={styles.home_divider} />

        {activeTab === "5" && permission?.view && (
          <View
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
        {/* {activeTab === "2" && permission?.created && <Created />} */}
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
          />
        )}
        {activeTab === "7" && permission?.performances && (
          <Performances
            markedQ={markedQ}
            setMarkedQ={setMarkedQ}
            answeredObjResults={answeredObjResults}
            setAnsweredObjResults={setAnsweredObjResults}
            answeredTheoryResults={answeredTheoryResults}
            setAnsweredTheoryResults={setAnsweredTheoryResults}
          />
        )}
        {activeTab === "8" && permission?.student_performances && (
          <StudentResults
            markedQ={markedQ}
            setMarkedQ={setMarkedQ}
            answeredObjResults={answeredObjResults}
            setAnsweredObjResults={setAnsweredObjResults}
            answeredTheoryResults={answeredTheoryResults}
            setAnsweredTheoryResults={setAnsweredTheoryResults}
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

export default Assignments;
