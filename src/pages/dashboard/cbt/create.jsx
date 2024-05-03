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
import PageSheet from "../../../components/common/page-sheet";
import { useLocation } from "react-router-dom";
import { parseDuration, toSentenceCase } from "./constant";
import CreateSettings from "./createSettings";
import GoBack from "../../../components/common/go-back";

const CreateCBT = (
  {
    // createQ,
    // setCreateQ,
    // objectiveQ,
    // theoryQ,
    // setObjectiveQ,
    // setTheoryQ,
    // obj,
    // setObj,
    // objMark,
    // setObjMark,
  }
) => {
  const {
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
    createQuestionPrompt,
    setCreateQuestionPrompt,
    createSettingsPrompt,
    setCreateSettingsPrompt,
    apiServices,
    errorHandler,
    permission,
    user,
    subjectsByTeacher,
  } = useCBT();

  const { state } = useLocation();

  const isDesktop = useMediaQuery({ query: "(max-width: 988px)" });
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
    settings_id,
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

  const [instructioncbt, setInstructioncbt] = useState(createQ?.instruction);
  const [hourcbt, setHourcbt] = useState(createQ?.hour);
  const [minutescbt, setMinutescbt] = useState(createQ?.minute);
  const [markcbt, setMarkcbt] = useState(createQ?.question_mark);

  const [key, setKey] = useState(0);

  const navigate = useNavigate();

  const activateRetrieve = () => {
    if (subject !== "" && question_type !== "" && week !== "") {
      return true;
    } else {
      return false;
    }
  };
  const activateCbt = () => {
    if (subject_id !== "" && question_type !== "") {
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

  const activateRetrieveCbt = () => {
    if (subject_id !== "" && question_type !== "") {
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
    }, 500);
  }

  //// FETCH  CBT QUESTION SETTINGS /////////
  const {
    isLoading: cbtSettingsLoading,
    data: cbtSettings,
    isFetching: cbtSettingsFetching,
    isRefetching: cbtSettingsRefetching,
    refetch: refetchCbtSettings,
  } = useQuery(
    [queryKeys.GET_CBT_SETTINGS],
    () =>
      apiServices.getCbtSetup(
        state?.creds?.period,
        state?.creds?.term,
        state?.creds?.session,
        subject_id,
        question_type
      ),
    {
      retry: 2,
      // refetchOnMount: false,
      // refetchOnWindowFocus: false,
      // refetchOnReconnect: false,
      // refetchInterval: false,
      // refetchIntervalInBackground: false,

      // enabled: false,
      enabled:
        activateRetrieveCbt() &&
        createQ?.instruction != "" &&
        permission?.created,

      select: (data) => {
        // const cbt = data?.data?.attributes;
        // const cbt = apiServices.formatData(data);
        const cbt = {
          ...data?.data?.attributes,
          id: data?.data?.id,
        };

        // const filtCbt = cbt?.filter((as) => as.subject_id === subject_id) ?? [];

        console.log({ data, cbt });

        return cbt ?? {};
      },
      onSuccess(data) {
        if (question_type === "objective") {
          // setObjectiveQ(data);
          setCreateQ((prev) => {
            return {
              ...prev,
              instruction: data?.instruction,
              hour: parseDuration(data?.duration)?.hour,
              minute: parseDuration(data?.duration)?.minutes,
              question_mark: data?.mark,
              settings_id: data?.id,
            };
          });
        } else if (question_type === "theory") {
          // setTheoryQ(data);
        }
        trigger();
        // setAllowFetch(false);
      },
      onError(err) {
        errorHandler(err);
      },
      // select: apiServices.formatData,
    }
  );

  //// FETCH CBT CREATED /////////
  const {
    isLoading: cbtCreatedLoading,
    data: cbtCreated,
    isFetching: cbtCreatedFetching,
    isRefetching: cbtCreatedRefetching,
    refetch: refetchCbtCreated,
  } = useQuery(
    [queryKeys.GET_CBT_CREATED],
    () =>
      apiServices.getAllCbtQuestion(
        state?.creds?.period,
        state?.creds?.term,
        state?.creds?.session,
        subject_id,
        question_type
      ),
    {
      retry: 2,
      // refetchOnMount: false,
      // refetchOnWindowFocus: false,
      // refetchOnReconnect: false,
      // refetchInterval: false,
      // refetchIntervalInBackground: false,

      // enabled: false,
      enabled: activateRetrieveCbt() && permission?.created,

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

  /////// POST CBT QUESTION ////
  const { mutateAsync: addCbtQuestion, isLoading: addCbtQuestionLoading } =
    useMutation(
      () =>
        apiServices.addCbtQuestion(
          // ...objectiveQ,
          {
            term: user?.term,
            period: user?.period,
            session: user?.session,
            question_type,
            question,
            cbt_setting_id: Number(settings_id),
            answer,
            subject_id: Number(subject_id),
            option1,
            option2,
            option3,
            option4,
            // total_question: Number(total_question),
            // total_mark: Number(total_mark),
            question_mark: createQ?.question_mark,
            question_number: Number(question_number),
          }
        ),
      // () => apiServices.addObjectiveAssignment(finalObjectiveArray),
      {
        onSuccess() {
          refetchCbtCreated();
          toast.success("Objective assignment has been created successfully");
        },
        onError(err) {
          apiServices.errorHandler(err);
        },
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
        refetchCbtCreated();
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
        refetchCbtCreated();
        toast.success("Theory assignment has been created successfully");
      },
      onError(err) {
        apiServices.errorHandler(err);
      },
    }
  );

  //// EDIT OBJECTIVE ASSIGNMENT ////
  const { mutateAsync: editCbtQuestion, isLoading: editCbtQuestionLoading } =
    useMutation(apiServices.editCbtQuestion, {
      onSuccess() {
        setAllowFetch(true);
        refetchCbtCreated();
        toast.success("CBT question has been edited successfully");
      },
      onError(err) {
        apiServices.errorHandler(err);
      },
    });

  //// PUBLISH ASSIGNMENT ////
  const { mutateAsync: publishCbt, isLoading: publishCbtLoading } = useMutation(
    apiServices.publishCbt,
    {
      onSuccess() {
        setAllowFetch(true);
        refetchCbtCreated();
        toast.success(
          `Assignment has been ${
            published ? "published" : "unpublished"
          } successfully`
        );
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
  } = useMutation(apiServices.editTheoryAssignment, {
    onSuccess() {
      refetchCbtCreated();
      toast.success("theory question has been edited successfully");
    },
    onError(err) {
      apiServices.errorHandler(err);
    },
  });

  //// DELETE CBT QUESTION ////
  const {
    mutateAsync: deleteCbtQuestion,
    isLoading: deleteCbtQuestionLoading,
  } = useMutation(() => apiServices.deleteCbtQuestion(editQuestionId), {
    onSuccess() {
      refetchCbtCreated();
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
        publishCbt({
          term: user?.term,
          period: user?.period,
          session: user?.session,
          question_type,
          subject_id: subject_id,
          is_publish: published ? 1 : 0,
        });

        refetchCbtCreated();
        setClearAllPrompt(false);

        setTimeout(() => {
          refetchCbtCreated();
        }, 2000);
        // window.reload();

        // navigate(1);
        // trigger();
        // setTimeout(() => {
        //   refetchCbtCreated();
        // }, 500);
        // setTimeout(() => {
        //   refetchCbtCreated();
        // }, 1000);
      },
      variant: "outline",
      isLoading: publishCbtLoading,
    },
  ];

  const buttonOptions2 = [
    {
      title: `Publish All`,
      onClick: () => {
        setPublished(true);
        setClearAllPrompt(true);
      },
      isLoading: publishCbtLoading,
      variant: "success",
    },
    {
      title: `Unpublish All`,
      onClick: () => {
        setPublished(false);
        setClearAllPrompt(true);
      },
      isLoading: publishCbtLoading,
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
          deleteCbtQuestion();

          setTimeout(() => {
            setDeletePrompt(false);
          }, 1000);
        } else if (question_type === "theory") {
          deleteCbtQuestion();

          setTimeout(() => {
            setDeletePrompt(false);
          }, 1000);
        }
      },
      variant: "outline-danger",
      isLoading: deleteCbtQuestionLoading,
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
          editCbtQuestion({
            id: editQuestionId,
            body: {
              question: editQuestion,
              option1: editOption1,
              option2: editOption2,
              option3: editOption3,
              option4: editOption4,
              answer: editAnswer,
              question_mark: createQ?.question_mark,
              // question_mark: editMark,
              question_number: editNumber,
              status: editPublish ? "published" : "unpublished",
            },
          });
          //   editCbtQuestion(
          //     {
          //     id: editQuestionId,
          //     body: {
          //       question: "",
          //       option1: "",
          //       option2: "",
          //       option3: "",
          //       option4: "",
          //       answer: "",
          //       question_mark: "",
          //       question_number: ""
          //     },
          //   }
          // );
          refetchCbtCreated();
          setEditPrompt(false);

          setTimeout(() => {
            refetchCbtCreated();
          }, 2000);

          // window.location.reload();
          // trigger2();
          // setTimeout(() => {
          //   refetchCbtCreated();
          // }, 2000);
          // setTimeout(() => {
          //   refetchCbtCreated();
          // }, 1000);
        } else if (question_type === "theory") {
          editTheoryAssignment();
          //   {
          //   id: editQuestionId,
          //   body: {
          //     question: editQuestion,
          //     answer: editAnswer,
          //     question_number: editNumber,
          //     question_mark: editMark,
          //     status: editPublish ? "published" : "unpublished",
          //   },
          // }
          refetchCbtCreated();
          setEditPrompt(false);
          // trigger();
          // setTimeout(() => {
          //   refetchCbtCreated();
          // }, 500);
        }
      },
      variant: "outline",
      isLoading: editCbtQuestionLoading || editTheoryAssignmentLoading,
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
    cbtCreatedLoading ||
    cbtSettingsLoading ||
    cbtCreatedRefetching ||
    cbtCreatedFetching ||
    loading1 ||
    loading2;

  const activateAddSettings = () => {
    if (!subject_id || !question_type) {
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

  const SettingsAdded = () => {
    if (
      createQ.instruction &&
      createQ.hour >= 0 &&
      createQ.minute &&
      createQ.question_mark
    ) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (activateRetrieveCbt()) {
      refetchCbtCreated();
      trigger();
    }
    if (activateRetrieveCbt()) {
      refetchCbtSettings();
      trigger();
    }
  }, [subject_id, question_type]);

  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [published]);

  console.log({
    cbtSettings,
    createQ,
    objectiveQ,
    subject_id,
    SettingsAdded: SettingsAdded(),
    // subjectsByTeacher,
    state,
    // subjects,
    // newSubjects,
  });

  return (
    <div className=''>
      <GoBack />
      <PageSheet>
        <div key={key} className={styles.create}>
          {/* drop downs */}
          <div className='d-flex align-items-center justify-content-center mb-4'>
            <p className='fw-bold fs-4'>
              {/* CBT {toSentenceCase(state?.creds?.question_type)} |{" "} */}
              {state?.creds?.period} | {state?.creds?.term} |{" "}
              {state?.creds?.session}
            </p>
          </div>
          <div className='d-flex flex-column flex-lg-row align-items-center  gap-4'>
            <div
              className={`d-flex align-items-center flex-grow-1 gap-3 ${
                isDesktop && "w-100"
              }`}
            >
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
                wrapperClassName=''
              />
            </div>
            <div className='d-flex gap-3 justify-content-center'>
              <Button
                variant=''
                className='w-auto flex-shrink-0'
                onClick={() => {
                  setCreateSettingsPrompt(true);
                  setInstructioncbt(createQ?.instruction);
                  setHourcbt(createQ?.hour);
                  setMinutescbt(createQ?.minute);
                  setMarkcbt(createQ?.question_mark);
                }}
                disabled={activateAddSettings()}
              >
                CBT Settings
              </Button>
              <Button
                variant=''
                className='w-auto flex-shrink-0'
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
                disabled={!SettingsAdded()}
              >
                {objectiveQ?.length === 0 && theoryQ?.length === 0
                  ? "Add Question"
                  : "Add Question"}
              </Button>
            </div>
          </div>
          {!SettingsAdded() && (
            <div className='d-flex justify-content-center align-items-cneter'>
              <p className='fs-4  mt-4 text-danger'>
                NB: Setup CBT settings before adding questions{" "}
              </p>
            </div>
          )}
          {!allLoading && SettingsAdded() && (
            <MarkCard
              allLoading={allLoading}
              question_type={question_type}
              objectiveQ={objectiveQ}
              theoryQ={theoryQ}
              published={published}
              createQ={createQ}
            />
          )}
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
          {!allLoading &&
            theoryQ?.length >= 1 &&
            question_type === "theory" && (
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
          state={state?.creds}
          createQ={createQ}
          setCreateQ={setCreateQ}
          objectiveQ={objectiveQ}
          setObjectiveQ={setObjectiveQ}
          theoryQ={theoryQ}
          setTheoryQ={setTheoryQ}
          obj={obj}
          setObj={setObj}
          addCbtQuestion={addCbtQuestion}
          addCbtQuestionLoading={addCbtQuestionLoading}
          addTheoryAssignments={addTheoryAssignments}
          addTheoryAssignmentLoading={addTheoryAssignmentLoading}
          allowFetch={allowFetch}
          setAllowFetch={setAllowFetch}
          refetchCbtCreated={refetchCbtCreated}
          objMark={objMark}
          setObjMark={setObjMark}
        />
        <CreateSettings
          createQuestionPrompt={createSettingsPrompt}
          setCreateQuestionPrompt={setCreateSettingsPrompt}
          state={state?.creds}
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
          refetchCbtCreated={refetchCbtCreated}
          objMark={objMark}
          setObjMark={setObjMark}
          instructioncbt={instructioncbt}
          setInstructioncbt={setInstructioncbt}
          hourcbt={hourcbt}
          setHourcbt={setHourcbt}
          minutescbt={minutescbt}
          setMinutescbt={setMinutescbt}
          markcbt={markcbt}
          setMarkcbt={setMarkcbt}
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
              {/* <p className='fw-bold fs-3 mb-4 mt-5'>Mark Computation</p>
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
              </div> */}
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
      </PageSheet>
    </div>
  );
};

export default CreateCBT;
