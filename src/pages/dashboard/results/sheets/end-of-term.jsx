import { faCheck, faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../../components/buttons/button";
import PageSheet from "../../../../components/common/page-sheet";
import { Col, Row, Table } from "reactstrap";
import ButtonGroup from "../../../../components/buttons/button-group";
import Prompt from "../../../../components/modals/prompt";
import { useResults } from "../../../../hooks/useResults";
import ProfileImage from "../../../../components/common/profile-image";
import { useAppContext } from "../../../../hooks/useAppContext";
import moment from "moment";
import AuthSelect from "../../../../components/inputs/auth-select";
import { useState } from "react";
import { useSkills } from "../../../../hooks/useSkills";
import { useAuthDetails } from "../../../../stores/authDetails";

const AffectiveDispositionTableRow = ({
  isCompute,
  title,
  value,
  onChange,
}) => {
  return (
    <tr>
      <td>{title}</td>
      {Array(5)
        .fill(null)
        .map((_, i) => {
          const index = 5 - i;

          return (
            <td key={index}>
              {isCompute ? (
                <input
                  type="radio"
                  checked={index === value}
                  onChange={() => onChange(index)}
                />
              ) : index === value ? (
                <FontAwesomeIcon icon={faCheck} color="green" />
              ) : null}
            </td>
          );
        })}
    </tr>
  );
};

const EndOfTerm = ({ isCompute = false }) => {
  const [openSubjectPrompt, setOpenSubjectPrompt] = useState(false);
  const navigate = useNavigate();
  const { user } = useAppContext("results");
  const { isLoading: skillLoading } = useSkills();
  const {
    academicDate,
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
    pdfExportComponent,
    handlePrint,
    maxScores,
    isLoading: resultLoading,
    setStudentData,
    studentByClassAndSession,
    setInitGetExistingSecondHalfResult,
    studentData,
    locationState,
    subjects,
    setSubjects,
    additionalCreds,
    setAdditionalCreds,
    studentMidResult,
    getTotalScores,
    getTotalMidScores,
    comments,
    subjectsByClass,
    removeSubject,
    createEndOfTermResult,
    getScoreRemark,
  } = useResults();

  const isLoading = skillLoading || resultLoading;

  const { userDetails, setUserDetails } = useAuthDetails();

  const getAddSubjectSelectOptions = () => {
    const mapSubjects = subjectsByClass?.map((x) => ({
      title: x.subject,
      value: { ...x, grade: "0" },
    }));

    const options = mapSubjects?.filter(
      (x) => !subjects?.some((s) => s.subject === x.title)
    );

    return options;
  };

  const handleSocialChecks = (property, type, value) => {
    if (additionalCreds[property]) {
      const find = additionalCreds[property].find((x) =>
        Object.keys(x).includes(type)
      );
      if (find) {
        setAdditionalCreds({
          ...additionalCreds,
          [property]: additionalCreds[property].map((x) => {
            if (Object.keys(x)[0] === type) return { [type]: value };
            return x;
          }),
        });
      } else {
        setAdditionalCreds({
          ...additionalCreds,
          [property]: [...additionalCreds[property], { [type]: value }],
        });
      }
    } else {
      setAdditionalCreds({
        ...additionalCreds,
        [property]: [{ [type]: value }],
      });
    }
  };

  return (
    <div className="results-sheet">
      {user?.designation_name !== "Student" && (
        <div className="students-wrapper">
          {studentByClassAndSession?.map((x) => (
            <div
              key={x.id}
              onClick={() => {
                setStudentData(x);
                setInitGetExistingSecondHalfResult(true);
              }}
              className="student"
            >
              <div
                className={`loader ${isLoading ? "is-loading" : ""} ${
                  studentData.id === x.id ? "active" : ""
                }`}
              >
                <ProfileImage src={x?.image} alt={x.firstname} />
                {idWithComputedResult.includes(x.id) && (
                  <div className="computed" />
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
      <PageSheet>
        {!isCompute && (
          <div className="mb-3">
            <Button
              onClick={() => {
                if (pdfExportComponent.current) {
                  handlePrint();
                }
              }}
            >
              <FontAwesomeIcon icon={faPrint} /> Print
            </Button>
          </div>
        )}

        <div
          ref={pdfExportComponent}
          className="first-level-results-sheet end-term"
        >
          <div className="school-details">
            <div>
              <div className="image">
                {user?.school?.schlogo && (
                  <img src={user?.school?.schlogo} alt="school" />
                )}
              </div>
              <div className="text">
                <h3 className="name">{user?.school?.schname}</h3>
                {user?.school?.schnmotto && (
                  <p className="motto">({user?.school?.schnmotto})</p>
                )}

                <p className="address">{user?.school?.schaddr}</p>
                <p className="tel">Tel: {user?.school?.schphone}</p>
                <p className="email">Email: {user?.school?.schemail}</p>
                <p className="web">Website: {user?.school?.schwebsite}</p>
              </div>
              <div className="image">
                {studentData?.image && (
                  <img src={studentData?.image} alt="student" />
                )}
              </div>
            </div>
            <h4 className="title">
              {locationState?.creds?.term} END OF TERM REPORT{" "}
              {locationState?.creds?.session} SESSION
            </h4>
          </div>
          <div className="student-details">
            <Row>
              <Col>
                <div className="detail">
                  <h5>Pupil's Name:</h5>
                  <h5>
                    {studentData?.firstname} {studentData?.surname}{" "}
                    {studentData?.middlename}
                  </h5>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="detail">
                  <h5>Admission No:</h5>
                  <h5>{studentData?.admission_number}</h5>
                </div>
              </Col>
              <Col>
                <div className="detail">
                  <h5>Date of Birth:</h5>
                  <h5>{studentData?.dob}</h5>
                </div>
              </Col>
              <Col>
                <div className="detail">
                  <h5>Class: </h5>
                  <h5>
                    {studentData?.present_class} {studentData?.sub_class}
                  </h5>
                </div>
              </Col>
            </Row>
          </div>
          <div className="attendance-wrapper">
            <h4 className="title">1. Attendance Record</h4>
            <div className="table-wrapper">
              <Row>
                <Col>
                  <Table>
                    <tbody>
                      <tr>
                        <td>No. of Times School Opened</td>
                        <td>
                          <input
                            type="text"
                            value={additionalCreds?.school_opened ?? "0"}
                            className="form-control"
                            disabled={!isCompute}
                            onChange={({ target: { value } }) => {
                              if (Number.isNaN(Number(value))) return;
                              setAdditionalCreds({
                                ...additionalCreds,
                                school_opened: value,
                              });
                            }}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>No. of Times Present</td>
                        <td>
                          <input
                            type="text"
                            value={additionalCreds?.times_present ?? "0"}
                            className="form-control"
                            disabled={!isCompute}
                            onChange={({ target: { value } }) => {
                              if (Number.isNaN(Number(value))) return;
                              setAdditionalCreds({
                                ...additionalCreds,
                                times_present: value,
                              });
                            }}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>No. of Times Absent</td>
                        <td>
                          <input
                            type="text"
                            value={additionalCreds?.times_absent ?? "0"}
                            className="form-control"
                            disabled={!isCompute}
                            onChange={({ target: { value } }) => {
                              if (Number.isNaN(Number(value))) return;
                              setAdditionalCreds({
                                ...additionalCreds,
                                times_absent: value,
                              });
                            }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
                <Col>
                  <Table>
                    <tbody>
                      <tr>
                        <td>This Term Ends:</td>
                        <td>{academicDate?.session_ends}</td>
                      </tr>
                      <tr>
                        <td>Next Term Begins:</td>
                        <td>{academicDate?.session_resumes}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </div>
          </div>
          <div className="results-table-wrapper">
            <h4 className="title">2. COGNITIVE PERFORMANCE</h4>
            <Table>
              <thead>
                <tr>
                  <th>
                    <div className="d-flex align-items-center">
                      SUBJECTS
                      {isCompute && (
                        <Button
                          className="ms-3"
                          onClick={() => setOpenSubjectPrompt(true)}
                        >
                          &#43; Add
                        </Button>
                      )}
                    </div>
                  </th>
                  <th>MID TERM TEST</th>
                  <th>EXAM SCORES</th>
                  <th>TOTAL SCORES</th>
                  {!isCompute && <th>REMARKS</th>}
                </tr>
                <tr>
                  <th>MAXIMUM SCORES</th>
                  <th>{userDetails?.maxScores?.midterm}</th>
                  <th>{userDetails?.maxScores?.exam}</th>
                  <th>{userDetails?.maxScores?.total}</th>
                  {!isCompute && <th>EXCELLENT</th>}
                </tr>
                <tr>
                  <th />
                  <th />
                  <th />
                  <th />
                  {!isCompute && <th />}
                </tr>
              </thead>
              <tbody>
                {subjects?.map((s, index) => (
                  <tr key={index}>
                    <td>
                      <div className="d-flex align-items-center">
                        {isCompute && (
                          <Button
                            variant="danger"
                            className="me-3"
                            onClick={() => removeSubject(s.subject)}
                          >
                            &#8722;
                          </Button>
                        )}
                        {s?.subject}
                      </div>
                    </td>
                    <td>
                      {studentMidResult?.find((x) => x.subject === s.subject)
                        ?.score || 0}
                    </td>
                    <td>
                      <input
                        type="text"
                        value={s.grade}
                        className="form-control"
                        disabled={!isCompute}
                        onChange={({ target: { value } }) => {
                          if (Number.isNaN(Number(value))) return;

                          if (Number(value) > Number(userDetails?.maxScores?.exam)) return;

                          const fd = subjects.map((su) => ({
                            ...su,
                            grade: su.subject === s.subject ? value : su.grade,
                          }));

                          setSubjects(fd);
                        }}
                      />
                    </td>
                    <td>
                      {(
                        Number(
                          studentMidResult?.find((x) => x.subject === s.subject)
                            ?.score || 0
                        ) + Number(s?.grade ?? 0)
                      ).toFixed(2)}
                    </td>
                    {!isCompute && (
                      <td>
                        {
                          getScoreRemark(
                            Number(
                              studentMidResult?.find(
                                (x) => x.subject === s.subject
                              )?.score || 0
                            ) + Number(s.grade)
                          )?.remark
                        }
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th>TOTAL SCORES</th>
                  <th>{getTotalMidScores()}</th>
                  <th>{getTotalScores()}</th>
                  <th>{getTotalMidScores() + getTotalScores()}</th>
                  {!isCompute && <th />}
                </tr>
                <tr>
                  <th />
                  <th />
                  <th />
                  <th />
                  {!isCompute && <th />}
                </tr>
                {!isCompute && (
                  <tr>
                    <th>STUDENT’S OVERALL AVERAGE</th>
                    <th>
                      {(
                        (getTotalMidScores() + getTotalScores()) /
                        subjects?.length
                      ).toFixed(2)}
                    </th>
                    <th>STUDENT’S OVERALL GRADE POINT </th>
                    <th>
                      {
                        getScoreRemark(
                          (getTotalMidScores() + getTotalScores()) /
                            subjects?.length
                        )?.remark
                      }
                    </th>
                  </tr>
                )}
              </tfoot>
            </Table>
          </div>
          <div className="mb-5 socials-wrapper">
            <Row>
              <Col>
                <h4 className="title">3. AFFECTIVE DISPOSITION</h4>
                <Table>
                  <thead>
                    <tr>
                      <th>Behaviours</th>
                      <th colSpan="5">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td />
                      <td>5</td>
                      <td>4</td>
                      <td>3</td>
                      <td>2</td>
                      <td>1</td>
                    </tr>
                    <AffectiveDispositionTableRow
                      isCompute={isCompute}
                      title="Attentiveness"
                      value={
                        additionalCreds?.affective_disposition?.find((x) =>
                          Object.keys(x).includes("attentiveness")
                        )?.attentiveness
                      }
                      onChange={(value) => {
                        handleSocialChecks(
                          "affective_disposition",
                          "attentiveness",
                          value
                        );
                      }}
                    />
                    <AffectiveDispositionTableRow
                      isCompute={isCompute}
                      title="Cooperation with others"
                      value={
                        additionalCreds?.affective_disposition?.find((x) =>
                          Object.keys(x).includes("coorperation")
                        )?.coorperation
                      }
                      onChange={(value) => {
                        handleSocialChecks(
                          "affective_disposition",
                          "coorperation",
                          value
                        );
                      }}
                    />
                    <AffectiveDispositionTableRow
                      isCompute={isCompute}
                      title="Emotional Stability"
                      value={
                        additionalCreds?.affective_disposition?.find((x) =>
                          Object.keys(x).includes("emotionalStability")
                        )?.emotionalStability
                      }
                      onChange={(value) => {
                        handleSocialChecks(
                          "affective_disposition",
                          "emotionalStability",
                          value
                        );
                      }}
                    />
                    <AffectiveDispositionTableRow
                      isCompute={isCompute}
                      title="Helping others"
                      value={
                        additionalCreds?.affective_disposition?.find((x) =>
                          Object.keys(x).includes("helpingOthers")
                        )?.helpingOthers
                      }
                      onChange={(value) => {
                        handleSocialChecks(
                          "affective_disposition",
                          "helpingOthers",
                          value
                        );
                      }}
                    />
                    <AffectiveDispositionTableRow
                      isCompute={isCompute}
                      title="Honesty"
                      value={
                        additionalCreds?.affective_disposition?.find((x) =>
                          Object.keys(x).includes("honesty")
                        )?.honesty
                      }
                      onChange={(value) => {
                        handleSocialChecks(
                          "affective_disposition",
                          "honesty",
                          value
                        );
                      }}
                    />
                    <AffectiveDispositionTableRow
                      isCompute={isCompute}
                      title="Leadership"
                      value={
                        additionalCreds?.affective_disposition?.find((x) =>
                          Object.keys(x).includes("leadership")
                        )?.leadership
                      }
                      onChange={(value) => {
                        handleSocialChecks(
                          "affective_disposition",
                          "leadership",
                          value
                        );
                      }}
                    />
                    <AffectiveDispositionTableRow
                      isCompute={isCompute}
                      title="Neatness"
                      value={
                        additionalCreds?.affective_disposition?.find((x) =>
                          Object.keys(x).includes("neatness")
                        )?.neatness
                      }
                      onChange={(value) => {
                        handleSocialChecks(
                          "affective_disposition",
                          "neatness",
                          value
                        );
                      }}
                    />
                    <AffectiveDispositionTableRow
                      isCompute={isCompute}
                      title="Perseverance"
                      value={
                        additionalCreds?.affective_disposition?.find((x) =>
                          Object.keys(x).includes("perseverance")
                        )?.perseverance
                      }
                      onChange={(value) => {
                        handleSocialChecks(
                          "affective_disposition",
                          "perseverance",
                          value
                        );
                      }}
                    />
                    <AffectiveDispositionTableRow
                      isCompute={isCompute}
                      title="Politeness"
                      value={
                        additionalCreds?.affective_disposition?.find((x) =>
                          Object.keys(x).includes("politeness")
                        )?.politeness
                      }
                      onChange={(value) => {
                        handleSocialChecks(
                          "affective_disposition",
                          "politeness",
                          value
                        );
                      }}
                    />
                    <AffectiveDispositionTableRow
                      isCompute={isCompute}
                      title="Punctuality"
                      value={
                        additionalCreds?.affective_disposition?.find((x) =>
                          Object.keys(x).includes("punctuality")
                        )?.punctuality
                      }
                      onChange={(value) => {
                        handleSocialChecks(
                          "affective_disposition",
                          "punctuality",
                          value
                        );
                      }}
                    />
                  </tbody>
                </Table>
              </Col>
              <Col>
                <h4 className="title">4. PSYCHOMOTOR SKILLS</h4>
                <Table>
                  <thead>
                    <tr>
                      <th>Behaviours</th>
                      <th colSpan="5">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td />
                      <td>5</td>
                      <td>4</td>
                      <td>3</td>
                      <td>2</td>
                      <td>1</td>
                    </tr>
                    <AffectiveDispositionTableRow
                      isCompute={isCompute}
                      title="Handling Tools"
                      value={
                        additionalCreds?.psychomotor_skills?.find((x) =>
                          Object.keys(x).includes("handlingTools")
                        )?.handlingTools
                      }
                      onChange={(value) => {
                        handleSocialChecks(
                          "psychomotor_skills",
                          "handlingTools",
                          value
                        );
                      }}
                    />
                    <AffectiveDispositionTableRow
                      isCompute={isCompute}
                      title="Games"
                      value={
                        additionalCreds?.psychomotor_skills?.find((x) =>
                          Object.keys(x).includes("games")
                        )?.games
                      }
                      onChange={(value) => {
                        handleSocialChecks(
                          "psychomotor_skills",
                          "games",
                          value
                        );
                      }}
                    />
                    <AffectiveDispositionTableRow
                      isCompute={isCompute}
                      title="Music"
                      value={
                        additionalCreds?.psychomotor_skills?.find((x) =>
                          Object.keys(x).includes("music")
                        )?.music
                      }
                      onChange={(value) => {
                        handleSocialChecks(
                          "psychomotor_skills",
                          "music",
                          value
                        );
                      }}
                    />
                    <AffectiveDispositionTableRow
                      isCompute={isCompute}
                      title="Sports"
                      value={
                        additionalCreds?.psychomotor_skills?.find((x) =>
                          Object.keys(x).includes("sports")
                        )?.sports
                      }
                      onChange={(value) => {
                        handleSocialChecks(
                          "psychomotor_skills",
                          "sports",
                          value
                        );
                      }}
                    />
                    <AffectiveDispositionTableRow
                      isCompute={isCompute}
                      title="Verbal Fluency"
                      value={
                        additionalCreds?.psychomotor_skills?.find((x) =>
                          Object.keys(x).includes("verbalFluency")
                        )?.verbalFluency
                      }
                      onChange={(value) => {
                        handleSocialChecks(
                          "psychomotor_skills",
                          "verbalFluency",
                          value
                        );
                      }}
                    />
                  </tbody>
                </Table>
                <p className="text-center">
                  Keys: 5 = Excellent 4 = Good 3 = Fair 2 = Poor 1 = Very Poor
                </p>
              </Col>
            </Row>
          </div>
          <div className="results-remark">
            <table>
              <tbody>
                <tr>
                  <td colSpan="6">Teacher's Comment</td>
                </tr>
                <tr>
                  <td colSpan="6">
                    {isCompute ||
                    user?.designation_name?.toLowerCase() === "principal" ? (
                      <>
                        <textarea
                          className="form-control"
                          type="text"
                          value={teacherComment}
                          onChange={({ target: { value } }) =>
                            setTeacherComment(value)
                          }
                        />
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            setComment("teacher");
                            setOpenPrompt(true);
                          }}
                        >
                          suggest
                        </button>
                      </>
                    ) : (
                      teacherComment
                    )}
                  </td>
                </tr>
                {!isCompute && (
                  <tr>
                    <td>Name:</td>
                    <td className="text-capitalize">
                      {additionalCreds?.teacher_fullname}
                    </td>
                    <td>Sign:</td>
                    <td></td>
                    <td>Date:</td>
                    <td>{moment(new Date()).format("DD/MM/YYYY")}</td>
                  </tr>
                )}

                <tr>
                  <td colSpan="6" />
                </tr>
                <tr>
                  <td colSpan="6">HOS's Comment</td>
                </tr>
                <tr>
                  <td colSpan="6">
                    {isCompute ||
                    user?.designation_name?.toLowerCase() === "principal" ? (
                      <>
                        <textarea
                          className="form-control"
                          value={hosComment}
                          onChange={({ target: { value } }) =>
                            setHosComment(value)
                          }
                        />
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            setComment("hos");
                            setOpenPrompt(true);
                          }}
                        >
                          suggest
                        </button>
                      </>
                    ) : (
                      hosComment
                    )}
                  </td>
                </tr>
                {!isCompute && (
                  <tr>
                    <td>Name:</td>
                    <td className="text-capitalize">
                      {additionalCreds?.hos_fullname}
                    </td>
                    <td>Sign:</td>
                    <td></td>
                    <td>Date:</td>
                    <td>{moment(new Date()).format("DD/MM/YYYY")}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {(isCompute ||
            user?.designation_name?.toLowerCase() === "principal") && (
            <div className="mt-3 d-flex justify-content-end">
              <ButtonGroup
                options={[
                  {
                    title: "Cancel",
                    variant: "outline",
                    onClick: () => navigate(-1 || "/"),
                  },
                  {
                    title: "Save",
                    type: "submit",
                    isLoading: isLoading,
                    disabled: isLoading,
                    onClick: createEndOfTermResult,
                  },
                ]}
              />
            </div>
          )}
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
            singleButtonText="Continue"
            promptHeader="Select Comment"
          >
            {comments?.map((x, index) => (
              <div key={index} className="modal-result-comment-select-options">
                <input
                  type="radio"
                  name="selectedComment"
                  onChange={({ target: { value } }) =>
                    setSelectedComment(value)
                  }
                  value={x?.hos_comment}
                />
                <p>{x?.hos_comment}</p>
              </div>
            ))}
          </Prompt>
          <Prompt
            isOpen={openSubjectPrompt}
            toggle={() => setOpenSubjectPrompt(!openSubjectPrompt)}
            singleButtonProps={{
              type: "button",
              isLoading: false,
              disabled: false,
              onClick: () => setOpenSubjectPrompt(false),
            }}
            singleButtonText="OK"
            promptHeader="Add Subject"
          >
            <AuthSelect
              advanced
              isMulti
              options={getAddSubjectSelectOptions()}
              onChange={(item) => {
                const fd = item?.map((x) => ({ ...x.value }));

                setSubjects([...subjects, ...fd]);
              }}
            />
          </Prompt>
        </div>
      </PageSheet>
    </div>
  );
};

export default EndOfTerm;
