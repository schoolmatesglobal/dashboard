import React, { useEffect, useState } from "react";
import StudentsResults from "../../../../../../components/common/students-results";
import PageSheet from "../../../../../../components/common/page-sheet";
import Button from "../../../../../../components/buttons/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ResultHeader from "../../../../../../components/common/result-header";
import { useResults } from "../../../../../../hooks/useResults";
import { useAppContext } from "../../../../../../hooks/useAppContext";
import { faCheck, faPrint } from "@fortawesome/free-solid-svg-icons";
import ColumnChart from "../../../../../../components/charts/column-chart";
import { useStudent } from "../../../../../../hooks/useStudent";
import { useActivities } from "../../../../../../hooks/useActivities";
import { Input } from "reactstrap";
import { useGrading } from "../../../../../../hooks/useGrading";
import GoBack from "../../../../../../components/common/go-back";
import { PiWarningCircleFill } from "react-icons/pi";

const ElementarySecondHalfSheet = () => {
  const { user } = useAppContext("results");

  const { activities } = useActivities();

  const { isLoading: gradingLoading, grading: resultGrading } = useGrading();

  const {
    idWithComputedResult,
    isLoading,
    setStudentData,
    pdfExportComponent,
    handlePrint,
    studentData,
    academicDate,
    locationState,
    additionalCreds,
    maxScores,
    cummulativeScores,
    getScoreRemark,
    grading,
    yearlyClassAverage,
    setInitGetExistingSecondHalfResult,
    classAverage,
    studentFirstAssess,
    studentSecondAssess,
    studentMidterm,
    extraActivities,
  } = useResults();

  const { studentByClass2, principalClassName, setPrincipalClassName } =
    useStudent();
  // useState

  const [changeTableStyle, setChangeTableStyle] = useState(false);

  const getTotalYearlyScores = () => {
    return cummulativeScores?.reduce((a, item) => {
      return a + Number(item["Total Score"]);
    }, 0);
  };

  const chartTitle =
    locationState?.creds?.term !== "Third Term"
      ? {
          first: "Highest Score",
          second: "Average Score",
          third: "Total Score",
        }
      : {
          first: "First Term",
          second: "Second Term",
          third: "Third Term",
        };

  const generateChartData = () => {
    const unit =
      locationState?.creds?.term !== "Third Term"
        ? {
            first: "Highest",
            second: "Average Score",
            third: "Total Score",
          }
        : {
            first: "First Term",
            second: "Second Term",
            third: "Third Term",
          };

    return cummulativeScores?.reduce((a, item) => {
      const first = [];
      const second = [];
      const third = [];
      const categories = [];

      first.push(Number(item[unit.first]).toFixed(0));
      second.push(Number(item[unit.second]).toFixed(0));
      third.push(Number(item[unit.third]).toFixed(0));
      categories.push(item.subject);

      a = {
        ...a,
        first: [...(a.first || []), ...first],
        second: [...(a.second || []), ...second],
        third: [...(a.third || []), ...third],
        categories: [...(a.categories || []), ...categories],
      };

      return a;
    }, {});
  };

  const [cumTotalScore, setCumTotalScore] = useState([]);

  const removeZeroFirstAssess = () => {
    return studentFirstAssess?.filter((fa) => fa.score != 0 && fa.grade != 0);
  };
  const removeZeroSecondAssess = () => {
    return studentSecondAssess?.filter((fa) => fa.score != 0 && fa.grade != 0);
  };
  const removeZeroMidterm = () => {
    return studentMidterm?.filter((fa) => fa.score != 0 && fa.grade != 0);
  };

  const studentResults = additionalCreds?.results ?? [];

  const removeZeroExam = () => {
    return studentResults?.filter((fa) => fa.score != 0);
  };

  const principalCheck = "Elementary" || "Montessori";

  const totalScore = maxScores?.has_two_assessment
    ? removeZeroExam()?.reduce((accumulator, s) => {
        const firstAssessmentScore =
          Number(
            removeZeroFirstAssess()?.find((x) => x.subject === s.subject)
              ?.score || 0
          ) || 0;
        const secondAssessmentScore =
          Number(
            removeZeroSecondAssess()?.find((x) => x.subject === s.subject)
              ?.score || 0
          ) || 0;
        const currentScore = Number(s?.score || 0);
        return (
          accumulator +
          firstAssessmentScore +
          secondAssessmentScore +
          currentScore
        );
      }, 0)
    : removeZeroExam()
        ?.reduce((accumulator, s) => {
          const midtermScore =
            Number(
              removeZeroMidterm()?.find((x) => x.subject === s.subject)
                ?.score || 0
            ) || 0;
          const currentScore = Number(s?.score || 0);
          return accumulator + midtermScore + currentScore;
        }, 0)
        .toFixed(2);

  const getTotalScore = () => {
    maxScores.reduce((a, item) => {
      return a + Number(item["Total Score"]);
    });
  };

  const checkResultComputed = (function () {
    if (user?.designation_name === "Student") {
      if (
        "results" in additionalCreds &&
        additionalCreds?.status === "released"
      ) {
        return "Released";
      } else if (
        "results" in additionalCreds &&
        additionalCreds?.status === "withheld"
      ) {
        return "Withheld";
      } else {
        return "Not Released";
      }
    } else {
      if (
        "results" in additionalCreds &&
        additionalCreds?.status === "released"
      ) {
        return "Released";
      } else if (
        "results" in additionalCreds &&
        additionalCreds?.status === "withheld"
      ) {
        return "Released";
      } else {
        return "Not Released";
      }
    }
  })();

  // useEffect(() => {
  //   setPrincipalClassName(locationState?.creds?.class_name);
  // }, []);

  // const subjectCount = () => {
  //   return maxScores.reduce((a, item) => {
  //     return a + 1;
  //   });
  // }

  console.log({ studentData, checkResultComputed, additionalCreds });
  // console.log({
  //   removeZeroMidterm: removeZeroMidterm(),
  //   removeZeroFirstAssess: removeZeroFirstAssess(),
  //   removeZeroExam: removeZeroExam(),
  //   studentFirstAssess,
  //   additionalCreds,
  // });

  console.log({ user, studentByClass2, locationState, principalClassName });

  return (
    <div className='results-sheet'>
      <GoBack />
      {user?.designation_name !== "Student" && (
        <StudentsResults
          studentByClassAndSession={studentByClass2}
          onProfileSelect={(x) => {
            setStudentData(x);
            setInitGetExistingSecondHalfResult(true);
          }}
          isLoading={isLoading}
          studentData={studentData}
          idWithComputedResult={idWithComputedResult}
        />
      )}
      <PageSheet
      // style={{
      //   background: "white",
      //   padding: "20px, 20px",
      //   overFlow: "auto",
      //   minWidth: "700px",
      // }}
      >
        <div className='mb-3'>
          <Button
            onClick={() => {
              setChangeTableStyle(true);
              setTimeout(() => {
                if (pdfExportComponent.current) {
                  handlePrint();
                }
              }, 1000);
              setTimeout(() => {
                setChangeTableStyle(false);
              }, 3000);
            }}
          >
            <FontAwesomeIcon icon={faPrint} /> Print
          </Button>
        </div>

        <div
          ref={pdfExportComponent}
          className='first-level-results-sheet preschool first-half'
          // style={{ overFlow: "auto", minWidth: "700px" }}
        >
          {/* <ResultHeader user={user} studentImage={additionalCreds?.student_image}/> */}
          <ResultHeader
            user={user}
            changeTableStyle={changeTableStyle}
            studentImage={studentData?.image}
          />
          <div
            className={`${
              changeTableStyle
                ? "preschool-result-table"
                : "preschool-result-table2"
            }`}
          >
            {/* Academic session title */}
            <div className='table-head'>
              <h3
                style={{
                  fontSize: "18px",
                  lineHeight: "16px",
                }}
              >
                {locationState?.creds?.session} Academic Session
              </h3>
            </div>

            <div
              className='student-creds text-center'
              // style={{ overFlowX: "scroll", minWidth: "700px" }}
            >
              {/*  */}
              <div style={{ display: "flex", width: "100%" }}>
                <div className='table-data' style={{ flex: "1" }}>
                  <h4
                    style={{
                      color: "green",
                      fontSize: "15px",
                      lineHeight: "16px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    STUDENT'S NAME
                  </h4>
                </div>
                <div className='table-data' style={{ flex: "1" }}>
                  <h4
                    style={{
                      color: "green",
                      fontSize: "15px",
                      lineHeight: "16px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    GENDER
                  </h4>
                </div>
                <div className='table-data' style={{ flex: "1" }}>
                  <h4
                    style={{
                      color: "green",
                      fontSize: "15px",
                      lineHeight: "16px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    TERM
                  </h4>
                </div>
                <div className='table-data' style={{ flex: "1" }}>
                  <h4
                    style={{
                      color: "green",
                      fontSize: "15px",
                      lineHeight: "16px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    CLASS
                  </h4>
                </div>
                <div className='table-data' style={{ width: "25%" }}>
                  <h4
                    style={{
                      color: "green",
                      fontSize: "15px",
                      lineHeight: "16px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ADMISSION NUMBER
                  </h4>
                </div>
              </div>
              {/*  */}
              <div style={{ display: "flex", width: "100%" }}>
                <div className='table-data' style={{ flex: "1" }}>
                  <h4
                    style={{
                      fontSize: "15px",
                      lineHeight: "16px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {studentData?.firstname} {studentData?.surname}{" "}
                    {studentData?.middlename}
                  </h4>
                </div>
                <div className='table-data' style={{ flex: "1" }}>
                  <h4
                    style={{
                      fontSize: "15px",
                      lineHeight: "16px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {studentData?.gender}
                  </h4>
                </div>
                <div className='table-data' style={{ flex: "1" }}>
                  <h4
                    style={{
                      fontSize: "15px",
                      lineHeight: "16px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {locationState?.creds?.term}
                  </h4>
                </div>
                <div className='table-data' style={{ flex: "1" }}>
                  <h4
                    style={{
                      fontSize: "15px",
                      lineHeight: "16px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {studentData?.present_class} {studentData?.sub_class}
                  </h4>
                </div>
                <div className='table-data' style={{ width: "25%" }}>
                  <h4
                    style={{
                      fontSize: "15px",
                      lineHeight: "16px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {studentData?.admission_number}
                  </h4>
                </div>
              </div>
            </div>

            {checkResultComputed !== "Released" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  margin: "100px 0",
                }}
              >
                <PiWarningCircleFill
                  style={{
                    fontSize: "80px",
                    width: "50px",
                    height: "50px",
                    color: "red",
                  }}
                />
                <p className='fs-1 fw-bold mt-3'>
                  Result {checkResultComputed}
                </p>
              </div>
            )}

            {/* Attendance record */}
            {checkResultComputed === "Released" && (
              <div className='table-head'>
                <h3
                  style={{
                    fontSize: "18px",
                    lineHeight: "16px",
                  }}
                >
                  Attendance Record
                </h3>
              </div>
            )}
            {checkResultComputed === "Released" && (
              <div className='student-creds text-center'>
                <div>
                  <div className='table-data'>
                    <h4
                      style={{
                        color: "green",
                        fontSize: "15px",
                        lineHeight: "16px",
                      }}
                    >
                      NUMBER OF TIMES SCHOOL OPENED
                    </h4>
                  </div>
                  <div className='table-data'>
                    <h4
                      style={{
                        color: "green",
                        fontSize: "15px",
                        lineHeight: "16px",
                      }}
                    >
                      NUMBER OF TIMES PRESENT
                    </h4>
                  </div>
                  <div className='table-data'>
                    <h4
                      style={{
                        color: "green",
                        fontSize: "15px",
                        lineHeight: "16px",
                      }}
                    >
                      NUMBER OF TIMES ABSENT
                    </h4>
                  </div>
                  <div className='table-data'>
                    <h4
                      style={{
                        color: "green",
                        fontSize: "15px",
                        lineHeight: "16px",
                      }}
                    >
                      TERM ENDS
                    </h4>
                  </div>
                  <div className='table-data'>
                    <h4
                      style={{
                        color: "green",
                        fontSize: "15px",
                        lineHeight: "16px",
                      }}
                    >
                      TERM BEGINS
                    </h4>
                  </div>
                </div>
                <div>
                  <div className='table-data'>
                    <h4
                      style={{
                        fontSize: "15px",
                        lineHeight: "16px",
                      }}
                    >
                      {additionalCreds?.school_opened ?? "--"}
                    </h4>
                  </div>
                  <div className='table-data'>
                    <h4
                      style={{
                        fontSize: "15px",
                        lineHeight: "16px",
                      }}
                    >
                      {additionalCreds?.times_present ?? "--"}
                    </h4>
                  </div>
                  <div className='table-data'>
                    <h4
                      style={{
                        fontSize: "15px",
                        lineHeight: "16px",
                      }}
                    >
                      {additionalCreds?.times_absent ?? "--"}
                    </h4>
                  </div>
                  <div className='table-data'>
                    <h4
                      style={{
                        fontSize: "15px",
                        lineHeight: "16px",
                      }}
                    >
                      {academicDate?.session_ends ?? "--"}
                    </h4>
                  </div>
                  <div className='table-data'>
                    <h4
                      style={{
                        fontSize: "15px",
                        lineHeight: "16px",
                      }}
                    >
                      {academicDate?.session_resumes ?? "--"}
                    </h4>
                  </div>
                </div>
              </div>
            )}

            {/* Evaluation report */}
            {checkResultComputed === "Released" && (
              <div className='table-head'>
                <h3
                  style={{
                    fontSize: "18px",
                    lineHeight: "16px",
                  }}
                >
                  Evaluation Report
                </h3>
              </div>
            )}

            {checkResultComputed === "Released" && (
              <div className='first-half-result-table second-half-result-table'>
                <div style={{ display: "flex" }}>
                  <div className='table-data' style={{ width: "25%" }}></div>
                  {maxScores?.has_two_assessment && (
                    <div
                      className='table-data'
                      style={{ flex: "1", textAlign: "center" }}
                    >
                      <h4
                        style={{
                          color: "green",
                          fontSize: "14px",
                          lineHeight: "16px",
                        }}
                      >
                        First Assessment
                      </h4>
                    </div>
                  )}
                  {maxScores?.has_two_assessment && (
                    <div
                      className='table-data'
                      style={{ flex: "1", textAlign: "center" }}
                    >
                      <h4
                        style={{
                          color: "green",
                          fontSize: "14px",
                          lineHeight: "16px",
                        }}
                      >
                        Second Assessment
                      </h4>
                    </div>
                  )}
                  {!maxScores?.has_two_assessment && (
                    <div
                      className='table-data'
                      style={{ flex: "1", textAlign: "center" }}
                    >
                      <h4
                        style={{
                          color: "green",
                          fontSize: "15px",
                          lineHeight: "16px",
                        }}
                      >
                        Assessment
                      </h4>
                    </div>
                  )}
                  <div
                    className='table-data'
                    style={{ flex: "1", textAlign: "center" }}
                  >
                    <h4
                      style={{
                        color: "green",
                        fontSize: "15px",
                        lineHeight: "16px",
                      }}
                    >
                      Exam
                    </h4>
                  </div>
                  <div
                    className='table-data'
                    style={{ flex: "1", textAlign: "center" }}
                  >
                    <h4
                      style={{
                        color: "green",
                        fontSize: "15px",
                        lineHeight: "16px",
                      }}
                    >
                      Total Score
                    </h4>
                  </div>
                  <div
                    className='table-data'
                    style={{ flex: "1", textAlign: "center" }}
                  >
                    <h4
                      style={{
                        color: "green",
                        fontSize: "15px",
                        lineHeight: "16px",
                      }}
                    >
                      Grade
                    </h4>
                  </div>
                  <div
                    className='table-data'
                    style={{ flex: "1", textAlign: "center" }}
                  >
                    <h4
                      style={{
                        color: "green",
                        fontSize: "15px",
                        lineHeight: "16px",
                      }}
                    >
                      Remark
                    </h4>
                  </div>
                </div>

                <div style={{ display: "flex" }}>
                  <div className='table-data' style={{ width: "25%" }}>
                    <h4
                      style={{
                        color: "green",
                        fontSize: "15px",
                        lineHeight: "16px",
                      }}
                    >
                      Max Score Obtainable
                    </h4>
                  </div>
                  {maxScores?.has_two_assessment && (
                    <div
                      className='table-data'
                      style={{ flex: "1", textAlign: "center" }}
                    >
                      <h4
                        style={{
                          fontSize: "15px",
                          lineHeight: "16px",
                        }}
                      >
                        {maxScores?.first_assessment ?? "--"}
                      </h4>
                    </div>
                  )}
                  {maxScores?.has_two_assessment && (
                    <div
                      className='table-data'
                      style={{ flex: "1", textAlign: "center" }}
                    >
                      <h4
                        style={{
                          fontSize: "15px",
                          lineHeight: "16px",
                        }}
                      >
                        {maxScores?.second_assessment ?? "--"}
                      </h4>
                    </div>
                  )}
                  {!maxScores?.has_two_assessment && (
                    <div
                      className='table-data'
                      style={{ flex: "1", textAlign: "center" }}
                    >
                      <h4
                        style={{
                          fontSize: "15px",
                          lineHeight: "16px",
                        }}
                      >
                        {maxScores?.midterm ?? "--"}
                      </h4>
                    </div>
                  )}
                  <div
                    className='table-data'
                    style={{ flex: "1", textAlign: "center" }}
                  >
                    <h4
                      style={{
                        fontSize: "15px",
                        lineHeight: "16px",
                      }}
                    >
                      {maxScores?.exam ?? "--"}
                    </h4>
                  </div>
                  <div
                    className='table-data'
                    style={{ flex: "1", textAlign: "center" }}
                  >
                    <h4
                      style={{
                        fontSize: "15px",
                        lineHeight: "16px",
                      }}
                    >
                      {maxScores?.total ?? "--"}
                    </h4>
                  </div>
                  <div
                    className='table-data'
                    style={{ flex: "1", textAlign: "center" }}
                  >
                    <h4
                      style={{
                        color: "white",
                        fontSize: "15px",
                        lineHeight: "16px",
                      }}
                    >
                      A+
                    </h4>
                  </div>
                  <div
                    className='table-data'
                    style={{ flex: "1", textAlign: "center" }}
                  >
                    <h4
                      style={{
                        color: "white",
                        fontSize: "15px",
                        lineHeight: "16px",
                      }}
                    >
                      Excellent
                    </h4>
                  </div>
                </div>

                {removeZeroExam()?.map((s, index) => {
                  // let cumtotal = [];
                  const fAssess = removeZeroFirstAssess()?.find(
                    (x) => x.subject === s.subject
                  )?.score;

                  const sAssess = removeZeroSecondAssess()?.find(
                    (x) => x.subject === s.subject
                  )?.score;

                  const mAssess = removeZeroMidterm()?.find(
                    (x) => x.subject === s.subject
                  )?.score;

                  const totalScores = maxScores?.has_two_assessment
                    ? (
                        Number(fAssess ?? 0) +
                        Number(sAssess ?? 0) +
                        Number(s.score ?? 0)
                      ).toFixed(2)
                    : (Number(mAssess ?? 0) + Number(s.score ?? 0)).toFixed(2);

                  // cumtotal.push(totalScores);
                  // if (totalScores === 0) {
                  //   return;
                  // }

                  // console.log({ cumtotal });

                  return (
                    <div className='' key={index}>
                      {
                        <div style={{ display: "flex" }}>
                          <div className='table-data' style={{ width: "25%" }}>
                            <p
                              style={{
                                fontSize: "15px",
                                lineHeight: "16px",
                                fontWeight: "bold",
                                // textAlign: "justify",
                                // padding: "0px 10px",
                                // fontStyle: "italic"
                              }}
                            >
                              {s?.subject ?? "--"}
                            </p>
                          </div>
                          {maxScores?.has_two_assessment && (
                            <div
                              className='table-data'
                              style={{ flex: "1", textAlign: "center" }}
                            >
                              <p
                                style={{
                                  fontSize: "15px",
                                  lineHeight: "16px",
                                  fontWeight: "bold",
                                }}
                              >
                                {fAssess}
                              </p>
                            </div>
                          )}
                          {maxScores?.has_two_assessment && (
                            <div
                              className='table-data'
                              style={{ flex: "1", textAlign: "center" }}
                            >
                              <p
                                style={{
                                  fontSize: "15px",
                                  lineHeight: "16px",
                                  fontWeight: "bold",
                                }}
                              >
                                {sAssess}
                              </p>
                            </div>
                          )}
                          {!maxScores?.has_two_assessment && (
                            <div
                              className='table-data'
                              style={{ flex: "1", textAlign: "center" }}
                            >
                              <p
                                style={{
                                  fontSize: "15px",
                                  lineHeight: "16px",
                                  fontWeight: "bold",
                                }}
                              >
                                {mAssess}
                              </p>
                            </div>
                          )}
                          <div
                            className='table-data'
                            style={{ flex: "1", textAlign: "center" }}
                          >
                            <p
                              style={{
                                fontSize: "15px",
                                lineHeight: "16px",
                                fontWeight: "bold",
                              }}
                            >
                              {s.score}
                            </p>
                          </div>
                          <div
                            className='table-data'
                            style={{ flex: "1", textAlign: "center" }}
                          >
                            <p
                              style={{
                                fontSize: "15px",
                                lineHeight: "16px",
                                fontWeight: "bold",
                              }}
                            >
                              {totalScores}
                            </p>
                          </div>
                          <div
                            className='table-data'
                            style={{ flex: "1", textAlign: "center" }}
                          >
                            <p
                              style={{
                                fontSize: "15px",
                                lineHeight: "16px",
                                fontWeight: "bold",
                              }}
                            >
                              {maxScores?.has_two_assessment
                                ? getScoreRemark(totalScores)?.grade
                                : getScoreRemark(totalScores)?.grade}
                            </p>
                          </div>
                          <div
                            className='table-data'
                            style={{ flex: "1", textAlign: "center" }}
                          >
                            <p
                              style={{
                                fontSize: "14px",
                                lineHeight: "16px",
                                fontWeight: "bold",
                              }}
                            >
                              {maxScores?.has_two_assessment
                                ? getScoreRemark(
                                    Number(
                                      studentFirstAssess?.find(
                                        (x) => x.subject === s.subject
                                      )?.score ?? 0
                                    ) +
                                      Number(
                                        studentSecondAssess?.find(
                                          (x) => x.subject === s.subject
                                        )?.score ?? 0
                                      ) +
                                      Number(s.score)
                                  )?.remark
                                : getScoreRemark(
                                    Number(
                                      studentMidterm?.find(
                                        (x) => x.subject === s.subject
                                      )?.score ?? 0
                                    ) + Number(s.score)
                                  )?.remark}
                            </p>
                          </div>
                        </div>
                      }
                    </div>
                  );
                })}
              </div>
            )}

            {/* <div className='table-data'>
              <br />
              <br />
            </div> */}

            {/* student total score */}
            {checkResultComputed === "Released" && (
              <div className='first-half-result-table text-center'>
                <div className='table-row'>
                  <div className='table-data'>
                    <h4
                      style={{
                        color: "green",
                        fontSize: "15px",
                        lineHeight: "16px",
                      }}
                    >
                      Total Subjects
                    </h4>
                  </div>
                  <div className='table-data'>
                    <h4
                      style={{
                        // color: "green",
                        fontSize: "15px",
                        lineHeight: "16px",
                      }}
                    >
                      {removeZeroExam()?.length}
                    </h4>
                  </div>
                  <div className='table-data'>
                    <h4
                      style={{
                        color: "green",
                        fontSize: "15px",
                        lineHeight: "16px",
                      }}
                    >
                      Total Score
                    </h4>
                  </div>
                  <div className='table-data'>
                    <h4
                      style={{
                        // color: "green",
                        fontSize: "15px",
                        lineHeight: "16px",
                      }}
                    >
                      {totalScore}
                    </h4>
                  </div>
                </div>
              </div>
            )}

            {/* class average */}
            {checkResultComputed === "Released" && (
              <div className='first-half-result-table text-center'>
                <div className='table-row'>
                  <div className='table-data'>
                    <h4
                      style={{
                        color: "green",
                        fontSize: "15px",
                        lineHeight: "16px",
                      }}
                    >
                      Class Average
                    </h4>
                  </div>
                  <div className='table-data'>
                    <h4
                      style={{
                        color: "green",
                        fontSize: "15px",
                        lineHeight: "16px",
                      }}
                    >
                      Student's Average
                    </h4>
                  </div>
                  <div className='table-data'>
                    <h4
                      style={{
                        color: "green",
                        fontSize: "15px",
                        lineHeight: "16px",
                      }}
                    >
                      Student's Grade
                    </h4>
                  </div>
                </div>

                <div className='table-row'>
                  <div className='table-data'>
                    <p
                      style={{
                        fontSize: "15px",
                        lineHeight: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      {Number(classAverage?.["Class Average"] || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className='table-data'>
                    <p
                      style={{
                        fontSize: "15px",
                        lineHeight: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      {/* {Number(classAverage?.["Student Average"] || 0).toFixed(2)} */}
                      {(totalScore / removeZeroExam()?.length).toFixed(2)}
                    </p>
                  </div>
                  <div className='table-data'>
                    <p
                      style={{
                        fontSize: "15px",
                        lineHeight: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      {/* {classAverage?.["Grade"]} */}
                      {
                        getScoreRemark(
                          (totalScore / removeZeroExam()?.length).toFixed(2)
                        )?.remark
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Abacus */}
            {checkResultComputed === "Released" &&
              !user?.campus?.includes("College") && (
                <div
                  className='table-head'
                  // style={{
                  //   background: "#9c0f0f000",
                  // }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      lineHeight: "16px",
                    }}
                  >
                    Abacus
                  </h3>
                </div>
              )}
            {checkResultComputed === "Released" &&
              !user?.campus?.includes("College") && (
                <div className='first-half-result-table text-center'>
                  <div className='table-row'>
                    {/* <div className='table-data'></div> */}
                    <div className='table-data'>
                      <p
                        style={{
                          fontSize: "15px",
                          lineHeight: "16px",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                        }}
                      >
                        Excellent
                      </p>
                    </div>
                    <div className='table-data'>
                      <p
                        style={{
                          fontSize: "15px",
                          lineHeight: "16px",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                        }}
                      >
                        Good
                      </p>
                    </div>
                    <div className='table-data'>
                      <p
                        style={{
                          fontSize: "15px",
                          lineHeight: "16px",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                        }}
                      >
                        Fair
                      </p>
                    </div>
                    <div className='table-data'>
                      <p
                        style={{
                          fontSize: "15px",
                          lineHeight: "16px",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                        }}
                      >
                        Need Improvement
                      </p>
                    </div>
                  </div>
                  <div className='table-row'>
                    {/* <div className='table-data'>
                  <h4
                    style={{
                      fontSize: "15px",
                      lineHeight: "16px",
                    }}
                  >
                    Abacus
                  </h4>
                </div> */}
                    <div className='table-data'>
                      <p>
                        {additionalCreds?.abacus?.name === "Excellent" && (
                          <FontAwesomeIcon
                            icon={faCheck}
                            color='green'
                            style={{ fontSize: "24px" }}
                          />
                        )}
                      </p>
                    </div>
                    <div className='table-data'>
                      <p>
                        {additionalCreds?.abacus?.name === "Good" && (
                          <FontAwesomeIcon
                            icon={faCheck}
                            color='green'
                            style={{ fontSize: "24px" }}
                          />
                        )}
                      </p>
                    </div>
                    <div className='table-data'>
                      <p>
                        {additionalCreds?.abacus?.name === "Fair" && (
                          <FontAwesomeIcon
                            icon={faCheck}
                            color='green'
                            style={{ fontSize: "24px" }}
                          />
                        )}
                      </p>
                    </div>
                    <div className='table-data'>
                      <p>
                        {additionalCreds?.abacus?.name ===
                          "Need Improvement" && (
                          <FontAwesomeIcon
                            icon={faCheck}
                            color='green'
                            style={{ fontSize: "24px" }}
                          />
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {/* academic rating */}
            {checkResultComputed === "Released" && (
              <div className='table-head'>
                <h3
                  style={{
                    fontSize: "18px",
                    lineHeight: "16px",
                  }}
                >
                  Academic Rating
                </h3>
              </div>
            )}
            {checkResultComputed === "Released" && (
              <div className='second-half-academic-rating text-center'>
                {grading?.map((grade) => (
                  <div key={grade?.id} className='table-data'>
                    <p
                      style={{
                        fontSize: "15px",
                        lineHeight: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      {grade?.grade} - [{grade?.score_from} - {grade?.score_to}%
                      - {grade?.remark}]
                    </p>
                  </div>
                ))}
              </div>
            )}

            {checkResultComputed === "Released" &&
              locationState?.creds?.term === "Third Term" && (
                <div className='table-head'>
                  <h3
                    style={{
                      fontSize: "18px",
                      lineHeight: "16px",
                    }}
                  >
                    Cummulative Scores
                  </h3>
                </div>
              )}

            {checkResultComputed === "Released" &&
              locationState?.creds?.term === "Third Term" && (
                <div className='first-half-result-table second-half-cummulative-scores-table'>
                  <div className='table-row'>
                    <div className='table-data'>
                      <h4
                        style={{
                          color: "green",
                          fontSize: "15px",
                          lineHeight: "16px",
                        }}
                      >
                        Subjects
                      </h4>
                    </div>
                    <div className='right-data'>
                      <div className='table-data'>
                        <h4
                          style={{
                            color: "green",
                            fontSize: "15px",
                            lineHeight: "16px",
                          }}
                        >
                          First Term
                        </h4>
                      </div>
                      {locationState?.creds?.term !== "First Term" && (
                        <div className='table-data'>
                          <h4
                            style={{
                              color: "green",
                              fontSize: "15px",
                              lineHeight: "16px",
                            }}
                          >
                            Second Term
                          </h4>
                        </div>
                      )}
                      {!(
                        locationState?.creds?.term === "First Term" ||
                        locationState?.creds?.term === "Second Term"
                      ) ? (
                        <div className='table-data'>
                          <h4
                            style={{
                              color: "green",
                              fontSize: "15px",
                              lineHeight: "16px",
                            }}
                          >
                            Third Term
                          </h4>
                        </div>
                      ) : null}
                      {!(
                        locationState?.creds?.term === "First Term" ||
                        locationState?.creds?.term === "Second Term"
                      ) ? (
                        <div className='table-data'>
                          <h4
                            style={{
                              color: "green",
                              fontSize: "15px",
                              lineHeight: "16px",
                            }}
                          >
                            Total
                          </h4>
                        </div>
                      ) : null}
                      <div className='table-data'>
                        <h4
                          style={{
                            color: "green",
                            fontSize: "15px",
                            lineHeight: "16px",
                          }}
                        >
                          Average
                        </h4>
                      </div>
                      <div className='table-data'>
                        <h4
                          style={{
                            color: "green",
                            fontSize: "15px",
                            lineHeight: "16px",
                          }}
                        >
                          Remark
                        </h4>
                      </div>
                      <div className='table-data'>
                        <h4
                          style={{
                            color: "green",
                            fontSize: "15px",
                            lineHeight: "16px",
                          }}
                        >
                          Rank
                        </h4>
                      </div>
                      <div className='table-data'>
                        <h4
                          style={{
                            color: "green",
                            fontSize: "15px",
                            lineHeight: "16px",
                          }}
                        >
                          Class Average
                        </h4>
                      </div>
                      <div className='table-data'>
                        <h4
                          style={{
                            color: "green",
                            fontSize: "15px",
                            lineHeight: "16px",
                          }}
                        >
                          Highest
                        </h4>
                      </div>
                      <div className='table-data'>
                        <h4
                          style={{
                            color: "green",
                            fontSize: "15px",
                            lineHeight: "16px",
                          }}
                        >
                          Lowest
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className='table-row'>
                    <div className='table-data'>
                      <h4
                        style={{
                          color: "green",
                          fontSize: "15px",
                          lineHeight: "16px",
                        }}
                      >
                        Max Scores
                      </h4>
                    </div>
                    <div className='right-data'>
                      <div className='table-data'>
                        <h4
                          style={{
                            fontSize: "15px",
                            lineHeight: "16px",
                          }}
                        >
                          100
                        </h4>
                      </div>
                      {locationState?.creds?.term !== "First Term" && (
                        <div className='table-data'>
                          <h4
                            style={{
                              fontSize: "15px",
                              lineHeight: "16px",
                            }}
                          >
                            100
                          </h4>
                        </div>
                      )}
                      {!(
                        locationState?.creds?.term === "First Term" ||
                        locationState?.creds?.term === "Second Term"
                      ) ? (
                        <div className='table-data'>
                          <h4
                            style={{
                              fontSize: "15px",
                              lineHeight: "16px",
                            }}
                          >
                            100
                          </h4>
                        </div>
                      ) : null}
                      {!(
                        locationState?.creds?.term === "First Term" ||
                        locationState?.creds?.term === "Second Term"
                      ) ? (
                        <div className='table-data'>
                          <h4
                            style={{
                              fontSize: "15px",
                              lineHeight: "16px",
                            }}
                          >
                            100
                          </h4>
                        </div>
                      ) : null}
                      <div className='table-data'>
                        <h4
                          style={{
                            fontSize: "15px",
                            lineHeight: "16px",
                          }}
                        >
                          100.00
                        </h4>
                      </div>
                      <div className='table-data'>
                        <h4
                          style={{
                            fontSize: "15px",
                            lineHeight: "16px",
                          }}
                        >
                          Excellent
                        </h4>
                      </div>
                      <div className='table-data'>
                        <h4
                          style={{
                            fontSize: "15px",
                            lineHeight: "16px",
                          }}
                        >
                          N<sup>th</sup>
                        </h4>
                      </div>
                      <div className='table-data'>
                        <h4
                          style={{
                            fontSize: "15px",
                            lineHeight: "16px",
                          }}
                        >
                          100
                        </h4>
                      </div>
                      <div className='table-data'>
                        <h4
                          style={{
                            fontSize: "15px",
                            lineHeight: "16px",
                          }}
                        >
                          100
                        </h4>
                      </div>
                      <div className='table-data'>
                        <h4
                          style={{
                            fontSize: "15px",
                            lineHeight: "16px",
                          }}
                        >
                          100
                        </h4>
                      </div>
                    </div>
                  </div>
                  {cummulativeScores?.map((score, key) => (
                    <div className='table-row' key={key}>
                      <div className='table-data'>
                        <p
                          style={{
                            fontSize: "15px",
                            lineHeight: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          {score.subject}
                        </p>
                      </div>
                      <div className='right-data'>
                        <div className='table-data'>
                          <p
                            style={{
                              fontSize: "15px",
                              lineHeight: "16px",
                              fontWeight: "bold",
                            }}
                          >
                            {score["First Term"]}
                          </p>
                        </div>
                        {locationState?.creds?.term !== "First Term" && (
                          <div className='table-data'>
                            <p
                              style={{
                                fontSize: "15px",
                                lineHeight: "16px",
                                fontWeight: "bold",
                              }}
                            >
                              {score["Second Term"]}
                            </p>
                          </div>
                        )}
                        {!(
                          locationState?.creds?.term === "First Term" ||
                          locationState?.creds?.term === "Second Term"
                        ) ? (
                          <div className='table-data'>
                            <p
                              style={{
                                fontSize: "15px",
                                lineHeight: "16px",
                                fontWeight: "bold",
                              }}
                            >
                              {score["Third Term"]}
                            </p>
                          </div>
                        ) : null}
                        {!(
                          locationState?.creds?.term === "First Term" ||
                          locationState?.creds?.term === "Second Term"
                        ) ? (
                          <div className='table-data'>
                            <p
                              style={{
                                fontSize: "15px",
                                lineHeight: "16px",
                                fontWeight: "bold",
                              }}
                            >
                              {score["Total Score"]}
                            </p>
                          </div>
                        ) : null}
                        <div className='table-data'>
                          <p
                            style={{
                              fontSize: "15px",
                              lineHeight: "16px",
                              fontWeight: "bold",
                            }}
                          >
                            {Number(score["Average Score"])?.toFixed(2)}
                          </p>
                        </div>
                        <div className='table-data'>
                          <p
                            style={{
                              fontSize: "15px",
                              lineHeight: "16px",
                              fontWeight: "bold",
                            }}
                          >
                            {score["Remark"]}
                          </p>
                        </div>
                        <div className='table-data'>
                          <p
                            style={{
                              fontSize: "15px",
                              lineHeight: "16px",
                              fontWeight: "bold",
                            }}
                          >
                            {score["Rank"]}
                          </p>
                        </div>
                        <div className='table-data'>
                          <p
                            style={{
                              fontSize: "15px",
                              lineHeight: "16px",
                              fontWeight: "bold",
                            }}
                          >
                            {Number(score["Class Average"])?.toFixed(2)}
                          </p>
                        </div>
                        <div className='table-data'>
                          <p
                            style={{
                              fontSize: "15px",
                              lineHeight: "16px",
                              fontWeight: "bold",
                            }}
                          >
                            {Number(score["Highest"])}
                          </p>
                        </div>
                        <div className='table-data'>
                          <p
                            style={{
                              fontSize: "15px",
                              lineHeight: "16px",
                              fontWeight: "bold",
                            }}
                          >
                            {Number(score["Lowest"])}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {locationState?.creds?.term === "Third Term" && (
                    <div className='table-row year-total-score'>
                      <div className='table-data'>
                        <p
                          style={{
                            fontSize: "15px",
                            lineHeight: "16px",
                          }}
                        >
                          End of year total score
                        </p>
                      </div>
                      <div className='right-data'>
                        <div className='table-data'></div>
                        <div className='table-data'></div>
                        <div className='table-data'></div>
                        <div className='table-data'>
                          <p
                            style={{
                              fontSize: "15px",
                              lineHeight: "16px",
                            }}
                          >
                            {getTotalYearlyScores()}
                          </p>
                        </div>
                        <div className='table-data'></div>
                        <div className='table-data'></div>
                        <div className='table-data'></div>
                        <div className='table-data'></div>
                        <div className='table-data'></div>
                        <div className='table-data'></div>
                      </div>
                    </div>
                  )}
                  {/* <div className='table-data'>
                  <br />
                  <br />
                </div> */}
                </div>
              )}

            {checkResultComputed === "Released" &&
              locationState?.creds?.term === "Third Term" && (
                <div className='first-half-result-table text-center'>
                  <div className='table-row'>
                    <div className='table-data'>
                      <h4
                        style={{
                          fontSize: "15px",
                          lineHeight: "16px",
                        }}
                      >
                        End of Year Class Average
                      </h4>
                    </div>
                    <div className='table-data'>
                      <h4
                        style={{
                          fontSize: "15px",
                          lineHeight: "16px",
                        }}
                      >
                        End of Year Pupil's Average
                      </h4>
                    </div>
                    <div className='table-data'>
                      <h4
                        style={{
                          fontSize: "15px",
                          lineHeight: "16px",
                        }}
                      >
                        End of Year Pupil's Grade
                      </h4>
                    </div>
                  </div>
                  <div className='table-row'>
                    <div className='table-data'>
                      <p
                        style={{
                          fontSize: "15px",
                          lineHeight: "16px",
                        }}
                      >
                        {Number(
                          yearlyClassAverage?.["Class Average"] || 0
                        ).toFixed(2)}
                      </p>
                    </div>
                    <div className='table-data'>
                      <p
                        style={{
                          fontSize: "15px",
                          lineHeight: "16px",
                        }}
                      >
                        {Number(
                          yearlyClassAverage?.["Student Average"] || 0
                        ).toFixed(2)}
                      </p>
                    </div>
                    <div className='table-data'>
                      <p
                        style={{
                          fontSize: "15px",
                          lineHeight: "16px",
                        }}
                      >
                        {yearlyClassAverage?.["Grade"]}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {checkResultComputed === "Released" &&
              user?.campus?.includes("College") && (
                <div className='table-data'>
                  <br />
                  <br />
                </div>
              )}

            {/* performance Remark */}
            {checkResultComputed === "Released" &&
              user?.campus?.includes("College") && (
                <div className='table-data performance-remark'>
                  <h1
                    style={{
                      fontSize: "16px",
                      lineHeight: "18px",
                    }}
                  >
                    Progression Remark:{" "}
                  </h1>
                  <h1
                    style={{
                      fontSize: "18px",
                      lineHeight: "20px",
                    }}
                  >
                    {additionalCreds?.performance_remark}
                  </h1>
                </div>
              )}

            {checkResultComputed === "Released" &&
              user?.campus?.includes("College") && (
                <div className='table-data'>
                  <br />
                  <br />
                </div>
              )}

            {/* Performance Chart */}
            {checkResultComputed === "Released" &&
              user?.campus?.includes("College") && (
                <div className='table-data'>
                  <div className='table-chart-wrapper'>
                    <h4
                      style={{
                        fontSize: "18px",
                        lineHeight: "16px",
                        textTransform: "uppercase",
                        marginBottom: "10px",
                        color: "green",
                        // textAlign: "justify",
                        // padding: "0px 10px",
                        // fontStyle: "italic"
                      }}
                    >
                      Performance Chart
                    </h4>

                    <div className='table-chart'>
                      <ColumnChart
                        xTitle='Subjects'
                        yTitle='Scores'
                        categories={generateChartData()?.categories || []}
                        data={[
                          {
                            name: chartTitle.first,
                            data: generateChartData()?.first || [],
                          },
                          {
                            name: chartTitle.second,
                            data: generateChartData()?.second || [],
                          },
                          {
                            name: chartTitle.third,
                            data: generateChartData()?.third || [],
                          },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              )}

            {checkResultComputed === "Released" &&
              user?.campus?.includes("College") && (
                <div className=''>
                  <h4
                    style={{
                      fontSize: "18px",
                      lineHeight: "16px",
                      textTransform: "uppercase",
                      marginBottom: "10px",
                      color: "green",
                      width: "100%",
                      textAlign: "center",
                      paddingTop: "10px",
                      // textAlign: "justify",
                      // padding: "0px 10px",
                      // fontStyle: "italic"
                    }}
                  >
                    Grades
                  </h4>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))", // Adjust the column width as needed
                      // gap: "30px",
                      width: "100%",
                    }}
                  >
                    {resultGrading?.map((attr, i) => (
                      <div
                        key={i}
                        style={{
                          border: "1.5px solid rgba(3, 87, 35, 0.5)",
                          padding: "1rem 2rem",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <div
                          className='d-flex flex-column gap-4 align-items-center'
                          style={{
                            width: "100px",
                          }}
                        >
                          <p
                            style={{
                              textAlign: "center",
                              fontSize: "15px",
                              lineHeight: "16px",
                              color: "green",
                            }}
                          >
                            {attr.grade}
                          </p>
                          <p
                            style={{
                              textAlign: "center",
                              fontSize: "15px",
                              lineHeight: "16px",
                            }}
                          >
                            {attr.score_from} - {attr.score_to}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* pupil's monitoring Data */}
            {checkResultComputed === "Released" &&
              !user?.campus?.includes("College") && (
                <div className='table-head'>
                  <h3
                    style={{
                      fontSize: "18px",
                      lineHeight: "20px",
                    }}
                  >
                    Pupil's monitoring data
                  </h3>
                </div>
              )}
            {checkResultComputed === "Released" &&
              !user?.campus?.includes("College") && (
                <div className='first-half-result-table skills-table'>
                  <div className='table-row'>
                    <div className='table-data'></div>
                    <div className='table-data'>
                      <p
                        style={{
                          fontSize: "15px",
                          lineHeight: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        Excellent
                      </p>
                    </div>
                    <div className='table-data'>
                      <p
                        style={{
                          fontSize: "15px",
                          lineHeight: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        Good
                      </p>
                    </div>
                    <div className='table-data'>
                      <p
                        style={{
                          fontSize: "15px",
                          lineHeight: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        Fair
                      </p>
                    </div>
                    <div className='table-data'>
                      <p
                        style={{
                          fontSize: "15px",
                          lineHeight: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        Need Improvement
                      </p>
                    </div>
                  </div>
                  {additionalCreds?.pupil_report?.map((skill, key) => (
                    <div className='table-row' key={key}>
                      <div className='table-data'>
                        <h4
                          style={{
                            fontSize: "15px",
                            lineHeight: "16px",
                          }}
                        >
                          {skill?.name}
                        </h4>
                      </div>
                      <div className='table-data'>
                        <p>
                          {Number(skill?.score) === 5 && (
                            <FontAwesomeIcon
                              icon={faCheck}
                              color='green'
                              style={{ fontSize: "24px" }}
                            />
                          )}
                        </p>
                      </div>
                      <div className='table-data'>
                        <p>
                          {Number(skill?.score) === 4 && (
                            <FontAwesomeIcon
                              icon={faCheck}
                              color='green'
                              style={{ fontSize: "24px" }}
                            />
                          )}
                        </p>
                      </div>
                      <div className='table-data'>
                        <p>
                          {Number(skill?.score) === 3 && (
                            <FontAwesomeIcon
                              icon={faCheck}
                              color='green'
                              style={{ fontSize: "24px" }}
                            />
                          )}
                        </p>
                      </div>
                      <div className='table-data'>
                        <p>
                          {Number(skill?.score) < 3 && (
                            <FontAwesomeIcon
                              icon={faCheck}
                              color='green'
                              style={{ fontSize: "24px" }}
                            />
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            {/* <div className='table-data'> */}
            {/* <br /> */}
            {/* <br /> */}
            {/* <br /> */}
            {/* <br /> */}
            {/* </div> */}

            {/* Psychomotor Performance */}
            {checkResultComputed === "Released" &&
              !user?.campus?.includes("College") && (
                <div className='table-head'>
                  <h3
                    style={{
                      fontSize: "18px",
                      lineHeight: "16px",
                    }}
                  >
                    Psychomotor Performance
                  </h3>
                </div>
              )}
            {checkResultComputed === "Released" &&
              !user?.campus?.includes("College") && (
                <div className='first-half-result-table skills-table'>
                  <div className='table-row'>
                    <div className='table-data'></div>
                    <div className='table-data'>
                      <p
                        style={{
                          fontSize: "15px",
                          lineHeight: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        Excellent
                      </p>
                    </div>
                    <div className='table-data'>
                      <p
                        style={{
                          fontSize: "15px",
                          lineHeight: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        Good
                      </p>
                    </div>
                    <div className='table-data'>
                      <p
                        style={{
                          fontSize: "15px",
                          lineHeight: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        Fair
                      </p>
                    </div>
                    <div className='table-data'>
                      <p
                        style={{
                          fontSize: "15px",
                          lineHeight: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        Need Improvement
                      </p>
                    </div>
                  </div>
                  {additionalCreds?.psychomotor_performance?.map(
                    (skill, key) => (
                      <div className='table-row' key={key}>
                        <div className='table-data'>
                          <h4
                            style={{
                              fontSize: "15px",
                              lineHeight: "16px",
                            }}
                          >
                            {skill?.name}
                          </h4>
                        </div>
                        <div className='table-data'>
                          <p>
                            {Number(skill?.score) === 5 && (
                              <FontAwesomeIcon
                                icon={faCheck}
                                color='green'
                                style={{ fontSize: "24px" }}
                              />
                            )}
                          </p>
                        </div>
                        <div className='table-data'>
                          <p>
                            {Number(skill?.score) === 4 && (
                              <FontAwesomeIcon
                                icon={faCheck}
                                color='green'
                                style={{ fontSize: "24px" }}
                              />
                            )}
                          </p>
                        </div>
                        <div className='table-data'>
                          <p>
                            {Number(skill?.score) === 3 && (
                              <FontAwesomeIcon
                                icon={faCheck}
                                color='green'
                                style={{ fontSize: "24px" }}
                              />
                            )}
                          </p>
                        </div>
                        <div className='table-data'>
                          <p>
                            {Number(skill?.score) < 3 && (
                              <FontAwesomeIcon
                                icon={faCheck}
                                color='green'
                                style={{ fontSize: "24px" }}
                              />
                            )}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

            {/* <div className='table-data'> */}
            {/* <br /> */}
            {/* <br /> */}
            {/* <br /> */}
            {/* <br /> */}
            {/* </div> */}

            {/* Psychomotor Performance for college*/}
            {checkResultComputed === "Released" &&
              user?.campus?.includes("College") && (
                <div className='table-head'>
                  <h3
                    style={{
                      fontSize: "18px",
                      lineHeight: "16px",
                    }}
                  >
                    Psychomotor Development
                  </h3>
                </div>
              )}
            {checkResultComputed === "Released" &&
              user?.campus?.includes("College") && (
                <div className='' style={{ display: "flex" }}>
                  <div className='' style={{ flex: "1", width: "100%" }}>
                    {user?.campus?.includes("College") && (
                      <div className=''>
                        <div className='table-row' style={{ display: "flex" }}>
                          <div
                            className='table-data'
                            style={{ flex: "2.5" }}
                          ></div>
                          <div
                            className='table-data'
                            style={{ textAlign: "center", flex: "1" }}
                          >
                            <p
                              style={{
                                fontSize: "15px",
                                lineHeight: "16px",
                                fontWeight: "bold",
                              }}
                            >
                              SCORES
                            </p>
                          </div>
                        </div>
                        {additionalCreds?.psychomotor_performance
                          ?.slice(
                            0,
                            Math.round(
                              additionalCreds?.psychomotor_performance?.length /
                                2
                            )
                          )
                          ?.map((skill, key) => (
                            <div
                              className='table-row'
                              key={key}
                              style={{ display: "flex" }}
                            >
                              <div
                                className='table-data'
                                style={{ flex: "2.5" }}
                              >
                                <h4
                                  style={{
                                    fontSize: "15px",
                                    lineHeight: "16px",
                                  }}
                                >
                                  {skill?.name}
                                </h4>
                              </div>
                              <div
                                className='table-data'
                                style={{ textAlign: "center", flex: "1" }}
                              >
                                <p
                                  style={{
                                    fontSize: "15px",
                                    fontWeight: "600",
                                    lineHeight: "16px",
                                  }}
                                >
                                  {skill?.score}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                  <div className='' style={{ flex: "1", width: "100%" }}>
                    {user?.campus?.includes("College") && (
                      <div className=''>
                        <div className='table-row' style={{ display: "flex" }}>
                          <div
                            className='table-data'
                            style={{ flex: "2.5" }}
                          ></div>
                          <div
                            className='table-data'
                            style={{ textAlign: "center", flex: "1" }}
                          >
                            <p
                              style={{
                                fontSize: "15px",
                                lineHeight: "16px",
                                fontWeight: "bold",
                              }}
                            >
                              SCORES
                            </p>
                          </div>
                        </div>
                        {additionalCreds?.psychomotor_performance
                          ?.slice(
                            Math.round(
                              additionalCreds?.psychomotor_performance?.length /
                                2
                            )
                          )
                          ?.map((skill, key) => (
                            <div
                              className='table-row'
                              key={key}
                              style={{ display: "flex" }}
                            >
                              <div
                                className='table-data'
                                style={{ flex: "2.5" }}
                              >
                                <h4
                                  style={{
                                    fontSize: "15px",
                                    lineHeight: "16px",
                                  }}
                                >
                                  {skill?.name}
                                </h4>
                              </div>
                              <div
                                className='table-data'
                                style={{ textAlign: "center", flex: "1" }}
                              >
                                <p
                                  style={{
                                    fontSize: "15px",
                                    fontWeight: "600",
                                    lineHeight: "16px",
                                  }}
                                >
                                  {skill?.score}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* Affective Development for college*/}
            {checkResultComputed === "Released" &&
              user?.campus?.includes("College") && (
                <div className='table-head'>
                  <h3
                    style={{
                      fontSize: "18px",
                      lineHeight: "16px",
                    }}
                  >
                    Affective Development
                  </h3>
                </div>
              )}
            {checkResultComputed === "Released" &&
              user?.campus?.includes("College") && (
                <div className='' style={{ display: "flex" }}>
                  <div className='' style={{ flex: "1", width: "100%" }}>
                    {user?.campus?.includes("College") && (
                      <div className=''>
                        <div className='table-row' style={{ display: "flex" }}>
                          <div
                            className='table-data'
                            style={{ flex: "2.5" }}
                          ></div>
                          <div
                            className='table-data'
                            style={{ textAlign: "center", flex: "1" }}
                          >
                            <p
                              style={{
                                fontSize: "15px",
                                lineHeight: "16px",
                                fontWeight: "bold",
                              }}
                            >
                              SCORES
                            </p>
                          </div>
                        </div>
                        {additionalCreds?.pupil_report
                          ?.slice(
                            0,
                            Math.round(
                              additionalCreds?.pupil_report?.length / 2
                            )
                          )
                          ?.map((skill, key) => (
                            <div
                              className='table-row'
                              key={key}
                              style={{ display: "flex" }}
                            >
                              <div
                                className='table-data'
                                style={{ flex: "2.5" }}
                              >
                                <h4
                                  style={{
                                    fontSize: "15px",
                                    lineHeight: "16px",
                                  }}
                                >
                                  {skill?.name}
                                </h4>
                              </div>
                              <div
                                className='table-data'
                                style={{ textAlign: "center", flex: "1" }}
                              >
                                <p
                                  style={{
                                    fontSize: "15px",
                                    fontWeight: "600",
                                    lineHeight: "16px",
                                  }}
                                >
                                  {skill?.score}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                  <div className='' style={{ flex: "1", width: "100%" }}>
                    {user?.campus?.includes("College") && (
                      <div className=''>
                        <div className='table-row' style={{ display: "flex" }}>
                          <div
                            className='table-data'
                            style={{ flex: "2.5" }}
                          ></div>
                          <div
                            className='table-data'
                            style={{ textAlign: "center", flex: "1" }}
                          >
                            <p
                              style={{
                                fontSize: "15px",
                                lineHeight: "16px",
                                fontWeight: "bold",
                              }}
                            >
                              SCORES
                            </p>
                          </div>
                        </div>
                        {additionalCreds?.pupil_report
                          ?.slice(
                            Math.round(
                              additionalCreds?.pupil_report?.length / 2
                            )
                          )
                          ?.map((skill, key) => (
                            <div
                              className='table-row'
                              key={key}
                              style={{ display: "flex" }}
                            >
                              <div
                                className='table-data'
                                style={{ flex: "2.5" }}
                              >
                                <h4
                                  style={{
                                    fontSize: "15px",
                                    lineHeight: "16px",
                                  }}
                                >
                                  {skill?.name}
                                </h4>
                              </div>
                              <div
                                className='table-data'
                                style={{ textAlign: "center", flex: "1" }}
                              >
                                <p
                                  style={{
                                    fontSize: "15px",
                                    fontWeight: "600",
                                    lineHeight: "16px",
                                  }}
                                >
                                  {skill?.score}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* <div className='table-data'> */}
            {/* <br /> */}
            {/* <br /> */}
            {/* <br /> */}
            {/* <br /> */}
            {/* </div> */}

            {/* Extra curricular activities */}
            {checkResultComputed === "Released" && (
              <div className='table-head'>
                <h3
                  style={{
                    fontSize: "18px",
                    lineHeight: "16px",
                  }}
                >
                  Extra Curricular Activities
                </h3>
              </div>
            )}

            {checkResultComputed === "Released" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", // Adjust the column width as needed
                  // gap: "30px",
                  width: "100%",
                }}
              >
                {activities?.map((attr, i) => (
                  <div
                    key={i}
                    style={{
                      border: "1.5px solid rgba(3, 87, 35, 0.5)",
                      padding: "2rem 3rem",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <div
                      className='d-flex flex-column gap-4 align-items-center'
                      style={{
                        width: "100px",
                      }}
                    >
                      <p
                        style={{
                          textAlign: "center",
                          fontSize: "15px",
                          lineHeight: "16px",
                        }}
                      >
                        {attr.name}
                      </p>
                      <Input
                        type='checkbox'
                        style={{
                          width: "18px",
                          height: "18px",
                          color: "green",
                        }}
                        checked={
                          extraActivities?.find((x) => x.name === attr.name)
                            ?.value === "1"
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* <div className='table-data'> */}
            {/* <br /> */}
            {/* <br /> */}
            {/* <br /> */}
            {/* <br /> */}
            {/* </div> */}

            {/* Class Teachers' Comment */}
            {checkResultComputed === "Released" && (
              <div className='table-head'>
                <h3
                  style={{
                    fontSize: "18px",
                    lineHeight: "16px",
                  }}
                >
                  Class Teachers' General Comment
                </h3>
              </div>
            )}
            {checkResultComputed === "Released" && (
              <div className='comment'>
                <h4
                  style={{
                    fontSize: "18px",
                    lineHeight: "24px",
                    fontWeight: "bold",
                    textAlign: "justify",
                    padding: "0px 10px",
                    fontStyle: "italic",
                  }}
                >
                  {additionalCreds?.teacher_comment}
                </h4>
                {additionalCreds?.teachers?.length > 0 && (
                  <div className='d-flex px-5 justify-content-between mt-5'>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {additionalCreds?.teachers[0]?.signature && (
                        <img
                          src={additionalCreds?.teachers[0]?.signature}
                          alt=''
                          style={{
                            width: "150px", // Set the desired width
                            height: "80px", // Set the desired height
                            objectFit: "cover", // You can use 'cover', 'contain', 'fill', etc.
                          }}
                          // height="200px"
                        />
                      )}
                      {/* <div className='line' style={{ marginTop: "18px" }} /> */}
                      {additionalCreds?.teachers[0]?.name && (
                        <div
                          // className='line'
                          style={{
                            height: "1.8px",
                            width: "200px",
                            border: "1.8px solid black",
                            background: "black",
                            marginTop: "10px",
                          }}
                        />
                      )}
                      {additionalCreds?.teachers[0]?.name && (
                        <h3
                          style={{
                            fontSize: "18px",
                            textTransform: "uppercase",
                            // borderTop: "3px solid black",
                            paddingTop: "10px",
                          }}
                        >
                          {additionalCreds?.teachers[0]?.name}
                        </h3>
                      )}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {additionalCreds?.teachers[1]?.signature && (
                        <img
                          src={additionalCreds?.teachers[1]?.signature}
                          alt=''
                          style={{
                            width: "150px", // Set the desired width
                            height: "80px", // Set the desired height
                            objectFit: "cover", // You can use 'cover', 'contain', 'fill', etc.
                          }}
                          // height="200px"
                        />
                      )}
                      {/* <div className='line' style={{ marginTop: "18px" }} /> */}
                      {additionalCreds?.teachers[1]?.name && (
                        <div
                          // className='line'
                          style={{
                            height: "1.8px",
                            width: "200px",
                            border: "1.8px solid black",
                            background: "black",
                            marginTop: "10px",
                          }}
                        />
                      )}
                      {additionalCreds?.teachers[1]?.name && (
                        <h3
                          style={{
                            fontSize: "18px",
                            textTransform: "uppercase",
                            // borderTop: "3px solid black",
                            paddingTop: "10px",
                          }}
                        >
                          {additionalCreds?.teachers[1]?.name}
                        </h3>
                      )}
                    </div>
                  </div>
                )}
                {/* <div className='signature'>
                <div>
                  {additionalCreds?.teacher_signature && (
                    <img src={additionalCreds?.teacher_signature} alt='' />
                  )}
                  <div className='line' />
                  <h3
                    style={{
                      fontSize: "18px",
                      lineHeight: "16px",
                    }}
                  >
                    {additionalCreds?.teacher_fullname}
                  </h3>
                </div>
              </div> */}
              </div>
            )}

            {/* HOS or Principal's Comment */}
            {checkResultComputed === "Released" && (
              <div className='table-head'>
                <h3
                  style={{
                    fontSize: "18px",
                    lineHeight: "16px",
                  }}
                >
                  {`${
                    studentData?.campus?.includes("Elementary")
                      ? "Head of Department's Comment"
                      : studentData?.campus?.includes("College")
                      ? "Principal's Comment"
                      : "HOS's Comment"
                    // : "Principal's"
                  } `}
                </h3>
                {/* <h3
                style={{
                  fontSize: "18px",
                  lineHeight: "16px",
                }}
              >
                {`${
                  studentData?.campus?.includes("College")
                    ? "Principal's Comment"
                    : "Principal's Comment"
                  // : "Principal's"
                } `}
              </h3> */}
              </div>
            )}
            {checkResultComputed === "Released" && (
              <div className='comment'>
                <h4
                  style={{
                    fontSize: "18px",
                    lineHeight: "24px",
                    fontWeight: "bold",
                    textAlign: "justify",
                    padding: "0px 10px",
                    fontStyle: "italic",
                  }}
                >
                  {additionalCreds?.hos_comment}
                </h4>
                {additionalCreds?.hos?.length > 0 && (
                  <div className='d-flex px-5 justify-content-between mt-5'>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {additionalCreds?.hos[1]?.signature && (
                        <img
                          src={additionalCreds?.hos[1]?.signature}
                          alt=''
                          style={{
                            width: "100px", // Set the desired width
                            height: "80px", // Set the desired height
                            objectFit: "cover", // You can use 'cover', 'contain', 'fill', etc.
                          }}
                        />
                      )}
                      {additionalCreds?.hos[1]?.name && (
                        <div
                          // className='line'
                          style={{
                            height: "1.8px",
                            width: "200px",
                            border: "1.8px solid black",
                            background: "black",
                            marginTop: "10px",
                          }}
                        />
                      )}
                      {additionalCreds?.hos[1]?.name && (
                        <h3
                          style={{
                            fontSize: "18px",
                            lineHeight: "16px",
                            textTransform: "uppercase",
                            // borderTop: "3px solid black",
                            paddingTop: "10px",
                          }}
                        >
                          {additionalCreds?.hos[1]?.name}
                        </h3>
                      )}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {additionalCreds?.hos[0]?.signature && (
                        <img
                          src={additionalCreds?.hos[0]?.signature}
                          alt=''
                          style={{
                            width: "100px", // Set the desired width
                            height: "80px", // Set the desired height
                            objectFit: "cover", // You can use 'cover', 'contain', 'fill', etc.
                          }}
                        />
                      )}
                      {additionalCreds?.hos[0]?.name && (
                        <div
                          // className='line'
                          style={{
                            height: "1.8px",
                            width: "200px",
                            border: "1.8px solid black",
                            background: "black",
                            marginTop: "10px",
                          }}
                        />
                      )}
                      {additionalCreds?.hos[0]?.name && (
                        <h3
                          style={{
                            fontSize: "18px",
                            lineHeight: "16px",
                            textTransform: "uppercase",
                            // borderTop: "3px solid black",
                            paddingTop: "10px",
                          }}
                        >
                          {additionalCreds?.hos[0]?.name}
                        </h3>
                      )}
                    </div>
                  </div>
                )}
                {/* <div className='signature'>
                <div>
                  {additionalCreds?.hos_signature && (
                    <img
                      src={additionalCreds?.hos_signature}
                      alt=''
                      style={{
                        width: "100px", // Set the desired width
                        height: "80px", // Set the desired height
                        objectFit: "cover", // You can use 'cover', 'contain', 'fill', etc.
                      }}
                    />
                  )}
                  <div className='line' />
                  <h3
                    style={{
                      fontSize: "18px",
                      lineHeight: "16px",
                    }}
                  >
                    {additionalCreds?.hos_fullname}
                  </h3>
                </div>
              </div> */}
              </div>
            )}

            {/* Director of studies */}
            {checkResultComputed === "Released" && (
              <div
                className=''
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "30px",
                  textTransform: "uppercase",
                  gap: "10px",
                }}
              >
                <h3
                  style={{
                    fontSize: "18px",
                    lineHeight: "16px",
                    color: "green",
                  }}
                >
                  Director of Studies:
                </h3>
                <h3
                  style={{
                    fontSize: "18px",
                    lineHeight: "16px",
                  }}
                >
                  {additionalCreds?.dos ?? "----"}
                </h3>
              </div>
            )}
          </div>
        </div>
      </PageSheet>
    </div>
  );
};

export default ElementarySecondHalfSheet;
