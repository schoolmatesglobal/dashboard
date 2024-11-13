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
import { formatTime2, recreateArray } from "./constant";
import { useCBT } from "../../../../hooks/useCBT";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import PageSheet from "../../../../components/common/page-sheet";
import GoBack from "../../../../components/common/go-back";
import BarChart from "../../../../components/charts/bar-chart";
import BarCharts from "../../../../components/charts/bar-chart";
import PieChart from "../../../../components/charts/pie-chart";
import PieCharts from "../../../../components/charts/pie-chart";
import { formatTime } from "../results/constant";
import { FaComputer } from "react-icons/fa6";

const StudentCbtPerformances = ({}) => {
  const {
    classSubjects,
    apiServices,
    errorHandler,
    permission,
    user,
    createdQuestion,
    myStudents,
    updatePreviewAnswerFxn,
    markedQ,
    setMarkedQ,
    studentSubjects,
  } = useCBT();

  const { question_type, subject, subject_id, student_id, week, student } =
    markedQ;

  const { state } = useLocation();

  const isDesktop = useMediaQuery({ query: "(max-width: 988px)" });
  const isTablet = useMediaQuery({
    query: "(min-width: 768px, max-width: 991px)",
  });
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const [newSubjects, setNewSubjects] = useState([]);

  const [dataSingle, setDataSingle] = useState([]);
  const [dataSingle2, setDataSingle2] = useState([]);
  const [dataAll, setDataAll] = useState([]);

  const { subjects, isLoading: subjectLoading } = useSubject();

  const [showLoading, setShowLoading] = useState(false);

  const [loginPrompt, setLoginPrompt] = useState(false);

  const [showChart, setShowChart] = useState(false);
  const [showChart2, setShowChart2] = useState(false);

  const queryClient = useQueryClient();

  const trigger = () => {
    setShowLoading(true);
    setTimeout(() => {
      setShowLoading(false);
    }, 1000);
  };

  const newStudents = [
    { value: "all students", title: "All Students", id: 999999 },
    ...myStudents,
  ];

  const findStudentName = (id) => {
    const studentObj = myStudents?.find((my) => {
      return Number(my.id) === Number(id);
    });
    return studentObj?.title;
  };

  const activateRetrieve = () => {
    if (student_id !== "" && subject_id !== "") {
      return true;
    } else {
      return false;
    }
  };

  /////// FETCH CBT PERFORMANCE /////
  const {
    isLoading: cbtPerformanceLoading,
    refetch: refetchCbtPerformance,
    isFetching: cbtPerformanceIsFetching,
    data: cbtPerformance,
  } = useQuery(
    [queryKeys.GET_CBT_PERFORMANCE],
    () =>
      apiServices.getCbtPerformance(
        state?.creds?.period,
        state?.creds?.term,
        state?.creds?.session,
        student_id,
        subject_id
      ),
    {
      retry: 1,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      // enabled: permission?.read || permission?.readClass,
      enabled: activateRetrieve() && permission?.submissions,
      select: (data) => {
        const pp = data?.data[0]?.students;

        // const pp2 = recreateArray(pp);

        // const newP = pp2?.map((p) => {
        //   return Number(p.total_score);
        // });
        // console.log({ pp, data });

        return pp;
      },

      onSuccess(data) {
        if (data?.length > 0) {
          setShowChart2(true);
          const correct_answer = Number(data[0]?.correct_answer);
          const incorrect_answer = Number(data[0]?.incorrect_answer);
          const unattempted_answer = Number(data[0]?.unattempted_question);
          const total_answer = Number(data[0]?.total_answer);
          const student_duration = data[0]?.student_duration;
          const test_duration = data[0]?.test_duration;

          const sampleData = [
            { name: "Correct Answers", Score: 5, total: 8 },
            { name: "Incorrect Answers", Score: 2, total: 8 },
            { name: "Unattempted Questions", Score: 1, total: 8 },
            // { name: "Group D", Score: 200 },
          ];
          const sampleData2 = [
            { name: "Student Test Time", Score: 30, total: "1hr : 30mins" },
            { name: "Un-used Time", Score: 60, total: "1hr : 30mins" },
          ];

          const newData = sampleData?.map((dt, i) => {
            return {
              name: dt?.name,
              Score:
                dt?.name === "Correct Answers"
                  ? correct_answer
                  : dt?.name === "Incorrect Answers"
                  ? incorrect_answer
                  : unattempted_answer,
              total: total_answer,
            };
          });
          const newData2 = sampleData2?.map((dt, i) => {
            return {
              name: dt?.name,
              Score:
                dt?.name === "Student Test Time"
                  ? formatTime2(test_duration, student_duration)?.difference
                  : formatTime2(test_duration, student_duration)
                      ?.totalTimeInMinutes -
                    formatTime2(test_duration, student_duration)?.difference,
              total: formatTime2(test_duration, student_duration)?.totalTime,
            };
          });

          setDataSingle(newData);
          setDataSingle2(newData2);
        } else {
          setShowChart2(false);
        }

        // const newData = data?.map((dt, i)=>{
        //   return {
        //     Name: findStudentName(dt?.student_id),
        //     Score: Number((dt?.student_total_mark / dt?.test_total_mark) * 100),
        //     ActualScore: `${dt?.student_total_mark}/${dt?.test_total_mark}`,
        //     Time: formatTime2(dt?.test_duration, dt?.student_duration)
        //       ?.difference,
        //   };
        // })
      },
      onError(err) {
        errorHandler(err);
      },
      // select: apiServices.formatData,
    }
  );

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
    showLoading || cbtPerformanceLoading || cbtPerformanceIsFetching;

  const data = [65, 70, 68, 72, 75, 80, 85, 82, 78, 75];

  const studentData = [
    { name: "Lukaku Romelu", scores: [65, 70, 68, 72, 75, 80, 85, 82, 78, 75] },
    { name: "Adammu Adam", scores: [70, 72, 75, 78, 80, 82, 85, 88, 90, 92] },
    { name: "Jobs Steven", scores: [60, 65, 68, 70, 72, 75, 78, 80, 82, 85] },
    { name: "Alex Job", scores: [30, 44, 32, 64, 81, 65, 58, 70, 62, 75] },
  ];

  useEffect(() => {
    setMarkedQ((prev) => {
      return {
        ...prev,
        student: `${user?.surname} ${user?.firstname}`,
        student_id: user?.id,
      };
    });
    const sbb = subjects?.map((sb) => {
      return {
        // value: sb.subject,
        value: sb.id,
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
    trigger();

    if (activateRetrieve()) {
      refetchCbtPerformance();
    }

    // setAnsweredTheoQ(submittedTheoAssignment);
  }, [subject_id, question_type]);

  const showCharts = () => {
    if (!question_type || !subject_id) {
      return true;
    } else {
      if (showChart2) {
        return false;
      } else if (!showChart2) {
        return true;
      } else {
        return false;
      }
    }
  };

  // console.log({
  //   subject_id,
  //   student_id: user?.id,
  //   performance,
  //   user,
  // });

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
                options={newSubjects}
                value={subject_id}
                onChange={({ target: { value } }) => {
                  setMarkedQ((prev) => {
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
                  setMarkedQ((prev) => {
                    return { ...prev, question_type: value, answer: "" };
                  });
                }}
                placeholder='Select type'
                wrapperClassName=''
              />
            </div>
          </div>

          {allLoading && (
            <div className={styles.spinner_container}>
              <Spinner /> <p className='fs-3'>Loading...</p>
            </div>
          )}

          {!allLoading && showCharts() && (
            <div className={styles.placeholder_container}>
              <FaComputer className={styles.icon} />{" "}
              <p className='fs-1 fw-bold mt-3'>No CBT Performance</p>
            </div>
          )}
          {!allLoading && (
            <div className='mt-5'>
              {!!subject_id && !!question_type && showChart2 && (
                <div className='mt-5'>
                  <p className='fs-3 fw-bold'>{`Score Analysis (%) for ${student}`}</p>
                  <PieCharts
                    chartTitle={`${
                      student ? "Chart for" : "No Chart Result"
                    } ${student}`}
                    // data={cbtPerformance}
                    // data={data}
                    value='Score'
                    colour='#11355c'
                    unit=''
                    data={dataSingle}
                    // data2={dataSingle2}
                  />
                  <p className='fs-3 fw-bold mt-5'>{`Time Analysis (%) for ${student}`}</p>
                  <PieCharts
                    chartTitle={`${
                      student ? "Chart for" : "No Chart Result"
                    } ${student}`}
                    // data={cbtPerformance}
                    // data={data}
                    value='Time'
                    colour='#82ca9d'
                    unit='mins'
                    data={dataSingle2}
                    // data2={dataSingle2}
                  />
                </div>
              )}
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

export default StudentCbtPerformances;
