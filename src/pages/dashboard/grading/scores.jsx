import React, { useEffect } from "react";
import { Col, Input, Row } from "reactstrap";
import AuthInput from "../../../components/inputs/auth-input";
import DetailView from "../../../components/views/detail-view";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-formid";
import { useGrading } from "../../../hooks/useGrading";
// import { splitName } from "./constant";

const ScoresDetail = () => {
  const { isLoading, scores, addScores } = useGrading();

  const { inputs, setFieldValue, handleSubmit, errors, setInputs } = useForm({
    defaultValues: {
      has_two_assessment: false,
      midterm: "0",
      first_assessment: "0",
      second_assessment: "0",
      exam: "60",
      total: "0",
    },
    validation: {
      midterm: { required: true },
      exam: { required: true },
      total: { required: true },
    },
  });

  // const isLoading = staffLoading;
  // const isLoading = departmentsListLoading || staffLoading;

  const onSubmit = async (data) => {
    // console.log({
    //   has_two_assessment: data.has_two_assessment ? 1 : 0,
    //   first_assessment: data.has_two_assessment === true ? "20" : "0",
    //   second_assessment: data.has_two_assessment === true ? "20" : "0",
    //   midterm: data.has_two_assessment === true ? "0" : "40",
    //   exam: data.exam,
    //   total: data.has_two_assessment === true ? "100" : "100",
    // });

    addScores({
      has_two_assessment: data.has_two_assessment ? 1 : 0,
      first_assessment: data.has_two_assessment === true ? "20" : "0",
      second_assessment: data.has_two_assessment === true ? "20" : "0",
      midterm: data.has_two_assessment === true ? "0" : "40",
      exam: data.exam,
      total: data.has_two_assessment === true ? "100" : "100",
    });

    // console.log({
    //   has_two_assessment: data.has_two_assessment ? 1 : 0,
    //   first_assessment: (data.has_two_assessment === true
    //     ? data.first_assessment
    //     : "0"
    //   ).toString(),
    //   second_assessment: (data.has_two_assessment === true
    //     ? data.second_assessment
    //     : "0"
    //   ).toString(),
    //   midterm: (data.has_two_assessment === true
    //     ? "0"
    //     : data.midterm
    //   ).toString(),
    //   exam: data.exam.toString(),
    //   total: (data.has_two_assessment === true
    //     ? Number(inputs.exam) +
    //       Number(inputs.first_assessment) +
    //       Number(inputs.second_assessment)
    //     : Number(inputs.exam) + Number(inputs.midterm)
    //   ).toString(),
    // });

    // addScores({
    //   has_two_assessment: data.has_two_assessment ? 1 : 0,
    //   first_assessment:
    //     data.has_two_assessment === true ? data.first_assessment : "0",
    //   second_assessment:
    //     data.has_two_assessment === true ? data.second_assessment : "0",
    //   midterm: data.has_two_assessment === true ? "0" : data.midterm,
    //   exam: data.exam,
    //   total: (data.has_two_assessment === true
    //     ? Number(inputs.exam) +
    //       Number(inputs.first_assessment) +
    //       Number(inputs.second_assessment)
    //     : Number(inputs.exam) + Number(inputs.midterm)
    //   ).toString(),
    // });
  };

  useEffect(() => {
    if (scores) {
      // const names = splitName(dos?.dos);
      setInputs({
        ...inputs,
        // ...scores,
        has_two_assessment: scores?.has_two_assessment,
        first_assessment: scores?.first_assessment,
        second_assessment: scores?.second_assessment,
        midterm: scores?.midterm,

        exam: scores?.exam,
      });
    }
  }, [scores]);

  // console.log({ dost: splitName(dos?.dos) });
  // console.log({ inputs });
  // console.log({ user, inputs, scores });

  return (
    <DetailView
      isLoading={isLoading}
      cancelLink='/app/grading'
      pageTitle={"Update SCORES"}
      onFormSubmit={handleSubmit(onSubmit)}
    >
      {/* <div className="mb-5">
        <p className="">NB: Assessment: 20 mks max, Exam: 60 mks</p>
      </div> */}
      <Row className='mb-0 mb-sm-4'>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <div className='mb-4 d-flex align-items-center'>
            <p>Has Two Assessment</p>
            <Input
              type='checkbox'
              className='ms-3'
              checked={inputs.has_two_assessment === true}
              // disabled={!!inputs.has_two_assessment}
              onChange={() =>
                setFieldValue(
                  "has_two_assessment",
                  // inputs.is_preschool === "true" ? "true" : "false"
                  inputs.has_two_assessment === false ? true : false
                )
              }
            />
          </div>
        </Col>
      </Row>

      {inputs.has_two_assessment === true && (
        <Row className='mb-0 mb-sm-4'>
          <Col sm='6' className='mb-4 mb-sm-0'>
            <AuthInput
              label='First Assessment'
              required
              type='number'
              max={20}
              hasError={!!errors.first_assessment}
              // {...getFieldProps("first_assessment")}
              defaultValue={inputs.has_two_assessment === true && 20}
              readOnly
              // value={inputs.first_assessment}
              // onChange={(e) => {
              //   const inputValue = e.target.value;
              //   if (!isNaN(inputValue)) {
              //     if (inputValue <= 20) {
              //       setInputs({
              //         ...inputs,
              //         first_assessment: e.target.value,
              //       });
              //     } else {
              //       setFieldValue("first_assessment", 20);
              //     }
              //   }
              // }}
            />
            {!!errors.first_assessment && (
              <p className='error-message'>{errors.first_assessment}</p>
            )}
            {/* <p className="mt-3 font ">20 mks max.</p> */}
          </Col>
          <Col sm='6' className='mb-4 mb-sm-0'>
            <AuthInput
              label='Second Assessment'
              required
              type='number'
              max={20}
              hasError={!!errors.second_assessment}
              // {...getFieldProps("second_assessment")}
              defaultValue={inputs.has_two_assessment === true && 20}
              readOnly
              // value={inputs.second_assessment}
              // onChange={(e) => {
              //   const inputValue = e.target.value;
              //   if (!isNaN(inputValue)) {
              //     if (inputValue <= 20) {
              //       setInputs({
              //         ...inputs,
              //         second_assessment: e.target.value,
              //       });
              //     } else {
              //       setFieldValue("second_assessment", 20);
              //     }
              //   }
              // }}
            />
            {!!errors.second_assessment && (
              <p className='error-message'>{errors.second_assessment}</p>
            )}
          </Col>
        </Row>
      )}

      {inputs.has_two_assessment === false && (
        <Row className='mb-0 mb-sm-4'>
          <Col sm='6' className='mb-4 mb-sm-0'>
            <AuthInput
              label='Mid Term'
              required
              type='number'
              hasError={!!errors.midterm}
              max={40}
              // {...getFieldProps("midterm")}
              defaultValue={inputs.has_two_assessment === false && 40}
              readOnly
              // value={inputs.midterm}
              // onChange={(e) => {
              //   const inputValue = e.target.value;
              //   if (!isNaN(inputValue)) {
              //     if (inputValue <= 40) {
              //       setInputs({
              //         ...inputs,
              //         midterm: e.target.value,
              //       });
              //     } else {
              //       setFieldValue("midterm", 40);
              //     }
              //   }
              // }}
            />
            {!!errors.midterm && (
              <p className='error-message'>{errors.midterm}</p>
            )}
          </Col>
          <Col sm='6' className='mb-4 mb-sm-0'>
            <AuthInput
              label='Exam'
              required
              type='number'
              max={60}
              hasError={!!errors.exam}
              // {...getFieldProps("exam")}

              defaultValue={60}
              readOnly
              // value={inputs.exam}
              // onChange={(e) => {
              //   const inputValue = e.target.value;
              //   if (!isNaN(inputValue)) {
              //     if (inputValue <= 60) {
              //       setInputs({
              //         ...inputs,
              //         exam: e.target.value,
              //       });
              //     } else {
              //       setFieldValue("exam", 60);
              //     }
              //   }
              // }}
            />
            {!!errors.exam && <p className='error-message'>{errors.exam}</p>}
          </Col>
        </Row>
      )}

      <Row className='mb-0 mb-sm-4'>
        {inputs.has_two_assessment === true && (
          <Col sm='6' className='mb-4 mb-sm-0'>
            <AuthInput
              label='Exam'
              required
              type='number'
              hasError={!!errors.exam}
              defaultValue={60}
              readOnly
              // {...getFieldProps("exam")}

              // onChange={(e) => {
              //   setFieldValue("exam", e.target.value);
              //   setFieldValue(
              //     "total",
              //     (Number(e.target.value) + Number(inputs.midterm)).toString()
              //   );
              // }}
            />
            {!!errors.exam && <p className='error-message'>{errors.exam}</p>}
          </Col>
        )}
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            label='Total'
            required
            type='number'
            hasError={!!errors.total}
            // {...getFieldProps("total")}
            defaultValue={100}
            readOnly
            // value={
            //   inputs.has_two_assessment === true
            //     ? Number(inputs.exam) +
            //       Number(inputs.first_assessment) +
            //       Number(inputs.second_assessment)
            //     : Number(inputs.exam) + Number(inputs.midterm)
            // }
          />
          {!!errors.total && <p className='error-message'>{errors.total}</p>}
        </Col>
      </Row>
    </DetailView>
  );
};

export default ScoresDetail;
