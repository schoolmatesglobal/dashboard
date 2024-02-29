import React, { useEffect, useState } from "react";
import AuthSelect from "../../../../components/inputs/auth-select";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
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

const View = () => {
  const {
    apiServices,
    permission,
    user,
    errorHandler,
    studentSubjects,
    //
    assignmentTab,
    updateAssignmentTabFxn,
    //
    answerQuestion,
    updateAnswerQuestionFxn,
    resetAnswerQuestionFxn,

    // OBJECTIVE
    //
    // objectiveSubmitted,
    updateObjectiveSubmittedFxn,
    //
    setObjectiveQ,
    updateSetObjectiveQFxn,
    //
    // answeredObjectiveQ,
    // addObjectiveAnsFxn,
    resetAddObjectiveAnsFxn,
    //
    // answeredObjectiveQ2,
    // loadObjectiveAnsFxn,
    resetLoadObjectiveAnsFxn,
    //
    // submitObjectiveAssignment,
    // submitObjectiveAssignmentLoading,
    //
    answeredObjAssignmentLoading,
    refetchObjAnsweredAssignment,
    //

    // THEORY
    //
    // theorySubmitted,
    updateTheorySubmittedFxn,
    //
    setTheoryQ,
    updateSetTheoryQFxn,
    //
    // answeredTheoryQ,
    // addTheoryAnsFxn,
    resetTheoryAnsFxn,
    //
    // answeredTheoryQ2,
    // loadTheoryAnsFxn,
    resetLoadTheoryAnsFxn,
    //
    // submitTheoryAssignment,
    // submitTheoryAssignmentLoading,
    //
    answeredTheoryAssignmentLoading,
    refetchTheoryAnsweredAssignment,
    //
  } = useStudentAssignments();

  // const [imageUpload, setImageUpload] = useState(null);

  // const [previewUrl, setPreviewUrl] = useState("");

  // const [imageNam, setImageNam] = useState("No file selected");
  // const [activateError, setActivateError] = useState(false);
  // const [fileUploadError, setFileUploadError] = useState("");
  const [loginPrompt, setLoginPrompt] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  // const [promptStatus, setPromptStatus] = useState("compute");

  const {
    // question_type,
    // question,
    subject,
    // image,
    // imageName,
    term,
    period,
    session,
    subject_id,
    week,
    // student_id,
  } = answerQuestion;

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

  // const showNoAssignment = () => {
  //   if (question_type === "objective" && ObjectiveQ.length === 0) {
  //     return true;
  //   } else if (question_type === "theory" && TheoryQ.length === 0) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  ///// FETCH OBJECTIVE ASSIGNMENT /////
  const { isLoading: assignmentLoading1, refetch: refetchAssignment } =
    useQuery(
      [
        queryKeys.GET_ASSIGNMENT_BY_STUDENT,
        user?.period,
        user?.term,
        user?.session,
        "objective",
      ],
      () =>
        apiServices.getAssignment(
          user?.period,
          user?.term,
          user?.session,
          "objective"
        ),
      {
        retry: 3,
        // enabled: permission?.read || permission?.readClass,
        enabled: activateRetrieve() && permission?.view,
        onSuccess(data) {
          // console.log({
          //   data,
          // });
          const sortData = () => {
            const osortedData = data?.filter(
              (dt) => Number(dt?.subject_id) === subject_id
            );
            const osortedData2 = osortedData?.filter(
              (dt) => Number(dt?.week) === Number(week)
            );

            const sortedByQN = sortQuestionsByNumber(osortedData2);

            return sortedByQN;
          };
          // console.log({ osortedData, subject_id });
          updateSetObjectiveQFxn(sortData());
        },
        onError(err) {
          errorHandler(err);
        },
        select: apiServices.formatData,
      }
    );

  ///// FETCH THEORY ASSIGNMENT /////
  const { isLoading: assignmentLoading2, refetch: refetchAssignment2 } =
    useQuery(
      [
        queryKeys.GET_ASSIGNMENT_BY_STUDENT,
        user?.period,
        user?.term,
        user?.session,
        "theory",
      ],
      () =>
        apiServices.getAssignment(
          user?.period,
          user?.term,
          user?.session,
          "theory"
        ),
      {
        retry: 3,
        // enabled: permission?.read || permission?.readClass,
        enabled: activateRetrieve() && permission?.view,
        onSuccess(data) {
          // console.log({
          //   data,
          // });
          const sortData = () => {
            const tsortedData = data?.filter(
              (dt) => Number(dt?.subject_id) === subject_id
            );

            const sortedData2 = tsortedData?.filter(
              (dt) => Number(dt?.week) === Number(week)
            );

            const sortedByQN = sortQuestionsByNumber(sortedData2);

            return sortedByQN;
          };
          // console.log({ tsortedData, subject_id });
          updateSetTheoryQFxn(sortData());
        },
        onError(err) {
          errorHandler(err);
        },
        select: apiServices.formatData,
      }
    );

  const findSubjectId = (value) => {
    const findObject = studentSubjects?.find((opt) => opt.value === value);
    if (findObject) {
      return findObject.id;
    }
  };

  const buttonOptions2 = [
    // {
    //   title: "Clear All",
    //   //   onClick: () => {
    //   //     // emptyObjectiveQ();
    //   //     // emptyTheoryQ();
    //   //   },
    //   variant: "outline",
    // },
    {
      title: "Submit Assignment",
      onClick: () => displayPrompt(),
    },
  ];

  const optionTabShow = () => {
    let arr = [];

    if (setObjectiveQ.length >= 1 && setTheoryQ.length >= 1) {
      arr.push(
        {
          title: "Objective",
          onClick: () => updateAssignmentTabFxn("1"),
          variant: `${assignmentTab === "1" ? "" : "outline"}`,
        },
        {
          title: "Theory",
          onClick: () => updateAssignmentTabFxn("2"),
          variant: `${assignmentTab === "2" ? "" : "outline"}`,
        }
      );
    } else if (setObjectiveQ.length >= 1) {
      arr.push(
        {
          title: "Objective",
          onClick: () => updateAssignmentTabFxn("1"),
          variant: `${assignmentTab === "1" ? "" : "outline"}`,
        }
        // {
        //   title: "Theory",
        //   onClick: () => updateAssignmentTabFxn("2"),
        //   variant: `${assignmentTab === "2" ? "" : "outline"}`,
        // }
      );
    } else if (setTheoryQ.length >= 1) {
      arr.push(
        // {
        //   title: "Objective",
        //   onClick: () => updateAssignmentTabFxn("1"),
        //   variant: `${assignmentTab === "1" ? "" : "outline"}`,
        // },
        {
          title: "Theory",
          onClick: () => updateAssignmentTabFxn("2"),
          variant: `${assignmentTab === "2" ? "" : "outline"}`,
        }
      );
    }

    return arr;
  };

  const questionTypeOptions = [
    {
      title: "Objective",
      onClick: () => updateAssignmentTabFxn("1"),
      variant: `${assignmentTab === "1" ? "" : "outline"}`,
    },
    {
      title: "Theory",
      onClick: () => updateAssignmentTabFxn("2"),
      variant: `${assignmentTab === "2" ? "" : "outline"}`,
    },
  ];

  const showNoAssignment = () => {
    if (setObjectiveQ.length === 0 && setTheoryQ.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  const assignmentLoading =
    showLoading ||
    assignmentLoading1 ||
    assignmentLoading2 ||
    answeredObjAssignmentLoading ||
    answeredTheoryAssignmentLoading;

  const location = useLocation();
  // const history = useHistory();

  useEffect(() => {
    // const unlisten = location.listen((location, action) => {
    //   // Do something when the route changes
    //   resetLoadObjectiveAnsFxn();
    //   resetLoadTheoryAnsFxn();
    //   resetAddObjectiveAnsFxn();
    //   resetTheoryAnsFxn();
    //   updateObjectiveSubmittedFxn(false);
    //   updateTheorySubmittedFxn(false);
    //   console.log(`Route changed to ${location.pathname}`);
    // });
    // // Clean up the listener when the component unmounts
    // return () => {
    //   unlisten();
    // };
  }, []);

  console.log({ location });

  // useEffect(() => {
  //   if (permission?.view) {
  //     updateActiveT("5");
  //   } else if (permission?.create) {
  //     updateActiveT("1");
  //   }
  // }, []);

  // console.log({ answeredObjectiveQ2, answeredTheoryQ2 });

  // useEffect(() => {
  //   updateAssignmentTabFxn("1"),
  // }, [])

  return (
    <div>
      <div className={styles.view}>
        <div className={styles.view__options}>
          <div className={styles.auth_select_container}>
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
              defaultValue={week && week}
              onChange={({ target: { value } }) => {
                updateAnswerQuestionFxn({
                  week: value,
                });
                if (subject !== "") {
                  setShowLoading(true);
                  resetLoadObjectiveAnsFxn();
                  resetLoadTheoryAnsFxn();
                  resetAddObjectiveAnsFxn();
                  resetTheoryAnsFxn();
                  updateObjectiveSubmittedFxn(false);
                  updateTheorySubmittedFxn(false);
                  refetchAssignment();
                  refetchAssignment2();
                  refetchObjAnsweredAssignment();
                  refetchTheoryAnsweredAssignment();
                  setTimeout(() => {
                    setShowLoading(false);
                  }, 2000);

                  updateAssignmentTabFxn("1");
                }
              }}
              placeholder="Week"
              wrapperClassName={styles.auth_select}
            />
            <AuthSelect
              sort
              options={studentSubjects}
              value={subject || ""}
              defaultValue={subject && subject}
              onChange={({ target: { value } }) => {
                resetAnswerQuestionFxn({
                  subject,
                  week,
                  period,
                  session,
                  term,
                });
                updateAnswerQuestionFxn({
                  subject: value,
                  subject_id: findSubjectId(value),
                });
                resetLoadObjectiveAnsFxn();
                resetLoadTheoryAnsFxn();
                resetAddObjectiveAnsFxn();
                resetTheoryAnsFxn();
                updateObjectiveSubmittedFxn(false);
                updateTheorySubmittedFxn(false);
                refetchAssignment();
                refetchAssignment2();
                refetchObjAnsweredAssignment();
                refetchTheoryAnsweredAssignment();

                updateAssignmentTabFxn("1");

                // resetObjectiveAnsFxn2();
                // resetTheoryAnsFxn2();

                if (week !== "") {
                  setShowLoading(true);
                  refetchAssignment();
                  refetchAssignment2();
                  refetchObjAnsweredAssignment();
                  refetchTheoryAnsweredAssignment();
                  setTimeout(() => {
                    setShowLoading(false);
                  }, 2000);
                }
              }}
              placeholder="Select Subject"
              wrapperClassName={styles.auth_select}
              // label="Subject"
            />
          </div>
        </div>

        <div className={styles.view__tabs}>
          <ButtonGroup options={optionTabShow()} />
        </div>

        {assignmentLoading && (
          <div className={styles.spinner_container}>
            <Spinner /> <p className="">Loading...</p>
          </div>
        )}

        <div className="">
          {/* objective Answers */}
          {assignmentTab === "1" && setObjectiveQ.length >= 1 && (
            <Objective
              assignmentLoading={assignmentLoading}
              buttonOptions2={buttonOptions2}
            />
          )}

          {/* Theory Answers */}
          {assignmentTab === "2" && setTheoryQ.length >= 1 && (
            <Theory
              assignmentLoading={assignmentLoading}
              buttonOptions2={buttonOptions2}
            />
          )}
        </div>

        {!assignmentLoading && showNoAssignment() && (
          <div className={styles.placeholder_container}>
            <HiOutlineDocumentPlus className={styles.icon} />
            <p className={styles.heading}>No Assignment</p>
          </div>
        )}

        {/* {(setObjectiveQ.length >= 1 || setTheoryQ.length >= 1) && (
          <div className={styles.footer}>
            <ButtonGroup options={buttonOptions2} />
          </div>
        )} */}
      </div>
      <Prompt
        isOpen={loginPrompt}
        toggle={() => setLoginPrompt(!loginPrompt)}
        hasGroupedButtons={true}
        groupedButtonProps={buttonOptions}
        singleButtonText="Preview"
        promptHeader={`CONFIRM ASSIGNMENT SUBMISSION`}
      ></Prompt>
    </div>
  );
};

export default View;
