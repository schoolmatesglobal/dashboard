import React from "react";
import { useAssignments } from "../../../../hooks/useAssignments";
import styles from "../../../../assets/scss/pages/dashboard/studentAssignment.module.scss";

const Objective = ({ assignmentLoading, data, refetchMarkedAssignment }) => {
  const { markedObjectiveQ, markedObjectiveQ2 } = useAssignments();

  console.log({ markedObjectiveQ, markedObjectiveQ2 });

  return (
    <div>
      {!assignmentLoading && data.length >= 1 && (
        <div className={styles.objective}>
          <div className=''>
            <p className='fw-bold fs-2 mt-5'>Objective Section</p>
            <div className='d-flex flex-column my-5 gap-3'>
              {data
                ?.sort((a, b) => {
                  if (a.question_number < b.question_number) {
                    return -1;
                  }
                  if (a.question_number > b.question_number) {
                    return 1;
                  }
                  return 0;
                })
                .map((CQ, index) => {
                  // console.log({ CQS: CQ });
                  return (
                    <div
                      className='w-100 border border-2 rounded-1 border-opacity-25 p-5'
                      key={index}
                    >
                      <p className='fs-3 mb-3 lh-base'>
                        <span className='fw-bold fs-3'>
                          {CQ.question_number}.
                        </span>{" "}
                        {CQ.question}{" "}
                      </p>
                      <p className='fw-bold fs-3 mb-4 lh-base'>
                        ({CQ.question_mark} mk(s) )
                      </p>
                      {CQ.image && (
                        <div className='mb-4 '>
                          <img src={CQ.image} width={70} height={70} alt='' />
                        </div>
                      )}
                      <>
                        {/* Correct Answer */}
                        <p className='fs-3 mb-3 lh-base'>
                          <span className='fw-bold fs-3'>Correct Answer:</span>{" "}
                          {CQ.correct_answer}{" "}
                        </p>
                      </>
                      <>
                        {/* Student's Answer */}
                        <p
                          className={`fs-3 lh-base ${
                            CQ.correct_answer === CQ.answer
                              ? "text-success"
                              : "text-danger"
                          }`}
                        >
                          <span className='fw-bold fs-3'>
                            Student's Answer:
                          </span>{" "}
                          {CQ.answer}{" "}
                        </p>
                      </>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Objective;
