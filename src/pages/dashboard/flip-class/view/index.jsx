import React, { useEffect, useState } from "react";
import { MdOutlineLibraryBooks } from "react-icons/md";
import AuthSelect from "../../../../components/inputs/auth-select";
import styles from "../../../../assets/scss/pages/dashboard/assignment.module.scss";
import { useAssignments } from "../../../../hooks/useAssignments";
import { useQuery, useQueryClient } from "react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "reactstrap";
import queryKeys from "../../../../utils/queryKeys";
import { useAcademicSession } from "../../../../hooks/useAcademicSession";
import { useStudent } from "../../../../hooks/useStudent";
import {
  addQuestionMarkTotal,
  convertToPercentage,
  countCorrectAnswers,
  sortQuestionsByNumber,
} from "../constant";
import Prompt from "../../../../components/modals/prompt";
import Objective from "./objective";
import Theory from "./theory";
import { useSubject } from "../../../../hooks/useSubjects";
import { useStudentAssignments } from "../../../../hooks/useStudentAssignment";
import ButtonGroup from "../../../../components/buttons/button-group";
// import styles from "../../../../assets/scss/pages/dashboard/studentAssignment.module.scss";

const ViewLessonNote = ({
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
}) => {
  const {
    updateActiveTabFxn,
    classSubjects,
    apiServices,
    errorHandler,
    permission,
    user,

    answeredQuestion,
    myStudents,
    subjectsByTeacher,
  } = useAssignments();

  const { studentByClass2 } = useStudentAssignments();

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

  const { subjects, isLoading: subjectLoading } = useSubject();

  // const queryClient = useQueryClient();

  const activateRetrieve = () => {
    if (
      week !== "" &&
      subject !== "" &&
      // question_type !== "" &&
      student !== ""
    ) {
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
    if (!week || !student_id || !question_type || !subject_id) {
      return false;
    } else {
      return true;
    }
  };

  /////// FETCH ANSWERED OBJECTIVE ASSIGNMENTS /////
  const {
    isLoading: submittedObjAssignmentLoading,
    refetch: refetchSubmittedObjAssignment,
    data: submittedObjAssignment,
    // isFetching: submittedAssignmentFetching,
    // isRefetching: submittedAssignmentRefetching,
  } = useQuery(
    [
      queryKeys.GET_SUBMITTED_ASSIGNMENT,
      user?.period,
      user?.term,
      user?.session,
      "objective",
      week,
    ],
    () =>
      apiServices.getSubmittedAssignment(
        user?.period,
        user?.term,
        user?.session,
        "objective",
        week
      ),
    {
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      // refetchOnMount: true,
      // refetchOnWindowFocus: false,
      // refetchOnReconnect: false,
      // refetchInterval: false,
      // refetchIntervalInBackground: false,
      enabled: activateRetrieve() && permission?.submissions,
      // enabled: false,
      select: (data) => {
        const ffk = apiServices.formatData(data);

        const sorted = ffk
          ?.filter(
            (dt) => dt?.subject === subject && dt?.student === student
            // &&
            // dt?.week === week
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

        // console.log({ ffk, data, sorted });

        return sorted;
      },

      onSuccess(data) {
        // trigger();
      },
      onError(err) {
        errorHandler(err);
      },
      // select: apiServices.formatData,
    }
  );
  /////// FETCH ANSWERED THEORY ASSIGNMENTS /////
  const {
    isLoading: submittedTheoAssignmentLoading,
    refetch: refetchSubmittedTheoAssignment,
    data: submittedTheoAssignment,
    // isFetching: submittedAssignmentFetching,
    // isRefetching: submittedAssignmentRefetching,
  } = useQuery(
    [
      queryKeys.GET_SUBMITTED_ASSIGNMENT,
      user?.period,
      user?.term,
      user?.session,
      "theory",
      week,
    ],
    () =>
      apiServices.getSubmittedAssignment(
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

      // enabled: permission?.read || permission?.readClass,
      enabled: activateRetrieve() && permission?.submissions,
      select: (data) => {
        const ffk = apiServices.formatData(data);

        const sorted = ffk
          ?.filter(
            (dt) => dt?.subject === subject && dt?.student === student
            // &&
            // dt?.week === week
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

        // console.log({ ffk, data, sorted });

        return sorted;
      },

      onSuccess(data) {
        // trigger();
      },
      onError(err) {
        errorHandler(err);
      },
      // select: apiServices.formatData,
    }
  );

  /////// FETCH MARKED ASSIGNMENT /////
  const {
    isLoading: markedAssignmentLoading,
    refetch: refetchMarkedAssignment,
    data: markedAssignment,
  } = useQuery(
    [
      queryKeys.GET_MARKED_ASSIGNMENT,
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
      enabled: activateRetrieve() && permission?.submissions,
      // enabled: false,

      select: (data) => {
        const hhk = apiServices.formatData(data);

        const sorted = hhk
          ?.filter(
            (dt) =>
              dt?.subject_id === subject_id &&
              Number(dt?.student_id) === Number(student_id) &&
              dt?.week === week
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

        // console.log({ hhk, data, sorted });

        return sorted ?? [];
      },

      onSuccess(data) {
        trigger();
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

  const correctCount = countCorrectAnswers(answeredObjQ ?? []);
  // const correctCount2 = analyzeQuestions(answeredObjQ);

  const showNoAssignment = () => {
    if (submissionTab === "1" && answeredObjQ?.length === 0) {
      return true;
    } else if (submissionTab === "2" && answeredTheoQ?.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  const showNoAssignment2 = () => {
    if (submissionTab === "1" && answeredObjQ?.length === 0) {
      return true;
    } else if (submissionTab === "2" && answeredTheoQ?.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  const showNoAssignment3 = () => {
    if (!week || !subject || !student) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (subjectsByTeacher?.length > 0) {
      const sbb2 = subjectsByTeacher[0]?.title?.map((sb) => {
        // const subId = subjects?.find((ob) => ob.subject === sb.name)?.id;

        return {
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
    setAnsweredObjQ(submittedObjAssignment);
    setAnsweredTheoQ(submittedTheoAssignment);
  }, [submittedObjAssignment, submittedTheoAssignment, week, subject, student]);

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

    if (answeredObjQ?.length >= 1 && answeredTheoQ?.length >= 1) {
      return [objectiveTab, theoryTab];
    } else if (answeredObjQ?.length >= 1) {
      return [objectiveTab];
    } else if (answeredTheoQ?.length >= 1) {
      return [theoryTab];
    }

    return [];
  };

  // console.log({
  //   answeredObjQ,
  // });

  // const allLoading = showLoading || assignmentLoading;
  const allLoading =
    submittedObjAssignmentLoading ||
    submittedTheoAssignmentLoading ||
    markedAssignmentLoading ||
    loading1;

  const allLoadingObj = submittedObjAssignmentLoading;

  const allLoadingTheo =
    submittedTheoAssignmentLoading || markedAssignmentLoading || loading1;

  const theoScore = answeredTheoQ?.reduce(
    (acc, quest) => acc + Number(quest?.question_mark),
    0
  );

  const objScore = answeredObjQ?.reduce(
    (acc, quest) => acc + Number(quest?.question_mark),
    0
  );

  const trigger = () => {
    setLoading1(true);
    setTimeout(() => {
      setLoading1(false);
    }, 1000);
  };

  useEffect(() => {
    trigger();
    if (answeredTheoQ?.length >= 1) {
      setSubmissionTab("2");
    } else {
      setSubmissionTab("1");
    }
  }, [subject, week, student]);

  // console.log({ answeredObjQ, answeredTheoQ, submissionTab });

  return (
    <div>
      <div className={styles.created}>
        <div className='d-flex flex-column gap-4 flex-lg-row justify-content-lg-between '>
          <div className='d-flex flex-column gap-4 flex-sm-row flex-grow-1 '>
            <AuthSelect
              sort
              options={[
                { value: "1", title: "Week 1" },
                { value: "2", title: "Week 2" },
                { value: "3", title: "Week 3" },
                { value: "4", title: "Week 4" },
                { value: "5", title: "Week 5" },
                { value: "6", title: "Week 6" },
                { value: "7", title: "Week 7" },
                { value: "8", title: "Week 8" },
                { value: "9", title: "Week 9" },
                { value: "10", title: "Week 10" },
                { value: "11", title: "Week 11" },
                { value: "12", title: "Week 12" },
                { value: "13", title: "Week 13" },
              ]}
              value={week}
              // defaultValue={week && week}
              onChange={({ target: { value } }) => {
                setAnswerQ((prev) => {
                  return { ...prev, week: value };
                });
                // refetchMarkedAssignment();
                setMarkedTheoQ([]);
                setMarkedTheoQ2([]);
              }}
              placeholder='Select Week'
              wrapperClassName='w-100'
            />
            <AuthSelect
              sort
              options={newSubjects}
              value={subject}
              // defaultValue={subject && subject}
              onChange={({ target: { value } }) => {
                const fId = () => {
                  const ff = subjects?.find((opt) => opt.subject === value);
                  if (ff) {
                    return ff?.id?.toString();
                  }
                };

                setAnswerQ((prev) => {
                  return { ...prev, subject: value, subject_id: fId() };
                });
                // refetchMarkedAssignment();
                setMarkedTheoQ([]);
                setMarkedTheoQ2([]);
              }}
              placeholder='Select Subject'
              wrapperClassName='w-100'
              // label="Subject"
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
                setAnswerQ((prev) => {
                  return { ...prev, question_type: value };
                });
                // refetchMarkedAssignment();
                setMarkedTheoQ([]);
                setMarkedTheoQ2([]);

              
              }}
              placeholder='Question Type'
              wrapperClassName='w-100'
            /> */}

            <AuthSelect
              sort
              options={myStudents}
              value={student}
              // defaultValue={student && student}
              onChange={({ target: { value } }) => {
                const fId = () => {
                  const ff = myStudents?.find((opt) => opt.value === value);
                  if (ff) {
                    return ff?.id?.toString();
                  }
                };
                //
                setAnswerQ((prev) => {
                  return { ...prev, student: value, student_id: fId() };
                });
                // refetchMarkedAssignment();
                setMarkedTheoQ([]);
                setMarkedTheoQ2([]);
              }}
              placeholder='Select Student'
              wrapperClassName='w-100'
              // label="Subject"
            />
          </div>
        </div>

        <div className='w-100 d-flex justify-content-center mt-4'>
          <ButtonGroup options={optionTabShow()} />
        </div>

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
              <MdOutlineLibraryBooks className={styles.icon} />
              <p className='fs-1 fw-bold mt-3'>No Submission</p>
            </div>
          )}

        {!allLoading && answeredObjQ?.length >= 1 && submissionTab === "1" && (
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
              refetchMarkedAssignment={refetchSubmittedObjAssignment}
            />
          </div>
        )}

        {!allLoading && answeredTheoQ?.length >= 1 && submissionTab === "2" && (
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
    </div>
  );
};

export default ViewLessonNote;
