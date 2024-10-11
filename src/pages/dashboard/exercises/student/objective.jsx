import React, { useState } from "react";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import ButtonGroup from "../../../../components/buttons/button-group";
import styles from "../../../../assets/scss/pages/dashboard/studentAssignment.module.scss";
import { useStudentAssignments } from "../../../../hooks/useStudentAssignment";
import Prompt from "../../../../components/modals/prompt";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useSubject } from "../../../../hooks/useSubjects";
import queryKeys from "../../../../utils/queryKeys";
import { useMediaQuery } from "react-responsive";

const Objective = ({
  assignmentLoading,
  objectiveQ,
  answeredObjectiveQ,
  setAnsweredObjectiveQ,
  objectiveSubmitted,
  setObjectiveSubmitted,
  createQ2,
  setCreateQ2,
  subjects,
}) => {
  const { apiServices, permission, user, errorHandler, answerQuestion } =
    useStudentAssignments();

  const isDesktop = useMediaQuery({ query: "(min-width: 992px)" });
  const isTablet = useMediaQuery({
    query: "(min-width: 768px, max-width: 991px)",
  });
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const student = `${user?.surname} ${user?.firstname}`;

  //// SUBMIT OBJECTIVE ASSIGNMENT ////
  const {
    mutateAsync: submitObjectiveAssignment,
    isLoading: submitObjectiveAssignmentLoading,
  } = useMutation(
    () => apiServices.submitObjectiveAssignment(answeredObjectiveQ),
    {
      onSuccess() {
        toast.success("Objective assignment has been submitted successfully");
      },
      onError(err) {
        apiServices.errorHandler(err);
      },
    }
  );

  /////// FETCH ANSWERED OBJECTIVE ASSIGNMENTS/////
  const {
    isLoading: answeredObjAssignmentLoading,
    refetch: refetchObjAnsweredAssignment,
    data: objAnsweredAssignment,
    isFetching: isFetchingObjAnsweredAssignment,
    isRefetching: isRefetchingObjAnsweredAssignment,
  } = useQuery(
    [
      queryKeys.GET_SUBMITTED_ASSIGNMENT_STUDENT,
      user?.period,
      user?.term,
      user?.session,
      "objective",
      createQ2?.week,
    ],
    () =>
      apiServices.getSubmittedAssignment(
        user?.period,
        user?.term,
        user?.session,
        "objective",
        createQ2?.week
      ),
    {
      retry: 3,
      enabled: permission?.view && permission?.student_results,
      // enabled: false,
      select: (data) => {
        const ssk = apiServices.formatData(data);

        const sorted = ssk?.filter(
          (dt) =>
            dt?.subject === createQ2?.subject &&
            dt?.student === student &&
            dt?.week === createQ2?.week
        );

        console.log({ ssk, sorted, data, student, createQ2 });

        if (sorted?.length > 0) {
          // resetLoadObjectiveAnsFxn();
          setObjectiveSubmitted(true);
          // loadObjectiveAnsFxn(sorted);
        } else if (sorted?.length === 0) {
          // resetLoadObjectiveAnsFxn();
          // setObjectiveSubmitted(false);
        }
        return sorted;
      },
      // onSuccess(data) {},
      onError(err) {
        errorHandler(err);
      },
      // select: apiServices.formatData,
    }
  );

  const [loginPrompt, setLoginPrompt] = useState(false);
  // const [submitted, setSubmitted] = useState(false);

  const displayPrompt = (status) => {
    setLoginPrompt(true);
  };

  const showNoAssignment = () => {
    if (objectiveQ?.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  const checkEmptyQuestions = () => {
    if (answeredObjectiveQ?.length !== objectiveQ?.length) {
      return false;
    } else if (answeredObjectiveQ?.length === objectiveQ?.length) {
      return true;
    }
  };

  const checkedData = (question, CQ) => {
    const indexToCheck = answeredObjectiveQ?.findIndex(
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
    const quest = objAnsweredAssignment?.find(
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

  const findSubjectId = () => {
    const findObject = subjects?.find(
      (opt) => opt.subject === createQ2?.subject
    );
    if (findObject) {
      return findObject.id;
    }
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
        setObjectiveSubmitted(true);
        submitObjectiveAssignment();
        // setTimeout(() => {
        //   submitMarkedObjectiveAssignment();
        // }, 3000);
        // resetObjectiveAnsFxn();
        setLoginPrompt(false);
      },
      isLoading: submitObjectiveAssignmentLoading,
      // || submitMarkedObjectiveAssignmentLoading,
      //
      // variant: "outline",
    },
  ];

  const buttonOptions2 = [
    {
      title: "Submit Objective",
      onClick: () => displayPrompt(),
      disabled: objectiveSubmitted,
    },
  ];

  const objScore = objectiveQ?.reduce(
    (acc, quest) => acc + Number(quest?.question_mark),
    0
  );

  const handleChange = (optionValue, CQ) => {
    const indexToUpdate = answeredObjectiveQ?.findIndex(
      (item) => item.question === CQ.question
    );

    const filteredArray = answeredObjectiveQ?.filter(
      (ans) => ans.question !== CQ.question
    );

    if (indexToUpdate !== -1) {
      setAnsweredObjectiveQ([
        ...filteredArray,
        {
          period: user?.period,
          term: user?.term,
          session: user?.session,
          student_id: Number(user?.id),
          subject_id: Number(findSubjectId()),
          question: CQ.question,
          question_type: "objective",
          answer: optionValue,
          correct_answer: CQ.answer,
          assignment_id: Number(CQ.id),
          submitted: "true",
          question_number: Number(CQ.question_number),
          week: CQ.week,
        },
      ]);
    } else {
      setAnsweredObjectiveQ([
        ...answeredObjectiveQ,
        {
          period: user?.period,
          term: user?.term,
          session: user?.session,
          student_id: Number(user?.id),
          subject_id: Number(findSubjectId()),
          question: CQ.question,
          question_type: "objective",
          answer: optionValue,
          correct_answer: CQ.answer,
          assignment_id: Number(CQ.id),
          submitted: "true",
          question_number: Number(CQ.question_number),
          week: CQ.week,
        },
      ]);
    }
  };

  console.log({
    objectiveQ,
    answeredObjectiveQ,
    answerQuestion,
    createQ2,
    subjects,
    findSubjectId: findSubjectId(),
    objAnsweredAssignment,
  });

  const allLoading = assignmentLoading || answeredObjAssignmentLoading;

  // console.log({ answeredObjectiveQ });
  // console.log({ checkedData2: checkedData2(), checkedData: checkedData() });

  return (
    <div>
      {!allLoading && objectiveQ?.length >= 1 && (
        <div className='position-relative'>
          {objectiveSubmitted && (
            <p
              className='text-danger fw-bold position-absolute top-50 opacity-50'
              style={{
                rotate: "-45deg",
                // left: "40%",
                left: `${
                  isDesktop
                    ? "40%"
                    : isTablet
                    ? "35%"
                    : isMobile
                    ? "25%"
                    : "35%"
                }`,
                zIndex: "5000",
                fontSize: `${
                  isDesktop
                    ? "40px"
                    : isTablet
                    ? "35px"
                    : isMobile
                    ? "30px"
                    : "30px"
                }`,
              }}
            >
              Submitted
            </p>
            // <p className={styles.assignment_submitted_text}>Submitted</p>
          )}
          <div className={`${objectiveSubmitted && "opacity-50"}`}>
            {/* <p className='fs-3 fw-bold'>Objective Section</p> */}
            <div className='d-flex flex-column gap-4 flex-md-row justify-content-between align-items-center'>
              <p className='fs-3 fw-bold'>Objective Section</p>

              <div className='d-flex justify-content-center align-items-center gap-3 bg-info bg-opacity-10 py-4 px-4'>
                <p className='fs-3 fw-bold'>Total Score(s):</p>
                <p className='fs-3 fw-bold'>{objScore}</p>
              </div>
            </div>
            <div className='d-flex flex-column my-5 gap-4'>
              {objectiveQ
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
                  // console.log({ CQ });
                  return (
                    <div
                      className='w-100 border border-2 rounded-1 border-opacity-25 py-sm-5 px-sm-5 py-4 px-4'
                      key={index}
                    >
                      <p className='fs-3 mb-3 lh-base'>
                        <span className='fw-bold fs-3'>
                          {index + 1}.{/* {CQ.question_number}. */}
                        </span>{" "}
                        {CQ.question}{" "}
                      </p>
                      <p className='fw-bold fs-3 mb-4 lh-base'>
                        ({CQ.question_mark} mk(s) )
                      </p>
                      {/* {CQ.image && (
                      <div className="mb-4 ">
                        <img src={CQ.image} width={70} height={70} alt="" />
                      </div>
                    )} */}
                      {CQ.option1 && (
                        <>
                          {/* option 1 */}
                          <div className='d-flex align-items-center gap-3 mb-3'>
                            <input
                              type='radio'
                              name={`radio-${index}`}
                              checked={
                                checkedData(CQ.question, CQ.option1) ||
                                checkedData2(CQ.question, CQ.option1)
                              }
                              style={{ width: "20px", height: "20px" }}
                              id={`answer-${index}-1`}
                              onChange={(e) => {
                                handleChange(e.target.value, CQ);
                              }}
                              value={CQ.option1 || ""}
                              disabled={objectiveSubmitted}
                            />
                            {/* <p className="">{CQ.option1}</p> */}
                            <label htmlFor={`answer-${index}-1`}>
                              <p className='fs-3'>{CQ.option1}</p>
                            </label>
                          </div>

                          {/* option 2 */}
                          <div className='d-flex align-items-center gap-3 mb-3'>
                            <input
                              type='radio'
                              name={`radio-${index}`}
                              checked={
                                checkedData(CQ.question, CQ.option2) ||
                                checkedData2(CQ.question, CQ.option2)
                              }
                              style={{ width: "20px", height: "20px" }}
                              id={`answer-${index}-2`}
                              onChange={(e) => {
                                handleChange(e.target.value, CQ);
                              }}
                              value={CQ.option2 || ""}
                              disabled={objectiveSubmitted}
                            />
                            <label htmlFor={`answer-${index}-2`}>
                              <p className='fs-3'>{CQ.option2}</p>
                            </label>
                          </div>
                          {/* option 3 */}
                          <div className='d-flex align-items-center gap-3 mb-3'>
                            <input
                              type='radio'
                              name={`radio-${index}`}
                              style={{ width: "20px", height: "20px" }}
                              checked={
                                checkedData(CQ.question, CQ.option3) ||
                                checkedData2(CQ.question, CQ.option3)
                              }
                              id={`answer-${index}-3`}
                              onChange={(e) => {
                                handleChange(e.target.value, CQ);
                              }}
                              value={CQ.option3 || ""}
                              disabled={objectiveSubmitted}
                            />
                            <label htmlFor={`answer-${index}-3`}>
                              <p className='fs-3'>{CQ.option3}</p>
                            </label>
                          </div>
                          {/* option 4 */}
                          <div className='d-flex align-items-center gap-3 mb-3'>
                            <input
                              type='radio'
                              name={`radio-${index}`}
                              style={{ width: "20px", height: "20px" }}
                              checked={
                                checkedData(CQ.question, CQ.option4) ||
                                checkedData2(CQ.question, CQ.option4)
                              }
                              id={`answer-${index}-4`}
                              onChange={(e) => {
                                handleChange(e.target.value, CQ);
                              }}
                              value={CQ.option4 || ""}
                              disabled={objectiveSubmitted}
                            />
                            <label htmlFor={`answer-${index}-4`}>
                              <p className='fs-3'>{CQ.option4}</p>
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
