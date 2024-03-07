import React from "react";
import styles from "../../../assets/scss/pages/dashboard/assignment.module.scss";
import ButtonGroup from "../../../components/buttons/button-group";

const TheoryViewCard = ({
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
  editQuestionId,
  setEditQuestionId,
}) => {
  return (
    <div className={styles.create__questions_container}>
      <p className='fs-3 mb-3 lh-base'>
        <span
          className='fs-3 fw-bold'
        >
          Q{CQ.question_number}.{/* Q{index + 1}. */}
        </span>{" "}
        {CQ.question}
      </p>
      {CQ.image && (
        <div className='mb-4 '>
          <img src={CQ.image} width={70} height={70} alt='' />
        </div>
      )}
      {
        <>
          <p className='fs-3 mb-3 lh-base'>
            <span className='fs-3 fw-bold'>Answer -</span> {CQ.answer}
          </p>
          <p className='fs-3 mb-4 lh-base fw-bold'>({CQ.question_mark} mks)</p>
        </>
      }
      <ButtonGroup
        options={[
          {
            title: "Edit",
            // isLoading: addObjectAssignmentLoading || addTheoryAssignmentLoading,
            onClick: () => {
              setEditQuestion(CQ.question);
              setEditAnswer(CQ.answer);
              setEditTotalQuestion(CQ.total_question);
              setEditMark(CQ.question_mark);
              setEditNumber(CQ.question_number);
              setEditOption1(CQ.option1);
              setEditOption2(CQ.option2);
              setEditOption3(CQ.option3);
              setEditOption4(CQ.option4);
              setEditPrompt(true);
              setEditQuestionId(CQ.id)
              // console.log({ editMark, qm: CQ.question_mark });
            },
            // variant: `${activeTab === "2" ? "" : "outline"}`,
          },
          {
            title: "Delete",
            onClick: () => {
              setEditQuestion(CQ.question);
              setEditAnswer(CQ.answer);
              setEditMark(CQ.question_mark);
              setEditNumber(CQ.question_number);
              setDeletePrompt(true);
              setEditQuestionId(CQ.id)
              // console.log({ editMark, qm: CQ.question_mark });
            },
            variant: "outline-danger",
          },
        ]}
      />
    </div>
  );
};

export default TheoryViewCard;
