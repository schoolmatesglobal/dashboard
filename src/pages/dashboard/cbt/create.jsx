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
import { useNavigate } from "react-router-dom";
import { useCBT } from "../../../hooks/useCBT";
import { FaComputer } from "react-icons/fa6";

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
    subjectsByTeacher,
  } = useCBT();

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
  const [editPublish, setEditPublish] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [finalTheoryArray, setFinalTheoryArray] = useState([]);
  const [switchArray, setSwitchArray] = useState([]);
  const [newSubjects, setNewSubjects] = useState([]);
  const [allowFetch, setAllowFetch] = useState(true);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [published, setPublished] = useState(false);
  const navigate = useNavigate();

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

  function trigger() {
    setLoading1(true);
    setTimeout(() => {
      setLoading1(false);
    }, 1000);
  }
  function trigger2() {
    setLoading1(true);
    setTimeout(() => {
      setLoading1(false);
    }, 1500);
  }

  //// FETCH ASSIGNMENTS CREATED /////////
  const {
    isLoading: assignmentCreatedLoading,
    data: assignmentCreated,
    isFetching: assignmentCreatedFetching,
    isRefetching: assignmentCreatedRefetching,
    refetch: refetchAssignmentCreated,
  } = useQuery(
    [queryKeys.GET_CREATED_ASSIGNMENT],
    () =>
      apiServices.getAssignment(
        user?.period,
        user?.term,
        user?.session,
        question_type,
        week
      ),
    {
      retry: 2,
      // refetchOnMount: false,
      // refetchOnWindowFocus: false,
      // refetchOnReconnect: false,
      // refetchInterval: false,
      // refetchIntervalInBackground: false,

      // enabled: false,
      enabled: activateRetrieveCreated() && permission?.created,

      select: (data) => {
        const asg = apiServices.formatData(data);

        const filtAsg = asg?.filter((as) => as.subject_id === subject_id) ?? [];

        console.log({ asg, data, filtAsg });
        // const asg2 =  asg?.length > 0 ? [...asg] : [];
        if (question_type === "objective") {
          return filtAsg?.map((ag, i) => {
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
              status: ag?.status,
            };
          });
        } else if (question_type === "theory") {
          return filtAsg?.map((ag, i) => {
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
              status: ag?.status,
            };
          });
          // setTheoryQ(theo);
          // return theo;
        }
      },
      onSuccess(data) {
        if (question_type === "objective") {
          setObjectiveQ(data);
        } else if (question_type === "theory") {
          setTheoryQ(data);
        }
        trigger();
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
          published ? "published" : "unpublished"
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
        publishAssignment({
          term: user?.term,
          period: user?.period,
          session: user?.session,
          question_type,
          week,
          is_publish: published ? 1 : 0,
        });

        refetchAssignmentCreated();
        setClearAllPrompt(false);

        setTimeout(() => {
          refetchAssignmentCreated();
        }, 2000);
        // window.reload();

        // navigate(1);
        // trigger();
        // setTimeout(() => {
        //   refetchAssignmentCreated();
        // }, 500);
        // setTimeout(() => {
        //   refetchAssignmentCreated();
        // }, 1000);
      },
      variant: "outline",
      isLoading: publishAssignmentLoading,
    },
  ];

  const buttonOptions2 = [
    {
      title: `Publish All`,
      onClick: () => {
        setPublished(true);
        setClearAllPrompt(true);
      },
      isLoading: publishAssignmentLoading,
      variant: "success",
    },
    {
      title: `Unpublish All`,
      onClick: () => {
        setPublished(false);
        setClearAllPrompt(true);
      },
      isLoading: publishAssignmentLoading,
      variant: "danger",
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

    // {
    //   value: "theory",
    //   title: "Theory",
    // },
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
              status: editPublish ? "published" : "unpublished",
            },
          ]);
          refetchAssignmentCreated();
          setEditPrompt(false);

          setTimeout(() => {
            refetchAssignmentCreated();
          }, 2000);

          // window.location.reload();
          // trigger2();
          // setTimeout(() => {
          //   refetchAssignmentCreated();
          // }, 2000);
          // setTimeout(() => {
          //   refetchAssignmentCreated();
          // }, 1000);
        } else if (question_type === "theory") {
          editTheoryAssignment({
            id: editQuestionId,
            body: {
              question: editQuestion,
              answer: editAnswer,
              question_number: editNumber,
              question_mark: editMark,
              status: editPublish ? "published" : "unpublished",
            },
          });
          refetchAssignmentCreated();
          setEditPrompt(false);
          // trigger();
          // setTimeout(() => {
          //   refetchAssignmentCreated();
          // }, 500);
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
    showLoading ||
    assignmentCreatedLoading ||
    assignmentCreatedRefetching ||
    assignmentCreatedFetching ||
    loading1 ||
    loading2;

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
    if (subjectsByTeacher?.length > 0) {
      const sbb2 = subjectsByTeacher[0]?.title?.map((sb) => {
        const subId = subjects?.find((ob) => ob.subject === sb.name)?.id;

        return {
          value: subId,
          title: sb?.name,
        };
      });
      setNewSubjects(sbb2);
    } else {
      setNewSubjects([]);
    }
  }, [subjectsByTeacher]);

  useEffect(() => {
    if (activateRetrieveCreated()) {
      refetchAssignmentCreated();
    }
  }, [subject_id, week, question_type]);

  // useEffect(() => {
  //   if (activateRetrieveCreated()) {
  //     refetchAssignmentCreated();
  //   }

  // }, [editObjectiveAssignment]);

  console.log({
    createQ,
    subjectsByTeacher,
    // subjects,
    // newSubjects,
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
            className='w-auto'
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
            <Spinner /> <p className='fs-3'>Loading...</p>
          </div>
        )}

        {/* {!allLoading && question_type === "theory" && theoryQ?.length === 0 && (
          <div className={styles.placeholder_container}>
            <HiOutlineDocumentPlus className={styles.icon} />
            <p className='fs-1 fw-bold mt-3'>Create theory </p>
          </div>
        )} */}
        {!allLoading &&
          question_type === "objective" &&
          objectiveQ?.length === 0 && (
            <div className={styles.placeholder_container}>
              <FaComputer className={styles.icon} />{" "}
              <p className='fs-1 fw-bold mt-3'>Create CBT Objective </p>
            </div>
          )}
        {!allLoading &&
          theoryQ?.length === 0 &&
          objectiveQ?.length === 0 &&
          question_type === "" && (
            <div className={styles.placeholder_container}>
              <FaComputer className={styles.icon} />
              <p className='fs-1 fw-bold mt-3'>No CBT Question</p>
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
                ?.map((CQ, index) => {
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
                        setEditPublish={setEditPublish}
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
                      setEditPublish={setEditPublish}
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
            <div className='w-100 d-flex justify-content-center justify-content-sm-end'>
              <ButtonGroup options={buttonOptions2} />
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

      {/* publish all prompt */}
      <Prompt
        promptHeader={`${published ? "PUBLISH" : "UNPUBLISH"} ALL QUESTIONS`}
        toggle={() => setClearAllPrompt(!clearAllPrompt)}
        isOpen={clearAllPrompt}
        hasGroupedButtons={true}
        groupedButtonProps={clearAllButtons}
      >
        <p className='fs-3 w-100 text-center fw-semibold'>Are you sure?</p>
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
            <p className='fw-bold fs-3 mb-4'>Question Number</p>
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
                    className='fs-3'
                  />
                </div>
              </div>
            </div>

            <p className='fw-bold fs-3 mb-3'>Questions</p>
            <div className='auth-textarea-wrapper'>
              <textarea
                className='form-control fs-3'
                type='text'
                value={editQuestion}
                placeholder='Type the assignment question'
                onChange={(e) => {
                  setEditQuestion(e.target.value);
                }}
                style={{
                  minHeight: "150px",
                  lineHeight: "22px",
                }}
              />
            </div>
            <p className='fw-bold fs-3 my-4'>Options</p>
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
                    className='fs-3'
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
                  <label htmlFor='option-A' className='fs-3'>
                    Correct Answer
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
                    className='fs-3'
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
                  <label htmlFor='option-B' className='fs-3'>
                    Correct Answer
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
                    className='fs-3'
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
                  <label htmlFor='option-C' className='fs-3'>
                    Correct Answer
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
                    className='fs-3'
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
                  <label htmlFor='option-D' className='fs-3'>
                    Correct Answer
                  </label>
                </div>
              </div>
            </div>
            <p className='fw-bold fs-3 mb-4 mt-5'>Mark Computation</p>
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
                    className='fs-3'
                  />
                </div>
                <div className='d-flex align-items-center gap-3 cursor-pointer'>
                  <p className='fs-3'>Question Mark</p>
                </div>
              </div>
            </div>

            <p className='fw-bold fs-3 mb-4 mt-5'>Publish Status</p>
            <div
              className={`d-flex align-items-center gap-3 cursor-pointer ${
                editPublish ? "bg-success" : "bg-danger"
              } py-4 px-3 bg-opacity-10`}
            >
              <input
                type='checkbox'
                name='radio-1'
                className=''
                checked={editPublish}
                id='publishedStatus'
                style={{
                  width: "20px",
                  height: "20px",
                  // color: "green",
                  // borderRadius: "100px",
                }}
                onChange={(e) => setEditPublish((prev) => !prev)}
                value={editPublish}
              />
              <label
                htmlFor='publishedStatus'
                className={`fs-3 ${
                  editPublish ? "text-success" : "text-danger"
                }`}
              >
                {editPublish ? "Published" : "Unpublished"}
              </label>
            </div>
          </div>
        )}
        {question_type === "theory" && (
          <div>
            <p className='fw-bold fs-3 mb-4'>Question Number</p>
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
                    className='fs-3'
                  />
                </div>
              </div>
            </div>
            <p className='fw-bold fs-3 mb-4'>Question</p>
            <div className='auth-textarea-wrapper'>
              <textarea
                className='form-control fs-3'
                type='text'
                value={editQuestion}
                placeholder='Type the assignment question'
                onChange={(e) => {
                  setEditQuestion(e.target.value);
                }}
                style={{
                  minHeight: "150px",
                  lineHeight: "22px",
                }}
              />
            </div>
            <p className='fw-bold fs-3 my-4'>Answer</p>
            <div className='auth-textarea-wrapper'>
              <textarea
                className='form-control fs-3'
                type='text'
                value={editAnswer}
                placeholder='Type the answer to the question'
                onChange={(e) => {
                  setEditAnswer(e.target.value);
                }}
                style={{
                  minHeight: "150px",
                  lineHeight: "22px",
                }}
              />
            </div>
            <p className='fw-bold fs-3 mb-4 mt-5'>Mark Computation</p>
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
                    className='fs-3'
                  />
                </div>
                <div className='d-flex align-items-center gap-3 cursor-pointer'>
                  <p
                    className='fs-3'
                    style={{
                      lineHeight: "18px",
                    }}
                  >
                    Question Mark
                  </p>
                </div>
              </div>
              {/* Total Question */}
            </div>

            <p className='fw-bold fs-3 mb-4 mt-5'>Publish Status</p>
            <div
              className={`d-flex align-items-center gap-3 cursor-pointer ${
                editPublish ? "bg-success" : "bg-danger"
              } py-4 px-3 bg-opacity-10`}
            >
              <input
                type='checkbox'
                name='radio-1'
                className=''
                checked={editPublish}
                id='publishedStatus'
                style={{
                  width: "20px",
                  height: "20px",
                }}
                onChange={(e) => setEditPublish((prev) => !prev)}
                value={editPublish}
              />
              <label
                htmlFor='publishedStatus'
                className={`fs-3 ${
                  editPublish ? "text-success" : "text-danger"
                }`}
              >
                {editPublish ? "Published" : "Unpublished"}
              </label>
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
