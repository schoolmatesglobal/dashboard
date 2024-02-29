import React, { useState } from "react";
import { MdOutlineLibraryBooks } from "react-icons/md";
import AuthSelect from "../../../../components/inputs/auth-select";
import styles from "../../../../assets/scss/pages/dashboard/assignment.module.scss";
import  {useAssignments} from "../../../../hooks/useAssignments";
import { useMutation, useQuery, useQueryClient } from "react-query";
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
  countCorrectAnswers,
  sortQuestionsByNumber,
  updateQuestionNumbers,
} from "../constant";
import Prompt from "../../../../components/modals/prompt";
import { toast } from "react-toastify";

const Results = () => {
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
    // updateAnsweredObjectiveQFxn,
    // updateAnsweredTheoryQFxn,
    // updateAnsweredQuestionFxn,
    // createQuestion,
    createdQuestion,
    // ObjectiveQuestions,
    // TheoryQuestions,
    // ObjectiveQ,
    // TheoryQ,
    // answeredObjectiveQ,
    // answeredTheoryQ,
    // answeredQuestion,
    myStudents,
    updatePreviewAnswerFxn,
    // previewAnswer,

    // RESULTS
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
  } = useAssignments();

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
  } = markedQuestion;

  const [showLoading, setShowLoading] = useState(false);

  const [loginPrompt, setLoginPrompt] = useState(false);

  const queryClient = useQueryClient();

  const activateRetrieve = () => {
    if (
      subject !== "" &&
      question_type !== "" &&
      student !== "" &&
      week !== ""
    ) {
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
      enabled: activateRetrieve() && permission?.submissions,
      // enabled: false,
      onSuccess(data) {
        // console.log({ dataR: data });
        const sortedBySubject = data?.filter(
          (dt) => Number(dt?.subject_id) === Number(subject_id)
        );
        const sortByStudent = sortedBySubject?.filter(
          (st) => Number(st?.student_id) === Number(student_id)
        );
        const sortByWeek = sortByStudent?.filter(
          (st) => Number(st?.week) === Number(week)
        );

        const sortedByQN = sortQuestionsByNumber(sortByWeek);

        const computedTeacherMark = addSumMark(sortedByQN);

        // updateAnsweredTheoryQFxn(computedTeacherMark);

        const calculatedData = analyzeQuestions(sortedByQN);

        // console.log({ data, sortedByQN, calculatedData });
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

  const findStudentId = (value) => {
    const findObject = myStudents?.find((opt) => opt.value === value);
    if (findObject) {
      return findObject.id;
    }
  };
  // const findStudentId2 = (id) => {
  //   const findObject = myStudents?.find((opt) => Number(opt.id) === Number(id));
  //   if (findObject) {
  //     return findObject.value;
  //   }
  // };

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
    const findObject = classSubjects?.find((opt) => opt.value === value);
    if (findObject) {
      return findObject.id;
    }
  };

  const studentName = (value) => {
    const findObject = classSubjects?.find((opt) => opt.id === value);
    if (findObject) {
      return findObject.id;
    }
  };

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

  const studentScore2 = `${
    answeredTheoryResults[answeredTheoryResults?.length - 1]?.sum_mark
  }`;
  const studentScore = `${
    correctCount *
    answeredObjResults[answeredObjResults?.length - 1]?.question_mark
  }`;

  const studentId =
    answeredTheoryResults[answeredTheoryResults?.length - 1]?.student_id;

  const assignment_id1 =
    answeredObjResults[answeredObjResults?.length - 1]?.assignment_id;
  const assignment_id2 =
    answeredTheoryResults[answeredTheoryResults?.length - 1]?.assignment_id;

  /////// POST ASSIGNMENT RESULT ////
  const {
    mutateAsync: addAssignmentResult,
    isLoading: addAssignmentResultLoading,
  } = useMutation(
    () =>
      apiServices.submitAssignmentResult({
        period: user?.period,
        term: user?.term,
        session: user?.session,
        student_id: student_id,
        subject_id: subject_id,
        question_type: question_type,
        assignment_id:
          question_type === "theory"
            ? assignment_id2
            : question_type === "objective"
            ? assignment_id1
            : "",
        student_mark:
          question_type === "theory"
            ? Number(studentScore2)
            : question_type === "objective"
            ? Number(studentScore)
            : "",
        total_mark:
          question_type === "theory"
            ? totalMarks2
            : question_type === "objective"
            ? totalMarks
            : "",
        score:
          question_type === "theory"
            ? Number(studentScore2)
            : question_type === "objective"
            ? Number(studentScore)
            : "",
        week,
      }),

    {
      onSuccess() {
        queryClient.invalidateQueries(
          queryKeys.GET_ASSIGNMENT,
          user?.period,
          user?.term,
          user?.session,
          createdQuestion?.question_type
        );
        toast.success("Result has been submitted successfully");
      },
      onError(err) {
        apiServices.errorHandler(err);
      },
    }
  );

  console.log({
    ar: activateRetrieve(),
    markedQuestion,
    answeredObjResults,
    answeredTheoryResults,
  });
  // console.log({
  //   res: {
  //     period: user?.period,
  //     term: user?.term,
  //     session: user?.session,
  //     student_id: student_id,
  //     subject_id: subject_id,
  //     question_type: question_type,
  //     assignment_id:
  //       question_type === "theory"
  //         ? assignment_id2
  //         : question_type === "objective"
  //         ? assignment_id1
  //         : "",
  //     student_mark:
  //       question_type === "theory"
  //         ? Number(studentScore2)
  //         : question_type === "objective"
  //         ? Number(studentScore)
  //         : "",
  //     total_mark:
  //       question_type === "theory"
  //         ? totalMarks2
  //         : question_type === "objective"
  //         ? totalMarks
  //         : "",
  //     score:
  //       question_type === "theory"
  //         ? Number(studentScore2)
  //         : question_type === "objective"
  //         ? Number(studentScore)
  //         : "",
  //     week,
  //   },
  // });

  // console.log({ answeredTheoryQ, markedQuestion, totalMarks2 });
  // console.log({ percentage });

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
                updateMarkedQuestionFxn({
                  week: value,
                });
                if (subject !== "" && question_type !== "" && student !== "") {
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
              options={classSubjects}
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
                if (question_type !== "" && week !== "" && student !== "") {
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
                if (subject !== "" && week !== "" && student !== "") {
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

            <AuthSelect
              sort
              options={myStudents}
              value={student}
              defaultValue={student && student}
              onChange={({ target: { value } }) => {
                //
                updateMarkedQuestionFxn({
                  student: value,
                  student_id: Number(findStudentId(value)),
                  // subject_id: findSubjectId(value),
                });
                if (subject !== "" && week !== "" && student !== "") {
                  setShowLoading(true);
                  setTimeout(() => {
                    setShowLoading(false);
                  }, 1500);
                  // refetchSubmittedAssignment();
                  refetchMarkedAssignmentResults();
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
                <div className={styles.compile_container}>
                  <p className={styles.compile_tag}>Total Marks</p>
                  <div className={styles.compile_box}>
                    <p className={styles.compile_score}>{totalMarks}</p>
                  </div>
                </div>
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
                    <p className={styles.compile_score}>
                      {percentage.toFixed(2)}%
                    </p>
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
                addAssignmentResult={addAssignmentResult}
                addAssignmentResultLoading={addAssignmentResultLoading}
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
                <div className={styles.compile_container}>
                  <p className={styles.compile_tag}>Total Marks</p>
                  <div className={styles.compile_box}>
                    <p className={styles.compile_score}>{totalMarks2}</p>
                  </div>
                </div>
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
                    <p className={styles.compile_score}>
                      {percentage2.toFixed(2)}%
                    </p>
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
                updatePreviewAnswerFxn={updatePreviewAnswerFxn}
                // previewAnswer={previewAnswer}
                centered
                isLoading={allLoading}
                addAssignmentResult={addAssignmentResult}
                addAssignmentResultLoading={addAssignmentResultLoading}
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
  );
};

export default Results;
