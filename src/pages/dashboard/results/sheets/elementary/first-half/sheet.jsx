import React from "react";
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
  } = useResults();

  const { studentByClass2 } = useStudent();

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

  // console.log({ additionalCreds });

  // console.log({
  //   inputs,
  //   studentData,
  //   result,
  //   cs: countSubjects(),
  //   additionalCreds,
  // });

  return (
    <div className='results-sheet'>
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
          <Button
            onClick={() => {
              if (pdfExportComponent.current) {
                handlePrint();
              }
            }}
          >
            <FontAwesomeIcon icon={faPrint} /> Print
          </Button>

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

        <div
          ref={pdfExportComponent}
          className='first-level-results-sheet preschool first-half'
        >
          <ResultHeader user={user} />
          <div className='preschool-result-table'>
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
                    <span style={{ color: "green" }}>Name:</span>{" "}
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
                    <span style={{ color: "green" }}>Admission No.:</span>{" "}
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
                    <span style={{ color: "green" }}>Term:</span>{" "}
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
                    <span style={{ color: "green" }}>Term Half:</span> FIRST
                    HALF
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
                    <span style={{ color: "green" }}>School Section:</span>{" "}
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
                    <span style={{ color: "green" }}>Class:</span>{" "}
                    {`${studentData?.present_class} ${studentData?.sub_class}`}
                  </h4>
                </div>
              </div>
            </div>
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
                    {(getTotalScores() / (countSubjects() || 1))?.toFixed(3)}
                    {/* {(getTotalScores() / (subjects?.length || 1))?.toFixed(5)} */}
                  </h4>
                </div>
              </div>
            </div>
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
          </div>
        </div>
      </PageSheet>
    </div>
  );
};

export default ElementaryFirstHalfSheet;
