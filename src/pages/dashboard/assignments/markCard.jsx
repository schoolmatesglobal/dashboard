import React from "react";
import AuthInput from "../../../components/inputs/auth-input";
import Button from "../../../components/buttons/button";

const MarkCard = ({
  allLoading,
  question_type,
  objectiveQ,
  theoryQ,
  finalObjectiveArray,
  finalTheoryArray,
  theory_total_mark,
  published,
  createQ,
  setCreateQ,
  objMark,
  setObjMark,
}) => {
  const totalTheoryScore = theoryQ.reduce(
    (acc, quest) => acc + Number(quest?.question_mark),
    0
  );
  const objScore =
    objectiveQ?.reduce((acc, quest) => acc + Number(quest?.question_mark), 0) /
    objectiveQ?.length;

  console.log({ totalTheoryScore, theoryQ });

  // const sumMark = questions.reduce(
  //   (acc, question) => acc + Number(question.teacher_mark),
  //   0
  // );

  return (
    <div className='d-flex flex-column gap-5'>
      <div className='d-flex flex-column flex-sm-row justify-content-center align-items-center mt-5 gap-5'>
        {question_type === "objective" && objectiveQ?.length > 0 && (
          // <div className='d-flex  justify-content-center align-items-center '>
          //   <AuthInput
          //     type='number'
          //     placeholder='Enter Question Mark'
          //     // hasError={!!errors.username}
          //     value={objMark}
          //     name='option6'
          //     min='0'
          //     style={{ width: "150px" }}
          //     onChange={(e) => {
          //       setObjMark(e.target.value);
          //     }}
          //     wrapperClassName=''
          //   />
          //   <Button>Update</Button>
          // </div>
          <div className='d-flex justify-content-center align-items-center gap-3 bg-info bg-opacity-10 py-4 px-4'>
            <p className='fs-3 fw-bold'>Each Question Mark:</p>
            <p className='fs-3 fw-bold'>{objScore}</p>
          </div>
        )}

        <div className=''>
          {!allLoading &&
            question_type === "objective" &&
            objectiveQ?.length > 0 && (
              <div className='d-flex justify-content-center align-items-center gap-3 bg-info bg-opacity-10 py-4 px-4'>
                <p className='fs-3 fw-bold'>Total Question(s):</p>
                <p className='fs-3 fw-bold'>{objectiveQ?.length}</p>
              </div>
            )}
        </div>

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
          <div className='d-flex justify-content-center align-items-center  gap-3 bg-info bg-opacity-10 py-4 px-4'>
            <p className='fs-3 fw-bold'>Total Marks:</p>
            <p className='fs-3 fw-bold'>{objScore * objectiveQ?.length} mk(s)</p>
          </div>
        )}
        {question_type === "theory" && theoryQ?.length > 0 && (
          <div className='d-flex justify-content-center align-items-center gap-3 bg-info bg-opacity-10 py-4 px-4'>
            <p className='fs-3 fw-bold'>Total Mark:</p>
            <p className='fs-3 fw-bold'>
              {/* {finalTheoryArray[finalTheoryArray?.length - 1]?.total_mark}{" "} */}
              {totalTheoryScore}
              mk(s)
            </p>
          </div>
        )}
      </div>

      {!allLoading &&
        ((question_type === "objective" && objectiveQ?.length !== 0) ||
          (question_type === "theory" && theoryQ?.length !== 0)) && (
          <div
            className={`d-flex justify-content-center align-items-center py-4  ${
              published ? "bg-success  " : "bg-danger"
            } bg-opacity-10 `}
          >
            <p className={`${published ? "text-success  " : "text-danger"}  `}>
              {published
                ? "Assignment is published"
                : "Assignment is not yet published"}
            </p>
          </div>
        )}
    </div>
  );
};

export default MarkCard;
