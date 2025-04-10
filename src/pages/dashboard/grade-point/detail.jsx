import React, { useEffect } from "react";
import { useForm } from "react-formid";
import { Col, Row } from "reactstrap";
import AuthInput from "../../../components/inputs/auth-input";
import DetailView from "../../../components/views/detail-view";
import { useGrading } from "../../../hooks/useGrading";
import { useGradePoint } from "../../../hooks/useGradePoint";
import { toast } from "react-toastify";

const GradePointDetail = () => {
  const {
    isLoading,
    singleGrading,
    isEdit,
    updateGrading,
    postGradePoint,
    gradePoint,
  } = useGradePoint();

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
        required: false,
      },
      remark: {
        required: true,
      },
      key_range: {
        required: false,
      },
    },
  });

  const onSubmit = (data) => {
    console.log({
      min_mark: Number(data.min_mark),
      max_mark: Number(data.max_mark),
      grade_point: Number(data.max_mark),
      remark: data.remark,
      key_range: `${data.min_mark} - ${data.max_mark}`,
    });

    if (Number(data.min_mark) > 5 || Number(data.max_mark) > 5) {
      toast.error("points should be between 0 to 5");
      return;
    }

    if (isEdit)
      return updateGrading({
        id: singleGrading.id,
        body: {
          min_mark: Number(data.min_mark),
          max_mark: Number(data.max_mark),
          grade_point: Number(data.max_mark),
          remark: data.remark,
          key_range: `${data.min_mark} - ${data.max_mark}`,
        },
      });

    postGradePoint({
      min_mark: Number(data.min_mark),
      max_mark: Number(data.max_mark),
      grade_point: Number(data.max_mark),
      remark: data.remark,
      key_range: `${data.min_mark} - ${data.max_mark}`,
    });
  };

  useEffect(() => {
    if (gradePoint.filteredGp) {
      setInputs({ ...inputs, ...gradePoint.filteredGp });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradePoint.filteredGp]);

  // console.log({ gradePoint: gradePoint.filteredGp });

  return (
    <DetailView
      isLoading={isLoading}
      pageTitle='Create Grade Point'
      onFormSubmit={handleSubmit(onSubmit)}
    >
      <Row className='mb-0 mb-sm-4'>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            label='Min Point'
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
            label='Max Point'
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
        {/* <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            label='Grade Point'
            type='number'
            hasError={!!errors.grade_point}
            {...getFieldProps("grade_point")}
          />
          {!!errors.grade_point && (
            <p className='error-message'>{errors.grade_point}</p>
          )}
        </Col> */}
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            label='Remark'
            hasError={!!errors.remark}
            {...getFieldProps("remark")}
          />
          {!!errors.remark && <p className='error-message'>{errors.remark}</p>}
        </Col>
      </Row>
    </DetailView>
  );
};

export default GradePointDetail;
