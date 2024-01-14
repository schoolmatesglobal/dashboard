import React, { useState } from "react";
import Button from "../../../../../components/buttons/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useResults } from "../../../../../hooks/useResults";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { useStudent } from "../../../../../hooks/useStudent";
import { useBroadSheet } from "../../../../../hooks/useBroadSheet";
import BroadSheetHeader from "../../../../../components/common/broadsheet-header";
import { fillMissingSubjects } from "../../constant";
import { Spinner } from "reactstrap";
const ElementaryFinalBroadSheet = () => {
  // const { user } = useAppContext("results");
  const {
    idWithComputedResult,
    isLoading,
    setStudentData,
    getScoreRemark,

    maxScores,

    inputs,
    handleChange,
  } = useResults();

  const {
    handlePrint,
    pdfExportComponent,
    user,
    loading,
    broadSheetResults,
    broadSheetResultsRefetch,
    // subjectsByClass3,
  } = useBroadSheet();

  const { studentByClass2 } = useStudent();

  const [changeTableStyle, setChangeTableStyle] = useState(false);

 

 

  const subs =
    broadSheetResults?.results.length > 0
      ? broadSheetResults?.results[0]?.results
      : [];

  const subs2 = () => {
    if (broadSheetResults?.results?.length > 0) {
      const mp = broadSheetResults?.results[0]?.results?.map((bb) => {
        return bb.subject;
      });

      return mp;
      // return broadSheetResults?.results?.subject;
    }
  };

  const subsLength =
    broadSheetResults?.results?.length > 0
      ? broadSheetResults?.results[0]?.results?.length
      : 0;

  const studs =
    broadSheetResults?.results?.length > 0 ? broadSheetResults?.results : [];

  function calculateTotalAndAverage(student) {
    const totalScoreSum = student.results.reduce(
      (sum, result) => sum + result.total_score,
      0
    );
    const checkResult = student.results.filter(
      (subject) => subject.total_score > 0
    );

    const checkResultLength = checkResult?.length;

    const averageScore = totalScoreSum / checkResultLength;
    const totalSubjects = checkResultLength;
    // const averageScore = totalScoreSum / student.results.length;
    // const totalSubjects = student.results.length;

    // Adding the calculated values as new keys in the student object
    student.totalScore = totalScoreSum;
    student.averageScore = Number(averageScore.toFixed(0));
    student.totalSubjects = totalSubjects;

    student.results.sort((resultA, resultB) => {
      const firstWordA = resultA.subject.split(" ")[0].toUpperCase();
      const firstWordB = resultB.subject.split(" ")[0].toUpperCase();

      if (firstWordA < firstWordB) {
        return -1;
      }
      if (firstWordA > firstWordB) {
        return 1;
      }

      return 0;
    });

    // console.log({ totalSubjects, checkResultLength, r: student.results });

    return student;
  }

  const updatedStudentsData =
    broadSheetResults?.results?.length > 0
      ? broadSheetResults?.results?.map(calculateTotalAndAverage)
      : [];

  const fm = () => {
    if (broadSheetResults?.results?.length > 0 && subs2()?.length > 0) {
      return fillMissingSubjects(broadSheetResults?.results, subs2());
    }
  };

  const fm2 = fm();

  const fm3 = fm2?.length > 0 ? fm2?.map(calculateTotalAndAverage) : [];

  const ups1 = updatedStudentsData?.length > 0 ? updatedStudentsData[0] : {};

  // console.log({
  //   // subjectsByClass3,
  //   ups1,
  //   broadSheetResults,
  //   // subs,
  //   // subs2: subs2(),
  //   fm: fm(),
  //   updatedStudentsData,
  // });
  console.log({ fm3, subs2: subs2(), broadSheetResults });
  // console.log({ broadSheetResults });

  return (
    <div className=''>
      <div className='page-sheet2'>
        <div className='d-flex flex-column flex-md-row  justify-content-md-between mb-3'>
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
          className='broad-sheet preschool first-half'
        >
          <BroadSheetHeader
            user={user}
            changeTableStyle={changeTableStyle}
            broadSheetResults={broadSheetResults}
            // broadSheetResults={broadSheetResults}
          />
          {!loading && fm3?.length > 0 && <div
              className={`${
                changeTableStyle
                  ? "preschool-result-table"
                  : "preschool-result-table2"
              }`}
            >
              {/* Broad sheet title */}
              <div className='table-head'>
                <h3
                  style={{
                    fontSize: "18px",
                    lineHeight: "16px",
                  }}
                >
                  BROAD SHEET
                </h3>
              </div>

              <div
                className='student-creds text-center'
                // style={{ overFlowX: "scroll", minWidth: "700px" }}
              >
                {/* row 1 */}
                <div style={{ display: "flex", width: "100%" }}>
                  <div className='table-data' style={{ width: "35px" }}>
                    <h4
                      style={{
                        color: "green",
                        fontSize: "10px",
                        lineHeight: "14px",

                        // whiteSpace: "nowrap",
                      }}
                    >
                      S/N
                    </h4>
                  </div>
                  <div className='table-data' style={{ flex: "0.7" }}>
                    <h4
                      style={{
                        color: "green",
                        fontSize: "10px",
                        lineHeight: "14px",
                        minWidth: "100px",
                        // whiteSpace: "nowrap",
                      }}
                    >
                      Names
                    </h4>
                  </div>

                  {subs?.map((br) => {
                    return (
                      <div
                        className='table-data'
                        style={{
                          width: "90px",

                          overflow: "auto",
                        }}
                        // style={{ width: "70px" }}
                        key={br.subject}
                      >
                        <h4
                          style={{
                            color: "green",
                            fontSize: "10px",
                            lineHeight: "14px",
                            // padding: "0.5rem",
                            Width: "90px",
                            height: "100%",
                            textTransform: "uppercase",
                          }}
                        >
                          {br?.subject}
                        </h4>
                      </div>
                    );
                  })}

                  <div className='table-data' style={{ width: "60px" }}>
                    <h4
                      style={{
                        color: "green",
                        fontSize: "10px",
                        lineHeight: "14px",
                        // width: "50px",
                        // whiteSpace: "nowrap",
                      }}
                    >
                      Total
                    </h4>
                  </div>
                  <div className='table-data' style={{ width: "60px" }}>
                    <h4
                      style={{
                        color: "green",
                        fontSize: "10px",
                        lineHeight: "14px",
                        // width: "50px",
                        // whiteSpace: "nowrap",
                      }}
                    >
                      Avg.
                    </h4>
                  </div>
                  <div className='table-data' style={{ width: "60px" }}>
                    <h4
                      style={{
                        color: "green",
                        fontSize: "10px",
                        lineHeight: "14px",
                        // width: "50px",
                        // whiteSpace: "nowrap",
                      }}
                    >
                      Grade
                    </h4>
                  </div>
                </div>

                {/* row 2 */}
                <div style={{ display: "flex", width: "100%" }}>
                  <div className='table-data' style={{ width: "35px" }}>
                    <h4
                      style={{
                        color: "white",
                        fontSize: "10px",
                        lineHeight: "14px",
                        // whiteSpace: "nowrap",
                      }}
                    >
                      S/N
                    </h4>
                  </div>
                  <div className='table-data' style={{ flex: "0.7" }}>
                    <h4
                      style={{
                        color: "white",
                        fontSize: "10px",
                        lineHeight: "14px",
                        minWidth: "100px",
                        // whiteSpace: "nowrap",
                      }}
                    >
                      Names
                    </h4>
                  </div>

                  {subs?.map((br) => {
                    return (
                      <div
                        className='table-data'
                        style={{
                          width: "90px",
                          // flex: "1",
                          // flexGrow: "1",
                          // flexBasis: "0",
                          overflow: "auto",
                          // borderColor: "green",
                          // borderWidth: "2px",
                          // // border: "2px solid green",
                          // border: "0.1rem solid green",
                          // height: "100%",
                        }}
                        key={br.subject}
                      >
                        <h4
                          style={{
                            color: "green",
                            fontSize: "10px",
                            lineHeight: "14px",
                            // padding: "0.5rem",
                            Width: "90px",
                            // borderWidth: "0.1rem",
                            // borderColor: "green",
                            // borderWidth: "2px",
                            // border: "2px solid green",
                            // border: "0.1rem solid green",
                            // width: "70px",
                            height: "100%",
                            textTransform: "uppercase",
                            // width: "70px",
                            // transform: "rotate(90deg)",

                            // whiteSpace: "pre-wrap",
                          }}
                        >
                          100%
                        </h4>
                      </div>
                    );
                  })}

                  <div className='table-data' style={{ width: "60px" }}>
                    <h4
                      style={{
                        color: "white",
                        fontSize: "10px",
                        lineHeight: "14px",

                        // whiteSpace: "nowrap",
                      }}
                    >
                      Total
                    </h4>
                  </div>
                  <div className='table-data' style={{ width: "60px" }}>
                    <h4
                      style={{
                        color: "white",
                        fontSize: "10px",
                        lineHeight: "14px",
                        // whiteSpace: "nowrap",
                      }}
                    >
                      Avg.
                    </h4>
                  </div>
                  <div className='table-data' style={{ width: "60px" }}>
                    <h4
                      style={{
                        color: "white",
                        fontSize: "10px",
                        lineHeight: "14px",
                        // whiteSpace: "nowrap",
                      }}
                    >
                      Grade
                    </h4>
                  </div>
                </div>

                {/* row 3 */}
                {fm3?.map((bs) => {
                  return (
                    <div
                      style={{ display: "flex", width: "100%" }}
                      key={bs.student_id}
                    >
                      <div className='table-data' style={{ width: "35px" }}>
                        <h4
                          style={{
                            color: "green",
                            fontSize: "10px",
                            lineHeight: "14px",
                            // whiteSpace: "nowrap",
                          }}
                        >
                          {bs.sn}
                        </h4>
                      </div>

                      <div className='table-data' style={{ flex: "0.7" }}>
                        <h4
                          style={{
                            color: "green",
                            fontSize: "10px",
                            lineHeight: "14px",
                            minWidth: "100px",
                            // whiteSpace: "nowrap",
                          }}
                        >
                          {bs.student_fullname}
                        </h4>
                      </div>

                      {bs?.results?.map((br) => {
                        return (
                          <div
                            className='table-data'
                            style={{
                              width: "90px",

                              // overflow: "auto",
                            }}
                            key={br.subject}
                          >
                            <h4
                              style={{
                                color: "green",
                                fontSize: "10px",
                                lineHeight: "14px",
                                // padding: "0.5rem",
                                Width: "90px",
                                height: "100%",
                                textTransform: "uppercase",
                              }}
                            >
                              {br.total_score === 0 ? "-" : br.total_score}
                            </h4>
                          </div>
                        );
                      })}

                      <div className='table-data' style={{ width: "60px" }}>
                        <h4
                          style={{
                            color: "green",
                            fontSize: "10px",
                            lineHeight: "14px",

                            // whiteSpace: "nowrap",
                          }}
                        >
                          {bs.totalScore}
                        </h4>
                      </div>
                      <div className='table-data' style={{ width: "60px" }}>
                        <h4
                          style={{
                            color: "green",
                            fontSize: "10px",
                            lineHeight: "14px",
                            // whiteSpace: "nowrap",
                          }}
                        >
                          {bs.averageScore}
                        </h4>
                      </div>
                      <div className='table-data' style={{ width: "60px" }}>
                        <h4
                          style={{
                            color: "green",
                            fontSize: "10px",
                            lineHeight: "14px",
                            // whiteSpace: "nowrap",
                          }}
                        >
                          {getScoreRemark(bs.averageScore)?.grade}
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* teacher name & signature */}
              {broadSheetResults?.teacher?.length > 0 && (
                <div
                  className='d-flex px-5 justify-content-between'
                  style={{ margin: "50px 0px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {broadSheetResults?.teacher[0]?.signature && (
                      <img
                        src={broadSheetResults?.teacher[0]?.signature}
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
                    {broadSheetResults?.teacher[0]?.name && (
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
                    {broadSheetResults?.teacher[0]?.name && (
                      <h3
                        style={{
                          fontSize: "18px",
                          textTransform: "uppercase",
                          // borderTop: "3px solid black",
                          paddingTop: "10px",
                        }}
                      >
                        {broadSheetResults?.teacher[0]?.name}
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
                    {broadSheetResults?.teacher[1]?.signature && (
                      <img
                        src={broadSheetResults?.teacher[1]?.signature}
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
                    {broadSheetResults?.teacher[1]?.name && (
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
                    {broadSheetResults?.teacher[1]?.name && (
                      <h3
                        style={{
                          fontSize: "18px",
                          textTransform: "uppercase",
                          // borderTop: "3px solid black",
                          paddingTop: "10px",
                        }}
                      >
                        {broadSheetResults?.teacher[1]?.name}
                      </h3>
                    )}
                  </div>
                </div>
              )}
            </div>}
          {!loading && fm3?.length === 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                padding: "50px 0px",
              }}
            >
              <p className='' style={{ fontSize: "16px" }}>
                No records
              </p>
            </div>
          )}
          {loading && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                padding: "50px 0px",
              }}
            >
              {/* <p className='' style={{ fontSize: "16px" }}>
                No records
              </p> */}
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ElementaryFinalBroadSheet;
