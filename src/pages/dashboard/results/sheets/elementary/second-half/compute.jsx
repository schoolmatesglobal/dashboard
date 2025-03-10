import React, { Fragment, useEffect, useState } from "react";
import { useResults } from "../../../../../../hooks/useResults";
import { useAppContext } from "../../../../../../hooks/useAppContext";
import DetailView from "../../../../../../components/views/detail-view";
import { Button, Col, FormGroup, Input, Row, Spinner } from "reactstrap";
import AuthInput from "../../../../../../components/inputs/auth-input";
import PageTitle from "../../../../../../components/common/title";
import Prompt from "../../../../../../components/modals/prompt";
import { useSkills } from "../../../../../../hooks/useSkills";
import AuthSelect from "../../../../../../components/inputs/auth-select";
import StudentsResults from "../../../../../../components/common/students-results";
import { useStudent } from "../../../../../../hooks/useStudent";
import { useActivities } from "../../../../../../hooks/useActivities";
import { useReporting } from "../../../../../../hooks/useReporting";
import GoBack from "../../../../../../components/common/go-back";
import { useAuthDetails } from "../../../../../../stores/authDetails";
import Select from "react-select";

const ComputeElementarySecondHalfResult = () => {
  const { user } = useAppContext("results");
  const { isLoading: skillLoading, skills } = useSkills();
  const { isLoading: reportLoading, reports } = useReporting();
  const {
    idWithComputedResult,
    openPrompt,
    setOpenPrompt,
    selectedComment,
    setSelectedComment,
    teacherComment,
    setTeacherComment,
    hosComment,
    setHosComment,
    comment,
    setComment,
    isLoading,
    setStudentData,
    studentByClassAndSession,
    studentData,
    comments,
    maxScores,
    // subjects,
    setSubjects,
    getSubjectByClass: { data: subjects, isFetching: isFetchingSubjects },
    getEndOfTermResult: {
      data: getEndOfTermResults,
      isFetching: isFetchingEndOfTermResults,
    },
    computedSubjects,
    setComputedSubjects,
    additionalCreds,
    setAdditionalCreds,
    createEndOfTermResult,
    performanceRemark,
    setPerformanceRemark,
    setInitGetExistingSecondHalfResult,
    extraActivities,
    setExtraActivities,
    abacus,
    setAbacus,
    setActivateEndOfTerm,
    initGetExistingSecondHalfResult,
    activateEndOfTerm,
    releaseResult,
    releaseResultLoading,
    withholdResult,
    withholdResultLoading,
    studentByClass2,
    subjectsByClass,
    subjectsByClass2,
    midtermResult,
    setIdWithComputedResult,
  } = useResults();

  // const { studentByClass2 } = useStudent();

  const [loading1, setLoading1] = useState(false);
  const [status, setStatus] = useState("");
  const [subject3, setSubject3] = useState([]);
  // const [additionalCreds, setAdditionalCreds] = useState({});

  const { userDetails, setUserDetails } = useAuthDetails();

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

  const handleSocialChecks = (property, type, value) => {
    if (additionalCreds && additionalCreds[property]) {
      const find = additionalCreds[property].find((x) => x.name === type);
      if (find) {
        setAdditionalCreds({
          ...additionalCreds,
          [property]: additionalCreds[property].map((x) => {
            if (x.name === type)
              return {
                name: type,
                score: value,
              };
            return x;
          }),
        });
      } else {
        setAdditionalCreds({
          ...additionalCreds,
          [property]: [
            ...additionalCreds[property],
            {
              name: type,
              score: value,
            },
          ],
        });
      }
    } else {
      setAdditionalCreds({
        ...additionalCreds,
        [property]: [
          {
            name: type,
            score: value,
          },
        ],
      });
    }
  };

  const { activities } = useActivities();

  const checkResultComputed = (function () {
    if (additionalCreds && "results" in additionalCreds) {
      return true;
    } else {
      return false;
    }
  })();

  const allLoading =
    isLoading ||
    loading1 ||
    skillLoading ||
    reportLoading ||
    isFetchingSubjects ||
    isFetchingEndOfTermResults;
  // const allLoading2 = isLoading || loading1 || skillLoading || reportLoading;

  const newSubjects = computedSubjects ?? [];
  // const newSubjects = removeDuplicates(subjects) ?? [];

  // useEffect(() => {
  //   // setActivateEndOfTerm(true);
  //   setTimeout(() => {
  //     setActivateEndOfTerm(false);
  //   }, 2000);
  //   // setTeacherComment(additionalCreds?.teacher_comment);
  //   // setHosComment(additionalCreds?.hos_comment);
  //   // setPerformanceRemark(additionalCreds?.performance_remark);
  // }, [initGetExistingSecondHalfResult]);

  // useEffect(() => {
  //   // setTeacherComment(additionalCreds?.teacher_comment);
  //   setStatus(additionalCreds?.status);
  //   // if (idWithComputedResult?.length > 0) {
  //   //   setSubject3(removeDuplicates(midtermResult?.mergeSubjectAndResult2));
  //   // } else {
  //   //   setSubject3(removeDuplicates(subjects));
  //   // }
  // }, [additionalCreds?.status, studentData]);

  useEffect(() => {
    const adjustResults = () => {
      if (
        getEndOfTermResults?.results2 !== undefined &&
        getEndOfTermResults?.results2?.length > 0 &&
        getEndOfTermResults?.results2?.length != subjects?.length
      ) {
        return subjects?.map((sb, i) => {
          const rs = getEndOfTermResults?.results2?.find(
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
        return getEndOfTermResults?.results2;
      }
    };

    const finalSubjects =
      getEndOfTermResults?.results2 !== undefined &&
      getEndOfTermResults.results2.length > 0
        ? adjustResults
        : subjects;

    setComputedSubjects(finalSubjects);
    setAdditionalCreds(getEndOfTermResults ?? {});
    setStatus(getEndOfTermResults?.status);
    setTeacherComment(getEndOfTermResults?.teacher_comment);
    setAbacus(getEndOfTermResults?.abacus?.name ?? "");
    setHosComment(getEndOfTermResults?.hos_comment);
    setPerformanceRemark(getEndOfTermResults?.performance_remark);
    setExtraActivities(getEndOfTermResults?.extra_curricular_activities ?? []);
    setIdWithComputedResult([getEndOfTermResults?.student_id]);
  }, [
    allLoading,
    getEndOfTermResults?.results2,
    studentData,
    reports,
    getEndOfTermResults?.extra_curricular_activities,
    // additionalCreds,
  ]);

  console.log({
    // abacus,
    // midtermResult,
    // idWithComputedResult,
    // // newSubjects,
    // // subjectsByClass,
    // // subjectsByClass2,
    // subjects,
    // userDetails,
    extraActivities,
    activities,
    reports,
    additionalCreds,
    getEndOfTermResults,
  });
  // console.log({ reports, skills, user, userDetails });

  return (
    <div className='results-sheet'>
      <GoBack />

      {/* {allLoading && (
        <div
          style={{ minHeight: "80vh" }}
          className='d-flex align-items-center  justify-content-center w-full'
        >
          <Spinner />
        </div>
      )} */}

      {user?.designation_name !== "Student" && (
        <StudentsResults
          studentByClassAndSession={studentByClass2}
          onProfileSelect={(x) => {
            setIdWithComputedResult([]);
            setStudentData(x);
            // setHosComment("");
            // setTeacherComment("");
            setActivateEndOfTerm(true);
            setInitGetExistingSecondHalfResult(true);
          }}
          isLoading={isLoading}
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
          // doubleSubmitOnclick={()=> }
          pageTitle={
            <p className='fs-2 fw-bold '>
              {`${studentData?.firstname || "Student"}'s Result (${
                status
                  ? status
                  : status === ""
                  ? "Not-Released"
                  : "Not-Computed"
              })`}
              {allLoading && (
                <span className='px-3 '>
                  <Spinner color='#20c200' size='md' />
                </span>
              )}
            </p>
          }
          onFormSubmit={(e) => {
            e.preventDefault();
            createEndOfTermResult();
          }}
        >
          {
            <>
              {user?.teacher_type === "class teacher" && (
                <Row className='mb-0 mb-sm-4'>
                  <Col sm='6' className='mb-4 mb-sm-0'>
                    <AuthInput
                      label='Number of times school opened'
                      value={additionalCreds?.school_opened ?? "0"}
                      onChange={({ target: { value } }) => {
                        if (Number.isNaN(Number(value))) return;
                        setAdditionalCreds({
                          ...additionalCreds,
                          school_opened: value,
                        });
                      }}
                    />
                  </Col>
                  <Col sm='6' className='mb-4 mb-sm-0'>
                    <AuthInput
                      label='Number of times present'
                      value={additionalCreds?.times_present ?? "0"}
                      onChange={({ target: { value } }) => {
                        if (Number.isNaN(Number(value))) return;
                        setAdditionalCreds({
                          ...additionalCreds,
                          times_present: value,
                        });
                      }}
                    />
                  </Col>
                </Row>
              )}
              {/* {user?.teacher_type === "class teacher" && (
            <Row className='mb-0 mb-sm-4'>
              <Col sm='6' className='mb-4 mb-sm-0'>
                <AuthInput
                  label='Number of times absent'
                  value={additionalCreds?.times_absent ?? "0"}
                  onChange={({ target: { value } }) => {
                    if (Number.isNaN(Number(value))) return;
                    setAdditionalCreds({
                      ...additionalCreds,
                      times_absent: value,
                    });
                  }}
                />
              </Col>
            </Row>
                    )} */}
              <hr className='my-5' />
              <PageTitle>
                Evaluation Report - {`(${maxScores?.exam}`}
                <span>marks</span> {`)`}
              </PageTitle>
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
                            onChange={({ target: { value } }) => {
                              if (Number.isNaN(Number(value))) return;
                              if (Number(value) > Number(maxScores?.exam))
                                return;
                              const fd = computedSubjects.map((s) => ({
                                ...s,
                                grade:
                                  s.subject === x.subject ? value : s.grade,
                                score:
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
                <hr className='my-5' />
              )}
              {user?.teacher_type === "class teacher" &&
                reports?.length > 0 &&
                reports?.map((report, index) => (
                  <Fragment key={index}>
                    {index !== 0 && <hr className='my-5' />}
                    <PageTitle>
                      {report?.report_type === "PUPIL REPORT" &&
                      user?.campus?.includes("College")
                        ? "AFFECTIVE DEVELOPMENT"
                        : report?.report_type}
                    </PageTitle>
                    <div>
                      <div>
                        {report?.attribute?.map((attr, i) => (
                          <Row key={i} className='my-5'>
                            <Col sm='6' className='mb-4 mb-sm-0'>
                              <h5>
                                {i + 1}. {attr?.name}:{" "}
                              </h5>
                            </Col>
                            <Col sm='6' className='mb-1 mb-sm-0'>
                              <Select
                                options={[
                                  { value: "1", label: "1" },
                                  { value: "2", label: "2" },
                                  { value: "3", label: "3" },
                                  { value: "4", label: "4" },
                                  { value: "5", label: "5" },
                                  // { title: 1, value: 1 },
                                  // { title: 2, value: 2 },
                                  // { title: 3, value: 3 },
                                  // { title: 4, value: 4 },
                                  // { title: 5, value: 5 },
                                ]}
                                value={
                                  (additionalCreds &&
                                    additionalCreds[
                                      report.report_type
                                        .toLowerCase()
                                        .split(" ")
                                        .join("_")
                                    ]?.find((x) => x.name === attr.name)
                                      ?.score) ||
                                  ""
                                }
                                onChange={(value) => {
                                  handleSocialChecks(
                                    report?.report_type
                                      .toLowerCase()
                                      .split(" ")
                                      .join("_"),
                                    attr.name,
                                    value
                                  );
                                }}
                              />
                            </Col>
                          </Row>
                        ))}
                      </div>
                    </div>
                  </Fragment>
                ))}
              {user?.teacher_type === "class teacher" &&
                !user?.campus?.includes("College") && <hr className='my-5' />}
              {user?.teacher_type === "class teacher" &&
                !user?.campus?.includes("College") && (
                  <Fragment>
                    {/* {index !== 0 && <hr className='my-5' />} */}
                    <div>
                      <div>
                        <Row className='my-5'>
                          <Col sm='6' className='mb-4 mb-sm-0'>
                            <PageTitle>Abacus</PageTitle>
                          </Col>
                          <Col sm='6' className='mb-1 mb-sm-0'>
                            <AuthSelect
                              options={[
                                {
                                  title: "Need Improvement",
                                  value: "Need Improvement",
                                },
                                { title: "Fair", value: "Fair" },
                                { title: "Good", value: "Good" },
                                { title: "Excellent", value: "Excellent" },
                              ]}
                              value={abacus}
                              onChange={({ target: { value } }) => {
                                setAbacus(value);
                              }}
                            />
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Fragment>
                )}
              {user?.teacher_type === "class teacher" &&
                !user?.campus?.includes("College") && <hr className='my-5' />}
              {/* Extra curricular activities */}
              {user?.teacher_type === "class teacher" && (
                <PageTitle>Extra curricular activities</PageTitle>
              )}
              {user?.teacher_type === "class teacher" && (
                <div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))", // Adjust the column width as needed
                      // gap: "30px",
                      width: "100%",
                    }}
                  >
                    {activities?.map((attr, i) => (
                      <div
                        key={i}
                        style={{
                          border: "1.5px solid rgba(0, 0, 0, 0.3)",
                          padding: "2rem 3rem",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <div
                          className='d-flex flex-column gap-4 align-items-center '
                          style={{
                            width: "100px",
                          }}
                        >
                          <p
                            style={{
                              textAlign: "center",
                            }}
                          >
                            {attr.name}
                          </p>
                          <Input
                            type='checkbox'
                            // className="flex-g-1"
                            style={{
                              width: "18px",
                              height: "18px",
                            }}
                            // className="ms-3"
                            // checked={
                            //   extraActivities?.find((x) => x.name === attr.name)
                            //     ?.value === "1"
                            // }
                            // disabled={!!inputs.has_two_assessment}
                            checked={
                              extraActivities?.find((x) => x.name === attr.name)
                                ?.value === "1"
                            }
                            onChange={(e) => {
                              const itemIndex = extraActivities?.findIndex(
                                (x) => x.name === attr.name
                              );
                              if (itemIndex !== -1) {
                                // Update existing item
                                const updatedExtraActivities = [
                                  ...extraActivities,
                                ];
                                updatedExtraActivities[itemIndex] = {
                                  name: attr.name,
                                  value: e.target.checked ? "1" : "0",
                                };
                                setExtraActivities(updatedExtraActivities);
                              } else {
                                // Add new item
                                setExtraActivities([
                                  ...extraActivities,
                                  {
                                    name: attr.name,
                                    value: e.target.checked ? "1" : "0",
                                  },
                                ]);
                              }
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {user?.teacher_type === "class teacher" &&
                user?.campus?.includes("College") && <hr className='my-5' />}
              {user?.teacher_type === "class teacher" &&
                user?.campus?.includes("College") && (
                  <PageTitle>Progression Remark</PageTitle>
                )}
              {user?.teacher_type === "class teacher" &&
                user?.campus?.includes("College") && (
                  <div>
                    <FormGroup>
                      <textarea
                        className='form-control mt-3'
                        rows='5'
                        value={performanceRemark}
                        onChange={({ target: { value } }) =>
                          setPerformanceRemark(value)
                        }
                      />
                    </FormGroup>
                  </div>
                )}
              {user?.teacher_type === "class teacher" && (
                <hr className='my-5' />
              )}
              {user?.teacher_type === "class teacher" && (
                <PageTitle>Teacher's Comment</PageTitle>
              )}
              {user?.teacher_type === "class teacher" && (
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
                      onChange={({ target: { value } }) =>
                        setTeacherComment(value)
                      }
                    />
                  </FormGroup>
                </div>
              )}
              {user?.teacher_type === "class teacher" && (
                <hr className='my-5' />
              )}
              {user?.teacher_type === "class teacher" && (
                <PageTitle>HOS' Comment</PageTitle>
              )}
              {user?.teacher_type === "class teacher" && (
                <div>
                  <Button
                    onClick={() => {
                      setComment("hos");
                      setOpenPrompt(true);
                    }}
                  >
                    Suggest
                  </Button>
                  <FormGroup>
                    <textarea
                      className='form-control mt-3'
                      rows='5'
                      value={hosComment}
                      onChange={({ target: { value } }) => setHosComment(value)}
                    />
                  </FormGroup>
                </div>
              )}
            </>
          }
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

export default ComputeElementarySecondHalfResult;
