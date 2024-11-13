import {
  faChartSimple,
  faDownload,
  faEye,
  faPen,
  faScroll,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useForm } from "react-formid";
import { useNavigate } from "react-router-dom";
import { ResultIcon } from "../../../assets/svgs";
import { CBTIcon } from "../../../assets/svgs";
import AuthSelect from "../../../components/inputs/auth-select";
import Prompt from "../../../components/modals/prompt";
import PageView from "../../../components/views/table-view";
import { useAppContext } from "../../../hooks/useAppContext";
import { useCBT } from "../../../hooks/useCBT";
import { useStudentCBT } from "../../../hooks/useStudentCBT";
import { useSubject } from "../../../hooks/useSubjects";
import { useMediaQuery } from "react-responsive";
import { useAcademicSession } from "../../../hooks/useAcademicSession";
// import Performances2 from "./performances/students";

const CBTPage = () => {
  const {
    user,

    // activeTab,
    // setActiveTab,
    createQ,
    setCreateQ,
    objectiveQ,
    theoryQ,
    setObjectiveQ,
    setTheoryQ,
    obj,
    setObj,
    permission,
    objMark,
    setObjMark,
    answerQ,
    setAnswerQ,

    answeredObjQ,
    setAnsweredObjQ,
    answeredTheoQ,
    setAnsweredTheoQ,

    markedObjQ,
    setMarkedObjQ,
    markedTheoQ,
    setMarkedTheoQ,

    markedTheoQ2,
    setMarkedTheoQ2,

    markedQ,
    setMarkedQ,

    performanceQ,
    setPerformanceQ,

    answeredObjResults,
    setAnsweredObjResults,
    answeredTheoryResults,
    setAnsweredTheoryResults,

    submissionTab,
    setSubmissionTab,
    ResultTab,
    setResultTab,
    subjectsByTeacher,
  } = useCBT();

  const [newSubjects, setNewSubjects] = useState([]);

  const {
    objectiveQ2,
    setObjectiveQ2,
    theoryQ2,
    setTheoryQ2,
    createQ2,
    setCreateQ2,

    answeredObjectiveQ,
    setAnsweredObjectiveQ,

    answeredTheoryQ,
    setAnsweredTheoryQ,

    studentSubjectsLoading,
    refetchStudentSubjectsLoading,
    studentSubjects,

    assignmentTab,
    setAssignmentTab,

    objectiveSubmitted,
    setObjectiveSubmitted,

    theorySubmitted,
    setTheorySubmitted,
  } = useStudentCBT();

  const {
    isOpen: sideBarIsOpen,
    toggle: toggleSideBar,
    closeSidebar,
    openSidebar,
    close,
    hideAllBars,
    setHideAllBars,
  } = useAppContext();

  const { data: sessions } = useAcademicSession();

  const { inputs, errors, handleChange } = useForm({
    defaultValues: {
      assessment: "First Assessment",
      period: "First Half",
      term: "First Term",
      subject: "",
      subjectId: "",
      question_type: "",
      session: sessions?.length > 0 && sessions[0]?.academic_session,
      class_name: "",
    },
    // validation: {
    //   class_name: {
    //     required: user?.designation_name === "Principal",
    //   },
    // },
  });

  const { subjects } = useSubject();

  const [clearAllPrompt, setClearAllPrompt] = useState(false);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("");
  const [modalPrompt, setModalPrompt] = useState(false);
  const [promptStatus, setPromptStatus] = useState("compute");

  const [isPlaying, setIsPlaying] = useState(false);
  const [showWarning, setShowWarning] = useState(true);
  const [testEnded, setTestEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [secondleft, setSecondLeft] = useState(null);
  const [hourLeft, setHourLeft] = useState(null);
  const [day, setDay] = useState(0);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(3);

  const activateContinue = () => {
    if (
      !createQ.period ||
      !createQ.term ||
      !createQ.session
      // !createQ.subject_id ||
      // !createQ.question_type
    ) {
      return true;
    } else {
      return false;
    }
  };

  const displayPrompt = (status) => {
    setModalPrompt(true);
    // setActiveTab(status);
    setPromptStatus(status);
  };

  const getToggleButtons = () => {
    let arr = [];

    if (permission?.view) {
      arr.push({
        title: (
          <>
            <FontAwesomeIcon icon={faEye} /> View
          </>
        ),
        onClick: () => displayPrompt("view"),
        variant: "outline",
        // variant: `${activeTab === "5" ? "" : "outline"}`,
      });
    }

    if (permission?.create) {
      arr.push({
        title: (
          <>
            <FontAwesomeIcon icon={faPen} /> Create
          </>
        ),
        onClick: () => displayPrompt("create"),
        variant: "outline",
      });
    }
    if (permission?.submissions) {
      arr.push({
        title: (
          <>
            <FontAwesomeIcon icon={faDownload} /> Submission
          </>
        ),
        onClick: () => displayPrompt("submission"),
        variant: "outline",
      });
    }
    if (permission?.results) {
      arr.push({
        title: (
          <>
            <FontAwesomeIcon icon={faScroll} /> Results
          </>
        ),
        onClick: () => displayPrompt("results"),
        variant: "outline",
      });
    }
    if (permission?.student_results) {
      arr.push({
        title: (
          <>
            <FontAwesomeIcon icon={faScroll} /> Results
          </>
        ),
        onClick: () => displayPrompt("studentResult"),
        variant: "outline",
      });
    }
    if (permission?.performances) {
      arr.push({
        title: (
          <>
            <FontAwesomeIcon icon={faChartSimple} /> Performance
          </>
        ),
        onClick: () => displayPrompt("performance"),
        variant: "outline",
      });
    }
    if (permission?.student_performances) {
      arr.push({
        title: (
          <>
            <FontAwesomeIcon icon={faChartSimple} /> Performance
          </>
        ),
        onClick: () => displayPrompt("studentPerformance"),
        variant: "outline",
      });
    }

    return arr;
  };

  const promptMapper = {
    view: {
      title: "Take CBT Test",
      onFormSubmit: () =>
        navigate(`/app/cbt/view`, {
          state: { creds: { ...createQ } },
        }),
    },
    create: {
      title: "Create CBT",
      onFormSubmit: () =>
        navigate(`/app/cbt/create`, {
          state: { creds: { ...createQ } },
        }),
    },
    submission: {
      title: "View CBT Submissions",
      onFormSubmit: () =>
        navigate(`/app/cbt/submission`, {
          state: { creds: { ...createQ } },
        }),
    },
    results: {
      title: "View CBT Results",
      onFormSubmit: () =>
        navigate(`/app/cbt/results`, {
          state: { creds: { ...createQ } },
        }),
    },
    studentResult: {
      title: "View CBT Results",
      onFormSubmit: () =>
        navigate(`/app/cbt/student/results`, {
          state: { creds: { ...createQ } },
        }),
    },
    performance: {
      title: "View CBT Performance",
      onFormSubmit: () =>
        navigate(`/app/cbt/performances`, {
          state: { creds: { ...createQ } },
        }),
    },
    studentPerformance: {
      title: "View CBT Performance",
      onFormSubmit: () =>
        navigate(`/app/cbt/performances/students`, {
          state: { creds: { ...createQ } },
        }),
    },
  };

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

  const periods = [
    { value: "First Half", title: "First Half / Mid Term" },
    { value: "Second Half", title: "Second Half / End of Term" },
  ];

  useEffect(() => {
    setCreateQ((prev) => {
      return {
        ...prev,
        period: user?.period,
        term: user?.term,
        session: user?.session,
      };
    });
  }, []);

  // console.log({ sessions, activeTab, inputs, createQ, ct: activateContinue() });

  // useEffect(() => {
  //   if (permission?.view) {
  //     setActiveTab("5");
  //   } else if (permission?.create) {
  //     setActiveTab("1");
  //   }
  // }, []);

  return (
    <div className=''>
      <PageView
        hasSortOptions
        showIllustration
        svgIllustrationBanner={CBTIcon}
        hideTable
        groupedButtonOptions={getToggleButtons()}
        useBtn2
        canCreate={false}
        isLoading={false}
      />
      <Prompt
        isOpen={modalPrompt}
        toggle={() => setModalPrompt(!modalPrompt)}
        singleButtonProps={{
          type: "button",
          isLoading: false,
          disabled: activateContinue(),

          onClick: promptMapper[promptStatus]?.onFormSubmit,
        }}
        singleButtonText='Continue'
        promptHeader={promptMapper[promptStatus]?.title}
      >
        <div className='form-group mb-4'>
          <AuthSelect
            label='Period'
            value={createQ.period}
            name='period'
            onChange={({ target: { value } }) => {
              setCreateQ((prev) => {
                return { ...prev, period: value };
              });
            }}
            options={periods}
            // defaultValue={periods[0]}
          />
        </div>

        <div className='form-group mb-4'>
          <AuthSelect
            label='Term'
            value={createQ.term}
            name='term'
            onChange={({ target: { value } }) => {
              setCreateQ((prev) => {
                return { ...prev, term: value };
              });
            }}
            options={[
              { value: "First Term", title: "First Term" },
              { value: "Second Term", title: "Second Term" },
              { value: "Third Term", title: "Third Term" },
            ]}
          />
        </div>

        <div className='form-group mb-4'>
          <AuthSelect
            label='Session'
            value={createQ.session}
            name='session'
            onChange={({ target: { value } }) => {
              setCreateQ((prev) => {
                return { ...prev, session: value };
              });
            }}
            options={(sessions || [])?.map((session) => ({
              value: session?.academic_session,
              title: session?.academic_session,
            }))}
          />
        </div>

        {/* <div className='form-group mb-4'>
          <AuthSelect
            label='Subject'
            sort
            options={newSubjects}
            value={createQ.subject_id}
            onChange={({ target: { value } }) => {
              setCreateQ((prev) => {
                return { ...prev, subject_id: value };
              });
            }}
            placeholder='Select Subject'
            wrapperClassName='w-100'
          />
        </div> */}

        {/* <div className='form-group mb-4'>
          <AuthSelect
            label='Question Type'
            sort
            options={[
              {
                value: "objective",
                title: "Objective",
              },
            ]}
            value={createQ.question_type}
            onChange={({ target: { value } }) => {
              setCreateQ((prev) => {
                return { ...prev, question_type: value, answer: "" };
              });
            }}
            placeholder='Select type'
            wrapperClassName='w-100'
          />
        </div> */}
      </Prompt>
    </div>
  );
};

export default CBTPage;
