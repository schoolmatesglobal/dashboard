import React, { useEffect, useState } from "react";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import CreateQuestion from "./createNote";
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
import ObjectiveViewCard from "./createdNoteCard";
import TheoryViewCard from "./theoryViewCard";
import MarkCard from "./noteCard";
import { useMediaQuery } from "react-responsive";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CreateNote from "./createNote";
import CustomTable from "../../../components/tables/table";
import PageTitle from "../../../components/common/title";
import PaginationComponent from "../../../components/tables/pagination";
import CreateNoteCard from "./createdNoteCard";
import NoteCard from "./noteCard";
import { useClasses } from "../../../hooks/useClasses";
import { useLessonNote } from "../../../hooks/useLessonNote";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import CustomFileInput2 from "../../../components/inputs/CustomFileInput2";
import { useAcademicSession } from "../../../hooks/useAcademicSession";

const Create = ({
  createN,
  setCreateN,
  createQuestionPrompt,
  setCreateQuestionPrompt,
  apiServices,
  errorHandler,
  permission,
  user,
  subjectsByTeacher,
  lessonNotes,
  setLessonNotes,
  error,
  setError,
  handleFileChange,
  handleReset,
  file,
  setFile,
  fileName,
  setFileName,
  handleDownload,
  handleViewFile,
  iframeUrl,
  setIframeUrl,
}) => {
  const isDesktop = useMediaQuery({ query: "(min-width: 992px)" });
  const isTablet = useMediaQuery({
    query: "(min-width: 768px, max-width: 991px)",
  });
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const {
    term,
    period,
    session,
    week,
    class_name,
    submitted_by,
    subject_id,
    status,
    topic,
    description,
    // file,
    file_name,
  } = createN;

  const { subjects, isLoading: subjectLoading } = useSubject();

  const {
    classes,
    // checkedSubjects,
    setCheckedSubjects,
    isLoading: classLoading,
    // subjectData2,
    // subjects: subjectsByClass,
    // subjectsByClass2,
  } = useClasses();

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
  const [editTopic, setEditTopic] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editFile, setEditFile] = useState("");
  const [editFileName, setEditFileName] = useState("");
  const [editSubmittedBy, setEditSubmittedBy] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [finalTheoryArray, setFinalTheoryArray] = useState([]);
  const [switchArray, setSwitchArray] = useState([]);
  const [newSubjects, setNewSubjects] = useState([]);
  const [allowFetch, setAllowFetch] = useState(true);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [published, setPublished] = useState(false);
  const navigate = useNavigate();

  const { data: sessions } = useAcademicSession();

  const question_type = "objective";

  const activateRetrieve = () => {
    if (subject_id !== "" && week !== "") {
      return true;
    } else {
      return false;
    }
  };

  const activateRetrieveCreated = () => {
    if (subject_id !== "" && week !== "") {
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
      enabled: activateRetrieveCreated() && permission?.view,

      select: (data) => {
        const asg = apiServices.formatData(data);

        const filtAsg = asg?.filter((as) => as.subject_id === subject_id) ?? [];

        console.log({ asg, data, filtAsg });
      },
      onSuccess(data) {
        if (question_type === "objective") {
          // setObjectiveQ(data);
        } else if (question_type === "theory") {
          // setTheoryQ(data);
        }
        // trigger();
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
          question: "",
          answer: "",
          subject_id: Number(subject_id),
          option1: "",
          option2: "",
          option3: "",
          option4: "",
          total_question: "",
          total_mark: "",
          question_mark: "",
          question_number: "",
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
          question: "",
          answer: "",
          subject_id: Number(subject_id),
          image: "",
          total_question: "",
          total_mark: "",
          question_mark: "",
          question_number: "",
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
        // publishAssignment({
        //   term: user?.term,
        //   period: user?.period,
        //   session: user?.session,
        //   question_type,
        //   week,
        //   is_publish: published ? 1 : 0,
        // });
        // refetchAssignmentCreated();
        // setClearAllPrompt(false);
        // setTimeout(() => {
        //   refetchAssignmentCreated();
        // }, 2000);
      },
      variant: "outline",
      isLoading: publishAssignmentLoading,
    },
  ];

  const buttonOptions2 = [
    {
      title: `Save`,
      onClick: () => {
        setPublished(true);
        setClearAllPrompt(true);
      },
      isLoading: publishAssignmentLoading,
      variant: "success",
    },
    {
      title: `Submit`,
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

    {
      value: "theory",
      title: "Theory",
    },
  ];

  // const filterArray = objectiveQ?.filter((obj) => obj.id !== editQuestionId);
  //
  // const newArray = filterArray?.map((obj) => {
  //   return {
  //     ...obj,
  //     question_mark: editMark,
  //   };
  // });

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
        // setLessonNotes((prev) => [
        //   ...prev,
        //   { ...createN, file_name: fileName, file },
        // ]);
        setEditPrompt(false);
      },
      variant: "outline",
      isLoading: editObjectiveAssignmentLoading || editTheoryAssignmentLoading,
      // disabled:
      //   question_type === "objective"
      //     ? !editQuestion ||
      //       !editAnswer ||
      //       !editOption1 ||
      //       !editOption2 ||
      //       !editOption3 ||
      //       !editOption4 ||
      //       !editMark
      //     : question_type === "theory"
      //     ? !editQuestion || !editAnswer || !editMark
      //     : false,
    },
  ];

  const notes = [
    {
      status: "Approved",
      topic: "Quadratic Equation",
      description:
        "A beginner's approach to solving quadratic equations, covering fundamental concepts, methods of solving, and practical applications in various fields.",
      file_name: "Week_1_Quadratic.doc",
      submitted_by: "Jane Obi",
    },
    {
      status: "UnApproved",
      topic: "Linear Equations",
      description:
        "An introduction to linear equations, including graphing, solving systems of linear equations, and exploring their significance in different contexts.",
      file_name: "Week_2_Linear.pdf",
      submitted_by: "Jane Obi",
    },
  ];

  const notes2 = [
    {
      status: "Approved",
      topic: "Quadratic Equation",
      description:
        "A beginner's approach to solving quadratic equations, covering fundamental concepts, methods of solving, and practical applications in various fields.",
      file_name: "Week_1_Quadratic.doc",
      submitted_by: "Jane Obi",
    },
    {
      status: "UnApproved",
      topic: "Linear Equations",
      description:
        "An introduction to linear equations, including graphing, solving systems of linear equations, and exploring their significance in different contexts.",
      file_name: "Week_2_Linear.pdf",
      submitted_by: "John Doe",
    },
    {
      status: "UnApproved",
      topic: "Polynomials",
      description:
        "A comprehensive guide to polynomials, detailing types of polynomials, operations, theorems, and their real-world applications in engineering and physics.",
      file_name: "Week_3_Polynomials.ppt",
      submitted_by: "Alice Smith",
    },
    {
      status: "Approved",
      topic: "Calculus",
      description:
        "An overview of calculus, focusing on limits, derivatives, integrals, and their use in solving complex problems in mathematics and science.",
      file_name: "Week_4_Calculus.xls",
      submitted_by: "Bob Johnson",
    },
  ];

  const allLoading =
    showLoading ||
    // assignmentCreatedLoading ||
    // assignmentCreatedRefetching ||
    // assignmentCreatedFetching ||
    loading1 ||
    loading2;

  const activateAddQuestion = () => {
    if (!subject_id || !week) {
      return true;
    } else {
      return false;
    }
  };

  const activateWarning = () => {
    if (permission.approve) {
      if (!subject_id || !week || !class_name) {
        return true;
      } else {
        return false;
      }
    } else if (permission.create && lessonNotes?.length > 0) {
      if (!subject_id || !week || lessonNotes?.length === 0) {
        return true;
      } else {
        return false;
      }
    } else {
      if (!subject_id || !week || !class_name) {
        return true;
      } else {
        return false;
      }
    }
  };

  const activateWarning2 = () => {
    if (!subject_id || !week || !class_name) {
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

  const periods = [
    { value: "First Half", title: "First Half / Mid Term" },
    { value: "Second Half", title: "Second Half / End of Term" },
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
  }, [subjectsByTeacher, subjects]);

  useEffect(() => {
    setCreateN((prev) => {
      return {
        ...prev,
        period: user?.period,
        term: user?.term,
        session: user?.session,
      };
    });
  }, []);

  // useEffect(() => {
  //   if (activateRetrieveCreated()) {
  //     refetchAssignmentCreated();

  //     // setCreateN((prev) => {
  //     //   return {
  //     //     ...prev,
  //     //     week: "",
  //     //     subject_id: "",
  //     //     status: "UnApproved",
  //     //     topic: "",
  //     //     description: "",
  //     //     file: "",
  //     //     file_name: "",
  //     //   };
  //     // });
  //   }
  //   // refetchAssignmentCreated();
  //   // setLoading1(true);
  //   // setTimeout(() => {
  //   //   setLoading1(false);
  //   // }, 700);
  // }, [subject_id, week, class_name]);

  const newNote = permission?.create ? lessonNotes : notes2;

  // useEffect(() => {
  //   if (activateRetrieveCreated()) {
  //     refetchAssignmentCreated();
  //   }

  // }, [editObjectiveAssignment]);

  console.log({
    // unPublishedAssignment,
    // activateRetrieveCreated: activateRetrieveCreated(),
    // assignmentCreatedFetching,
    // assignmentCreatedRefetching,
    // published,

    // objectiveQ,
    // theoryQ,
    user,
    createN,
    subjectsByTeacher,
    // subjects,
    newSubjects,
    permission,
    subjects,
    activateWarning: activateWarning(),
  });

  return (
    <>
      <div className={styles.create}>
        {/* drop downs */}
        <div className='d-flex flex-column gap-4 flex-md-row flex-grow-1 mb-4'>
          <AuthSelect
            // label='Period'
            sort
            value={createN.period}
            name='period'
            onChange={({ target: { value } }) => {
              setCreateN((prev) => {
                return { ...prev, period: value };
              });
            }}
            options={periods}
            placeholder='Select Period'
            wrapperClassName='w-100'
          />
          <AuthSelect
            // label='Period'
            sort
            value={createN.term}
            name='term'
            onChange={({ target: { value } }) => {
              setCreateN((prev) => {
                return { ...prev, term: value };
              });
            }}
            options={[
              { value: "First Term", title: "First Term" },
              { value: "Second Term", title: "Second Term" },
              { value: "Third Term", title: "Third Term" },
            ]}
            placeholder='Select Term'
            wrapperClassName='w-100'
          />
          <AuthSelect
            // label='Period'
            sort
            value={createN.session}
            name='session'
            onChange={({ target: { value } }) => {
              setCreateN((prev) => {
                return { ...prev, session: value };
              });
            }}
            options={(sessions || [])?.map((session) => ({
              value: session?.academic_session,
              title: session?.academic_session,
            }))}
            placeholder='Select Session'
            wrapperClassName='w-100'
          />
        </div>
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
                { value: "14", title: "Week 14" },
              ]}
              value={week}
              onChange={({ target: { value } }) => {
                setCreateN((prev) => {
                  return { ...prev, week: value };
                });
              }}
              placeholder='Select Week'
              wrapperClassName='w-100'
            />
            {/* subjects */}
            <AuthSelect
              sort
              options={
                permission.create
                  ? newSubjects
                  : subjects?.map((x) => ({
                      value: x?.id,
                      title: x?.subject,
                    }))
              }
              value={subject_id}
              onChange={({ target: { value } }) => {
                setCreateN((prev) => {
                  return { ...prev, subject_id: value };
                });
              }}
              placeholder='Select Subject'
              wrapperClassName='w-100'
            />
            {/* class name */}
            {permission?.approve && (
              <AuthSelect
                sort
                value={class_name}
                onChange={({ target: { value } }) => {
                  setCreateN((prev) => {
                    return { ...prev, class_name: value };
                  });
                }}
                options={(classes || []).map((x) => ({
                  value: x?.class_name,
                  title: x?.class_name,
                }))}
                placeholder='Select Class'
                wrapperClassName='w-100'
              />
            )}
          </div>

          {permission?.create && (
            <Button
              variant=''
              className='w-auto'
              onClick={() => {
                setCreateN((prev) => {
                  return { ...prev, topic: "", description: "" };
                });
                setFile(null);
                setFileName("");
                setCreateQuestionPrompt(true);
              }}
              disabled={activateAddQuestion()}
            >
              Add Note
            </Button>
          )}
        </div>

        {allLoading && (
          <div className={styles.spinner_container}>
            <Spinner /> <p className='fs-3'>Loading...</p>
          </div>
        )}

        {/* {!allLoading && question_type === "theory" && theoryQ?.length === 0 && (
          <div className={styles.placeholder_container}>
            <HiOutlineDocumentPlus className={styles.icon} />
            <p className='fs-1 fw-bold mt-3'>Create theory Assignment</p>
          </div>
        )}
        {!allLoading &&
          question_type === "objective" &&
          objectiveQ?.length === 0 && (
            <div className={styles.placeholder_container}>
              <HiOutlineDocumentPlus className={styles.icon} />
              <p className='fs-1 fw-bold mt-3'>Create Objective Assignment</p>
            </div>
          )} */}

        {!allLoading &&
          // theoryQ?.length === 0 &&
          // objectiveQ?.length === 0 &&
          activateWarning() &&
          lessonNotes?.length === 0 && (
            <div className={styles.placeholder_container}>
              <HiOutlineDocumentPlus className={styles.icon} />
              <p className='fs-1 fw-bold mt-3'>Create Lesson Note</p>
            </div>
          )}

        {!allLoading && !activateWarning() && (
          <NoteCard
            allLoading={allLoading}
            // question_type={question_type}
            // objectiveQ={objectiveQ}
            // theoryQ={theoryQ}
            published={published}
            createQ={createN}
            subjects={subjects}
          />
        )}

        {!allLoading &&
          !activateWarning() &&
          newNote?.map((nn, i) => {
            return (
              <div className='mb-5' key={i}>
                <CreateNoteCard
                  setCreateN={setCreateN}
                  permission={permission}
                  setEditPrompt={setEditPrompt}
                  setClearAllPrompt={setClearAllPrompt}
                  setDeletePrompt={setDeletePrompt}
                  setEditTopic={setEditTopic}
                  setEditDescription={setEditDescription}
                  setEditFile={setFile}
                  setEditFileName={setFileName}
                  setEditSubmittedBy={setEditSubmittedBy}
                  setEditStatus={setEditStatus}
                  notes={nn}
                  handleDownload={handleDownload}
                  setPublished={setPublished}
                  handleViewFile={handleViewFile}
                  iframeUrl={iframeUrl}
                  setIframeUrl={setIframeUrl}
                />
              </div>
            );
          })}

        {/* {!allLoading &&
          ((question_type === "objective" && objectiveQ?.length !== 0) ||
            (question_type === "theory" && theoryQ?.length !== 0)) && (
            <div className='w-100 d-flex justify-content-center justify-content-sm-end'>
              <ButtonGroup options={buttonOptions2} />
            </div>
          )} */}
      </div>
      <CreateNote
        createQ={createN}
        setCreateQ={setCreateN}
        createQuestionPrompt={createQuestionPrompt}
        setCreateQuestionPrompt={setCreateQuestionPrompt}
        apiServices={apiServices}
        errorHandler={errorHandler}
        permission={permission}
        user={user}
        subjectsByTeacher={subjectsByTeacher}
        lessonNotes={lessonNotes}
        setLessonNotes={setLessonNotes}
        subjects={subjects}
        error={error}
        setError={setError}
        handleFileChange={handleFileChange}
        handleReset={handleReset}
        file={file}
        setFile={setFile}
        fileName={fileName}
        setFileName={setFileName}
      />

      {/* publish all prompt */}
      <Prompt
        promptHeader={`${published ? "APPROVE" : "UNAPPROVE"} LESSON NOTE`}
        toggle={() => setClearAllPrompt(!clearAllPrompt)}
        isOpen={clearAllPrompt}
        hasGroupedButtons={true}
        groupedButtonProps={clearAllButtons}
      >
        <p className='fs-3 w-100 text-center fw-semibold'>Are you sure?</p>
      </Prompt>

      {/* Edit question prompt */}
      <Prompt
        promptHeader={`LESSON NOTE EDIT`}
        toggle={() => setEditPrompt(!editPrompt)}
        isOpen={editPrompt}
        hasGroupedButtons={true}
        groupedButtonProps={editButtons}
      >
        <>
          <p className='fs-3 fw-bold mb-4'>Topic</p>
          <div className='auth-textarea-wrapper'>
            <textarea
              className='form-control fs-3 lh-base'
              type='text'
              value={editTopic}
              placeholder='Type the title of the lesson note'
              onChange={(e) => setEditTopic(e.target.value)}
              style={{
                minHeight: "100px",
              }}
            />
          </div>
          <p className='fs-3 fw-bold my-4'>Description</p>
          <div className='auth-textarea-wrapper'>
            <textarea
              className='form-control fs-3 lh-base'
              type='text'
              value={editDescription}
              placeholder='Type the description of the lesson note'
              onChange={(e) => setEditDescription(e.target.value)}
              style={{
                minHeight: "200px",
              }}
            />
          </div>
          <p className='fs-3 fw-bold my-4'>File Upload</p>
          <CustomFileInput2
            handleFileChange={handleFileChange}
            fileName={fileName}
            handleReset={handleReset}
            error={error}
          />
        </>
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
          Are you sure you want to delete this Note?
        </p>
      </Prompt>
    </>
  );
};

export default Create;
