import React, { useEffect, useState } from "react";
import AuthSelect from "../../../../components/inputs/auth-select";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import { FaComputer } from "react-icons/fa6";
import ButtonGroup from "../../../../components/buttons/button-group";
import { useQuery, useQueryClient } from "react-query";
import queryKeys from "../../../../utils/queryKeys";
import { Spinner } from "reactstrap";
import styles from "../../../../assets/scss/pages/dashboard/studentAssignment.module.scss";
import { useStudentAssignments } from "../../../../hooks/useStudentAssignment";
import Prompt from "../../../../components/modals/prompt";
import Theory from "./theory";
import Objective from "./objective";
import { parseDuration, sortQuestionsByNumber } from "../constant";
import { useLocation } from "react-router-dom";
import { useAppContext } from "../../../../hooks/useAppContext";
import PageSheet from "../../../../components/common/page-sheet";
import { useStudentCBT } from "../../../../hooks/useStudentCBT";
import { useSubject } from "../../../../hooks/useSubjects";

const ViewCBT = (
  {
    // closeSidebar,
    // isPlaying,
    // setIsPlaying,
  }
) => {
  const {
    toggleNavbar,
    objectiveQ2,
    setObjectiveQ2,
    theoryQ2,
    setTheoryQ2,
    createQ2,
    setCreateQ2,
    studentSubjects,
    assignmentTab,
    setAssignmentTab,
    answeredObjectiveQ,
    setAnsweredObjectiveQ,
    answeredTheoryQ,
    setAnsweredTheoryQ,
    objectiveSubmitted,
    setObjectiveSubmitted,
    theorySubmitted,
    setTheorySubmitted,
    subjects,
    showWarning,
    setShowWarning,
    testEnded,
    setTestEnded,
    timeLeft,
    setTimeLeft,
    secondleft,
    hourLeft,
    setSecondLeft,
    setHourLeft,
    day,
    hour,
    minute,
    setDay,
    setHour,
    setMinute,
    apiServices,
    permission,
    user,
    errorHandler,
    answeredObjAssignmentLoading,
    answeredTheoryAssignmentLoading,
    refetchTheoryAnsweredAssignment,
    //
  } = useStudentCBT();

  const { state } = useLocation();

  const [key, setKey] = useState(0);

  // const { subjects, isLoading: subjectLoading } = useSubject();

  const {
    isOpen: sideBarIsOpen,
    // toggle: toggleSideBar,
    closeSidebar,
    openSidebar,
    close,
    hideAllBars,
    setHideAllBars,
  } = useAppContext();

  const [loginPrompt, setLoginPrompt] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);

  const { subject, subject_id, week, question_type } = createQ2;

  const buttonOptions = [
    {
      title: "Cancel",
      onClick: () => setLoginPrompt(false),
      variant: "outline",
    },
    {
      title: "Yes Submit",
      //   disabled: activatePreview(),
      // isLoading: `${activeTab === "2" ? isLoading : isLoading}`,
      //
      // variant: "outline",
    },
  ];

  const displayPrompt = (status) => {
    setLoginPrompt(true);
  };

  // const queryClient = useQueryClient();

  const activateRetrieve = () => {
    if (subject_id !== "" && question_type !== "") {
      return true;
    } else {
      return false;
    }
  };

  const reload = () => {
    setIsPlaying(false);
    setShowLoading(true);
    setTimeout(() => {
      setShowLoading(false);
    }, 500);
  };

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
        createQ2?.subject_id,
        createQ2?.question_type
      ),
    {
      retry: 2,
      // refetchOnMount: false,
      // refetchOnWindowFocus: false,
      // refetchOnReconnect: false,
      // refetchInterval: false,
      // refetchIntervalInBackground: false,

      // enabled: false,
      enabled: activateRetrieve() && permission?.view,

      select: (data) => {
        // const cbt = data?.data?.attributes;
        // const cbt = apiServices.formatData(data);
        const cbt = {
          ...data?.data?.attributes,
          id: data?.data?.id,
        };

        // const filtCbt = cbt?.filter((as) => as.subject_id === subject_id) ?? [];

        // console.log({ data, cbt });

        return cbt;
      },
      onSuccess(data) {
        if (question_type === "objective") {
          // setObjectiveQ(data);
          setCreateQ2((prev) => {
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
        // reload();
        // setAllowFetch(false);
      },
      onError(err) {
        // if
        if (err.response.data.message === "Not found!") return;
        errorHandler(err);
      },
      // select: apiServices.formatData,
    }
  );

  ///// FETCH OBJECTIVE CBT /////
  const {
    isLoading: objectiveQLoading,
    refetch: refetchObjectiveQ,
    data: objectiveQ,
    isFetching: objectiveQIsFetching,
    isRefetching: objectiveQIsRefetching,
  } = useQuery(
    [queryKeys.GET_CBT_BY_STUDENT],
    () =>
      apiServices.getAllCbtQuestion(
        state?.creds?.period,
        state?.creds?.term,
        state?.creds?.session,
        createQ2?.subject_id,
        createQ2?.question_type
      ),
    {
      retry: 3,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      refetchIntervalInBackground: false,
      // enabled: false,
      enabled: activateRetrieve() && permission?.view,

      select: (data) => {
        const tsg = apiServices.formatData(data);
        const osortedData = tsg?.filter(
          (dt) =>
            dt?.status === "published" &&
            dt?.subject === subject &&
            Number(dt?.week) === Number(week)
        );
        // console.log({ tsg, data });
        return tsg;
      },

      onSuccess(data) {
        if (question_type === "objective") {
          setObjectiveQ2(data);
        }
        // reload();
        // setAllowFetch(false);
      },

      onError(err) {
        errorHandler(err);
      },
    }
  );

  ///// FETCH THEORY ASSIGNMENT /////
  const {
    isLoading: theoryQLoading,
    refetch: refetchTheoryQ,
    data: theoryQ,
    // isFetching: theoryQIsFetching,
    // isRefetching: theoryQIsRefetching,
  } = useQuery(
    [
      queryKeys.GET_ASSIGNMENT_BY_STUDENT,
      user?.period,
      user?.term,
      user?.session,
      "theory",
      week,
    ],
    () =>
      apiServices.getAssignment(
        user?.period,
        user?.term,
        user?.session,
        "theory",
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
      enabled: false,
      // enabled: activateRetrieve() && permission?.view,

      select: (data) => {
        const theo = apiServices.formatData(data);
        const tsortedData = theo?.filter(
          (dt) =>
            dt?.status === "published" &&
            dt?.subject === subject &&
            Number(dt?.week) === Number(week)
        );
        // console.log({ theo, data, tsortedData });
        return tsortedData;
      },

      onError(err) {
        errorHandler(err);
      },
      // select: apiServices.formatData,
    }
  );

  const findSubjectId = (value) => {
    const findObject = subjects?.find((opt) => opt.subject === value);
    if (findObject) {
      return findObject.id;
    }
  };

  const buttonOptions2 = [
    {
      title: "Submit Assignment",
      onClick: () => displayPrompt(),
    },
  ];

  const optionTabShow = () => {
    const objectiveTab = {
      title: "CBT Objective",
      onClick: () => setAssignmentTab("1"),
      variant: assignmentTab === "1" ? "" : "outline",
    };

    const theoryTab = {
      title: "Theory",
      onClick: () => setAssignmentTab("2"),
      variant: assignmentTab === "2" ? "" : "outline",
    };

    if (objectiveQ2?.length >= 1) {
      return [objectiveTab];
    }

    return [];
  };

  const showNoAssignment = () => {
    if (objectiveQ2?.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  const showNoAssignment2 = () => {
    if (!question_type || !subject) {
      return true;
    } else {
      return false;
    }
  };

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

  useEffect(() => {
    if (objectiveQ2?.length >= 1) {
      setAssignmentTab("1");
    }
  }, [question_type, subject]);

  const assignmentLoading =
    showLoading ||
    objectiveQLoading ||
    cbtSettingsLoading ||
    // theoryQLoading ||
    answeredObjAssignmentLoading ||
    objectiveQIsFetching ||
    objectiveQIsRefetching;
  // ||
  // answeredTheoryAssignmentLoading;
  // ||
  // theoryQIsFetching ||
  // theoryQIsRefetching ||
  // objectiveQIsFetching ||
  // objectiveQIsRefetching;

  const location = useLocation();

  useEffect(() => {
    setDay(0);
    setHour(createQ2?.hour);
    setMinute(createQ2?.minute);
  }, [createQ2]);

  useEffect(() => {
    if (activateRetrieve()) {
      // reload();
      refetchObjectiveQ();
    }
    if (activateRetrieve()) {
      // reload();
      refetchCbtSettings();
    }
    setKey((prevKey) => prevKey + 1);
  }, [subject_id, question_type]);

  // console.log({
  //   studentSubjects,
  //   createQ2,
  //   state,
  //   subjects,
  //   objectiveQ2,
  //   subject_id,
  // });

  return (
    <PageSheet>
      <div key={key} className={styles.view}>
        <div className='d-flex align-items-center justify-content-center mb-4'>
          <p className='fw-bold fs-4'>
            {/* CBT {toSentenceCase(state?.creds?.question_type)} |{" "} */}
            {state?.creds?.period} | {state?.creds?.term} |{" "}
            {state?.creds?.session}
          </p>
        </div>

        {!hideAllBars && (
          <div className='d-flex flex-column gap-4 flex-lg-row justify-content-lg-between '>
            <div className='d-flex flex-column gap-4 flex-sm-row flex-grow-1 '>
              <AuthSelect
                sort
                options={studentSubjects}
                value={subject}
                // defaultValue={subject && subject}
                onChange={({ target: { value } }) => {
                  setCreateQ2((prev) => {
                    return {
                      ...prev,
                      subject: value,
                      subject_id: findSubjectId(value),
                    };
                  });
                  setObjectiveSubmitted(false);
                  setTheorySubmitted(false);
                  setAnsweredTheoryQ([]);
                  setAnsweredObjectiveQ([]);
                  reload();
                  // setDay(0);
                  // setHour(0);
                  // setMinute(0.5);
                }}
                placeholder='Select Subject'
                wrapperClassName='w-100'
                // label="Subject"
              />
              <AuthSelect
                sort
                options={questionType}
                value={question_type}
                onChange={({ target: { value } }) => {
                  setCreateQ2((prev) => {
                    return { ...prev, question_type: value, answer: "" };
                  });
                  setObjectiveSubmitted(false);
                  reload();
                }}
                placeholder='Select type'
                wrapperClassName=''
              />
            </div>
          </div>
        )}

        <div className=''>
          <div>
            {/* <div className={styles.view__tabs}>
              <ButtonGroup options={optionTabShow()} />
            </div> */}

            {assignmentLoading && (
              <div className={styles.spinner_container}>
                <Spinner /> <p className='fs-3'>Loading...</p>
              </div>
            )}

            <div className=''>
              {/* objective Answers */}
              {assignmentTab === "1" && objectiveQ2?.length >= 1 && (
                <Objective
                  closeSidebar={closeSidebar}
                  toggleNavbar={toggleNavbar}
                  assignmentLoading={assignmentLoading}
                  buttonOptions2={buttonOptions2}
                  objectiveQ={objectiveQ2}
                  answeredObjectiveQ={answeredObjectiveQ}
                  setAnsweredObjectiveQ={setAnsweredObjectiveQ}
                  objectiveSubmitted={objectiveSubmitted}
                  setObjectiveSubmitted={setObjectiveSubmitted}
                  createQ2={createQ2}
                  setCreateQ2={setCreateQ2}
                  subjects={subjects}
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  showWarning={showWarning}
                  setShowWarning={setShowWarning}
                  testEnded={testEnded}
                  setTestEnded={setTestEnded}
                  timeLeft={timeLeft}
                  setTimeLeft={setTimeLeft}
                  secondleft={secondleft}
                  setSecondLeft={setSecondLeft}
                  hourLeft={hourLeft}
                  setHourLeft={setHourLeft}
                  day={0}
                  hour={createQ2?.hour}
                  minute={createQ2?.minute}
                  setDay={setDay}
                  setHour={setHour}
                  setMinute={setMinute}
                  state={state?.creds}
                  reload={reload}
                />
              )}
              {/* Theory Answers */}
              {/* {assignmentTab === "2" && theoryQ?.length >= 1 && (
                <Theory
                  assignmentLoading={assignmentLoading}
                  buttonOptions2={buttonOptions2}
                  theoryQ={theoryQ}
                  answeredTheoryQ={answeredTheoryQ}
                  setAnsweredTheoryQ={setAnsweredTheoryQ}
                  theorySubmitted={theorySubmitted}
                  setTheorySubmitted={setTheorySubmitted}
                  createQ2={createQ2}
                  setCreateQ2={setCreateQ2}
                  subjects={subjects}
                />
              )} */}
            </div>
            {!assignmentLoading &&
              (showNoAssignment() || showNoAssignment2()) && (
                <div className={styles.placeholder_container}>
                  <FaComputer className={styles.icon} />
                  <p className='fs-1 fw-bold mt-3'>No CBT Question</p>
                </div>
              )}
          </div>
        </div>
      </div>
      <Prompt
        isOpen={loginPrompt}
        toggle={() => setLoginPrompt(!loginPrompt)}
        hasGroupedButtons={true}
        groupedButtonProps={buttonOptions}
        singleButtonText='Preview'
        promptHeader={`CONFIRM ASSIGNMENT SUBMISSION`}
      ></Prompt>
    </PageSheet>
  );
};

export default ViewCBT;
