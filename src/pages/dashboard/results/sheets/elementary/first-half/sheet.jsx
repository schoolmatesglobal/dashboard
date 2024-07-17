import React, { useEffect, useState } from "react";
import StudentsResults from "../../../../../../components/common/students-results";
import PageSheet from "../../../../../../components/common/page-sheet";
import Button from "../../../../../../components/buttons/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ResultHeader from "../../../../../../components/common/result-header";
import { useResults } from "../../../../../../hooks/useResults";
import { useAppContext } from "../../../../../../hooks/useAppContext";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { useStudent } from "../../../../../../hooks/useStudent";
import AuthSelect from "../../../../../../components/inputs/auth-select";
import GoBack from "../../../../../../components/common/go-back";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import { PiWarningCircleFill } from "react-icons/pi";
import ButtonGroup from "../../../../../../components/buttons/button-group";

const ElementaryFirstHalfSheet = () => {
  const { user } = useAppContext("results");
  const {
    idWithComputedResult,
    isLoading,
    setStudentData,
    pdfExportComponent,
    handlePrint,
    studentData,
    maxScores,
    locationState,
    getTotalScores,
    additionalCreds,
    setInitGetExistingResult,
    inputs,
    handleChange,
    releaseResult,
    releaseResultLoading,
    withholdResult,
    withholdResultLoading,
    studentByClass2,
    // studentByClass,
  } = useResults();

  const [loading1, setLoading1] = useState(false);
  const [status, setStatus] = useState("");

  // const { studentByClass2 } = useStudent();

  const [changeTableStyle, setChangeTableStyle] = useState(false);

  const midTermMax = () => {
    let value;
    if (
      maxScores?.has_two_assessment &&
      inputs.assessment === "first_assesment"
    ) {
      value = maxScores?.first_assessment;
    } else if (
      maxScores?.has_two_assessment &&
      inputs.assessment === "second_assesment"
    ) {
      value = maxScores?.second_assessment;
    } else if (!maxScores?.has_two_assessment) {
      value = maxScores?.midterm;
    }
    return value;
  };
  const assessmentType = () => {
    let value;
    if (
      maxScores?.has_two_assessment &&
      inputs.assessment === "first_assesment"
    ) {
      value = "First Assessment";
    } else if (
      maxScores?.has_two_assessment &&
      inputs.assessment === "second_assesment"
    ) {
      value = "Second Assessment";
    } else if (!maxScores?.has_two_assessment) {
      value = "First Assessment";
    }
    return value;
  };

  // const result =
  //   preSchoolCompiledResults?.find(
  //     ({ student_id }) => student_id === studentData.id
  //   ) ?? null;

  function countSubjects() {
    // Initialize a variable to keep track of the count of correct answers
    let correctCount = 0;

    if (additionalCreds?.results?.length > 0) {
      // Loop through each object in the 'questions' array
      for (const question of additionalCreds?.results) {
        // Check if the 'answer' is equal to the 'correct_answer'
        if (question.score !== "0") {
          // If they are the same, increment the correctCount
          correctCount++;
        }
      }
    }

    // Return the total count of correct answers
    return correctCount;
  }

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

  const checkResultComputed2 = (function () {
    if ("results" in additionalCreds) {
      return true;
    } else {
      return false;
    }
  })();

  const allLoading = isLoading || loading1;

  useEffect(() => {
    // setTeacherComment(additionalCreds?.teacher_comment);
    setStatus(additionalCreds?.status);
  }, [additionalCreds?.status]);

  // console.log({ additionalCreds });

  console.log({
    inputs,
    studentData,
    status,
    studentByClass2,
    // result,
    cs: countSubjects(),
    additionalCreds,
    checkResultComputed,
  });

  return (
    <div className='results-sheet'>
      <GoBack />
      {user?.designation_name !== "Student" && (
        <StudentsResults
          studentByClassAndSession={studentByClass2}
          onProfileSelect={(x) => {
            setStudentData(x);
            setInitGetExistingResult(true);
          }}
          isLoading={isLoading}
          studentData={studentData}
          idWithComputedResult={idWithComputedResult}
        />
      )}
      <PageSheet>
        <div className='d-flex flex-column flex-md-row  justify-content-md-between mb-3'>
          <div className='d-flex gap-4 align-items-center'>
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

            {user?.designation_name !== "Student" && (
              <ButtonGroup
                options={[
                  {
                    title: `${status === "released" ? "withhold" : "Release"}`,
                    type: "button",
                    variant: `${status === "released" ? "danger" : ""}`,
                    onClick: () => {
                      if (status === "released") {
                        withholdResult();
                        setStatus("withheld");
                        // trigger(2000);
                      } else if (status === "withheld") {
                        releaseResult();
                        setStatus("released");
                        // trigger(2000);
                      } else {
                        releaseResult();
                        setStatus("released");
                        // trigger(2000);
                      }
                    },
                    isLoading: releaseResultLoading || withholdResultLoading,
                    disabled:
                      !checkResultComputed2 ||
                      allLoading ||
                      releaseResultLoading ||
                      withholdResultLoading,
                  },
                ]}
              />
            )}
          </div>

          {maxScores?.has_two_assessment && (
            <div className='form-group mb-4' style={{ width: "300px" }}>
              <AuthSelect
                label='Assessment'
                value={inputs.assessment}
                name='assessment'
                // hasError={!!errors.assessment}
                onChange={(e) => {
                  handleChange(e);
                }}
                options={[
                  { value: "first_assesment", title: "First Assessment" },
                  { value: "second_assesment", title: "Second Assessment" },
                ]}
              />
              {/* {!!errors.assessment && (
                <p className="error-message">{errors.assessment}</p>
              )} */}
            </div>
          )}
        </div>

        {user?.designation_name !== "Student" && (
          <div className='w-full d-flex justify-content-center mb-3'>
            <div className=''>
              <p
                className={`${
                  status?.toUpperCase() === "WITHHELD"
                    ? "bg-danger text-danger"
                    : "bg-black text-black"
                } bg-opacity-10 px-4 py-3 fw-bold`}
                style={{
                  textTransform: "uppercase",
                  width: "fit",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  // textAlign: "center",
                }}
              >
                RESULT{" "}
                {status
                  ? status
                  : status === ""
                  ? "Not-Released"
                  : "Not-Computed"}
              </p>
            </div>
          </div>
        )}

        <div
          ref={pdfExportComponent}
          className='first-level-results-sheet preschool first-half'
        >
          <ResultHeader changeTableStyle={changeTableStyle} user={user} />

          <div
            className={`${
              changeTableStyle
                ? "preschool-result-table"
                : "preschool-result-table2"
            }`}
          >
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
                {additionalCreds?.session} Academic Session
              </h3>
            </div>
            <div className='student-creds'>
              <div>
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
                        fontSize: "15px",
                        lineHeight: "16px",
                      }}
                    >
                      Name:
                    </span>{" "}
                    {studentData?.firstname} {studentData?.surname}{" "}
                    {studentData?.middlename}
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
                        fontSize: "15px",
                        lineHeight: "16px",
                      }}
                    >
                      Admission No.:
                    </span>{" "}
                    {studentData?.admission_number}
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
                        fontSize: "15px",
                        lineHeight: "16px",
                      }}
                    >
                      Term:
                    </span>{" "}
                    {locationState?.creds?.term}
                  </h4>
                </div>
              </div>
              <div>
                {/* <h4>Chronological Age: {studentData?.age}</h4> */}
                {/* <div className="table-data">
                  <h4>Age: {calculateAgeWithMonths(studentData?.dob)}</h4>
                </div> */}
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
                        fontSize: "15px",
                        lineHeight: "16px",
                      }}
                    >
                      Term Half:
                    </span>{" "}
                    FIRST HALF
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
                        fontSize: "15px",
                        lineHeight: "16px",
                      }}
                    >
                      School Section:
                    </span>{" "}
                    {user?.campus}
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
                        fontSize: "15px",
                        lineHeight: "16px",
                      }}
                    >
                      Class:
                    </span>{" "}
                    {`${studentData?.present_class} ${studentData?.sub_class}`}
                  </h4>
                </div>
              </div>
            </div>
            {/* Assessment Report */}
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
                Assessment Report
              </h3>
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
            {checkResultComputed === "Released" && (
              <>
                {
                  <div className='first-half-result-table'>
                    <div className='table-row'>
                      <div className='table-data'></div>
                      <div className='table-data'>
                        <h4
                          style={{
                            fontSize: "18px",
                            lineHeight: "16px",
                            // textAlign: "justify",
                            // padding: "0px 10px",
                            // fontStyle: "italic"
                          }}
                        >
                          {assessmentType()} Scores
                        </h4>
                      </div>
                    </div>
                    <div className='table-row'>
                      <div className='table-data'>
                        <h4
                          style={{
                            fontSize: "18px",
                            lineHeight: "16px",
                            color: "green",
                            // textAlign: "justify",
                            // padding: "0px 10px",
                            // fontStyle: "italic"
                          }}
                        >
                          Max Score Obtainable
                        </h4>
                      </div>
                      <div className='table-data'>
                        <h4
                          style={{
                            fontSize: "18px",
                            lineHeight: "16px",
                            // textAlign: "justify",
                            // padding: "0px 10px",
                            // fontStyle: "italic"
                          }}
                        >
                          {midTermMax()}
                          {/* {maxScores?.midterm} */}
                        </h4>
                      </div>
                    </div>
                    {additionalCreds?.results?.map((x, index) => {
                      return (
                        <div className='table-row' key={index}>
                          {Number(x.score) !== 0 && (
                            <div className='table-data'>
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
                                {x.subject}
                              </p>
                            </div>
                          )}
                          {Number(x.score) !== 0 && (
                            <div className='table-data'>
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
                                {x.score}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div className='table-row'>
                      <div className='table-data'>
                        <h4
                          style={{
                            fontSize: "18px",
                            lineHeight: "16px",
                            // textAlign: "justify",
                            // padding: "0px 10px",
                            // fontStyle: "italic"
                          }}
                        >
                          <span
                            style={{
                              fontSize: "18px",
                              lineHeight: "16px",
                              color: "green",
                            }}
                          >
                            Student&apos;s Total Score:
                          </span>{" "}
                          {getTotalScores()}
                        </h4>
                      </div>
                      <div className='table-data'>
                        <h4
                          style={{
                            fontSize: "18px",
                            lineHeight: "16px",
                            // textAlign: "justify",
                            // padding: "0px 10px",
                            // fontStyle: "italic"
                          }}
                        >
                          <span
                            style={{
                              fontSize: "18px",
                              lineHeight: "16px",
                              color: "green",
                            }}
                          >
                            Student&apos;s Average Score:
                          </span>{" "}
                          {(getTotalScores() / (countSubjects() || 1))?.toFixed(
                            3
                          )}
                          {/* {(getTotalScores() / (subjects?.length || 1))?.toFixed(5)} */}
                        </h4>
                      </div>
                    </div>
                  </div>
                }
                {/* class teacher comment */}
                {
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
                }
                {
                  <div className='comment'>
                    <h4
                      style={{
                        fontSize: "19px",
                        lineHeight: "22px",
                        textAlign: "justify",
                        padding: "0px 10px",
                        fontStyle: "italic",
                      }}
                    >
                      {additionalCreds?.teacher_comment}
                    </h4>
                    {additionalCreds?.teachers?.length > 0 && (
                      <div className='d-flex px-5 justify-content-between mt-5'>
                        <div>
                          {additionalCreds?.teachers[0]?.signature && (
                            <div>
                              <img
                                src={additionalCreds?.teachers[0]?.signature}
                                alt=''
                                width='100px'
                                // height="200px"
                              />
                            </div>
                          )}
                          <div className='line' style={{ marginTop: "18px" }} />
                          <h3 style={{ fontSize: "18px" }}>
                            {additionalCreds?.teachers[0]?.name}
                          </h3>
                        </div>
                        <div>
                          {additionalCreds?.teachers[1]?.signature && (
                            <div>
                              <img
                                src={additionalCreds?.teachers[1]?.signature}
                                alt=''
                                style={{
                                  width: "100px", // Set the desired width
                                  height: "80px", // Set the desired height
                                  objectFit: "cover", // You can use 'cover', 'contain', 'fill', etc.
                                }}
                                // height="200px"
                              />
                            </div>
                          )}
                          <div className='line' style={{ marginTop: "18px" }} />
                          <h3
                            style={{
                              fontSize: "18px",
                              lineHeight: "16px",
                            }}
                          >
                            {additionalCreds?.teachers[1]?.name}
                          </h3>
                        </div>
                      </div>
                    )}
                  </div>
                }
              </>
            )}
          </div>
        </div>
      </PageSheet>
    </div>
  );
};

export default ElementaryFirstHalfSheet;
