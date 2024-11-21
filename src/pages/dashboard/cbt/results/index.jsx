import React, { useEffect, useState } from "react";
import { MdOutlineLibraryBooks } from "react-icons/md";
import AuthSelect from "../../../../components/inputs/auth-select";
import styles from "../../../../assets/scss/pages/dashboard/assignment.module.scss";
import { useAssignments } from "../../../../hooks/useAssignments";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Spinner } from "reactstrap";
import queryKeys from "../../../../utils/queryKeys";
import SubmissionTable from "../../../../components/tables/submission-table";
import {
  addQuestionMarkTotal,
  addSumMark,
  analyzeQuestions,
  convertToPercentage,
  countCorrectAnswers,
} from "../constant";
import Prompt from "../../../../components/modals/prompt";
import { toast } from "react-toastify";
import { useSubject } from "../../../../hooks/useSubjects";
import ButtonGroup from "../../../../components/buttons/button-group";
import { useCBT } from "../../../../hooks/useCBT";
import { FaComputer } from "react-icons/fa6";
import PageSheet from "../../../../components/common/page-sheet";
import GoBack from "../../../../components/common/go-back";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { formatTime } from "./constant";
import CbtStudentsRow from "../../../../components/common/cbt-students-row";

const CbtResults = ({}) => {
  const {
    classSubjects,
    apiServices,
    errorHandler,
    permission,
    user,
    createdQuestion,
    myStudents,
    updatePreviewAnswerFxn,
    subjectsByTeacher,
    markedQ,
    setMarkedQ,
    answeredObjResults,
    setAnsweredObjResults,
    answeredTheoryResults,
    setAnsweredTheoryResults,
    ResultTab,
    setResultTab,
    studentByClass,
    studentByClassLoading,
  } = useCBT();

  const [cbtObject, setCbtObject] = useState({});
  const [cbtResult, setCbtResult] = useState([]);

  const { state } = useLocation();

  const isDesktop = useMediaQuery({ query: "(max-width: 988px)" });
  const isTablet = useMediaQuery({
    query: "(min-width: 768px, max-width: 991px)",
  });
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const { question_type, subject, subject_id, student_id, week, student } =
    markedQ;

  const [newSubjects, setNewSubjects] = useState([]);
  const { subjects, isLoading: subjectLoading } = useSubject();

  const [showLoading, setShowLoading] = useState(false);

  const [idWithComputedResult, setIdWithComputedResult] = useState([]);

  const [loginPrompt, setLoginPrompt] = useState(false);

  const queryClient = useQueryClient();

  const trigger = () => {
    setShowLoading(true);
    setTimeout(() => {
      setShowLoading(false);
    }, 1000);
  };

  const activateRetrieve = () => {
    if (question_type !== "" && student_id !== "" && subject_id !== "") {
      return true;
    } else {
      return false;
    }
  };

  /////// FETCH ANSWERED CBT /////
  const {
    isLoading: cbtAnswerLoading,
    refetch: refetchCbtAnswer,
    data: cbtAnswer,
  } = useQuery(
    [queryKeys.GET_SUBMITTED_CBT_STUDENT, "2"],
    () =>
      apiServices.getCbtAnswerByStudentId(
        student_id,
        state?.creds?.period,
        state?.creds?.term,
        state?.creds?.session,
        question_type,
        subject_id
      ),
    {
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      // enabled: permission?.read || permission?.readClass,
      enabled: activateRetrieve(),
      select: (data) => {
        const ffk = apiServices.formatData(data);

        const sorted = ffk?.sort((a, b) => {
          if (Number(a.question_number) < Number(b.question_number)) {
            return -1;
          }
          if (Number(a.question_number) > Number(b.question_number)) {
            return 1;
          }
          return 0;
        });

        const calculatedData = analyzeQuestions(sorted);

        // console.log({ ffk, data, sorted });

        return calculatedData ?? {};
      },

      onSuccess(data) {
        setCbtObject(data);
        const ids = data?.questions?.map((idx, i) => {
          return idx?.student_id;
        });
        setIdWithComputedResult(ids);
      },
      onError(err) {
        errorHandler(err);
      },
      // select: apiServices.formatData,
    }
  );

  /////// FETCH ANSWERED CBT /////
  const {
    isLoading: cbtSubmmittedAnswerLoading,
    refetch: refetchSubmittedCbtAnswer,
    data: cbtSubmmittedAnswer,
  } = useQuery(
    [queryKeys.GET_SUBMITTED_CBT_ANSWER],
    () =>
      apiServices.getCbtResultByStudentId(
        student_id,
        state?.creds?.period,
        state?.creds?.term,
        state?.creds?.session,
        question_type,
        subject_id
      ),
    {
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      // enabled: permission?.read || permission?.readClass,
      enabled: activateRetrieve(),
      select: (data) => {
        const bbk = apiServices.formatData(data);

        // console.log({ bbk, data });

        return bbk ?? [];
      },

      onSuccess(data) {
        setCbtResult(data);
      },
      onError(err) {
        errorHandler(err);
      },
      // select: apiServices.formatData,
    }
  );

  ///// FETCH MARKED QUESTIONS //////
  const {
    isLoading: markedAssignmentResultsLoading,
    refetch: refetchMarkedAssignmentResults,
    data: markedAssignmentResults,
  } = useQuery(
    [
      queryKeys.GET_MARKED_ASSIGNMENT_FOR_RESULTS,
      student_id,
      user?.period,
      user?.term,
      user?.session,
      "theory",
      week,
    ],
    () =>
      apiServices.getMarkedAssignmentByStudentId(
        student_id,
        user?.period,
        user?.term,
        user?.session,
        "theory",
        week
      ),

    {
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: false,
      // enabled: activateRetrieve() && permission?.submissions,

      select: (data) => {
        const mmk = apiServices.formatData(data);

        const sorted = mmk
          ?.filter(
            (dt) =>
              dt?.subject_id === subject_id &&
              Number(dt?.student_id) === Number(student_id)
            // &&
            // dt?.week === week
          )
          ?.sort((a, b) => {
            if (Number(a.question_number) < Number(b.question_number)) {
              return -1;
            }
            if (Number(a.question_number) > Number(b.question_number)) {
              return 1;
            }
            return 0;
          });

        // console.log({ mmk, data, sorted });

        const computedTeacherMark = addSumMark(sorted);

        return computedTeacherMark ?? {};
      },
      // enabled: false,
      onSuccess(data) {},
      onError(err) {
        errorHandler(err);
      },
      // select: apiServices.formatData,
    }
  );

  const buttonOptions = [
    {
      title: "Cancel",
      onClick: () => setLoginPrompt(false),
      variant: "outline",
    },
    {
      title: "Yes Submit",
      //   disabled: activatePreview(),
      // isLoading: `${activeTab === "2" ? isLoading : isLoading}`,
      //
      // variant: "outline",
    },
  ];

  const showNoAssignment = () => {
    if (cbtObject?.questions?.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  const showNoAssignment2 = () => {
    if (!question_type || !subject_id || !student_id) {
      return true;
    } else {
      return false;
    }
  };

  const allLoading =
    showLoading ||
    markedAssignmentResultsLoading ||
    cbtAnswerLoading ||
    studentByClassLoading;

  const questionType = [
    {
      value: "objective",
      title: "Objective",
    },

    // {
    //   value: "theory",
    //   title: "Theory",
    // },
  ];

  /////// POST CBT RESULT ////
  const { mutateAsync: addCbtResult, isLoading: addCbtResultLoading } =
    useMutation(
      apiServices.addCbtResult,

      {
        onSuccess() {
          queryClient.invalidateQueries(queryKeys.GET_SUBMITTED_CBT_STUDENT);

          toast.success(
            `CBT ${question_type} result has been submitted successfully`
          );
        },
        onError(err) {
          apiServices.errorHandler(err);
        },
      }
    );

  const optionTabShow = () => {
    const objectiveTab = {
      title: "CBT Objective",
      onClick: () => setResultTab("1"),
      variant: ResultTab === "1" ? "" : "outline",
    };

    const theoryTab = {
      title: "CBT Theory",
      onClick: () => setResultTab("2"),
      variant: ResultTab === "2" ? "" : "outline",
    };

    if (cbtObject?.questions?.length >= 1) {
      return [objectiveTab];
    }

    return [];
  };

  const showWarning = () => {
    if (!question_type || !subject_id) {
      return true;
    } else {
      return false;
    }
  };

  let dt = formatTime(cbtObject?.totalDuration, cbtObject?.submittedDuration);

  useEffect(() => {
    if (subjectsByTeacher?.length > 0) {
      const sbb2 = subjectsByTeacher[0]?.title?.map((sb) => {
        const subId = subjects?.find((ob) => ob.subject === sb.name)?.id;

        return {
          // value: subId,
          value: sb?.name,
          title: sb?.name,
        };
      });
      setNewSubjects(sbb2);
    } else {
      setNewSubjects([]);
    }
  }, [subjectsByTeacher]);

  useEffect(() => {
    trigger();

    if (activateRetrieve()) {
      refetchCbtAnswer();
      refetchSubmittedCbtAnswer();
    }

    // setAnsweredTheoQ(submittedTheoAssignment);
  }, [subject_id, student_id]);

  // useEffect(() => {
  //   if (cbtAnswer?.questions?.length >= 1) {
  //     setResultTab("1");
  //   }
  // }, [week, subject, student]);

  console.log({
    // markedQ,
    // cbtAnswer,
    cbtObject,
    // markedAssignmentResults,
    // dt,
    // cbtResult,
  });

  return (
    <div className='results-sheet'>
      <GoBack />
      <PageSheet>
        <div className={styles.created}>
          <div className='d-flex align-items-center justify-content-center mb-4'>
            <p className='fw-bold fs-4'>
              {/* CBT {toSentenceCase(state?.creds?.question_type)} |{" "} */}
              {state?.creds?.period} | {state?.creds?.term} |{" "}
              {state?.creds?.session}
            </p>
          </div>

          <div className='d-flex flex-column flex-lg-row align-items-center  gap-4'>
            <div
              className={`d-flex align-items-center flex-grow-1 gap-3 ${
                isDesktop && "w-100"
              }`}
            >
              <AuthSelect
                sort
                options={newSubjects}
                value={subject}
                onChange={({ target: { value } }) => {
                  const subId = subjects?.find(
                    (ob) => ob.subject === value
                  )?.id;
                  setMarkedQ((prev) => {
                    return { ...prev, subject_id: subId, subject: value };
                  });
                }}
                placeholder='Select Subject'
                wrapperClassName='w-100'
              />
              <AuthSelect
                sort
                options={questionType}
                value={question_type}
                onChange={({ target: { value } }) => {
                  setMarkedQ((prev) => {
                    return { ...prev, question_type: value, answer: "" };
                  });
                }}
                placeholder='Select type'
                wrapperClassName=''
              />
              {/* <AuthSelect
                sort
                options={myStudents}
                value={student}
                onChange={({ target: { value } }) => {
                  setMarkedQ((prev) => {
                    const fId = () => {
                      const ff = myStudents?.find((opt) => opt.value === value);
                      if (ff) {
                        return ff?.id?.toString();
                      }
                    };
                    return { ...prev, student: value, student_id: fId() };
                  });

                  // refetchMarkedAssignment();
                  // setMarkedTheoQ([]);
                  // setMarkedTheoQ2([]);
                }}
                placeholder='Select Student'
                wrapperClassName=''
              /> */}
            </div>
          </div>

          {showWarning() && (
            <div className='w-100 d-flex justify-content-center align-items-center  gap-3 bg-danger bg-opacity-10 py-3 px-4 mt-3'>
              <p className='fs-4 text-danger'>
                Please select Subject and Question type
              </p>
            </div>
          )}

          <div className='w-100 mt-4 border border-2 pt-4  px-3 rounded-3'>
            <CbtStudentsRow
              studentByClassAndSession={studentByClass}
              onProfileSelect={(x) => {
                setMarkedQ((prev) => {
                  return {
                    ...prev,
                    student: `${x.surname} ${x.firstname}`,
                    student_id: x.id,
                  };
                });
              }}
              isLoading={allLoading}
              answerQ={markedQ}
              idWithComputedResult={idWithComputedResult}
            />
          </div>

          {/* <div className='w-100 d-flex justify-content-center mt-4'>
            <ButtonGroup options={optionTabShow()} />
          </div> */}
          {allLoading && (
            <div className={styles.spinner_container}>
              <Spinner /> <p className='fs-3'>Loading...</p>
            </div>
          )}
          {!allLoading && (showNoAssignment() || showNoAssignment2()) && (
            <div className={styles.placeholder_container}>
              <FaComputer className={styles.icon} />
              <p className='fs-1 fw-bold mt-3'>No CBT Result</p>
            </div>
          )}
          {!allLoading &&
            cbtObject?.questions?.length > 0 &&
            ResultTab === "1" && (
              <div className='my-5 '>
                <div className='d-flex mb-5 flex-column gap-3 gap-md-3 flex-md-row justify-content-md-between'>
                  <div className='d-flex justify-content-center align-items-center gap-3 w-100 '>
                    {/* total marks */}
                    <div className=' bg-info bg-opacity-10 py-4 px-4 d-flex flex-column justify-content-center align-items-center gap-4'>
                      <p className='fs-3 fw-bold'>Total Marks</p>
                      <p className='fs-2 fw-bold'>{cbtObject?.total_marks}</p>
                    </div>
                    {/* score */}
                    <div className=' bg-info bg-opacity-10 py-4 px-4 d-flex flex-column justify-content-center align-items-center gap-3'>
                      <p className='fs-3 fw-bold'>Student Score</p>
                      <p className='fs-2 fw-bold'>{cbtObject?.score}</p>
                    </div>
                  </div>
                  <div className='d-flex justify-content-center align-items-center gap-3 w-100 '>
                    {/* total marks */}
                    <div className=' bg-danger bg-opacity-10 py-4 px-4 d-flex flex-column justify-content-center align-items-center gap-3'>
                      <p className='fs-3 fw-bold'>Total Test Duration</p>
                      <p className='fs-2 fw-bold'>
                        {
                          formatTime(
                            cbtObject?.totalDuration,
                            cbtObject?.submittedDuration
                          )?.totalTime
                        }
                      </p>
                    </div>
                    {/* score */}
                    <div className=' bg-danger bg-opacity-10 py-4 px-4 d-flex flex-column justify-content-center align-items-center gap-3'>
                      <p className='fs-3 fw-bold'>Student Duration</p>
                      <p className='fs-2 fw-bold'>
                        {
                          formatTime(
                            cbtObject?.totalDuration,
                            cbtObject?.submittedDuration
                          )?.difference
                        }
                      </p>
                    </div>
                    {/* percentage */}
                    {/* <div className=' bg-info bg-opacity-10 py-4 px-4 d-flex flex-column justify-content-center align-items-center gap-3'>
                      <p className='fs-3 fw-bold'>Percentage Score</p>
                      <p className='fs-1 fw-bold'>
                        {`${cbtAnswer?.percentage}%`}
                      </p>
                    </div> */}
                  </div>
                </div>
                <SubmissionTable
                  centered
                  isLoading={allLoading}
                  addCbtResult={addCbtResult}
                  isStudent={false}
                  addCbtResultLoading={addCbtResultLoading}
                  rowHasView={true}
                  columns={[
                    // {
                    //   Header: "Question Type",
                    //   accessor: "question_type",
                    // },
                    {
                      Header: "Question Number",
                      accessor: "question_number",
                    },
                    {
                      Header: "Question Mark",
                      accessor: "question_mark",
                    },
                    {
                      Header: "Student Score",
                      accessor: "answer_state",
                    },
                  ]}
                  data={cbtObject?.questions}
                  markedQ={markedQ}
                  result={cbtObject}
                  ResultTab={ResultTab}
                  cbtResult={cbtResult}
                  // total_mark={cbtAnswer?.total_marks}
                  // score={cbtAnswer?.score}
                  // mark={cbtAnswer?.score}
                />
              </div>
            )}
          {/* {!allLoading &&
            markedAssignmentResults?.questions?.length > 0 &&
            ResultTab === "2" && (
              <div className=''>
                <div className='d-flex justify-content-center align-items-center gap-4 w-100 my-5'>
                  <div className=' bg-info bg-opacity-10 py-4 px-4 d-flex flex-column justify-content-center align-items-center gap-3'>
                    <p className='fs-3 fw-bold'>Total Marks</p>
                    <p className='fs-1 fw-bold'>
                      {markedAssignmentResults?.total_marks}
                    </p>
                  </div>
                  <div className=' bg-info bg-opacity-10 py-4 px-4 d-flex flex-column justify-content-center align-items-center gap-3'>
                    <p className='fs-3 fw-bold'>Score</p>
                    <p className='fs-1 fw-bold'>
                      {markedAssignmentResults?.score}
                    </p>
                  </div>
                  <div className=' bg-info bg-opacity-10 py-4 px-4 d-flex flex-column justify-content-center align-items-center gap-3'>
                    <p className='fs-3 fw-bold'>Percentage</p>
                    <p className='fs-1 fw-bold'>
                      {`${markedAssignmentResults?.percentage}%`}
                    </p>
                  </div>
                </div>
                <SubmissionTable
                  updatePreviewAnswerFxn={updatePreviewAnswerFxn}
                  // previewAnswer={previewAnswer}
                  centered
                  isLoading={allLoading}
                  addCbtResult={addCbtResult}
                  addCbtResultLoading={addCbtResultLoading}
                  rowHasView={true}
                  isStudent={false}
                  columns={[
                    // {
                    //   Header: "Question Type",
                    //   accessor: "question_type",
                    // },
                    {
                      Header: "Question Number",
                      accessor: "question_number",
                    },
                    {
                      Header: "Question Mark",
                      accessor: "question_mark",
                    },
                    {
                      Header: "Student Score",
                      accessor: "teacher_mark",
                    },
                  ]}
                  data={markedAssignmentResults?.questions}
                  markedQ={markedQ}
                  result={markedAssignmentResults}
                  ResultTab={ResultTab}
                />
              </div>
            )} */}
        </div>
        <Prompt
          isOpen={loginPrompt}
          toggle={() => setLoginPrompt(!loginPrompt)}
          hasGroupedButtons={true}
          groupedButtonProps={buttonOptions}
          singleButtonText='Preview'
          promptHeader={` CONFIRM RESULT SUBMISSION `}
        ></Prompt>
      </PageSheet>
    </div>
  );
};

export default CbtResults;
