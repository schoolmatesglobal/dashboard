import React, { useState } from "react";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import ButtonGroup from "../../../../components/buttons/button-group";
import styles from "../../../../assets/scss/pages/dashboard/studentAssignment.module.scss";
import { useStudentAssignments } from "../../../../hooks/useStudentAssignment";
import Prompt from "../../../../components/modals/prompt";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import queryKeys from "../../../../utils/queryKeys";
import { useMediaQuery } from "react-responsive";
import { queryOptions } from "../../../../utils/constants";

const Theory = ({
  assignmentLoading,
  theoryQ,
  answeredTheoryQ,
  setAnsweredTheoryQ,
  createQ2,
  setCreateQ2,
  subjects,
  theorySubmitted,
  setTheorySubmitted,
}) => {
  const { apiServices, permission, user, errorHandler } =
    useStudentAssignments();

  const isDesktop = useMediaQuery({ query: "(min-width: 992px)" });
  const isTablet = useMediaQuery({
    query: "(min-width: 768px, max-width: 991px)",
  });
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const student = `${user?.surname} ${user?.firstname}`;

  //// SUBMIT THEORY ASSIGNMENT ////
  const {
    mutateAsync: submitTheoryAssignment,
    isLoading: submitTheoryAssignmentLoading,
  } = useMutation(() => apiServices.submitTheoryAssignment(answeredTheoryQ), {
    onSuccess() {
      toast.success("Theory assignment has been submitted successfully");
    },
    onError(err) {
      apiServices.errorHandler(err);
    },
  });

  /////// FETCH ANSWERED THEORY ASSIGNMENTS /////
  const {
    isLoading: answeredTheoryAssignmentLoading,
    refetch: refetchTheoryAnsweredAssignment,
    data: theoryAnsweredAssignment,
  } = useQuery(
    [
      queryKeys.GET_SUBMITTED_ASSIGNMENT_STUDENT,
      user?.period,
      user?.term,
      user?.session,
      "theory",
      createQ2?.week,
    ],
    () =>
      apiServices.getSubmittedAssignment(
        user?.period,
        user?.term,
        user?.session,
        "theory",
        createQ2?.week
      ),
    {
      // retry: 1,
      // refetchOnMount: true,
      // refetchOnWindowFocus: false,
      ...queryOptions,
      // enabled: permission?.read || permission?.readClass,
      enabled: permission?.view && permission?.student_results,
      // enabled: false,
      select: (data) => {
        const ggk = apiServices.formatData(data);

        const sorted = ggk?.filter(
          (dt) =>
            dt?.subject === createQ2?.subject &&
            dt?.student === student &&
            dt?.week === createQ2?.week
        );

        // console.log({ ggk, sorted, data, student, createQ2 });

        if (sorted?.length > 0) {
          // resetLoadObjectiveAnsFxn();
          setTheorySubmitted(true);
          // loadObjectiveAnsFxn(sorted);
        } else if (sorted?.length === 0) {
          // resetLoadObjectiveAnsFxn();
          // setTheorySubmitted(false);
        }
        return sorted;
      },
      onSuccess(data) {},
      onError(err) {
        errorHandler(err);
      },
      // select: apiServices.formatData,
    }
  );

  const activateRetrieve = () => {
    if (createQ2?.subject !== "" && createQ2?.week !== "") {
      return true;
    } else {
      return false;
    }
  };

  const showNoAssignment = () => {
    if (theoryQ.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  // const [theoryDefaultValue, settheoryDefaultValue] = useState([]);

  const checkEmptyQuestions = () => {
    if (answeredTheoryQ.length === theoryQ.length) {
      return false;
    } else {
      return true;
    }
  };

  const checkedData = (question, CQ) => {
    const indexToCheck = answeredTheoryQ?.findIndex(
      (ob) => ob.question === question
    );
    if (indexToCheck !== -1) {
      return answeredTheoryQ[indexToCheck]?.answer;
    } else {
      return "";
    }
  };

  const checkedData2 = (question, CQ) => {
    const theo = theoryAnsweredAssignment?.find(
      (ob) => ob.question === question
    );
    // console.log({ theo });
    if (theo) {
      return theo?.answer;
    } else {
      return "";
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
        setTheorySubmitted(true);
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
      title: "Submit Theory",
      onClick: () => displayPrompt(),
      disabled: checkEmptyQuestions() || checkEmptyStatus(),
    },
  ];

  const handleChange = (optionValue, CQ) => {
    const indexToUpdate = answeredTheoryQ?.findIndex(
      (item) => item.question === CQ.question
    );

    const filteredArray = answeredTheoryQ?.filter(
      (ans) => ans.question !== CQ.question
    );

    if (indexToUpdate !== -1) {
      setAnsweredTheoryQ([
        ...filteredArray,
        {
          period: user?.period,
          term: user?.term,
          session: user?.session,
          student_id: Number(user?.id),
          subject_id: Number(findSubjectId()),
          question: CQ.question,
          question_type: "theory",
          answer: optionValue,
          correct_answer: CQ.answer,
          assignment_id: Number(CQ.id),
          submitted: "true",
          question_number: Number(CQ.question_number),
          week: CQ.week,
        },
      ]);
    } else {
      setAnsweredTheoryQ([
        ...answeredTheoryQ,
        {
          period: user?.period,
          term: user?.term,
          session: user?.session,
          student_id: Number(user?.id),
          subject_id: Number(findSubjectId()),
          question: CQ.question,
          question_type: "theory",
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

  function checkEmptyStatus() {
    return answeredTheoryQ.some((obj) => obj.answer === "");
  }

  // console.log({ answeredTheoryQ });
  // console.log({
  //   theoryQ,
  //   answeredTheoryQ,
  //   theoryAnsweredAssignment,
  //   theorySubmitted,
  //   findSubjectId: findSubjectId(),
  // });
  // console.log({ theoryQ });

  return (
    <div className=''>
      {/* {!assignmentLoading && showNoAssignment() && (
        <div className={styles.placeholder_container}>
          <HiOutlineDocumentPlus className={styles.icon} />
          <p className={styles.heading}>No Theory Assignment</p>
        </div>
      )} */}
      {!assignmentLoading && theoryQ.length >= 1 && (
        <div className='position-relative'>
          {theorySubmitted && (
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
          )}
          <div className={`${theorySubmitted && "opacity-50"}`}>
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
                  if (Number(a.question_number) < Number(b.question_number)) {
                    return -1;
                  }
                  if (Number(a.question_number) > Number(b.question_number)) {
                    return 1;
                  }
                  return 0;
                })
                ?.map((CQ, index) => {
                  // console.log({ CQ });
                  return (
                    <div
                      className='border border-2 py-sm-5 px-sm-5 py-4 px-4'
                      key={index}
                      // style={{ width: "300px" }}
                    >
                      <p className='fs-3 mb-4 lh-base'>
                        <span className='fs-3 fw-bold'>
                          {/* {CQ.question_number}. */}
                          {index + 1}.
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
                                handleChange(e.target.value, CQ);
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
              promptHeader={`CONFIRM ASSIGNMENT SUBMISSION`}
            >
              <p className={styles.warning_text}>
                Are you sure you want to submit this assignment.
              </p>
            </Prompt>
          </div>
        </div>
      )}
    </div>
  );
};

export default Theory;
