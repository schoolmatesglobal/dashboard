import React, { useEffect, useState } from "react";
import { useAssignments } from "../../../../hooks/useAssignments";
import ButtonGroup from "../../../../components/buttons/button-group";
import styles from "../../../../assets/scss/pages/dashboard/studentAssignment.module.scss";
import { useStudentAssignments } from "../../../../hooks/useStudentAssignment";
import Prompt from "../../../../components/modals/prompt";
import AuthInput from "../../../../components/inputs/auth-input";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import queryKeys from "../../../../utils/queryKeys";

const Theory = ({
  assignmentLoading,
  data,
  refetchMarkedAssignment,
  refetchSubmittedAssignment,
  markedTheoQ,
  setMarkedTheoQ,
  markedTheoQ2,
  setMarkedTheoQ2,
  markedAssignment,
  question_type,
  subject,
  week,
  student,
  student_id,
  loading1,
  setLoading1,
  trigger,
}) => {
  const {
    apiServices,
    permission,
    user,
    addTheoryMarkFxn,
    markedTheoryQ,
    markedTheoryQ2,
  } = useAssignments();

  const [marked, setMarked] = useState(false);
  const [load, setLoad] = useState(false);
  const [checkMark, setCheckMark] = useState([]);
  const [array, setArray] = useState([]);

  const queryClient = useQueryClient();

  //// POST MARKED THEORY ASSIGNMENT ///////
  const {
    mutateAsync: submitMarkedTheoryAssignment,
    isLoading: submitMarkedTheoryAssignmentLoading,
  } = useMutation(
    () => {
      const newTheo = markedTheoQ?.map((th) => {
        return {
          period: user?.period,
          term: user?.term,
          session: user?.session,
          assignment_id: th.assignment_id,
          student_id: th.student_id,
          subject_id: th.subject_id,
          question: th.question,
          question_number: th.question_number,
          question_type: "theory",
          answer: th.answer,
          correct_answer: th.correct_answer,
          submitted: th.submitted,
          teacher_mark: th.teacher_mark,
          week: th.week,
        };
      });
      apiServices.submitMarkedTheoryAssignment(newTheo);
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(
          queryKeys.GET_SUBMITTED_ASSIGNMENT,
          user?.period,
          user?.term,
          user?.session,
          "theory",
          week
        );
        queryClient.invalidateQueries(
          queryKeys.GET_MARKED_ASSIGNMENT,
          student_id,
          user?.period,
          user?.term,
          user?.session,
          "theory",
          week
        );
        toast.success("Theory assignment has been marked successfully");
      },
      onError(err) {
        apiServices.errorHandler(err);
      },
    }
  );

  //// EDIT MARKED ASSIGNMENT ////
  const {
    mutateAsync: editMarkedTheoryAssignment,
    isLoading: editMarkedTheoryAssignmentLoading,
  } = useMutation(
    () => {
      const newTheo = markedTheoQ2?.map((th) => {
        return {
          id: th.id,
          period: user?.period,
          term: user?.term,
          session: user?.session,
          assignment_id: th.assignment_id,
          student_id: th.student_id,
          subject_id: th.subject_id,
          question: th.question,
          question_number: th.question_number,
          question_type: "theory",
          question_mark: th.question_mark,
          answer: th.answer,
          correct_answer: th.correct_answer,
          submitted: th.submitted,
          teacher_mark: th.teacher_mark,
          week: th.week,
        };
      });
      apiServices.editMarkedTheoryAssignment(newTheo);
    },
    {
      onSuccess() {
        // refetchMarkedAssignment();
        // refetchSubmittedAssignment();
        queryClient.invalidateQueries(
          queryKeys.GET_SUBMITTED_ASSIGNMENT,
          user?.period,
          user?.term,
          user?.session,
          "theory",
          week
        );
        queryClient.invalidateQueries(
          queryKeys.GET_MARKED_ASSIGNMENT,
          student_id,
          user?.period,
          user?.term,
          user?.session,
          "theory",
          week
        );
        toast.success("Theory assignment has been marked successfully");
      },
      onError(err) {
        apiServices.errorHandler(err);
      },
    }
  );

  const checkEmptyQuestions = () => {
    if (
      markedTheoQ?.length === array?.length ||
      markedAssignment?.length === array?.length
    ) {
      return false;
    } else {
      return true;
    }
  };

  const checkedData = (question, CQ) => {
    const indexToCheck = markedTheoQ?.findIndex(
      (ob) => ob.question === question && ob.answer === CQ
    );
    if (indexToCheck !== -1) {
      return markedTheoQ[indexToCheck]?.teacher_mark;
    } else {
      return "";
    }
  };

  const checkedData2 = (question, CQ) => {
    const quest = markedAssignment?.find(
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
      disabled: checkEmptyQuestions(),
      onClick: () => {
        if (markedAssignment?.length > 0) {
          editMarkedTheoryAssignment();
        } else {
          submitMarkedTheoryAssignment();
        }
        // trigger();
        setLoad(true);
        setTimeout(() => {
          setLoginPrompt(false);
        }, 700);
      },
      isLoading: load,
      // editMarkedTheoryAssignmentLoading ||
      // submitMarkedTheoryAssignmentLoading ||
      // assignmentLoading,
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
      disabled:
        checkEmptyQuestions() || checkMarkStatus() || checkMarkStatus2(),
    },
  ];

  // console.log({ answeredTheoryQ, data });

  useEffect(() => {
    if (markedAssignment?.length > 0) {
      setArray(markedAssignment);
    } else {
      const newA = data?.map((mk, i) => {
        return {
          ...mk,
          teacher_mark: "",
        };
      });
      setArray(newA);
    }
  }, [markedAssignment, data]);

  function checkMarkStatus() {
    return (
      markedTheoQ.some((obj) => obj.teacher_mark > obj.question_mark) ||
      markedTheoQ2.some((obj) => obj.teacher_mark > obj.question_mark)
    );
  }

  function checkMarkStatus2() {
    return (
      markedTheoQ.some((obj) => obj.teacher_mark === "") ||
      markedTheoQ2.some((obj) => obj.teacher_mark === "")
    );
  }

  // console.log({
  //   markedTheoQ,
  //   markedTheoQ2,
  //   checkMarkStatus: checkMarkStatus(),
  //   checkMarkStatus2: checkMarkStatus2(),
  //   markedAssignment,
  //   data,
  //   array,
  //   checkEmptyQuestions: checkEmptyQuestions(),
  // });

  // console.log({ setTheoryQ });

  return (
    <div className=''>
      {/* {!assignmentLoading && showNoAssignment() && (
        <div className={styles.placeholder_container}>
          <HiOutlineDocumentPlus className={styles.icon} />
          <p className={styles.heading}>No Theory Assignment</p>
        </div>
      )} */}

      {!assignmentLoading && array?.length >= 1 && (
        <div className={styles.objective}>
          <div className=''>
            <p className='fw-bold fs-2 mt-5'>Theory Section</p>
            <div className='d-flex flex-column my-5 gap-3'>
              {array
                ?.sort((a, b) => {
                  if (Number(a.question_number) < Number(b.question_number)) {
                    return -1;
                  }
                  if (Number(a.question_number) > Number(b.question_number)) {
                    return 1;
                  }
                  return 0;
                })
                .map((CQ, index) => {
                  // console.log({ CQT: CQ });

                  return (
                    <div
                      className='w-100 border border-2 rounded-1 border-opacity-25 p-5'
                      key={index}
                      // style={{ width: "300px" }}
                    >
                      <p className='fs-3 mb-3 lh-base'>
                        <span className='fw-bold fs-3'>
                          {CQ.question_number}.
                        </span>{" "}
                        {CQ.question}{" "}
                      </p>
                      {/* <p className='fw-bold fs-3 mb-4 lh-base'>
                        ({CQ.question_mark} mk(s) )
                      </p> */}
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
                        <p className={`fs-3 lh-base`}>
                          <span className='fw-bold fs-3'>
                            Student's Answer:
                          </span>{" "}
                          {CQ.answer}{" "}
                        </p>
                      </>
                      <>
                        {/* Question Score */}
                        <div className='d-flex flex-column flex-md-row align-items-md-center gap-md-5 mt-5'>
                          <div style={{ width: "200px" }}>
                            <AuthInput
                              type='number'
                              placeholder="Question's Mark"
                              // defaultValue={!!errors.username}
                              disabled
                              value={Number(CQ.question_mark)}
                              name='option'
                              onChange={(e) => {}}
                              wrapperClassName=''
                            />
                            <p className='mb-4 fw-bold mt-3 fs-4'>
                              Question's Mark
                            </p>
                          </div>

                          {/* Total Questions */}
                          <div style={{ width: "200px" }}>
                            <AuthInput
                              type='number'
                              placeholder="Teacher's Mark"
                              // onKeyDown={(e) => {}}
                              defaultValue={CQ?.teacher_mark}
                              max={Number(CQ?.question_mark)}
                              min={0}
                              onChange={(e) => {
                                let value = e.target.value;

                                if (markedAssignment?.length > 0) {
                                  const indexToUpdate = markedTheoQ2?.findIndex(
                                    (item) => item.question === CQ.question
                                  );

                                  const filteredArray = markedTheoQ2?.filter(
                                    (ans) => ans.question !== CQ.question
                                  );

                                  if (indexToUpdate !== -1) {
                                    setMarkedTheoQ2([
                                      ...filteredArray,
                                      {
                                        id: CQ.id,
                                        period: user?.period,
                                        term: user?.term,
                                        session: user?.session,
                                        assignment_id: CQ.assignment_id,
                                        student_id: CQ.student_id,
                                        subject_id: CQ.subject_id,
                                        question: CQ.question,
                                        question_number: CQ.question_number,
                                        question_type: "theory",
                                        question_mark: CQ.question_mark,
                                        answer: CQ.answer,
                                        correct_answer: CQ.correct_answer,
                                        submitted: CQ.submitted,
                                        teacher_mark: value,
                                        week: CQ.week,
                                      },
                                    ]);
                                  } else {
                                    setMarkedTheoQ2([
                                      ...markedTheoQ2,
                                      {
                                        id: CQ.id,
                                        period: user?.period,
                                        term: user?.term,
                                        session: user?.session,
                                        assignment_id: CQ.assignment_id,
                                        student_id: CQ.student_id,
                                        subject_id: CQ.subject_id,
                                        question: CQ.question,
                                        question_number: CQ.question_number,
                                        question_mark: CQ.question_mark,
                                        question_type: "theory",
                                        answer: CQ.answer,
                                        correct_answer: CQ.correct_answer,
                                        submitted: CQ.submitted,
                                        teacher_mark: value,
                                        week: CQ.week,
                                      },
                                    ]);
                                  }
                                } else {
                                  const indexToUpdate = markedTheoQ?.findIndex(
                                    (item) => item.question === CQ.question
                                  );

                                  const filteredArray = markedTheoQ?.filter(
                                    (ans) => ans.question !== CQ.question
                                  );

                                  if (indexToUpdate !== -1) {
                                    setMarkedTheoQ([
                                      ...filteredArray,
                                      {
                                        period: user?.period,
                                        term: user?.term,
                                        session: user?.session,
                                        assignment_id: CQ.assignment_id,
                                        student_id: CQ.student_id,
                                        subject_id: CQ.subject_id,
                                        question: CQ.question,
                                        question_number: CQ.question_number,
                                        question_mark: CQ.question_mark,
                                        question_type: "theory",
                                        answer: CQ.answer,
                                        correct_answer: CQ.correct_answer,
                                        submitted: CQ.submitted,
                                        teacher_mark: value,
                                        week: CQ.week,
                                      },
                                    ]);
                                  } else {
                                    setMarkedTheoQ([
                                      ...markedTheoQ,
                                      {
                                        period: user?.period,
                                        term: user?.term,
                                        session: user?.session,
                                        assignment_id: CQ.assignment_id,
                                        student_id: CQ.student_id,
                                        subject_id: CQ.subject_id,
                                        question: CQ.question,
                                        question_number: CQ.question_number,
                                        question_mark: CQ.question_mark,
                                        question_type: "theory",
                                        answer: CQ.answer,
                                        correct_answer: CQ.correct_answer,
                                        submitted: CQ.submitted,
                                        teacher_mark: value,
                                        week: CQ.week,
                                      },
                                    ]);
                                  }
                                }
                              }}
                              wrapperClassName=''
                            />
                            <p className={`mb-4 fw-bold mt-3 fs-4 `}>
                              {/* {checkMark
                                ? "Mark should not be greater"
                                : "Teacher's Mark"} */}
                              Teacher's Mark
                            </p>
                          </div>
                        </div>
                      </>
                    </div>
                  );
                })}
            </div>
            <div className='d-flex justify-content-center '>
              <ButtonGroup options={buttonOptions2} />
            </div>
            {checkMarkStatus() && (
              <p className='w-100 text-center text-danger fs-4 mt-3'>
                Review marking, teacher's mark should not be more than the
                question mark.
              </p>
            )}
            {checkMarkStatus2() && (
              <p className='w-100 text-center text-danger fs-4 mt-3'>
                Review marking, teacher's mark should not be empty.
              </p>
            )}
            <Prompt
              isOpen={loginPrompt}
              toggle={() => setLoginPrompt(!loginPrompt)}
              hasGroupedButtons={true}
              groupedButtonProps={buttonOptions}
              // singleButtonText="Preview"
              promptHeader={`CONFIRM ASSIGNMENT MARKING`}
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
