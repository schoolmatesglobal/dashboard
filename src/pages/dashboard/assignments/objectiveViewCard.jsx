import React from "react";
import styles from "../../../assets/scss/pages/dashboard/assignment.module.scss";
import ButtonGroup from "../../../components/buttons/button-group";

const ObjectiveViewCard = ({
  CQ,
  setEditPrompt,
  setEditQuestion,
  setEditAnswer,
  setEditTotalQuestion,
  setEditNumber,
  setEditOption1,
  setEditOption2,
  setEditMark,
  setEditOption3,
  setEditOption4,
  setDeletePrompt,
  setEditSwitchNumber,
  setEditQuestionId,
}) => {
  return (
    <div
      // className={styles.create__questions_container}
      // style={{ width: "100%" }}
      className='w-100 border border-2 rounded-1 border-opacity-25 p-5'
    >
      <p className='fs-3 mb-3 lh-base'>
        <span className='fw-bold fs-3'>Q{CQ.question_number}.</span>{" "}
        {CQ.question}
      </p>
      <p className='fw-bold fs-3 mb-3 lh-base'>({CQ.question_mark} mk(s) )</p>
      {CQ.image && (
        <div className='mb-4 '>
          <img src={CQ.image} width={70} height={70} alt='' />
        </div>
      )}
      {CQ.option1 && (
        <div className='mb-5 '>
          <p className='fs-3 mb-3'>
            {" "}
            <span className='fs-3 fw-bold'>A.</span> {CQ.option1}{" "}
            <span className='fs-3 fw-bold text-success'>
              {CQ.answer === CQ.option1 && " (Answer)"}
            </span>
          </p>
          <p className='fs-3 mb-3'>
            {" "}
            <span className='fs-3 fw-bold'>B.</span> {CQ.option2}{" "}
            <span className='fs-3 fw-bold text-success'>
              {CQ.answer === CQ.option2 && " (Answer)"}
            </span>
          </p>
          <p className='fs-3 mb-3'>
            <span className='fs-3 fw-bold'>C.</span> {CQ.option3}{" "}
            <span className='fs-3 fw-bold  text-success'>
              {CQ.answer === CQ.option3 && " (Answer)"}
            </span>
          </p>
          <p className='fs-3 mb-3'>
            <span className='fs-3 fw-bold'>D.</span> {CQ.option4}{" "}
            <span className='fs-3 fw-bold  text-success'>
              {CQ.answer === CQ.option4 && " (Answer)"}
            </span>
          </p>
        </div>
      )}
      <div className='d-flex justify-content-between'>
        <ButtonGroup
          options={[
            {
              title: "Edit",
              // isLoading: addObjectAssignmentLoading || addTheoryAssignmentLoading,
              onClick: () => {
                setEditPrompt(true);
                setEditQuestion(CQ.question);
                setEditAnswer(CQ.answer);
                setEditTotalQuestion(CQ.total_question);
                setEditMark(CQ.question_mark);
                setEditNumber(CQ.question_number);
                setEditSwitchNumber(CQ.question_number);
                setEditOption1(CQ.option1);
                setEditOption2(CQ.option2);
                setEditOption3(CQ.option3);
                setEditOption4(CQ.option4);
                setEditQuestionId(CQ.id);
              },
              // variant: `${activeTab === "2" ? "" : "outline"}`,
            },
            {
              title: "Delete",
              onClick: () => {
                setDeletePrompt(true);
                setEditQuestion(CQ.question);
                setEditAnswer(CQ.answer);
                setEditMark(CQ.question_mark);
                setEditNumber(CQ.question_number);
                setEditQuestionId(CQ.id);
              },
              variant: "outline-danger",
            },
          ]}
        />

        <div
          className={`d-flex justify-content-center align-items-center py-0 px-4 my-3  ${
            CQ.status === "published" ? "bg-success  " : "bg-danger"
          } bg-opacity-10 `}
        >
          <p
            className={`${
              CQ.status === "published" ? "text-success  " : "text-danger"
            }  `}
          >
            {CQ.status === "published" ? "published" : "Not published"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ObjectiveViewCard;
