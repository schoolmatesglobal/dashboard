import React, { useState } from "react";
import { MdOutlineLibraryBooks } from "react-icons/md";
import AuthSelect from "../../../../components/inputs/auth-select";
import styles from "../../../../assets/scss/pages/dashboard/assignment.module.scss";
import {useAssignments}  from "../../../../hooks/useAssignments";
import { useQuery, useQueryClient } from "react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "reactstrap";
import queryKeys from "../../../../utils/queryKeys";
import { useAcademicSession } from "../../../../hooks/useAcademicSession";
import { useStudent } from "../../../../hooks/useStudent";
import {
  addQuestionMarkTotal, convertToPercentage,
  countCorrectAnswers,
  sortQuestionsByNumber
} from "../constant";
import Prompt from "../../../../components/modals/prompt";
import Objective from "./objective";
import Theory from "./theory";
// import styles from "../../../../assets/scss/pages/dashboard/studentAssignment.module.scss";

const Submission = () => {
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
    answeredObjectiveQ,
    answeredTheoryQ,
    // markedObjectiveQ,
    // markedObjectiveQ2,
    // markedTheoryQ,
    // markedTheoryQ2,
    //
  } = useAssignments();

  // const sessions = useAcademicSession();

  // const { studentByClassAndSession } = useStudent();

  const {
    question_type,
    subject,
    // image,
    // term,
    // period,
    // session,
    subject_id,
    student_id,
    week,
    student,
  } = answeredQuestion;

  const [showLoading, setShowLoading] = useState(false);

  const [loginPrompt, setLoginPrompt] = useState(false);

  // const queryClient = useQueryClient();

  const activateRetrieve = () => {
    if (subject !== "" && question_type !== "" && student !== "") {
      return true;
    } else {
      return false;
    }
  };

  /////// FETCH ANSWERED ASSIGNMENTS /////
  const {
    isLoading: submittedAssignmentLoading,
    refetch: refetchSubmittedAssignment,
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
      onSuccess(data) {
        const sortedBySubject = data?.filter(
          (dt) => Number(dt?.subject_id) === subject_id
        );
        const sortByStudent = sortedBySubject?.filter(
          (st) => st?.student === student
        );
        const sortByWeek = sortByStudent?.filter(
          (st) => Number(st?.week) === Number(week)
        );

        const sortedByQN = sortQuestionsByNumber(sortByWeek);

        // const calculatedData = analyzeQuestions(sortedByQN);

        // console.log({ sortByStudent, student });

        // const sortByStudent = sortedData
        // console.log({ sortByStudent });
        if (question_type === "objective") {
          updateAnsweredObjectiveQFxn(sortedByQN);
        } else if (question_type === "theory") {
          updateAnsweredTheoryQFxn(sortedByQN);
        }
      },
      onError(err) {
        errorHandler(err);
      },
      select: apiServices.formatData,
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
      enabled: activateRetrieve() && permission?.submissions,
      // enabled: false,
      onSuccess(data) {
        // console.log({ rdata: data });
        const sortedBySubject = data?.filter(
          (dt) => Number(dt?.subject_id) === subject_id
        );

        const sortedByQN = sortQuestionsByNumber(sortedBySubject);

        if (question_type === "objective" && sortedByQN.length > 0) {
          resetMarkedObjectiveAnsFxn();
          loadMarkedObjectiveAnsFxn(sortedByQN);
          updateObjectiveMarkedFxn(true);
        } else if (question_type === "objective" && sortedByQN.length === 0) {
          updateObjectiveMarkedFxn(false);
        } else if (question_type === "theory" && sortedByQN.length > 0) {
          resetMarkedTheoryAnsFxn();
          loadMarkedTheoryAnsFxn(sortedByQN);
          updateTheoryMarkedFxn(true);
        } else if (question_type === "theory" && sortedByQN.length === 0) {
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

  const correctCount = countCorrectAnswers(answeredObjectiveQ);
  // const correctCount2 = analyzeQuestions(answeredObjectiveQ);

  const showNoAssignment = () => {
    if (question_type === "objective" && answeredObjectiveQ.length === 0) {
      return true;
    } else if (question_type === "theory" && answeredTheoryQ.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  const showNoAssignment2 = () => {
    if (question_type === "" && answeredObjectiveQ.length === 0) {
      return true;
    } else if (question_type === "" && answeredTheoryQ.length === 0) {
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

  // console.log({
  //   answeredObjectiveQ,
  // });

  console.log({
    answeredTheoryQ,
    answeredObjectiveQ,
  });

  // const allLoading = showLoading || assignmentLoading;
  const allLoading =
    showLoading || submittedAssignmentLoading || markedAssignmentLoading;

  const totalMarks =
    answeredObjectiveQ[answeredObjectiveQ?.length - 1]?.question_mark *
    answeredObjectiveQ?.length;
  const totalMarks2 = addQuestionMarkTotal(answeredTheoryQ);
  const score = `${
    correctCount *
    answeredObjectiveQ[answeredObjectiveQ?.length - 1]?.question_mark
  } /
      ${
        answeredObjectiveQ[answeredObjectiveQ?.length - 1]?.total_question *
        answeredObjectiveQ[answeredObjectiveQ?.length - 1]?.question_mark
      }`;
  const percentage = convertToPercentage(score);

  // console.log({ markedTheoryQ2 });

  return (
    <div>
      <div className={styles.created}>
        <div className={styles.created__options}>
          <div className={styles.auth_select_container}>
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
                resetObjectiveMarkFxn();
                resetTheoryMarkFxn();
                resetMarkedObjectiveAnsFxn();
                resetMarkedTheoryAnsFxn();
                updateAnsweredQuestionFxn({
                  week: value,
                });
                if (subject !== "" && question_type !== "" && student !== "") {
                  setShowLoading(true);
                  setTimeout(() => {
                    setShowLoading(false);
                  }, 1500);
                  refetchSubmittedAssignment();
                  refetchMarkedAssignment();
                }
              }}
              placeholder="Week"
              wrapperClassName={styles.auth_select}
            />
            <AuthSelect
              sort
              options={classSubjects}
              value={subject}
              defaultValue={subject && subject}
              onChange={({ target: { value } }) => {
                // updatePreviewAnswerFxn({
                //   he: "help",
                // });
                //
                resetObjectiveMarkFxn();
                resetTheoryMarkFxn();
                resetMarkedObjectiveAnsFxn();
                resetMarkedTheoryAnsFxn();
                updateAnsweredQuestionFxn({
                  subject: value,
                  subject_id: findSubjectId(value),
                });
                if (question_type !== "" && week !== "" && student !== "") {
                  setShowLoading(true);
                  setTimeout(() => {
                    setShowLoading(false);
                  }, 1500);
                  refetchSubmittedAssignment();
                  refetchMarkedAssignment();
                }
              }}
              placeholder="Select Subject"
              wrapperClassName={styles.auth_select}
              // label="Subject"
            />

            <AuthSelect
              sort
              options={[
                { value: "objective", title: "Objective" },
                { value: "theory", title: "Theory" },
              ]}
              value={question_type}
              defaultValue={question_type && question_type}
              onChange={({ target: { value } }) => {
                resetObjectiveMarkFxn();
                resetTheoryMarkFxn();
                resetMarkedObjectiveAnsFxn();
                resetMarkedTheoryAnsFxn();
                updateAnsweredQuestionFxn({
                  question_type: value,
                });
                if (subject !== "" && week !== "" && student !== "") {
                  setShowLoading(true);
                  setTimeout(() => {
                    setShowLoading(false);
                  }, 1500);
                  refetchSubmittedAssignment();
                  refetchMarkedAssignment();
                }
              }}
              placeholder="Question Type"
              wrapperClassName={styles.auth_select}
            />

            <AuthSelect
              sort
              options={myStudents}
              value={student}
              defaultValue={student && student}
              onChange={({ target: { value } }) => {
                //
                resetObjectiveMarkFxn();
                resetTheoryMarkFxn();
                resetMarkedObjectiveAnsFxn();
                resetMarkedTheoryAnsFxn();
                updateAnsweredQuestionFxn({
                  student: value,
                  student_id: findStudentId(value),
                  // subject_id: findSubjectId(value),
                });
                if (subject !== "" && week !== "" && student !== "") {
                  setShowLoading(true);
                  setTimeout(() => {
                    setShowLoading(false);
                  }, 1500);
                  refetchSubmittedAssignment();
                  refetchMarkedAssignment();
                }
              }}
              placeholder="Select Student"
              wrapperClassName={styles.auth_select}
              // label="Subject"
            />
          </div>
          <div className="">
            <button
              type="button"
              className="btn go-back-button"
              // style={{ height: "50px" }}
              onClick={() => updateActiveTabFxn("1")}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back to
              Create
            </button>
          </div>
        </div>

        {allLoading && (
          <div className={styles.spinner_container}>
            <Spinner /> <p className="">Loading...</p>
          </div>
        )}

        {!allLoading && (showNoAssignment() || showNoAssignment2()) && (
          <div className={styles.placeholder_container}>
            <MdOutlineLibraryBooks className={styles.icon} />
            <p className={styles.heading}>No Submission</p>
          </div>
        )}

        {!allLoading &&
          answeredObjectiveQ.length >= 1 &&
          question_type === "objective" && (
            <div className="">
              {/* <div className={styles.compile_student}>
                <p className={styles.compile_student_name}>
                  {answeredObjectiveQ[answeredObjectiveQ?.length - 1]?.student}
                  'S OBJECTIVE SUBMISSION
                </p>
              </div> */}
              <div className={styles.compile_row}>
                {/* total marks */}
                <div className={styles.compile_container}>
                  <p className={styles.compile_tag}>Total Marks</p>
                  <div className={styles.compile_box}>
                    <p className={styles.compile_score}>{totalMarks}</p>
                  </div>
                </div>
                {/* score */}
                {/* <div className={styles.compile_container}>
                  <p className={styles.compile_tag}>Score</p>
                  <div className={styles.compile_box}>
                    <p className={styles.compile_score}>{score}</p>
                  </div>
                </div> */}
                {/* percentage */}
                {/* <div className={styles.compile_container}>
                  <p className={styles.compile_tag}>Percentage</p>
                  <div className={styles.compile_box}>
                    <p className={styles.compile_score}>{percentage}</p>
                  </div>
                </div> */}
                {/* grade */}
                {/* <div className={styles.compile_container}>
                  <p className={styles.compile_tag}>Grade</p>
                  <div className={styles.compile_box}>
                    <p className={styles.compile_score}>3 / 5</p>
                  </div>
                </div> */}
              </div>
              <Objective
                assignmentLoading={allLoading}
                data={answeredObjectiveQ}
                refetchMarkedAssignment={refetchMarkedAssignment}
              />
            </div>
          )}

        {!allLoading &&
          answeredTheoryQ.length >= 1 &&
          question_type === "theory" && (
            <div className="">
              {/* <div className={styles.compile_student}>
                <p className={styles.compile_student_name}>
                  {answeredTheoryQ[answeredTheoryQ?.length - 1]?.student}
                  'S THEORY SUBMISSION
                </p>
              </div> */}
              <div className={styles.compile_row}>
                {/* total marks */}
                <div className={styles.compile_container}>
                  <p className={styles.compile_tag}>Total Marks</p>
                  <div className={styles.compile_box}>
                    <p className={styles.compile_score}>{totalMarks2}</p>
                  </div>
                </div>
              </div>

              <Theory
                refetchMarkedAssignment={refetchMarkedAssignment}
                assignmentLoading={allLoading}
                data={answeredTheoryQ}
              />
            </div>
          )}
      </div>
      {/* <div className="d-flex justify-content-center ">
        <ButtonGroup options={buttonOptions2} />
      </div> */}
      <Prompt
        isOpen={loginPrompt}
        toggle={() => setLoginPrompt(!loginPrompt)}
        hasGroupedButtons={true}
        groupedButtonProps={buttonOptions}
        singleButtonText="Preview"
        promptHeader={` CONFIRM RESULT SUBMISSION `}
      ></Prompt>
    </div>
    // <PageView
    //   canCreate={false}
    //   selectValue={sortBy}
    //   isLoading={allLoading}
    //   columns={[
    //     {
    //       Header: "id",
    //       accessor: "id",
    //     },
    //     {
    //       Header: "Class Name",
    //       accessor: "class_name",
    //     },
    //     {
    //       Header: "Sub Classes",
    //       accessor: "sub_class",
    //     },
    //   ]}
    // />
  );
};

export default Submission;
