import React, { useState } from "react";
import { MdOutlineLibraryBooks } from "react-icons/md";
import AuthSelect from "../../../../components/inputs/auth-select";
import styles from "../../../../assets/scss/pages/dashboard/assignment.module.scss";
import {useAssignments} from "../../../../hooks/useAssignments";
import { useQuery } from "react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "reactstrap";
import queryKeys from "../../../../utils/queryKeys";
import SubmissionTable from "../../../../components/tables/submission-table";
import {
  addQuestionMarkTotal,
  addSumMark,
  analyzeQuestions,
  convertToPercentage,
  countCorrectAnswers, updateQuestionNumbers
} from "../constant";
import Prompt from "../../../../components/modals/prompt";
import { useStudentAssignments } from "../../../../hooks/useStudentAssignment";

const StudentResults = () => {
  const { updateActiveTabFxn } = useAssignments();

  const {
    apiServices,
    errorHandler,
    permission,
    user,
    studentSubjects,

    // STUDENTS RESULT
    updateMarkedQuestionFxn,
    //
    updateAnsweredObjResultsFxn,
    //
    updateAnsweredTheoryResultsFxn,
    //
    markedQuestion,
    //
    answeredObjResults,
    //
    answeredTheoryResults,
    //
  } = useStudentAssignments();

  const {
    question_type,
    subject,
    // image,
    // term,
    // period,
    // session,
    subject_id,
    // student_id,
    week,
    // student,
  } = markedQuestion;

  const [showLoading, setShowLoading] = useState(false);

  const [loginPrompt, setLoginPrompt] = useState(false);

  // const queryClient = useQueryClient();

  const activateRetrieve = () => {
    if (subject !== "" && question_type !== "" && week !== "") {
      return true;
    } else {
      return false;
    }
  };

  ///// FETCH MARKED QUESTIONS //////
  const {
    isLoading: markedAssignmentResultsLoading,
    refetch: refetchMarkedAssignmentResults,
  } = useQuery(
    [
      queryKeys.GET_MARKED_ASSIGNMENT_FOR_RESULTS,
      user?.period,
      user?.term,
      user?.session,
      question_type,
    ],
    () =>
      apiServices.getMarkedAssignment(
        user?.period,
        user?.term,
        user?.session,
        question_type
      ),
    {
      retry: 3,
      // enabled: permission?.read || permission?.readClass,
      enabled: activateRetrieve() && permission?.student_results,
      // enabled: false,
      onSuccess(data) {
        // console.log({ dataR: data });
        const sortedBySubject = data?.filter(
          (dt) => Number(dt?.subject_id) === Number(subject_id)
        );
        const sortByStudent = sortedBySubject?.filter(
          (st) => Number(st?.student_id) === Number(user?.id)
        );
        const sortByWeek = sortByStudent?.filter(
          (st) => Number(st?.week) === Number(week)
        );

        // const sortedByQN = sortQuestionsByNumber(sortByStudent);

        const computedTeacherMark = addSumMark(sortByWeek);

        // updateAnsweredTheoryQFxn(computedTeacherMark);

        const calculatedData = analyzeQuestions(sortByWeek);

        console.log({ data, sortByStudent, sortByWeek });
        // console.log({
        //   data,
        //   subject_id,
        //   student_id,
        //   question_type,
        //   sortByStudent,
        // });

        if (question_type === "objective") {
          updateAnsweredObjResultsFxn(calculatedData?.questions);
        } else if (question_type === "theory") {
          updateAnsweredTheoryResultsFxn(computedTeacherMark);
        }
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

  const correctCount = countCorrectAnswers(answeredObjResults);
  // const correctCount2 = analyzeQuestions(answeredObjectiveQ);

  const showNoAssignment = () => {
    if (question_type === "objective" && answeredObjResults.length === 0) {
      return true;
    } else if (
      question_type === "theory" &&
      answeredTheoryResults.length === 0
    ) {
      return true;
    } else {
      return false;
    }
  };

  const showNoAssignment2 = () => {
    if (question_type === "" && answeredObjResults.length === 0) {
      return true;
    } else if (question_type === "" && answeredTheoryResults.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  const findSubjectId = (value) => {
    const findObject = studentSubjects?.find((opt) => opt.value === value);
    if (findObject) {
      return findObject.id;
    }
  };

  // const studentName = (value) => {
  //   const findObject = studentSubjects?.find((opt) => opt.id === value);
  //   if (findObject) {
  //     return findObject.id;
  //   }
  // };

  // console.log({
  //   answeredObjectiveQ,
  // });

  // const allLoading = showLoading || submittedAssignmentLoading;
  const allLoading = showLoading || markedAssignmentResultsLoading;

  // const totalMark = findHighestTotalMark(answeredTheoryQ);

  const totalMarks =
    answeredObjResults[answeredObjResults?.length - 1]?.question_mark *
    answeredObjResults?.length;
  const totalMarks2 = addQuestionMarkTotal(answeredTheoryResults);
  const score2 = `${
    answeredTheoryResults[answeredTheoryResults?.length - 1]?.sum_mark
  } /
      ${totalMarks2}`;
  const score = `${
    correctCount *
    answeredObjResults[answeredObjResults?.length - 1]?.question_mark
  } /
      ${totalMarks}`;
  const percentage = parseFloat(convertToPercentage(score));
  const percentage2 = parseFloat(convertToPercentage(score2));

  // const studentId =
  //   answeredTheoryResults[answeredTheoryResults?.length - 1]?.student_id;

  // console.log({
  //   ar: activateRetrieve(),
  //   markedQuestion,
  //   answeredObjResults,
  //   answeredTheoryResults,
  // });

  // console.log({ answeredTheoryQ, markedQuestion, totalMarks2 });
  console.log({ markedQuestion });

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
              defaultValue={week && week}
              onChange={({ target: { value } }) => {
                updateMarkedQuestionFxn({
                  week: value,
                });
                if (subject !== "" && question_type !== "") {
                  setShowLoading(true);
                  setTimeout(() => {
                    setShowLoading(false);
                  }, 1500);
                  refetchMarkedAssignmentResults();
                }
              }}
              placeholder="Week"
              wrapperClassName={styles.auth_select}
            />

            <AuthSelect
              sort
              options={studentSubjects}
              value={subject}
              defaultValue={subject && subject}
              onChange={({ target: { value } }) => {
                // updatePreviewAnswerFxn({
                //   he: "help",
                // });
                //
                updateMarkedQuestionFxn({
                  subject: value,
                  subject_id: Number(findSubjectId(value)),
                });
                if (question_type !== "" && week !== "") {
                  setShowLoading(true);
                  setTimeout(() => {
                    setShowLoading(false);
                  }, 1500);
                  // refetchSubmittedAssignment();

                  refetchMarkedAssignmentResults();
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
                updateMarkedQuestionFxn({
                  question_type: value,
                });
                if (subject !== "" && week !== "") {
                  setShowLoading(true);
                  setTimeout(() => {
                    setShowLoading(false);
                  }, 1500);
                  // refetchSubmittedAssignment();
                  refetchMarkedAssignmentResults();
                }
              }}
              placeholder="Question Type"
              wrapperClassName={styles.auth_select}
            />
          </div>
          <div className="">
            <button
              type="button"
              className="btn go-back-button"
              // style={{ height: "50px" }}
              onClick={() => updateActiveTabFxn("5")}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back to
              View
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
            <p className={styles.heading}>No Result</p>
          </div>
        )}

        {!allLoading &&
          answeredObjResults.length >= 1 &&
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
                {/* <div className={styles.compile_container}>
                  <p className={styles.compile_tag}>Total Marks</p>
                  <div className={styles.compile_box}>
                    <p className={styles.compile_score}>{totalMarks}</p>
                  </div>
                </div> */}
                {/* score */}
                <div className={styles.compile_container}>
                  <p className={styles.compile_tag}>Score</p>
                  <div className={styles.compile_box}>
                    <p className={styles.compile_score}>{score}</p>
                  </div>
                </div>
                {/* percentage */}
                <div className={styles.compile_container}>
                  <p className={styles.compile_tag}>Percentage</p>
                  <div className={styles.compile_box}>
                    <p className={styles.compile_score}>{percentage}%</p>
                  </div>
                </div>
                {/* grade */}
                {/* <div className={styles.compile_container}>
                <p className={styles.compile_tag}>Grade</p>
                <div className={styles.compile_box}>
                  <p className={styles.compile_score}>3 / 5</p>
                </div>
              </div> */}
              </div>
              <SubmissionTable
                centered
                isLoading={allLoading}
                // onRowStatusToggle={async (data) => await onStatusToggle(data)}
                // onRowUpdate={(id) => navigate(`${location.pathname}/edit/${id}`)}
                // onRowDelete={async (data) => await onDelete(data)}
                rowHasView={true}
                columns={[
                  {
                    Header: "Question Type",
                    accessor: "question_type",
                  },
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
                data={updateQuestionNumbers(answeredObjResults)}
              />
            </div>
          )}

        {!allLoading &&
          answeredTheoryResults.length >= 1 &&
          question_type === "theory" && (
            <div className="">
              {/* <div className={styles.compile_student}>
                <p className={styles.compile_student_name}>
                  {findStudentId2(studentId)}
                  'S THEORY SUBMISSION
                </p>
              </div> */}
              <div className={styles.compile_row}>
                {/* total marks */}
                {/* <div className={styles.compile_container}>
                  <p className={styles.compile_tag}>Total Marks</p>
                  <div className={styles.compile_box}>
                    <p className={styles.compile_score}>{totalMarks2}</p>
                  </div>
                </div> */}
                {/* score */}
                <div className={styles.compile_container}>
                  <p className={styles.compile_tag}>Score</p>
                  <div className={styles.compile_box}>
                    <p className={styles.compile_score}>{score2}</p>
                  </div>
                </div>
                {/* percentage */}
                <div className={styles.compile_container}>
                  <p className={styles.compile_tag}>Percentage</p>
                  <div className={styles.compile_box}>
                    <p className={styles.compile_score}>{percentage2}%</p>
                  </div>
                </div>
                {/* grade */}
                {/* <div className={styles.compile_container}>
                <p className={styles.compile_tag}>Grade</p>
                <div className={styles.compile_box}>
                  <p className={styles.compile_score}>3 / 5</p>
                </div>
              </div> */}
              </div>
              <SubmissionTable
                // updatePreviewAnswerFxn={updatePreviewAnswerFxn}
                // previewAnswer={previewAnswer}
                centered
                isLoading={allLoading}
                // onRowStatusToggle={async (data) => await onStatusToggle(data)}
                // onRowUpdate={(id) => navigate(`${location.pathname}/edit/${id}`)}
                // onRowDelete={async (data) => await onDelete(data)}
                rowHasView={true}
                columns={[
                  {
                    Header: "Question Type",
                    accessor: "question_type",
                  },
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
                data={updateQuestionNumbers(answeredTheoryResults)}
              />
            </div>
          )}
      </div>
      <Prompt
        isOpen={loginPrompt}
        toggle={() => setLoginPrompt(!loginPrompt)}
        hasGroupedButtons={true}
        groupedButtonProps={buttonOptions}
        singleButtonText="Preview"
        promptHeader={` CONFIRM RESULT SUBMISSION `}
      ></Prompt>
    </div>
  );
};

export default StudentResults;
