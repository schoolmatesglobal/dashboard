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

const StudentResults = ({
  markedQ,
  setMarkedQ,
  answeredObjResults,
  setAnsweredObjResults,
  answeredTheoryResults,
  setAnsweredTheoryResults,
  ResultTab,
  setResultTab,
}) => {
  const {
    apiServices,
    errorHandler,
    permission,
    user,
    updatePreviewAnswerFxn,
  } = useAssignments();

  const { question_type, subject, subject_id, student_id, week, student } =
    markedQ;

  const [newSubjects, setNewSubjects] = useState([]);
  const { subjects, isLoading: subjectLoading } = useSubject();

  const [showLoading, setShowLoading] = useState(false);

  const [loginPrompt, setLoginPrompt] = useState(false);

  const queryClient = useQueryClient();

  const activateRetrieve = () => {
    if (subject !== "" && week !== "") {
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
      "objective2",
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
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      // enabled: permission?.read || permission?.readClass,
      enabled: activateRetrieve(),
      select: (data) => {
        const ffk = apiServices.formatData(data);

        const sorted = ffk
          ?.filter((dt) => dt?.subject === subject && dt?.student === student)
          ?.sort((a, b) => {
            if (a.question_number < b.question_number) {
              return -1;
            }
            if (a.question_number > b.question_number) {
              return 1;
            }
            return 0;
          });

        const calculatedData = analyzeQuestions(sorted);

        // console.log({ ffk, data, sorted });
        return calculatedData ?? {};
      },

      onSuccess(data) {},
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
      retry: 1,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      // enabled: permission?.read || permission?.readClass,
      enabled: activateRetrieve(),

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

        // console.log({ mmk, data, sorted });

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
    if (ResultTab === "1" && submittedAssignment?.questions?.length === 0) {
      return true;
    } else if (
      ResultTab === "2" &&
      markedAssignmentResults?.questions?.length === 0
    ) {
      return true;
    } else {
      return false;
    }
  };

  const showNoAssignment2 = () => {
    if (ResultTab === "1" && submittedAssignment?.questions?.length === 0) {
      return true;
    } else if (
      ResultTab === "2" &&
      markedAssignmentResults?.questions?.length === 0
    ) {
      return true;
    } else {
      return false;
    }
  };

  const showNoAssignment3 = () => {
    if (!week || !subject) {
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
      submittedAssignment?.questions?.length >= 1 &&
      markedAssignmentResults?.questions?.length >= 1
    ) {
      return [objectiveTab, theoryTab];
    } else if (submittedAssignment?.questions?.length >= 1) {
      return [objectiveTab];
    } else if (markedAssignmentResults?.questions?.length >= 1) {
      return [theoryTab];
    }

    return [];
  };

  const allLoading = showLoading || markedAssignmentResultsLoading;

  useEffect(() => {
    if (markedAssignmentResults?.questions?.length >= 1) {
      setResultTab("2");
    } else {
      setResultTab("1");
    }
  }, [week, subject]);

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

  // console.log({
  //   user,
  //   markedQ,
  //   submittedAssignment,
  //   markedAssignmentResults,
  // });

  return (
    <div>
      <div className={styles.created}>
        <div className='d-flex flex-column gap-4 flex-lg-row justify-content-lg-between'>
          <div className='d-flex flex-column gap-4 flex-sm-row flex-grow-1'>
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
                setMarkedQ((prev) => {
                  return { ...prev, week: value };
                });
                // setResultTab("2");
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

                setMarkedQ((prev) => {
                  return { ...prev, subject: value, subject_id: fId() };
                });

                // setResultTab("2");
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
                setMarkedQ((prev) => {
                  return { ...prev, question_type: value };
                });
              }}
              placeholder='Question Type'
              wrapperClassName='w-100'
            /> */}
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
              <p className='fs-1 fw-bold mt-3'>No Result</p>
            </div>
          )}

        {!allLoading &&
          submittedAssignment?.questions?.length > 0 &&
          ResultTab === "1" && (
            <div className=''>
              <div className='d-flex justify-content-center align-items-center gap-4 w-100 my-5'>
                {/* total marks */}
                <div className=' bg-info bg-opacity-10 py-4 px-4 d-flex flex-column justify-content-center align-items-center gap-3'>
                  <p className='fs-3 fw-bold'>Total Marks</p>
                  <p className='fs-1 fw-bold'>
                    {submittedAssignment?.total_marks}
                  </p>
                </div>
                {/* score */}
                <div className=' bg-info bg-opacity-10 py-4 px-4 d-flex flex-column justify-content-center align-items-center gap-3'>
                  <p className='fs-3 fw-bold'>Score</p>
                  <p className='fs-1 fw-bold'>{submittedAssignment?.score}</p>
                </div>
                {/* percentage */}
                <div className=' bg-info bg-opacity-10 py-4 px-4 d-flex flex-column justify-content-center align-items-center gap-3'>
                  <p className='fs-3 fw-bold'>Percentage</p>
                  <p className='fs-1 fw-bold'>
                    {submittedAssignment?.percentage}
                  </p>
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
                data={submittedAssignment?.questions}
                markedQ={markedQ}
                result={submittedAssignment}
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
    </div>
  );
};

export default StudentResults;
