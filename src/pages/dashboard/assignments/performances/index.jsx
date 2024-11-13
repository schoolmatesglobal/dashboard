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
import { generateNewArray, recreateArray, recreateArray2 } from "./constant";

const Performances = ({ markedQ, setMarkedQ }) => {
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

  const findStudentName = (id) => {
    const studentObj = myStudents?.find((my) => {
      return Number(my.id) === Number(id);
    });
    return studentObj?.title;
  };

  const activateRetrieve = () => {
    if (subject !== "" && student !== "") {
      return true;
    } else {
      return false;
    }
  };

  const activateRetrieve2 = () => {
    if (subject !== "") {
      return true;
    } else {
      return false;
    }
  };

  function groupByStudentId(result) {
    const grouped = {};

    result.forEach((item) => {
      const { student_id } = item;
      if (!grouped[student_id]) {
        grouped[student_id] = [item];
      } else {
        grouped[student_id].push(item);
      }
    });

    return grouped;
  }

  /////// FETCH ALL PERFORMANCE /////
  const {
    isLoading: allPerformanceLoading,
    refetch: refetchAllPerformance,
    data: allPerformance,
  } = useQuery(
    [
      queryKeys.GET_ALL_PERFORMANCE,
      user?.period,
      user?.term,
      user?.session,
      subject_id,
    ],
    () =>
      apiServices.getAllStudentPerformance(
        user?.period,
        user?.term,
        user?.session,
        subject_id
      ),
    {
      retry: 1,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      // enabled: permission?.read || permission?.readClass,
      enabled: activateRetrieve2() && permission?.submissions,
      select: (data) => {
        const app = data?.data[0]?.students;

        // const app2 = groupByStudentId(app);

        const app2 = generateNewArray(app)?.map((ap) => {
          return {
            name: findStudentName(ap?.student_id),
            scores: ap?.weekScores,
          };
        });

        // const app4 = app3

        // console.log({ app, data, app2 });

        return app2;
      },

      onSuccess(data) {},
      onError(err) {
        errorHandler(err);
      },
      // select: apiServices.formatData,
    }
  );

  /////// FETCH PERFORMANCE /////
  const {
    isLoading: performanceLoading,
    refetch: refetchPerformance,
    data: performance,
  } = useQuery(
    [
      queryKeys.GET_PERFORMANCE,
      user?.period,
      user?.term,
      user?.session,
      subject_id,
      student_id,
    ],
    () =>
      apiServices.getStudentPerformance(
        user?.period,
        user?.term,
        user?.session,
        subject_id,
        student_id
      ),
    {
      retry: 1,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      // enabled: permission?.read || permission?.readClass,
      enabled: activateRetrieve() && permission?.submissions,
      select: (data) => {
        const pp = data?.data[0]?.students;

        const pp2 = recreateArray(pp);

        const newP = pp2?.map((p) => {
          return Number(p.total_score);
        });

        // console.log({ pp, pp2, data, newP });

        return newP;
      },

      onSuccess(data) {},
      onError(err) {
        errorHandler(err);
      },
      // select: apiServices.formatData,
    }
  );

  const result = [
    {
      student_id: "17",
      week: "2",
      total_score: 9,
      average_percentage_score: "0.05",
    },
    {
      student_id: "17",
      week: "5",
      total_score: 2,
      average_percentage_score: "0.00",
    },
    {
      student_id: "17",
      week: "6",
      total_score: 9,
      average_percentage_score: "0.02",
    },
  ];

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

  const allLoading = showLoading || performanceLoading || allPerformanceLoading;

  const data = [65, 70, 68, 72, 75, 80, 85, 82, 78, 75];

  const studentData = [
    { name: "Lukaku Romelu", scores: [65, 70, 68, 72, 75, 80, 85, 82, 78, 75] },
    { name: "Adammu Adam", scores: [70, 72, 75, 78, 80, 82, 85, 88, 90, 92] },
    { name: "Jobs Steven", scores: [60, 65, 68, 70, 72, 75, 78, 80, 82, 85] },
    { name: "Alex Job", scores: [30, 44, 32, 64, 81, 65, 58, 70, 62, 75] },
  ];

  useEffect(() => {
    if (subjectsByTeacher?.length > 0) {
      const sbb2 = subjectsByTeacher[0]?.title?.map((sb) => {
        const subId = subjects?.find((ob) => ob.subject === sb.name)?.id;

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

  // console.log({
  //   subject_id,
  //   student_id,
  //   performance,
  //   allPerformance,
  //   subjectsByTeacher,
  // });

  return (
    <div>
      <div className={styles.created}>
        <div className='d-flex flex-column gap-4 flex-lg-row justify-content-lg-between'>
          <div className='d-flex flex-column gap-4 flex-sm-row flex-grow-1'>
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

        {allLoading && (
          <div className={styles.spinner_container}>
            <Spinner /> <p className='fs-3'>Loading...</p>
          </div>
        )}

        {!allLoading && (
          <div className='mt-5'>
            {student !== "all students" && (
              <LineChart
                chartTitle={`${
                  student ? "Chart for" : "No Chart Result"
                } ${student}`}
                data={performance}
              />
            )}
            {student === "all students" && (
              <LineChart2
                chartTitle={`Class Chart`}
                studentData={allPerformance}
              />
            )}
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
        singleButtonText='Preview'
        promptHeader={` CONFIRM RESULT SUBMISSION `}
      ></Prompt>
    </div>
  );
};

export default Performances;
