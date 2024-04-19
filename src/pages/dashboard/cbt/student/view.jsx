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
import { sortQuestionsByNumber } from "../constant";
import { useLocation } from "react-router-dom";
import { useAppContext } from "../../../../hooks/useAppContext";
import PageSheet from "../../../../components/common/page-sheet";
import { useStudentCBT } from "../../../../hooks/useStudentCBT";

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

  const {
    subject,

    week,
  } = createQ2;

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
    if (subject !== "" && week !== "") {
      return true;
    } else {
      return false;
    }
  };

  ///// FETCH OBJECTIVE ASSIGNMENT /////
  const {
    isLoading: objectiveQLoading,
    refetch: refetchObjectiveQ,
    data: objectiveQ,
    // isFetching: objectiveQIsFetching,
    // isRefetching: objectiveQIsRefetching,
  } = useQuery(
    [
      queryKeys.GET_ASSIGNMENT_BY_STUDENT,
      user?.period,
      user?.term,
      user?.session,
      "objective",
      week,
    ],
    () =>
      apiServices.getAssignment(
        user?.period,
        user?.term,
        user?.session,
        "objective",
        week
      ),
    {
      retry: 3,
      // refetchOnMount: false,
      // refetchOnWindowFocus: false,
      // refetchOnReconnect: false,
      // refetchInterval: false,
      // refetchIntervalInBackground: false,
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
        // console.log({ tsg, data, osortedData });
        return osortedData;
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
      enabled: activateRetrieve() && permission?.view,

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
    const findObject = studentSubjects?.find((opt) => opt.value === value);
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

    if (objectiveQ?.length >= 1) {
      return [objectiveTab];
    }

    return [];
  };

  const showNoAssignment = () => {
    if (objectiveQ?.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  const showNoAssignment2 = () => {
    if (!week || !subject) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (objectiveQ?.length >= 1) {
      setAssignmentTab("1");
    }
  }, [week, subject]);

  const assignmentLoading =
    showLoading ||
    objectiveQLoading ||
    // theoryQLoading ||
    answeredObjAssignmentLoading;
  // ||
  // answeredTheoryAssignmentLoading;
  // ||
  // theoryQIsFetching ||
  // theoryQIsRefetching ||
  // objectiveQIsFetching ||
  // objectiveQIsRefetching;

  const location = useLocation();

  const reload = () => {
    setIsPlaying(false);
    setShowLoading(true);
    setTimeout(() => {
      setShowLoading(false);
    }, 500);
  };

  // useEffect(() => {
  //   setDay(0);
  //   setHour(0);
  //   setMinute(0.5);
  // }, [week, subject]);

  //  console.log({ answeredObjectiveQ });

  return (
    <PageSheet>
      <div className={styles.view}>
        {!hideAllBars && (
          <div className='d-flex flex-column gap-4 flex-lg-row justify-content-lg-between '>
            <div className='d-flex flex-column gap-4 flex-sm-row flex-grow-1 '>
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
                  setCreateQ2((prev) => {
                    return { ...prev, week: value };
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
                placeholder='Select Week'
                wrapperClassName='w-100'
              />
              <AuthSelect
                sort
                options={studentSubjects}
                value={subject}
                // defaultValue={subject && subject}
                onChange={({ target: { value } }) => {
                  setCreateQ2((prev) => {
                    return { ...prev, subject: value };
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
            </div>
          </div>
        )}

        <div className=''>
          <div>
            <div className={styles.view__tabs}>
              <ButtonGroup options={optionTabShow()} />
            </div>

            {assignmentLoading && (
              <div className={styles.spinner_container}>
                <Spinner /> <p className='fs-3'>Loading...</p>
              </div>
            )}

            <div className=''>
              {/* objective Answers */}
              {assignmentTab === "1" && objectiveQ?.length >= 1 && (
                <Objective
                  closeSidebar={closeSidebar}
                  toggleNavbar={toggleNavbar}
                  assignmentLoading={assignmentLoading}
                  buttonOptions2={buttonOptions2}
                  objectiveQ={objectiveQ}
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
                  day={day}
                  hour={hour}
                  minute={minute}
                  setDay={setDay}
                  setHour={setHour}
                  setMinute={setMinute}
                  state={state?.creds}
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
