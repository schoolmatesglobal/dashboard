import React, { useEffect } from "react";
import DetailView from "../../../components/views/detail-view";
import { useSkills } from "../../../hooks/useSkills";
import { Col, Row, Button as Btn } from "reactstrap";
import AuthInput from "../../../components/inputs/auth-input";
import { useForm } from "react-formid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBucket, faPen } from "@fortawesome/free-solid-svg-icons";
import AuthSelect from "../../../components/inputs/auth-select";
import { useReporting } from "../../../hooks/useReporting";

const ReportingDetail = () => {
  const { isLoading, addReport, isEdit, editReport, report, reports, user } =
    useReporting();

  const {
    inputs,
    errors,
    handleSubmit,
    handleChange,
    setFieldValue,
    setInputs,
  } = useForm({
    defaultValues: {
      report_type: "",
      attribute: [""],
    },
    validation: {
      report_type: { required: true },
      attribute: {
        shouldHaveContents: (val) => val.length > 0 && val?.every((x) => !!x),
      },
    },
  });

  const onSubmit = async (data) => {
    if (isEdit) {
      await editReport({ ...data, id: report.id });
      return;
    }
    await addReport(data);
  };

  useEffect(() => {
    if (report) {
      setInputs({
        ...inputs,
        report_type: report.report_type,
        attribute: report.attribute,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [report]);

  // console.log({ report, inputs, reports });
  // console.log({ user });

  return (
    <DetailView
      isLoading={isLoading}
      pageTitle={`${isEdit ? "Update Report" : "Add Report"}`}
      onFormSubmit={handleSubmit(onSubmit)}
    >
      <Row className='mb-0 mb-sm-4'>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthSelect
            placeholder='Select Report Title'
            hasError={!!errors.report_type}
            value={inputs.report_type}
            name='report_type'
            onChange={handleChange}
            options={[
              {
                title: user?.campus?.includes("College")
                  ? "AFFECTIVE REPORT"
                  : "PUPIL'S MONITORING REPORT",
                value: "PUPIL REPORT",
              },
              // {
              //   title: user?.campus?.includes("College")
              //   ? "PSYCHOMOTOR REPORT"
              //   : "PSYCHOMOTOR REPORT",
              //   value: "PSYCHOMOTOR PERFORMANCE",
              // },
              {
                title: "PSYCHOMOTOR REPORT",
                value: "PSYCHOMOTOR PERFORMANCE",
              },
              // {
              //   value: "AFFECTIVE DISPOSITION",
              //   title: "AFFECTIVE DISPOSITION",
              // },
            ]}
          />
          {!!errors.report_type && (
            <p className='error-message'>{errors.report_type}</p>
          )}
        </Col>
      </Row>
      <hr />
      {inputs.attribute.map((input, index) => (
        <Row key={index} className='my-5'>
          <Col className='col-6 mb-4 mb-sm-0'>
            <AuthInput
              type='text'
              placeholder='Enter Attributes Here...'
              value={input.name}
              name='firstname'
              onChange={({ target: { value } }) => {
                const format = inputs.attribute.map((x, k) => {
                  if (k === index) return { name: value };
                  return x;
                });

                setFieldValue("attribute", format);
              }}
            />
          </Col>
          <Col className='col-2 mb-4 mb-sm-0'>
            {inputs.attribute.length > 1 && (
              <Btn
                outline
                type='button'
                color='danger'
                className='me-3'
                onClick={() => {
                  const format = inputs.attribute.filter((_, k) => k !== index);

                  setFieldValue("attribute", format);
                }}
              >
                <FontAwesomeIcon icon={faBucket} />
              </Btn>
            )}
            {inputs.attribute.length === index + 1 && (
              <Btn
                type='button'
                color='primary'
                disabled={!input}
                onClick={() =>
                  setFieldValue("attribute", [...inputs.attribute, ""])
                }
              >
                <FontAwesomeIcon icon={faPen} />
              </Btn>
            )}
          </Col>
        </Row>
      ))}
    </DetailView>
  );
};

export default ReportingDetail;
