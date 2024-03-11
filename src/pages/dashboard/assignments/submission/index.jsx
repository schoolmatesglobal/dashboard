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
// import styles from "../../../../assets/scss/pages/dashboard/studentAssignment.module.scss";

const Submission = ({
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
}) => {
  const {
    updateActiveTabFxn,
    classSubjects,
    apiServices,
    errorHandler,
    permission,
    user,
    // sortBy,
    // setSortBy,
    // sorted,
    // setSorted,
    // indexStatus,
    // setIndexStatus,
    // questionType,
    // subjects,
    // handleSortBy,
    // updateCreateQ,
    // updateCreatedQ,
    // updateObjectiveQs,
    // updateTheoryQs,
    // createQuestion,
    // createdQuestion,
    // ObjectiveQuestions,
    // TheoryQuestions,
    // ObjectiveQ,
    // TheoryQ,
    answeredQuestion,
    myStudents,
    // updatePreviewAnswerFxn,
    // previewAnswer,
    // submittedQuestion,
    // markedQuestion,
    // updateMarkedQuestionFxn,
    // updateSubmittedQuestionFxn,
    // submitMarkedTheoryAssignment,
    // submitMarkedTheoryAssignmentLoading,
    // theoryMarked,

    // SUBMISSION
    updateAnsweredQuestionFxn,
    //
    updateAnsweredObjectiveQFxn,
    // emptyAnsweredObjectiveQFxn,
    //
    updateAnsweredTheoryQFxn,
    // emptyAnsweredTheoryQFxn,
    //
    // addObjectiveMarkFxn,
    resetObjectiveMarkFxn,
    //
    // addTheoryMarkFxn,
    resetTheoryMarkFxn,
    //
    loadMarkedObjectiveAnsFxn,
    resetMarkedObjectiveAnsFxn,
    //
    loadMarkedTheoryAnsFxn,
    resetMarkedTheoryAnsFxn,
    //
    updateTheoryMarkedFxn,
    updateObjectiveMarkedFxn,
    //
    // answeredObjQ,
    // answeredTheoQ,
  } = useAssignments();

  // const sessions = useAcademicSession();

  // const { studentByClassAndSession } = useStudent();

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
      question_type !== "" &&
      student !== ""
    ) {
      return true;
    } else {
      return false;
    }
  };

  /////// FETCH ANSWERED ASSIGNMENTS /////
  const {
    isLoading: submittedAssignmentLoading,
    refetch: refetchSubmittedAssignment,
    data: submittedAssignment,
  } = useQuery(
    [
      queryKeys.GET_SUBMITTED_ASSIGNMENT,
      user?.period,
      user?.term,
      user?.session,
      question_type,
    ],
    () =>
      apiServices.getSubmittedAssignment(
        user?.period,
        user?.term,
        user?.session,
        question_type
      ),
    {
      retry: 3,
      // enabled: permission?.read || permission?.readClass,
      enabled: activateRetrieve() && permission?.submissions,
      select: (data) => {
        const ffk = apiServices.formatData(data);

        const sorted = ffk
          ?.filter(
            (dt) =>
              dt?.subject === subject &&
              dt?.student === student &&
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

        console.log({ ffk, data, sorted });

        return sorted;
      },

      onSuccess(data) {
        // const sortedBySubject = data?.filter(
        //   (dt) => Number(dt?.subject_id) === subject_id
        // );
        // const sortByStudent = sortedBySubject?.filter(
        //   (st) => st?.student === student
        // );
        // const sortByWeek = sortByStudent?.filter(
        //   (st) => Number(st?.week) === Number(week)
        // );
        // const sortedByQN = sortQuestionsByNumber(sortByWeek);
        // if (question_type === "objective") {
        //   updateAnsweredObjectiveQFxn(sortedByQN);
        // } else if (question_type === "theory") {
        //   updateAnsweredTheoryQFxn(sortedByQN);
        // }
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
  } = useQuery(
    [
      queryKeys.GET_MARKED_ASSIGNMENT,
      student_id,
      user?.period,
      user?.term,
      user?.session,
      question_type,
    ],
    () =>
      apiServices.getMarkedAssignmentByStudentId(
        student_id,
        user?.period,
        user?.term,
        user?.session,
        question_type
      ),
    {
      retry: 3,
      // enabled: permission?.read || permission?.readClass,
      enabled: false,
      // enabled: activateRetrieve() && permission?.submissions,
      // enabled: false,
      onSuccess(data) {
        // console.log({ rdata: data });
        const sortedBySubject = data?.filter(
          (dt) => Number(dt?.subject_id) === subject_id
        );

        const sortedByQN = sortQuestionsByNumber(sortedBySubject);

        if (question_type === "objective" && sortedByQN?.length > 0) {
          resetMarkedObjectiveAnsFxn();
          loadMarkedObjectiveAnsFxn(sortedByQN);
          updateObjectiveMarkedFxn(true);
        } else if (question_type === "objective" && sortedByQN?.length === 0) {
          updateObjectiveMarkedFxn(false);
        } else if (question_type === "theory" && sortedByQN?.length > 0) {
          resetMarkedTheoryAnsFxn();
          loadMarkedTheoryAnsFxn(sortedByQN);
          updateTheoryMarkedFxn(true);
        } else if (question_type === "theory" && sortedByQN?.length === 0) {
          updateTheoryMarkedFxn(false);
        }

        // console.log({ data, theory: sortByStudent, theoryMarked });
        console.log({ data, student_id });
      },
      onError(err) {
        errorHandler(err);
      },
      select: apiServices.formatData,
    }
  );

  // const buttonOptions2 = [
  //   {
  //     title: `${
  //       question_type === "objective"
  //         ? "Submit Objective Assignment"
  //         : question_type === "theory"
  //         ? "Submit Theory Assignment"
  //         : ""
  //     }`,
  //     onClick: () => setLoginPrompt(true),
  //     // disabled: objectiveSubmitted,
  //   },
  // ];

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
    if (question_type === "objective" && answeredObjQ?.length === 0) {
      return true;
    } else if (question_type === "theory" && answeredTheoQ?.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  const showNoAssignment2 = () => {
    if (question_type === "" && answeredObjQ?.length === 0) {
      return true;
    } else if (question_type === "" && answeredTheoQ?.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  const findSubjectId = (value) => {
    const findObject = classSubjects?.find((opt) => opt.value === value);
    if (findObject) {
      return findObject.id;
    }
  };

  const findStudentId = (value) => {
    const findObject = myStudents?.find((opt) => opt.value === value);
    if (findObject) {
      return findObject.id;
    }
  };

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
    if (question_type === "objective") {
      // setObjectiveQ(filteredAssignments);
      setAnsweredObjQ(submittedAssignment);
    } else if (question_type === "theory") {
      // setTheoryQ(filteredAssignments);
      setAnsweredTheoQ(submittedAssignment);
    }
  }, [submittedAssignment, week, subject, question_type, student]);

  // console.log({
  //   answeredObjQ,
  // });

  // const allLoading = showLoading || assignmentLoading;
  const allLoading =
    showLoading || submittedAssignmentLoading || markedAssignmentLoading;

  const theoScore = answeredTheoQ?.reduce(
    (acc, quest) => acc + Number(quest?.question_mark),
    0
  );

  const objScore = answeredObjQ?.reduce(
    (acc, quest) => acc + Number(quest?.question_mark),
    0
  );

  // const totalMarks =
  //   answeredObjQ[answeredObjQ?.length - 1]?.question_mark *
  //   answeredObjQ?.length;
  // const totalMarks2 = addQuestionMarkTotal(answeredTheoQ);
  // const score = `${
  //   correctCount *
  //   answeredObjQ[answeredObjQ?.length - 1]?.question_mark
  // } /
  //     ${
  //       answeredObjQ[answeredObjQ?.length - 1]?.total_question *
  //       answeredObjQ[answeredObjQ?.length - 1]?.question_mark
  //     }`;
  // const percentage = convertToPercentage(score);

  // console.log({ answerQ });
  console.log({
    answeredTheoQ,
    theoScore,
    answeredObjQ,
    objScore,
    submittedAssignment,
    answerQ,
  });

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
                // resetObjectiveMarkFxn();
                // resetTheoryMarkFxn();
                // resetMarkedObjectiveAnsFxn();
                // resetMarkedTheoryAnsFxn();
                // if (subject !== "" && question_type !== "" && student !== "") {
                //   setShowLoading(true);
                //   setTimeout(() => {
                //     setShowLoading(false);
                //   }, 1500);
                //   refetchSubmittedAssignment();
                //   refetchMarkedAssignment();
                // }
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
                setAnswerQ((prev) => {
                  return { ...prev, subject: value };
                });

                // resetObjectiveMarkFxn();
                // resetTheoryMarkFxn();
                // resetMarkedObjectiveAnsFxn();
                // resetMarkedTheoryAnsFxn();
                // updateAnsweredQuestionFxn({
                //   subject: value,
                //   subject_id: findSubjectId(value),
                // });
                // if (question_type !== "" && week !== "" && student !== "") {
                //   setShowLoading(true);
                //   setTimeout(() => {
                //     setShowLoading(false);
                //   }, 1500);
                //   refetchSubmittedAssignment();
                //   refetchMarkedAssignment();
                // }
              }}
              placeholder='Select Subject'
              wrapperClassName='w-100'
              // label="Subject"
            />

            <AuthSelect
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

                // resetObjectiveMarkFxn();
                // resetTheoryMarkFxn();
                // resetMarkedObjectiveAnsFxn();
                // resetMarkedTheoryAnsFxn();
                // updateAnsweredQuestionFxn({
                //   question_type: value,
                // });
                // if (subject !== "" && week !== "" && student !== "") {
                //   setShowLoading(true);
                //   setTimeout(() => {
                //     setShowLoading(false);
                //   }, 1500);
                //   refetchSubmittedAssignment();
                //   refetchMarkedAssignment();
                // }
              }}
              placeholder='Question Type'
              wrapperClassName='w-100'
            />

            <AuthSelect
              sort
              options={myStudents}
              value={student}
              // defaultValue={student && student}
              onChange={({ target: { value } }) => {
                //
                setAnswerQ((prev) => {
                  return { ...prev, student: value };
                });

                // resetObjectiveMarkFxn();
                // resetTheoryMarkFxn();
                // resetMarkedObjectiveAnsFxn();
                // resetMarkedTheoryAnsFxn();
                // updateAnsweredQuestionFxn({
                //   student: value,
                //   student_id: findStudentId(value),
                //   // subject_id: findSubjectId(value),
                // });
                // if (subject !== "" && week !== "" && student !== "") {
                //   setShowLoading(true);
                //   setTimeout(() => {
                //     setShowLoading(false);
                //   }, 1500);
                //   refetchSubmittedAssignment();
                //   refetchMarkedAssignment();
                // }
              }}
              placeholder='Select Student'
              wrapperClassName='w-100'
              // label="Subject"
            />
          </div>
        </div>

        {allLoading && (
          <div className={styles.spinner_container}>
            <Spinner /> <p className=''>Loading...</p>
          </div>
        )}

        {!allLoading && (showNoAssignment() || showNoAssignment2()) && (
          <div className={styles.placeholder_container}>
            <MdOutlineLibraryBooks className={styles.icon} />
            <p className={styles.heading}>No Submission</p>
          </div>
        )}

        {!allLoading &&
          answeredObjQ?.length >= 1 &&
          question_type === "objective" && (
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
                refetchMarkedAssignment={refetchMarkedAssignment}
              />
            </div>
          )}

        {!allLoading &&
          answeredTheoQ.length >= 1 &&
          question_type === "theory" && (
            <div className=''>
              <div className='d-flex justify-content-center align-items-center mt-5 '>
                <div className='d-flex justify-content-center align-items-center gap-3 bg-info bg-opacity-10 py-4 px-4'>
                  <p className='fs-3 fw-bold'>Total Marks:</p>
                  <p className='fs-3 fw-bold'>{theoScore} mk(s)</p>
                </div>
              </div>

              <Theory
                refetchMarkedAssignment={refetchMarkedAssignment}
                assignmentLoading={allLoading}
                data={answeredTheoQ}
                markedTheoQ={markedTheoQ}
                setMarkedTheoQ={setMarkedTheoQ}
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

export default Submission;
