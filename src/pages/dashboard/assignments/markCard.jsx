import React from "react";

const MarkCard = ({
  allLoading,
  question_type,
  objectiveQ,
  theoryQ,
  finalObjectiveArray,
  finalTheoryArray,
  theory_total_mark,
}) => {
  return (
    <div className='d-flex flex-column flex-sm-row justify-content-center align-items-center mt-5 gap-5'>
      {!allLoading &&
        question_type === "objective" &&
        objectiveQ?.length > 0 && (
          <div className='d-flex justify-content-center align-items-center gap-3 bg-info bg-opacity-10 py-4 px-4'>
            <p className='fs-3 fw-bold'>Total Question(s):</p>
            <p className='fs-3 fw-bold'>
              {objectiveQ?.length}
              {/* {objectiveQ?.length} /{" "}
              {
                finalObjectiveArray[finalObjectiveArray?.length - 1]
                  ?.total_question
              } */}
            </p>
          </div>
        )}
      {question_type === "theory" && theoryQ?.length > 0 && (
        <div className='d-flex justify-content-center align-items-center gap-3 bg-info bg-opacity-10 py-4 px-4'>
          <p className='fs-3 fw-bold'>Total Question(s):</p>
          <p className='fs-3 fw-bold'>
            {theoryQ?.length}
            {/* {theoryQ?.length} /{" "}
            {finalTheoryArray[finalTheoryArray?.length - 1]?.total_question} */}
          </p>
        </div>
      )}
      {question_type === "objective" && objectiveQ?.length > 0 && (
        <div className='d-flex justify-content-center align-items-center gap-3 bg-info bg-opacity-10 py-4 px-4'>
          <p className='fs-3 fw-bold'>Each Question:</p>
          <p className='fs-3 fw-bold'>
            {
              finalObjectiveArray[finalObjectiveArray?.length - 1]
                ?.question_mark
            }{" "}
            mk(s)
          </p>
        </div>
      )}
      {question_type === "objective" && objectiveQ?.length > 0 && (
        <div className='d-flex justify-content-center align-items-center  gap-3 bg-info bg-opacity-10 py-4 px-4'>
          <p className='fs-3 fw-bold'>Total Marks:</p>
          <p className='fs-3 fw-bold'>
            {finalObjectiveArray[finalObjectiveArray?.length - 1]
              ?.question_mark * objectiveQ?.length}{" "}
            mk(s)
          </p>
        </div>
      )}
      {question_type === "theory" && theoryQ?.length > 0 && (
        <div className='d-flex justify-content-center align-items-center gap-3 bg-info bg-opacity-10 py-4 px-4'>
          <p className='fs-3 fw-bold'>Total Mark:</p>
          <p className='fs-3 fw-bold'>
            {/* {finalTheoryArray[finalTheoryArray?.length - 1]?.total_mark}{" "} */}
            {theory_total_mark}
            mk(s)
          </p>
        </div>
      )}
    </div>
  );
};

export default MarkCard;
