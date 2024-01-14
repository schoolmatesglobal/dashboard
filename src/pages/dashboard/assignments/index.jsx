import React, { useEffect } from "react";
import PageSheet from "../../../components/common/page-sheet";
import useAssignments from "../../../hooks/useAssignments";
import styles from "../../../assets/scss/pages/dashboard/assignment.module.scss";
import ButtonGroup from "../../../components/buttons/button-group";
import Create from "./create";

const Assignments = () => {
  const { menuTab, setMenuTab, permission, apiServices, user } =
    useAssignments();

  const getToggleButtons = () => {
    let arr = [];

    if (permission?.view) {
      arr.push({
        title: "View",
        onClick: () => setMenuTab("5"),
        variant: `${menuTab === "5" ? "" : "outline"}`,
      });
    }

    if (permission?.create) {
      arr.push({
        title: "Create",
        onClick: () => setMenuTab("1"),
        variant: `${menuTab === "1" ? "" : "outline"}`,
      });
    }
    if (permission?.created) {
      arr.push({
        title: "Created",
        onClick: () => setMenuTab("2"),
        variant: `${menuTab === "2" ? "" : "outline"}`,
      });
    }
    if (permission?.submissions) {
      arr.push({
        title: "Submissions",
        onClick: () => setMenuTab("3"),
        variant: `${menuTab === "3" ? "" : "outline"}`,
      });
    }
    if (permission?.results) {
      arr.push({
        title: "Results",
        onClick: () => setMenuTab("4"),
        variant: `${menuTab === "4" ? "" : "outline"}`,
      });
    }
    if (permission?.student_results) {
      arr.push({
        title: "Results",
        onClick: () => setMenuTab("6"),
        variant: `${menuTab === "6" ? "" : "outline"}`,
      });
    }

    return arr;
  };

  useEffect(() => {
    if (permission?.view) {
      setMenuTab("5");
      // refetchObjAnsweredAssignment();
      // refetchTheoryAnsweredAssignment();
      // resetAddObjectiveAnsFxn();
      // resetTheoryAnsFxn();
    } else if (permission?.create) {
      setMenuTab("1");
    }
  }, []);

  return (
    <PageSheet>
      <div className={styles.home}>
        <ButtonGroup options={getToggleButtons()} />

        <hr className={styles.home_divider} />

        {/* {menuTab === "5" && permission?.view && <View />} */}
        {menuTab === "1" && permission?.create && <Create />}
        {/* {menuTab === "2" && permission?.created && <Created />} */}
        {/* {menuTab === "3" && permission?.submissions && <Submission />} */}
        {/* {menuTab === "4" && permission?.results && <Results />} */}
        {/* {menuTab === "6" && permission?.student_results && <StudentResults />} */}
      </div>
    </PageSheet>
  );
};

export default Assignments;
