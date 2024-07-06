import React from "react";
import AuthInput from "../../../components/inputs/auth-input";
import Button from "../../../components/buttons/button";

const NoteCard = ({
  allLoading,
  question_type,
  objectiveQ,
  theoryQ,
  published,
  createQ,
  subjects,
}) => {
  // const totalTheoryScore = theoryQ.reduce(
  //   (acc, quest) => acc + Number(quest?.question_mark),
  //   0
  // );
  // const objScore =
  //   objectiveQ?.reduce((acc, quest) => acc + Number(quest?.question_mark), 0) /
  //   objectiveQ?.length;

  const subName = subjects?.find(
    (ob) => Number(ob.id) === Number(createQ.subject_id)
  )?.subject;

  // console.log({ totalTheoryScore, theoryQ });

  // const sumMark = questions.reduce(
  //   (acc, question) => acc + Number(question.teacher_mark),
  //   0
  // );
  // console.log({ createQ, subjects });

  return (
    <div className='d-flex flex-column'>
      <div className='d-flex flex-column flex-sm-row justify-content-center align-items-center mt-5 mb-4 gap-4 gap-sm-5'>
        {!allLoading && subName && (
          <div className='d-flex justify-content-center align-items-center gap-3 bg-info bg-opacity-10 py-4 px-4'>
            <p className='fs-3 fw-bold'>{subName} - Week {createQ?.week}</p>
            {/* <p className='fs-3 fw-bold'>{objScore}</p> */}
          </div>
        )}

        {/* <div className=''>
          {!allLoading && createQ?.week && (
            <div className='d-flex justify-content-center align-items-center gap-3 bg-info bg-opacity-10 py-4 px-4'>
              <p className='fs-3 fw-bold'>Week {createQ?.week}</p>
            </div>
          )}
        </div> */}
      </div>

      {/* {!allLoading && true && (
        <div
          className={`d-flex justify-content-center align-items-center mb-5`}
        >
          <p className={`fw-medium fs-4 text-danger text-center lh-base`}>
            *** Please always submit Lesson notes for approval when ready ***
          </p>
        </div>
      )} */}
    </div>
  );
};

export default NoteCard;
