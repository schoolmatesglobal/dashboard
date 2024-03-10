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
                // setObjectiveQ([
                //   ...objectiveQ,
                //   {
                //     term: user?.term,
                //     period: user?.period,
                //     session: user?.session,
                //     week,
                //     question_type,
                //     question,
                //     answer,
                //     subject_id,
                //     // image,
                //     option1,
                //     option2,
                //     option3,
                //     option4,
                //     total_question: Number(total_question),
                //     total_mark: Number(total_mark),
                //     question_mark: Number(question_mark),
                //     question_number: Number(question_number),
                //   },
                // ]);

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

                // setTheoryQ([
                //   ...theoryQ,
                //   {
                //     term: user?.term,
                //     period: user?.period,
                //     session: user?.session,
                //     week,
                //     question_type,
                //     question,
                //     answer,
                //     subject_id,
                //     image,
                //     total_question: Number(total_question),
                //     total_mark: Number(theory_total_mark),
                //     question_mark: Number(question_mark),
                //     question_number: Number(question_number),
                //   },
                // ]);

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
              // updateCreateQuestionFxn({
              //   image: previewUrl,
              //   imageName: imageNam,
              // });

              // setCreateQ((prev) => ({
              //   ...prev,
              //   image: previewUrl,
              //   imageName: imageNam,
              // }));

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

  console.log({ activatePreview: activatePreview() });

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
          // question_type === "objective"
          //   ? ObjectiveQ?.length + 1
          //   : question_type === "theory"
          //   ? TheoryQ?.length + 1
          //   : ""
          createQ?.question_number
        }`}
      >
        {activeTab === "1" && (
          <>
            {/* <div className="">
              <AuthSelect
                sort
                options={sortQuestionType()}
                value={defaultQuestionType()}
                label="Question Type"
                onChange={({ target: { value } }) => {
                  updateCreateQuestionFxn({ question_type: value, answer: "" });
                }}
                placeholder="Select type"
                wrapperClassName={styles.create_question_select}
                // defaultValue={questionType[1].value}
              />
            </div> */}
            {createQ?.question_type === "theory" && (
              <div>
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  Question
                </p>
                <div className='auth-textarea-wrapper'>
                  <textarea
                    className='form-control'
                    type='text'
                    value={createQ?.question}
                    placeholder='Type the assignment question'
                    onChange={(e) =>
                      setCreateQ((prev) => {
                        return { ...prev, question: e.target.value };
                      })
                    }
                    style={{
                      minHeight: "150px",
                      fontSize: "16px",
                      lineHeight: "22px",
                    }}
                  />
                </div>
                {/* <>
                  <label className={styles.create_question_label}>Image</label>
                  <CustomFileInput
                    activateError={activateError}
                    previewUrl={previewUrl}
                    setPreviewUrl={setPreviewUrl}
                    setImageUpload={setImageUpload}
                    imageUpload={imageUpload}
                    setFileUploadError={setFileUploadError}
                    fileUploadError={fileUploadError}
                    imageName={imageNam}
                    setImageName={setImageNam}
                    // data={details.personalDetails.profilePictureName}
                  />
                </> */}
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    margin: "10px 0px",
                  }}
                >
                  Answer
                </p>
                <div className='auth-textarea-wrapper'>
                  <textarea
                    className='form-control'
                    type='text'
                    value={createQ?.answer}
                    placeholder='Type the answer to the question'
                    onChange={(e) =>
                      // updateCreateQuestionFxn({
                      //   answer: e.target.value,
                      // })
                      setCreateQ((prev) => {
                        return { ...prev, answer: e.target.value };
                      })
                    }
                    style={{ minHeight: "150px", fontSize: "16px" }}
                  />
                </div>

                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    margin: "10px 0px",
                  }}
                >
                  Mark Computation
                </p>
                <div className='d-flex flex-column gap-3'>
                  {/*Question Mark */}
                  <div className='d-flex align-items-center gap-3'>
                    <div style={{ width: "100px" }}>
                      <AuthInput
                        type='number'
                        placeholder='Question Mark'
                        // hasError={!!errors.username}
                        value={createQ.question_mark}
                        name='option'
                        onChange={(e) => {
                          // updateCreateQuestionFxn({
                          //   question_mark: e.target.value,
                          //   total_mark: e.target.value,
                          // });

                          setCreateQ((prev) => {
                            return {
                              ...prev,
                              question_mark: e.target.value,
                              total_mark: e.target.value,
                            };
                          });

                          // calcObjTotal();
                        }}
                        wrapperClassName=''
                      />
                    </div>
                    <div className='d-flex align-items-center gap-3 cursor-pointer'>
                      <p
                        className=''
                        style={{ lineHeight: "18px", fontSize: "14px" }}
                      >
                        Question Mark
                      </p>
                    </div>
                  </div>
                  {/* Total Questions */}
                  {/* <div className='d-flex align-items-center gap-3'>
                    <div style={{ width: "100px" }}>
                      <AuthInput
                        type='number'
                        placeholder='Total Questions'
                        // hasError={!!errors.username}
                        value={createQ?.total_question}
                        name='option'
                        onChange={(e) => {
                          // updateCreateQuestionFxn({
                          //   total_question: e.target.value,
                          //                            });

                          setCreateQ((prev) => {
                            return {
                              ...prev,
                              total_question: e.target.value,
                            };
                          });
                          // updateTheoryTotalQuestionFxn({
                          //   newValue: e.target.value,
                          // });
                          // calcObjTotal();
                        }}
                        wrapperClassName=''
                      />
                    </div>
                    <div className='d-flex align-items-center gap-3 cursor-pointer'>
                      <p
                        className=''
                        style={{ lineHeight: "18px", fontSize: "14px" }}
                      >
                        Total Questions
                      </p>
                    </div>
                  </div> */}
                </div>
              </div>
            )}
            {createQ?.question_type === "objective" && (
              <>
                <p className='fs-3 fw-bold mb-3'>Question</p>
                <div className='auth-textarea-wrapper'>
                  <textarea
                    className='form-control'
                    type='text'
                    value={createQ?.question}
                    placeholder='Type the assignment question'
                    onChange={(e) =>
                      setCreateQ((prev) => {
                        return { ...prev, question: e.target.value };
                      })
                    }
                    style={{
                      minHeight: "150px",
                      fontSize: "16px",
                      lineHeight: "22px",
                    }}
                  />
                </div>
                {/* <>
                  <label className={styles.create_question_label}>Image</label>
                  <CustomFileInput
                    activateError={activateError}
                    previewUrl={previewUrl}
                    setPreviewUrl={setPreviewUrl}
                    setImageUpload={setImageUpload}
                    imageUpload={imageUpload}
                    setFileUploadError={setFileUploadError}
                    fileUploadError={fileUploadError}
                    imageName={imageNam}
                    setImageName={setImageNam}
                    // data={details.personalDetails.profilePictureName}
                  />
                </> */}
                <p className='fs-3 fw-bold my-3'>Options</p>
                <div className='d-flex flex-column gap-3'>
                  {/* option A */}
                  <div className='d-flex align-items-center gap-3'>
                    <div style={{ width: "250px" }}>
                      <AuthInput
                        type='text'
                        placeholder='Option A'
                        // hasError={!!errors.username}
                        value={createQ?.option1}
                        name='option'
                        onChange={(e) =>
                          // updateCreateQuestionFxn({
                          //   option1: e.target.value,
                          // })
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
                        // hasError={!!errors.username}
                        value={createQ?.option3}
                        name='option'
                        onChange={(e) =>
                          // updateCreateQuestionFxn({
                          //   option3: e.target.value,
                          // })
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
                        name='option'
                        onChange={(e) =>
                          // updateCreateQuestionFxn({
                          //   option4: e.target.value,
                          // })

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
                {/* <p className='fs-3 fw-bold mt-5'>{objMark} - Mark(s)</p>
                {objMark <= 0 && (
                  <p className='fs-4 mt-5 text-danger w-100 text-center'>
                    NB: Please assign a mark for all questions first.
                  </p>
                )} */}
                <p className='fs-3 fw-bold my-3'>Mark Computation</p>
                <div className='d-flex flex-column gap-3'>
                  {/*Question Mark */}
                  <div className='d-flex align-items-center gap-3'>
                    <div style={{ width: "100px" }}>
                      <AuthInput
                        type='number'
                        placeholder='Question Mark'
                        // hasError={!!errors.username}
                        value={objMark}
                        name='option'
                        onChange={(e) => {
                          if (objectiveQ?.length > 0) return;
                          setObjMark(e.target.value);
                        }}
                        wrapperClassName=''
                      />
                    </div>
                    <div className='d-flex align-items-center gap-3 cursor-pointer'>
                      <p
                        className=''
                        style={{ lineHeight: "18px", fontSize: "14px" }}
                      >
                        Question Mark
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
        {activeTab === "2" && (
          <>
            <p className='fw-bold fs-4 mb-3'>Questions</p>
            <p
              style={{
                fontSize: "16px",
                marginBottom: "20px",
                lineHeight: "22px",
              }}
            >
              {createQ?.question}
            </p>
            {createQ?.image && (
              <div className='mb-4 mt-4'>
                <img src={createQ?.image} width={150} alt='' />
              </div>
            )}
            {createQ?.question_type === "objective" && (
              <>
                <p className='fw-bold fs-4 my-4'>Options</p>
                <div className='d-flex flex-column gap-3 mb-5'>
                  <p
                    // className={styles.create_question_answer}
                    style={{ fontSize: "16px" }}
                  >
                    A. {option1}
                    {answer === option1 && " (Correct Answer)"}
                  </p>
                  <p style={{ fontSize: "16px" }}>
                    B. {option2}
                    {answer === option2 && " - (Correct Answer)"}
                  </p>
                  <p style={{ fontSize: "16px" }}>
                    C. {option3}
                    {answer === option3 && " - (Correct Answer)"}
                  </p>
                  <p style={{ fontSize: "16px" }}>
                    D. {option4}
                    {answer === option4 && " - (Correct Answer)"}
                  </p>
                </div>
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  Mark
                </p>
                <p className={styles.create_question_answer}>{objMark} mk(s)</p>
              </>
            )}
            {createQ?.question_type === "theory" && (
              <>
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  Answer
                </p>
                <p
                  style={{
                    fontSize: "16px",
                    lineHeight: "22px",
                    marginBottom: "20px",
                  }}
                >
                  {createQ?.answer}
                </p>
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  Mark
                </p>
                <p className={styles.create_question_answer}>
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
