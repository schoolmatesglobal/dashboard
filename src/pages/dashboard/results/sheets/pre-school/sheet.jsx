import React, { useEffect, useState } from "react";
import PageSheet from "../../../../../components/common/page-sheet";
import { useResults } from "../../../../../hooks/useResults";
import { useAppContext } from "../../../../../hooks/useAppContext";
import Button from "../../../../../components/buttons/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPrint } from "@fortawesome/free-solid-svg-icons";
import StudentsResults from "../../../../../components/common/students-results";
import ResultHeader from "../../../../../components/common/result-header";
import { useStudent } from "../../../../../hooks/useStudent";
import { calculateAgeWithMonths } from "../../constant";
import { useLocation } from "react-router-dom";
import { Input } from "reactstrap";
import { useActivities } from "../../../../../hooks/useActivities";

const SubjectTable = ({ subject, header = [], topics = [] }) => {
  return (
    <div
      className='subject-table'
      style={{
        width: "100%",
        // textAlign: "justify",
        // padding: "0px 10px",
        // fontStyle: "italic"
      }}
    >
      <div className='table-subhead' style={{ width: `100%` }}>
        <h4
          style={{
            fontSize: "18px",
            // textAlign: "justify",
            // padding: "0px 10px",
            // fontStyle: "italic"
          }}
        >
          {subject}
        </h4>
      </div>
      <div className='subject-main-table' style={{ width: `100%` }}>
        <div>
          <div className='table-data'>
            <h4
              style={{
                fontSize: "16px",
                lineHeight: "18px",
                // textAlign: "justify",
                // padding: "0px 10px",
                // fontStyle: "italic"
              }}
            >
              {subject}
            </h4>
          </div>
          <div className='score-part'>
            {header.map((h) => (
              <div
                key={h}
                className='table-data subject-head'
                style={{ width: `${100 / header.length}%`, padding: "3px 0px" }}
              >
                {h === "Archieved" ? (
                  <h4
                    style={{
                      fontSize: "14px",
                      lineHeight: "16px",
                      wordWrap: "normal",
                      // whiteSpace: "nowrap",
                      // wordWrap: "",
                      // textAlign: "justify",
                      // padding: "0px 10px",
                      // fontStyle: "italic"
                    }}
                  >
                    ACHIEVED
                  </h4>
                ) : (
                  <h4
                    style={{
                      fontSize: "14px",
                      lineHeight: "16px",
                      // whiteSpace: "nowrap",
                      wordWrap: "normal",
                      // textAlign: "justify",
                      // padding: "0px 10px",
                      // fontStyle: "italic"
                    }}
                  >
                    {h}
                  </h4>
                )}
              </div>
            ))}
          </div>
        </div>
        {topics.map((t) => (
          <div key={t.topic}>
            <div className='table-data'>
              <h4
                style={{
                  fontSize: "15px",
                  lineHeight: "16px",
                  // textAlign: "justify",
                  // padding: "0px 10px",
                  // fontStyle: "italic"
                }}
              >
                {t.topic}
              </h4>
            </div>
            <div className='score-part'>
              {header.map((h) => (
                <div
                  key={h}
                  className='table-data'
                  style={{ width: `${100 / header.length}%` }}
                >
                  {t.score === h && (
                    <FontAwesomeIcon
                      icon={faCheck}
                      color='green'
                      style={{ fontSize: "24px" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PreSchoolResult = () => {
  const { user } = useAppContext("results");
  const {
    idWithComputedResult,
    isLoading,
    setStudentData,
    pdfExportComponent,
    handlePrint,
    academicDate,
    studentData,
    preSchoolCompiledResults,
  } = useResults();

  const { preActivities } = useActivities();

  // const extraActivities = () => {
  //   if (preSchoolCompiledResults && preSchoolCompiledResults?.length > 0) {
  //     return preSchoolCompiledResults?.find(
  //       ({ student_id }) => student_id === studentData.id
  //     );
  //   }
  // };

  // const newResult = result();

  const { state } = useLocation();

  const [newStudentData, setNewStudentData] = useState({});

  const [changeTableStyle, setChangeTableStyle] = useState(false);

  const { studentByClass2 } = useStudent();

  const result =
    preSchoolCompiledResults?.find(
      ({ student_id }) => student_id === studentData.id
    ) ?? null;

  const extraActivitiesResult = () => {
    if (result?.extra_curricular_activities?.length > 0) {
      return result?.extra_curricular_activities;
    }
  };

  useEffect(() => {
    if (studentByClass2?.length > 0) {
      const md = studentByClass2.find((sc) => sc.id === user?.id);

      if (user?.designation_name === "Student") {
        setStudentData(md);
      }
      // console.log({
      //   findOneStudent: md,
      // });
    }

    // setNewStudentData(studentData);
  }, [studentByClass2]);

  // console.log({
  //   // findOneStudent: findOneStudent(),
  //   preSchoolCompiledResults,
  //   user,
  //   si: studentData,
  //   studentByClass2,
  // });

  // useEffect(() => {
  //   if (preSchoolCompiledResults && preSchoolCompiledResults?.length > 0) {
  //     setPreActivities2(result()?.extra_curricular_activities || []);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [newResult]);

  return (
    <div className='results-sheet'>
      {user?.designation_name !== "Student" && (
        <StudentsResults
          studentByClassAndSession={studentByClass2}
          onProfileSelect={(x) => setStudentData(x)}
          isLoading={isLoading}
          studentData={studentData}
          idWithComputedResult={idWithComputedResult}
        />
      )}
      <PageSheet>
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
          className='first-level-results-sheet preschool'
        >
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
            {/* Academic sessions */}
            <div className='table-head'>
              <h3
                style={{
                  fontSize: "18px",
                  lineHeight: "16px",
                  // textAlign: "justify",
                  // padding: "0px 10px",
                  // fontStyle: "italic"
                }}
              >
                {result?.session} Academic Sessions
              </h3>
            </div>
            <div
              className='student-creds'
              style={{
                fontSize: "15px",
                lineHeight: "16px",
                // textAlign: "justify",
                // padding: "0px 10px",
                // fontStyle: "italic"
              }}
            >
              <div>
                <div className='table-data'>
                  <h4
                    style={{
                      fontSize: "15px",
                      lineHeight: "16px",
                    }}
                  >
                    <span
                      style={{
                        color: "green",
                      }}
                    >
                      Name:{" "}
                    </span>
                    {result?.student_fullname}
                  </h4>
                </div>
                <div className='table-data'>
                  <h4
                    style={{
                      fontSize: "15px",
                      lineHeight: "16px",
                      // textAlign: "justify",
                      // padding: "0px 10px",
                      // fontStyle: "italic"
                    }}
                  >
                    <span
                      style={{
                        color: "green",
                      }}
                    >
                      Admission No.:{" "}
                    </span>{" "}
                    {result?.admission_number}
                  </h4>
                </div>
                <div className='table-data'>
                  <h4
                    style={{
                      fontSize: "15px",
                      lineHeight: "16px",
                    }}
                  >
                    <span
                      style={{
                        color: "green",
                      }}
                    >
                      Term:{" "}
                    </span>
                    {result?.term} -{" "}
                    {state?.creds?.period === "Second Half"
                      ? "Second Half"
                      : "First Half"}
                  </h4>
                </div>
              </div>
              <div>
                <div className='table-data'>
                  {/* <h4>Chronological Age: 4 years 7 month</h4> */}
                  {/* <h4>Age: {studentData?.age} year(s)</h4> */}
                  <h4
                    style={{
                      fontSize: "15px",
                      lineHeight: "16px",
                      // textAlign: "justify",
                      // padding: "0px 10px",
                      // fontStyle: "italic"
                    }}
                  >
                    <span
                      style={{
                        color: "green",
                      }}
                    >
                      Age:{" "}
                    </span>
                    {calculateAgeWithMonths(studentData?.dob)}
                  </h4>
                  {/* {result?.session && <h4>{result?.session} SESSION</h4>} */}
                </div>
                <div className='table-data'>
                  <h4
                    style={{
                      fontSize: "15px",
                      lineHeight: "16px",
                      // textAlign: "justify",
                      // padding: "0px 10px",
                      // fontStyle: "italic"
                    }}
                  >
                    <span
                      style={{
                        color: "green",
                      }}
                    >
                      School Section:{" "}
                    </span>{" "}
                    Nursery
                  </h4>
                </div>
                <div className='table-data'>
                  <h4
                    style={{
                      fontSize: "15px",
                      lineHeight: "16px",
                      // textAlign: "justify",
                      // padding: "0px 10px",
                      // fontStyle: "italic"
                    }}
                  >
                    <span
                      style={{
                        color: "green",
                      }}
                    >
                      Class:{" "}
                    </span>{" "}
                    {result?.class_name}
                  </h4>
                </div>
              </div>
            </div>

            {/* Attendance Record */}
            {state?.creds?.period === "Second Half" && (
              <div className='table-head'>
                <h3>Attendance Record</h3>
              </div>
            )}
            {state?.creds?.period === "Second Half" && (
              <div className='attendance'>
                <div>
                  <div className='table-subhead'>
                    <h4>Number of Times School Opened</h4>
                  </div>
                  <div className='table-data'>
                    <h4>{result?.school_opened ?? "--"}</h4>
                  </div>
                </div>
                <div>
                  <div className='table-subhead'>
                    <h4>Number of Times Present</h4>
                  </div>
                  <div className='table-data'>
                    <h4>{result?.times_present ?? "--"}</h4>
                  </div>
                </div>
                <div>
                  <div className='table-subhead'>
                    <h4>Number of Times Absent</h4>
                  </div>
                  <div className='table-data'>
                    <h4>{result?.times_absent ?? "--"}</h4>
                  </div>
                </div>
                <div>
                  <div className='table-subhead'>
                    <h4>This Term Ends</h4>
                  </div>
                  <div className='table-data'>
                    {/* <h4>2022</h4> */}
                    <h4>{academicDate?.session_ends ?? "--"}</h4>
                  </div>
                </div>
                <div>
                  <div className='table-subhead'>
                    <h4>Next Term Begins</h4>
                  </div>
                  <div className='table-data'>
                    {/* <h4>2022</h4> */}
                    <h4>{academicDate?.session_resumes ?? "--"}</h4>
                  </div>
                </div>
              </div>
            )}

            {/* Evaluation Report */}
            <div className='table-head'>
              <h3
                style={{
                  fontSize: "18px",
                  lineHeight: "16px",
                  // textAlign: "justify",
                  // padding: "0px 10px",
                  // fontStyle: "italic"
                }}
              >
                Evaluation Report
              </h3>
            </div>
            <div className='reports'>
              <div>
                {result?.evaluation_report
                  ?.slice(0, Math.round(result?.evaluation_report?.length / 2))
                  ?.map((subject, key) => (
                    <SubjectTable
                      key={key}
                      subject={subject.subject}
                      header={[
                        "Needs Improvement",
                        "Fair",
                        "Good",
                        "Excellent",
                      ]}
                      topics={subject.topic}
                    />
                  ))}
              </div>
              <div>
                {result?.evaluation_report
                  ?.slice(Math.round(result?.evaluation_report?.length / 2))
                  ?.map((subject, key) => (
                    <SubjectTable
                      key={key}
                      subject={subject.subject}
                      header={[
                        "Needs Improvement",
                        "Fair",
                        "Good",
                        "Excellent",
                      ]}
                      topics={subject.topic}
                    />
                  ))}
              </div>
            </div>

            {/* Cognitive Report */}
            <div className='table-head'>
              <h3
                style={{
                  fontSize: "18px",
                  lineHeight: "16px",
                }}
              >
                Cognitive Report
              </h3>
            </div>
            <div className='reports'>
              <div>
                {result?.cognitive_development?.map((subject, key) => (
                  <SubjectTable
                    key={key}
                    subject={subject.subject}
                    header={[
                      "Work in Progress",
                      "Needs Reinforcement",
                      "Archieved",
                    ]}
                    topics={subject.topic}
                  />
                ))}
              </div>
              {/* <div>
                {result?.cognitive_development
                  ?.slice(Math.round(result?.cognitive_development?.length / 2))
                  ?.map((subject, key) => (
                    <SubjectTable
                      key={key}
                      subject={subject.subject}
                      header={[
                        "Work in Progress",
                        "Needs Reinforcement",
                        "Archieved",
                      ]}
                      topics={subject.topic}
                    />
                  ))}
              </div> */}
            </div>

            {/* extra curricular */}
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

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", // Adjust the column width as needed
                // gap: "30px",
                width: "100%",
              }}
            >
              {preActivities?.map((attr, i) => (
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
                        extraActivitiesResult()?.find(
                          (x) => x.name === attr.name
                        )?.value === "1"
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Class Teacher's Comment */}
            <div className='table-head'>
              <h3
                style={{
                  fontSize: "18px",
                  lineHeight: "16px",
                  // textAlign: "justify",
                  // padding: "0px 10px",
                  // fontStyle: "italic"
                }}
              >
                Class Teacher's General Comment
              </h3>
            </div>
            {/* <div className="comment">
              <h4>{result?.teacher_comment}</h4>
              <div className="signature">
                <div>
                  {result?.teacher_signature && (
                    <img
                      src={result?.teacher_signature}
                      width="200px"
                      // height="fit"
                      alt=""
                    />
                  )}
                  <div className="line" />
                  <h3>{result?.teacher_fullname}</h3>
                </div>
              </div>
            </div> */}
            <div className='comment'>
              <h4
                className=''
                style={{
                  fontSize: "19px",
                  lineHeight: "22px",
                  textAlign: "justify",
                  padding: "0px 10px",
                  fontStyle: "italic",
                }}
              >
                {result?.teacher_comment}
              </h4>
              {result?.teachers?.length > 0 && (
                <div className='d-flex px-5 justify-content-between mt-5'>
                  <div>
                    {result?.teachers[0]?.signature && (
                      <div>
                        <img
                          src={result?.teachers[0]?.signature}
                          alt=''
                          style={{
                            width: "150px", // Set the desired width
                            height: "80px", // Set the desired height
                            objectFit: "cover", // You can use 'cover', 'contain', 'fill', etc.
                          }}
                          // height="200px"
                        />
                      </div>
                    )}
                    <div className='line' style={{ marginTop: "18px" }} />
                    <h3 style={{ fontSize: "18px" }}>
                      {result?.teachers[0]?.name}
                    </h3>
                  </div>
                  <div>
                    {result?.teachers[1]?.signature && (
                      <div>
                        <img
                          src={result?.teachers[1]?.signature}
                          alt=''
                          style={{
                            width: "100px", // Set the desired width
                            height: "80px", // Set the desired height
                            objectFit: "cover", // You can use 'cover', 'contain', 'fill', etc.
                          }}
                        />
                      </div>
                    )}
                    <div className='line' style={{ marginTop: "18px" }} />
                    <h3 style={{ fontSize: "18px" }}>
                      {result?.teachers[1]?.name}
                    </h3>
                  </div>
                </div>
              )}
            </div>
            <div className='table-head'>
              <h3 style={{ fontSize: "18px" }}>Head of Nursery's Comment</h3>
            </div>
            <div className='comment'>
              <h4
                style={{
                  fontSize: "19px",
                  lineHeight: "22px",
                  textAlign: "justify",
                  padding: "0px 10px",
                  fontStyle: "italic",
                  marginBottom: "20px",
                }}
              >
                {result?.hos_comment}
              </h4>
              <div className='d-flex px-5 justify-content-between mt-5'>
                <div>
                  {result?.hos_signature && (
                    <img
                      src={result?.hos_signature}
                      alt=''
                      style={{
                        width: "100px", // Set the desired width
                        height: "80px", // Set the desired height
                        objectFit: "cover", // You can use 'cover', 'contain', 'fill', etc.
                      }}
                    />
                  )}
                  <div className='line' />
                  <h3 style={{ fontSize: "18px" }}>{result?.hos_fullname}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageSheet>
    </div>
  );
};

export default PreSchoolResult;
