import React from "react";
import AuthInput from "../../../components/inputs/auth-input";
import Button from "../../../components/buttons/button";

const MarkCard = ({
  allLoading,
  question_type,
  objectiveQ,
  theoryQ,
  published,
  createQ,
}) => {
  const totalTheoryScore = theoryQ.reduce(
    (acc, quest) => acc + Number(quest?.question_mark),
    0
  );
  const objScore =
    objectiveQ?.reduce((acc, quest) => acc + Number(quest?.question_mark), 0) /
    objectiveQ?.length;

  // console.log({ totalTheoryScore, theoryQ });

  // const sumMark = questions.reduce(
  //   (acc, question) => acc + Number(question.teacher_mark),
  //   0
  // );

  return (
    <div className='d-flex flex-column gap-5 mt-5'>
      {!allLoading && (
        <div className=''>
          <div className='w-100 d-flex justify-content-center align-items-center gap-3 mb-4'>
            <p className='fs-4 fw-bold'>Instructions:</p>
            <p className='fs-4'>{createQ?.instruction}</p>
          </div>

          <div className='d-flex justify-content-between align-items-center '>
            <div className='d-flex justify-content-center align-items-center gap-3 bg-info bg-opacity-10 py-3 px-4'>
              <p className='fs-4 fw-bold'>Each Question Mark:</p>
              <p className='fs-4 fw-bold'>{createQ?.question_mark}</p>
            </div>
            <div className='d-flex justify-content-center align-items-center  gap-3 bg-info bg-opacity-10 py-3 px-4'>
              <p className='fs-4 fw-bold'>Duration:</p>
              {createQ?.hour >= 0 && (
                <p className='fs-4 fw-bold'>{createQ?.hour} hr(s)</p>
              )}
              {createQ?.minute && (
                <p className='fs-4 fw-bold'>{createQ?.minute} Min(s)</p>
              )}
            </div>
          </div>
        </div>
      )}

      {!allLoading &&
        ((question_type === "objective" && objectiveQ?.length !== 0) ||
          (question_type === "theory" && theoryQ?.length !== 0)) && (
          <div
            className={`d-flex justify-content-center align-items-center py-4 px-y `}
          >
            <p className={`fw-medium fs-4 text-danger text-center lh-base`}>
              *** Only published questions will be displayed to the student ***
            </p>
          </div>
        )}
      {/* {!allLoading &&
        ((question_type === "objective" && objectiveQ?.length !== 0) ||
          (question_type === "theory" && theoryQ?.length !== 0)) && (
          <div
            className={`d-flex justify-content-center align-items-center py-4 px-y ${
              published ? "bg-success  " : "bg-danger"
            } bg-opacity-10 `}
          >
            <p className={`${published ? "text-success  " : "text-danger"}  `}>
              {published
                ? "Assignment is published"
                : "Assignment is not yet published"}
            </p>
          </div>
        )} */}
    </div>
  );
};

export default MarkCard;
