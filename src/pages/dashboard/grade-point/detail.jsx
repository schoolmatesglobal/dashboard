import React, { useEffect } from "react";
import { useForm } from "react-formid";
import { Col, Row } from "reactstrap";
import AuthInput from "../../../components/inputs/auth-input";
import DetailView from "../../../components/views/detail-view";
import { useGrading } from "../../../hooks/useGrading";
import { useGradePoint } from "../../../hooks/useGradePoint";

const GradePointDetail = () => {
  const { isLoading, singleGrading, isEdit, updateGrading, postGradePoint } =
    useGradePoint();

  const { errors, getFieldProps, handleSubmit, setInputs, inputs } = useForm({
    defaultValues: {
      min_mark: "",
      max_mark: "",
      grade_point: "",
      remark: "",
      key_range: "",
    },
    validation: {
      min_mark: {
        required: true,
      },
      max_mark: {
        required: true,
      },
      grade_point: {
        required: true,
      },
      remark: {
        required: true,
      },
      key_range: {
        required: true,
      },
    },
  });

  const onSubmit = (data) => {
    // if (isEdit)
    //   return updateGrading({
    //     id: singleGrading.id,
    //     ...data,
    //   });
    console.log({ data });
    postGradePoint(data);
  };

  useEffect(() => {
    if (singleGrading) {
      setInputs({ ...inputs, ...singleGrading });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleGrading]);

  return (
    <DetailView
      isLoading={isLoading}
      pageTitle='Create Grade Point'
      onFormSubmit={handleSubmit(onSubmit)}
    >
      <Row className='mb-0 mb-sm-4'>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            label='Min Mark'
            type='number'
            hasError={!!errors.min_mark}
            {...getFieldProps("min_mark")}
          />
          {!!errors.min_mark && (
            <p className='error-message'>{errors.min_mark}</p>
          )}
        </Col>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            label='Max Mark'
            type='number'
            hasError={!!errors.max_mark}
            {...getFieldProps("max_mark")}
          />
          {!!errors.max_mark && (
            <p className='error-message'>{errors.max_mark}</p>
          )}
        </Col>
      </Row>
      <Row className='mb-0 mb-sm-4'>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            label='Grade Point'
            type='number'
            hasError={!!errors.grade_point}
            {...getFieldProps("grade_point")}
          />
          {!!errors.grade_point && (
            <p className='error-message'>{errors.grade_point}</p>
          )}
        </Col>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            label='Remark'
            hasError={!!errors.remark}
            {...getFieldProps("remark")}
          />
          {!!errors.remark && <p className='error-message'>{errors.remark}</p>}
        </Col>
      </Row>
      <Row className='mb-0 mb-sm-4'>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            label='Key Range'
            hasError={!!errors.key_range}
            {...getFieldProps("key_range")}
          />
          {!!errors.key_range && (
            <p className='error-message'>{errors.key_range}</p>
          )}
        </Col>
        {/* <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            label='Remark'
            hasError={!!errors.remark}
            {...getFieldProps("remark")}
          />
          {!!errors.remark && <p className='error-message'>{errors.remark}</p>}
        </Col> */}
      </Row>
    </DetailView>
  );
};

export default GradePointDetail;
