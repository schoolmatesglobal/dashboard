import React, { useState } from "react";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import ButtonGroup from "../../../../components/buttons/button-group";
import styles from "../../../../assets/scss/pages/dashboard/studentAssignment.module.scss";
import { useStudentAssignments } from "../../../../hooks/useStudentAssignment";
import Prompt from "../../../../components/modals/prompt";

const Objective = ({ assignmentLoading }) => {
  const {
    // apiServices,
    // permission,
    user,
    // errorHandler,
    // studentSubjects,
    //

    answerQuestion,
    // updateAnswerQuestionFxn,
    // resetAnswerQuestionFxn,

    // OBJECTIVE
    setObjectiveQ,
    answeredObjectiveQ,
    answeredObjectiveQ2,
    objectiveSubmitted,
    //
    updateObjectiveSubmittedFxn,
    // updateSetObjectiveQFxn,
    //
    addObjectiveAnsFxn,
    // resetAddObjectiveAnsFxn,
    //
    // loadObjectiveAnsFxn,
    // resetLoadObjectiveAnsFxn,
    //
    submitObjectiveAssignment,
    // submitObjectiveAssignmentLoading,
    //
    // answeredObjAssignmentLoading,
    // refetchObjAnsweredAssignment,
    //
  } = useStudentAssignments();

  const {
    // question_type,
    // question,
    // subject,
    // image,
    // imageName,
    // ans1,
    // ans2,
    // ans3,
    // ans4,
    // term,
    // period,
    // session,
    subject_id,
    // week,
    // student_id,
  } = answerQuestion;

  const [loginPrompt, setLoginPrompt] = useState(false);
  // const [submitted, setSubmitted] = useState(false);

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
    if (answeredObjectiveQ.length !== setObjectiveQ.length) {
      return false;
    } else if (answeredObjectiveQ.length === setObjectiveQ.length) {
      return true;
    }
  };

  const checkedData = (question, CQ) => {
    const indexToCheck = answeredObjectiveQ.findIndex(
      (ob) => ob.question === question && ob.answer === CQ
    );
    // console.log({ indexToCheck });
    if (indexToCheck !== -1) {
      const check = answeredObjectiveQ[indexToCheck]?.answer === CQ;
      return check;
    } else {
      return null;
    }
  };

  const checkedData2 = (question, CQ) => {
    const quest = answeredObjectiveQ2.find(
      (ob) => ob.question === question && ob.answer === CQ
    );
    // console.log({ quest });
    if (quest) {
      const check = quest?.answer === CQ;
      return check;
    } else {
      return false;
    }
  };

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
        updateObjectiveSubmittedFxn(true);
        submitObjectiveAssignment();
        // setTimeout(() => {
        //   submitMarkedObjectiveAssignment();
        // }, 3000);
        // resetObjectiveAnsFxn();
        setLoginPrompt(false);
      },
      // isLoading:
      //   submitObjectiveAssignmentLoading ||
      //   submitMarkedObjectiveAssignmentLoading,
      //
      // variant: "outline",
    },
  ];

  const buttonOptions2 = [
    {
      title: "Submit Objective Assignment",
      onClick: () => displayPrompt(),
      disabled: objectiveSubmitted,
    },
  ];

  const lastAnsweredObj = answeredObjectiveQ2[answeredObjectiveQ2.length - 1];

  // console.log({ user });
  // console.log({  answeredObjectiveQ, answeredObjectiveQ2 });
  console.log({ setObjectiveQ });
  // console.log({ answeredObjectiveQ });
  // console.log({ checkedData2: checkedData2(), checkedData: checkedData() });

  return (
    <div>
      {!assignmentLoading && showNoAssignment() && (
        <div className={styles.placeholder_container}>
          <HiOutlineDocumentPlus className={styles.icon} />
          <p className={styles.heading}>No Objective Assignment</p>
        </div>
      )}

      {!assignmentLoading && setObjectiveQ.length >= 1 && (
        <div className={styles.objective}>
          {objectiveSubmitted && (
            <p className={styles.assignment_submitted_text}>Submitted</p>
          )}
          <div
            className={`${objectiveSubmitted && styles.assignment_submitted}`}
          >
            <p className={styles.view__questions_heading}>Objective Section</p>
            <div className={styles.view__questions}>
              {setObjectiveQ.map((CQ, index) => {
                // console.log({ CQ });
                return (
                  <div className={styles.view__questions_container} key={index}>
                    <p className={styles.view__questions_question}>
                      {CQ.question_number}. {CQ.question}
                    </p>
                    {CQ.image && (
                      <div className="mb-4 ">
                        <img src={CQ.image} width={70} height={70} alt="" />
                      </div>
                    )}
                    {CQ.option1 && (
                      <>
                        {/* option 1 */}
                        <div className={styles.view__questions_answer}>
                          <input
                            type="radio"
                            name={`radio-${index}`}
                            checked={
                              checkedData(CQ.question, CQ.option1) ||
                              checkedData2(CQ.question, CQ.option1)
                            }
                            style={{ width: "18px", height: "18px" }}
                            id={`answer-${index}-1`}
                            onChange={(e) => {
                              addObjectiveAnsFxn({
                                period: user?.period,
                                term: user?.term,
                                session: user?.session,
                                student_id: Number(user?.id),
                                subject_id: Number(subject_id),
                                question: CQ.question,
                                question_type: "objective",
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
                              // addMarkedObjectiveQFxn({
                              //   period: user?.period,
                              //   term: user?.term,
                              //   session: user?.session,
                              //   student_id: Number(user?.id),
                              //   subject_id: Number(subject_id),
                              //   question: CQ.question,
                              //   question_type: "objective",
                              //   question_id: Number(CQ.question_id),
                              //   question_number: Number(CQ.question_number),
                              //   answer: e.target.value,
                              //   correct_answer: CQ.answer,
                              //   submitted: "true",
                              //   teacher_mark: "1",
                              // });
                            }}
                            value={CQ.option1 || ""}
                            disabled={objectiveSubmitted}
                          />
                          {/* <p className="">{CQ.option1}</p> */}
                          <label htmlFor={`answer-${index}-1`}>
                            <p className={styles.answer_text}>{CQ.option1}</p>
                          </label>
                        </div>

                        {/* option 2 */}
                        <div className={styles.view__questions_answer}>
                          <input
                            type="radio"
                            name={`radio-${index}`}
                            checked={
                              checkedData(CQ.question, CQ.option2) ||
                              checkedData2(CQ.question, CQ.option2)
                            }
                            style={{ width: "18px", height: "18px" }}
                            id={`answer-${index}-2`}
                            onChange={(e) => {
                              addObjectiveAnsFxn({
                                period: user?.period,
                                term: user?.term,
                                session: user?.session,
                                student_id: Number(user?.id),
                                subject_id: Number(subject_id),
                                question: CQ.question,
                                question_type: "objective",
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
                              // addMarkedObjectiveQFxn({
                              //   period: user?.period,
                              //   term: user?.term,
                              //   session: user?.session,
                              //   student_id: Number(user?.id),
                              //   subject_id: Number(subject_id),
                              //   question: CQ.question,
                              //   question_type: "objective",
                              //   question_id: Number(CQ.question_id),
                              //   question_number: Number(CQ.question_number),
                              //   answer: e.target.value,
                              //   correct_answer: CQ.answer,
                              //   submitted: "true",
                              //   teacher_mark: "1",
                              // });
                            }}
                            value={CQ.option2 || ""}
                            disabled={objectiveSubmitted}
                          />
                          <label htmlFor={`answer-${index}-2`}>
                            <p className={styles.answer_text}>{CQ.option2}</p>
                          </label>
                        </div>
                        {/* option 3 */}
                        <div className={styles.view__questions_answer}>
                          <input
                            type="radio"
                            name={`radio-${index}`}
                            style={{ width: "18px", height: "18px" }}
                            checked={
                              checkedData(CQ.question, CQ.option3) ||
                              checkedData2(CQ.question, CQ.option3)
                            }
                            id={`answer-${index}-3`}
                            onChange={(e) => {
                              addObjectiveAnsFxn({
                                period: user?.period,
                                term: user?.term,
                                session: user?.session,
                                student_id: Number(user?.id),
                                subject_id: Number(subject_id),
                                question: CQ.question,
                                question_type: "objective",
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
                              // addMarkedObjectiveQFxn({
                              //   period: user?.period,
                              //   term: user?.term,
                              //   session: user?.session,
                              //   student_id: Number(user?.id),
                              //   subject_id: Number(subject_id),
                              //   question: CQ.question,
                              //   question_type: "objective",
                              //   question_id: Number(CQ.question_id),
                              //   question_number: Number(CQ.question_number),
                              //   answer: e.target.value,
                              //   correct_answer: CQ.answer,
                              //   submitted: "true",
                              //   teacher_mark: "1",
                              // });
                            }}
                            value={CQ.option3 || ""}
                            disabled={objectiveSubmitted}
                          />
                          <label htmlFor={`answer-${index}-3`}>
                            <p className={styles.answer_text}>{CQ.option3}</p>
                          </label>
                        </div>
                        {/* option 4 */}
                        <div className={styles.view__questions_answer}>
                          <input
                            type="radio"
                            name={`radio-${index}`}
                            style={{ width: "18px", height: "18px" }}
                            checked={
                              checkedData(CQ.question, CQ.option4) ||
                              checkedData2(CQ.question, CQ.option4)
                            }
                            id={`answer-${index}-4`}
                            onChange={(e) => {
                              addObjectiveAnsFxn({
                                period: user?.period,
                                term: user?.term,
                                session: user?.session,
                                student_id: Number(user?.id),
                                subject_id: Number(subject_id),
                                question: CQ.question,
                                question_type: "objective",
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
                              // addMarkedObjectiveQFxn({
                              //   period: user?.period,
                              //   term: user?.term,
                              //   session: user?.session,
                              //   student_id: Number(user?.id),
                              //   subject_id: Number(subject_id),
                              //   question: CQ.question,
                              //   question_type: "objective",
                              //   question_id: Number(CQ.question_id),
                              //   question_number: Number(CQ.question_number),
                              //   answer: e.target.value,
                              //   correct_answer: CQ.answer,
                              //   submitted: "true",
                              //   teacher_mark: "1",
                              // });
                            }}
                            value={CQ.option4 || ""}
                            disabled={objectiveSubmitted}
                          />
                          <label htmlFor={`answer-${index}-4`}>
                            <p className={styles.answer_text}>{CQ.option4}</p>
                          </label>
                        </div>
                      </>
                    )}
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

export default Objective;
