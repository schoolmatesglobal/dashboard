import React, { useState } from "react";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import { PiWarningCircleBold } from "react-icons/pi";
// import { useAssignments } from "../../../hooks/useAssignments";
// useAssignments

import CreateQuestion from "./createQuestion";
import AuthSelect from "../../../components/inputs/auth-select";
import Button from "../../../components/buttons/button";
import Prompt from "../../../components/modals/prompt";
import ButtonGroup from "../../../components/buttons/button-group";
import styles from "../../../assets/scss/pages/dashboard/assignment.module.scss";
import AuthInput from "../../../components/inputs/auth-input";
import { addQuestionMarks, updateQuestionNumbers } from "./constant";
import queryKeys from "../../../utils/queryKeys";
import { useQuery } from "react-query";
import { sortQuestionsByNumber } from "./constant";
import { Spinner } from "reactstrap";
import { useAssignments } from "../../../hooks/useAssignments";
import { useSubject } from "../../../hooks/useSubjects";

const Create = () => {
  const {
    updateActiveTabFxn,

    subjectsByTeacher,
    subjectsByTeacherLoading,

    // activeTab,
    createQuestionPrompt,
    setCreateQuestionPrompt,
    //
    // myStudents,
    classSubjects,
    apiServices,
    errorHandler,
    permission,
    user,
    //

    // QUERIES
    addObjectiveAssignments,
    addObjectAssignmentLoading,
    //
    addTheoryAssignments,
    addTheoryAssignmentLoading,
    //

    // CREATE
    updateCheckObjectiveQuestionFxn,
    checkObjectiveQuestions,
    //
    updateCheckTheoryQuestionFxn,
    checkTheoryQuestions,
    //
    updateCreateQuestionFxn,
    // emptyCreateQuestionFxn,
    createQuestion,
    //
    // updateObjectiveQuestionFxn,
    // addObjectiveQuestionFxn,
    editObjectiveQuestionFxn,
    deleteObjectiveQuestionFxn,
    emptyObjectiveQuestionsFxn,
    updateObjectiveQuestionsMarkFxn,
    updateObjectiveTotalQuestionFxn,
    ObjectiveQuestions,
    //
    // addTheoryQuestionFxn,
    editTheoryQuestionFxn,
    deleteTheoryQuestionFxn,
    emptyTheoryQuestionsFxn,
    updateTheoryTotalQuestionFxn,
    TheoryQuestions,
    //

    // CREATED
    updateCreatedQuestionFxn,
    // createdQuestion,
    //
    // updateObjectiveQFxn,
    // ObjectiveQ,
    //
    // updateTheoryQFxn,
    // TheoryQ,
    //
    // assignmentLoadingCreated,
    refetchAssignmentCreated,
    //
  } = useAssignments();

  const { subjects, isLoading: subjectLoading } = useSubject();

  const {
    // option1,
    // option2,
    // option3,
    // option4,
    // ans1,
    // ans2,
    // ans3,
    // ans4,
    // answer,
    // theoryAns,
    question_type,
    // question,
    subject,
    // image,
    // imageName,
    // term,
    // period,
    // session,
    subject_id,
    week,
    total_question,
    // total_mark,
    // theory_total_mark,
    // question_mark,
    // question_number,
  } = createQuestion;

  // const [promptStatus, setPromptStatus] = useState("compute");

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
  const [showLoading, setShowLoading] = useState(false);
  // const [showAddQuestion, setShowAddQuestion] = useState(true);
  // const navigate = useNavigate();

  const activateRetrieve = () => {
    if (subject !== "" && question_type !== "" && week !== "") {
      return true;
    } else {
      return false;
    }
  };

  //// FETCH ASSIGNMENTS CREATED /////////
  const { isLoading: assignmentLoading, refetch: refetchAssignment } = useQuery(
    [
      queryKeys.GET_ASSIGNMENT,
      user?.period,
      user?.term,
      user?.session,
      question_type,
      "second",
    ],
    () =>
      apiServices.getAssignment(
        user?.period,
        user?.term,
        user?.session,
        question_type
      ),
    {
      retry: 3,
      // enabled: permission?.read || permission?.readClass,
      enabled: activateRetrieve() && permission?.created,
      onSuccess(data) {
        // console.log({ data });
        const sortData = () => {
          const sortedData = data?.filter(
            (dt) => Number(dt?.subject_id) === subject_id
          );
          const sortedData2 = sortedData?.filter(
            (dt) => Number(dt?.week) === Number(week)
          );
          const sortedByQN = sortQuestionsByNumber(sortedData2);

          // if (data.length > 0) {
          //   return sortedByQN;
          // } else if (data.length === 0) {
          //   return [];
          // }

          return sortedByQN;
        };
        // const sortedData = data?.filter(
        //   (dt) => Number(dt?.subject_id) === subject_id
        // );
        // const sortedData2 = sortedData?.filter(
        //   (dt) => Number(dt?.week) === Number(week)
        // );
        // const sortedByQN = sortQuestionsByNumber(sortedData2);
        // console.log({ data, subject_id });
        if (question_type === "objective") {
          // setShowNoMessage(false);
          // updateObjectiveQuestionFxn(sortData());
          updateCheckTheoryQuestionFxn([]);
          updateCheckObjectiveQuestionFxn(sortData());
        } else if (question_type === "theory") {
          // setShowNoMessage(false);
          // updateCheckObjectiveQuestionFxn(sortData());
          updateCheckObjectiveQuestionFxn([]);
          updateCheckTheoryQuestionFxn(sortData());
        }
      },
      onError(err) {
        errorHandler(err);
      },
      select: apiServices.formatData,
    }
  );

  const completedQuestion = () => {
    if (ObjectiveQuestions.length !== Number(total_question)) {
      return false;
    } else if (ObjectiveQuestions.length === Number(total_question)) {
      return true;
    }
  };
  const completedQuestion2 = () => {
    if (TheoryQuestions.length !== Number(total_question)) {
      return false;
    } else if (TheoryQuestions.length === Number(total_question)) {
      return true;
    }
  };

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
        updateCreateQuestionFxn({
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
        });
        emptyObjectiveQuestionsFxn();
        emptyTheoryQuestionsFxn();
        setClearAllPrompt(false);
      },
      variant: "outline",
    },
  ];

  const buttonOptions3 = [
    {
      title: "Cancel",
      onClick: () => setWarningPrompt(false),
      variant: "outline",
    },
    {
      title: "Yes Submit",
      isLoading: addObjectAssignmentLoading || addTheoryAssignmentLoading,
      disabled:
        question_type === "objective"
          ? !completedQuestion()
          : question_type === "theory"
          ? !completedQuestion2()
          : "",
      onClick: () => {
        if (finalObjectiveArray.length >= 1) {
          // updateCreatedQuestionFxn({
          //   subject,
          //   subject_id,
          //   question_type,
          //   week,
          // });
          setShowLoading(true);
          setTimeout(() => {
            setShowLoading(false);
          }, 1500);
          addObjectiveAssignments();
          // refetchAssignment();
          updateCreateQuestionFxn({
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
          });

          emptyObjectiveQuestionsFxn();

          refetchAssignmentCreated();
          setTimeout(() => {
            refetchAssignmentCreated();
          }, 2000);
          // updateActiveTabFxn("2");
          setWarningPrompt(false);
        } else if (finalTheoryArray.length >= 1) {
          // updateCreatedQuestionFxn({
          //   subject,
          //   subject_id,
          //   question_type,
          //   week,
          // });
          setShowLoading(true);
          setTimeout(() => {
            setShowLoading(false);
          }, 1500);
          addTheoryAssignments();
          // refetchAssignment();
          updateCreateQuestionFxn({
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
          });
          emptyTheoryQuestionsFxn();

          refetchAssignmentCreated();
          setTimeout(() => {
            refetchAssignmentCreated();
          }, 2000);
          // updateActiveTabFxn("2");
          setWarningPrompt(false);
        }
      },
    },
  ];

  const buttonOptions2 = [
    {
      title: "Clear All",
      onClick: () => {
        setClearAllPrompt(true);
      },
      variant: "outline",
    },
    {
      title: "Submit",
      // isLoading: addObjectAssignmentLoading || addTheoryAssignmentLoading,
      onClick: () => {
        // setClearAllPrompt(true);
        setWarningPrompt(true);
      },
      // variant: `${activeTab === "2" ? "" : "outline"}`,
    },
  ];

  const buttonOptions4 = [
    {
      title: "Edit",
      // isLoading: addObjectAssignmentLoading || addTheoryAssignmentLoading,
      onClick: () => {
        setWarningPrompt(true);
      },
      // variant: `${activeTab === "2" ? "" : "outline"}`,
    },
    {
      title: "Delete",
      onClick: () => {
        emptyObjectiveQuestionsFxn();
        emptyTheoryQuestionsFxn();
      },
      variant: "outline",
    },
  ];

  const EditDeleteButtons = [
    {
      title: "Edit",
      // isLoading: addObjectAssignmentLoading || addTheoryAssignmentLoading,
      onClick: () => {
        setEditPrompt(true);
      },
      // variant: `${activeTab === "2" ? "" : "outline"}`,
    },
    {
      title: "Delete",
      onClick: () => {
        setDeletePrompt(true);
      },
      variant: "outline",
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
          deleteObjectiveQuestionFxn({
            number: editNumber,
          });
        } else if (question_type === "theory") {
          deleteTheoryQuestionFxn({
            number: editNumber,
          });
        }
        setDeletePrompt(false);
      },
      variant: "outline",
    },
  ];

  const findSubjectId = (value) => {
    const findObject = classSubjects?.find((opt) => opt.value === value);
    if (findObject) {
      return findObject.id;
    }
  };

  const checkedTheory = (question, answer) => {
    const indexToCheck = TheoryQuestions.findIndex(
      (ob) => ob.question === question && ob.answer === answer
    );
    if (indexToCheck !== -1) {
      return TheoryQuestions[indexToCheck];
    } else {
      return "";
    }
  };
  const checkedObjective = (question, CQ) => {
    const indexToCheck = TheoryQuestions.findIndex(
      (ob) => ob.question === question && ob.answer === CQ
    );
    if (indexToCheck !== -1) {
      return TheoryQuestions[indexToCheck];
    } else {
      return "";
    }
  };

  const questionType = [
    {
      value: "objective",
      title: "objective",
    },

    {
      value: "theory",
      title: "theory",
    },
  ];

  const sortQuestionType = () => {
    let arr = [];
    if (ObjectiveQuestions.length >= 1) {
      arr.push({
        value: "objective",
        title: "objective",
      });
    } else if (TheoryQuestions.length >= 1) {
      arr.push({
        value: "theory",
        title: "theory",
      });
    } else {
      arr.push(
        {
          value: "objective",
          title: "objective",
        },

        {
          value: "theory",
          title: "theory",
        }
      );
    }
    return arr;
  };

  const defaultQuestionType = () => {
    switch (question_type) {
      case "theory":
        return questionType[1].value;
        break;
      case "objective":
        return questionType[0].value;
        break;

      default:
        return "";
        break;
    }
  };

  // const quest = checkedTheory(editQuestion, editAnswer)?.question;

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
          editObjectiveQuestionFxn({
            number: editNumber,
            change: {
              question: editQuestion,
              answer: editAnswer,
              question_mark: editMark,
              option1: editOption1,
              option2: editOption2,
              option3: editOption3,
              option4: editOption4,
            },
          });
        } else if (question_type === "theory") {
          editTheoryQuestionFxn({
            number: editNumber,
            change: {
              question: editQuestion,
              answer: editAnswer,
              question_mark: editMark,
            },
          });
        }
        setEditPrompt(false);
      },
      variant: "outline",
    },
  ];

  const totalMark = addQuestionMarks(TheoryQuestions);

  // const finalTheoryArray = updateQuestionNumbers(totalMark);

  // const finalObjectiveArray = updateQuestionNumbers(ObjectiveQuestions);
  const finalObjectiveArray =
    ObjectiveQuestions.length !== 1
      ? updateQuestionNumbers(ObjectiveQuestions)
      : ObjectiveQuestions.length === 1
      ? ObjectiveQuestions
      : [];

  const finalTheoryArray =
    TheoryQuestions.length !== 1
      ? updateQuestionNumbers(TheoryQuestions)
      : TheoryQuestions.length === 1
      ? TheoryQuestions
      : [];
  // const finalObjectiveArray = () => {
  //   if (ObjectiveQuestions.length !== 1) {
  //     return updateQuestionNumbers(ObjectiveQuestions);
  //   } else if (ObjectiveQuestions.length === 1) {
  //     return ObjectiveQuestions;
  //   }
  // };

  const allLoading = showLoading || assignmentLoading;

  const activateAddQuestion = () => {
    if (
      (ObjectiveQuestions.length === 0 &&
        TheoryQuestions.length === 0 &&
        (!subject || !week || !question_type)) ||
      (finalObjectiveArray[finalObjectiveArray.length - 1]?.total_question !==
        0 &&
        ObjectiveQuestions.length ===
          Number(
            finalObjectiveArray[finalObjectiveArray.length - 1]?.total_question
          )) ||
      (finalTheoryArray[finalTheoryArray.length - 1]?.total_question !== 0 &&
        TheoryQuestions.length ===
          Number(
            finalTheoryArray[finalTheoryArray.length - 1]?.total_question
          )) ||
      (question_type === "objective" && checkObjectiveQuestions.length > 0) ||
      (question_type === "theory" && checkTheoryQuestions.length > 0)
    ) {
      return true;
      // setShowAddQuestion(true);
      // return showAddQuestion;
    } else {
      return false;
      // setShowAddQuestion(false);
      // return showAddQuestion;
    }
  };

  // const finalObjectiveArray = updateObjectiveTotals(questionMark);

  // console.log({ ObjectiveQuestions });
  // console.log({
  //   // cq: completedQuestion() || completedQuestion2(),
  //   // total_question,
  //   ObjectiveQuestions,
  //   TheoryQuestions,
  // });

  // console.log({
  //   createQuestion,
  // });
  console.log({
    subjectsByTeacher,
    classSubjects,
    finalTheoryArray,
    finalObjectiveArray,
    ObjectiveQuestions,
    TheoryQuestions,
    totalMark,
  });
  // console.log({ totalMark, editQuestion, editAnswer, editMark, editNumber });
  // console.log({
  //   finalTheoryArray,
  //   finalObjectiveArray,
  //   checkObjectiveQuestions,
  //   checkTheoryQuestions,
  //   ObjectiveQuestions,
  //   TheoryQuestions,
  // });

  // console.log({
  //   AR: activateRetrieve(),
  //   createQuestion,
  // });

  return (
    <>
      <div className={styles.create}>
        <div className={styles.create__options}>
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
                updateCreateQuestionFxn({
                  week: value,
                });
                setShowLoading(true);
                setTimeout(() => {
                  setShowLoading(false);
                }, 1500);
                if (subject !== "" && question_type !== "") {
                  refetchAssignment();
                }
                // refetchAssignment();
              }}
              placeholder='Select Week'
              disabled={
                ObjectiveQuestions.length >= 1 || TheoryQuestions.length >= 1
              }
              wrapperClassName={styles.auth_select}
            />
            <AuthSelect
              sort
              options={classSubjects}
              value={subject}
              onChange={({ target: { value } }) => {
                updateCreateQuestionFxn({
                  subject: value,

                  subject_id: findSubjectId(value),
                });
                setShowLoading(true);
                setTimeout(() => {
                  setShowLoading(false);
                }, 1500);
                if (week !== "" && question_type !== "") {
                  refetchAssignment();
                }
                // refetchAssignment();
              }}
              placeholder='Select Subject'
              disabled={
                ObjectiveQuestions.length >= 1 || TheoryQuestions.length >= 1
              }
              // wrapperClassName={`${styles.auth_select} ${styles.hh}`}
              wrapperClassName={styles.auth_select}
              // label="Subject"
            />

            <AuthSelect
              sort
              options={sortQuestionType()}
              value={defaultQuestionType()}
              // label="Question Type"
              onChange={({ target: { value } }) => {
                updateCreateQuestionFxn({ question_type: value, answer: "" });
                setShowLoading(true);
                setTimeout(() => {
                  setShowLoading(false);
                }, 1500);
                if (subject !== "" && week !== "") {
                  refetchAssignment();
                }
              }}
              placeholder='Select type'
              wrapperClassName={styles.auth_select}
              // defaultValue={questionType[1].value}
            />
          </div>

          <Button
            variant=''
            onClick={() => {
              if (question_type === "theory") {
                updateCreateQuestionFxn({
                  question_number: TheoryQuestions?.length + 1,
                });
              } else if (question_type === "objective") {
                updateCreateQuestionFxn({
                  question_number: ObjectiveQuestions?.length + 1,
                });
              }
              setCreateQuestionPrompt(true);
            }}
            disabled={activateAddQuestion()}
          >
            {ObjectiveQuestions.length === 0 && TheoryQuestions.length === 0
              ? "Add Question"
              : "Add another Question"}
          </Button>
        </div>

        {allLoading && (
          <div className={styles.spinner_container}>
            <Spinner /> <p className=''>Loading...</p>
          </div>
        )}

        {!allLoading &&
          ObjectiveQuestions.length === 0 &&
          TheoryQuestions.length === 0 &&
          checkObjectiveQuestions.length === 0 &&
          checkTheoryQuestions.length === 0 && (
            <div className={styles.placeholder_container}>
              <HiOutlineDocumentPlus className={styles.icon} />
              <p className={styles.heading}>Create Assignment</p>
            </div>
          )}
        {!allLoading &&
          ObjectiveQuestions.length === 0 &&
          TheoryQuestions.length === 0 &&
          (checkObjectiveQuestions.length > 0 ||
            checkTheoryQuestions.length > 0) && (
            <div className={styles.placeholder_container}>
              <PiWarningCircleBold className={styles.icon} />
              <p className={styles.heading}>Assignment Created</p>
              <div className='d-flex gap-5'>
                <div className='mt-5'>
                  <Button
                    variant=''
                    onClick={() => {
                      updateCreatedQuestionFxn({
                        subject,
                        subject_id,
                        question_type,
                        week,
                      });
                      updateActiveTabFxn("2");
                    }}
                  >
                    View Questions
                  </Button>
                </div>
                <div className='mt-5'>
                  <Button
                    variant='outline'
                    onClick={() => {
                      setCreateQuestionPrompt(true);
                    }}
                  >
                    Add More Question
                  </Button>
                </div>
              </div>
            </div>
          )}

        <div className={styles.marks_row}>
          {!allLoading &&
            question_type === "objective" &&
            ObjectiveQuestions.length > 0 && (
              <div className={styles.marks_container}>
                <p className={styles.marks_title}>Total Question(s):</p>
                <p className={styles.marks_value}>
                  {ObjectiveQuestions.length} /{" "}
                  {
                    finalObjectiveArray[finalObjectiveArray.length - 1]
                      ?.total_question
                  }
                </p>
              </div>
            )}
          {question_type === "theory" && TheoryQuestions.length > 0 && (
            <div className={styles.marks_container}>
              <p className={styles.marks_title}>Total Question(s):</p>
              <p className={styles.marks_value}>
                {TheoryQuestions.length} /{" "}
                {finalTheoryArray[finalTheoryArray.length - 1]?.total_question}
              </p>
            </div>
          )}
          {question_type === "objective" && ObjectiveQuestions.length > 0 && (
            <div className={styles.marks_container}>
              <p className={styles.marks_title}>Each Question:</p>
              <p className={styles.marks_value}>
                {
                  finalObjectiveArray[finalObjectiveArray.length - 1]
                    ?.question_mark
                }{" "}
                mk(s)
              </p>
            </div>
          )}
          {question_type === "objective" && ObjectiveQuestions.length > 0 && (
            <div className={styles.marks_container}>
              <p className={styles.marks_title}>Total Marks:</p>
              <p className={styles.marks_value}>
                {finalObjectiveArray[finalObjectiveArray.length - 1]
                  ?.question_mark *
                  finalObjectiveArray[finalObjectiveArray.length - 1]
                    ?.total_question}{" "}
                mk(s)
              </p>
            </div>
          )}
          {question_type === "theory" && TheoryQuestions.length > 0 && (
            <div className={styles.marks_container}>
              <p className={styles.marks_title}>Total Marks:</p>
              <p className={styles.marks_value}>
                {finalTheoryArray[finalTheoryArray.length - 1]?.total_mark}{" "}
                mk(s)
              </p>
            </div>
          )}
        </div>

        <div className={styles.create__questions}>
          {!allLoading &&
            ObjectiveQuestions.length >= 1 &&
            ObjectiveQuestions.map((CQ, index) => {
              // console.log({ tk: CQ });
              return (
                <div className='' key={index}>
                  <div
                    className={styles.create__questions_container}
                    key={index}
                    // style={{ width: "300px" }}
                  >
                    <p
                      className={styles.create__questions_question}
                      // style={{ fontSize: "15px", lineHeight: "20px" }}
                    >
                      {index + 1}. {CQ.question} ({CQ.question_mark} mk(s) )
                    </p>
                    {CQ.image && (
                      <div className='mb-4 '>
                        <img src={CQ.image} width={70} height={70} alt='' />
                      </div>
                    )}
                    {CQ.option1 && (
                      <>
                        <p className={styles.create__questions_answer}>
                          {" "}
                          A. {CQ.option1}{" "}
                          {CQ.answer === CQ.option1 && " (Correct Answer)"}
                        </p>
                        <p className={styles.create__questions_answer}>
                          {" "}
                          B. {CQ.option2}{" "}
                          {CQ.answer === CQ.option2 && " (Correct Answer)"}
                        </p>
                        <p className={styles.create__questions_answer}>
                          C. {CQ.option3}{" "}
                          {CQ.answer === CQ.option3 && " (Correct Answer)"}
                        </p>
                        <p className={styles.create__questions_answer}>
                          D. {CQ.option4}{" "}
                          {CQ.answer === CQ.option4 && " (Correct Answer)"}
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
                            setEditNumber(CQ.question_number);
                          },
                          variant: "outline",
                        },
                      ]}
                    />
                  </div>
                </div>
              );
            })}
          {TheoryQuestions.length >= 1 &&
            TheoryQuestions.map((CQ, index) => {
              // console.log({ CQ });
              return (
                <div className='' key={index}>
                  <div
                    className={styles.create__questions_container}
                    key={index}
                    // style={{ width: "300px" }}
                  >
                    <p
                      className={styles.created__questions_question}
                      // style={{ fontSize: "15px", lineHeight: "20px" }}
                    >
                      {index + 1}. {CQ.question}
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
                        <p className={styles.created__questions_answer}>
                          ({CQ.question_mark} mks)
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
                            setEditNumber(CQ.question_number);
                          },
                          variant: "outline",
                        },
                      ]}
                    />
                  </div>
                </div>
              );
            })}
        </div>

        {!allLoading &&
          (ObjectiveQuestions.length >= 1 || TheoryQuestions.length >= 1) && (
            <ButtonGroup options={buttonOptions2} />
          )}
      </div>
      <CreateQuestion
        createQuestionPrompt={createQuestionPrompt}
        setCreateQuestionPrompt={setCreateQuestionPrompt}
      />
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
            <label className={styles.create_question_label}>
              Mark Computation
            </label>
            <div className='d-flex flex-column gap-3'>
              {/*Question Mark */}
              <div className='d-flex align-items-center gap-5'>
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
                      updateObjectiveQuestionsMarkFxn({
                        newValue: e.target.value,
                      });
                      updateCreateQuestionFxn({
                        question_mark: e.target.value,
                        total_mark: e.target.value * total_question,
                      });
                    }}
                    wrapperClassName=''
                  />
                </div>
                <div className='d-flex align-items-center gap-3 cursor-pointer'>
                  <p
                    className=''
                    style={{
                      lineHeight: "18px",
                      fontSize: "13px",
                    }}
                  >
                    Question Mark
                  </p>
                </div>
              </div>
              {/* Total Question */}
              <div className='d-flex align-items-center gap-5'>
                <div style={{ width: "100px" }}>
                  <AuthInput
                    type='number'
                    placeholder='Total Question'
                    // hasError={!!errors.username}
                    // defaultValue={CQ.question_mark}
                    min={ObjectiveQuestions.length}
                    value={editTotalQuestion}
                    name='option'
                    onChange={(e) => {
                      setEditTotalQuestion(e.target.value);
                      updateObjectiveTotalQuestionFxn({
                        newValue: e.target.value,
                      });
                      // updateCreateQuestionFxn({
                      //   question_mark: e.target.value,
                      //   total_mark: e.target.value * total_question,
                      // });
                    }}
                    wrapperClassName=''
                  />
                </div>
                <div className='d-flex align-items-center gap-3 cursor-pointer'>
                  <p
                    className=''
                    style={{
                      lineHeight: "18px",
                      fontSize: "13px",
                    }}
                  >
                    Total Question
                  </p>
                </div>
              </div>
            </div>
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
            <label className={styles.create_question_label}>
              Mark Computation
            </label>
            <div className='d-flex flex-column gap-3'>
              {/*Question Mark */}
              <div className='d-flex align-items-center gap-5'>
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
                      fontSize: "13px",
                    }}
                  >
                    Question Mark
                  </p>
                </div>
              </div>
              {/* Total Question */}
              <div className='d-flex align-items-center gap-5'>
                <div style={{ width: "100px" }}>
                  <AuthInput
                    type='number'
                    placeholder='Total Question'
                    // hasError={!!errors.username}
                    // defaultValue={CQ.question_mark}
                    min={TheoryQuestions.length}
                    value={editTotalQuestion}
                    name='option'
                    onChange={(e) => {
                      setEditTotalQuestion(e.target.value);
                      updateTheoryTotalQuestionFxn({
                        newValue: e.target.value,
                      });
                      updateCreateQuestionFxn({
                        total_question: e.target.value,
                        // total_mark: e.target.value * question_mark,
                      });
                      // updateCreateQuestionFxn({
                      //   question_mark: e.target.value,
                      //   total_mark: e.target.value * total_question,
                      // });
                    }}
                    wrapperClassName=''
                  />
                </div>
                <div className='d-flex align-items-center gap-3 cursor-pointer'>
                  <p
                    className=''
                    style={{
                      lineHeight: "18px",
                      fontSize: "13px",
                    }}
                  >
                    Total Question
                  </p>
                </div>
              </div>
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
        <p
          className={styles.create_question_question}
          // style={{ fontSize: "15px", lineHeight: "20px" }}
        >
          Are you sure you want to delete this question?
        </p>
      </Prompt>
    </>
  );
};

export default Create;
