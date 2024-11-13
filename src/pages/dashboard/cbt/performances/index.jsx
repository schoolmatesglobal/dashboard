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
import {
  formatTime2,
  generateNewArray,
  recreateArray,
  recreateArray2,
} from "./constant";
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
import CbtStudentsRow from "../../../../components/common/cbt-students-row";

const CbtPerformances = ({}) => {
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
    markedQ,
    setMarkedQ,
    studentByClass,
    studentByClassLoading,
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

  const [idWithComputedResult, setIdWithComputedResult] = useState([]);

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
    if (question_type !== "" && student_id !== "" && subject_id !== "") {
      return true;
    } else {
      return false;
    }
  };

  const activateRetrieve2 = () => {
    if (subject_id !== "") {
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
    isLoading: allCbtPerformanceLoading,
    refetch: refetchAllCbtPerformance,
    isFetching: allCbtPerformanceIsFetching,
    data: allCbtPerformance,
  } = useQuery(
    [queryKeys.GET_ALL_CBT_PERFORMANCE],
    () =>
      apiServices.getAllCbtPerformance(
        state?.creds?.period,
        state?.creds?.term,
        state?.creds?.session,
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

        // const app2 = generateNewArray(app)?.map((ap) => {
        //   return {
        //     name: findStudentName(ap?.student_id),
        //     scores: ap?.weekScores,
        //   };
        // });

        // const app4 = app3

        // console.log({ app, data });

        return app;
      },

      onSuccess(data) {
        if (data?.length > 0) {
          setShowChart(true);
          const newData = data?.map((dt, i) => {
            return {
              Name: findStudentName(dt?.student_id),
              Score: Number(
                (dt?.student_total_mark / dt?.test_total_mark) * 100
              ),
              ActualScore: `${dt?.student_total_mark}/${dt?.test_total_mark}`,
              Time: formatTime2(dt?.test_duration, dt?.student_duration)
                ?.difference,
            };
          });

          setDataAll(newData);
        } else {
          setShowChart(false);
        }
      },
      onError(err) {
        errorHandler(err);
      },
      // select: apiServices.formatData,
    }
  );

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

          const ids = data?.map((idx, i) => {
            return idx?.student_id;
          });

          setIdWithComputedResult(ids);
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

  const allLoading =
    showLoading ||
    cbtPerformanceLoading ||
    allCbtPerformanceLoading ||
    allCbtPerformanceIsFetching ||
    cbtPerformanceIsFetching;

  const data = [65, 70, 68, 72, 75, 80, 85, 82, 78, 75];

  const studentData = [
    { name: "Lukaku Romelu", scores: [65] },
    { name: "Jobs Steven", scores: [60] },
    { name: "Alex Job", scores: [30] },
    { name: "Alex Job", scores: [30] },
    { name: "Alex Job", scores: [50] },
    { name: "Alex Job3", scores: [30] },
    { name: "Alex Job", scores: [30] },
    { name: "Alex Job", scores: [30] },
  ];

  const studentNames = myStudents?.map((ms, i) => {
    return ms.value;
  });

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

  useEffect(() => {
    setIdWithComputedResult([]);

    trigger();

    if (activateRetrieve()) {
      refetchCbtPerformance();
      refetchAllCbtPerformance();
    }
    // setAnsweredTheoQ(submittedTheoAssignment);
  }, [subject_id, student_id, question_type]);

  const showCharts = () => {
    if (!student_id || !question_type || !subject_id) {
      return true;
    } else {
      if (showChart && showChart2) {
        return false;
      } else if (student !== "Students All" && !showChart2) {
        return true;
      } else if (student === "Students All" && !showChart) {
        return true;
      } else {
        return false;
      }
    }
  };

  const showWarning = () => {
    if (!question_type || !subject_id) {
      return true;
    } else {
      return false;
    }
  };

  // const newStudentByClass = studentByClass?.map((sc, i) => {
  //   return {};
  // });

  const newStudentByClass = [
    {
      admission_number: "",
      age: 1,
      blood_group: "A+",
      campus: "Corona Elementary",
      campus_type: "Elementary",
      class: "BASICS 1",
      class_sub_class: "",
      dob: "2023-02-08",
      email_address: "kike@coronaschools.com",
      firstname: "All",
      gender: "all",
      genotype: "AA",
      home_address: "2801 Island Avenue",
      id: "999",
      image: "",
      middlename: "Mary",
      nationality: "Nigeria",
      new_id: 1,
      phone_number: "+23481345685686",
      present_class: "BASICS 1",
      session_admitted: "2024",
      state: "Lagos",
      status: "active",
      sub_class: "",
      surname: "Students",
      username: "COROS001",
    },
    ...studentByClass,
  ];

  // console.log({
  //   studentByClass,
  //   newStudentByClass,
  //   student,
  //   idWithComputedResult,
  //   markedQ,
  //   cbtPerformance,
  //   // subject_id,
  //   // student_id,
  //   // cbtPerformance,
  //   // allCbtPerformance,
  //   // subjectsByTeacher,
  //   // myStudents,
  //   // state,
  //   // studentNames,
  //   // dataAll,
  //   // dataSingle,
  //   // dataSingle2,
  //   // showChart,
  //   // showChart2,
  //   // showCharts: showCharts(),
  // });

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
              {/* <AuthSelect
                sort
                options={newStudents}
                value={student}
                onChange={({ target: { value } }) => {
                  setMarkedQ((prev) => {
                    const fId = () => {
                      const ff = newStudents?.find(
                        (opt) => opt.value === value
                      );
                      if (ff) {
                        return ff?.id?.toString();
                      }
                    };
                    return { ...prev, student: value, student_id: fId() };
                  });

                  // refetchMarkedAssignment();
                  // setMarkedTheoQ([]);
                  // setMarkedTheoQ2([]);
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
              studentByClassAndSession={newStudentByClass}
              onProfileSelect={(x) => {
                setMarkedQ((prev) => {
                  return {
                    ...prev,
                    student: `${x.surname} ${x.firstname}`,
                    student_id: x.id,
                  };
                });
              }}
              isLoading={allLoading}
              answerQ={markedQ}
              answeredObjQ={dataSingle || dataSingle2}
              idWithComputedResult={idWithComputedResult}
            />
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
              {student !== "Students All" && !!question_type && showChart2 && (
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
              {student === "Students All" && !!question_type && showChart && (
                <div className='mt-5'>
                  <p className='fs-3 fw-bold'>
                    Score Analysis (%) for all students
                  </p>
                  <BarCharts
                    chartTitle={`Class Chart`}
                    studentData={studentData}
                    studentNames={studentNames}
                    value='Score'
                    colour='#11355c'
                    unit='%'
                    data={dataAll}
                    // studentData={allCbtPerformance}
                  />
                  <p className='fs-3 fw-bold mt-5'>
                    Time Analysis (mins) for all students
                  </p>
                  <BarCharts
                    chartTitle={`Class Chart`}
                    studentData={studentData}
                    studentNames={studentNames}
                    value='Time'
                    colour='#82ca9d'
                    unit='mins'
                    data={dataAll}
                    // studentData={allCbtPerformance}
                  />
                </div>
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
      </PageSheet>
    </div>
  );
};

export default CbtPerformances;
