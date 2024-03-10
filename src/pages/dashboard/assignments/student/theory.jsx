import React, { useState } from "react";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import ButtonGroup from "../../../../components/buttons/button-group";
import styles from "../../../../assets/scss/pages/dashboard/studentAssignment.module.scss";
import { useStudentAssignments } from "../../../../hooks/useStudentAssignment";
import Prompt from "../../../../components/modals/prompt";

const Theory = ({ assignmentLoading, theoryQ }) => {
  const {
    // apiServices,
    // permission,
    user,
    answerQuestion,
    // setObjectiveQ,

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
    if (theoryQ.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  // const [theoryDefaultValue, settheoryDefaultValue] = useState([]);

  const checkEmptyQuestions = () => {
    if (answeredTheoryQ.length !== theoryQ.length) {
      return false;
    } else if (answeredTheoryQ.length === theoryQ.length) {
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

  const totalTheoryScore = theoryQ.reduce(
    (acc, quest) => acc + Number(quest?.question_mark),
    0
  );

  const buttonOptions2 = [
    {
      title: "Submit Theory Assignment",
      onClick: () => displayPrompt(),
      disabled: theorySubmitted,
    },
  ];

  // console.log({ answeredTheoryQ });
  console.log({ theoryQ, answeredTheoryQ, answeredTheoryQ2 });
  // console.log({ theoryQ });

  return (
    <div className=''>
      {!assignmentLoading && showNoAssignment() && (
        <div className={styles.placeholder_container}>
          <HiOutlineDocumentPlus className={styles.icon} />
          <p className={styles.heading}>No Theory Assignment</p>
        </div>
      )}
      {!assignmentLoading && theoryQ.length >= 1 && (
        <div className={styles.objective}>
          {theorySubmitted && (
            <p className={styles.assignment_submitted_text}>Submitted</p>
          )}
          <div className={`${theorySubmitted && styles.assignment_submitted}`}>
            <div className='d-flex flex-column gap-4 flex-md-row justify-content-between align-items-center'>
              <p className='fs-3 fw-bold'>Theory Section</p>

              <div className='d-flex justify-content-center align-items-center gap-3 bg-info bg-opacity-10 py-4 px-4'>
                <p className='fs-3 fw-bold'>Total Score(s):</p>
                <p className='fs-3 fw-bold'>{totalTheoryScore}</p>
              </div>
            </div>
            <div className='d-flex flex-column my-5 gap-4'>
              {theoryQ
                ?.sort((a, b) => {
                  if (a.question_number < b.question_number) {
                    return -1;
                  }
                  if (a.question_number > b.question_number) {
                    return 1;
                  }
                  return 0;
                })
                ?.map((CQ, index) => {
                  // console.log({ CQ });
                  return (
                    <div
                      className={styles.view__questions_container}
                      key={index}
                      // style={{ width: "300px" }}
                    >
                      <p className='fs-3 mb-4 lh-base'>
                        <span className='fs-3 fw-bold'>
                          Q{CQ.question_number}.{/* Q{index + 1}. */}
                        </span>{" "}
                        {CQ.question}
                      </p>

                      <p className='fw-bold fs-3 mb-4 lh-base'>
                        ({CQ.question_mark} mk(s) )
                      </p>
                      {/* {CQ.image && (
                        <div className='mb-4 '>
                          <img src={CQ.image} width={70} height={70} alt='' />
                        </div>
                      )} */}
                      {
                        <>
                          <div className='auth-textarea-wrapper'>
                            <textarea
                              className='form-control'
                              style={{
                                minHeight: "150px",
                                fontSize: "16px",
                                lineHeight: "22px",
                              }}
                              type='text'
                              value={
                                checkedData(CQ.question, CQ.answer) ||
                                checkedData2(CQ.question, CQ.answer)
                              }
                              placeholder='Type the answer'
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
