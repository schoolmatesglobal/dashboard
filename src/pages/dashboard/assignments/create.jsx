import React, { useState } from "react";
// import { HiOutlineDocumentPlus } from "react-icons/hi2";
// import { PiWarningCircleBold } from "react-icons/pi";
import { useAppContext } from "../../../hooks/useAppContext";
// import { BiSave, BiSolidPhoneCall } from "react-icons/bi";
import Prompt from "../../../components/modals/prompt";
import ButtonGroup from "../../../components/buttons/button-group";
import styles from "../../../assets/scss/pages/dashboard/assignment.module.scss";
import AuthInput from "../../../components/inputs/auth-input";
import AuthSelect from "../../../components/inputs/auth-select";
import Button from "../../../components/buttons/button";
import {
  addQuestionMarks,
  updateQuestionNumbers,
  updateObjectiveTotals,
} from "./constant";
import queryKeys from "../../../utils/queryKeys";
import { useQuery, useQueryClient } from "react-query";
import { sortQuestionsByNumber } from "./constant";
import { Spinner } from "reactstrap";
import useAssignments from "../../../hooks/useAssignments";

const Create = () => {
  const {
    menuTab,
    setMenuTab,
    permission,
    apiServices,
    user,
    getFieldProps,
    inputs,
    setFieldValue,
    handleSubmit,
    errors,
    setInputs,
    reset,
  } = useAssignments();

  return (
    <>
      <div className={styles.create}>
        <div className={styles.create__options}>
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
              value={inputs?.createQuestion?.week}
              // defaultValue={week && week}
              onChange={({ target: { value } }) => {
                setInputs({
                  ...inputs,
                  createQuestion: {
                    ...inputs?.createQuestion,
                    week: value,
                  },
                });
                //   updateCreateQuestionFxn({
                //     week: value,
                //   });
                //   setShowLoading(true);
                //   setTimeout(() => {
                //     setShowLoading(false);
                //   }, 1500);
                //   if (subject !== "" && question_type !== "") {
                //     refetchAssignment();
                //   }
                // refetchAssignment();
              }}
              placeholder="Select Week"
              //   disabled={
              //     ObjectiveQuestions.length >= 1 || TheoryQuestions.length >= 1
              //   }
              wrapperClassName={styles.auth_select}
            />
            <AuthSelect
              sort
              //   options={classSubjects}
              //   value={subject}
              //   onChange={({ target: { value } }) => {
              //     updateCreateQuestionFxn({
              //       subject: value,

              //       subject_id: findSubjectId(value),
              //     });
              //     setShowLoading(true);
              //     setTimeout(() => {
              //       setShowLoading(false);
              //     }, 1500);
              //     if (week !== "" && question_type !== "") {
              //       refetchAssignment();
              //     }
              //     // refetchAssignment();
              //   }}
              placeholder="Select Subject"
              //   disabled={
              //     ObjectiveQuestions.length >= 1 || TheoryQuestions.length >= 1
              //   }
              // wrapperClassName={`${styles.auth_select} ${styles.hh}`}
              wrapperClassName={styles.auth_select}
              // label="Subject"
            />

            <AuthSelect
              sort
              //   options={sortQuestionType()}
              //   value={defaultQuestionType()}
              // label="Question Type"
              //   onChange={({ target: { value } }) => {
              //     updateCreateQuestionFxn({ question_type: value, answer: "" });
              //     setShowLoading(true);
              //     setTimeout(() => {
              //       setShowLoading(false);
              //     }, 1500);
              //     if (subject !== "" && week !== "") {
              //       refetchAssignment();
              //     }
              //   }}
              placeholder="Select type"
              wrapperClassName={styles.auth_select}
              // defaultValue={questionType[1].value}
            />
          </div>
          <Button
            variant=""
            // onClick={() => {
            //   if (question_type === "theory") {
            //     updateCreateQuestionFxn({
            //       question_number: TheoryQuestions?.length + 1,
            //     });
            //   } else if (question_type === "objective") {
            //     updateCreateQuestionFxn({
            //       question_number: ObjectiveQuestions?.length + 1,
            //     });
            //   }
            //   setCreateQuestionPrompt(true);
            // }}
            // disabled={activateAddQuestion()}
          >
            {/* {ObjectiveQuestions.length === 0 && TheoryQuestions.length === 0
              ? "Add Question"
              : "Add another Question"} */}
          </Button>
        </div>
      </div>

      {/* submit assignment prompt */}
      <Prompt
        // promptHeader={`INCOMPLETE QUESTION(S) `}
        // promptHeader={`${
        //   completedQuestion() || completedQuestion2()
        //     ? "CONFIRM ASSIGNMENT CREATION"
        //     : "INCOMPLETE QUESTION(S)"
        // }`}
        // toggle={() => setWarningPrompt(!warningPrompt)}
        // isOpen={warningPrompt}
        hasGroupedButtons={true}
        // groupedButtonProps={buttonOptions3}
      >
        {/* {completedQuestion() || completedQuestion2() ? (
          <p
            className={styles.create_question_question}
            // style={{ fontSize: "15px", lineHeight: "20px" }}
          >
            Are you sure you want to submit created question(s)?
          </p>
        ) : (
          <p
            className={styles.create_question_question}
            // style={{ fontSize: "15px", lineHeight: "20px" }}
          >
            The amount of created question(s) is not equal to the total amount
            of question(s) you specified.
          </p>
        )} */}
      </Prompt>
      {/* clear all prompt */}
      <Prompt
        promptHeader={`CONFIRM CLEAR-ALL ACTION`}
        // toggle={() => setClearAllPrompt(!clearAllPrompt)}
        // isOpen={clearAllPrompt}
        hasGroupedButtons={true}
        // groupedButtonProps={clearAllButtons}
      >
        <p
          className={styles.create_question_question}
          // style={{ fontSize: "15px", lineHeight: "20px" }}
        >
          Are you sure you want to clear all questions created?
        </p>
      </Prompt>
      {/* Edit question prompt */}
      <Prompt
        promptHeader={`QUESTION EDIT`}
        // toggle={() => setEditPrompt(!editPrompt)}
        // isOpen={editPrompt}
        hasGroupedButtons={true}
        // groupedButtonProps={editButtons}
      ></Prompt>
      {/* Delete question prompt */}
      <Prompt
        promptHeader={`CONFIRM DELETE ACTION`}
        // toggle={() => setDeletePrompt(!deletePrompt)}
        // isOpen={deletePrompt}
        hasGroupedButtons={true}
        // groupedButtonProps={deleteButtons}
      >
        <p
          className={styles.create_question_question}
          // style={{ fontSize: "15px", lineHeight: "20px" }}
        >
          Are you sure you want to delete this question?
        </p>
      </Prompt>
    </>
  );
};

export default Create;
