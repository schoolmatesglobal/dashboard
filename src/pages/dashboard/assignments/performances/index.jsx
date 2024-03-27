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
import LineChart from "../../../../components/charts/line-chart";
import LineChart2 from "../../../../components/charts/line-chart2";

const Performances = ({
  markedQ,
  setMarkedQ,
  answeredObjResults,
  setAnsweredObjResults,
  answeredTheoryResults,
  setAnsweredTheoryResults,
}) => {
  const {
    classSubjects,
    apiServices,
    errorHandler,
    permission,
    user,
    createdQuestion,
    myStudents,
    updatePreviewAnswerFxn,
  } = useAssignments();

  const { question_type, subject, subject_id, student_id, week, student } =
    markedQ;

  const [newSubjects, setNewSubjects] = useState([]);
  const { subjects, isLoading: subjectLoading } = useSubject();

  const [showLoading, setShowLoading] = useState(false);

  const [loginPrompt, setLoginPrompt] = useState(false);

  const queryClient = useQueryClient();

  const newStudents = [
    { value: "all students", title: "All Students", id: 999 },
    ...myStudents,
  ];

  const activateRetrieve = () => {
    if (subject !== "" && student !== "") {
      return true;
    } else {
      return false;
    }
  };

  /////// FETCH OBJECTIVE PERFORMANCE /////
  const {
    isLoading: objectivePerformanceLoading,
    refetch: refetchObjectivePerformance,
    data: objectivePerformance,
  } = useQuery(
    [
      queryKeys.GET_SUBMITTED_ASSIGNMENT,
      user?.period,
      user?.term,
      user?.session,
      student_id,
      "objective",
      subject_id,
    ],
    () =>
      apiServices.getStudentPerformance(
        user?.period,
        user?.term,
        user?.session,
        student_id,
        "objective",
        subject_id
      ),
    {
      retry: 3,
      // enabled: permission?.read || permission?.readClass,
      enabled: activateRetrieve() && permission?.submissions,
      select: (data) => {
        const ook = apiServices.formatData(data);

        console.log({ ook, data });
      },

      onSuccess(data) {},
      onError(err) {
        errorHandler(err);
      },
      // select: apiServices.formatData,
    }
  );
  /////// FETCH THEORY PERFORMANCE /////
  const {
    isLoading: theoryPerformanceLoading,
    refetch: refetchTheoryPerformance,
    data: theoryPerformance,
  } = useQuery(
    [
      queryKeys.GET_SUBMITTED_ASSIGNMENT,
      user?.period,
      user?.term,
      user?.session,
      student_id,
      "theory",
      subject_id,
    ],
    () =>
      apiServices.getStudentPerformance(
        user?.period,
        user?.term,
        user?.session,
        student_id,
        "theory",
        subject_id
      ),
    {
      retry: 3,
      // enabled: permission?.read || permission?.readClass,
      enabled: activateRetrieve() && permission?.submissions,
      select: (data) => {
        // const ttk = apiServices.formatData(data);
        const ttk = data?.data[0]?.students;

        const newData = ttk?.map((tk)=>{
          return Number(tk.percentage_score) * 100
        })

        console.log({ ttk, data, newData });
      },

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

  const allLoading =
    showLoading || objectivePerformanceLoading || theoryPerformanceLoading;

  const studentData = [
    { name: "Lukaku Romelu", scores: [65, 70, 68, 72, 75, 80, 85, 82, 78, 75] },
    { name: "Adammu Adam", scores: [70, 72, 75, 78, 80, 82, 85, 88, 90, 92] },
    { name: "Jobs Steven", scores: [60, 65, 68, 70, 72, 75, 78, 80, 82, 85] },
    { name: "Alex Job", scores: [30, 44, 32, 64, 81, 65, 58, 70, 62, 75] },
  ];

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

  console.log({
    subject_id,
    student_id,
  });

  return (
    <div>
      <div className={styles.created}>
        <div className='d-flex flex-column gap-4 flex-lg-row justify-content-lg-between'>
          <div className='d-flex flex-column gap-4 flex-sm-row flex-grow-1'>
            {/* <AuthSelect
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
              }}
              placeholder='Select Week'
              wrapperClassName='w-100'
            /> */}

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

            <AuthSelect
              sort
              options={newStudents}
              // options={myStudents}
              value={student}
              // defaultValue={student && student}
              onChange={({ target: { value } }) => {
                //
                const fId = () => {
                  const ff = myStudents?.find((opt) => opt.value === value);
                  if (ff) {
                    return ff?.id?.toString();
                  }
                };
                //
                setMarkedQ((prev) => {
                  return { ...prev, student: value, student_id: fId() };
                });
              }}
              placeholder='Select Student'
              wrapperClassName='w-100'
              // label="Subject"
            />
          </div>
        </div>

        {/* {allLoading && (
          <div className={styles.spinner_container}>
            <Spinner /> <p className=''>Loading...</p>
          </div>
        )}

        {!allLoading &&
          (showNoAssignment() ||
            showNoAssignment2() ||
            showNoAssignment3()) && (
            <div className={styles.placeholder_container}>
              <MdOutlineLibraryBooks className={styles.icon} />
              <p className={styles.heading}>No Chart Result</p>
            </div>
          )} */}

        <div className='mt-5'>
          {student !== "all students" && (
            <LineChart
              chartTitle={`${
                student ? "Performance chart for" : "No Chart Result"
              } ${student}`}
            />
          )}
          {student === "all students" && (
            <LineChart2
              chartTitle={`Class Chart Performance`}
              studentData={studentData}
            />
          )}
        </div>
      </div>
      {/* <div className="d-flex justify-content-center ">
      <ButtonGroup options={buttonOptions2} />
    </div> */}
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

export default Performances;
