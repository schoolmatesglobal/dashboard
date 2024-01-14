import React, { useEffect, useState } from "react";
import { useForm } from "react-formid";
import { Col, Row } from "reactstrap";
import AuthSelect from "../../../components/inputs/auth-select";
import DetailView from "../../../components/views/detail-view";
import { useClasses } from "../../../hooks/useClasses";
import { useStudent } from "../../../hooks/useStudent";
import PageSheet from "../../../components/common/page-sheet";
import CustomTable from "../../../components/tables/table";
import Button from "../../../components/buttons/button";
import { faPaperPlane, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PageTitle from "../../../components/common/title";
import GoBack from "../../../components/common/go-back";
import { useNavigate } from "react-router-dom";
import Prompt from "../../../components/modals/prompt";

const PromoteClass = () => {
  // const { isLoading, studentData, promoteStudent } = useStudent();

  const {
    classes,
    newStudents,
    permission,
    checkedRows,
    setCheckedRows,
    isLoading: promoteIsLoading,
    classData,
    promoteAllStudents,
  } = useClasses();

  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen(!modalOpen);

  const { handleSubmit, setInputs, inputs, errors, handleChange } = useForm({
    defaultValues: {
      // campus: "",
      promotion_class: "",
      promotion_sub_class: "",
    },
    validation: {
      promotion_class: {
        required: (val) => !!val || "Promotion class is required",
      },
      // promotion_sub_class: {
      //   required: (val) => !!val || "Promotion subclass is required",
      // },
    },
  });

  const [studentId, setstudentId] = useState("");

  // const onSubmit = (data) => {
  //   // promoteStudent({
  //   //   id: studentData?.id,
  //   //   ...data,
  //   // });
  // };
  const navigate = useNavigate();

  const promoteStudentsValue = () => {
    return checkedRows?.map((rowId) => {
      const findStudent = newStudents.find((ns) => ns.id === rowId);
      // ...student,
      // // student_id: ,
      // class: `${student.present_class} ${student.sub_class}`,
      return findStudent?.id;
      // return {
      //   student_id: findStudent?.id,
      //   // present_class: findStudent?.present_class,
      //   // sub_class: findStudent?.sub_class,
      //   // campus: findStudent?.campus,
      // };
    });
  };

  const presentClass =
    newStudents && newStudents[0]?.present_class.toUpperCase();

  const isLoading = promoteIsLoading;

  const sortedClasses = classes.filter(
    (cl) => cl.class_name.toUpperCase() !== presentClass
  );

  // const promoteHandle = () => {
  //   promoteAllStudents({
  //     class: inputs.promotion_class,
  //     students: promoteStudentsValue(),
  //   });
  //   console.log({
  //     class: inputs.promotion_class,
  //     students: promoteStudentsValue(),
  //   });
  // };

  const promoteHandle = async () => {
    toggleModal();
    await promoteAllStudents({
      class: inputs.promotion_class,
      students: promoteStudentsValue(),
    });

    // console.log({
    //   class: inputs.promotion_class,
    //   students: promoteStudentsValue(),
    // });

    navigate("/app/classes");
  };


  // const selectStudent = () => {};

  // console.log({ newStudents });

  return (
    <div>
      {/* <DetailView
        isLoading={isLoading}
        cancelLink="/app/classes"
        pageTitle="Promote Students"
        // onFormSubmit={handleSubmit(onSubmit)} */}
      <PageSheet>
        <GoBack />
        <PageTitle>{`Promote Student(s) in ${
          classData?.class_name ? classData?.class_name : "Class"
        }`}</PageTitle>
        {!isLoading && (
          <CustomTable
            hasCheckBox
            checkedRows={checkedRows}
            centered
            setCheckedRows={setCheckedRows}
            isLoading={isLoading}
            columns={[
              {
                Header: "Full Name",
                accessor: "student_fullname",
              },
              {
                Header: "Admission Number",
                accessor: "admission_number",
              },
              {
                Header: "Class",
                accessor: "class",
              },
            ]}
            data={newStudents}
          />
        )}
        {!isLoading && (
          <div className="d-flex align-items-end justify-content-between ">
            <div className="">
              <AuthSelect
                label="Promote to"
                value={inputs.promotion_class}
                name="promotion_class"
                // hasError={!!errors.present_class}
                onChange={(e) => {
                  setInputs({
                    ...inputs,
                    promotion_class: e.target.value,
                    promotion_sub_class: "",
                  });
                }}
                options={(sortedClasses || []).map((x) => ({
                  value: x?.class_name,
                  title: x?.class_name,
                }))}
              />
              {!!errors.promotion_class && (
                <p className="error-message">{errors.promotion_class}</p>
              )}
            </div>
            <div className=" mb-sm-0">
              <Button
                type="button"
                onClick={toggleModal}
                // onClick={promoteHandle}
                disabled={
                  !inputs.promotion_class || promoteStudentsValue().length === 0
                }
                isLoading={isLoading}
              >
                <FontAwesomeIcon icon={faPaperPlane} className="" /> Promote
              </Button>
            </div>
          </div>
        )}
      </PageSheet>
      <Prompt
        hasGroupedButtons
        groupedButtonProps={[
          { title: "Cancel", onClick: toggleModal, variant: "outline" },
          { title: "Proceed", onClick: promoteHandle },
        ]}
        isOpen={modalOpen}
        toggle={toggleModal}
      >
        <p style={{ fontSize: "1.6rem" }}>Are you sure you want continue?</p>
      </Prompt>
    </div>
  );
};

export default PromoteClass;
