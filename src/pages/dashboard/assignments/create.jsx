import React, { useEffect, useState } from "react";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import CreateQuestion from "./createQuestion";
import AuthSelect from "../../../components/inputs/auth-select";
import Button from "../../../components/buttons/button";
import Prompt from "../../../components/modals/prompt";
import ButtonGroup from "../../../components/buttons/button-group";
import styles from "../../../assets/scss/pages/dashboard/assignment.module.scss";
import AuthInput from "../../../components/inputs/auth-input";
import queryKeys from "../../../utils/queryKeys";
import { useMutation, useQuery } from "react-query";
import { Spinner } from "reactstrap";
import { useAssignments } from "../../../hooks/useAssignments";
import { useSubject } from "../../../hooks/useSubjects";
import ObjectiveViewCard from "./objectiveViewCard";
import TheoryViewCard from "./theoryViewCard";
import MarkCard from "./markCard";
import { useMediaQuery } from "react-responsive";
import { toast } from "react-toastify";

const Create = ({
  createQ,
  setCreateQ,
  objectiveQ,
  theoryQ,
  setObjectiveQ,
  setTheoryQ,
  obj,
  setObj,
  objMark,
  setObjMark,
}) => {
  const {

    createQuestionPrompt,
    setCreateQuestionPrompt,
    apiServices,
    errorHandler,
    permission,
    user,
  } = useAssignments();

  const isDesktop = useMediaQuery({ query: "(min-width: 992px)" });
  const isTablet = useMediaQuery({
    query: "(min-width: 768px, max-width: 991px)",
  });
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const {
    option1,
    option2,
    option3,
    option4,
    total_mark,
    theory_total_mark,
    total_question,
    question_mark,
    question_number,
    ans1,
    ans2,
    ans3,
    ans4,
    answer,
    question_type,
    question,
    subject,
    image,
    imageName,
    term,
    period,
    session,
    subject_id,
    week,
  } = createQ;

  const { subjects, isLoading: subjectLoading } = useSubject();

  function formatSubjects() {
    return subjects?.map((sb) => {
      return {
        value: sb.id,
        label: sb.subject,
      };
    });
  }

  const [warningPrompt, setWarningPrompt] = useState(false);
  const [clearAllPrompt, setClearAllPrompt] = useState(false);
  const [deletePrompt, setDeletePrompt] = useState(false);
  const [editPrompt, setEditPrompt] = useState(false);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");
  const [editTotalQuestion, setEditTotalQuestion] = useState(0);
  const [editOption1, setEditOption1] = useState("");
  const [editOption2, setEditOption2] = useState("");
  const [editOption3, setEditOption3] = useState("");
  const [editOption4, setEditOption4] = useState("");
  const [editMark, setEditMark] = useState(0);
  const [editNumber, setEditNumber] = useState(0);
  const [editSwitchNumber, setEditSwitchNumber] = useState(editNumber ?? 0);
  const [editQuestionId, setEditQuestionId] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [finalTheoryArray, setFinalTheoryArray] = useState([]);
  const [switchArray, setSwitchArray] = useState([]);
  const [newSubjects, setNewSubjects] = useState([]);
  const [allowFetch, setAllowFetch] = useState(true);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [published, setPublished] = useState(false);
  // const navigate = useNavigate();

  const activateRetrieve = () => {
    if (subject !== "" && question_type !== "" && week !== "") {
      return true;
    } else {
      return false;
    }
  };

  const activateRetrieveCreated = () => {
    if (subject_id !== "" && question_type !== "" && week !== "") {
      return true;
    } else {
      return false;
    }
  };

  //// FETCH ASSIGNMENTS CREATED /////////
  const {
    isLoading: assignmentCreatedLoading,
    data: assignmentCreated,
    refetch: refetchAssignmentCreated,
  } = useQuery(
    [queryKeys.GET_CREATED_ASSIGNMENT],
    () =>
      apiServices.getAssignment(
        user?.period,
        user?.term,
        user?.session,
        question_type
      ),
    {
      retry: 3,

      // enabled: false,
      enabled: activateRetrieveCreated() && permission?.created && allowFetch,

      select: (data) => {
        const asg = apiServices.formatData(data);
        console.log({ asg, data });
        // const asg2 =  asg?.length > 0 ? [...asg] : [];
        if (question_type === "objective") {
          return asg?.map((ag, i) => {
            return {
              id: ag?.id,
              term: user?.term,
              period: user?.period,
              session: user?.session,
              week: ag?.week,
              question_type: ag?.question_type,
              question: ag?.question,
              answer: ag?.answer,
              subject_id: ag?.subject_id,
              // subject: ag?.subject,
              option1: ag?.option1,
              option2: ag?.option2,
              option3: ag?.option3,
              option4: ag?.option4,
              total_question: ag?.total_question,
              total_mark: ag?.total_mark,
              question_mark: ag?.question_mark,
              question_number: ag?.question_number,
            };
          });
        } else if (question_type === "theory") {
          return asg?.map((ag, i) => {
            return {
              id: ag?.id,
              term: user?.term,
              period: user?.period,
              session: user?.session,
              week: ag?.week,
              question_type: ag?.question_type,
              question: ag?.question,
              answer: ag?.answer,
              subject_id: ag?.subject_id,
              image: ag?.image,
              total_question: ag?.total_question,
              total_mark: ag?.total_mark,
              question_mark: ag?.question_mark,
              question_number: ag?.question_number,
            };
          });
          // setTheoryQ(theo);
          // return theo;
        }
      },
      onSuccess(data) {
        setAllowFetch(false);
      },
      onError(err) {
        errorHandler(err);
      },
      // select: apiServices.formatData,
    }
  );

  /////// POST OBJECTIVE ASSIGNMENT ////
  const {
    mutateAsync: addObjectiveAssignments,
    isLoading: addObjectAssignmentLoading,
  } = useMutation(
    () =>
      apiServices.addObjectiveAssignment([
        // ...objectiveQ,
        {
          term: user?.term,
          period: user?.period,
          session: user?.session,
          week,
          question_type,
          question,
          answer,
          subject_id: Number(subject_id),
          option1,
          option2,
          option3,
          option4,
          total_question: Number(total_question),
          total_mark: Number(total_mark),
          question_mark: Number(objMark),
          question_number: Number(question_number),
        },
      ]),
    // () => apiServices.addObjectiveAssignment(finalObjectiveArray),
    {
      onSuccess() {
        refetchAssignmentCreated();
        toast.success("Objective assignment has been created successfully");
      },
      onError(err) {
        apiServices.errorHandler(err);
      },
    }
  );

  /////// POST THEORY ASSIGNMENT //////
  const {
    mutateAsync: addTheoryAssignments,
    isLoading: addTheoryAssignmentLoading,
  } = useMutation(
    () =>
      apiServices.addTheoryAssignment([
        // ...theoryQ,
        {
          term: user?.term,
          period: user?.period,
          session: user?.session,
          week,
          question_type,
          question,
          answer,
          subject_id: Number(subject_id),
          image,
          total_question: Number(total_question),
          total_mark: Number(theory_total_mark),
          question_mark: Number(question_mark),
          question_number: Number(question_number),
        },
      ]),
    {
      onSuccess() {
        refetchAssignmentCreated();
        toast.success("Theory assignment has been created successfully");
      },
      onError(err) {
        apiServices.errorHandler(err);
      },
    }
  );

  //// EDIT OBJECTIVE ASSIGNMENT ////
  const {
    mutateAsync: editObjectiveAssignment,
    isLoading: editObjectiveAssignmentLoading,
  } = useMutation(apiServices.editObjectiveAssignment, {
    onSuccess() {
      setAllowFetch(true);
      refetchAssignmentCreated();
      toast.success("Objective question has been edited successfully");
    },
    onError(err) {
      apiServices.errorHandler(err);
    },
  });

  //// PUBLISH ASSIGNMENT ////
  const {
    mutateAsync: publishAssignment,
    isLoading: publishAssignmentLoading,
  } = useMutation(apiServices.publishAssignment, {
    onSuccess() {
      setAllowFetch(true);
      refetchAssignmentCreated();
      toast.success(
        `Assignment has been ${
          published ? "unpublished" : "published"
        } successfully`
      );
    },
    onError(err) {
      apiServices.errorHandler(err);
    },
  });

  //// EDIT THEORY ASSIGNMENT ////
  const {
    mutateAsync: editTheoryAssignment,
    isLoading: editTheoryAssignmentLoading,
  } = useMutation(apiServices.editTheoryAssignment, {
    onSuccess() {
      refetchAssignmentCreated();
      toast.success("theory question has been edited successfully");
    },
    onError(err) {
      apiServices.errorHandler(err);
    },
  });

  //// DELETE ASSIGNMENT ////
  const { mutateAsync: deleteAssignment, isLoading: deleteAssignmentLoading } =
    useMutation(() => apiServices.deleteAssignment(editQuestionId), {
      onSuccess() {
        refetchAssignmentCreated();
        toast.success("Question has been deleted successfully");
      },
      onError(err) {
        apiServices.errorHandler(err);
      },
    });

 

  const clearAllButtons = [
    {
      title: "No",
      // isLoading: addObjectAssignmentLoading || addTheoryAssignmentLoading,
      onClick: () => {
        // setWarningPrompt(true);
        setClearAllPrompt(false);
      },
      // variant: `${activeTab === "2" ? "" : "outline"}`,
    },
    {
      title: "Yes",
      onClick: () => {
        setCreateQ((prev) => ({
          ...prev,
          total_question: 0,
          total_mark: 0,
          question_mark: 0,
          theory_total_mark: 0,
          option1: "",
          option2: "",
          option3: "",
          option4: "",
          question: "",
          answer: "",
        }));
        setObjectiveQ([]);
        setObj([]);
        setTheoryQ([]);
        setClearAllPrompt(false);
      },
      variant: "outline",
    },
  ];

  const buttonOptions2 = [
    {
      title: `${published ? "Unpublish" : "Publish"}`,
      onClick: () => {
        publishAssignment({
          term: user?.term,
          period: user?.period,
          session: user?.session,
          question_type,
          week,
          is_publish: published ? 0 : 1,
        });
        setAllowFetch(true);
        refetchAssignmentCreated();
        setPublished((prev) => !prev);
      },
      isLoading: publishAssignmentLoading,
      variant: `${published ? "danger" : "success"}`,
    },
  ];

  const deleteButtons = [
    {
      title: "No",
      // isLoading: addObjectAssignmentLoading || addTheoryAssignmentLoading,
      onClick: () => {
        // setWarningPrompt(true);

        setDeletePrompt(false);
      },
      // variant: `${activeTab === "2" ? "" : "outline"}`,
    },
    {
      title: "Yes",
      onClick: () => {
        //
        if (question_type === "objective") {
          deleteAssignment();

          setTimeout(() => {
            setDeletePrompt(false);
          }, 1000);
        } else if (question_type === "theory") {
          deleteAssignment();

          setTimeout(() => {
            setDeletePrompt(false);
          }, 1000);
        }
      },
      variant: "outline-danger",
      isLoading: deleteAssignmentLoading,
    },
  ];

  const questionType = [
    {
      value: "objective",
      title: "Objective",
    },

    {
      value: "theory",
      title: "Theory",
    },
  ];

  const filterArray = objectiveQ?.filter((obj) => obj.id !== editQuestionId);

  const newArray = filterArray?.map((obj) => {
    return {
      ...obj,
      question_mark: editMark,
    };
  });

  const editButtons = [
    {
      title: "No",
      // isLoading: editObjectiveAssignmentLoading,
      onClick: () => {
        // console.log({ editMark });
        setEditPrompt(false);
      },
      // variant: `${activeTab === "2" ? "" : "outline"}`,
    },
    {
      title: "Yes",
      onClick: () => {
        if (question_type === "objective") {
          editObjectiveAssignment([
            ...newArray,
            {
              id: editQuestionId,
              question: editQuestion,
              answer: editAnswer,
              question_number: editNumber,
              question_mark: editMark,
              option1: editOption1,
              option2: editOption2,
              option3: editOption3,
              option4: editOption4,
            },
          ]);
          refetchAssignmentCreated();
          setTimeout(() => {
            refetchAssignmentCreated();
          }, 1000);
          setTimeout(() => {
            setEditPrompt(false);
            refetchAssignmentCreated();
          }, 2000);
        } else if (question_type === "theory") {
          editTheoryAssignment({
            id: editQuestionId,
            body: {
              question: editQuestion,
              answer: editAnswer,
              question_number: editNumber,
              question_mark: editMark,
            },
          });
          refetchAssignmentCreated();
          setTimeout(() => {
            refetchAssignmentCreated();
          }, 1000);
          setTimeout(() => {
            setEditPrompt(false);
            refetchAssignmentCreated();
          }, 2000);
        }
      },
      variant: "outline",
      isLoading: editObjectiveAssignmentLoading || editTheoryAssignmentLoading,
      disabled:
        question_type === "objective"
          ? !editQuestion ||
            !editAnswer ||
            !editOption1 ||
            !editOption2 ||
            !editOption3 ||
            !editOption4 ||
            !editMark
          : question_type === "theory"
          ? !editQuestion || !editAnswer || !editMark
          : false,
  
    },
  ];


  const allLoading =
    showLoading || assignmentCreatedLoading || loading1 || loading2;

  const activateAddQuestion = () => {
    if (!subject_id || !week || !question_type) {
      return true;
    } else {
      return false;
    }
  };

  const subs = [
    { value: "Mathematics", title: "Mathematics", id: "1" },
    { value: "English Language", title: "English Language", id: "2" },
    { value: "Science", title: "Science", id: "3" },
    { value: "Social Studies", title: "Social Studies", id: "4" },
    { value: "Art and Craft", title: "Art and Craft", id: "5" },
  ];

  useEffect(() => {
    const sbb = subjects?.map((sb) => {
      return {
        value: sb.id,
        title: sb.subject,
      };
    });

    if (sbb?.length > 0) {
      setNewSubjects(sbb);
    } else {
      setNewSubjects([]);
    }
  }, [subjects]);

  useEffect(() => {
    setLoading1(true);
    setTimeout(() => {
      setLoading1(false);
    }, 500);

    const filteredAssignments =
      assignmentCreated?.filter(
        (og) => og.subject_id === subject_id && og.week === week
      ) ?? [];

    if (question_type === "objective") {
      setObjectiveQ(filteredAssignments);
    } else if (question_type === "theory") {
      setTheoryQ(filteredAssignments);
    }
  }, [assignmentCreated, subject_id, week]);

  console.log({
    editNumber,
    objMark,
    published,
    createQ,
    newSubjects,
    objectiveQ,
    theoryQ,
    assignmentCreated,
    allowFetch,
    allLoading,
    subjects,
    period,
    term,
    session,
    question_type,
    week,
  });

  return (
    <>
      <div className={styles.create}>
        {/* drop downs */}
        <div
          className='d-flex flex-column gap-4 flex-lg-row justify-content-lg-between '
          // className={styles.create__options}
        >
          <div className='d-flex flex-column gap-4 flex-sm-row flex-grow-1 '>
            {/* weeks */}
            <AuthSelect
              sort
              options={[
                { value: "1", title: "Week 1" },
                { value: "2", title: "Week 2" },
                { value: "3", title: "Week 3" },
                { value: "4", title: "Week 4" },
                { value: "5", title: "Week 5" },
                { value: "6", title: "Week 6" },
                { value: "7", title: "Week 7" },
                { value: "8", title: "Week 8" },
                { value: "9", title: "Week 9" },
                { value: "10", title: "Week 10" },
                { value: "11", title: "Week 11" },
                { value: "12", title: "Week 12" },
                { value: "13", title: "Week 13" },
              ]}
              value={week}
              onChange={({ target: { value } }) => {
                setAllowFetch(true);
                setCreateQ((prev) => {
                  return { ...prev, week: value };
                });
              }}
              placeholder='Select Week'
              wrapperClassName='w-100'
            />
            {/* subjects */}
            <AuthSelect
              sort
              options={newSubjects}
              value={subject_id}
              onChange={({ target: { value } }) => {
                setAllowFetch(true);

                setCreateQ((prev) => {
                  return { ...prev, subject_id: value };
                });
              }}
              placeholder='Select Subject'
              wrapperClassName='w-100'
            />
            {/* questionType */}
            <AuthSelect
              sort
              options={questionType}
              value={question_type}
              onChange={({ target: { value } }) => {
                setAllowFetch(true);

                setLoading2(true);
                setTimeout(() => {
                  setLoading2(false);
                }, 800);

                setCreateQ((prev) => {
                  return { ...prev, question_type: value, answer: "" };
                });
              }}
              placeholder='Select type'
              wrapperClassName='w-100'
            />
          </div>

          <Button
            variant=''
            onClick={() => {
              if (question_type === "theory") {
                setAllowFetch(false);
                setCreateQ((prev) => {
                  return {
                    ...prev,
                    question_number: theoryQ?.length + 1,
                  };
                });
              } else if (question_type === "objective") {
                setAllowFetch(false);
                if (!obj) {
                  setObj([]);
                }
                setCreateQ((prev) => {
                  return {
                    ...prev,
                    question_number: objectiveQ?.length + 1,
                  };
                });
              }
              setCreateQuestionPrompt(true);
            }}
            disabled={activateAddQuestion()}
          >
            {objectiveQ?.length === 0 && theoryQ?.length === 0
              ? "Add Question"
              : "Add Question"}
          </Button>
        </div>

        {allLoading && (
          <div className={styles.spinner_container}>
            <Spinner /> <p className=''>Loading...</p>
          </div>
        )}

        {!allLoading && question_type === "theory" && theoryQ?.length === 0 && (
          <div className={styles.placeholder_container}>
            <HiOutlineDocumentPlus className={styles.icon} />
            <p className={styles.heading}>Create theory Assignment</p>
          </div>
        )}
        {!allLoading &&
          question_type === "objective" &&
          objectiveQ?.length === 0 && (
            <div className={styles.placeholder_container}>
              <HiOutlineDocumentPlus className={styles.icon} />
              <p className={styles.heading}>Create Objective Assignment</p>
            </div>
          )}
        {!allLoading &&
          theoryQ?.length === 0 &&
          objectiveQ?.length === 0 &&
          question_type === "" && (
            <div className={styles.placeholder_container}>
              <HiOutlineDocumentPlus className={styles.icon} />
              <p className={styles.heading}>Create Assignment</p>
            </div>
          )}

        {!allLoading && (
          <MarkCard
            allLoading={allLoading}
            question_type={question_type}
            objectiveQ={objectiveQ}
            theoryQ={theoryQ}
            published={published}
          />
        )}

        {!allLoading &&
          objectiveQ?.length >= 1 &&
          question_type === "objective" && (
            <div className='d-flex flex-column my-5 gap-3'>
              {objectiveQ
                ?.sort((a, b) => {
                  if (a.question_number < b.question_number) {
                    return -1;
                  }
                  if (a.question_number > b.question_number) {
                    return 1;
                  }
                  return 0;
                })
                .map((CQ, index) => {
                  // console.log({ tk: CQ });
                  return (
                    <div className='w-100' key={index}>
                      <ObjectiveViewCard
                        CQ={CQ}
                        setEditPrompt={setEditPrompt}
                        setEditTotalQuestion={setEditTotalQuestion}
                        setEditMark={setEditMark}
                        setEditNumber={setEditNumber}
                        setEditOption1={setEditOption1}
                        setEditOption2={setEditOption2}
                        setEditOption3={setEditOption3}
                        setEditOption4={setEditOption4}
                        setDeletePrompt={setDeletePrompt}
                        setEditQuestion={setEditQuestion}
                        setEditAnswer={setEditAnswer}
                        setEditSwitchNumber={setEditSwitchNumber}
                        editQuestionId={editQuestionId}
                        setEditQuestionId={setEditQuestionId}
                        index={index}
                      />
                    </div>
                  );
                })}
            </div>
          )}

        {!allLoading && theoryQ?.length >= 1 && question_type === "theory" && (
          <div className='d-flex flex-column my-5 gap-3'>
            {theoryQ
              ?.sort((a, b) => {
                if (a.question_number < b.question_number) {
                  return -1;
                }
                if (a.question_number > b.question_number) {
                  return 1;
                }
                return 0;
              })
              ?.map((CQ, index) => {
                // console.log({ CQ });
                return (
                  <div
                    className='w-100'
                    // style={{ width: "100%", }}
                    key={index}
                  >
                    <TheoryViewCard
                      CQ={CQ}
                      setEditPrompt={setEditPrompt}
                      setEditTotalQuestion={setEditTotalQuestion}
                      setEditMark={setEditMark}
                      setEditNumber={setEditNumber}
                      setEditOption1={setEditOption1}
                      setEditOption2={setEditOption2}
                      setEditOption3={setEditOption3}
                      setEditOption4={setEditOption4}
                      setDeletePrompt={setDeletePrompt}
                      setEditQuestion={setEditQuestion}
                      setEditAnswer={setEditAnswer}
                      setEditSwitchNumber={setEditSwitchNumber}
                      editQuestionId={editQuestionId}
                      setEditQuestionId={setEditQuestionId}
                    />
                  </div>
                );
              })}
          </div>
        )}

        {!allLoading &&
          ((question_type === "objective" && objectiveQ?.length !== 0) ||
            (question_type === "theory" && theoryQ?.length !== 0)) && (
            <div className='w-100 d-flex justify-content-end'>
              <ButtonGroup options={buttonOptions2} />
              {/* <div className='d-flex align-items-center gap-3 cursor-pointer'>
              <input
                type='checkbox'
                name='radio-1'
                className=''
                // checked={editOption1 === editAnswer}

                id='flexSwitchCheckChecked'
                checked={published}
                style={{ width: "20px", height: "20px", color: "green" }}
                onChange={(e) => setPublished((prev) => !prev)}
                value={published}
              />
              <label
                htmlFor='flexSwitchCheckChecked'
                className='fs-4 form-check-label fw-bold'
              >
                Publish Assignment
              </label>
            </div> */}
            </div>
          )}
      </div>
      <CreateQuestion
        createQuestionPrompt={createQuestionPrompt}
        setCreateQuestionPrompt={setCreateQuestionPrompt}
        createQ={createQ}
        setCreateQ={setCreateQ}
        objectiveQ={objectiveQ}
        setObjectiveQ={setObjectiveQ}
        theoryQ={theoryQ}
        setTheoryQ={setTheoryQ}
        obj={obj}
        setObj={setObj}
        addObjectiveAssignments={addObjectiveAssignments}
        addObjectAssignmentLoading={addObjectAssignmentLoading}
        addTheoryAssignments={addTheoryAssignments}
        addTheoryAssignmentLoading={addTheoryAssignmentLoading}
        allowFetch={allowFetch}
        setAllowFetch={setAllowFetch}
        refetchAssignmentCreated={refetchAssignmentCreated}
        objMark={objMark}
        setObjMark={setObjMark}
      />

      {/* clear all prompt */}
      <Prompt
        promptHeader={`CONFIRM CLEAR-ALL ACTION`}
        toggle={() => setClearAllPrompt(!clearAllPrompt)}
        isOpen={clearAllPrompt}
        hasGroupedButtons={true}
        groupedButtonProps={clearAllButtons}
      >
        <p className={styles.create_question_question}>
          Are you sure you want to clear all questions created?
        </p>
      </Prompt>

      {/* Edit question prompt */}
      <Prompt
        promptHeader={`QUESTION EDIT`}
        toggle={() => setEditPrompt(!editPrompt)}
        isOpen={editPrompt}
        hasGroupedButtons={true}
        groupedButtonProps={editButtons}
      >
        {question_type === "objective" && (
          <div>
            <p className='fw-bold fs-4 mb-4'>Question Number</p>
            <div className='d-flex flex-column gap-3 mb-5'>
              <div className='d-flex align-items-center gap-3'>
                <div style={{ width: "100px" }}>
                  <AuthInput
                    type='number'
                    placeholder='Question Number'
                    // hasError={!!errors.username}
                    // defaultValue={CQ.question_mark}
                    value={editNumber}
                    name='option'
                    onChange={(e) => {
                      setEditNumber(e.target.value);
                    }}
                    style={{
                      fontSize: "16px",
                    }}
                  />
                </div>
              </div>
            </div>

            <p className='fw-bold fs-4 mb-3'>Questions</p>
            <div className='auth-textarea-wrapper'>
              <textarea
                className='form-control'
                type='text'
                value={editQuestion}
                placeholder='Type the assignment question'
                onChange={(e) => {
                  setEditQuestion(e.target.value);
                }}
                style={{
                  minHeight: "150px",
                  fontSize: "16px",
                  lineHeight: "22px",
                }}
              />
            </div>
            <p className='fw-bold fs-4 my-4'>Options</p>
            <div className='d-flex flex-column gap-3'>
              {/* option - A */}
              <div className='d-flex align-items-center gap-3'>
                <div style={{ width: "250px" }}>
                  <AuthInput
                    type='text'
                    placeholder='Option A'
                    // hasError={!!errors.username}
                    value={editOption1}
                    name='option'
                    onChange={(e) => {
                      setEditOption1(e.target.value);
                    }}
                    style={{
                      fontSize: "16px",
                    }}
                  />
                </div>
                <div className='d-flex align-items-center gap-3 cursor-pointer'>
                  <input
                    type='radio'
                    name='radio-1'
                    checked={editOption1 === editAnswer}
                    id='option-A'
                    style={{ width: "20px", height: "20px" }}
                    onChange={(e) => setEditAnswer(e.target.value)}
                    value={editOption1}
                  />
                  <label htmlFor='option-A' className='fs-4'>
                    Correct answer
                  </label>
                </div>
              </div>
              {/* option B */}
              <div className='d-flex align-items-center gap-3'>
                <div style={{ width: "250px" }}>
                  <AuthInput
                    type='text'
                    placeholder='Option B'
                    // hasError={!!errors.username}
                    value={editOption2}
                    name='option'
                    onChange={(e) => setEditOption2(e.target.value)}
                    style={{
                      fontSize: "16px",
                    }}
                  />
                </div>
                <div className='d-flex align-items-center gap-3 cursor-pointer'>
                  <input
                    type='radio'
                    name='radio-1'
                    style={{ width: "20px", height: "20px" }} // Set the width using inline styles
                    checked={editOption2 === editAnswer}
                    id='option-B'
                    onChange={(e) => setEditAnswer(e.target.value)}
                    value={editOption2}
                  />
                  <label htmlFor='option-B' className='fs-4'>
                    Correct answer
                  </label>
                </div>
              </div>
              {/* option C */}
              <div className='d-flex align-items-center gap-3'>
                <div style={{ width: "250px" }}>
                  <AuthInput
                    type='text'
                    placeholder='Option C'
                    // hasError={!!errors.username}
                    value={editOption3}
                    name='option'
                    onChange={(e) => setEditOption3(e.target.value)}
                    style={{
                      fontSize: "16px",
                    }}
                  />
                </div>
                <div className='d-flex align-items-center gap-3 cursor-pointer'>
                  <input
                    type='radio'
                    name='radio-1'
                    style={{ width: "20px", height: "20px" }}
                    // Set the width using inline styles
                    checked={editOption3 === editAnswer}
                    id='option-C'
                    onChange={(e) => setEditAnswer(e.target.value)}
                    value={editOption3}
                  />
                  <label htmlFor='option-C' className='fs-4'>
                    Correct answer
                  </label>
                </div>
              </div>
              {/* option D */}
              <div className='d-flex align-items-center gap-3'>
                <div style={{ width: "250px" }}>
                  <AuthInput
                    type='text'
                    placeholder='Option D'
                    // hasError={!!errors.username}
                    value={editOption4}
                    name='option'
                    onChange={(e) => setEditOption4(e.target.value)}
                    style={{
                      fontSize: "16px",
                    }}
                  />
                </div>
                <div className='d-flex align-items-center gap-3 cursor-pointer'>
                  <input
                    type='radio'
                    name='radio-1'
                    id='option-D'
                    style={{ width: "20px", height: "20px" }} // Set the width using inline styles
                    checked={editOption4 === editAnswer}
                    onChange={(e) => setEditAnswer(e.target.value)}
                    value={editOption4}
                  />
                  <label htmlFor='option-D' className='fs-4'>
                    Correct answer
                  </label>
                </div>
              </div>
            </div>
            <p className='fw-bold fs-4 my-4'>Mark Computation</p>
            <div className='d-flex flex-column gap-3'>
              <div className='d-flex align-items-center gap-3'>
                <div style={{ width: "100px" }}>
                  <AuthInput
                    type='number'
                    placeholder='Question Mark'
                    // hasError={!!errors.username}
                    // defaultValue={CQ.question_mark}
                    value={editMark}
                    name='option'
                    onChange={(e) => {
                      setEditMark(e.target.value);
                    }}
                    style={{
                      fontSize: "16px",
                    }}
                  />
                </div>
                <div className='d-flex align-items-center gap-3 cursor-pointer'>
                  <p className='fs-4'>Question Mark</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {question_type === "theory" && (
          <div>
            <p className='fw-bold fs-4 mb-4'>Question Number</p>
            <div className='d-flex flex-column gap-3 mb-5'>
              <div className='d-flex align-items-center gap-3'>
                <div style={{ width: "100px" }}>
                  <AuthInput
                    type='number'
                    placeholder='Question Number'
                    // hasError={!!errors.username}
                    // defaultValue={CQ.question_mark}
                    value={editNumber}
                    name='option'
                    onChange={(e) => {
                      setEditNumber(e.target.value);
                    }}
                    style={{
                      fontSize: "16px",
                    }}
                  />
                </div>
              </div>
            </div>
            <p className='fw-bold fs-4 mb-4'>Question</p>
            <div className='auth-textarea-wrapper'>
              <textarea
                className='form-control'
                type='text'
                value={editQuestion}
                placeholder='Type the assignment question'
                onChange={(e) => {
                  setEditQuestion(e.target.value);
                }}
                style={{
                  minHeight: "150px",
                  fontSize: "16px",
                  lineHeight: "22px",
                }}
              />
            </div>
            <p
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                margin: "10px 0px",
              }}
            >
              Answer
            </p>
            <div className='auth-textarea-wrapper'>
              <textarea
                className='form-control'
                type='text'
                value={editAnswer}
                placeholder='Type the answer to the question'
                onChange={(e) => {
                  setEditAnswer(e.target.value);
                }}
                style={{
                  minHeight: "150px",
                  fontSize: "16px",
                  lineHeight: "22px",
                }}
              />
            </div>
            <p
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                margin: "10px 0px",
              }}
            >
              Mark Computation
            </p>
            <div className='d-flex flex-column gap-3'>
              {/*Question Mark */}
              <div className='d-flex align-items-center gap-3'>
                <div style={{ width: "100px" }}>
                  <AuthInput
                    type='number'
                    placeholder='Question Mark'
                    // hasError={!!errors.username}
                    // defaultValue={CQ.question_mark}
                    value={editMark}
                    name='option'
                    onChange={(e) => {
                      setEditMark(e.target.value);
                    }}
                    wrapperClassName=''
                  />
                </div>
                <div className='d-flex align-items-center gap-3 cursor-pointer'>
                  <p
                    className=''
                    style={{
                      lineHeight: "18px",
                      fontSize: "14px",
                    }}
                  >
                    Question Mark
                  </p>
                </div>
              </div>
              {/* Total Question */}
            </div>
          </div>
        )}
      </Prompt>
      {/* Delete question prompt */}
      <Prompt
        promptHeader={`CONFIRM DELETE ACTION`}
        toggle={() => setDeletePrompt(!deletePrompt)}
        isOpen={deletePrompt}
        hasGroupedButtons={true}
        groupedButtonProps={deleteButtons}
      >
        <p className={styles.create_question_question}>
          Are you sure you want to delete this question?
        </p>
      </Prompt>
    </>
  );
};

export default Create;
