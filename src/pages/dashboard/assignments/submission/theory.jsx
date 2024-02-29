import React, { useState } from "react";
import {useAssignments} from "../../../../hooks/useAssignments";
import ButtonGroup from "../../../../components/buttons/button-group";
import styles from "../../../../assets/scss/pages/dashboard/studentAssignment.module.scss";
import { useStudentAssignments } from "../../../../hooks/useStudentAssignment";
import Prompt from "../../../../components/modals/prompt";
import AuthInput from "../../../../components/inputs/auth-input";

const Theory = ({ assignmentLoading, data, refetchMarkedAssignment }) => {
  const {
    // apiServices,
    // permission,
    // user,
    answerQuestion,
    // setObjectiveQ,
    // setTheoryQ,
    // answeredObjectiveQ,
    // answeredTheoryQ,
    // answeredTheoryQ2,
    // answeredTheoryQ3,
    // studentSubjects,
    // errorHandler,
    // addTheoryAnsFxn,
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
    // updateTheorySubmittedFxn,
    // objectiveSubmitted,
    theorySubmitted,
    // submitTheoryAssignment,
    // submitTheoryAssignmentLoading,
  } = useStudentAssignments();

  // const [value, setValue] = useState("");

  const {
    // apiServices,
    // permission,
    user,
    addTheoryMarkFxn,
    // resetTheoryMarkFxn,
    markedTheoryQ,
    submitMarkedTheoryAssignment,
    // submitMarkedTheoryAssignmentLoading,
    // updateTheoryMarkedFxn,
    // loadMarkedTheoryAnsFxn,
    // theoryMarked,
    markedTheoryQ2,
    resetMarkedTheoryAnsFxn,
  } = useAssignments();

  const {
    // question_type,
    // question,
    // subject,
    // image,
    // imageName,
    // term,
    // period,
    // session,
    // subject_id,
    // week,
    // student_id,
  } = answerQuestion;

  // const showNoAssignment = () => {
  //   if (data?.length === 0) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  // const [theoryDefaultValue, settheoryDefaultValue] = useState([]);

  const checkEmptyQuestions = () => {
    if (
      markedTheoryQ?.length !== data?.length ||
      markedTheoryQ2?.length !== data?.length
    ) {
      return false;
    } else if (
      markedTheoryQ?.length === data?.length ||
      markedTheoryQ2?.length === data?.length
    ) {
      return true;
    }
  };

  const checkedData = (question, CQ) => {
    const indexToCheck = markedTheoryQ.findIndex(
      (ob) => ob.question === question && ob.answer === CQ
    );
    if (indexToCheck !== -1) {
      return markedTheoryQ[indexToCheck].teacher_mark;
    } else {
      return "";
    }
  };

  const checkedData2 = (question, CQ) => {
    const quest = markedTheoryQ2.find(
      (ob) => ob.question === question && ob.answer === CQ
    );
    if (quest) {
      return quest?.teacher_mark;
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
      // disabled: !checkEmptyQuestions(),
      onClick: () => {
        // updateTheorySubmittedFxn(true);
        // updateTheoryMarkedFxn(true);
        resetMarkedTheoryAnsFxn();
        submitMarkedTheoryAssignment();
        refetchMarkedAssignment();
        // resetTheoryAnsFxn();
        // resetTheoryMarkFxn();

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
        markedTheoryQ2?.length >= 0
          ? "Submit Theory Remarking"
          : "Submit Theory Marking"
      }`,
      onClick: () => displayPrompt(),
      disabled: theorySubmitted,
    },
  ];

  // console.log({ answeredTheoryQ, data });
  console.log({ markedTheoryQ, markedTheoryQ2 });
  // console.log({ setTheoryQ });

  return (
    <div className="">
      {/* {!assignmentLoading && showNoAssignment() && (
        <div className={styles.placeholder_container}>
          <HiOutlineDocumentPlus className={styles.icon} />
          <p className={styles.heading}>No Theory Assignment</p>
        </div>
      )} */}
      {!assignmentLoading && data?.length >= 1 && (
        <div className={styles.objective}>
          {/* {theorySubmitted && (
            <p className={styles.assignment_submitted_text}>Submitted</p>
          )} */}
          <div className={`${theorySubmitted && styles.assignment_submitted}`}>
            <p className={styles.view__questions_heading}>Theory Section</p>
            <div className={styles.view__questions}>
              {data.map((CQ, index) => {
                // console.log({ CQT: CQ });

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
                      {CQ.question_number}. {CQ.question}{" "}
                      {/* {markedTheoryQ2?.length >= 0 ? "(MARKED)" : ""} */}
                    </p>
                    {CQ.image && (
                      <div className="mb-4 ">
                        <img src={CQ.image} width={70} height={70} alt="" />
                      </div>
                    )}
                    <>
                      {/* Correct Answer */}
                      <div className="d-flex flex-column gap-4 mb-4">
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
                      <div className="d-flex flex-column gap-4 mb-4">
                        {/* <p className="">{CQ.option1}</p> */}
                        <p
                          className={styles.create_question_label}
                          // style={{ fontSize: "15px", fontWeight: 600 }}
                        >
                          Student's Answer:
                        </p>
                        <label>
                          <p className={styles.answer_text}>{CQ.answer}</p>
                        </label>
                      </div>
                    </>
                    <>
                      {/* Question Score */}
                      <div className="d-flex align-items-center gap-5 mt-4">
                        {/* Total Questions */}
                        <div style={{ width: "200px" }}>
                          <label
                            className="mb-4"
                            // style={{ fontSize: "15px", fontWeight: 600 }}
                          >
                            Teacher's Mark
                          </label>
                          <AuthInput
                            type="number"
                            placeholder="Teacher's Mark"
                            // hasError={!!errors.username}
                            value={
                              checkedData(CQ.question, CQ.answer) ||
                              checkedData2(CQ.question, CQ.answer)
                            }
                            // name="option"
                            max={Number(CQ?.question_mark)}
                            min={0}
                            onChange={(e) => {
                              const inputValue = e.target.value;

                              // You can add additional validation if needed
                              if (inputValue <= Number(CQ?.question_mark)) {
                                // setValue(inputValue);
                                addTheoryMarkFxn({
                                  period: user?.period,
                                  term: user?.term,
                                  session: user?.session,
                                  // student_id: Number(CQ.student_id),
                                  student_id: CQ.student_id,
                                  // subject_id: Number(CQ.subject_id),
                                  subject_id: CQ.subject_id,
                                  // question_id: Number(CQ.id),
                                  assignment_id: CQ.assignment_id,
                                  question: CQ.question,
                                  // question_number: Number(CQ.question_number),
                                  question_number: CQ.question_number,
                                  question_type: CQ.question_type,
                                  answer: CQ.answer,
                                  correct_answer: CQ.correct_answer,
                                  submitted: CQ.submitted,
                                  // teacher_mark: Number(inputValue),
                                  teacher_mark: inputValue,
                                  week: CQ.week,
                                });
                              }
                            }}
                            wrapperClassName=""
                          />
                        </div>
                        <div style={{ width: "200px" }}>
                          <label
                            className="mb-4"
                            // style={{ fontSize: "15px", fontWeight: 600 }}
                          >
                            Question's Mark
                          </label>
                          <AuthInput
                            type="number"
                            placeholder="Question's Mark"
                            // defaultValue={!!errors.username}
                            disabled
                            value={Number(CQ.question_mark)}
                            name="option"
                            onChange={(e) => {
                              // updateCreateQ({
                              //   total_question: e.target.value,
                              //   // total_mark: e.target.value * question_mark,
                              // });
                              // calcObjTotal();
                            }}
                            wrapperClassName=""
                          />
                        </div>
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

export default Theory;
