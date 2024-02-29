import React from "react";
import PageSheet from "../../../components/common/page-sheet";
import Create from "./create";
import Submission from "./submission";
import Results from "./results";
import ButtonGroup from "../../../components/buttons/button-group";
import Created from "./created";
import { useAssignments } from "../../../hooks/useAssignments";
import styles from "../../../assets/scss/pages/dashboard/assignment.module.scss";
import View from "./student/view";
import { useEffect } from "react";
import StudentResults from "./student/studentResults";
import { useStudentAssignments } from "../../../hooks/useStudentAssignment";

const Assignments = () => {
  const { updateActiveTabFxn, activeTab } = useAssignments();
  const {
    // apiServices,
    permission,
    // user,
    // errorHandler,
    // studentSubjects,
    //
    // assignmentTab,
    // updateAssignmentTabFxn,
    //
    // answerQuestion,
    // updateAnswerQuestionFxn,
    // resetAnswerQuestionFxn,

    // OBJECTIVE
    //
    // objectiveSubmitted,
    // updateObjectiveSubmittedFxn,
    //
    // setObjectiveQ,
    // updateSetObjectiveQFxn,
    //
    // answeredObjectiveQ,
    // addObjectiveAnsFxn,
    // resetAddObjectiveAnsFxn,
    //
    // answeredObjectiveQ2,
    // loadObjectiveAnsFxn,
    // resetLoadObjectiveAnsFxn,
    //
    // submitObjectiveAssignment,
    // submitObjectiveAssignmentLoading,
    //
    // answeredObjAssignmentLoading,
    // refetchObjAnsweredAssignment,
    //

    // THEORY
    //
    // theorySubmitted,
    // updateTheorySubmittedFxn,
    //
    // setTheoryQ,
    // updateSetTheoryQFxn,
    //
    // answeredTheoryQ,
    // addTheoryAnsFxn,
    // resetTheoryAnsFxn,
    //
    // answeredTheoryQ2,
    // loadTheoryAnsFxn,
    // resetLoadTheoryAnsFxn,
    //
    // submitTheoryAssignment,
    // submitTheoryAssignmentLoading,
    //
    // answeredTheoryAssignmentLoading,
    // refetchTheoryAnsweredAssignment,
    //
  } = useStudentAssignments();

  // const { apiServices, errorHandler, permission, user } =
  //   useAppContext("assignments");
  // const [activeTab, setActiveTab] = useState("1");
  // const [selected, setSelected] = React.useState("photos");
  // const [assignment, setAssignment] = useState([]);

  // const [activate, setActivate] = useState(false);

  // const buttonOptions = [
  //   {
  //     title: "View",
  //     onClick: () => updateActiveTabFxn("5"),
  //     variant: `${activeTab === "5" ? "" : "outline"}`,
  //   },
  //   {
  //     title: "Create",
  //     onClick: () => updateActiveTabFxn("1"),
  //     variant: `${activeTab === "1" ? "" : "outline"}`,
  //   },
  //   {
  //     title: "Created",
  //     onClick: () => updateActiveTabFxn("2"),
  //     variant: `${activeTab === "2" ? "" : "outline"}`,
  //   },
  //   {
  //     title: "Submissions",
  //     onClick: () => updateActiveTabFxn("3"),
  //     variant: `${activeTab === "3" ? "" : "outline"}`,
  //   },
  //   {
  //     title: "Results",
  //     onClick: () => updateActiveTabFxn("4"),
  //     variant: `${activeTab === "4" ? "" : "outline"}`,
  //   },
  // ];

  const getToggleButtons = () => {
    let arr = [];

    if (permission?.view) {
      arr.push({
        title: "View",
        onClick: () => updateActiveTabFxn("5"),
        variant: `${activeTab === "5" ? "" : "outline"}`,
      });
    }

    if (permission?.create) {
      arr.push({
        title: "Create",
        onClick: () => updateActiveTabFxn("1"),
        variant: `${activeTab === "1" ? "" : "outline"}`,
      });
    }

    if (permission?.created) {
      arr.push({
        title: "Created",
        onClick: () => updateActiveTabFxn("2"),
        variant: `${activeTab === "2" ? "" : "outline"}`,
      });
    }
    if (permission?.submissions) {
      arr.push({
        title: "Submissions",
        onClick: () => updateActiveTabFxn("3"),
        variant: `${activeTab === "3" ? "" : "outline"}`,
      });
    }
    if (permission?.results) {
      arr.push({
        title: "Results",
        onClick: () => updateActiveTabFxn("4"),
        variant: `${activeTab === "4" ? "" : "outline"}`,
      });
    }
    if (permission?.student_results) {
      arr.push({
        title: "Results",
        onClick: () => updateActiveTabFxn("6"),
        variant: `${activeTab === "6" ? "" : "outline"}`,
      });
    }

    return arr;
  };

  // const getDefaultTab = () => {
  //   if (permission?.view) {
  //     updateActiveT("5");
  //   } else if (permission?.create) {
  //     updateActiveT("1");
  //   }
  // };

  // const updateActiveTCallback = useCallback(() => {
  //   if (permission?.view) {
  //     updateActiveT("5");
  //   } else if (permission?.create) {
  //     updateActiveT("1");
  //   }
  // }, [permission, updateActiveT]);

  useEffect(() => {
    if (permission?.view) {
      updateActiveTabFxn("5");
      // refetchObjAnsweredAssignment();
      // refetchTheoryAnsweredAssignment();
      // resetAddObjectiveAnsFxn();
      // resetTheoryAnsFxn();
    } else if (permission?.create) {
      updateActiveTabFxn("1");
    }
  }, []);

  // useEffect(() => {
  //   // resetLoadObjectiveAnsFxn();
  //   // resetLoadTheoryAnsFxn();
  //   // refetchObjAnsweredAssignment();
  //   // refetchTheoryAnsweredAssignment();
  // }, []);

  // console.log({ permission });

  return (
    <PageSheet>
      <div className={styles.home}>
        <ButtonGroup options={getToggleButtons()} />

        <hr className={styles.home_divider} />

        {activeTab === "5" && permission?.view && <View />}
        {activeTab === "1" && permission?.create && <Create />}
        {activeTab === "2" && permission?.created && <Created />}
        {activeTab === "3" && permission?.submissions && <Submission />}
        {activeTab === "4" && permission?.results && <Results />}
        {activeTab === "6" && permission?.student_results && <StudentResults />}
      </div>
    </PageSheet>
  );
};

export default Assignments;
