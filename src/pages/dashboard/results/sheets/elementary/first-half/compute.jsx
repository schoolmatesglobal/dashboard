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
    subjects,
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
  } = useResults();

  const { userDetails, setUserDetails } = useAuthDetails();

  // const { studentByClass2 } = useStudent();
  const [loading1, setLoading1] = useState(false);
  const [status, setStatus] = useState("");

  function trigger(time) {
    setLoading1(true);
    setTimeout(() => {
      setLoading1(false);
    }, time);
  }

  const midTermMax = () => {
    let value;
    if (
      userDetails?.maxScores?.has_two_assessment === 1 &&
      inputs.assessment === "first_assesment"
    ) {
      value = userDetails?.maxScores?.first_assessment;
    } else if (
      userDetails?.maxScores?.has_two_assessment === 1 &&
      inputs.assessment === "second_assesment"
    ) {
      value = userDetails?.maxScores?.second_assessment;
    } else if (userDetails?.maxScores?.has_two_assessment === 0) {
      value = userDetails?.maxScores?.midterm;
    }
    return value;
  };

  useEffect(() => {
    setTeacherComment(additionalCreds?.teacher_comment);
    // setStatus(additionalCreds?.status);
  }, [additionalCreds]);

  useEffect(() => {
    // setTeacherComment(additionalCreds?.teacher_comment);
    setStatus(additionalCreds?.status);
  }, [additionalCreds?.status]);

  // useEffect(() => {

  // }, [studentData?.id]);

  const checkResultComputed = (function () {
    if ("results" in additionalCreds) {
      return true;
    } else {
      return false;
    }
  })();

  const allLoading = isLoading || loading1;

  console.log({
    subjects,
    status,
    additionalCreds,
    checkResultComputed,
    studentData,
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
            !checkResultComputed ||
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
                {userDetails?.maxScores?.has_two_assessment === 1 && (
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
                  {subjects?.length > 0 &&
                    subjects?.map((x, key) => (
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

                              const fd = subjects.map((s) => ({
                                ...s,
                                grade:
                                  s.subject === x.subject ? value : s.grade,
                              }));
                              setSubjects(fd);
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
