import React, { useEffect, useState } from "react";
import { MdOutlineLibraryBooks } from "react-icons/md";
import AuthSelect from "../../../../components/inputs/auth-select";
import styles from "../../../../assets/scss/pages/dashboard/assignment.module.scss";
import { useAssignments } from "../../../../hooks/useAssignments";
import { useQuery, useQueryClient } from "react-query";
import { Spinner } from "reactstrap";
import queryKeys from "../../../../utils/queryKeys";
import SubmissionTable from "../../../../components/tables/submission-table";
import { addSumMark, analyzeQuestions } from "../constant";
import Prompt from "../../../../components/modals/prompt";
import { useSubject } from "../../../../hooks/useSubjects";
import ButtonGroup from "../../../../components/buttons/button-group";
import { FaComputer } from "react-icons/fa6";
import { useCBT } from "../../../../hooks/useCBT";
import { useLocation } from "react-router-dom";
import useMyMediaQuery from "../../../../hooks/useMyMediaQuery";
import { formatTime } from "../results/constant";
import PageSheet from "../../../../components/common/page-sheet";
import GoBack from "../../../../components/common/go-back";
import { useMediaQuery } from "react-responsive";
import { useStudentCBT } from "../../../../hooks/useStudentCBT";

const StudentCBTResults = (
  {
    // markedQ,
    // setMarkedQ,
    // answeredObjResults,
    // setAnsweredObjResults,
    // answeredTheoryResults,
    // setAnsweredTheoryResults,
    // ResultTab,
    // setResultTab,
  }
) => {
  const {
    apiServices,
    errorHandler,
    permission,
    user,
    updatePreviewAnswerFxn,
    markedQ,
    setMarkedQ,
    answeredObjResults,
    setAnsweredObjResults,
    answeredTheoryResults,
    setAnsweredTheoryResults,
    ResultTab,
    setResultTab,
  } = useCBT();

  const {studentSubjects} = useStudentCBT()

  const [cbtObject, setCbtObject] = useState({});

  const { state } = useLocation();

  const { xs, sm, md, lg, xl, xxl } = useMyMediaQuery();

  const { question_type, subject, subject_id, student_id, week, student } =
    markedQ;

  const [newSubjects, setNewSubjects] = useState([]);
  const { subjects, isLoading: subjectLoading } = useSubject();

  const [showLoading, setShowLoading] = useState(false);

  const [loginPrompt, setLoginPrompt] = useState(false);

  const queryClient = useQueryClient();

  const isDesktop = useMediaQuery({ query: "(max-width: 988px)" });

  const trigger = () => {
    setShowLoading(true);
    setTimeout(() => {
      setShowLoading(false);
    }, 1000);
  };

  const activateRetrieve = () => {
    if (question_type !== "" && subject_id !== "") {
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
    [queryKeys.GET_SUBMITTED_CBT_STUDENT, "3"],
    () =>
      apiServices.getCbtAnswerByStudentId(
        user?.id,
        state?.creds?.period,
        state?.creds?.term,
        state?.creds?.session,
        question_type,
        subject_id
      ),
    {
      retry: 3,
      // enabled: permission?.read || permission?.readClass,
      enabled: activateRetrieve(),
      select: (data) => {
        const ffk = apiServices.formatData(data);

        const sorted = ffk?.sort((a, b) => {
          if (a.question_number < b.question_number) {
            return -1;
          }
          if (a.question_number > b.question_number) {
            return 1;
          }
          return 0;
        });

        const calculatedData = analyzeQuestions(sorted);

        console.log({ ffk, data, sorted });
        // if (question_type === "objective") {
        //   return calculatedData ?? {};
        // } else {
        //   return {};
        // }
        return calculatedData ?? {};
      },

      onSuccess(data) {
        setCbtObject(data);
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
      "theory2",
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
      retry: 3,
      // enabled: permission?.read || permission?.readClass,
      // enabled: activateRetrieve(),
      enabled: false,

      select: (data) => {
        const mmk = apiServices.formatData(data);

        const sorted = mmk
          ?.filter(
            (dt) =>
              dt?.subject_id === subject_id &&
              Number(dt?.student_id) === Number(student_id)
          )
          ?.sort((a, b) => {
            if (a.question_number < b.question_number) {
              return -1;
            }
            if (a.question_number > b.question_number) {
              return 1;
            }
            return 0;
          });

        console.log({ mmk, data, sorted });

        const computedTeacherMark = addSumMark(sorted);

        return computedTeacherMark ?? {};

        // return computedTeacherMark ?? [];
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
    } else if (
      // ResultTab === "2" &&
      markedAssignmentResults?.questions?.length === 0
    ) {
      return true;
    } else {
      return false;
    }
  };

  const showNoAssignment2 = () => {
    if (cbtObject?.questions?.length === 0) {
      return true;
    } else if (
      // ResultTab === "2" &&
      markedAssignmentResults?.questions?.length === 0
    ) {
      return true;
    } else {
      return false;
    }
  };

  const showNoAssignment3 = () => {
    if (!question_type || !subject_id) {
      return true;
    } else {
      return false;
    }
  };

  const optionTabShow = () => {
    const objectiveTab = {
      title: "Objective",
      onClick: () => setResultTab("1"),
      variant: ResultTab === "1" ? "" : "outline",
    };

    const theoryTab = {
      title: "Theory",
      onClick: () => setResultTab("2"),
      variant: ResultTab === "2" ? "" : "outline",
    };

    if (
      cbtObject?.questions?.length >= 1 &&
      markedAssignmentResults?.questions?.length >= 1
    ) {
      return [objectiveTab, theoryTab];
    } else if (cbtObject?.questions?.length >= 1) {
      return [objectiveTab];
    } else if (markedAssignmentResults?.questions?.length >= 1) {
      return [theoryTab];
    }

    return [];
  };

  const allLoading =
    showLoading || markedAssignmentResultsLoading || cbtAnswerLoading;

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

  let dt = formatTime(cbtObject?.totalDuration, cbtObject?.submittedDuration);

  // useEffect(() => {
  //   if (markedAssignmentResults?.questions?.length >= 1) {
  //     setResultTab("2");
  //   } else {
  //     setResultTab("1");
  //   }
  // }, [week, subject]);

  useEffect(() => {
    const sbb = subjects?.map((sb) => {
      return {
        value: sb.subject,
        // value: sb.id,
        title: sb.subject,
      };
    });

    if (sbb?.length > 0) {
      setNewSubjects(sbb);
    } else {
      setNewSubjects([]);
    }
  }, [subjects]);

  useEffect(() => {
    setMarkedQ((prev) => {
      return {
        ...prev,
        student: `${user?.surname} ${user?.firstname}`,
        student_id: user?.id,
      };
    });
  }, []);

  useEffect(() => {
    trigger();

    if (activateRetrieve()) {
      refetchCbtAnswer();
    }

    // setAnsweredTheoQ(submittedTheoAssignment);
  }, [subject, student_id]);

  console.log({
    user,
    markedQ,
    cbtAnswer,
    cbtObject,
    markedAssignmentResults,
  });

  return (
    <div>
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
                options={studentSubjects}
                value={subject}
                // defaultValue={subject && subject}
                onChange={({ target: { value } }) => {
                  const fId = () => {
                    const ff = subjects?.find((opt) => opt.subject === value);
                    if (ff) {
                      return ff?.id?.toString();
                    }
                  };
                  setMarkedQ((prev) => {
                    return { ...prev, subject: value, subject_id: fId() };
                  });
                  // setResultTab("2");
                }}
                placeholder='Select Subject'
                wrapperClassName='w-100'
                // label="Subject"
              />
               <AuthSelect
                sort
                options={questionType}
                value={question_type}
                onChange={({ target: { value } }) => {
                  setMarkedQ((prev) => {
                    return { ...prev, question_type: value, answer: "" };
                  });
                  // setObjectiveSubmitted(false);
                  // reload();
                }}
                placeholder='Select type'
                wrapperClassName=''
              />

              {/* <AuthSelect
                sort
                options={[
                  { value: "objective", title: "Objective" },
                  { value: "theory", title: "Theory" },
                ]}
                value={question_type}
                // defaultValue={question_type && question_type}
                onChange={({ target: { value } }) => {
                  setMarkedQ((prev) => {
                    return { ...prev, question_type: value };
                  });
                }}
                placeholder='Question Type'
                wrapperClassName='w-100'
              /> */}
            </div>
          </div>
          {/* <div className='w-100 d-flex justify-content-center mt-4'>
            <ButtonGroup options={optionTabShow()} />
          </div> */}
          {allLoading && (
            <div className={styles.spinner_container}>
              <Spinner /> <p className='fs-3'>Loading...</p>
            </div>
          )}
          {!allLoading &&
            (showNoAssignment() ||
              showNoAssignment2() ||
              showNoAssignment3()) && (
              <div className={styles.placeholder_container}>
                <FaComputer className={styles.icon} />
                <p className='fs-1 fw-bold mt-3'>No CBT Result</p>
              </div>
            )}
          {!allLoading &&
            cbtObject?.questions?.length > 0 &&
            ResultTab === "1" && (
              <div className='my-5'>
                 <div className='d-flex mb-5 flex-column gap-3 gap-md-3 flex-md-row justify-content-md-between'>
                  <div className='d-flex justify-content-center align-items-center gap-3 w-100 '>
                    {/* total marks */}
                    <div className=' bg-info bg-opacity-10 py-4 px-4 d-flex flex-column justify-content-center align-items-center gap-3'>
                      <p className='fs-3 fw-bold'>Total Marks</p>
                      <p className='fs-1 fw-bold'>{cbtObject?.total_marks}</p>
                    </div>
                    {/* score */}
                    <div className=' bg-info bg-opacity-10 py-4 px-4 d-flex flex-column justify-content-center align-items-center gap-3'>
                      <p className='fs-3 fw-bold'>Student Score</p>
                      <p className='fs-1 fw-bold'>{cbtObject?.score}</p>
                    </div>
                   
                  </div>
                  <div className='d-flex justify-content-center align-items-center gap-3 w-100 '>
                    {/* total marks */}
                    <div className=' bg-danger bg-opacity-10 py-4 px-4 d-flex flex-column justify-content-center align-items-center gap-3'>
                      <p className='fs-3 fw-bold'>Total Test Duration</p>
                      <p className='fs-1 fw-bold'>
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
                      <p className='fs-1 fw-bold'>
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
                  isStudent={true}
                  // addAssignmentResult={addAssignmentResult}
                  // addAssignmentResultLoading={addAssignmentResultLoading}
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
                />
              </div>
            )}
          {!allLoading &&
            markedAssignmentResults?.questions?.length > 0 &&
            ResultTab === "2" && (
              <div className=''>
                <div className='d-flex justify-content-center align-items-center gap-4 w-100 my-5'>
                  {/* total marks */}
                  <div className=' bg-info bg-opacity-10 py-4 px-4 d-flex flex-column justify-content-center align-items-center gap-3'>
                    <p className='fs-3 fw-bold'>Total Marks</p>
                    <p className='fs-1 fw-bold'>
                      {markedAssignmentResults?.total_marks}
                    </p>
                  </div>
                  {/* score */}
                  <div className=' bg-info bg-opacity-10 py-4 px-4 d-flex flex-column justify-content-center align-items-center gap-3'>
                    <p className='fs-3 fw-bold'>Score</p>
                    <p className='fs-1 fw-bold'>
                      {markedAssignmentResults?.score}
                    </p>
                  </div>
                  {/* percentage */}
                  <div className=' bg-info bg-opacity-10 py-4 px-4 d-flex flex-column justify-content-center align-items-center gap-3'>
                    <p className='fs-3 fw-bold'>Percentage</p>
                    <p className='fs-1 fw-bold'>
                      {markedAssignmentResults?.percentage}
                    </p>
                  </div>
                </div>
                <SubmissionTable
                  updatePreviewAnswerFxn={updatePreviewAnswerFxn}
                  // previewAnswer={previewAnswer}
                  centered
                  isLoading={allLoading}
                  isStudent={true}
                  // addAssignmentResult={addAssignmentResult}
                  // addAssignmentResultLoading={addAssignmentResultLoading}
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
                      accessor: "teacher_mark",
                    },
                  ]}
                  data={markedAssignmentResults?.questions}
                  markedQ={markedQ}
                  result={markedAssignmentResults}
                  ResultTab={ResultTab}
                />
              </div>
            )}
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

export default StudentCBTResults;
