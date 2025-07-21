import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import PageView from "../../../components/views/table-view";
import { useAcademicSession } from "../../../hooks/useAcademicSession";
import { useClasses } from "../../../hooks/useClasses";
import { useStudent } from "../../../hooks/useStudent";
import {
  getActionOptions,
  getColumns,
  getSortButtonOptions,
  getStudentColumns,
  searchPlaceholder,
} from "./constant";
import Prompt from "../../../components/modals/prompt";
import { Col, Input, Row } from "reactstrap";
import { useForm } from "react-formid";
import AuthInput from "../../../components/inputs/auth-input";

const Student = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [_, setSearchParams] = useSearchParams();
  const {
    students,
    isLoading,
    onDeleteStudent,
    setSession,
    sortedStudents,
    sorted,
    setSorted,
    indexStatus,
    setIndexStatus,
    studentDebtors,
    studentCreditors,
    permission,
    handleSortBy,
    sortBy,
    setAdmissionNumber,
    setSortBy,
    studentByClass2,
    user,
    graduatedStudents,
    setClasses,
    studentLoginDetailsStudents,
    communicationList,
    enableStudentStatus,
    disableStudentStatus,
    getAdmissionNoSettingsLoading,
    postAdmissionNoSettingsLoading,
    getAdmissionNoSettings,
    postAdmissionNoSettings,
    admSetupPrompt,
    setAdmSetupPrompt,
    inputs2,
    setFieldValue2,
    getFieldProps2,
    handleSubmit2,
    errors2,
    setInputs2,
    inputValue,
    setInputValue,
    loading1,
    setLoading1,
    loadedGen,
    setLoadedGen,
  } = useStudent();

  // const [admSetupPrompt, setAdmSetupPrompt] = useState(false);

  const [isValid, setIsValid] = useState(false);
  // const [inputValue, setInputValue] = useState("");

  const validateInput = (e) => {
    // Regular expression to allow only exactly 3 letters (a-z or A-Z)
    const regex = /^\d{3}$/;
    const value = e.target.value.replace(/[0-9]/g, "");
    const isString = typeof value === "string";

    if (value?.length === 4) {
      setIsValid(isString);
      return;
    } else {
      setInputValue(value?.toUpperCase());
    }
  };
  // eslint-disable-next-line no-unused-vars

  const { classes } = useClasses();

  const { data: sessions } = useAcademicSession();

  // const {
  //   inputs2,
  //   setFieldValue2,
  //   getFieldProps,
  //   handleSubmit,
  //   errors2,
  //   setInputs,
  // } = useForm({
  //   defaultValues: {
  //     generate_number: false,
  //     admission_initial: "",
  //   },
  //   validation: {
  //     admission_initial: { required: true },
  //   },
  // });

  const data = {
    all: sorted ? sortedStudents : students?.data,
    creditors: studentCreditors,
    debtors: studentDebtors,
    myStudents: studentByClass2,
    alumni: graduatedStudents,
    loginDetails: studentLoginDetailsStudents?.data,
    communication: communicationList,
  };

  const pagination = {
    all: !sorted && students?.pagination,
    loginDetails: studentLoginDetailsStudents?.pagination,
  };

  const searchByClass = (value) => {
    const findClass = classes?.find((each) => each?.class_name === value) || {};
    setClasses({
      present_class: findClass?.class_name,
      sub_class: findClass?.sub_class,
    });
  };

  const getSelectSearchOptions = () => {
    if (sortBy === "class")
      return (classes || []).map((x) => ({
        value: x?.class_name,
        title: x?.class_name,
      }));
    if (sortBy === "session")
      return (sessions || [])?.map((session) => ({
        value: session?.academic_session,
        title: session?.academic_session,
      }));
  };

  const onSearch = (value) => {
    const search = {
      session: setSession,
      "admission-number": setAdmissionNumber,
      class: searchByClass,
    };

    return search[sortBy || "admission-number"](value);
  };

  useEffect(() => {
    if (state?.status) {
      setIndexStatus(state.status);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.status]);

  useEffect(() => {
    if (getAdmissionNoSettings?.auto_generate) {
      setLoadedGen(getAdmissionNoSettings?.auto_generate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAdmissionNoSettings]);

  console.log({
    // user,
    // inputValue,
    // ipl: inputValue?.length,
    // loadedGen,
    // getAdmissionNoSettings,
    studentLoginDetailsStudents,
    students,
    studentByClass2
  });

  return (
    <div key={loading1}>
      <PageView
        selectValue={sortBy}
        isLoading={isLoading}
        extraButton={["Superadmin"].includes(user?.designation_name)}
        extraButtonTitle='Adn. Setup'
        extraButtonOnclick={() => {
          setLoadedGen(getAdmissionNoSettings?.auto_generate);
          setInputs2({
            ...inputs2,
            generate_number: getAdmissionNoSettings?.auto_generate,
            admission_initial: getAdmissionNoSettings?.admission_initial,
          });
          setInputValue(getAdmissionNoSettings?.admission_number_initial);
          setAdmSetupPrompt(true);
        }}
        onSearchClear={() => {
          setSorted(false);
          setSortBy("");
        }}
        action={getActionOptions({ permission, navigate })}
        data={data[indexStatus]}
        pagination={pagination[indexStatus]}
        onDelete={onDeleteStudent}
        onSelectChange={handleSortBy}
        canCreate={permission?.create}
        hasSortOptions={permission?.sort}
        rowHasAction={permission?.action && indexStatus === "all"}
        searchIsSelect={sortBy === "class" || sortBy === "session"}
        columns={
          user?.designation_name === "Student"
            ? getStudentColumns({ indexStatus })
            : getColumns({ indexStatus })
        }
        groupedButtonOptions={getSortButtonOptions({
          permission,
          user,
          indexStatus,
          setIndexStatus: (index) => {
            setIndexStatus(index);
            setSearchParams({});
          },
        })}
        hasSelect={indexStatus === "all" && permission?.sortSession}
        hasSearch={indexStatus === "all" && permission?.sortSession}
        searchSelectOptions={getSelectSearchOptions()}
        selectOptions={[
          { value: "admission-number", title: "Admission Number" },
          { value: "session", title: "Session" },
          { value: "class", title: "Class" },
        ]}
        onSearch={onSearch}
        // rowHasUpdate={["all"].includes(indexStatus) && permission?.update}
        rowHasUpdate={permission?.update}
        rowHasDelete={["all"].includes(indexStatus) && permission?.delete}
        rowHasEnable={permission?.enable}
        // onEnable={() => {}}
        enableStudentStatus={enableStudentStatus}
        disableStudentStatus={disableStudentStatus}
        searchPlaceholder={
          searchPlaceholder[sortBy] || "Enter Admission Number"
        }
      />
      <Prompt
        isOpen={admSetupPrompt}
        toggle={() => setAdmSetupPrompt((prev) => !prev)}
        promptHeader='Admission Number Setup'
        // singleButtonText="set"
        hasGroupedButtons
        groupedButtonProps={[
          {
            title: "Cancel",
            onClick: () => setAdmSetupPrompt(false),
            variant: "outline",
          },
          {
            title: "Set",
            onClick: () =>
              postAdmissionNoSettings({
                sch_id: user?.sch_id,
                auto_generate: inputs2?.generate_number === true ? 1 : 0,
                initial: inputValue,
              }),
            disabled: inputs2?.generate_number && inputValue?.length < 3,
            isLoading:
              postAdmissionNoSettingsLoading || getAdmissionNoSettingsLoading,
          },
        ]}
      >
        <Row className='mb-0 mb-sm-4'>
          <Col sm='12' className='mb-4 mb-sm-0'>
            <div className='mb-4 d-flex align-items-center gap-3'>
              <Input
                type='checkbox'
                className='fs-3'
                id='generate_number'
                checked={inputs2.generate_number === true}
                // disabled={!!inputs2.generate_number}
                onChange={() =>
                  setFieldValue2(
                    "generate_number",
                    // inputs2.is_preschool === "true" ? "true" : "false"
                    inputs2.generate_number === false ? true : false
                  )
                }
              />
              <label htmlFor='generate_number' className='fs-3 '>
                Auto Generate{" "}
              </label>
            </div>

            {inputs2.generate_number === true && (
              <Row className='mb-0 mb-sm-4'>
                <Col sm='12' className='mb-4 mb-sm-0'>
                  <AuthInput
                    label='Admission Number Initials (3 letters)'
                    required
                    placeholder='GCS (for Golden Crown School)'
                    type='text'
                    value={inputValue}
                    hasError={!!errors2.admission_initial}
                    // {...getFieldProps("admission_initial")}
                    // name='admission_initial'
                    onChange={validateInput}
                  />
                  {!!errors2.admission_initial && (
                    <p className='error-message'>{errors2.admission_initial}</p>
                  )}
                  {/* <p className="mt-3 font ">20 mks max.</p> */}
                </Col>
              </Row>
            )}

            <p className='fs-4 mt-1 lh-1 fst-italic'>
              <span className='fw-bold '>NB:</span> Check the box to auto
              generate admission number when creating students.
            </p>
          </Col>
        </Row>
      </Prompt>
    </div>
  );
};

export default Student;
