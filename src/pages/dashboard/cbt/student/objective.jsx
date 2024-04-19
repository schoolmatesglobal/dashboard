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
import CountdownTimer from "./CountDown";
import { useCountdown } from "react-countdown-circle-timer";

import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { FaPlay } from "react-icons/fa";
import { FaPause, FaComputer } from "react-icons/fa6";
import { useEffect } from "react";
import { useAppContext } from "../../../../hooks/useAppContext";
import { calculateNumberOfPages } from "../constant";
import Button from "../../../../components/buttons/button";

const Objective = ({
  // closeSidebar,
  // toggleNavbar,
  assignmentLoading,
  objectiveQ,
  answeredObjectiveQ,
  setAnsweredObjectiveQ,
  objectiveSubmitted,
  setObjectiveSubmitted,
  createQ2,
  setCreateQ2,
  subjects,
  isPlaying,
  setIsPlaying,
  // showWarning,
  // setShowWarning,
  // testEnded,
  // setTestEnded,
  // timeLeft,
  // setTimeLeft,
  // secondleft,
  // hourLeft,
  // setSecondLeft,
  // setHourLeft,
  day,
  hour,
  minute,
  state,
}) => {
  const { apiServices, permission, user, errorHandler, answerQuestion } =
    useStudentAssignments();

  const {
    isOpen: sideBarIsOpen,
    toggle: toggleSideBar,
    closeSidebar,
    openSidebar,
    close,
    hideAllBars,
    setHideAllBars,
  } = useAppContext();

  const isDesktop = useMediaQuery({ query: "(min-width: 992px)" });
  const isTablet = useMediaQuery({
    query: "(min-width: 768px, max-width: 991px)",
  });
  const isMobile = useMediaQuery({ query: "(max-width: 900px)" });

  // const [isPlaying, setIsPlaying] = useState(false);
  const [showWarning, setShowWarning] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [testEnded, setTestEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [secondleft, setSecondLeft] = useState(null);
  const [hourLeft, setHourLeft] = useState(null);

  const [slice1, setSlice1] = useState("0");
  const [slice2, setSlice2] = useState("1");

  const [currentPage, setCurrentPage] = useState(1);

  const student = `${user?.surname} ${user?.firstname}`;

  //// SUBMIT OBJECTIVE ASSIGNMENT ////
  const {
    mutateAsync: submitObjectiveAssignment,
    isLoading: submitObjectiveAssignmentLoading,
  } = useMutation(apiServices.submitObjectiveAssignment, {
    onSuccess() {
      toast.success("CBT test has been submitted");
    },
    onError(err) {
      apiServices.errorHandler(err);
    },
  });

  //// SUBMIT OBJECTIVE ASSIGNMENT after test////
  const {
    mutateAsync: submitObjectiveAssignment2,
    isLoading: submitObjectiveAssignmentLoading2,
  } = useMutation(apiServices.submitObjectiveAssignment, {
    onSuccess() {
      toast.success("CBT test has ended and has been submitted");
    },
    onError(err) {
      apiServices.errorHandler(err);
    },
  });

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

        // console.log({ ssk, sorted, data, student, createQ2 });

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
    const findObject = subjects?.find((opt) => opt.subject === state?.subject);
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
      // disabled: !checkEmptyQuestions(),
      onClick: () => {
        
        setObjectiveSubmitted(true);
        submitObjectiveAssignment(answeredObjectiveQ);
        setSubmitted(true);

        setIsPlaying(false);

        setHideAllBars(false);

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
      title: "Submit Test",
      onClick: () => displayPrompt(),
      disabled: objectiveSubmitted || !isPlaying,
    },

    // {
    //   title: "Exit CBT Mode",
    //   onClick: () => {
    //     // closeSidebar()
    //     setHideAllBars(false);
    //   },
    //   disabled: !testEnded,
    //   variant: "outline",
    // },
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
          subject_id: Number(state?.subject_id),
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
          // subject_id: Number(findSubjectId()),
          subject_id: Number(state?.subject_id),
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

  // const confirmEndTest = () =>{
  //   if (hourLeft === 0 && timeLeft === 0 && secondleft === 0){

  //   }
  // }
  const allLoading = assignmentLoading || answeredObjAssignmentLoading;

  const initialTaken = isPlaying === false && objectiveSubmitted === true;

  const disableButton =
    (submitted && !testEnded) || (initialTaken && !submitted);

  useEffect(() => {
    if (hourLeft === 0 && timeLeft === 0 && secondleft === 0) {
      setTestEnded(true);
      setHideAllBars(false);
      setIsPlaying(false);
      setSubmitted(true);
      let newArray = [];

      if (newArray?.length !== objectiveQ?.length) {
        const questionsAnsweredId = answeredObjectiveQ?.map((aq, i) => {
          return String(aq.assignment_id);
        });

        newArray.push(...answeredObjectiveQ);

        // console.log({ questionsAnsweredId });

        const filterAns = objectiveQ
          ?.filter((ans) => questionsAnsweredId.includes(ans.id) === false)
          ?.map((qs, i) => {
            return {
              period: user?.period,
              term: user?.term,
              session: user?.session,
              student_id: Number(user?.id),
              subject_id: Number(qs.subject_id),
              question: qs.question,
              question_type: qs.question_type,
              answer: "No option was selected",
              correct_answer: qs.answer,
              assignment_id: Number(qs.id),
              submitted: "true",
              question_number: qs.question_number,
              week: qs.week,
            };
          });

        newArray.push(...filterAns);

        setObjectiveSubmitted(true);

        submitObjectiveAssignment2(newArray);

        // console.log({ questionsAnsweredId, filterAns, newArray });
      } else {
        if (!submitted) {
          submitObjectiveAssignment(answeredObjectiveQ);
        }
      }
    }
  }, [hourLeft, timeLeft, secondleft]);

  const arrayLength = objectiveQ?.length;
  const itemsPerPage = 1;
  const numberOfPages = calculateNumberOfPages(arrayLength, itemsPerPage);

  const t1 = Number(slice1) + 1;

  const t2 =
    currentPage === numberOfPages
      ? objectiveQ?.length
      : objectiveQ?.length > 1
      ? Number(slice2)
      : objectiveQ?.length;

  // const hour = 0;
  // const day = 0;
  // const minute = 0.5;

  console.log({
    // objectiveSubmitted,
    // testEnded,
    // hourLeft,
    // timeLeft,
    // secondleft,
    // submitted,
    // sideBarIsOpen,
    // isPlaying,
    // initialTaken,
    arrayLength,
    itemsPerPage,
    numberOfPages,
    slice1,
    slice2,
    objectiveQ,
    answeredObjectiveQ,
    state,
  });
  // console.log({ checkedData2: checkedData2(), checkedData: checkedData() });

  return (
    <div>
      {!allLoading && objectiveQ?.length >= 1 && (
        <div className=''>
          <div className='' style={{ position: "relative" }}>
            <div
              className='bg-white border-bottom border-1 pb-5 '
              // style={{
              //   position: `${hideAllBars ? "sticky" : ""}`,
              //   top: `${hideAllBars ? "0px" : ""}`,
              //   zIndex: "1",
              // }}
            >
              {hideAllBars && (
                <div className='d-flex justify-content-center mb-2 text-center px-5'>
                  <p className=' text-danger fs-3 mt-4 mb-5 fw-bold lh-base'>
                    NB: CBT fullscreen mode will only be exited when you submit
                    or when test time ends
                  </p>
                </div>
              )}
              <CountdownTimer
                hour={hour}
                day={day}
                minute={minute}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                showWarning={showWarning}
                setShowWarning={setShowWarning}
                timeLeft={timeLeft}
                setTimeLeft={setTimeLeft}
                objectiveSubmitted={objectiveSubmitted}
                setObjectiveSubmitted={setObjectiveSubmitted}
                submitObjectiveAssignment={submitObjectiveAssignment}
                secondleft={secondleft}
                setSecondLeft={setSecondLeft}
                hourLeft={hourLeft}
                setHourLeft={setHourLeft}
                testEnded={testEnded}
                setTestEnded={setTestEnded}
                initialTaken={initialTaken}
                submitted={submitted}
                setSubmitted={setSubmitted}
              />

              <div className='w-100 d-flex justify-content-center align-items-center gap-3 mt-5 mb-4'>
                <p className='fs-3 fw-bold'>Instructions:</p>
                <p className='fs-3'>Answer all questions carefully</p>
              </div>

              {/* <CountdownTimer hour={2} minute={45} durationInMinutes={45} /> */}
              <div className='d-flex flex-column gap-5 flex-md-row justify-content-between align-items-center mt-5'>
                <p className='fs-3 '>
                  <span className='fw-bold fs-3'>
                    {hour} Hour, {minute} Mins
                  </span>{" "}
                  for{" "}
                  <span className='fw-bold fs-3'>
                    {objectiveQ?.length} Questions
                  </span>
                </p>
                <div className='d-flex justify-content-center align-items-center gap-3'>
                  <div
                    style={{
                      cursor:
                        isPlaying || initialTaken ? "not-allowed" : "pointer",
                    }}
                    onClick={() => {
                      if (!disableButton) {
                        setIsPlaying(true);
                        setHideAllBars(true);
                      }
                      // setIsPlaying((prev) => !prev);
                    }}
                    className={`d-flex justify-content-center align-items-center bg-success ${
                      isPlaying || initialTaken
                        ? "bg-opacity-50"
                        : "bg-opacity-100"
                    } gap-3 py-3 px-4 rounded-3`}
                  >
                    <p className='fs-3 fw-bold text-white'>
                      {isPlaying ? "Started" : "Start"}
                    </p>
                    {isPlaying ? (
                      <FaPause className='fs-3 text-white' />
                    ) : (
                      <FaPlay className='fs-3 text-white' />
                    )}
                  </div>
                  <div className='d-flex justify-content-center align-items-center gap-3 bg-info bg-opacity-10 py-3 px-4'>
                    <p className='fs-3 fw-bold'>Total Mark(s):</p>
                    <p className='fs-3 fw-bold'>{objScore}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='position-relative'>
              {objectiveSubmitted && (
                <p
                  className='text-danger fw-bold position-absolute top-50 opacity-10'
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
              <div
                // className={`${
                //   (objectiveSubmitted || !isPlaying) && "opacity-50"
                // }`}
                style={{
                  opacity: `${
                    objectiveSubmitted || !isPlaying ? "0%" : "100%"
                  }`,
                }}
              >
                <div className='d-flex justify-content-center align-items-center mt-5'>
                  <p className='fw-bold fs-3'>
                    Question {currentPage} of {objectiveQ?.length}
                  </p>
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
                    ?.slice(slice1, slice2)
                    ?.map((CQ, index) => {
                      // console.log({ CQ });
                      return (
                        <div
                          className='w-100 border border-2 rounded-1 border-opacity-25 py-sm-5 px-sm-5 py-4 px-4'
                          key={index}
                        >
                          <p className='fs-3 mb-3 lh-base'>
                            <span className='fw-bold fs-3'>
                              {/* {index + 1}. */}
                              {currentPage}.{" "}
                            </span>{" "}
                            {CQ.question}{" "}
                          </p>
                          <p className='fw-bold fs-3 mb-4 lh-base'>
                            ({CQ.question_mark} mk(s) )
                          </p>

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
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    cursor:
                                      objectiveSubmitted || !isPlaying
                                        ? "not-allowed"
                                        : "pointer",
                                  }}
                                  id={`answer-${index}-1`}
                                  onChange={(e) => {
                                    handleChange(e.target.value, CQ);
                                  }}
                                  value={CQ.option1 || ""}
                                  disabled={objectiveSubmitted || !isPlaying}
                                />
                                {/* <p className="">{CQ.option1}</p> */}
                                <label htmlFor={`answer-${index}-1`}>
                                  <p
                                    style={{
                                      cursor:
                                        objectiveSubmitted || !isPlaying
                                          ? "not-allowed"
                                          : "pointer",
                                    }}
                                    className='fs-3'
                                  >
                                    {CQ.option1}
                                  </p>
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
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    cursor:
                                      objectiveSubmitted || !isPlaying
                                        ? "not-allowed"
                                        : "pointer",
                                  }}
                                  id={`answer-${index}-2`}
                                  onChange={(e) => {
                                    handleChange(e.target.value, CQ);
                                  }}
                                  value={CQ.option2 || ""}
                                  disabled={objectiveSubmitted || !isPlaying}
                                />
                                <label htmlFor={`answer-${index}-2`}>
                                  <p
                                    style={{
                                      cursor:
                                        objectiveSubmitted || !isPlaying
                                          ? "not-allowed"
                                          : "pointer",
                                    }}
                                    className='fs-3'
                                  >
                                    {CQ.option2}
                                  </p>
                                </label>
                              </div>
                              {/* option 3 */}
                              <div className='d-flex align-items-center gap-3 mb-3'>
                                <input
                                  type='radio'
                                  name={`radio-${index}`}
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    cursor:
                                      objectiveSubmitted || !isPlaying
                                        ? "not-allowed"
                                        : "pointer",
                                  }}
                                  checked={
                                    checkedData(CQ.question, CQ.option3) ||
                                    checkedData2(CQ.question, CQ.option3)
                                  }
                                  id={`answer-${index}-3`}
                                  onChange={(e) => {
                                    handleChange(e.target.value, CQ);
                                  }}
                                  value={CQ.option3 || ""}
                                  disabled={objectiveSubmitted || !isPlaying}
                                />
                                <label htmlFor={`answer-${index}-3`}>
                                  <p
                                    style={{
                                      cursor:
                                        objectiveSubmitted || !isPlaying
                                          ? "not-allowed"
                                          : "pointer",
                                    }}
                                    className='fs-3'
                                  >
                                    {CQ.option3}
                                  </p>
                                </label>
                              </div>
                              {/* option 4 */}
                              <div className='d-flex align-items-center gap-3 mb-3'>
                                <input
                                  type='radio'
                                  name={`radio-${index}`}
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    cursor:
                                      objectiveSubmitted || !isPlaying
                                        ? "not-allowed"
                                        : "pointer",
                                  }}
                                  checked={
                                    checkedData(CQ.question, CQ.option4) ||
                                    checkedData2(CQ.question, CQ.option4)
                                  }
                                  id={`answer-${index}-4`}
                                  onChange={(e) => {
                                    handleChange(e.target.value, CQ);
                                  }}
                                  value={CQ.option4 || ""}
                                  disabled={objectiveSubmitted || !isPlaying}
                                />
                                <label htmlFor={`answer-${index}-4`}>
                                  <p
                                    style={{
                                      cursor:
                                        objectiveSubmitted || !isPlaying
                                          ? "not-allowed"
                                          : "pointer",
                                    }}
                                    className='fs-3'
                                  >
                                    {CQ.option4}
                                  </p>
                                </label>
                              </div>
                              <div className='w-100 d-flex justify-content-end'>
                                <p className='fst-italic fs-4'>
                                  Answered {answeredObjectiveQ?.length} out of{" "}
                                  {objectiveQ?.length}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                </div>
                <div className='d-flex justify-content-center w-100 align-items-center gap-4'>
                  {/* <ButtonGroup options={buttonOptions2} /> */}
                  <Button
                    className={` `}
                    onClick={() => {
                      if (currentPage > 1) {
                        setCurrentPage((prev) => prev - 1);
                        setSlice1(Number(slice1) - 1);
                        setSlice2(Number(slice1));
                      }
                    }}
                  >
                    Prev
                  </Button>
                  {currentPage < numberOfPages && (
                    <Button
                      className={` `}
                      onClick={() => {
                        if (currentPage < numberOfPages) {
                          setCurrentPage((prev) => prev + 1);
                          setSlice1(Number(slice2));
                          setSlice2(Number(slice2) + 1);
                        }
                      }}
                    >
                      Next
                    </Button>
                  )}
                  {currentPage === numberOfPages && (
                    <Button
                      className={` `}
                      onClick={() => {
                        displayPrompt();
                      }}
                    >
                      Preview
                    </Button>
                  )}
                </div>
                <Prompt
                  isOpen={loginPrompt}
                  toggle={() => setLoginPrompt(!loginPrompt)}
                  hasGroupedButtons={true}
                  groupedButtonProps={buttonOptions}
                  // singleButtonText="Preview"
                  promptHeader={`You attempted ${answeredObjectiveQ?.length} out of ${objectiveQ?.length} Questions`}
                >
                  {answeredObjectiveQ?.map((ans, i) => {
                    return (
                      <div className='py-sm-2 px-sm-2 py-2 px-2' key={i}>
                        <p className='fs-3 mb-3 lh-base'>
                          <span className='fw-bold fs-3'>
                            {ans.question_number}.
                          </span>{" "}
                          {ans.question}{" "}
                        </p>
                        {/* <p className='fw-bold fs-3 mb-4 lh-base'>
                          ({ans.question_mark} mk(s) )
                        </p> */}
                        <div className='d-flex flex-column gap-3 mb-3'>
                          <p className='fs-3'>
                            <span className='fw-bold'>Answer picked:</span>{" "}
                            {ans.answer}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  <p className='w-100 text-danger text-center mt-4 fs-2 fw-bold'>
                    Ready to submit ?
                  </p>
                </Prompt>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Objective;
