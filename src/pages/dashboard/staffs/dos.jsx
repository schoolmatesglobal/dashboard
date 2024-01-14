import React, { useEffect } from "react";
import { Col, Row } from "reactstrap";
import AuthInput from "../../../components/inputs/auth-input";
import { useStaff } from "../../../hooks/useStaff";
import DetailView from "../../../components/views/detail-view";
import { useForm } from "react-formid";
import { splitName } from "./constant";

const DosDetail = () => {
  const { isLoading: staffLoading, isEdit, addDos, dos } = useStaff();

  const {
    getFieldProps,
    inputs,
    handleSubmit,
    errors,
    setInputs,
  } = useForm({
    defaultValues: {
      lastname: "",
      firstname: "",
    },
    validation: {
      lastname: { required: true },
      firstname: { required: true },
    },
  });



  const isLoading = staffLoading;
  // const isLoading = departmentsListLoading || staffLoading;

  const onSubmit = async (data) => {
    // if (isEdit) {
    //   return await addDos({ ...data });

    //   console.log({ ...data });
    // }
    // console.log({ dos: `${data.firstname} ${data.lastname}` });
    addDos({ dos: `${data.firstname} ${data.lastname}` });
  };

  useEffect(() => {
    if (dos) {
      const names = splitName(dos?.dos);
      setInputs({
        ...inputs,
        firstname: names.firstname,
        lastname: names.lastname,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dos]);

  // console.log({ dost: splitName(dos?.dos) });
  // console.log({ dos: dos?.dos });

  return (
    <DetailView
      isLoading={isLoading}
      cancelLink='/app/staffs'
      pageTitle={
        isEdit ? "Update DIRECTOR OF STUDIES" : "Update DIRECTOR OF STUDIES"
      }
      onFormSubmit={handleSubmit(onSubmit)}
    >
      <Row className='mb-0 mb-sm-4'>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            label='Title'
            required
            hasError={!!errors.firstname}
            {...getFieldProps("firstname")}
          />
          {!!errors.firstname && (
            <p className='error-message'>{errors.firstname}</p>
          )}
        </Col>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            label='Full Name'
            required
            hasError={!!errors.lastname}
            {...getFieldProps("lastname")}
          />
          {!!errors.lastname && (
            <p className='error-message'>{errors.lastname}</p>
          )}
        </Col>
      </Row>
    </DetailView>
  );
};

export default DosDetail;
