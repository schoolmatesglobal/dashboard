import React, { useEffect } from "react";
import { useForm } from "react-formid";
import { Col, Row } from "reactstrap";
import AuthInput from "../../../components/inputs/auth-input";
import AuthSelect from "../../../components/inputs/auth-select";
import DetailView from "../../../components/views/detail-view";
import { useClasses } from "../../../hooks/useClasses";
import { useSubject } from "../../../hooks/useSubjects";
import { useActivities } from "../../../hooks/useActivities";
import { useNavigate } from "react-router-dom";

const ExtraCurricularDetail2 = () => {
  // const { isLoading, addSubject, subjectData, updateSubject, isEdit } =
  //   useSubject();
  const {
    isLoading,
    addPreActivities,
    deleteActivity,
    permission,
    isEdit,
    user,
  } = useActivities();

  const navigate = useNavigate();

  // const { classes } = useClasses();
  const {
    handleSubmit,
    inputs,
    errors,
    handleChange,
    getFieldProps,
    setInputs,
  } = useForm({
    defaultValues: {
      // class_name: "",
      activity: "",
    },
  });

  const onSubmit = (data) => {
    if (isEdit) {
      // return addActivities({ name: data.activity });
    }
    addPreActivities({ name: data.activity });
    navigate("/app/activities2");
    // console.log({ name: data.activity });
  };

  // useEffect(() => {
  //   if (subjectData) {
  //     setInputs({
  //       ...inputs,
  //       // class_name: subjectData.class_name,
  //       subject: subjectData.subject,
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [subjectData]);

  // console.log({subjectData})

  return (
    <DetailView
      isLoading={isLoading}
      cancelLink='/app/activities2'
      pageTitle='Create Extra Curricular Activity'
      onFormSubmit={handleSubmit(onSubmit)}
    >
      <Row className='my-5'>
        {/* <Col sm="6" className="mb-4 mb-sm-0">
          <AuthSelect
            label="Class"
            value={inputs.class_name}
            name="class_name"
            hasError={!!errors.class_name}
            onChange={handleChange}
            options={(classes || []).map((x) => ({
              value: x?.class_name,
              title: x?.class_name,
            }))}
          />
          {!!errors.class_name && (
            <p className="error-message">{errors.class_name}</p>
          )}
        </Col> */}
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            label='Activity'
            hasError={!!errors.activity}
            {...getFieldProps("activity")}
          />
          {!!errors.activity && (
            <p className='error-message'>{errors.activity}</p>
          )}
        </Col>
      </Row>
    </DetailView>
  );
};

export default ExtraCurricularDetail2;
