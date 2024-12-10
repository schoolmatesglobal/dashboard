import { faEye, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import PageView from "../../../components/views/table-view";
import { BroadSheetIcon } from "../../../assets/svgs";
import Prompt from "../../../components/modals/prompt";
import AuthSelect from "../../../components/inputs/auth-select";
import { useForm } from "react-formid";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../hooks/useAppContext";
import { useClasses } from "../../../hooks/useClasses";
import { useAcademicSession } from "../../../hooks/useAcademicSession";
import { useGrading } from "../../../hooks/useGrading";
import { useAuthDetails } from "../../../stores/authDetails";

const BroadSheet = () => {
  const { permission, user } = useAppContext("results");
  const [promptStatus, setPromptStatus] = useState("compute");
  const [loginPrompt, setLoginPrompt] = useState(false);
  const navigate = useNavigate();
  const { userDetails, setUserDetails } = useAuthDetails();
  const { inputs, errors, handleChange, setInputs } = useForm({
    defaultValues: {
      assessment: "First Assessment",
      period: "First Half",
      term: "First Term",
      session: userDetails?.session,
      class_name: "",
    },
    validation: {
      class_name: {
        required: user?.designation_name === "Principal",
      },
    },
  });

  const { classes } = useClasses();

  const showViewResult = () => {
    // permission?.view && user?.teacher_type === "class teacher"
    switch (user?.is_preschool) {
      case "false":
        switch (user?.teacher_type) {
          case "class teacher":
            return true;
            break;
          case "subject teacher":
            return false;
            break;

          default:
            break;
        }
        // return user?.teacher_type === "class teacher" && true;
        break;
      case "true":
        switch (user?.teacher_type) {
          case "":
            return true;
            break;
          case "class teacher":
            return true;
            break;
          case "subject teacher":
            return true;
            break;

          default:
            break;
        }
        break;

      default:
        break;
    }
  };

  

  // const showViewResult = () => {
  //   const isClassTeacher = user?.teacher_type === "class teacher";

  //   switch (user?.is_preschool) {
  //     case "false":
  //       return isClassTeacher;

  //     case "true":
  //       return isClassTeacher || user?.teacher_type === "subject teacher";

  //     default:
  //       return false;
  //   }
  // };

  // const {
  //   isLoading: gradingLoading,
  //   scores,
  //   addScores,
  //   // postGrading,
  //   // singleGrading,
  //   // isEdit,
  //   // updateGrading,
  // } = useGrading();

  const { data: sessions } = useAcademicSession();

  const is_preschool = !!user?.is_preschool && user.is_preschool !== "false";

  const promptMapper = {
    compute: {
      title: "Compute Result",
      onFormSubmit: () =>
        navigate(
          `/app/results/${
            !is_preschool
              ? inputs.period === "First Half"
                ? "first"
                : "second"
              : "preschool"
          }/compute`,
          { state: { creds: inputs } }
        ),
    },
    view: {
      title: "View Broad Sheet",
      onFormSubmit: () =>
        navigate(
          `/app/broadsheet/${
            !is_preschool
              ? inputs.term === "First Term"
                ? "initial"
                : inputs.term === "Second Term"
                ? "initial"
                : "final"
              : "preschool"
          }`,
          { state: { creds: inputs } }
        ),
      // navigate(
      //   `/app/results/${
      //     !is_preschool
      //       ? inputs.period === "First Half"
      //         ? "first"
      //         : "second"
      //       : "preschool"
      //   }`,
      //   { state: { creds: inputs } }
      // ),
    },
  };

  const displayPrompt = (status) => {
    setPromptStatus(status);
    setLoginPrompt(true);
  };

  const getToggleButtons = () => {
    let arr = [];

    // if (permission?.compute) {
    //   arr.push({
    //     title: (
    //       <>
    //         <FontAwesomeIcon icon={faPen} /> Compute
    //       </>
    //     ),
    //     variant: "outline",
    //     type: "button",
    //     onClick: () => displayPrompt("compute"),
    //   });
    // }

    if (permission?.view) {
      arr.push({
        title: (
          <>
            <FontAwesomeIcon icon={faEye} /> View
          </>
        ),
        variant: "outline",
        type: "button",
        onClick: () => displayPrompt("view"),
      });
    }

    return arr;
  };

  useEffect(() => {
    setInputs({
      ...inputs,
      session: userDetails?.session,
      assessment: "First Assessment",
      period: "First Half",
      term: "First Term",
    });
  }, []);

  // console.log({ showViewResult: showViewResult(), user });

  return (
    <div>
      <PageView
        hasSortOptions
        showIllustration
        svgIllustrationBanner={BroadSheetIcon}
        hideTable
        groupedButtonOptions={getToggleButtons()}
        canCreate={false}
        isLoading={false}
      />
      <Prompt
        isOpen={loginPrompt}
        toggle={() => setLoginPrompt(!loginPrompt)}
        singleButtonProps={{
          type: "button",
          isLoading: false,
          disabled:
            user?.designation_name === "Principal" ? !inputs.class_name : false,
          onClick: promptMapper[promptStatus].onFormSubmit,
        }}
        singleButtonText='Continue'
        promptHeader={promptMapper[promptStatus].title}
      >
        {/* <div className='form-group mb-4'>
          <AuthSelect
            label='Period'
            value={inputs.period}
            name='period'
            hasError={!!errors.period}
            onChange={handleChange}
            options={[
              { value: "First Half", title: "First Half/Mid Term" },
              { value: "Second Half", title: "Second Half/End of Term" },
            ]}
          />
          {!!errors.period && <p className='error-message'>{errors.period}</p>}
        </div> */}
        <div className='form-group mb-4'>
          <AuthSelect
            label='Term'
            value={inputs.term}
            name='term'
            hasError={!!errors.term}
            onChange={handleChange}
            options={[
              { value: "First Term", title: "First Term" },
              { value: "Second Term", title: "Second Term" },
              { value: "Third Term", title: "Third Term" },
            ]}
          />
          {!!errors.term && <p className='error-message'>{errors.term}</p>}
        </div>
        <div className='form-group mb-4'>
          <AuthSelect
            label='Session'
            value={inputs.session}
            name='session'
            hasError={!!errors.session}
            onChange={handleChange}
            options={(sessions || [])?.map((session) => ({
              value: session?.academic_session,
              title: session?.academic_session,
            }))}
          />
          {!!errors.session && (
            <p className='error-message'>{errors.session}</p>
          )}
        </div>
        {user?.designation_name === "Principal" && (
          <div className='form-group mb-4'>
            <AuthSelect
              label='Class'
              value={inputs.class_name}
              name='class_name'
              hasError={!!errors.class_name}
              onChange={handleChange}
              options={(classes || []).map((x) => ({
                value: x?.class_name,
                title: x?.class_name,
              }))}
            />
            {!!errors.class_name && (
              <p className='error-message'>{errors.class_name}</p>
            )}
          </div>
        )}
      </Prompt>
    </div>
  );
};

export default BroadSheet;
