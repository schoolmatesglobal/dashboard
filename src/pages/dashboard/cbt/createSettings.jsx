import React, { useEffect, useState } from "react";

import Prompt from "../../../components/modals/prompt";
import AuthInput from "../../../components/inputs/auth-input";
import { useAssignments } from "../../../hooks/useAssignments";
import styles from "../../../assets/scss/pages/dashboard/assignment.module.scss";
import { addQuestionMarks, updateQuestionNumbers } from "./constant";
import { useCBT } from "../../../hooks/useCBT";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
// import SelectSearch from "../inputs/SelectSearch";

const CreateSettings = ({
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
  state,
  instructioncbt,
  setInstructioncbt,
  hourcbt,
  setHourcbt,
  minutescbt,
  setMinutescbt,
  markcbt,
  setMarkcbt,
}) => {
  const { user, updateCreateQuestionFxn, apiServices } = useCBT();

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
    instruction,
    hour,
    minute,
    mark,
  } = createQ;
  // const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  // const [imageUpload, setImageUpload] = useState(null);

  const [previewUrl, setPreviewUrl] = useState("");

  const [imageNam, setImageNam] = useState("No file selected");
  // const [activateError, setActivateError] = useState(false);
  // const [fileUploadError, setFileUploadError] = useState("");
  const [activeTab, setActiveTab] = useState("1");

  // const [instructioncbt, setInstructioncbt] = useState(createQ?.instruction);
  // const [hourcbt, setHourcbt] = useState(createQ?.hour);
  // const [minutescbt, setMinutescbt] = useState(createQ?.minute);
  // const [markcbt, setMarkcbt] = useState(createQ?.question_mark);

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
          !objMark ||
          !instruction ||
          !hour ||
          !minute
          // !mark
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

  const activateAddSettings = () => {
    if (!instructioncbt || !hourcbt || !minutescbt || !markcbt) {
      return true;
    } else {
      return false;
    }
  };

  const calcObjTotal = () => {
    const total = total_question * question_mark;
    updateCreateQuestionFxn({
      total_mark: total,
    });
  };

  /////// POST CBT SETUP ////
  const { mutateAsync: addCbtSetup, isLoading: addCbtSetupLoading } =
    useMutation(
      apiServices.addCbtSetup,

      {
        onSuccess() {
          // refetchAssignmentCreated();
          toast.success("CBT question settings has been created successfully");
        },
        onError(err) {
          apiServices.errorHandler(err);
        },
      }
    );

  const buttonOptions = [
    {
      title: "Cancel",
      onClick: () => {
        setCreateQuestionPrompt(false);
      },
      variant: "outline",
    },
    {
      title: "Add Settings",
      disabled: activateAddSettings(),
      isLoading: addCbtSetupLoading,
      onClick: async () => {
        await addCbtSetup({
          period: state?.period,
          term: state?.term,
          session: state?.session,
          subject_id: createQ?.subject_id,
          question_type: createQ?.question_type,
          instruction: instructioncbt,
          duration: `${hourcbt}:${minutescbt}`,
          mark: markcbt,
        });

        setTimeout(() => {
          setCreateQuestionPrompt(false);
          setCreateQ((prev) => {
            return {
              ...prev,
              instruction: instructioncbt,
              hour: hourcbt,
              minute: minutescbt,
              question_mark: markcbt,
            };
          });
          setInstructioncbt("");
          setHourcbt("");
          setMinutescbt("");
          setMarkcbt("");
        }, 1000);
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
  // console.log({
  //   createQ,
  //   state,
  // });

  return (
    <div className={styles.create_question}>
      <Prompt
        isOpen={createQuestionPrompt}
        toggle={() => setCreateQuestionPrompt(!createQuestionPrompt)}
        hasGroupedButtons={true}
        groupedButtonProps={buttonOptions}
        // singleButtonText='Preview'
        promptHeader='CBT Question Settings'
      >
        <>
          {/* instruction */}
          <p className='fs-3 fw-bold mb-3'>Instruction</p>
          <div className='auth-textarea-wrapper'>
            <textarea
              className='form-control fs-3 lh-base'
              type='text'
              value={instructioncbt}
              placeholder='Type the Test instruction'
              onChange={
                (e) => setInstructioncbt(e.target.value)
                // setCreateQ((prev) => {
                //   return { ...prev, instruction: e.target.value };
                // })
              }
              style={{
                minHeight: "100px",
                // lineHeight: "22px",
              }}
            />
          </div>

          <p className='fs-3 fw-bold my-4'>Duration</p>
          <div className='d-flex align-items-center gap-3'>
            {/*Question Mark */}
            <div className='d-flex align-items-center gap-3'>
              <div style={{ width: "100px" }}>
                <AuthInput
                  type='number'
                  placeholder='Hour'
                  value={hourcbt}
                  name='option'
                  min={0}
                  className='fs-3'
                  onChange={(e) => {
                    setHourcbt(e.target.value);
                    // if (objectiveQ?.length > 0) return;
                    // setCreateQ((prev) => {
                    //   return { ...prev, hour: e.target.value };
                    // });
                  }}
                  wrapperClassName=''
                />
              </div>
              <div className='d-flex align-items-center gap-3 cursor-pointer'>
                <p className='fs-3'>Hours</p>
              </div>
            </div>
            {/*Question Mark */}
            <div className='d-flex align-items-center gap-3'>
              <div style={{ width: "100px" }}>
                <AuthInput
                  type='number'
                  placeholder='Minute'
                  className='fs-3'
                  // hasError={!!errors.username}
                  value={minutescbt}
                  name='option'
                  min={0}
                  onChange={(e) => {
                    setMinutescbt(e.target.value);
                    // if (objectiveQ?.length > 0) return;
                    // setCreateQ((prev) => {
                    //   return { ...prev, minute: e.target.value };
                    // });
                  }}
                  wrapperClassName=''
                />
              </div>
              <div className='d-flex align-items-center gap-3 cursor-pointer'>
                <p className='fs-3'>Minutes</p>
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
                  value={markcbt}
                  name='option'
                  min={1}
                  className='fs-3'
                  onChange={(e) => {
                    setMarkcbt(e.target.value);
                    // if (objectiveQ?.length > 0) return;
                    // setObjMark(e.target.value);
                    // setCreateQ((prev) => {
                    //   return { ...prev, question_mark: e.target.value };
                    // });
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
      </Prompt>
    </div>
  );
};

export default CreateSettings;
