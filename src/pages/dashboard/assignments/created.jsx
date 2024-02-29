import React, { useState } from "react";
import {useAssignments} from "../../../hooks/useAssignments";
import AuthSelect from "../../../components/inputs/auth-select";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import ButtonGroup from "../../../components/buttons/button-group";
import { useMutation, useQueryClient } from "react-query";
import queryKeys from "../../../utils/queryKeys";
import { Spinner } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import styles from "../../../assets/scss/pages/dashboard/assignment.module.scss";
import AuthInput from "../../../components/inputs/auth-input";
import Prompt from "../../../components/modals/prompt";
import { toast } from "react-toastify";

const Created = () => {
  const {
    updateActiveTabFxn,
    // activeTab,
    // createQuestionPrompt,
    // setCreateQuestionPrompt,
    //
    // myStudents,
    classSubjects,
    apiServices,
    // errorHandler,
    // permission,
    user,
    // CREATE
    // updateCheckObjectiveQuestionFxn,
    // checkObjectiveQuestions,
    //
    // updateCheckTheoryQuestionFxn,
    // checkTheoryQuestions,
    //
    updateCreateQuestionFxn,
    // emptyCreateQuestionFxn,
    // createQuestion,
    //

    // CREATED
    updateCreatedQuestionFxn,
    createdQuestion,
    //
    // updateObjectiveQFxn,
    emptyObjectiveQFxn,
    ObjectiveQ,
    //
    // updateTheoryQFxn,
    emptyTheoryQFxn,
    TheoryQ,
    //
    assignmentLoadingCreated,
    refetchAssignmentCreated,
    //
  } = useAssignments();

  const {
    question_type,
    subject,
    // image,
    // term,
    // period,
    // session,
    // subject_id,
    week,
  } = createdQuestion;

  // const [loginPrompt, setLoginPrompt] = useState(false);
  // const [createQuestionPrompt, setCreateQuestionPrompt] = useState(false);
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
  const [editId, setEditId] = useState(0);
  const [showLoading, setShowLoading] = useState(false);

  const queryClient = useQueryClient();

  //// EDIT OBJECTIVE ASSIGNMENT ////
  const {
    mutateAsync: editObjectiveAssignment,
    isLoading: editObjectiveAssignmentLoading,
  } = useMutation(
    () =>
      apiServices.editObjectiveAssignment({
        id: editId,
        body: {
          question: editQuestion,
          answer: editAnswer,
          option1: editOption1,
          option2: editOption2,
          option3: editOption3,
          option4: editOption4,
        },
      }),
    {
      onSuccess() {
        queryClient.invalidateQueries(
          queryKeys.GET_ASSIGNMENT,
          user?.period,
          user?.term,
          user?.session,
          question_type,
          "created"
        );
        refetchAssignmentCreated();
        setTimeout(() => {
          refetchAssignmentCreated();
        }, 2000);
        toast.success("Objective question has been edited successfully");
      },
      onError(err) {
        apiServices.errorHandler(err);
      },
    }
  );

  //// EDIT THEORY ASSIGNMENT ////
  const {
    mutateAsync: editTheoryAssignment,
    isLoading: editTheoryAssignmentLoading,
  } = useMutation(
    () =>
      apiServices.editTheoryAssignment({
        id: editId,
        body: {
          question: editQuestion,
          answer: editAnswer,
        },
      }),
    {
      onSuccess() {
        queryClient.invalidateQueries(
          queryKeys.GET_ASSIGNMENT,
          user?.period,
          user?.term,
          user?.session,
          question_type,
          "created"
        );
        refetchAssignmentCreated();
        toast.success("Objective question has been edited successfully");
      },
      onError(err) {
        apiServices.errorHandler(err);
      },
    }
  );

  //// DELETE ASSIGNMENT ////
  const { mutateAsync: deleteAssignment, isLoading: deleteAssignmentLoading } =
    useMutation(() => apiServices.deleteAssignment(editId), {
      onSuccess() {
        queryClient.invalidateQueries(
          queryKeys.GET_ASSIGNMENT,
          user?.period,
          user?.term,
          user?.session,
          question_type,
          "created"
        );
        refetchAssignmentCreated();
        setTimeout(() => {
          refetchAssignmentCreated();
        }, 2000);
        toast.success("Question has been deleted successfully");
      },
      onError(err) {
        apiServices.errorHandler(err);
      },
    });

  const showNoAssignment = () => {
    if (question_type === "objective" && ObjectiveQ.length === 0) {
      return true;
    } else if (question_type === "theory" && TheoryQ.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  const showNoAssignment2 = () => {
    if (question_type === "" && ObjectiveQ.length === 0) {
      return true;
    } else if (question_type === "" && TheoryQ.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  const findSubjectId = (value) => {
    const findObject = classSubjects?.find((opt) => opt.value === value);
    if (findObject) {
      return findObject.id;
    }
  };
  const allLoading =
    showLoading ||
    assignmentLoadingCreated ||
    editObjectiveAssignmentLoading ||
    editTheoryAssignmentLoading ||
    deleteAssignmentLoading;

  const completedQuestion = () => {
    // if (ObjectiveQ.length !== Number(total_question)) {
    //   return false;
    // } else if (ObjectiveQ.length === Number(total_question)) {
    //   return true;
    // }
  };
  const completedQuestion2 = () => {
    // if (TheoryQ.length !== Number(total_question)) {
    //   return false;
    // } else if (TheoryQ.length === Number(total_question)) {
    //   return true;
    // }
  };

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
          refetchAssignmentCreated();
          setTimeout(() => {
            refetchAssignmentCreated();
          }, 1000);
          // deleteObjectiveQuestionFxn({
          //   number: editNumber,
          // });
        } else if (question_type === "theory") {
          deleteAssignment();
          refetchAssignmentCreated();
          setTimeout(() => {
            refetchAssignmentCreated();
          }, 1000);
          // deleteTheoryQuestionFxn({
          //   number: editNumber,
          // });
        }
        setDeletePrompt(false);
      },
      variant: "outline",
    },
  ];

  const editButtons = [
    {
      title: "No",
      // isLoading: addObjectAssignmentLoading || addTheoryAssignmentLoading,
      onClick: () => {
        setEditPrompt(false);
      },
      // variant: `${activeTab === "2" ? "" : "outline"}`,
    },
    {
      title: "Yes",
      onClick: () => {
        if (question_type === "objective") {
          editObjectiveAssignment();
          emptyObjectiveQFxn();

          refetchAssignmentCreated();
          setTimeout(() => {
            refetchAssignmentCreated();
          }, 1000);

          // updateActiveTabFxn("2");
        } else if (question_type === "theory") {
          editTheoryAssignment();
          emptyTheoryQFxn();
          refetchAssignmentCreated();
          setTimeout(() => {
            refetchAssignmentCreated();
          }, 1000);
          // updateActiveTabFxn("2");
        }
        setEditPrompt(false);
      },
      variant: "outline",
    },
  ];

  const buttonOptions2 = [
    {
      title: "Add Question",
      onClick: () => {
        if (question_type === "objective") {
          updateCreateQuestionFxn({
            subject,
            week,
            question_type,
            question_number: ObjectiveQ?.length + 1,
            question_mark: ObjectiveQ[ObjectiveQ.length - 1].question_mark,
            total_question: 1,
            total_mark: ObjectiveQ[ObjectiveQ.length - 1].question_mark,
          });
        } else if (question_type === "theory") {
          updateCreateQuestionFxn({
            subject,
            week,
            question_type,
            question_number: TheoryQ?.length + 1,
            // question_mark: ObjectiveQ[ObjectiveQ.length - 1].question_mark,
            total_question: 1,
          });
        }
        // setTimeout(() => {
        //   // refetchAssignmentCreated();
        //   setCreateQuestionPrompt(true);
        // }, 2000);
        updateActiveTabFxn("1");
        // setCreateQuestionPrompt(true);
      },
      // variant: "outline",
    },
    // {
    //   title: "Approve",
    //   // isLoading: addObjectAssignmentLoading || addTheoryAssignmentLoading,
    //   onClick: () => {
    //     // setClearAllPrompt(true);
    //     setWarningPrompt(true);
    //   },
    //   // variant: `${activeTab === "2" ? "" : "outline"}`,
    // },
  ];

  const buttonOptions3 = [
    {
      title: "Cancel",
      onClick: () => setWarningPrompt(false),
      variant: "outline",
    },
    {
      title: "Yes Submit",
      // isLoading: addObjectAssignmentLoading || addTheoryAssignmentLoading,
      disabled:
        question_type === "objective"
          ? !completedQuestion()
          : question_type === "theory"
          ? !completedQuestion2()
          : "",
      onClick: () => {
        // if (finalObjectiveArray.length >= 1) {
        //   updateCreatedQuestionFxn({
        //     subject,
        //     subject_id,
        //     question_type,
        //     week,
        //   });
        //   addObjectiveAssignments();
        //   // refetchAssignment();
        //   updateCreateQuestionFxn({
        //     total_question: 0,
        //     total_mark: 0,
        //     question_mark: 0,
        //     theory_total_mark: 0,
        //     option1: "",
        //     option2: "",
        //     option3: "",
        //     option4: "",
        //     question: "",
        //     answer: "",
        //   });
        //   emptyObjectiveQuestionsFxn();
        //   updateActiveTabFxn("2");
        // } else if (finalTheoryArray.length >= 1) {
        //   updateCreatedQuestionFxn({
        //     subject,
        //     subject_id,
        //     question_type,
        //     week,
        //   });
        //   addTheoryAssignments();
        //   // refetchAssignment();
        //   updateCreateQuestionFxn({
        //     total_question: 0,
        //     total_mark: 0,
        //     question_mark: 0,
        //     theory_total_mark: 0,
        //     option1: "",
        //     option2: "",
        //     option3: "",
        //     option4: "",
        //     question: "",
        //     answer: "",
        //   });
        //   emptyTheoryQuestionsFxn();
        //   updateActiveTabFxn("2");
        // }
      },
    },
  ];

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
        // updateCreateQuestionFxn({
        //   total_question: 0,
        //   total_mark: 0,
        //   question_mark: 0,
        //   theory_total_mark: 0,
        //   option1: "",
        //   option2: "",
        //   option3: "",
        //   option4: "",
        //   question: "",
        //   answer: "",
        // });
        // emptyObjectiveQuestionsFxn();
        // emptyTheoryQuestionsFxn();
        setClearAllPrompt(false);
      },
      variant: "outline",
    },
  ];

  // console.log({
  //   TheoryQ
  // });

  console.log({
    TheoryQ,
    ObjectiveQ,
    editId,
    editQuestion,
    editAnswer,
    editOption1,
    editOption2,
    editOption3,
    editOption4,
  });

  return (
    <div>
      <div className={styles.created}>
        <div className={styles.created__options}>
          <div className={styles.auth_select_container}>
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
              // defaultValue={week && week}
              onChange={({ target: { value } }) => {
                updateCreatedQuestionFxn({
                  week: value,
                });
                if (subject !== "") {
                  setShowLoading(true);
                  setTimeout(() => {
                    setShowLoading(false);
                  }, 1500);

                  refetchAssignmentCreated();
                }
              }}
              placeholder='Week'
              wrapperClassName={styles.auth_select}
            />
            <AuthSelect
              sort
              options={classSubjects}
              value={subject}
              defaultValue={subject && subject}
              onChange={({ target: { value } }) => {
                // setSubjectC(value);
                // setSubjectIdC(findSubjectId(value));

                updateCreatedQuestionFxn({
                  subject: value,
                  subject_id: findSubjectId(value),
                });
                if (question_type !== "") {
                  setShowLoading(true);
                  setTimeout(() => {
                    setShowLoading(false);
                  }, 1500);
                  refetchAssignmentCreated();
                }
              }}
              placeholder='Select Subject'
              wrapperClassName={styles.auth_select}
              // label="Subject"
            />

            <AuthSelect
              sort
              options={[
                { value: "objective", title: "Objective" },
                { value: "theory", title: "Theory" },
              ]}
              value={question_type}
              defaultValue={question_type && question_type}
              onChange={({ target: { value } }) => {
                updateCreatedQuestionFxn({
                  question_type: value,
                });
                if (subject !== "") {
                  setShowLoading(true);
                  setTimeout(() => {
                    setShowLoading(false);
                  }, 1500);
                  refetchAssignmentCreated();
                }
              }}
              placeholder='Question Type'
              wrapperClassName={styles.auth_select}
            />
          </div>
          <div className=''>
            <button
              type='button'
              className='btn go-back-button'
              // style={{ height: "50px" }}
              onClick={() => updateActiveTabFxn("1")}
            >
              <FontAwesomeIcon icon={faArrowLeft} className='me-2' /> Back to
              Create
            </button>
          </div>
        </div>

        {allLoading && (
          <div className={styles.spinner_container}>
            <Spinner /> <p className=''>Loading...</p>
          </div>
        )}

        {!allLoading && (showNoAssignment() || showNoAssignment2()) && (
          <div className={styles.placeholder_container}>
            <HiOutlineDocumentPlus className={styles.icon} />
            <p className={styles.heading}>No Assignment</p>
            {/* {user.designation_name === "Teacher" && (
                <p className="create-text-subheading">
                  There’s currently no assignment created.
                </p>
              )}
              {user.designation_name === "Student" && (
                <p className="create-text-subheading">
                  There’s currently no assignment for your class.
                </p>
              )} */}
          </div>
        )}

        <div className={styles.created__questions}>
          {!allLoading &&
            ObjectiveQ.length >= 1 &&
            question_type === "objective" &&
            ObjectiveQ.map((CQ, index) => {
              // console.log({ CQ });
              return (
                <div
                  className={styles.created__questions_container}
                  // style={{ width: "300px" }}
                  key={index}
                >
                  <p
                    className={styles.created__questions_question}
                    // style={{ fontSize: "15px", lineHeight: "20px" }}
                  >
                    {index + 1}. {CQ.question} ({CQ.question_mark} mks)
                  </p>
                  {CQ.image && (
                    <div className='mb-4 '>
                      <img src={CQ.image} width={70} height={70} alt='' />
                    </div>
                  )}
                  {CQ.option1 && (
                    <>
                      <p className={styles.created__questions_answer}>
                        {" "}
                        A. {CQ.option1}{" "}
                        {CQ.answer === CQ.option1 && " - (Correct Answer)"}
                      </p>
                      <p className={styles.created__questions_answer}>
                        {" "}
                        B. {CQ.option2}{" "}
                        {CQ.answer === CQ.option2 && " - (Correct Answer)"}
                      </p>
                      <p className={styles.created__questions_answer}>
                        C. {CQ.option3}{" "}
                        {CQ.answer === CQ.option3 && " - (Correct Answer)"}
                      </p>
                      <p className={styles.created__questions_answer}>
                        D. {CQ.option4}{" "}
                        {CQ.answer === CQ.option4 && " - (Correct Answer)"}
                      </p>
                    </>
                  )}
                  <ButtonGroup
                    options={[
                      {
                        title: "Edit",
                        // isLoading: addObjectAssignmentLoading || addTheoryAssignmentLoading,
                        onClick: () => {
                          setEditPrompt(true);
                          setEditQuestion(CQ.question);
                          setEditAnswer(CQ.answer);
                          setEditTotalQuestion(CQ.total_question);
                          setEditMark(CQ.question_mark);
                          setEditId(CQ.id);
                          setEditNumber(CQ.question_number);
                          setEditOption1(CQ.option1);
                          setEditOption2(CQ.option2);
                          setEditOption3(CQ.option3);
                          setEditOption4(CQ.option4);
                        },
                        // variant: `${activeTab === "2" ? "" : "outline"}`,
                      },
                      {
                        title: "Delete",
                        onClick: () => {
                          setDeletePrompt(true);
                          setEditQuestion(CQ.question);
                          setEditAnswer(CQ.answer);
                          setEditMark(CQ.question_mark);
                          setEditId(CQ.id);
                          setEditNumber(CQ.question_number);
                        },
                        variant: "outline",
                      },
                    ]}
                  />
                </div>
              );
            })}
          {!allLoading &&
            TheoryQ.length >= 1 &&
            question_type === "theory" &&
            TheoryQ.map((CQ, index) => {
              return (
                <div
                  className={styles.created__questions_container}
                  key={index}
                  // style={{ width: "300px" }}
                >
                  <p
                    className={styles.created__questions_question}
                    // style={{ fontSize: "15px", lineHeight: "20px" }}
                  >
                    {CQ.question_number}. {CQ.question} ({CQ.question_mark} mks)
                  </p>
                  {CQ.image && (
                    <div className='mb-4 '>
                      <img src={CQ.image} width={70} height={70} alt='' />
                    </div>
                  )}

                  {
                    <>
                      <p className={styles.created__questions_answer}>
                        Ans - {CQ.answer}
                      </p>
                    </>
                  }
                  <ButtonGroup
                    options={[
                      {
                        title: "Edit",
                        // isLoading: addObjectAssignmentLoading || addTheoryAssignmentLoading,
                        onClick: () => {
                          setEditPrompt(true);
                          setEditQuestion(CQ.question);
                          setEditAnswer(CQ.answer);
                          setEditTotalQuestion(CQ.total_question);
                          setEditMark(CQ.question_mark);
                          setEditId(CQ.id);
                          setEditNumber(CQ.question_number);
                          setEditOption1(CQ.option1);
                          setEditOption2(CQ.option2);
                          setEditOption3(CQ.option3);
                          setEditOption4(CQ.option4);
                        },
                        // variant: `${activeTab === "2" ? "" : "outline"}`,
                      },
                      {
                        title: "Delete",
                        onClick: () => {
                          setDeletePrompt(true);
                          setEditQuestion(CQ.question);
                          setEditAnswer(CQ.answer);
                          setEditMark(CQ.question_mark);
                          setEditId(CQ.id);
                          setEditNumber(CQ.question_number);
                        },
                        variant: "outline",
                      },
                    ]}
                  />
                </div>
              );
            })}
        </div>

        {!allLoading && (ObjectiveQ.length >= 1 || TheoryQ.length >= 1) && (
          <ButtonGroup options={buttonOptions2} />
        )}
      </div>
      {/* submit assignment prompt */}
      <Prompt
        // promptHeader={`INCOMPLETE QUESTION(S) `}
        promptHeader={`${
          completedQuestion() || completedQuestion2()
            ? "CONFIRM ASSIGNMENT CREATION"
            : "INCOMPLETE QUESTION(S)"
        }`}
        toggle={() => setWarningPrompt(!warningPrompt)}
        isOpen={warningPrompt}
        hasGroupedButtons={true}
        groupedButtonProps={buttonOptions3}
      >
        {completedQuestion() || completedQuestion2() ? (
          <p
            className={styles.create_question_question}
            // style={{ fontSize: "15px", lineHeight: "20px" }}
          >
            Are you sure you want to submit created question(s)?
          </p>
        ) : (
          <p
            className={styles.create_question_question}
            // style={{ fontSize: "15px", lineHeight: "20px" }}
          >
            The amount of created question(s) is not equal to the total amount
            of question(s) you specified.
          </p>
        )}
      </Prompt>
      {/* clear all prompt */}
      <Prompt
        promptHeader={`CONFIRM CLEAR-ALL ACTION`}
        toggle={() => setClearAllPrompt(!clearAllPrompt)}
        isOpen={clearAllPrompt}
        hasGroupedButtons={true}
        groupedButtonProps={clearAllButtons}
      >
        <p
          className={styles.create_question_question}
          // style={{ fontSize: "15px", lineHeight: "20px" }}
        >
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
            <label className={styles.create_question_label}>Questions</label>
            <div className='auth-textarea-wrapper'>
              <textarea
                className='form-control'
                type='text'
                value={editQuestion}
                placeholder='Type the assignment question'
                onChange={(e) =>
                  // editTheoryQuestionFxn({
                  //   question: e.target.value,
                  // })
                  {
                    setEditQuestion(e.target.value);
                  }
                }
              />
            </div>
            <label className={styles.create_question_label}>Options</label>
            <div className='d-flex flex-column gap-3'>
              {/* option - A */}
              <div className='d-flex align-items-center gap-5'>
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
                    wrapperClassName=''
                  />
                </div>
                <div className='d-flex align-items-center gap-3 cursor-pointer'>
                  <input
                    type='radio'
                    name='radio-1'
                    checked={editOption1 === editAnswer}
                    id='option-A'
                    style={{ width: "20px", height: "20px" }} // Set the width using inline styles
                    onChange={(e) => setEditAnswer(e.target.value)}
                    value={editOption1}
                  />
                  <label
                    htmlFor='option-A'
                    style={{ lineHeight: "18px", fontSize: "13px" }}
                  >
                    Correct answer
                  </label>
                </div>
              </div>
              {/* option B */}
              <div className='d-flex align-items-center gap-5'>
                <div style={{ width: "250px" }}>
                  <AuthInput
                    type='text'
                    placeholder='Option B'
                    // hasError={!!errors.username}
                    value={editOption2}
                    name='option'
                    onChange={(e) => setEditOption2(e.target.value)}
                    wrapperClassName=''
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
                  <label
                    htmlFor='option-B'
                    style={{ lineHeight: "18px", fontSize: "13px" }}
                  >
                    Correct answer
                  </label>
                </div>
              </div>
              {/* option C */}
              <div className='d-flex align-items-center gap-5'>
                <div style={{ width: "250px" }}>
                  <AuthInput
                    type='text'
                    placeholder='Option C'
                    // hasError={!!errors.username}
                    value={editOption3}
                    name='option'
                    onChange={(e) => setEditOption3(e.target.value)}
                    wrapperClassName=''
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
                  <label
                    htmlFor='option-C'
                    style={{ lineHeight: "18px", fontSize: "13px" }}
                  >
                    Correct answer
                  </label>
                </div>
              </div>
              {/* option D */}
              <div className='d-flex align-items-center gap-5'>
                <div style={{ width: "250px" }}>
                  <AuthInput
                    type='text'
                    placeholder='Option D'
                    // hasError={!!errors.username}
                    value={editOption4}
                    name='option'
                    onChange={(e) => setEditOption4(e.target.value)}
                    wrapperClassName=''
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
                  <label
                    htmlFor='option-D'
                    style={{ lineHeight: "18px", fontSize: "13px" }}
                  >
                    Correct answer
                  </label>
                </div>
              </div>
            </div>
            {/* <label className={styles.create_question_label}>
              Mark Computation
            </label>
            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-center gap-5">
                <div style={{ width: "100px" }}>
                  <AuthInput
                    type="number"
                    placeholder="Question Mark"
                    value={editMark}
                    name="option"
                    onChange={() => {}}
                    wrapperClassName=""
                  />
                </div>
                <div className="d-flex align-items-center gap-3 cursor-pointer">
                  <p
                    className=""
                    style={{
                      lineHeight: "18px",
                      fontSize: "13px",
                    }}
                  >
                    Question Mark
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center gap-5">
                <div style={{ width: "100px" }}>
                  <AuthInput
                    type="number"
                    placeholder="Total Question"
                    value={editTotalQuestion}
                    name="option"
                    onChange={() => {}}
                    wrapperClassName=""
                  />
                </div>
                <div className="d-flex align-items-center gap-3 cursor-pointer">
                  <p
                    className=""
                    style={{
                      lineHeight: "18px",
                      fontSize: "13px",
                    }}
                  >
                    Total Question
                  </p>
                </div>
              </div>
            </div> */}
          </div>
        )}
        {question_type === "theory" && (
          <div>
            <label className={styles.create_question_label}>Questions</label>
            <div className='auth-textarea-wrapper'>
              <textarea
                className='form-control'
                type='text'
                value={editQuestion}
                placeholder='Type the assignment question'
                onChange={(e) =>
                  // editTheoryQuestionFxn({
                  //   question: e.target.value,
                  // })
                  {
                    setEditQuestion(e.target.value);
                  }
                }
              />
            </div>
            <label className={styles.create_question_label}>Answer</label>
            <div className='auth-textarea-wrapper'>
              <textarea
                className='form-control'
                type='text'
                value={editAnswer}
                placeholder='Type the answer to the question'
                onChange={(e) => {
                  setEditAnswer(e.target.value);
                }}
              />
            </div>
            {/* <label className={styles.create_question_label}>
              Mark Computation
            </label>
            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-center gap-5">
                <div style={{ width: "100px" }}>
                  <AuthInput
                    type="number"
                    placeholder="Question Mark"
                    value={editMark}
                    name="option"
                    onChange={(e) => {
                      setEditMark(e.target.value);
                    }}
                    wrapperClassName=""
                  />
                </div>
                <div className="d-flex align-items-center gap-3 cursor-pointer">
                  <p
                    className=""
                    style={{
                      lineHeight: "18px",
                      fontSize: "13px",
                    }}
                  >
                    Question Mark
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center gap-5">
                <div style={{ width: "100px" }}>
                  <AuthInput
                    type="number"
                    placeholder="Total Question"
                    value={editTotalQuestion}
                    name="option"
                    onChange={(e) => {
                      setEditTotalQuestion(e.target.value);
                    }}
                    wrapperClassName=""
                  />
                </div>
                <div className="d-flex align-items-center gap-3 cursor-pointer">
                  <p
                    className=""
                    style={{
                      lineHeight: "18px",
                      fontSize: "13px",
                    }}
                  >
                    Total Question
                  </p>
                </div>
              </div>
            </div> */}
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
        <p
          className={styles.create_question_question}
          // style={{ fontSize: "15px", lineHeight: "20px" }}
        >
          Are you sure you want to delete this question?
        </p>
      </Prompt>
    </div>
  );
};

export default Created;
