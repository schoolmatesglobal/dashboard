import React, { useState } from "react";
import {useAssignments}  from "../../../../hooks/useAssignments";
import AuthSelect from "../../../../components/inputs/auth-select";
import Button from "../../../../components/buttons/button";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import ButtonGroup from "../../../../components/buttons/button-group";
import { useQuery, useQueryClient } from "react-query";
import queryKeys from "../../../../utils/queryKeys";
import { Spinner } from "reactstrap";
import GoBack from "../../../../components/common/go-back";
import styles from "../../../../assets/scss/pages/dashboard/studentAssignment.module.scss";
import { useStudentAssignments } from "../../../../hooks/useStudentAssignment";
import Prompt from "../../../../components/modals/prompt";

const Objective = ({ assignmentLoading, data, refetchMarkedAssignment }) => {
  const {
    apiServices,
    permission,
    user,
    answerQuestion,
    setObjectiveQ,
    setTheoryQ,
    answeredObjectiveQ,
    answeredObjectiveQ2,
    answeredObjectiveQ3,
    answeredTheoryQ,
    studentSubjects,
    errorHandler,
    addTheoryAnsFxn,
    addObjectiveAnsFxn,
    addObjectiveAnsFxn2,
    addObjectiveAnsFxn3,
    updateAnswerQuestionFxn,
    updateSetObjectiveQFxn,
    updateSetTheoryQFxn,
    resetAnswerQuestionFxn,
    assignmentTab,
    updateAssignmentTabFxn,
    addAnsDetailsFxn,
    answeredQ,
    updateObjectiveSubmittedFxn,
    updateTheorySubmittedFxn,
    objectiveSubmitted,
    theorySubmitted,
    submitObjectiveAssignment,
    submitObjectiveAssignmentLoading,
    resetObjectiveAnsFxn,
  } = useStudentAssignments();

  const {
    loadMarkedObjectiveAnsFxn,
    resetMarkedObjectiveAnsFxn,
    addObjectiveMarkFxn,
    resetObjectiveMarkFxn,
    updateObjectiveMarkedFxn,
    submitMarkedObjectiveAssignment,
    submitMarkedObjectiveAssignmentLoading,
    markedObjectiveQ,
    markedObjectiveQ2,
  } = useAssignments();

  const {
    // question_type,
    // question,
    subject,
    // image,
    // imageName,
    ans1,
    ans2,
    ans3,
    ans4,
    term,
    period,
    session,
    subject_id,
    week,
    student_id,
  } = answerQuestion;

  const [loginPrompt, setLoginPrompt] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const displayPrompt = (status) => {
    setLoginPrompt(true);
  };

  const showNoAssignment = () => {
    if (setObjectiveQ.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  const checkEmptyQuestions = () => {
    if (markedObjectiveQ?.length !== setObjectiveQ?.length) {
      return false;
    } else if (markedObjectiveQ?.length === setObjectiveQ?.length) {
      return true;
    }
  };

  const checkedData = (question, CQ) => {
    const indexToCheck = markedObjectiveQ?.findIndex(
      (ob) => ob.question === question && ob.answer === CQ
    );
    // console.log({ indexToCheck });
    if (indexToCheck !== -1) {
      const check = markedObjectiveQ[indexToCheck].answer === CQ;
      return check;
    } else {
      return null;
    }
  };

  const checkedData2 = (question, CQ) => {
    const quest = markedObjectiveQ2?.find(
      (ob) => ob.question === question && ob.answer === CQ
    );
    // console.log({ quest });
    if (quest) {
      const check = quest.answer === CQ;
      return check;
    } else {
      return false;
    }
  };

  // const [loginPrompt, setLoginPrompt] = useState(false);

  // const displayPrompt = (status) => {
  //   setLoginPrompt(true);
  // };

  const buttonOptions = [
    {
      title: "Cancel",
      onClick: () => setLoginPrompt(false),
      variant: "outline",
    },
    {
      title: "Yes Submit",
      // disabled: !checkEmptyQuestions(),
      onClick: () => {
        // updateTheorySubmittedFxn(true);
        // updateObjectiveMarkedFxn(true);
        resetMarkedObjectiveAnsFxn();
        submitMarkedObjectiveAssignment();
        refetchMarkedAssignment();
        // resetTheoryAnsFxn();
        // resetObjectiveMarkFxn();

        setLoginPrompt(false);
      },
      // isLoading: submitTheoryAssignmentLoading,
      // isLoading: `${activeTab === "2" ? isLoading : isLoading}`,
      //
      // variant: "outline",
    },
  ];

  const buttonOptions2 = [
    {
      title: `${
        markedObjectiveQ2?.length >= 0
          ? "Submit Objective Remarking"
          : "Submit Objective Marking"
      }`,
      onClick: () => displayPrompt(),
      disabled: theorySubmitted,
    },
  ];

  // const checkedData2 = (index, CQ) => {
  //   const indexToCheck = answeredObjectiveQ.findIndex(
  //     (ob) => ob.question_id === index
  //   );
  //   console.log({ indexToCheck });
  //   if (indexToCheck !== -1) {
  //     const check = answeredObjectiveQ[indexToCheck].answer === CQ;
  //     return check;
  //   } else {
  //     return null;
  //   }
  // };

  // const defaultCheck = (indexToCheck) => {
  //   const check = answeredObjectiveQ[indexToCheck].answer === CQ;
  // }

  const student = `${user?.surname} ${user?.firstname}`;

  // console.log({ user });
  console.log({ markedObjectiveQ, markedObjectiveQ2 });
  // console.log({ answeredObjectiveQ });
  // console.log({ setObjectiveQ });

  return (
    <div>
      {/* {!assignmentLoading && showNoAssignment() && (
        <div className={styles.placeholder_container}>
          <HiOutlineDocumentPlus className={styles.icon} />
          <p className={styles.heading}>No Objective Assignment</p>
        </div>
      )} */}

      {!assignmentLoading && data.length >= 1 && (
        <div className={styles.objective}>
          {/* {objectiveSubmitted && (
            <p className={styles.assignment_submitted_text}>Submitted</p>
          )} */}
          <div
            className={`${objectiveSubmitted && styles.assignment_submitted}`}
          >
            <p className={styles.view__questions_heading}>Objective Section</p>
            <div className={styles.view__questions}>
              {data.map((CQ, index) => {
                // console.log({ CQS: CQ });
                return (
                  <div className={styles.view__questions_container} key={index}>
                    <p className={styles.view__questions_question}>
                      {index + 1}. {CQ.question} ({CQ.question_mark}mks)
                      {/* {CQ.question_number}. {CQ.question} */}
                    </p>
                    {CQ.image && (
                      <div className="mb-4 ">
                        <img src={CQ.image} width={70} height={70} alt="" />
                      </div>
                    )}
                    <>
                      {/* Correct Answer */}
                      <div className={styles.view__questions_answer}>
                        {/* <p className="">{CQ.option1}</p> */}
                        <label
                          className={styles.create_question_label}
                          // style={{ fontSize: "15px", fontWeight: 600 }}
                        >
                          Correct Answer:
                        </label>
                        <label>
                          <p className={styles.answer_text}>
                            {CQ.correct_answer}
                          </p>
                        </label>
                      </div>
                    </>
                    <>
                      {/* Student's Answer */}
                      <div className={styles.view__questions_answer}>
                        {/* <p className="">{CQ.option1}</p> */}
                        <label
                          className={styles.create_question_label}
                          // style={{ fontSize: "15px", fontWeight: 600 }}
                        >
                          Student's Answer:
                        </label>
                        <label>
                          <p className={styles.answer_text}>{CQ.answer}</p>
                        </label>
                      </div>
                    </>
                    <>
                      <div className={styles.view__questions_answer}>
                        <input
                          type="radio"
                          name={`radio-${index}`}
                          checked={
                            checkedData(CQ.question, CQ.answer) ||
                            checkedData2(CQ.question, CQ.answer)
                          }
                          style={{ width: "18px", height: "18px" }}
                          id={`answer-${index}-1`}
                          onChange={(e) => {
                            addObjectiveMarkFxn({
                              period: user?.period,
                              term: user?.term,
                              session: user?.session,
                              student_id: Number(CQ.student_id),
                              // student_id: CQ.student_id,
                              subject_id: Number(CQ.subject_id),
                              // subject_id: CQ.subject_id,
                              assignment_id: Number(CQ.assignment_id),
                              // question_id: CQ.question_id,
                              question: CQ.question,
                              // question_number: Number(CQ.question_number),
                              question_number: CQ.question_number,
                              question_type: CQ.question_type,
                              answer: CQ.answer,
                              correct_answer: CQ.correct_answer,
                              submitted: CQ.submitted,
                              // teacher_mark: Number(inputValue),
                              teacher_mark: e.target.value,
                              week: CQ.week,
                            });
                          }}
                          value={1}
                          disabled={objectiveSubmitted}
                        />
                        {/* <p className="">{CQ.option1}</p> */}
                        <label htmlFor={`answer-${index}-1`}>
                          <p className={styles.answer_text}>Submit mark</p>
                        </label>
                      </div>
                    </>
                  </div>
                );
              })}
            </div>
            <div className="d-flex justify-content-center ">
              <ButtonGroup options={buttonOptions2} />
            </div>
            <Prompt
              isOpen={loginPrompt}
              toggle={() => setLoginPrompt(!loginPrompt)}
              hasGroupedButtons={true}
              groupedButtonProps={buttonOptions}
              // singleButtonText="Preview"
              promptHeader={`${
                checkEmptyQuestions()
                  ? "CONFIRM ASSIGNMENT MARKING"
                  : "INCOMPLETE MARKING"
              }`}
            >
              {checkEmptyQuestions() ? (
                <p className={styles.warning_text}>
                  Are you sure you want to submit.
                </p>
              ) : (
                <p className={styles.warning_text}>
                  Please go through the markings again.
                </p>
              )}
            </Prompt>
          </div>
        </div>
      )}
    </div>
  );
};

export default Objective;
