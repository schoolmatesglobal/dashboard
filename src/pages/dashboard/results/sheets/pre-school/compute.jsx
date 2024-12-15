import React, { useEffect, useState } from "react";
import { useResults } from "../../../../../hooks/useResults";
import { useAppContext } from "../../../../../hooks/useAppContext";
import ProfileImage from "../../../../../components/common/profile-image";
import DetailView from "../../../../../components/views/detail-view";
import { useForm } from "react-formid";
// import { Button, Col, FormGroup, Row } from "reactstrap";
import PageTitle from "../../../../../components/common/title";
import AuthSelect from "../../../../../components/inputs/auth-select";
import AuthInput from "../../../../../components/inputs/auth-input";
import Prompt from "../../../../../components/modals/prompt";
import { useStudent } from "../../../../../hooks/useStudent";
import { useLocation } from "react-router-dom";
import { removeDuplicates } from "../../constant";
import { Button, Col, FormGroup, Input, Row } from "reactstrap";
import { useActivities } from "../../../../../hooks/useActivities";

const ComputePreSchoolResult = () => {
  const { user } = useAppContext("results");
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
    studentData,
    comments,
    preSchoolSubjectsByClass,
    addPreSchoolResult,
    locationState,
    preSchoolCompiledResults,
    preActivities2,
    setPreActivities2,
    // setActivatePreSchoolByClass,
    // preActivities2,
    // setPreActivities2,
  } = useResults();

  const { preActivities } = useActivities();

  const { state } = useLocation();

  // const [preActivities2, setPreActivities2] = useState([]);

  const subjectswithNoDups = () => {
    if (preSchoolSubjectsByClass?.length > 0) {
      return removeDuplicates([...preSchoolSubjectsByClass?.[0]?.subjects]);
    }
  };
  // const result =
  //   preSchoolCompiledResults?.find(
  //     ({ student_id }) => student_id === studentData.id
  //   ) ?? null;

  const result = () => {
    if (preSchoolCompiledResults && preSchoolCompiledResults?.length > 0) {
      return preSchoolCompiledResults?.find(
        ({ student_id }) => student_id === studentData.id
      );
    }
  };

  const newResult = result();

  const { studentByClass2 } = useStudent();

  const {
    inputs,
    setFieldValue,
    handleSubmit,
    setInputs,
    reset,
    getFieldProps,
    errors,
  } = useForm({
    defaultValues: {
      school_opened: "",
      times_present: "",
      times_absent: "",
      teacher_comment: "",
      hos_comment: "",
      evaluation_report: [],
      cognitive_development: [],
      // extra_curricular_activities: [],
    },
    // validation: {
    //   school_opened: {
    //     // required: (val) => !!val || "Field is required",
    //     isNumber: (val) => !Number.isNaN(val) || "Value must be a number",
    //   },
    //   times_present: {
    //     // required: (val) => !!val || "Field is required",
    //     isNumber: (val) => !Number.isNaN(val) || "Value must be a number",
    //   },
    //   times_absent: {
    //     // required: (val) => !!val || "Field is required",
    //     isNumber: (val) => !Number.isNaN(val) || "Value must be a number",
    //   },
    // },
  });

  const onSubjectChange = (section, subject, topic, score) => {
    const subjectObject = {
      subject,
      topic: [{ topic, score }],
    };

    const findSubject = inputs[section]?.find(
      (item) => item.subject === subject
    );
    if (findSubject) {
      const filterTopic = findSubject.topic.filter((t) => t.topic !== topic);
      const newSubject = inputs[section]?.map((item) => {
        if (item.subject === subject) {
          return {
            subject,
            topic: [...filterTopic, ...subjectObject.topic],
          };
        }

        return item;
      });
      setFieldValue(section, newSubject);
    } else {
      setFieldValue(section, [...inputs[section], subjectObject]);
    }
  };

  const getTopicValue = (section, subject, topic) =>
    inputs[section]
      ?.find((item) => item.subject === subject)
      ?.topic?.find((item) => item?.topic === topic)?.score ?? "";

  const submit = async (data) => {
    await addPreSchoolResult({
      ...data,
      student_id: studentData.id,
      student_fullname: `${studentData?.surname} ${studentData?.firstname}  ${studentData?.middlename}`,
      admission_number: studentData.admission_number,
      class_name: `${studentData?.present_class} ${studentData?.sub_class}`,
      period: locationState?.creds?.period,
      term: locationState?.creds?.term,
      session: locationState?.creds?.session,
      teacher_comment: teacherComment,
      teacher_id: user?.id,
      hos_comment: hosComment,
      hos_id: comments[0]?.hos_id,
      extra_curricular_activities: preActivities2 || [],
    });

    // console.log({
    //   data: { ...data },
    //   student_id: studentData.id,
    //   student_fullname: `${studentData?.firstname} ${studentData?.surname} ${studentData?.middlename}`,
    //   admission_number: studentData.admission_number,
    //   class_name: `${studentData?.present_class} ${studentData?.sub_class}`,
    //   period: locationState?.creds?.period,
    //   term: locationState?.creds?.term,
    //   session: locationState?.creds?.session,
    //   teacher_comment: teacherComment,
    //   teacher_id: user?.id,
    //   hos_comment: hosComment,
    //   hos_id: comments[0]?.hos_id,
    //   extra_curricular_activities: preActivities2 || [],
    // });
  };

  const updateInputs = (data) => {
    setInputs({
      ...inputs,
      ...data,
    });
  };

  useEffect(() => {
    if (preSchoolCompiledResults && preSchoolCompiledResults?.length > 0) {
      updateInputs({
        school_opened: result()?.school_opened,
        times_present: result()?.times_present,
        times_absent: result()?.times_absent,
        teacher_comment: result()?.teacher_comment,
        hos_comment: result()?.hos_comment,
        evaluation_report: result()?.evaluation_report || [],
        cognitive_development: result()?.cognitive_development || [],
      });
      setHosComment(result()?.hos_comment);
      setTeacherComment(result()?.teacher_comment);
      setPreActivities2(result()?.extra_curricular_activities || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newResult]);

  let cogSubject = null;

  // console.log({ result: result(), studentByClass2 });

  // console.log({
  //   subjectswithNoDups: subjectswithNoDups(),
  //   preSchoolSubjectsByClass,
  //   hosComment,
  //   teacherComment,
  //   newResult,
  // });
  // console.log({ preSchoolCompiledResults });

  return (
    <div className='results-sheet'>
      {user?.designation_name !== "Student" && (
        <div className='students-wrapper'>
          {studentByClass2?.map((x) => (
            <div
              key={x.id}
              onClick={() => {
                setStudentData(x);
                reset();
                setHosComment("");
                setTeacherComment("");
              }}
              className='student'
            >
              <div
                className={`loader ${isLoading ? "is-loading" : ""} ${
                  studentData.id === x.id ? "active" : ""
                }`}
              >
                <ProfileImage src={x?.image} alt={x?.firstname} />
                {idWithComputedResult.includes(x.id) && (
                  <div className='computed' />
                )}
              </div>
              <div>
                <p>{x.firstname}</p>
                <p>{x.surname}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <DetailView
        hasGoBack={false}
        isLoading={isLoading}
        cancelLink='/app/results/preschool'
        pageTitle={`${studentData?.firstname || "Student"}'s Result`}
        onFormSubmit={handleSubmit(submit)}
      >
        {/* Attendance */}
        {state?.creds?.period === "Second Half" && (
          <Row className='mb-0 mb-sm-4'>
            <Col sm='6' className='mb-4 mb-sm-0'>
              <AuthInput
                label='Number of times school opened'
                type='number'
                hasError={!!errors.school_opened}
                {...getFieldProps("school_opened")}
              />
              {!!errors.school_opened && (
                <p className='error-message'>{errors.school_opened}</p>
              )}
            </Col>
            <Col sm='6' className='mb-4 mb-sm-0'>
              <AuthInput
                label='Number of times present'
                hasError={!!errors.times_present}
                {...getFieldProps("times_present")}
              />
              {!!errors.times_present && (
                <p className='error-message'>{errors.times_present}</p>
              )}
            </Col>
          </Row>
        )}

        {state?.creds?.period === "Second Half" && (
          <Row className='mb-0 mb-sm-4'>
            <Col sm='6' className='mb-4 mb-sm-0'>
              <AuthInput
                label='Number of times absent'
                hasError={!!errors.times_absent}
                {...getFieldProps("times_absent")}
              />
              {!!errors.times_absent && (
                <p className='error-message'>{errors.times_absent}</p>
              )}
            </Col>
          </Row>
        )}
        <hr
          className='my-5'
          style={{
            height: "2px",
            border: "2px solid black",
            background: "black",
          }}
        />
        <PageTitle>Evaluation Report</PageTitle>
        {subjectswithNoDups()
          ?.filter(({ category }) => category === "Evaluation Report")
          ?.map((subject, key) => {
            return (
              <div key={key}>
                {/* <h4>
                  <b>- {subject.name}</b>
                </h4> */}
                <div>
                  {subject?.topic?.map((topic, i) => (
                    <Row className='my-5' key={i}>
                      <Col sm='6' className='mb-4 mb-sm-0'>
                        <h5
                          style={{
                            lineHeight: "22px",
                            fontSize: "16px",
                            textTransform: "uppercase",
                          }}
                        >
                          {/* {i + 1}. {topic.name}: */}
                          <b> -- {topic.name}</b> ({subject.name}):
                        </h5>
                      </Col>
                      <Col sm='6' className='mb-4 mb-sm-0'>
                        <AuthSelect
                          value={getTopicValue(
                            "evaluation_report",
                            subject.name,
                            topic.name
                          )}
                          onChange={({ target: { value } }) => {
                            onSubjectChange(
                              "evaluation_report",
                              subject.name,
                              topic.name,
                              value
                            );
                          }}
                          // options={[
                          //   "Needs Improvement",
                          //   "Fair",
                          //   "Good",
                          //   "Excellent",
                          //   "Work In Progress",
                          //   "Needs Reinforcement",
                          //   "Achieved",
                          // ].map((x) => ({
                          //   value: x,
                          //   title: x,
                          // }))}
                          options={[
                            "Needs Improvement",
                            "Fair",
                            "Good",
                            "Excellent",
                          ].map((x) => ({
                            value: x,
                            title: x,
                          }))}
                        />
                      </Col>
                    </Row>
                  ))}
                </div>
              </div>
            );
          })}
        <hr
          className='my-5'
          style={{
            height: "2px",
            border: "2px solid black",
            background: "black",
          }}
        />
        <PageTitle>Cognitive Development</PageTitle>
        {subjectswithNoDups()
          ?.filter(({ category }) => category === "Cognitive Development")
          ?.map((subject, key) => {
            cogSubject = subject.name;
            return (
              <div key={key}>
                {/* <h4>
                  <b>- {subject.name}</b>
                </h4> */}
                <div>
                  {subject?.topic?.map((topic, i) => (
                    <Row
                      className='my-5 d-flex align-items-center border-bottom pb-4'
                      key={i}
                    >
                      <Col sm='6' md='8' lg='9' className='mb-4 mb-sm-0'>
                        <h5>
                          {/* {i + 1}. {topic.name}: */}
                          <b> -- {topic.name}</b> ({subject.name}):
                        </h5>
                      </Col>
                      <Col sm='6' md='4' lg='3' className='mb-4 mb-sm-0'>
                        <AuthSelect
                          value={getTopicValue(
                            "cognitive_development",
                            subject.name,
                            topic.name
                          )}
                          onChange={({ target: { value } }) => {
                            onSubjectChange(
                              "cognitive_development",
                              subject.name,
                              topic.name,
                              value
                            );
                          }}
                          options={[
                            {
                              value: "Work in Progress",
                              title: "Work in Progress",
                            },
                            {
                              value: "Needs Reinforcement",
                              title: "Needs Reinforcement",
                            },
                            { value: "Archieved", title: "Achieved" },
                          ].map((x) => ({
                            value: x?.value,
                            title: x?.title,
                          }))}
                          style={{ width: "100%" }}
                        />
                      </Col>
                    </Row>
                  ))}
                </div>
              </div>
            );
          })}
        <hr
          className='my-5'
          style={{
            height: "2px",
            border: "2px solid black",
            background: "black",
          }}
        />

        {/* Extra curricular preactivities */}
        {<PageTitle>Extra curricular activities</PageTitle>}
        {
          <div>
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
                      //   preActivities2?.find((x) => x.name === attr.name)
                      //     ?.value === "1"
                      // }
                      // disabled={!!inputs.has_two_assessment}
                      checked={
                        preActivities2?.find((x) => x.name === attr.name)
                          ?.value === "1"
                      }
                      onChange={(e) => {
                        const itemIndex = preActivities2?.findIndex(
                          (x) => x.name === attr.name
                        );

                        if (itemIndex !== -1) {
                          // Update existing item
                          const updatedExtraActivities = [...preActivities2];
                          updatedExtraActivities[itemIndex] = {
                            name: attr.name,
                            value: e.target.checked ? "1" : "0",
                          };
                          setPreActivities2(updatedExtraActivities);
                        } else {
                          // Add new item
                          setPreActivities2([
                            ...preActivities2,
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
        }

        <hr
          className='my-5'
          style={{
            height: "2px",
            border: "2px solid black",
            background: "black",
          }}
        />

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
              onChange={({ target: { value } }) => setTeacherComment(value)}
            />
          </FormGroup>
        </div>
        <hr
          className='my-5'
          style={{
            height: "2px",
            border: "2px solid black",
            background: "black",
          }}
        />
        <PageTitle>HEAD OF NURSERY's Comment</PageTitle>
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
      </DetailView>
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

export default ComputePreSchoolResult;
