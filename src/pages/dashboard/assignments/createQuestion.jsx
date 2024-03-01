import React, { useState } from "react";

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
}) => {
  const {
    updateActiveTabFxn,

    subjectsByTeacher,
    subjectsByTeacherLoading,

    classSubjects,
    apiServices,
    errorHandler,
    permission,
    user,
    //

    // QUERIES
    addObjectiveAssignments,
    addObjectAssignmentLoading,
    //
    addTheoryAssignments,
    addTheoryAssignmentLoading,
    //

    // CREATE
    updateCheckObjectiveQuestionFxn,
    checkObjectiveQ,
    //
    updateCheckTheoryQuestionFxn,
    checkTheoryQ,
    //
    updateCreateQuestionFxn,
    // emptyCreateQuestionFxn,
    createQuestion,
    //
    // updateObjectiveQuestionFxn,
    // addObjectiveQuestionFxn,
    editObjectiveQuestionFxn,
    deleteObjectiveQuestionFxn,
    emptyObjectiveQFxn,
    updateObjectiveQMarkFxn,
    updateObjectiveTotalQuestionFxn,
    // objectiveQ,
    //
    // addTheoryQuestionFxn,
    editTheoryQuestionFxn,
    deleteTheoryQuestionFxn,
    emptyTheoryQFxn,
    updateTheoryTotalQuestionFxn,
    // theoryQ,
    //

    // CREATED
    updateCreatedQuestionFxn,
    // createdQuestion,
    //
    // updateObjectiveQFxn,
    // ObjectiveQ,
    //
    // updateTheoryQFxn,
    // theoryQ,
    //
    // assignmentLoadingCreated,
    refetchAssignmentCreated,
    //

    // createQ,
    // setCreateQ,
    // objectiveQ,
    // theoryQ,
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
          !subject ||
          !week ||
          !question_type ||
          !question ||
          !option1 ||
          !option2 ||
          !option3 ||
          !option4 ||
          answer === "" ||
          total_mark === 0 ||
          total_question === 0 ||
          question_mark === 0 ||
          total_mark === "" ||
          total_question === "" ||
          question_mark === ""
        ) {
          return true;
        }
        break;
      case "theory":
        if (
          !subject ||
          !week ||
          !question_type ||
          !question ||
          !answer ||
          total_question === 0 ||
          question_mark === 0 ||
          total_question === "" ||
          question_mark === ""
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
      // isLoading: `${activeTab === "2" ? isLoading : isLoading}`,
      onClick:
        activeTab === "2"
          ? () => {
              setImageNam("No file selected");

              if (createQ?.question_type === "objective") {
                setObjectiveQ([
                  ...objectiveQ,
                  {
                    term: user?.term,
                    period: user?.period,
                    session: user?.session,
                    week,
                    question_type,
                    question,
                    answer,
                    subject_id,
                    // image,
                    option1,
                    option2,
                    option3,
                    option4,
                    total_question: Number(total_question),
                    total_mark: Number(total_mark),
                    question_mark: Number(question_mark),
                    question_number: Number(question_number),
                  },
                ]);

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
                // addTheoryQuestionFxn({
                //   term: user?.term,
                //   period: user?.period,
                //   session: user?.session,
                //   week,
                //   question_type,
                //   question,
                //   answer,
                //   subject_id,
                //   image,
                //   total_question: Number(total_question),
                //   total_mark: Number(theory_total_mark),
                //   question_mark: Number(question_mark),
                //   question_number: Number(question_number),
                // });

                setTheoryQ([
                  ...theoryQ,
                  {
                    term: user?.term,
                    period: user?.period,
                    session: user?.session,
                    week,
                    question_type,
                    question,
                    answer,
                    subject_id,
                    image,
                    total_question: Number(total_question),
                    total_mark: Number(theory_total_mark),
                    question_mark: Number(question_mark),
                    question_number: Number(question_number),
                  },
                ]);

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
                  // term: "",
                  // period: "",
                  // session: "",
                  // subject_id: "",
                });
              }
              // updateCreatedQ({
              //   subject,
              //   subject_id,
              //   question_type,
              //   term: user?.term,
              //   period: user?.period,
              //   session: user?.session,
              // });

              setCreateQuestionPrompt(false);
              setActiveTab("1");
            }
          : () => {
              // updateCreateQuestionFxn({
              //   image: previewUrl,
              //   imageName: imageNam,
              // });

              setCreateQ((prev) => ({
                ...prev,
                image: previewUrl,
                imageName: imageNam,
              }));

              if (question_type === "theory") {
                // updateCreateQuestionFxn({
                //   theory_total_mark:
                //     Number(theory_total_mark) + Number(total_mark),
                //   // question_number: TheoryQ?.length + 1,
                // });

                setCreateQ((prev) => ({
                  ...prev,
                  theory_total_mark:
                    Number(theory_total_mark) + Number(total_mark),
                }));
              } else if (question_type === "objective") {
                // updateCreateQuestionFxn({
                //   // question_number: ObjectiveQ?.length + 1,
                // });
                // setCreateQ((prev) => ({
                //   ...prev,
                //   theory_total_mark:
                //     Number(theory_total_mark) + Number(total_mark),
                // }));
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

  // console.log({ cq: createQ, objectiveQ });

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
                  <div className='d-flex align-items-center gap-3'>
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
                  </div>
                </div>
              </div>
            )}
            {createQ?.question_type === "objective" && (
              <>
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
                  Options
                </p>
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
                        checked={createQ?.ans1}
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
                      <label
                        htmlFor='option-A'
                        style={{ lineHeight: "18px", fontSize: "13px" }}
                      >
                        Correct answer
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
                        checked={createQ?.ans2}
                        id='option-B'
                        onChange={(e) =>
                          // updateCreateQuestionFxn({
                          //   ans2: e.target.checked,
                          //   ans1: false,
                          //   ans3: false,
                          //   ans4: false,
                          //   answer: e.target.value,
                          // })
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
                      <label
                        htmlFor='option-B'
                        style={{ lineHeight: "18px", fontSize: "13px" }}
                      >
                        Correct answer
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
                        checked={createQ?.ans3}
                        id='option-C'
                        onChange={(e) =>
                          // updateCreateQuestionFxn({
                          //   ans3: e.target.checked,
                          //   ans1: false,
                          //   ans2: false,
                          //   ans4: false,
                          //   answer: e.target.value,
                          // })

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
                      <label
                        htmlFor='option-C'
                        style={{ lineHeight: "18px", fontSize: "13px" }}
                      >
                        Correct answer
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
                        checked={createQ?.ans4}
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
                      <label
                        htmlFor='option-D'
                        style={{ lineHeight: "18px", fontSize: "13px" }}
                      >
                        Correct answer
                      </label>
                    </div>
                  </div>
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
                  <div className='d-flex align-items-center gap-3'>
                    {/* Total Questions */}
                    <div style={{ width: "100px" }}>
                      <AuthInput
                        type='number'
                        placeholder='Total Questions'
                        // hasError={!!errors.username}
                        value={createQ.total_question}
                        name='option'
                        onChange={(e) => {
                          // updateCreateQuestionFxn({
                          //   total_question: e.target.value,
                          //   total_mark: e.target.value * question_mark,
                          // });
                          setCreateQ((prev) => {
                            return {
                              ...prev,
                              total_question: e.target.value,
                              total_mark:
                                Number(e.target.value) *
                                Number(createQ.question_mark),
                            };
                          });
                          // if (objectiveQ.length > 1) {
                          //   updateObjectiveTotalQuestionFxn({
                          //     newValue: e.target.value,
                          //   });
                          // }
                          // calcObjTotal();
                        }}
                        wrapperClassName=''
                      />
                    </div>
                    <div className='d-flex align-items-center gap-3 cursor-pointer'>
                      <p
                        className=''
                        style={{ lineHeight: "18px", fontSize: "13px" }}
                      >
                        Total Questions
                      </p>
                    </div>
                  </div>

                  <div className='d-flex align-items-center gap-3'>
                    {/*Question Mark */}
                    <div style={{ width: "100px" }}>
                      <AuthInput
                        type='number'
                        placeholder='Question Mark'
                        disabled={finalObjectiveArray.length >= 1}
                        // hasError={!!errors.username}
                        value={
                          createQ.question_mark ||
                          finalObjectiveArray[finalObjectiveArray.length - 1]
                            ?.question_mark
                        }
                        name='option'
                        onChange={(e) => {
                          // updateCreateQuestionFxn({
                          //   question_mark: e.target.value,
                          //   total_mark: e.target.value * total_question,
                          // });
                          setCreateQ((prev) => {
                            return {
                              ...prev,
                              question_mark: e.target.value,
                              total_mark:
                                Number(e.target.value) * Number(total_question),
                            };
                          });
                          // if (objectiveQ.length > 1) {
                          //   updateObjectiveQMarkFxn({
                          //     newValue: e.target.value,
                          //   });
                          // }
                          // calcObjTotal();
                        }}
                        wrapperClassName=''
                      />
                    </div>
                    <div className='d-flex align-items-center gap-3 cursor-pointer'>
                      <p
                        className=''
                        style={{ lineHeight: "18px", fontSize: "13px" }}
                      >
                        Each Question Mark
                      </p>
                    </div>
                  </div>

                  <div className='d-flex align-items-center gap-5'>
                    {/* Total Marks */}
                    <div style={{ width: "100px" }}>
                      <AuthInput
                        type='number'
                        placeholder='Total Mark'
                        // hasError={!!errors.username}
                        // defaultValue={calcObjTotal()}
                        disabled
                        value={
                          createQ.total_mark ||
                          finalObjectiveArray[finalObjectiveArray.length - 1]
                            ?.question_mark *
                            finalObjectiveArray[finalObjectiveArray.length - 1]
                              ?.total_question
                        }
                        name='option'
                        onChange={(e) =>
                          // updateCreateQuestionFxn({
                          //   total_mark: e.target.value,
                          // })

                          setCreateQ((prev) => {
                            return {
                              ...prev,
                              total_mark: e.target.value,
                            };
                          })
                        }
                        wrapperClassName=''
                      />
                    </div>
                    <div className='d-flex align-items-center gap-3 cursor-pointer'>
                      <p
                        className=''
                        style={{ lineHeight: "18px", fontSize: "13px" }}
                      >
                        Total Marks
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
                <p className={styles.create_question_answer}>
                  {question_mark} mk(s)
                </p>
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
