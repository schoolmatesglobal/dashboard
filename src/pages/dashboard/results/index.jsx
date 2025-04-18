import { faEye, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import PageView from "../../../components/views/table-view";
import { ResultIcon } from "../../../assets/svgs";
import Prompt from "../../../components/modals/prompt";
import AuthSelect from "../../../components/inputs/auth-select";
import { useForm } from "react-formid";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../hooks/useAppContext";
import { useClasses } from "../../../hooks/useClasses";
import { useAcademicSession } from "../../../hooks/useAcademicSession";
import { useGrading } from "../../../hooks/useGrading";
import { usePreSchool } from "../../../hooks/usePreSchool";
import { useAuthDetails } from "../../../stores/authDetails";
import { useAuth } from "../../../hooks/useAuth";

const Results = () => {
  const { permission, user } = useAppContext("results");
  const [promptStatus, setPromptStatus] = useState("compute");
  const [loginPrompt, setLoginPrompt] = useState(false);
  const { userDetails, setUserDetails } = useAuthDetails();
  const { currentAcademicPeriod } = useAuth();
  const navigate = useNavigate();
  const { inputs, errors, handleChange, setInputs } = useForm({
    defaultValues: {
      assessment: "First Assessment",
      period: "First Half",
      term: "First Term",
      session: currentAcademicPeriod?.session,
      class_name: "",
    },
    validation: {
      class_name: {
        required:
          user?.designation_name === "Principal" ||
          user?.designation_name === "Admin",
      },
    },
  });

  const {
    // permission,
    preSchools,
    // isLoading,
    deletePreSchool,
  } = usePreSchool();

  const { classes } = useClasses();

  const showViewResult = () => {
    // permission?.view && user?.teacher_type === "class teacher"
    if (user?.designation_name === "Teacher") {
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
    } else {
      return true;
    }
  };

  const { data: sessions } = useAcademicSession();

  const is_preschool = !!user?.is_preschool && user.is_preschool !== "false";

  console.log({user})

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
      title: "View Result",
      onFormSubmit: () =>
        navigate(
          `/app/results/${
            !is_preschool
              ? inputs.period === "First Half"
                ? "first"
                : "second"
              : "preschool"
          }`,
          { state: { creds: inputs } }
        ),
    },
  };

  const displayPrompt = (status) => {
    setPromptStatus(status);
    setLoginPrompt(true);
  };

  const getToggleButtons = () => {
    let arr = [];

    if (permission?.compute) {
      arr.push({
        title: (
          <>
            <FontAwesomeIcon icon={faPen} /> Compute
          </>
        ),
        variant: "outline",
        type: "button",
        onClick: () => displayPrompt("compute"),
      });
    }

    if (permission?.view && showViewResult()) {
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

  const cls = (userDetails?.classes || []).map((x) => ({
    value: x?.class_name.toUpperCase(),
    title: x?.class_name,
  }));

  const cls2 = (preSchools || []).map((x) => ({
    value: x?.name.toUpperCase(),
    title: x?.name,
  }));

  const classArray = user?.is_preschool === "true" ? cls2 : cls;

  useEffect(() => {
    setInputs({
      ...inputs,
      session: currentAcademicPeriod?.session,
      assessment: "First Assessment",
      period: currentAcademicPeriod?.period,
      term: currentAcademicPeriod?.term,
    });
  }, []);

  console.log({ sessions, user, classArray, cls2, cls, userDetails });

  return (
    <div>
      <PageView
        hasSortOptions
        showIllustration
        svgIllustrationBanner={ResultIcon}
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
            user?.designation_name === "Principal" ||
            user?.designation_name === "Admin"
              ? !inputs.class_name
              : false,
          onClick: promptMapper[promptStatus].onFormSubmit,
        }}
        singleButtonText='Continue'
        promptHeader={promptMapper[promptStatus].title}
      >
        {/* {scores?.has_two_assessment && (
          <div className="form-group mb-4">
            <AuthSelect
              label="Assessment"
              value={inputs.assessment}
              name="assessment"
              hasError={!!errors.assessment}
              onChange={handleChange}
              options={[
                { value: "First Assessment", title: "First Assessment" },
                { value: "Second Assessment", title: "Second Assessment" },
              ]}
            />
            {!!errors.assessment && (
              <p className="error-message">{errors.assessment}</p>
            )}
          </div>
        )} */}
        <div className='form-group mb-4'>
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
        </div>
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

        {(user?.designation_name === "Principal" ||
          user?.designation_name === "Admin") && (
          <div className='form-group mb-4'>
            <AuthSelect
              label='Class'
              value={inputs.class_name}
              name='class_name'
              hasError={!!errors.class_name}
              onChange={handleChange}
              options={classArray}
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

export default Results;
