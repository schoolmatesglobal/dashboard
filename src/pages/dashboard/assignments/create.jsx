import React, { useEffect, useState } from "react";
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

const Create = ({
  createQ,
  setCreateQ,
  objectiveQ,
  theoryQ,
  setObjectiveQ,
  setTheoryQ,
}) => {
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
    checkObjectiveQ,
    //
    updateCheckTheoryQuestionFxn,
    checkTheoryQ,
    //
    updateCreateQuestionFxn,
    // emptyCreateQuestionFxn,
    createQuestion,
    //
    // updateObjectiveQuestionFxn,
    // addObjectiveQuestionFxn,
    editObjectiveQuestionFxn,
    deleteObjectiveQuestionFxn,
    emptyObjectiveQFxn,
    updateObjectiveQMarkFxn,
    updateObjectiveTotalQuestionFxn,
    // objectiveQ,
    //
    // addTheoryQuestionFxn,
    editTheoryQuestionFxn,
    deleteTheoryQuestionFxn,
    emptyTheoryQFxn,
    updateTheoryTotalQuestionFxn,
    // theoryQ,
    //

    // CREATED
    updateCreatedQuestionFxn,

    refetchAssignmentCreated,
    //
  } = useAssignments();

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

  // const {

  //   question_type,

  //   subject,

  //   subject_id,
  //   week,
  //   total_question,

  // } = createQuestion;

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
  const [finalTheoryArray, setFinalTheoryArray] = useState([]);
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

          // if (data?.length > 0) {
          //   return sortedByQN;
          // } else if (data?.length === 0) {
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
    if (objectiveQ?.length !== Number(total_question)) {
      return false;
    } else if (objectiveQ?.length === Number(total_question)) {
      return true;
    }
  };
  const completedQuestion2 = () => {
    if (theoryQ?.length !== Number(total_question)) {
      return false;
    } else if (theoryQ?.length === Number(total_question)) {
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
        setTheoryQ([]);
        // emptyObjectiveQFxn();
        // emptyTheoryQFxn();
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
        if (finalObjectiveArray?.length >= 1) {
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

          emptyObjectiveQFxn();

          refetchAssignmentCreated();
          setTimeout(() => {
            refetchAssignmentCreated();
          }, 2000);
          // updateActiveTabFxn("2");
          setWarningPrompt(false);
        } else if (finalTheoryArray?.length >= 1) {
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
          emptyTheoryQFxn();

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
        emptyObjectiveQFxn();
        emptyTheoryQFxn();
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
          // deleteObjectiveQuestionFxn({
          //   number: editNumber,
          // });
          const filter = objectiveQ
            ?.filter((item) => item.question_number !== editNumber)
            ?.sort((a, b) => {
              if (a.question_number < b.question_number) {
                return -1;
              }
              if (a.question_number > b.question_number) {
                return 1;
              }
              return 0;
            })
            ?.map((ob, i) => {
              return {
                ...ob,
                question_number: i + 1,
                total_question: Number(total_question) - 1,
                total_mark: (Number(total_question) - 1) * question_mark,
              };
            });

          const findIndex = objectiveQ?.findIndex(
            (item) => item.question_number === editNumber
          );

          if (findIndex !== -1) {
            setObjectiveQ([...filter]);
            setCreateQ((prev) => ({
              ...prev,
              total_question: Number(total_question) - 1,
              total_mark: (Number(total_question) - 1) * question_mark,
            }));
          }
        } else if (question_type === "theory") {
          // deleteTheoryQuestionFxn({
          //   number: editNumber,
          // });
          const filter = theoryQ?.filter(
            (item) => item.question_number !== editNumber
          );

          const findIndex = theoryQ?.findIndex(
            (item) => item.question_number === editNumber
          );

          setCreateQ((prev) => ({
            ...prev,

            theory_total_mark: Number(theory_total_mark) - Number(editMark),
          }));

          if (findIndex !== -1) {
            setTheoryQ([...filter]);
          }
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
    const indexToCheck = theoryQ.findIndex(
      (ob) => ob.question === question && ob.answer === answer
    );
    if (indexToCheck !== -1) {
      return theoryQ[indexToCheck];
    } else {
      return "";
    }
  };
  const checkedObjective = (question, CQ) => {
    const indexToCheck = theoryQ.findIndex(
      (ob) => ob.question === question && ob.answer === CQ
    );
    if (indexToCheck !== -1) {
      return theoryQ[indexToCheck];
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
    if (objectiveQ?.length >= 1) {
      arr.push({
        value: "objective",
        title: "objective",
      });
    } else if (theoryQ?.length >= 1) {
      arr.push({
        value: "theory",
        title: "theory",
      });
    } else {
      arr.push(
        {
          value: "objective",
          title: "Objective",
        },

        {
          value: "theory",
          title: "Theory",
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
        console.log({ editMark });
        setEditPrompt(false);
      },
      // variant: `${activeTab === "2" ? "" : "outline"}`,
    },
    {
      title: "Yes",
      onClick: () => {
        if (question_type === "objective") {
          // editObjectiveQuestionFxn({
          //   number: editNumber,
          //   change: {
          //     question: editQuestion,
          //     answer: editAnswer,
          //     question_mark: editMark,
          //     option1: editOption1,
          //     option2: editOption2,
          //     option3: editOption3,
          //     option4: editOption4,
          //   },
          // });

          const filter = objectiveQ?.filter(
            (item) => item.question_number !== editNumber
          );

          const findIndex = objectiveQ?.findIndex(
            (item) => item.question_number === editNumber
          );

          if (findIndex !== -1) {
            const newObj = filter?.map((ob) => {
              return {
                ...ob,
                question_mark,
                total_mark,
                total_question,
              };
            });

            setObjectiveQ([
              ...newObj,
              {
                ...objectiveQ[findIndex],
                question: editQuestion,
                answer: editAnswer,
                question_mark,
                option1: editOption1,
                option2: editOption2,
                option3: editOption3,
                option4: editOption4,
                total_question,
                total_mark,
              },
            ]);

            // setObjectiveQ(newObj);
          }
        } else if (question_type === "theory") {
          const filter = theoryQ?.filter(
            (item) => item.question_number !== editNumber
          );

          const findIndex = theoryQ?.findIndex(
            (item) => item.question_number === editNumber
          );

          if (findIndex !== -1) {
            setTheoryQ([
              ...filter,
              {
                ...theoryQ[findIndex],
                question: editQuestion,
                answer: editAnswer,
                question_mark: editMark,
                total_question: editTotalQuestion,
              },
            ]);
          }

          // editTheoryQuestionFxn({
          //   number: editNumber,
          //   change: {
          //     question: editQuestion,
          //     answer: editAnswer,
          //     question_mark: editMark,
          //   },
          // });
        }
        setEditPrompt(false);
      },
      variant: "outline",
    },
  ];

  const totalMark = addQuestionMarks(theoryQ);

  // const finalTheoryArray = updateQuestionNumbers(totalMark);

  // const finalObjectiveArray = updateQuestionNumbers(objectiveQ);
  const finalObjectiveArray =
    objectiveQ?.length !== 1
      ? updateQuestionNumbers(objectiveQ)
      : objectiveQ?.length === 1
      ? objectiveQ
      : [];

  // const finalTheoryArray =
  //   theoryQ?.length !== 1
  //     ? updateQuestionNumbers(theoryQ)
  //     : theoryQ?.length === 1
  //     ? theoryQ
  //     : [];

  useEffect(() => {
    setFinalTheoryArray(
      theoryQ?.length !== 1
        ? updateQuestionNumbers(theoryQ)
        : theoryQ?.length === 1
        ? theoryQ
        : []
    );
  }, [theoryQ]);

  // const finalObjectiveArray = () => {
  //   if (ObjectiveQ?.length !== 1) {
  //     return updateQuestionNumbers(ObjectiveQ);
  //   } else if (ObjectiveQ?.length === 1) {
  //     return ObjectiveQ;
  //   }
  // };

  const allLoading = showLoading || assignmentLoading;

  const activateAddQuestion = () => {
    if (
      (objectiveQ?.length === 0 &&
        theoryQ?.length === 0 &&
        (!subject || !week || !question_type)) ||
      (finalObjectiveArray[finalObjectiveArray?.length - 1]?.total_question !==
        0 &&
        objectiveQ?.length ===
          Number(
            finalObjectiveArray[finalObjectiveArray?.length - 1]?.total_question
          )) ||
      (finalTheoryArray[finalTheoryArray?.length - 1]?.total_question !== 0 &&
        theoryQ?.length ===
          Number(
            finalTheoryArray[finalTheoryArray?.length - 1]?.total_question
          )) ||
      (question_type === "objective" && checkObjectiveQ?.length > 0) ||
      (question_type === "theory" && checkTheoryQ?.length > 0)
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

  // console.log({ ObjectiveQ });
  // console.log({
  //   // cq: completedQuestion() || completedQuestion2(),
  //   // total_question,
  //   ObjectiveQ,
  //   theoryQ,
  // });

  // console.log({
  //   createQuestion,
  // });
  const subs = [
    { value: "Mathematics", title: "Mathematics" },
    { value: "English Language", title: "English Language" },
    { value: "Science", title: "Science" },
    { value: "Social Studies", title: "Social Studies" },
    { value: "Art and Craft", title: "Art and Craft" },
  ];

  console.log({
    createQ,
    subjectsByTeacher,
    objectiveQ,
    theoryQ,
    question_type,
    editQuestion,
    editOption1,
    editOption2,
    editOption3,
    editOption4,
    editNumber,
    editAnswer,
    // classSubjects,
    finalTheoryArray,
    // finalObjectiveArray,
    // ObjectiveQ,
    // theoryQ,
    // totalMark,
  });

  // console.log({ totalMark, editQuestion, editAnswer, editMark, editNumber });
  // console.log({
  //   finalTheoryArray,
  //   finalObjectiveArray,
  //   checkObjectiveQ,
  //   checkTheoryQ,
  //   ObjectiveQ,
  //   theoryQ,
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
                setCreateQ((prev) => {
                  return { ...prev, week: value };
                });
                // updateCreateQuestionFxn({
                //   week: value,
                // });
                // setShowLoading(true);
                // setTimeout(() => {
                //   setShowLoading(false);
                // }, 1500);
                // if (subject !== "" && question_type !== "") {
                //   refetchAssignment();
                // }
              }}
              placeholder='Select Week'
              disabled={objectiveQ?.length >= 1 || theoryQ?.length >= 1}
              wrapperClassName={styles.auth_select}
            />
            {/* subjects */}
            <AuthSelect
              sort
              options={subs}
              value={subject}
              // options={classSubjects}
              // value={subject}
              onChange={({ target: { value } }) => {
                setCreateQ((prev) => {
                  return { ...prev, subject: value };
                });
                // updateCreateQuestionFxn({
                //   subject: value,

                //   subject_id: findSubjectId(value),
                // });
                // setShowLoading(true);
                // setTimeout(() => {
                //   setShowLoading(false);
                // }, 1500);
                // if (week !== "" && question_type !== "") {
                //   refetchAssignment();
                // }
              }}
              placeholder='Select Subject'
              disabled={objectiveQ?.length >= 1 || theoryQ?.length >= 1}
              wrapperClassName={styles.auth_select}
            />
            {/* questionType */}
            <AuthSelect
              sort
              options={sortQuestionType()}
              value={defaultQuestionType()}
              // label="Question Type"
              onChange={({ target: { value } }) => {
                // updateCreateQuestionFxn({ question_type: value, answer: "" });
                // setShowLoading(true);
                // setTimeout(() => {
                //   setShowLoading(false);
                // }, 1500);
                // if (subject !== "" && week !== "") {
                //   refetchAssignment();
                // }
                setCreateQ((prev) => {
                  return { ...prev, question_type: value, answer: "" };
                });
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
                // updateCreateQuestionFxn({
                //   question_number: theoryQ?.length + 1,
                // });
                setCreateQ((prev) => {
                  return {
                    ...prev,
                    question_number: theoryQ?.length + 1,
                  };
                });
              } else if (question_type === "objective") {
                // updateCreateQuestionFxn({
                //   question_number: ObjectiveQ?.length + 1,
                // });
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
              : "Add another Question"}
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
        {/* {!allLoading &&
          objectiveQ?.length === 0 &&
          theoryQ?.length === 0 &&
          checkObjectiveQ?.length === 0 &&
          checkTheoryQ?.length === 0 && (
            <div className={styles.placeholder_container}>
              <HiOutlineDocumentPlus className={styles.icon} />
              <p className={styles.heading}>Create Assignment</p>
            </div>
          )} */}
        {!allLoading &&
          objectiveQ?.length === 0 &&
          theoryQ?.length === 0 &&
          (checkObjectiveQ?.length > 0 || checkTheoryQ?.length > 0) && (
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
            objectiveQ?.length > 0 && (
              <div className={styles.marks_container}>
                <p className={styles.marks_title}>Total Question(s):</p>
                <p className={styles.marks_value}>
                  {objectiveQ?.length} /{" "}
                  {
                    finalObjectiveArray[finalObjectiveArray?.length - 1]
                      ?.total_question
                  }
                </p>
              </div>
            )}
          {question_type === "theory" && theoryQ?.length > 0 && (
            <div className={styles.marks_container}>
              <p className={styles.marks_title}>Total Question(s):</p>
              <p className={styles.marks_value}>
                {theoryQ?.length} /{" "}
                {finalTheoryArray[finalTheoryArray?.length - 1]?.total_question}
              </p>
            </div>
          )}
          {question_type === "objective" && objectiveQ?.length > 0 && (
            <div className={styles.marks_container}>
              <p className={styles.marks_title}>Each Question:</p>
              <p className={styles.marks_value}>
                {
                  finalObjectiveArray[finalObjectiveArray?.length - 1]
                    ?.question_mark
                }{" "}
                mk(s)
              </p>
            </div>
          )}
          {question_type === "objective" && objectiveQ?.length > 0 && (
            <div className={styles.marks_container}>
              <p className={styles.marks_title}>Total Marks:</p>
              <p className={styles.marks_value}>
                {finalObjectiveArray[finalObjectiveArray?.length - 1]
                  ?.question_mark *
                  finalObjectiveArray[finalObjectiveArray?.length - 1]
                    ?.total_question}{" "}
                mk(s)
              </p>
            </div>
          )}
          {question_type === "theory" && theoryQ?.length > 0 && (
            <div className={styles.marks_container}>
              <p className={styles.marks_title}>Total Mark:</p>
              <p className={styles.marks_value}>
                {/* {finalTheoryArray[finalTheoryArray?.length - 1]?.total_mark}{" "} */}
                {theory_total_mark}
                mk(s)
              </p>
            </div>
          )}
        </div>

        <div className={styles.create__questions}>
          {!allLoading &&
            objectiveQ?.length >= 1 &&
            objectiveQ
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
                  <div className='' key={index}>
                    <div
                      className={styles.create__questions_container}
                      key={index}
                      // style={{ width: "300px" }}
                    >
                      <p className='fs-3 mb-3 lh-base'>
                        <span className='fw-bold'>Q{CQ.question_number}.</span>{" "}
                        {CQ.question}{" "}
                       
                      </p> 
                      <p className='fw-bold fs-4 mb-3 lh-base'>({CQ.question_mark} mk(s) )</p>
                      {CQ.image && (
                        <div className='mb-4 '>
                          <img src={CQ.image} width={70} height={70} alt='' />
                        </div>
                      )}
                      {CQ.option1 && (
                        <div className='mb-5 '>
                          <p className='fs-3 mb-3'>
                            {" "}
                            <span className='fw-bold'>A.</span> {CQ.option1}{" "}
                            <span className='fw-bold'>
                              {CQ.answer === CQ.option1 && " (Answer)"}
                            </span>
                          </p>
                          <p className='fs-3 mb-3'>
                            {" "}
                            <span className='fw-bold'>B.</span> {CQ.option2}{" "}
                            <span className='fw-bold'>
                              {CQ.answer === CQ.option2 && " (Answer)"}
                            </span>
                          </p>
                          <p className='fs-3 mb-3'>
                            <span className='fw-bold'>C.</span> {CQ.option3}{" "}
                            <span className='fw-bold'>
                              {CQ.answer === CQ.option3 && " (Answer)"}
                            </span>
                          </p>
                          <p className='fs-3 mb-3'>
                            <span className='fw-bold'>D.</span> {CQ.option4}{" "}
                            <span className='fw-bold'>
                              {CQ.answer === CQ.option4 && " (Answer)"}
                            </span>
                          </p>
                        </div>
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
          {theoryQ?.length >= 1 &&
            theoryQ
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
                // console.log({ CQ });
                return (
                  <div className='' key={index}>
                    <div
                      className={styles.create__questions_container}
                      key={index}
                    >
                      <p className='fs-3 mb-3 lh-base'>
                        <span
                          style={{
                            fontWeight: "bold",
                            // margin: "10px 0px",
                          }}
                        >
                          Q{CQ.question_number}.{/* Q{index + 1}. */}
                        </span>{" "}
                        {CQ.question}
                      </p>
                      {CQ.image && (
                        <div className='mb-4 '>
                          <img src={CQ.image} width={70} height={70} alt='' />
                        </div>
                      )}
                      {
                        <>
                          <p className='fs-3 mb-3 lh-base'>
                            <span className='fw-bold'>Ans -</span> {CQ.answer}
                          </p>
                          <p className='fs-3 mb-4 lh-base fw-bold'>
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
                              setEditQuestion(CQ.question);
                              setEditAnswer(CQ.answer);
                              setEditTotalQuestion(CQ.total_question);
                              setEditMark(CQ.question_mark);
                              setEditNumber(CQ.question_number);
                              setEditOption1(CQ.option1);
                              setEditOption2(CQ.option2);
                              setEditOption3(CQ.option3);
                              setEditOption4(CQ.option4);
                              setEditPrompt(true);
                              // console.log({ editMark, qm: CQ.question_mark });
                            },
                            // variant: `${activeTab === "2" ? "" : "outline"}`,
                          },
                          {
                            title: "Delete",
                            onClick: () => {
                              setEditQuestion(CQ.question);
                              setEditAnswer(CQ.answer);
                              setEditMark(CQ.question_mark);
                              setEditNumber(CQ.question_number);
                              setDeletePrompt(true);
                              // console.log({ editMark, qm: CQ.question_mark });
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

        {!allLoading && (objectiveQ?.length >= 1 || theoryQ?.length >= 1) && (
          <ButtonGroup options={buttonOptions2} />
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
                      // updateObjectiveQMarkFxn({
                      //   newValue: e.target.value,
                      // });
                      // updateCreateQuestionFxn({
                      //   question_mark: e.target.value,
                      //   total_mark: e.target.value * total_question,
                      // });
                      setCreateQ((prev) => ({
                        ...prev,
                        question_mark: Number(e.target.value),
                        total_mark:
                          Number(e.target.value) * Number(total_question),
                      }));
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
              {/* Total Question */}
              <div className='d-flex align-items-center gap-3'>
                <div style={{ width: "100px" }}>
                  <AuthInput
                    type='number'
                    placeholder='Total Question'
                    // hasError={!!errors.username}
                    // defaultValue={CQ.question_mark}
                    min={objectiveQ?.length}
                    value={editTotalQuestion}
                    name='option'
                    onChange={(e) => {
                      setEditTotalQuestion(e.target.value);
                      updateObjectiveTotalQuestionFxn({
                        newValue: e.target.value,
                      });

                      setCreateQ((prev) => ({
                        ...prev,
                        total_question: Number(e.target.value),
                        total_mark:
                          Number(e.target.value) * Number(question_mark),
                      }));
                      // updateCreateQuestionFxn({
                      //   question_mark: e.target.value,
                      //   total_mark: e.target.value * total_question,
                      // });
                    }}
                    style={{
                      fontSize: "16px",
                    }}
                  />
                </div>
                <div className='d-flex align-items-center gap-3 cursor-pointer'>
                  <p className='fs-4'>Total Question</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {question_type === "theory" && (
          <div>
            <p
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              Question
            </p>
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
                      setCreateQ((prev) => ({
                        ...prev,
                        theory_total_mark:
                          Number(theory_total_mark) -
                          Number(editMark) +
                          Number(e.target.value),
                      }));
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
              <div className='d-flex align-items-center gap-3'>
                <div style={{ width: "100px" }}>
                  <AuthInput
                    type='number'
                    placeholder='Total Question'
                    // hasError={!!errors.username}
                    // defaultValue={CQ.question_mark}
                    min={theoryQ?.length}
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
                      fontSize: "14px",
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
