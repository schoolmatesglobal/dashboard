import { faBook } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "reactstrap";
import Button from "../../../components/buttons/button";
import AuthInput from "../../../components/inputs/auth-input";
import DetailView from "../../../components/views/detail-view";
import { useClasses } from "../../../hooks/useClasses";
import AuthSelect from "../../../components/inputs/auth-select";
import { useCampus } from "../../../hooks/useCampus";

const ClassDetail = () => {
  const {
    isLoading,
    isEdit,
    onUpdateClass,
    addClass,
    classData,
    getFieldProps,
    inputs,
    handleSubmit,
    errors,
    setInputs,
    campusList,
    setActivateCampus,
    handleChange,
    user,
  } = useClasses();

  const {
    // campusList,
    // isLoading,
    // toggleCampusStatus,
    // permission,
    // deleteCampus,
  } = useCampus();

  useEffect(() => {
    setActivateCampus(true);
  }, []);

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (isEdit) {
      return await onUpdateClass({ ...data, sub_class: data.sub_class.join() });
    }
    // console.log({
    //   data,
    //   sub_class: data.sub_class.join(),
    // });
    await addClass({ ...data, sub_class: data.sub_class.join() });
  };

  useEffect(() => {
    if (classData) {
      const format = {
        ...classData,
        sub_class: classData.sub_class.split(","),
      };
      setInputs({ ...inputs, ...format });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classData]);

  console.log({ inputs, classData });

  return (
    <DetailView
      isLoading={isLoading}
      cancelLink='/app/classes'
      pageTitle={isEdit ? "Edit Class" : "Add Class"}
      onFormSubmit={handleSubmit(onSubmit)}
    >
      {isEdit && user?.is_preschool === "false" && (
        <div className='mb-5 d-flex justify-content-end gap-3'>
          <Button
            type='button'
            disabled={isLoading}
            isLoading={isLoading}
            variant='dark'
            onClick={() =>
              navigate(`/app/classes/subjects/${classData?.class_name}`)
            }
          >
            <FontAwesomeIcon icon={faBook} className='me-2' /> Subjects
          </Button>
          {/* <Button
            type="button"
            disabled={isLoading}
            isLoading={isLoading}
            variant="dark"
            onClick={() =>
              navigate(`/app/classes/subjects/${classData?.class_name}`)
            }
          >
            <FontAwesomeIcon icon={faBook} className="me-2" /> Promote
          </Button> */}
        </div>
      )}
      <Row className='mb-0 mb-sm-4'>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            label='Class Name'
            name='class_name'
            hasError={!!errors.class_name}
            {...getFieldProps("class_name")}
          />
          {!!errors.class_name && (
            <p className='error-message'>{errors.class_name}</p>
          )}
        </Col>
        {/* <Col sm="6" className="mb-4 mb-sm-0">
          <AuthInput
            isMulti
            label="Sub Classes (Click enter after typing sub class to register)"
            value={inputs.sub_class}
            onChange={(value) => setFieldValue("sub_class", value)}
          />
        </Col> */}
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthSelect
            label='Campus'
            value={inputs.campus}
            name='campus'
            hasError={!!errors.campus}
            onChange={(e) => {
              handleChange(e);
            }}
            options={campusList?.options}
          />
          {!!errors.class && <p className='error-message'>{errors.campus}</p>}
        </Col>
      </Row>
      {/* <Row className="mb-0 mb-sm-4">
      </Row> */}
    </DetailView>
  );
};

export default ClassDetail;
