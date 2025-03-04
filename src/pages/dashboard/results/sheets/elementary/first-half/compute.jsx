import React, { useEffect, useState } from "react";
import { useResults } from "../../../../../../hooks/useResults";
import { useAppContext } from "../../../../../../hooks/useAppContext";
import DetailView from "../../../../../../components/views/detail-view";
import { Button, Col, FormGroup, Row } from "reactstrap";
import { Spinner } from "reactstrap";
import AuthInput from "../../../../../../components/inputs/auth-input";
import PageTitle from "../../../../../../components/common/title";
import Prompt from "../../../../../../components/modals/prompt";
import StudentsResults from "../../../../../../components/common/students-results";
import { useStudent } from "../../../../../../hooks/useStudent";
import AuthSelect from "../../../../../../components/inputs/auth-select";
import GoBack from "../../../../../../components/common/go-back";
import { useAuthDetails } from "../../../../../../stores/authDetails";

const ComputeElementaryFirstHalfResult = () => {
  const { user } = useAppContext("results");
  const {
    idWithComputedResult,
    openPrompt,
    setOpenPrompt,
    selectedComment,
    setSelectedComment,
    teacherComment,
    setTeacherComment,
    setHosComment,
    comment,
    setComment,
    isLoading,
    setStudentData,
    studentData,
    comments,
    // createMidTermResult,
    // subjects,
    maxScores,
    setSubjects,
    setInitGetExistingResult,
    additionalCreds,
    inputs,
    handleChange,
    computeMidTermResult,
    releaseResult,
    releaseResultLoading,
    withholdResult,
    withholdResultLoading,
    studentByClass2,
    getSubjectByClass: { data: subjects, isFetching: isFetchingSubjects },
    getMidTermResult: {
      data: midtermResults,
      isFetching: isFetchingMidtermResults,
    },
    computedSubjects,
    setComputedSubjects,
    setIdWithComputedResult,
    // idWithComputedResult,
  } = useResults();

  const { userDetails, setUserDetails } = useAuthDetails();

  // const [computedSubjects, setComputedSubjects] = useState([]);

  const hasOneAssess =
     maxScores?.has_two_assessment === 0 ||
     maxScores?.has_two_assessment === false ||
     maxScores?.has_two_assessment === "false";

  // const { studentByClass2 } = useStudent();
  const [loading1, setLoading1] = useState(false);
  const [status, setStatus] = useState("");

  function trigger(time) {
    setLoading1(true);
    setTimeout(() => {
      setLoading1(false);
    }, time);
  }

  function removeDuplicates(array) {
    return (
      array?.length > 0 &&
      array?.filter(
        (obj, index, self) =>
          index ===
          self.findIndex((o) => JSON.stringify(o) === JSON.stringify(obj))
      )
    );
  }

  const midTermMax = () => {
    let value;
    if (!hasOneAssess && inputs.assessment === "first_assesment") {
      value =  maxScores?.first_assessment;
    } else if (!hasOneAssess && inputs.assessment === "second_assesment") {
      value =  maxScores?.second_assessment;
    } else if (hasOneAssess) {
      value =  maxScores?.midterm;
    }
    return value;
  };

  // useEffect(() => {
  //   setTeacherComment(additionalCreds?.teacher_comment);
  //   // setStatus(additionalCreds?.status);
  // }, [additionalCreds]);

  // useEffect(() => {
  //   // setTeacherComment(additionalCreds?.teacher_comment);
  //   setStatus(additionalCreds?.status);
  // }, [additionalCreds?.status, studentData]);

  // useEffect(() => {

  // }, [studentData?.id]);

  const checkResultComputed = (function () {
    if ("results" in additionalCreds) {
      return true;
    } else {
      return false;
    }
  })();

  const allLoading =
    isLoading || loading1 || isFetchingSubjects || isFetchingMidtermResults;
  // const allLoading = isLoading || loading1;

  const newSubjects = computedSubjects;
  // const newSubjects = removeDuplicates(subjects);

  useEffect(() => {

    const adjustResults = () => {
      if (
        midtermResults?.results2 !== undefined &&
        midtermResults?.results2?.length > 0 &&
        midtermResults?.results2?.length != subjects?.length
      ) {
        return subjects?.map((sb, i) => {
          const rs = midtermResults?.results2?.find(
            (rs) => rs.subject === sb.subject
          );
          if (rs) {
            return {
              id: i + 1,
              subject: rs.subject,
              score: rs.score,
              grade: rs.grade,
            };
          } else {
            return {
              id: i + 1,
              subject: sb.subject,
              score: sb.score,
              grade: sb.grade,
            };
          }
        });
      } else {
        return midtermResults?.results2;
      }
    };

    const finalSubjects =
      midtermResults?.results2 !== undefined &&
      midtermResults.results2.length > 0
        ? adjustResults
        : subjects;

    setComputedSubjects(finalSubjects);
    setTeacherComment(midtermResults?.teacher_comment);
    setStatus(midtermResults?.status);
    // const ids = [midtermResults?.student_id];
    setIdWithComputedResult([midtermResults?.student_id]);

  }, [allLoading, midtermResults?.results2, midtermResults, studentData]);

  console.log({
    subjects,
    // newSubjects,
    // subjects,
    isFetchingSubjects,
    midtermResults,
    computedSubjects,
    status,
    // status,
    // additionalCreds,
    // checkResultComputed,
    // studentData,
    // hasOneAssess,
    // studentByClass2,
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
          isLoading={allLoading}
          studentData={studentData}
          idWithComputedResult={idWithComputedResult}
        />
      )}

      {
        <DetailView
          hasGoBack={false}
          isLoading={allLoading}
          doubleSubmit={true}
          doubleSubmitTitle={`${
            status === "released" ? "withhold" : "Release"
          }`}
          doubleSubmitVariant={`${status === "released" ? "danger" : ""}`}
          doubleIsDisabled={
            !status ||
            allLoading ||
            releaseResultLoading ||
            withholdResultLoading
          }
          doubleIsLoading={releaseResultLoading || withholdResultLoading}
          doubleSubmitOnclick={() => {
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
          }}
          cancelLink='/app/results/preschool'
          pageTitle={`${studentData?.firstname || "Student"}'s Result (${
            status ? status : status === "" ? "Not-Released" : "Not-Computed"
          })`}
          onFormSubmit={(e) => {
            e.preventDefault();
            // createMidTermResult();
            computeMidTermResult();
          }}
        >
          {allLoading && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "100px 0",
                gap: "10px",
                minHeight: "40vh",
              }}
            >
              <Spinner />{" "}
              <p
                style={{
                  fontSize: "18px",
                  color: "var(--primary-color)",
                }}
              >
                Loading...
              </p>
            </div>
          )}
          {!allLoading && (
            <>
              <hr className='my-5' />
              <div className='d-flex flex-column flex-md-row  justify-content-md-between '>
                {midTermMax() && (
                  <PageTitle>
                    Evaluation Report - {`(${midTermMax()}`}
                    <span>marks</span> {`)`}
                  </PageTitle>
                )}
                {!hasOneAssess && (
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
                        {
                          value: "second_assesment",
                          title: "Second Assessment",
                        },
                      ]}
                    />
                    {/* {!!errors.assessment && (
                <p className="error-message">{errors.assessment}</p>
              )} */}
                  </div>
                )}
              </div>

              <div>
                <div>
                  {computedSubjects?.length > 0 &&
                    computedSubjects?.map((x, key) => (
                      <Row key={key} className='my-5 '>
                        <Col sm='6' className='mb- mb-sm-0'>
                          <h5>
                            {key + 1}. {x.subject}:
                          </h5>
                        </Col>
                        <Col sm='6' className='mb-1 mb-sm-0'>
                          <AuthInput
                            value={x.grade}
                            // placeholder='0'
                            onChange={({ target: { value } }) => {
                              if (Number.isNaN(Number(value))) return;

                              if (Number(value) > Number(midTermMax())) return;

                              const fd = computedSubjects.map((s) => ({
                                ...s,
                                grade:
                                  s.subject === x.subject ? value : s.grade,
                              }));
                              setComputedSubjects(fd);
                            }}
                          />
                        </Col>
                      </Row>
                    ))}
                </div>
              </div>
              {user?.teacher_type === "class teacher" && (
                <>
                  <hr className='my-5' />
                  <PageTitle>Teacher's Comment</PageTitle>
                  <div>
                    <Button
                      onClick={() => {
                        setComment("teacher");
                        setOpenPrompt(true);
                      }}
                    >
                      Suggest
                    </Button>
                    <FormGroup>
                      <textarea
                        className='form-control mt-3'
                        rows='5'
                        value={teacherComment}
                        // defaultValue={
                        //   additionalCreds?.teacher_comment &&
                        //   additionalCreds?.teacher_comment
                        // }
                        // defaultValue={"Satisfactory"}
                        onChange={(e) => {
                          // if (value) {
                          //   setTeacherComment(value);
                          // } else {
                          //   setTeacherComment(additionalCreds?.teacher_comment);
                          // }

                          setTeacherComment(e.target.value);
                        }}
                      />
                    </FormGroup>
                  </div>
                </>
              )}
            </>
          )}
        </DetailView>
      }
      <Prompt
        isOpen={openPrompt}
        toggle={() => setOpenPrompt(!openPrompt)}
        singleButtonProps={{
          type: "button",
          isLoading: false,
          disabled: false,
          onClick: () => {
            if (comment === "teacher") {
              setTeacherComment(selectedComment);
            }
            if (comment === "hos") {
              setHosComment(selectedComment);
            }
            setOpenPrompt(false);
            setSelectedComment("");
          },
        }}
        singleButtonText='Continue'
        promptHeader='Select Comment'
      >
        {comments?.map((x, index) => (
          <div key={index} className='modal-result-comment-select-options'>
            <input
              type='radio'
              name='selectedComment'
              onChange={({ target: { value } }) => setSelectedComment(value)}
              value={x?.hos_comment}
            />
            <p>{x?.hos_comment}</p>
          </div>
        ))}
      </Prompt>
    </div>
  );
};

export default ComputeElementaryFirstHalfResult;
