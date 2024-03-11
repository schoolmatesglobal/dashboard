import React, { useState } from "react";
import { useAssignments } from "../../../../hooks/useAssignments";
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
    if (setObjectiveQ?.length === 0) {
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
            className=''
          >
            <p className='fw-bold fs-2 mt-5'>Objective Section</p>
            <div className='d-flex flex-column my-5 gap-3'>
              {data
                ?.sort((a, b) => {
                  if (a.question_number < b.question_number) {
                    return -1;
                  }
                  if (a.question_number > b.question_number) {
                    return 1;
                  }
                  return 0;
                })
                .map((CQ, index) => {
                  // console.log({ CQS: CQ });
                  return (
                    <div
                      className='w-100 border border-2 rounded-1 border-opacity-25 p-5'
                      key={index}
                    >
                      <p className='fs-3 mb-3 lh-base'>
                        <span className='fw-bold fs-3'>
                          {CQ.question_number}.
                        </span>{" "}
                        {CQ.question}{" "}
                      </p>
                      <p className='fw-bold fs-3 mb-4 lh-base'>
                        ({CQ.question_mark} mk(s) )
                      </p>
                      {CQ.image && (
                        <div className='mb-4 '>
                          <img src={CQ.image} width={70} height={70} alt='' />
                        </div>
                      )}
                      <>
                        {/* Correct Answer */}
                        <p className='fs-3 mb-3 lh-base'>
                          <span className='fw-bold fs-3'>Correct Answer:</span>{" "}
                          {CQ.correct_answer}{" "}
                        </p>
                      </>
                      <>
                        {/* Student's Answer */}
                        <p className={`fs-3 lh-base ${CQ.correct_answer === CQ.answer ? "text-success": "text-danger"}`}>
                          <span className='fw-bold fs-3'>
                            Student's Answer:
                          </span>{" "}
                          {CQ.answer}{" "}
                        </p>
                      </>
                    </div>
                  );
                })}
            </div>
            {/* <div className='d-flex justify-content-center '>
              <ButtonGroup options={buttonOptions2} />
            </div> */}
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
