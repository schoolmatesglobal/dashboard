import React, { useEffect, useState } from "react";
import { useForm } from "react-formid";
import AuthSelect from "../../../components/inputs/auth-select";
import { useClasses } from "../../../hooks/useClasses";
import { useStudent } from "../../../hooks/useStudent";
import Button from "../../../components/buttons/button";
import { faPaperPlane,  } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PageSheet from "../../../components/common/page-sheet";
import GoBack from "../../../components/common/go-back";
import PageTitle from "../../../components/common/title";
import { useNavigate } from "react-router-dom";
import Prompt from "../../../components/modals/prompt";

const PromoteStudent = () => {
  const {
    isLoading: studentIsLoading,
    studentData,
    // promoteStudent,
  } = useStudent();

  const {
    isLoading: promoteIsLoading,
    promoteAllStudents,
    classes,
  } = useClasses();

  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen(!modalOpen);

  // const { classes } = useClasses();

  const {  setInputs, inputs, errors, } = useForm({
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

  const isLoading = studentIsLoading || promoteIsLoading;

  const sortedClasses = classes.filter(
    (cl) =>
      cl.class_name.toUpperCase() !== studentData.present_class.toUpperCase()
  );

  useEffect(() => {
    if (studentData) {
      setInputs({
        ...inputs,
        campus: studentData?.campus,
        present_class: studentData?.present_class,
        sub_class: studentData?.sub_class,
      });
    }
  }, [studentData]);

  const promoteHandle = async () => {
    toggleModal();
    await promoteAllStudents({
      class: inputs.promotion_class,
      students: [studentData?.id],
    });

    // console.log({
    //   class: inputs.promotion_class,
    //   students: [studentData?.id],
    // });

    navigate("/app/students");
  };

  // console.log({
  //   class: inputs.promotion_class,
  //   students: [studentData?.id],
  // });
  // console.log({ sc: sortedClasses, classes, studentData });
  // console.log({ classes, studentData });

  return (
    <div>
      {/* <DetailView
        isLoading={isLoading}
        cancelLink="/app/classes"
        pageTitle="Promote Students"
        // onFormSubmit={handleSubmit(onSubmit)} */}
      <PageSheet>
        <GoBack />
        {studentData?.firstname && (
          <div className="">
            <PageTitle>{`Promote - ${studentData?.firstname} ${studentData?.middlename} ${studentData?.surname}`}</PageTitle>
            <div className="d-flex align-content-center gap-3">
              <p className="mb-5">Present Class:</p>
              <PageTitle>{`${studentData?.present_class} `}</PageTitle>
            </div>
          </div>
        )}
        {/* <PageTitle>{`Promote Student(s) in ${
          classData?.class_name ? classData?.class_name : "Class"
        }`}</PageTitle> */}

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
              disabled={!inputs.promotion_class}
              isLoading={isLoading}
            >
              <FontAwesomeIcon icon={faPaperPlane} className="" /> Promote
            </Button>
          </div>
        </div>
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

export default PromoteStudent;
