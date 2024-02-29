import React, { useState } from "react";

import Prompt from "../../../components/modals/prompt";
import AuthInput from "../../../components/inputs/auth-input";
import {useAssignments} from "../../../hooks/useAssignments";
import styles from "../../../assets/scss/pages/dashboard/assignment.module.scss";
import {
  addQuestionMarks,
  updateQuestionNumbers
} from "./constant";
// import SelectSearch from "../inputs/SelectSearch";

const CreateQuestion = ({ createQuestionPrompt, setCreateQuestionPrompt }) => {
  const {
    // updateActiveTabFxn,
    // // activeTab,
    // //
    // myStudents,
    // classSubjects,
    // apiServices,
    // errorHandler,
    // permission,
    user,
    //

    // QUERIES
    // addObjectiveAssignments,
    // addObjectAssignmentLoading,
    //
    // addTheoryAssignments,
    // addTheoryAssignmentLoading,
    //

    // CREATE
    // updateCheckCreatedQuestionsFxn,
    // checkCreatedQuestions,
    //
    updateCreateQuestionFxn,
    // emptyCreateQuestionFxn,
    createQuestion,
    //
    // updateObjectiveQuestionFxn,
    addObjectiveQuestionFxn,
    // editObjectiveQuestionFxn,
    // deleteObjectiveQuestionFxn,
    // emptyObjectiveQuestionsFxn,
    updateObjectiveQuestionsMarkFxn,
    updateObjectiveTotalQuestionFxn,
    ObjectiveQuestions,
    //
    addTheoryQuestionFxn,
    // editTheoryQuestionFxn,
    // deleteTheoryQuestionFxn,
    // emptyTheoryQuestionsFxn,
    // updateTheoryTotalQuestionFxn,
    TheoryQuestions,
    //

    // CREATED
    // updateCreatedQuestionFxn,
    // createdQuestion,
    //
  } = useAssignments();
  // const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  // const [imageUpload, setImageUpload] = useState(null);

  const [previewUrl, setPreviewUrl] = useState("");

  const [imageNam, setImageNam] = useState("No file selected");
  // const [activateError, setActivateError] = useState(false);
  // const [fileUploadError, setFileUploadError] = useState("");
  const [activeTab, setActiveTab] = useState("1");

  const {
    option1,
    option2,
    option3,
    option4,
    ans1,
    ans2,
    ans3,
    ans4,
    answer,
    // theoryAns,
    question_type,
    question,
    subject,
    image,
    // imageName,
    // term,
    // period,
    // session,
    subject_id,
    week,
    total_question,
    total_mark,
    theory_total_mark,
    question_mark,
    question_number,
  } = createQuestion;

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
    if (ObjectiveQuestions.length >= 1) {
      arr.push({
        value: "objective",
        title: "objective",
      });
    } else if (TheoryQuestions.length >= 1) {
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
              if (question_type === "theory") {
                updateCreateQuestionFxn({
                  theory_total_mark:
                    Number(theory_total_mark) - Number(total_mark),
                  question_number: TheoryQuestions?.length - 1,
                  total_mark: "",
                });
              } else if (question_type === "objective") {
                updateCreateQuestionFxn({
                  question_number: ObjectiveQuestions?.length - 1,
                });
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

              // addCreateQ();
              // addObjectiveAssignment();
              if (question_type === "objective") {
                // addObjectiveQ();
                addObjectiveQuestionFxn({
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
                });
                updateCreateQuestionFxn({
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
                // updateCreateQ({
                //   theory_total_mark:
                //     Number(total_mark) + Number(theory_total_mark),
                // });
                addTheoryQuestionFxn({
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
                });
                updateCreateQuestionFxn({
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
              updateCreateQuestionFxn({
                image: previewUrl,
                imageName: imageNam,
              });

              if (question_type === "theory") {
                updateCreateQuestionFxn({
                  theory_total_mark:
                    Number(theory_total_mark) + Number(total_mark),
                  // question_number: TheoryQuestions?.length + 1,
                });
              } else if (question_type === "objective") {
                updateCreateQuestionFxn({
                  // question_number: ObjectiveQuestions?.length + 1,
                });
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

  const totalMark = addQuestionMarks(TheoryQuestions);

  const finalTheoryArray = updateQuestionNumbers(totalMark);

  const finalObjectiveArray = updateQuestionNumbers(ObjectiveQuestions);

  // console.log({ total_mark, theory_total_mark, total_question, question_mark });
  // console.log({ tl: TheoryQuestions?.length });

  return (
    <div className={styles.create_question}>
      <Prompt
        isOpen={createQuestionPrompt}
        toggle={() => setCreateQuestionPrompt(!createQuestionPrompt)}
        hasGroupedButtons={true}
        groupedButtonProps={buttonOptions}
        singleButtonText="Preview"
        promptHeader={`${subject?.toUpperCase()} (WEEK ${week?.toUpperCase()}) - ${question_type?.toUpperCase()} - Q ${
          // question_type === "objective"
          //   ? ObjectiveQuestions?.length + 1
          //   : question_type === "theory"
          //   ? TheoryQuestions?.length + 1
          //   : ""
          question_number
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
            {question_type === "theory" && (
              <div>
                <label className={styles.create_question_label}>
                  Questions
                </label>
                <div className="auth-textarea-wrapper">
                  <textarea
                    className="form-control"
                    type="text"
                    value={question}
                    placeholder="Type the assignment question"
                    onChange={(e) =>
                      updateCreateQuestionFxn({
                        question: e.target.value,
                      })
                    }
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
                <label className={styles.create_question_label}>Answer</label>
                <div className="auth-textarea-wrapper">
                  <textarea
                    className="form-control"
                    type="text"
                    value={answer}
                    placeholder="Type the answer to the question"
                    onChange={(e) =>
                      updateCreateQuestionFxn({
                        answer: e.target.value,
                      })
                    }
                  />
                </div>

                <label className={styles.create_question_label}>
                  Mark Computation
                </label>
                <div className="d-flex flex-column gap-3">
                  {/*Question Mark */}
                  <div className="d-flex align-items-center gap-5">
                    <div style={{ width: "100px" }}>
                      <AuthInput
                        type="number"
                        placeholder="Question Mark"
                        // hasError={!!errors.username}
                        value={createQuestion.question_mark}
                        name="option"
                        onChange={(e) => {
                          updateCreateQuestionFxn({
                            question_mark: e.target.value,
                            total_mark: e.target.value,
                          });

                          // calcObjTotal();
                        }}
                        wrapperClassName=""
                      />
                    </div>
                    <div className="d-flex align-items-center gap-3 cursor-pointer">
                      <p
                        className=""
                        style={{ lineHeight: "18px", fontSize: "13px" }}
                      >
                        Question Mark
                      </p>
                    </div>
                  </div>
                  {/* Total Questions */}
                  <div className="d-flex align-items-center gap-5">
                    <div style={{ width: "100px" }}>
                      <AuthInput
                        type="number"
                        placeholder="Total Questions"
                        // hasError={!!errors.username}
                        value={createQuestion?.total_question}
                        name="option"
                        onChange={(e) => {
                          updateCreateQuestionFxn({
                            total_question: e.target.value,
                            // total_mark: e.target.value * question_mark,
                          });
                          // updateTheoryTotalQuestionFxn({
                          //   newValue: e.target.value,
                          // });
                          // calcObjTotal();
                        }}
                        wrapperClassName=""
                      />
                    </div>
                    <div className="d-flex align-items-center gap-3 cursor-pointer">
                      <p
                        className=""
                        style={{ lineHeight: "18px", fontSize: "13px" }}
                      >
                        Total Questions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {question_type === "objective" && (
              <>
                <label className={styles.create_question_label}>Question</label>
                <div className="auth-textarea-wrapper">
                  <textarea
                    className="form-control"
                    type="text"
                    value={question}
                    placeholder="Type the assignment question"
                    onChange={(e) =>
                      updateCreateQuestionFxn({
                        question: e.target.value,
                      })
                    }
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
                <label
                  className={styles.create_question_label}
                  style={{ fontSize: "20px" }}
                >
                  Options
                </label>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center gap-5">
                    {/* option - A */}
                    <div style={{ width: "250px" }}>
                      <AuthInput
                        type="text"
                        placeholder="Option A"
                        // hasError={!!errors.username}
                        value={option1}
                        name="option"
                        onChange={(e) =>
                          updateCreateQuestionFxn({
                            option1: e.target.value,
                          })
                        }
                        wrapperClassName=""
                      />
                    </div>
                    <div className="d-flex align-items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="radio-1"
                        checked={ans1}
                        id="option-A"
                        style={{ width: "20px", height: "20px" }} // Set the width using inline styles
                        onChange={(e) =>
                          updateCreateQuestionFxn({
                            ans1: e.target.checked,
                            ans2: false,
                            ans3: false,
                            ans4: false,
                            answer: e.target.value,
                          })
                        }
                        value={option1}
                      />
                      <label
                        htmlFor="option-A"
                        style={{ lineHeight: "18px", fontSize: "13px" }}
                      >
                        Correct answer
                      </label>
                    </div>
                  </div>
                  {/* option B */}
                  <div className="d-flex align-items-center gap-5">
                    <div style={{ width: "250px" }}>
                      <AuthInput
                        type="text"
                        placeholder="Option B"
                        // hasError={!!errors.username}
                        value={option2}
                        name="option"
                        onChange={(e) =>
                          updateCreateQuestionFxn({
                            option2: e.target.value,
                          })
                        }
                        wrapperClassName=""
                      />
                    </div>
                    <div className="d-flex align-items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="radio-1"
                        style={{ width: "20px", height: "20px" }} // Set the width using inline styles
                        checked={ans2}
                        id="option-B"
                        onChange={(e) =>
                          updateCreateQuestionFxn({
                            ans2: e.target.checked,
                            ans1: false,
                            ans3: false,
                            ans4: false,
                            answer: e.target.value,
                          })
                        }
                        value={option2}
                      />
                      <label
                        htmlFor="option-B"
                        style={{ lineHeight: "18px", fontSize: "13px" }}
                      >
                        Correct answer
                      </label>
                    </div>
                  </div>
                  {/* option C */}
                  <div className="d-flex align-items-center gap-5">
                    <div style={{ width: "250px" }}>
                      <AuthInput
                        type="text"
                        placeholder="Option C"
                        // hasError={!!errors.username}
                        value={option3}
                        name="option"
                        onChange={(e) =>
                          updateCreateQuestionFxn({
                            option3: e.target.value,
                          })
                        }
                        wrapperClassName=""
                      />
                    </div>
                    <div className="d-flex align-items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="radio-1"
                        style={{ width: "20px", height: "20px" }}
                        // Set the width using inline styles
                        checked={ans3}
                        id="option-C"
                        onChange={(e) =>
                          updateCreateQuestionFxn({
                            ans3: e.target.checked,
                            ans1: false,
                            ans2: false,
                            ans4: false,
                            answer: e.target.value,
                          })
                        }
                        value={option3}
                      />
                      <label
                        htmlFor="option-C"
                        style={{ lineHeight: "18px", fontSize: "13px" }}
                      >
                        Correct answer
                      </label>
                    </div>
                  </div>
                  {/* option D */}
                  <div className="d-flex align-items-center gap-5">
                    <div style={{ width: "250px" }}>
                      <AuthInput
                        type="text"
                        placeholder="Option D"
                        // hasError={!!errors.username}
                        value={option4}
                        name="option"
                        onChange={(e) =>
                          updateCreateQuestionFxn({
                            option4: e.target.value,
                          })
                        }
                        wrapperClassName=""
                      />
                    </div>
                    <div className="d-flex align-items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="radio-1"
                        id="option-D"
                        style={{ width: "20px", height: "20px" }} // Set the width using inline styles
                        checked={ans4}
                        onChange={(e) =>
                          updateCreateQuestionFxn({
                            ans4: e.target.checked,
                            ans2: false,
                            ans3: false,
                            ans1: false,
                            answer: e.target.value,
                          })
                        }
                        value={option4}
                      />
                      <label
                        htmlFor="option-D"
                        style={{ lineHeight: "18px", fontSize: "13px" }}
                      >
                        Correct answer
                      </label>
                    </div>
                  </div>
                </div>

                <label className={styles.create_question_label}>
                  Mark Computation
                </label>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center gap-5">
                    {/* Total Questions */}
                    <div style={{ width: "100px" }}>
                      <AuthInput
                        type="number"
                        placeholder="Total Questions"
                        // hasError={!!errors.username}
                        value={createQuestion.total_question}
                        name="option"
                        onChange={(e) => {
                          updateCreateQuestionFxn({
                            total_question: e.target.value,
                            total_mark: e.target.value * question_mark,
                          });
                          if (ObjectiveQuestions.length > 1) {
                            updateObjectiveTotalQuestionFxn({
                              newValue: e.target.value,
                            });
                          }
                          // calcObjTotal();
                        }}
                        wrapperClassName=""
                      />
                    </div>
                    <div className="d-flex align-items-center gap-3 cursor-pointer">
                      <p
                        className=""
                        style={{ lineHeight: "18px", fontSize: "13px" }}
                      >
                        Total Questions
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-5">
                    {/*Question Mark */}
                    <div style={{ width: "100px" }}>
                      <AuthInput
                        type="number"
                        placeholder="Question Mark"
                        disabled={finalObjectiveArray.length >= 1}
                        // hasError={!!errors.username}
                        value={
                          createQuestion.question_mark ||
                          finalObjectiveArray[finalObjectiveArray.length - 1]
                            ?.question_mark
                        }
                        name="option"
                        onChange={(e) => {
                          updateCreateQuestionFxn({
                            question_mark: e.target.value,
                            total_mark: e.target.value * total_question,
                          });
                          if (ObjectiveQuestions.length > 1) {
                            updateObjectiveQuestionsMarkFxn({
                              newValue: e.target.value,
                            });
                          }
                          // calcObjTotal();
                        }}
                        wrapperClassName=""
                      />
                    </div>
                    <div className="d-flex align-items-center gap-3 cursor-pointer">
                      <p
                        className=""
                        style={{ lineHeight: "18px", fontSize: "13px" }}
                      >
                        Each Question Mark
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-5">
                    {/* Total Marks */}
                    <div style={{ width: "100px" }}>
                      <AuthInput
                        type="number"
                        placeholder="Total Mark"
                        // hasError={!!errors.username}
                        // defaultValue={calcObjTotal()}
                        disabled
                        value={
                          createQuestion.total_mark ||
                          finalObjectiveArray[finalObjectiveArray.length - 1]
                            ?.question_mark *
                            finalObjectiveArray[finalObjectiveArray.length - 1]
                              ?.total_question
                        }
                        name="option"
                        onChange={(e) =>
                          updateCreateQuestionFxn({
                            total_mark: e.target.value,
                          })
                        }
                        wrapperClassName=""
                      />
                    </div>
                    <div className="d-flex align-items-center gap-3 cursor-pointer">
                      <p
                        className=""
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
            <label
              className={styles.create_question_label}
              // style={{ fontSize: "15px", fontWeight: 600 }}
            >
              Question
            </label>
            <p
              className={styles.create_question_question}
              // style={{ fontSize: "15px", lineHeight: "20px" }}
            >
              {question}
            </p>
            {image && (
              <div className="mb-4 mt-4">
                <img src={image} width={150} alt="" />
              </div>
            )}
            {question_type === "objective" && (
              <>
                <label
                  className={styles.create_question_label}
                  // style={{ fontSize: "15px", fontWeight: 600 }}
                >
                  Options
                </label>
                <div className="d-flex flex-column gap-3">
                  <p
                    className={styles.create_question_answer}
                    // style={{ fontSize: "15px" }}
                  >
                    A. {option1}
                    {answer === option1 && " (Correct Answer)"}
                  </p>
                  <p className={styles.create_question_answer}>
                    B. {option2}
                    {answer === option2 && " - (Correct Answer)"}
                  </p>
                  <p className={styles.create_question_answer}>
                    C. {option3}
                    {answer === option3 && " - (Correct Answer)"}
                  </p>
                  <p className={styles.create_question_answer}>
                    D. {option4}
                    {answer === option4 && " - (Correct Answer)"}
                  </p>
                </div>
                <label
                  className={styles.create_question_label}
                  // style={{ fontSize: "15px", fontWeight: 600 }}
                >
                  Mark
                </label>
                <p className={styles.create_question_answer}>
                  {question_mark} mk(s)
                </p>
              </>
            )}
            {question_type === "theory" && (
              <>
                <label
                  className={styles.create_question_label}
                  // style={{ fontSize: "15px", fontWeight: 600 }}
                >
                  Answer
                </label>
                <p className={styles.create_question_answer}>{answer}</p>
                <label
                  className={styles.create_question_label}
                  // style={{ fontSize: "15px", fontWeight: 600 }}
                >
                  Mark
                </label>
                <p className={styles.create_question_answer}>
                  {question_mark} mk(s)
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
