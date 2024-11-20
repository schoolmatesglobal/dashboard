import React, { useEffect, useState } from "react";
import { FaComputer } from "react-icons/fa6";
import { useQuery } from "react-query";
import { useMediaQuery } from "react-responsive";
import { useLocation } from "react-router-dom";
import { Spinner } from "reactstrap";
import styles from "../../../../assets/scss/pages/dashboard/assignment.module.scss";
import ButtonGroup from "../../../../components/buttons/button-group";
import GoBack from "../../../../components/common/go-back";
import PageSheet from "../../../../components/common/page-sheet";
import AuthSelect from "../../../../components/inputs/auth-select";
import { useCBT } from "../../../../hooks/useCBT";
import { useSubject } from "../../../../hooks/useSubjects";
import queryKeys from "../../../../utils/queryKeys";
import { countCorrectAnswers } from "../constant";
import Objective from "./objective";
import Button from "../../../../components/buttons/button";
import StudentsResults from "../../../../components/common/students-results";
import CbtStudentsRow from "../../../../components/common/cbt-students-row";
// import styles from "../../../../assets/scss/pages/dashboard/studentAssignment.module.scss";

const CbtSubmission = (
  {
    // answeredObjQ,
    // setAnsweredObjQ,
    // answeredTheoQ,
    // setAnsweredTheoQ,
    // answerQ,
    // setAnswerQ,
    // markedObjQ,
    // setMarkedObjQ,
    // markedTheoQ,
    // setMarkedTheoQ,
    // markedTheoQ2,
    // setMarkedTheoQ2,
    // submissionTab,
    // setSubmissionTab,
  }
) => {
  const {
    answeredObjQ,
    setAnsweredObjQ,
    answeredTheoQ,
    setAnsweredTheoQ,
    answerQ,
    setAnswerQ,
    markedObjQ,
    setMarkedObjQ,
    markedTheoQ,
    setMarkedTheoQ,
    markedTheoQ2,
    setMarkedTheoQ2,
    submissionTab,
    setSubmissionTab,

    updateActiveTabFxn,
    classSubjects,
    apiServices,
    errorHandler,
    permission,
    user,

    answeredQuestion,
    myStudents,
    subjectsByTeacher,

    studentByClass,
    studentByClassLoading,
  } = useCBT();

  const { state } = useLocation();

  const isDesktop = useMediaQuery({ query: "(max-width: 988px)" });
  const isTablet = useMediaQuery({
    query: "(min-width: 768px, max-width: 991px)",
  });
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const {
    question_type,
    subject,
    // image,
    term,
    period,
    session,
    subject_id,
    student_id,
    week,
    student,
  } = answerQ;

  const [showLoading, setShowLoading] = useState(false);

  const [loginPrompt, setLoginPrompt] = useState(false);

  const [newSubjects, setNewSubjects] = useState([]);

  const [loading1, setLoading1] = useState(false);

  const [idWithComputedResult, setIdWithComputedResult] = useState([]);

  const { subjects, isLoading: subjectLoading } = useSubject();

  // const queryClient = useQueryClient();

  const activateRetrieve = () => {
    if (question_type !== "" && student_id !== "" && subject_id !== "") {
      return true;
    } else {
      return false;
    }
  };

  const findStudentId = () => {
    const findObject = myStudents?.find((opt) => opt.value === student);
    if (findObject) {
      return findObject.id;
    }
  };

  const findSubjectId = () => {
    const findObject = subjects?.find((opt) => opt.subject === subject);
    if (findObject) {
      return findObject.id;
    }
  };

  const activateRetrieve2 = () => {
    if (question_type !== "" && student_id !== "" && subject_id !== "") {
      return false;
    } else {
      return true;
    }
  };

  /////// FETCH ANSWERED CBT /////
  const {
    isLoading: cbtAnswerLoading,
    refetch: refetchCbtAnswer,
    data: cbtAnswer,
    // isFetching: submittedAssignmentFetching,
    // isRefetching: submittedAssignmentRefetching,
  } = useQuery(
    [queryKeys.GET_SUBMITTED_CBT_STUDENT],
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

      enabled: activateRetrieve(),
      // enabled: false,
      select: (data) => {
        const ggk = apiServices.formatData(data);

        const sorted = ggk?.sort((a, b) => {
          if (Number(a.question_number) < Number(b.question_number)) {
            return -1;
          }
          if (Number(a.question_number) > Number(b.question_number)) {
            return 1;
          }
          return 0;
        });

        // setAnsweredObjQ(sorted);

        // console.log({ ggk, data, sorted });

        return sorted;
      },

      onSuccess(data) {
        setAnsweredObjQ(data);
        const ids = data?.map((idx, i) => {
          return idx?.student_id;
        });
        setIdWithComputedResult(ids);
        // trigger();
      },
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

  const correctCount = countCorrectAnswers(answeredObjQ ?? []);
  // const correctCount2 = analyzeQuestions(answeredObjQ);

  const showNoAssignment = () => {
    if (answeredObjQ?.length === 0) {
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

  useEffect(() => {
    if (subjectsByTeacher?.length > 0) {
      const sbb2 = subjectsByTeacher[0]?.title?.map((sb) => {
        const subId = subjects?.find((ob) => ob.subject === sb.name)?.id;

        return {
          value: subId,
          // value: sb?.name,
          title: sb?.name,
        };
      });
      setNewSubjects(sbb2);
    } else {
      setNewSubjects([]);
    }
  }, [subjectsByTeacher]);

  const optionTabShow = () => {
    const objectiveTab = {
      title: "Objective",
      onClick: () => setSubmissionTab("1"),
      variant: submissionTab === "1" ? "" : "outline",
    };

    const theoryTab = {
      title: "Theory",
      onClick: () => setSubmissionTab("2"),
      variant: submissionTab === "2" ? "" : "outline",
    };

    if (answeredObjQ?.length >= 1) {
      return [objectiveTab];
    }
    // if (answeredObjQ?.length >= 1 && answeredTheoQ?.length >= 1) {
    //   return [objectiveTab, theoryTab];
    // } else if (answeredObjQ?.length >= 1) {
    //   return [objectiveTab];
    // } else if (answeredTheoQ?.length >= 1) {
    //   return [theoryTab];
    // }

    return [];
  };

  // console.log({
  //   answeredObjQ,
  // });

  // const allLoading = showLoading || assignmentLoading;
  const allLoading =
    cbtAnswerLoading ||
    // submittedTheoAssignmentLoading ||
    // markedAssignmentLoading ||
    loading1 ||
    studentByClassLoading;

  const allLoadingObj = cbtAnswerLoading;

  const theoScore = answeredTheoQ?.reduce(
    (acc, quest) => acc + Number(quest?.question_mark),
    0
  );

  const objScore = answeredObjQ?.reduce(
    (acc, quest) => acc + Number(quest?.question_mark),
    0
  );

  const showWarning = () => {
    if (!question_type || !subject_id) {
      return true;
    } else {
      return false;
    }
  };

  const trigger = () => {
    setLoading1(true);
    setTimeout(() => {
      setLoading1(false);
    }, 1000);
  };

  useEffect(() => {
    trigger();

    if (activateRetrieve()) {
      refetchCbtAnswer();
    }

    // setAnsweredTheoQ(submittedTheoAssignment);
  }, [subject_id, student_id]);

  // useEffect(() => {
  //   trigger();
  //   if (answeredObjQ?.length >= 1) {
  //     setSubmissionTab("1");
  //   }
  //   // if (answeredTheoQ?.length >= 1) {
  //   //   setSubmissionTab("2");
  //   // } else {
  //   //   setSubmissionTab("1");
  //   // }
  // }, [subject, week, student]);

  // console.log({
  //   answeredObjQ,
  //   answeredTheoQ,
  //   submissionTab,
  //   activateRetrieve: activateRetrieve(),
  //   student_id,
  //   state,
  //   question_type,
  //   subject_id,
  //   myStudents,
  //   studentByClass,
  // });
  // console.log({ studentByClass, user, answerQ });

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
                value={subject_id}
                onChange={({ target: { value } }) => {
                  setAnswerQ((prev) => {
                    return { ...prev, subject_id: value };
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
                  setAnswerQ((prev) => {
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
                  setAnswerQ((prev) => {
                    const fId = () => {
                      const ff = myStudents?.find((opt) => opt.value === value);
                      if (ff) {
                        return ff?.id?.toString();
                      }
                    };
                    return { ...prev, student: value, student_id: fId() };
                  });

                  // refetchMarkedAssignment();
                  setMarkedTheoQ([]);
                  setMarkedTheoQ2([]);
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
                setAnswerQ((prev) => {
                  return {
                    ...prev,
                    student: `${x.surname} ${x.firstname}`,
                    student_id: x.id,
                  };
                });
              }}
              isLoading={allLoading}
              answerQ={answerQ}
              answeredObjQ={answeredObjQ}
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
              <p className='fs-1 fw-bold mt-3'>No CBT Submission</p>
            </div>
          )}
          {!allLoading &&
            answeredObjQ?.length >= 1 &&
            submissionTab === "1" && (
              <div className=''>
                <div className='d-flex justify-content-center align-items-center mt-5 '>
                  <div className='d-flex justify-content-center align-items-center gap-3 bg-info bg-opacity-10 py-4 px-4'>
                    <p className='fs-3 fw-bold'>Total Marks:</p>
                    <p className='fs-3 fw-bold'>{objScore} mk(s)</p>
                  </div>
                </div>
                <Objective
                  assignmentLoading={allLoading}
                  data={answeredObjQ}
                  refetchMarkedAssignment={refetchCbtAnswer}
                  answerQ={answerQ}
                />
              </div>
            )}
          {/* {!allLoading && answeredTheoQ?.length >= 1 && submissionTab === "2" && (
            <div className=''>
              <div className='d-flex justify-content-center align-items-center mt-5 '>
                <div className='d-flex justify-content-center align-items-center gap-3 bg-info bg-opacity-10 py-4 px-4'>
                  <p className='fs-3 fw-bold'>Total Marks:</p>
                  <p className='fs-3 fw-bold'>{theoScore} mk(s)</p>
                </div>
              </div>
              <Theory
                refetchMarkedAssignment={refetchMarkedAssignment}
                refetchSubmittedAssignment={refetchSubmittedTheoAssignment}
                trigger={trigger}
                assignmentLoading={allLoading}
                data={answeredTheoQ}
                markedTheoQ={markedTheoQ}
                setMarkedTheoQ={setMarkedTheoQ}
                markedTheoQ2={markedTheoQ2}
                setMarkedTheoQ2={setMarkedTheoQ2}
                markedAssignment={markedAssignment}
                question_type={question_type}
                subject={subject}
                week={week}
                student={student}
                student_id={student_id}
                loading1={loading1}
                setLoading1={setLoading1}
              />
            </div>
          )} */}
        </div>
      </PageSheet>
    </div>
  );
};

export default CbtSubmission;
