import React, { useEffect, useRef, useState } from "react";
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
// import WebViewer from "@pdftron/webviewer";
// import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
// import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

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
  selectedDocs,
  setSelectedDocs,
  base64String,
  setBase64String,
}) => {
  const isDesktop = useMediaQuery({ query: "(min-width: 992px)" });
  const isTablet = useMediaQuery({
    query: "(min-width: 768px, max-width: 991px)",
  });
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const docs = [
    {
      uri: "https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf",
    },
    // {
    //   uri: "https://royalelectronicsgroup.com/wp-content/uploads/2024/05/aaa.docx",
    // },
  ];

  const viewer = useRef(null);
  const beenInitialised = useRef(false);

  const {
    term,
    period,
    session,
    week,
    class_name,
    class_id,
    submitted_by,
    subject_id,
    status,
    topic,
    description,
    // file,
    file_name,
  } = createN;

  const { subjects, isLoading: subjectLoading } = useSubject();

  const [vw, setVW] = useState();

  const {
    classes,
    // checkedSubjects,
    // setCheckedSubjects,
    // isLoading: classLoading,
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
  const [editNumber, setEditNumber] = useState(0);
  const [editSwitchNumber, setEditSwitchNumber] = useState(editNumber ?? 0);
  const [editLessonNoteId, setEditLessonNoteId] = useState("");
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
    if (permission?.create) {
      if (subject_id !== "" && week !== "" && term !== "" && session !== "") {
        return true;
      } else {
        return false;
      }
    } else {
      if (
        subject_id !== "" &&
        week !== "" &&
        term !== "" &&
        session !== "" &&
        class_id !== ""
      ) {
        return true;
      } else {
        return false;
      }
    }
  };

  function trigger(time) {
    setLoading1(true);
    setTimeout(() => {
      setLoading1(false);
    }, time);
  }
  function trigger2() {
    setLoading1(true);
    setTimeout(() => {
      setLoading1(false);
    }, 1000);
  }

  //// FETCH LESSON NOTE CREATED /////////
  const {
    isLoading: lessonNoteCreatedLoading,
    data: lessonNoteCreated,
    isFetching: lessonNoteCreatedFetching,
    isRefetching: lessonNoteCreatedRefetching,
    refetch: refetchLessonNoteCreated,
  } = useQuery(
    [queryKeys.GET_SUBMITTED_LESSON_NOTE],
    () =>
      apiServices.getLessonNoteByClass(
        permission?.create ? user?.class_id : class_id,
        subject_id,
        week,
        term,
        session
      ),
    {
      retry: 1,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: activateRetrieveCreated() && permission?.view,

      select: (data) => {
        const lsg = apiServices.formatData(data);

        const filt = lsg?.filter(
          (ls) => Number(ls?.staff_id) === Number(user?.id)
        );

        // console.log({ data, lsg, filt });

        return permission?.create ? filt : lsg;
      },
      onSuccess(data) {
        setLessonNotes(data);
        trigger(1000);
      },
      onError(err) {
        errorHandler(err);
      },
      // select: apiServices.formatData,
    }
  );

  /////// POST LESSON NOTE ////
  const { mutateAsync: addLessonNote, isLoading: addLessonNoteLoading } =
    useMutation(
      () =>
        apiServices.addLessonNote({
          staff_id: Number(user?.id),
          term,
          session,
          week: Number(week),
          subject_id: Number(subject_id),
          class_id: Number(user?.class_id),
          topic,
          description,
          file: base64String,
          file_name: fileName,
        }),
      // () => apiServices.addObjectiveAssignment(finalObjectiveArray),
      {
        onSuccess() {
          refetchLessonNoteCreated();
          setTimeout(() => {
            setCreateQuestionPrompt(false);
          }, 1000);
          toast.success("Lesson note has been submitted successfully");
        },
        onError(err) {
          apiServices.errorHandler(err);
        },
      }
    );

  //// EDIT LESSON NOTE ////
  const { mutateAsync: editLessonNote, isLoading: editLessonNoteLoading } =
    useMutation(apiServices.editLessonNote, {
      onSuccess() {
        // setAllowFetch(true);
        setTimeout(() => {
          setEditPrompt(false);
        }, 1000);
        refetchLessonNoteCreated();
        toast.success("Lesson Note has been edited successfully");
      },
      onError(err) {
        apiServices.errorHandler(err);
      },
    });

  //// APPROVE LESSON NOTE ////
  const {
    mutateAsync: approveLessonNote,
    isLoading: approveLessonNoteLoading,
  } = useMutation(
    () => apiServices.approveLessonNote({ id: editLessonNoteId }),
    // published ? apiServices.approveLessonNote : apiServices.unApproveLessonNote,
    {
      onSuccess() {
        // setAllowFetch(true);
        refetchLessonNoteCreated();
        toast.success(
          `Lesson Note has been ${
            published ? "approve" : "unapproved"
          } successfully`
        );
      },
      onError(err) {
        apiServices.errorHandler(err);
      },
    }
  );
  //// UNAPPROVE LESSON NOTE ////
  const {
    mutateAsync: unApproveLessonNote,
    isLoading: unApproveLessonNoteLoading,
  } = useMutation(
    () => apiServices.unApproveLessonNote({ id: editLessonNoteId }),
    {
      onSuccess() {
        // setAllowFetch(true);
        refetchLessonNoteCreated();
        toast.success(
          `Lesson Note has been ${
            published ? "approve" : "unapproved"
          } successfully`
        );
      },
      onError(err) {
        apiServices.errorHandler(err);
      },
    }
  );

  //// DELETE LESSON NOTE ////
  const { mutateAsync: deleteLessonNote, isLoading: deleteLessonNoteLoading } =
    useMutation(() => apiServices.deleteLessonNote(editLessonNoteId), {
      onSuccess() {
        refetchLessonNoteCreated();
        setTimeout(() => {
          setDeletePrompt(false);
        }, 1000);
        toast.success("Lesson Note has been deleted successfully");
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
        // published ? apiServices.approveLessonNote : apiServices.unApproveLessonNote

        if (published) {
          approveLessonNote();
          setTimeout(() => {
            setClearAllPrompt(false);
          }, 1000);
        } else {
          unApproveLessonNote();
          setTimeout(() => {
            setClearAllPrompt(false);
          }, 1000);
        }
      },
      variant: "outline",
      isLoading: approveLessonNoteLoading,
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
        deleteLessonNote();

        // setTimeout(() => {
        //   setDeletePrompt(false);
        // }, 1000);
      },
      variant: "outline-danger",
      isLoading: deleteLessonNoteLoading,
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

  // const filterArray = objectiveQ?.filter((obj) => obj.id !== editLessonNoteId);
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
      // isLoading: editLessonNoteLoading,
      onClick: () => {
        // console.log({ editMark });
        setEditPrompt(false);
      },
      // variant: `${activeTab === "2" ? "" : "outline"}`,
    },
    {
      title: "Yes",
      onClick: async () => {
        const newBody = file
          ? {
              topic: editTopic,
              description: editDescription,
              file: base64String,
              file_name: fileName,
            }
          : { topic: editTopic, description: editDescription };

        await editLessonNote({
          id: editLessonNoteId,
          body: newBody,
        });
        // refetchLessonNoteCreated();

        // setTimeout(() => {
        //   setEditPrompt(false);
        // }, 1000);

        // console.log({ newBody, editLessonNoteId });
      },
      variant: "outline",
      isLoading: editLessonNoteLoading,
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

  const allLoading =
    showLoading ||
    lessonNoteCreatedLoading ||
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

  const activateWarning2 = () => {
    if (permission.approve) {
      if (!subject_id || !week || !class_name || !term || !session) {
        return true;
      } else {
        return false;
      }
    } else if (permission.create && lessonNotes?.length > 0) {
      if (
        !subject_id ||
        !week ||
        lessonNotes?.length === 0 ||
        !term ||
        !session
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      if (!subject_id || !week || !class_name || !term || !session) {
        return true;
      } else {
        return false;
      }
    }
  };

  const activateWarning = () => {
    if (!subject_id || !week || !term || !session) {
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
    if (permission?.create) {
      setCreateN((prev) => {
        return {
          ...prev,
          period: user?.period,
          term: user?.term,
          session: user?.session,
        };
      });
    }
  }, []);

  // useEffect(() => {
  //   if (!beenInitialised.current) {
  //     beenInitialised.current = true;
  //     WebViewer(
  //       {
  //         path: "/webviewer/lib",
  //         licenseKey:
  //           "demo:1716458991404:7fdd6d520300000000af47b2350f17b959fd37fbcd16ad6215ba24606b",
  //         initialDoc:
  //           "https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf",
  //       },
  //       viewer.current
  //     ).then((instance) => {
  //       // setVW(instance);
  //     });
  //   }
  // }, []);

  useEffect(() => {
    if (activateRetrieveCreated()) {
      refetchLessonNoteCreated();

      // setCreateN((prev) => {
      //   return {
      //     ...prev,
      //     week: "",
      //     subject_id: "",
      //     status: "UnApproved",
      //     topic: "",
      //     description: "",
      //     file: "",
      //     file_name: "",
      //   };
      // });
    }
    // refetchLessonNoteCreated();
    // trigger(500);
  }, [subject_id, week, term, session, class_id]);

  // const newNote = permission?.create ? lessonNotes : notes2;

  // useEffect(() => {
  //   if (activateRetrieveCreated()) {
  //     refetchAssignmentCreated();
  //   }

  // }, [editLessonNote]);

  // console.log({
  //   lessonNotes,
  //   user,
  //   createN,
  //   subjectsByTeacher,
  //   // subjects,
  //   newSubjects,
  //   permission,
  //   subjects,
  //   activateWarning: activateWarning(),
  //   file,
  //   fileName,
  //   classes,
  // });

  return (
    <>
      <div className=''>
        <div className={styles.create}>
          {/* drop downs */}
          <div className='d-flex flex-column gap-4 flex-md-row flex-grow-1 mb-4'>
            {/* <AuthSelect
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
            /> */}
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
              {!permission?.create && (
                <AuthSelect
                  sort
                  value={class_id}
                  onChange={({ target: { value } }) => {
                    setCreateN((prev) => {
                      return { ...prev, class_id: value };
                    });
                  }}
                  options={(classes || []).map((x) => ({
                    value: x?.id,
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

          {permission.create && (
            <div className='d-flex justify-content-center align-items-cneter'>
              <p className='fs-4  mt-4 text-danger'>
                NB: Lesson Note to be uploaded should be in PDF format
              </p>
            </div>
          )}
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
            (activateWarning() || lessonNotes?.length === 0) && (
              <div className={styles.placeholder_container}>
                <HiOutlineDocumentPlus className={styles.icon} />
                {permission?.create && (
                  <p className='fs-1 fw-bold mt-3'>Create Class Note</p>
                )}
                {!permission?.create && (
                  <p className='fs-1 fw-bold mt-3'>No Class Note</p>
                )}
              </div>
            )}

          {!allLoading && !activateWarning() && lessonNotes?.length !== 0 && (
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
            lessonNotes?.map((nn, i) => {
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
                    setEditFile={setEditFile}
                    setFile={setFile}
                    setEditFileName={setEditFileName}
                    setFileName={setFileName}
                    setEditSubmittedBy={setEditSubmittedBy}
                    setEditStatus={setEditStatus}
                    setEditLessonNoteId={setEditLessonNoteId}
                    notes={nn}
                    handleDownload={handleDownload}
                    setPublished={setPublished}
                    handleViewFile={handleViewFile}
                    iframeUrl={iframeUrl}
                    setIframeUrl={setIframeUrl}
                    selectedDocs={selectedDocs}
                    setSelectedDocs={setSelectedDocs}
                    base64String={base64String}
                    setBase64String={setBase64String}
                    user={user}
                  />
                </div>
              );
            })}

          {/* <div className=''>
            <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} />
          </div> */}
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
          addLessonNote={addLessonNote}
          addLessonNoteLoading={addLessonNoteLoading}
          base64String={base64String}
          setBase64String={setBase64String}
          trigger={trigger}
          refetchLessonNoteCreated={refetchLessonNoteCreated}
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
              fileName={fileName ? fileName : editFileName}
              setFileName={setEditFileName}
              handleReset={handleReset}
              error={error}
              loading={editLessonNoteLoading}
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
      </div>

      {/* <div
        // className='webviewer'
        ref={viewer}
        style={{ height: "100vh" }}
      ></div> */}
    </>
  );
};

export default Create;
