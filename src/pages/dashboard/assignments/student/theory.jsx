import React, { useState } from "react";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import ButtonGroup from "../../../../components/buttons/button-group";
import styles from "../../../../assets/scss/pages/dashboard/studentAssignment.module.scss";
import { useStudentAssignments } from "../../../../hooks/useStudentAssignment";
import Prompt from "../../../../components/modals/prompt";

const Theory = ({ assignmentLoading }) => {
  const {
    // apiServices,
    // permission,
    user,
    answerQuestion,
    // setObjectiveQ,
    setTheoryQ,
    // answeredObjectiveQ,
    answeredTheoryQ,
    answeredTheoryQ2,
    // answeredTheoryQ3,
    // studentSubjects,
    // errorHandler,
    addTheoryAnsFxn,
    // addTheoryAnsFxn2,
    // addTheoryAnsFxn3,
    // addObjectiveAnsFxn,
    // updateAnswerQuestionFxn,
    // updateSetObjectiveQFxn,
    // updateSetTheoryQFxn,
    // resetAnswerQuestionFxn,
    // assignmentTab,
    // updateAssignmentTabFxn,
    // updateObjectiveSubmittedFxn,
    updateTheorySubmittedFxn,
    // objectiveSubmitted,
    theorySubmitted,
    submitTheoryAssignment,
    submitTheoryAssignmentLoading,
    // resetTheoryAnsFxn,
  } = useStudentAssignments();

  const {
    // question_type,
    // question,
    // subject,
    // image,
    // imageName,
    // term,
    // period,
    // session,
    subject_id,
    // week,
    // student_id,
  } = answerQuestion;

  const showNoAssignment = () => {
    if (setTheoryQ.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  // const [theoryDefaultValue, settheoryDefaultValue] = useState([]);

  const checkEmptyQuestions = () => {
    if (answeredTheoryQ.length !== setTheoryQ.length) {
      return false;
    } else if (answeredTheoryQ.length === setTheoryQ.length) {
      return true;
    }
  };

  const checkedData = (question, CQ) => {
    const indexToCheck = answeredTheoryQ.findIndex(
      (ob) => ob.question === question
    );
    if (indexToCheck !== -1) {
      return answeredTheoryQ[indexToCheck]?.answer;
    } else {
      return "";
    }
  };

  const checkedData2 = (question, CQ) => {
    const indexToCheck = answeredTheoryQ2.findIndex(
      (ob) => ob.question === question
    );
    if (indexToCheck !== -1) {
      return answeredTheoryQ2[indexToCheck]?.answer;
    } else {
      return "";
    }
  };

  const [loginPrompt, setLoginPrompt] = useState(false);

  const displayPrompt = (status) => {
    setLoginPrompt(true);
  };

  const buttonOptions = [
    {
      title: "Cancel",
      onClick: () => setLoginPrompt(false),
      variant: "outline",
    },
    {
      title: "Yes Submit",
      disabled: !checkEmptyQuestions(),
      onClick: () => {
        updateTheorySubmittedFxn(true);
        submitTheoryAssignment();
        // resetTheoryAnsFxn();
        setLoginPrompt(false);
      },
      isLoading: submitTheoryAssignmentLoading,
      // isLoading: `${activeTab === "2" ? isLoading : isLoading}`,
      //
      // variant: "outline",
    },
  ];

  const buttonOptions2 = [
    {
      title: "Submit Theory Assignment",
      onClick: () => displayPrompt(),
      disabled: theorySubmitted,
    },
  ];

  // console.log({ answeredTheoryQ });
  console.log({ setTheoryQ, answeredTheoryQ, answeredTheoryQ2 });
  // console.log({ setTheoryQ });

  return (
    <div className="">
      {!assignmentLoading && showNoAssignment() && (
        <div className={styles.placeholder_container}>
          <HiOutlineDocumentPlus className={styles.icon} />
          <p className={styles.heading}>No Theory Assignment</p>
        </div>
      )}
      {!assignmentLoading && setTheoryQ.length >= 1 && (
        <div className={styles.objective}>
          {theorySubmitted && (
            <p className={styles.assignment_submitted_text}>Submitted</p>
          )}
          <div className={`${theorySubmitted && styles.assignment_submitted}`}>
            <p className={styles.view__questions_heading}>Theory Section</p>
            <div className={styles.view__questions}>
              {setTheoryQ.map((CQ, index) => {
                console.log({ CQ });
                return (
                  <div
                    className={styles.view__questions_container}
                    key={index}
                    // style={{ width: "300px" }}
                  >
                    <p
                      className={styles.view__questions_question}
                      // style={{ fontSize: "15px", lineHeight: "20px" }}
                    >
                      {index + 1}. {CQ.question}
                    </p>
                    {CQ.image && (
                      <div className="mb-4 ">
                        <img src={CQ.image} width={70} height={70} alt="" />
                      </div>
                    )}
                    {
                      <>
                        <div className="auth-textarea-wrapper">
                          <textarea
                            className="form-control"
                            type="text"
                            value={
                              checkedData(CQ.question, CQ.answer) ||
                              checkedData2(CQ.question, CQ.answer)
                            }
                            placeholder="Type the answer"
                            disabled={theorySubmitted}
                            onChange={(e) => {
                              // checkedData(index, e.target.value);
                              addTheoryAnsFxn({
                                period: user?.period,
                                term: user?.term,
                                session: user?.session,
                                student_id: Number(user?.id),
                                subject_id: Number(subject_id),
                                question: CQ.question,
                                question_type: "theory",
                                answer: e.target.value,
                                correct_answer: CQ.answer,
                                assignment_id: Number(CQ.id),
                                // question_mark: Number(CQ.question_mark),
                                // total_mark: Number(CQ.total_mark),
                                // total_question: Number(CQ.total_question),
                                submitted: "true",
                                question_number: Number(CQ.question_number),
                                week: CQ.week,
                              });
                            }}
                          />
                        </div>
                        <p className={styles.view__questions_answer}>
                          {/* Ans - {CQ.answer} */}
                        </p>
                      </>
                    }
                  </div>
                );
              })}
            </div>
            <div className={styles.footer}>
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
                  ? "CONFIRM ASSIGNMENT SUBMISSION"
                  : "INCOMPLETE SUBMISSION"
              }`}
            >
              {checkEmptyQuestions() ? (
                <p className={styles.warning_text}>
                  Are you sure you want to submit this assignment.
                </p>
              ) : (
                <p className={styles.warning_text}>
                  Please go through the questions again and ensure you answer
                  all.
                </p>
              )}
            </Prompt>
          </div>
        </div>
      )}
    </div>
  );
};

export default Theory;
