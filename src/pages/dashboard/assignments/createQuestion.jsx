import React, { useEffect, useState } from "react";

import Prompt from "../../../components/modals/prompt";
import AuthInput from "../../../components/inputs/auth-input";
import { useAssignments } from "../../../hooks/useAssignments";
import styles from "../../../assets/scss/pages/dashboard/assignment.module.scss";
import { addQuestionMarks, updateQuestionNumbers } from "./constant";
// import SelectSearch from "../inputs/SelectSearch";

const CreateQuestion = ({
  createQuestionPrompt,
  setCreateQuestionPrompt,
  createQ,
  setCreateQ,
  objectiveQ,
  theoryQ,
  setObjectiveQ,
  setTheoryQ,
  obj,
  setObj,
  addObjectAssignmentLoading,
  addObjectiveAssignments,
  addTheoryAssignments,
  addTheoryAssignmentLoading,
  allowFetch,
  setAllowFetch,
  refetchAssignmentCreated,
  objMark,
  setObjMark,
}) => {
  const {
    user,

    updateCreateQuestionFxn,
  } = useAssignments();

  const {
    option1,
    option2,
    option3,
    option4,
    total_mark,
    theory_total_mark,
    total_question,
    question_mark,
    question_number,
    ans1,
    ans2,
    ans3,
    ans4,
    answer,
    question_type,
    question,
    subject,
    image,
    imageName,
    term,
    period,
    session,
    subject_id,
    week,
  } = createQ;
  // const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  // const [imageUpload, setImageUpload] = useState(null);

  const [previewUrl, setPreviewUrl] = useState("");

  const [imageNam, setImageNam] = useState("No file selected");
  // const [activateError, setActivateError] = useState(false);
  // const [fileUploadError, setFileUploadError] = useState("");
  const [activeTab, setActiveTab] = useState("1");

  // const [correctAns, setCorrectAns] = useState("");

  const questionType = [
    {
      value: "objective",
      title: "objective",
    },

    {
      value: "theory",
      title: "theory",
    },
  ];

  const sortQuestionType = () => {
    let arr = [];
    if (objectiveQ.length >= 1) {
      arr.push({
        value: "objective",
        title: "objective",
      });
    } else if (theoryQ.length >= 1) {
      arr.push({
        value: "theory",
        title: "theory",
      });
    } else {
      arr.push(
        {
          value: "objective",
          title: "objective",
        },

        {
          value: "theory",
          title: "theory",
        }
      );
    }
    return arr;
  };

  const activatePreview = () => {
    switch (question_type) {
      case "objective":
        if (
          !subject_id ||
          !week ||
          !question_type ||
          !question ||
          !option1 ||
          !option2 ||
          !option3 ||
          !option4 ||
          !answer ||
          !objMark
          // total_mark === 0 ||
          // total_question === 0 ||
          // question_mark === 0 ||
          // total_mark === "" ||
          // total_question === "" ||

          // question_mark === 0
        ) {
          return true;
        }
        break;
      case "theory":
        if (
          !subject_id ||
          !week ||
          !question_type ||
          !question ||
          !answer ||
          // total_question === 0 ||
          // question_mark === 0 ||
          // total_question === "" ||
          !question_mark
        ) {
          return true;
        }
        break;

      default:
        return false;
        break;
    }
  };

  const calcObjTotal = () => {
    const total = total_question * question_mark;
    updateCreateQuestionFxn({
      total_mark: total,
    });
  };

  const buttonOptions = [
    {
      title: `${activeTab === "2" ? "Back" : "Cancel"}`,
      onClick:
        activeTab === "2"
          ? () => {
              setActiveTab("1");
              if (createQ?.question_type === "theory") {
                // updateCreateQuestionFxn({
                //   theory_total_mark:
                //     Number(theory_total_mark) - Number(total_mark),
                //   question_number: theoryQ?.length - 1,
                //   total_mark: "",
                // });
                setCreateQ((prev) => ({
                  ...prev,
                  theory_total_mark:
                    Number(theory_total_mark) - Number(total_mark),
                  question_number: theoryQ?.length - 1,
                  total_mark: "",
                }));
              } else if (createQ?.question_type === "objective") {
                // updateCreateQuestionFxn({
                //   question_number: objectiveQ?.length - 1,
                // });

                setCreateQ((prev) => ({
                  ...prev,
                  question_number: objectiveQ?.length - 1,
                }));
              }
            }
          : () => setCreateQuestionPrompt(false),
      variant: "outline",
    },
    {
      title: `${activeTab === "2" ? "Add Question" : "Preview"}`,
      disabled: activatePreview(),
      isLoading: addObjectAssignmentLoading || addTheoryAssignmentLoading,
      onClick:
        activeTab === "2"
          ? async () => {
              setImageNam("No file selected");

              if (createQ?.question_type === "objective") {
                await addObjectiveAssignments();
                setAllowFetch(true);

                refetchAssignmentCreated();

                setCreateQ({
                  ...createQ,
                  option1: "",
                  option2: "",
                  option3: "",
                  option4: "",
                  ans1: false,
                  ans2: false,
                  ans3: false,
                  ans4: false,
                  answer: "",
                  theoryAns: "",
                  // question_type: "",
                  question: "",
                  question_number: 0,
                  // question_mark: 0,
                  // total_mark: 0,
                  // subject: "",
                  image: "",
                  imageName: "",
                  // term: "",
                  // period: "",
                  // session: "",
                  // subject_id: "",
                });
              } else if (question_type === "theory") {
                await addTheoryAssignments();

                setAllowFetch(true);

                refetchAssignmentCreated();

                setCreateQ({
                  ...createQ,
                  option1: "",
                  option2: "",
                  option3: "",
                  option4: "",
                  ans1: false,
                  ans2: false,
                  ans3: false,
                  ans4: false,
                  answer: "",
                  theoryAns: "",
                  // question_type: "",
                  question: "",
                  question_mark: 0,
                  total_mark: 0,
                  // subject: "",
                  image: "",
                  imageName: "",
                  question_number: 0,
                  // term: "",
                  // period: "",
                  // session: "",
                  // subject_id: "",
                });
              }

              setCreateQuestionPrompt(false);
              setActiveTab("1");
            }
          : () => {
              if (question_type === "theory") {
                setCreateQ((prev) => ({
                  ...prev,
                  theory_total_mark:
                    Number(theory_total_mark) + Number(total_mark),
                }));
              } else if (question_type === "objective") {
                setCreateQ((prev) => ({
                  ...prev,
                  question_number: objectiveQ?.length + 1,
                }));
              }

              setActiveTab("2");
            },
      // variant: "outline",
    },
  ];

  const defaultQuestionType = () => {
    switch (question_type) {
      case "theory":
        return questionType[1].value;
        break;
      case "objective":
        return questionType[0].value;
        break;

      default:
        return "";
        break;
    }
  };

  const totalMark = addQuestionMarks(theoryQ);

  const finalTheoryArray = updateQuestionNumbers(totalMark);

  const finalObjectiveArray = updateQuestionNumbers(objectiveQ);

  useEffect(() => {
    const objScore =
      objectiveQ?.reduce(
        (acc, quest) => acc + Number(quest?.question_mark),
        0
      ) / objectiveQ?.length;
    setObjMark(objScore);
  }, [objectiveQ]);

  // console.log({ activatePreview: activatePreview() });

  // console.log({ total_mark, theory_total_mark, total_question, question_mark });
  // console.log({ tl: TheoryQ?.length });

  return (
    <div className={styles.create_question}>
      <Prompt
        isOpen={createQuestionPrompt}
        toggle={() => setCreateQuestionPrompt(!createQuestionPrompt)}
        hasGroupedButtons={true}
        groupedButtonProps={buttonOptions}
        singleButtonText='Preview'
        promptHeader={`${subject?.toUpperCase()} (WEEK ${createQ?.week?.toUpperCase()}) - ${createQ?.question_type?.toUpperCase()} - Q${
          createQ?.question_number
        }`}
      >
        {activeTab === "1" && (
          <>
            {createQ?.question_type === "theory" && (
              <div>
                <p className='fs-3 fw-bold mb-3'>Question</p>
                <div className='auth-textarea-wrapper'>
                  <textarea
                    className='form-control fs-3 lh-base'
                    type='text'
                    value={createQ?.question}
                    placeholder='Type the assignment question'
                    onChange={(e) =>
                      setCreateQ((prev) => {
                        return { ...prev, question: e.target.value };
                      })
                    }
                    style={{
                      minHeight: "200px",
                      // lineHeight: "22px",
                    }}
                  />
                </div>

                <p className='fs-3 fw-bold my-4'>Answer</p>
                <div className='auth-textarea-wrapper'>
                  <textarea
                    className='form-control fs-3 lh-base'
                    type='text'
                    value={createQ?.answer}
                    placeholder='Type the answer to the question'
                    onChange={(e) =>
                      setCreateQ((prev) => {
                        return { ...prev, answer: e.target.value };
                      })
                    }
                    style={{ minHeight: "200px" }}
                  />
                </div>

                <p className='fs-3 fw-bold my-4'>Mark Computation</p>

                <div className='d-flex flex-column gap-3'>
                  {/*Question Mark */}
                  <div className='d-flex align-items-center gap-3'>
                    <div style={{ width: "100px" }}>
                      <AuthInput
                        type='number'
                        placeholder='Question Mark'
                        value={createQ.question_mark}
                        name='option'
                        className='fs-3'
                        onChange={(e) => {
                          setCreateQ((prev) => {
                            return {
                              ...prev,
                              question_mark: e.target.value,
                              total_mark: e.target.value,
                            };
                          });
                        }}
                        wrapperClassName=''
                      />
                    </div>
                    <div className='d-flex align-items-center gap-3 cursor-pointer'>
                      <p
                        className='fs-3'
                        // style={{ lineHeight: "18px", fontSize: "14px" }}
                      >
                        Question Mark
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {createQ?.question_type === "objective" && (
              <>
                <p className='fs-3 fw-bold my-4'>Question</p>
                <div className='auth-textarea-wrapper'>
                  <textarea
                    className='form-control fs-3 lh-base'
                    type='text'
                    value={createQ?.question}
                    placeholder='Type the assignment question'
                    onChange={(e) =>
                      setCreateQ((prev) => {
                        return { ...prev, question: e.target.value };
                      })
                    }
                    style={{
                      minHeight: "200px",
                    }}
                  />
                </div>

                <p className='fs-3 fw-bold my-4'>Options</p>
                <div className='d-flex flex-column gap-3'>
                  {/* option A */}
                  <div className='d-flex align-items-center gap-3'>
                    <div style={{ width: "250px" }}>
                      <AuthInput
                        type='text'
                        placeholder='Option A'
                        className='fs-3'
                        // hasError={!!errors.username}
                        value={createQ?.option1}
                        name='option'
                        onChange={(e) =>
                          setCreateQ((prev) => {
                            return { ...prev, option1: e.target.value };
                          })
                        }
                        wrapperClassName=''
                      />
                    </div>
                    <div className='d-flex align-items-center gap-3 cursor-pointer'>
                      <input
                        type='radio'
                        name='radio-1'
                        checked={createQ?.ans1 && !!createQ?.option1}
                        id='option-A'
                        style={{ width: "20px", height: "20px" }} // Set the width using inline styles
                        onChange={(e) => {
                          setCreateQ((prev) => {
                            return {
                              ...prev,
                              ans1: e.target.checked,
                              ans2: false,
                              ans3: false,
                              ans4: false,
                              answer: e.target.value,
                            };
                          });
                        }}
                        value={createQ?.option1}
                      />
                      <label htmlFor='option-A' className='fs-4 fw-bold'>
                        A. Correct answer
                      </label>
                    </div>
                  </div>
                  {/* option B */}
                  <div className='d-flex align-items-center gap-3'>
                    <div style={{ width: "250px" }}>
                      <AuthInput
                        type='text'
                        placeholder='Option B'
                        // hasError={!!errors.username}
                        value={createQ?.option2}
                        className='fs-3'
                        name='option'
                        onChange={(e) =>
                          setCreateQ((prev) => {
                            return { ...prev, option2: e.target.value };
                          })
                        }
                        wrapperClassName=''
                      />
                    </div>
                    <div className='d-flex align-items-center gap-3 cursor-pointer'>
                      <input
                        type='radio'
                        name='radio-1'
                        style={{ width: "20px", height: "20px" }} // Set the width using inline styles
                        checked={createQ?.ans2 && !!createQ?.option2}
                        id='option-B'
                        onChange={(e) =>
                          setCreateQ((prev) => {
                            return {
                              ...prev,
                              ans2: e.target.checked,
                              ans1: false,
                              ans3: false,
                              ans4: false,
                              answer: e.target.value,
                            };
                          })
                        }
                        value={createQ?.option2}
                      />
                      <label htmlFor='option-B' className='fs-4 fw-bold'>
                        B. Correct answer
                      </label>
                    </div>
                  </div>
                  {/* option C */}
                  <div className='d-flex align-items-center gap-3'>
                    <div style={{ width: "250px" }}>
                      <AuthInput
                        type='text'
                        placeholder='Option C'
                        value={createQ?.option3}
                        className='fs-3'
                        name='option'
                        onChange={(e) =>
                          setCreateQ((prev) => {
                            return { ...prev, option3: e.target.value };
                          })
                        }
                        wrapperClassName=''
                      />
                    </div>
                    <div className='d-flex align-items-center gap-3 cursor-pointer'>
                      <input
                        type='radio'
                        name='radio-1'
                        style={{ width: "20px", height: "20px" }}
                        // Set the width using inline styles
                        checked={createQ?.ans3 && !!createQ?.option3}
                        id='option-C'
                        onChange={(e) =>
                          setCreateQ((prev) => {
                            return {
                              ...prev,
                              ans3: e.target.checked,
                              ans1: false,
                              ans2: false,
                              ans4: false,
                              answer: e.target.value,
                            };
                          })
                        }
                        value={createQ?.option3}
                      />
                      <label htmlFor='option-C' className='fs-4 fw-bold'>
                        C. Correct answer
                      </label>
                    </div>
                  </div>
                  {/* option D */}
                  <div className='d-flex align-items-center gap-3'>
                    <div style={{ width: "250px" }}>
                      <AuthInput
                        type='text'
                        placeholder='Option D'
                        // hasError={!!errors.username}
                        value={createQ?.option4}
                        className='fs-3'
                        name='option'
                        onChange={(e) =>
                          setCreateQ((prev) => {
                            return { ...prev, option4: e.target.value };
                          })
                        }
                        wrapperClassName=''
                      />
                    </div>
                    <div className='d-flex align-items-center gap-3 cursor-pointer'>
                      <input
                        type='radio'
                        name='radio-1'
                        id='option-D'
                        style={{ width: "20px", height: "20px" }} // Set the width using inline styles
                        checked={createQ?.ans4 && !!createQ?.option4}
                        onChange={(e) =>
                          setCreateQ((prev) => {
                            return {
                              ...prev,
                              ans4: e.target.checked,
                              ans2: false,
                              ans3: false,
                              ans1: false,
                              answer: e.target.value,
                            };
                          })
                        }
                        value={createQ?.option4}
                      />
                      <label htmlFor='option-D' className='fs-4 fw-bold'>
                        D. Correct answer
                      </label>
                    </div>
                  </div>
                </div>

                <p className='fs-3 fw-bold my-4'>Mark Computation</p>
                <div className='d-flex flex-column gap-3'>
                  {/*Question Mark */}
                  <div className='d-flex align-items-center gap-3'>
                    <div style={{ width: "100px" }}>
                      <AuthInput
                        type='number'
                        placeholder='Mark'
                        // hasError={!!errors.username}
                        value={objMark}
                        name='option'
                        className='fs-3'
                        onChange={(e) => {
                          if (objectiveQ?.length > 0) return;
                          setObjMark(e.target.value);
                        }}
                        wrapperClassName=''
                      />
                    </div>
                    <div className='d-flex align-items-center gap-3 cursor-pointer'>
                      <p className='fs-3'>Question Mark</p>
                    </div>
                  </div>
                </div>
                <p className='fs-4  mt-4 text-danger'>
                  NB: Mark will be the same for all questions
                </p>
              </>
            )}
          </>
        )}
        {activeTab === "2" && (
          <>
            <p className='fw-bold fs-3 mb-3'>Questions</p>
            <p className='fs-3 lh-base mb-4'>{createQ?.question}</p>
            {createQ?.image && (
              <div className='mb-4 mt-4'>
                <img src={createQ?.image} width={150} alt='' />
              </div>
            )}
            {createQ?.question_type === "objective" && (
              <>
                <p className='fw-bold fs-3 my-4'>Options</p>
                <div className='d-flex flex-column gap-3 mb-5'>
                  <p className='fs-3'>
                    A. {option1}
                    {answer === option1 && " (Correct Answer)"}
                  </p>
                  <p className='fs-3'>
                    B. {option2}
                    {answer === option2 && " - (Correct Answer)"}
                  </p>
                  <p className='fs-3'>
                    C. {option3}
                    {answer === option3 && " - (Correct Answer)"}
                  </p>
                  <p className='fs-3'>
                    D. {option4}
                    {answer === option4 && " - (Correct Answer)"}
                  </p>
                </div>
                <p className='fw-bold fs-3 mb-3'>Mark</p>
                <p className='fs-3 mb-4'>{objMark} mk(s)</p>
              </>
            )}
            {createQ?.question_type === "theory" && (
              <>
                <p className='fw-bold fs-3 mb-3'>Answer</p>
                <p className='fs-3 lh-base mb-4'>{createQ?.answer}</p>
                <p className='fw-bold fs-3 mb-3'>Mark</p>
                <p className='fs-3 lh-base mb-4'>
                  {createQ?.question_mark} mk(s)
                </p>
              </>
            )}
          </>
        )}
      </Prompt>
    </div>
  );
};

export default CreateQuestion;
