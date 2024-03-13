import React, { useEffect, useState } from "react";
import { useAssignments } from "../../../../hooks/useAssignments";
import ButtonGroup from "../../../../components/buttons/button-group";
import styles from "../../../../assets/scss/pages/dashboard/studentAssignment.module.scss";
import { useStudentAssignments } from "../../../../hooks/useStudentAssignment";
import Prompt from "../../../../components/modals/prompt";
import AuthInput from "../../../../components/inputs/auth-input";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";

const Theory = ({
  assignmentLoading,
  data,
  refetchMarkedAssignment,
  markedTheoQ,
  setMarkedTheoQ,
  markedTheoQ2,
  setMarkedTheoQ2,
  markedAssignment,
  question_type,
  subject,
  week,
  student,
  loading1,
  setLoading1,
}) => {
  const { theorySubmitted } = useStudentAssignments();

  const {
    apiServices,
    permission,
    user,
    addTheoryMarkFxn,
    markedTheoryQ,
    markedTheoryQ2,
  } = useAssignments();

  const [marked, setMarked] = useState(false);
  const [array, setArray] = useState([]);

  //// POST MARKED THEORY ASSIGNMENT ///////
  const {
    mutateAsync: submitMarkedTheoryAssignment,
    isLoading: submitMarkedTheoryAssignmentLoading,
  } = useMutation(() => apiServices.submitMarkedTheoryAssignment(markedTheoQ), {
    onSuccess() {
      toast.success("Theory assignment has been marked successfully");
    },
    onError(err) {
      apiServices.errorHandler(err);
    },
  });

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
        submitMarkedTheoryAssignment();
        setTimeout(() => {
          setLoginPrompt(false);
        }, 1000);
      },
      isLoading: submitMarkedTheoryAssignmentLoading,
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
      disabled: checkEmptyQuestions(),
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
  }, [markedAssignment, data,]);

  console.log({
    markedTheoQ,
    markedAssignment,
    data,
    array,
    checkEmptyQuestions: checkEmptyQuestions(),
  });

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
                  if (a.question_number < b.question_number) {
                    return -1;
                  }
                  if (a.question_number > b.question_number) {
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
                              // hasError={!!errors.username}
                              // defaultValue={checkedData2(
                              //   CQ.question,
                              //   CQ.answer
                              // )}
                              defaultValue={CQ?.teacher_mark}
                              // value={checkedData(CQ.question, CQ.answer)}
                              // value={checkedData(CQ.question, CQ.answer)}
                              // name="option"
                              max={Number(CQ?.question_mark)}
                              min={0}
                              onChange={(e) => {
                                const inputValue = e.target.value;

                                if (
                                  Number(inputValue) > Number(CQ?.question_mark)
                                )
                                  return;

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
                                    },
                                  ]);
                                } else {
                                  setMarkedTheoQ([
                                    ...markedTheoQ,
                                    {
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
                                    },
                                  ]);
                                }
                              }}
                              wrapperClassName=''
                            />
                            <p className='mb-4 fw-bold mt-3 fs-4'>
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
