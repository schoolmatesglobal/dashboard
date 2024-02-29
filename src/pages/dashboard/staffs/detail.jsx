import React, { useEffect } from "react";
import { Col, Row } from "reactstrap";
import AuthInput from "../../../components/inputs/auth-input";
import { useStaff } from "../../../hooks/useStaff";
import DetailView from "../../../components/views/detail-view";
import AuthSelect from "../../../components/inputs/auth-select";
import { roleMap } from "../../../utils/constants";
import ImagePreview from "../../../components/common/image-preview";
import { useDepartments } from "../../../hooks/useDepartments";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandPointer } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../components/buttons/button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useClasses } from "../../../hooks/useClasses";

const StaffDetail = () => {
  const {
    addStaff,
    isLoading: staffLoading,
    onUpdateStaff,
    staffData,
    isEdit,
    getFieldProps,
    inputs,
    setFieldValue,
    handleSubmit,
    errors,
    setInputs,
    handleChange,
    handleImageChange,
    filePreview,
    base64String,
    resetFile,
    fileRef,
    campusList,
    designationRole,
    user,
  } = useStaff();

  const {
    classes,
    // checkedSubjects,
    setCheckedSubjects,
    isLoading: classLoading,
    // subjectData2,
    // subjects: subjectsByClass,
    // subjectsByClass2,
  } = useClasses();

  const findId = () => {
    const find = classes.find((sb) => sb.class_name === inputs.class_assigned);
    if (find) {
      return find.id;
    } else {
      return "";
    }
  };

  // const {
  //   campusList,
  //   // isLoading,
  //   // toggleCampusStatus,
  //   // permission,
  //   // deleteCampus,
  // } = useCampus();

  const navigate = useNavigate();

  const { isLoading: departmentsListLoading, departmentsList } =
    useDepartments();

  const isLoading = staffLoading || classLoading;
  // const isLoading = departmentsListLoading || staffLoading;

  const onSubmit = async (data) => {
    const image = isEdit ? (base64String ? base64String : "") : base64String;

    // console.log({ ...data, image, signature: "", password: "12345678" });
    // const image = isEdit
    //   ? base64String
    //     ? base64String
    //     : "staffData.image"
    //   : base64String;
    // if (staffData.designation_id !== "4")
    //   return toast.error("Staff is not a teacher");
    // if (user?.is_preschool === "true" && !inputs.class_assigned) {
    //   return toast.error("Please assign class to this teacher");
    // }

    if (
      (!inputs.firstname ||
        !inputs.surname ||
        !inputs.middlename ||
        !inputs.username ||
        !inputs.department ||
        !inputs.campus ||
        !inputs.email ||
        !inputs.designation_id) &&
      user?.designation_name === "Superadmin"
    ) {
      return toast.error("Please fill all required fields");
    }
    if (
      (!inputs.firstname ||
        !inputs.surname ||
        !inputs.middlename ||
        !inputs.username ||
        !inputs.department ||
        !inputs.campus ||
        !inputs.email ||
        !inputs.designation_id) &&
      user?.designation_name !== "Superadmin"
    ) {
      return toast.error("Please fill all required fields");
    }
    if (
      inputs?.designation_id === "4" &&
      user?.designation_name !== "Superadmin" &&
      !inputs.class_assigned
    ) {
      return toast.error("Please fill all required fields");
    }

    if (isEdit) {
      return await onUpdateStaff({ ...data, signature: "", image });

      // console.log({ ...data, image, signature: "", password: "12345678" });
    }

    await addStaff({ ...data, signature: "", image, password: "12345678" });
  };

  useEffect(() => {
    if (staffData) {
      setInputs({
        ...inputs,
        ...staffData,
        designation: staffData?.designation_id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffData]);

  // console.log({ di: inputs?.designation_id });
  console.log({ user, inputs });

  return (
    <DetailView
      isLoading={isLoading}
      cancelLink='/app/staffs'
      pageTitle={isEdit ? "Edit Staff" : "Add Staff"}
      onFormSubmit={handleSubmit(onSubmit)}
    >
      {/* {isEdit && user?.is_preschool === "false" && ( */}
      {isEdit && user?.is_preschool === "false" && (
        <div className='mb-5 d-flex justify-content-end gap-3'>
          {staffData?.designation_id === "4" && (
            <Button
              type='button'
              disabled={isLoading}
              isLoading={isLoading}
              variant='outline-dark'
              onClick={() =>
                navigate(`/app/staffs/assign-class/${staffData?.id}`)
              }
            >
              <FontAwesomeIcon icon={faHandPointer} className='me-2' /> Assign
              Class / Subject
            </Button>
          )}
        </div>
      )}
      {/* {isEdit && user?.is_preschool === "true" && (
        <div className='mb-5 d-flex justify-content-end gap-3'>
          {staffData?.designation_id === "4" && (
            <Button
              type='button'
              disabled={isLoading}
              isLoading={isLoading}
              variant='outline-dark'
              onClick={() =>
                navigate(`/app/staffs/assign-preclass/${staffData?.id}`)
              }
            >
              <FontAwesomeIcon icon={faHandPointer} className='me-2' /> Assign
              Class
            </Button>
          )}
        </div>
      )} */}
      <Row className='mb-0 mb-sm-4'>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            label='First Name'
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
            label='Last Name'
            required
            hasError={!!errors.surname}
            {...getFieldProps("surname")}
          />
          {!!errors.surname && (
            <p className='error-message'>{errors.surname}</p>
          )}
        </Col>
      </Row>
      <Row className='mb-0 mb-sm-4'>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            label='Middle Name'
            required
            hasError={!!errors.middlename}
            {...getFieldProps("middlename")}
          />
          {!!errors.middlename && (
            <p className='error-message'>{errors.middlename}</p>
          )}
        </Col>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            label='Email Address'
            required
            hasError={!!errors.email}
            {...getFieldProps("email")}
          />
          {!!errors.email && <p className='error-message'>{errors.email}</p>}
        </Col>
      </Row>
      <Row className='mb-0 mb-sm-4'>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            label='Username'
            required
            hasError={!!errors.username}
            {...getFieldProps("username")}
          />
          {!!errors.username && (
            <p className='error-message'>{errors.username}</p>
          )}
        </Col>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            isPhone
            label='Phone Number'
            value={inputs.phoneno}
            hasError={!!errors.phoneno}
            onChange={(value) => setFieldValue("phoneno", value || "")}
          />
          {!!errors.phoneno && (
            <p className='error-message'>{errors.phoneno}</p>
          )}
        </Col>
      </Row>
      <Row className='mb-0 mb-sm-4'>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            label='Address'
            hasError={!!errors.address}
            {...getFieldProps("address")}
          />
          {!!errors.address && (
            <p className='error-message'>{errors.address}</p>
          )}
        </Col>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthSelect
            label='Department'
            required
            hasError={!!errors.department}
            {...getFieldProps("department")}
            options={(departmentsList || []).map((x) => ({
              value: x?.department_name,
              title: x?.department_name,
            }))}
          />
          {!!errors.department && (
            <p className='error-message'>{errors.department}</p>
          )}
        </Col>
      </Row>

      <Row className='mb-0 mb-sm-4'>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthSelect
            label='Role'
            required
            value={inputs.designation_id}
            name='designation_id'
            hasError={!!errors.designation_id}
            onChange={handleChange}
            options={(designationRole?.data || []).map((x) => ({
              value: x?.id,
              title: roleMap[x?.attributes?.designation_name],
            }))}
          />
          {!!errors.designation_id && (
            <p className='error-message'>{errors.designation_id}</p>
          )}
        </Col>

        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthSelect
            label='Campus'
            required
            value={inputs.campus}
            name='campus'
            hasError={!!errors.campus}
            onChange={handleChange}
            options={campusList?.options}
          />
          {!!errors.campus && <p className='error-message'>{errors.campus}</p>}
        </Col>
      </Row>

      <Row className='mb-0 mb-sm-4 '>
        {/* teacher type */}
        {inputs?.designation_id === "4" && user?.is_preschool === "false" && (
          <Col sm='6' className='mb-4 mb-sm-0'>
            <AuthSelect
              label='Teacher type'
              required
              value={inputs.teacher_type}
              name='teacher_type'
              hasError={!!errors.teacher_type}
              onChange={handleChange}
              options={[
                {
                  value: "subject teacher",
                  title: "Subject teacher",
                },
                {
                  value: "class teacher",
                  title: "Class teacher",
                },
              ]}
            />
            {!!errors.teacher_type && (
              <p className='error-message'>{errors.teacher_type}</p>
            )}
          </Col>
        )}
        {/* assign preschool class */}
        {user?.designation_name !== "Superadmin" && (
          <Col sm='6' className='mb-4 mb-sm-0'>
            <AuthSelect
              label='Assign Class'
              required={inputs?.designation_id === "4"}
              value={inputs.class_assigned}
              name='class_assigned'
              hasError={!!errors.class_assigned}
              onChange={(e) => {
                setInputs({
                  ...inputs,
                  class_assigned: e.target.value,
                  // sub_class: "",
                });
              }}
              options={(classes || []).map((x) => ({
                value: x?.class_name,
                title: x?.class_name,
              }))}
            />
            {!!errors.class_assigned && (
              <p className='error-message'>{errors.class_assigned}</p>
            )}
          </Col>
        )}

        <Col
          sm='6'
          className={`${user?.is_preschool === "false" && "mt-4"} mb-4 mb-sm-0`}
        >
          <AuthInput
            type='file'
            className='px-0'
            wrapperClassName='border-0'
            label='Profile Image'
            onChange={handleImageChange}
            ref={fileRef}
          />
        </Col>
      </Row>

      <ImagePreview
        src={filePreview || staffData?.image}
        centered
        wrapperClassName='my-5'
        reset={resetFile}
      />
    </DetailView>
  );
};

export default StaffDetail;
