import React, { useEffect, useState } from "react";
import { useClasses } from "../../../hooks/useClasses";
import PageSheet from "../../../components/common/page-sheet";
import Button from "../../../components/buttons/button";
import PageTitle from "../../../components/common/title";
import GoBack from "../../../components/common/go-back";
import { useNavigate } from "react-router-dom";
import Prompt from "../../../components/modals/prompt";
import { useSubject } from "../../../hooks/useSubjects";
import CustomTable2 from "../../../components/tables/table2";

const AssignElementaryClass = () => {
  // const { isLoading, studentData, promoteStudent } = useStudent();

  const {
    checkedSubjects,
    setCheckedSubjects,
    classData,
    // subjectData2,
    subjectsByClass2,
    assignSubjectsToClass,
    setOnGetSubjectByClass2,
    id,
    onGetSubjectByClass2,
  } = useClasses();

  const { subjects, isLoading: subjectIsLoading } = useSubject();

  // const subjectDt = getClassName();

  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen(!modalOpen);

  const navigate = useNavigate();

  const convertSubjectsArray = () => {
    return subjects?.map((sub, index) => {
      const newArray = { ...sub };
      newArray.class = classData?.class_name;
      return newArray;
    });
  };

  const isLoading = subjectIsLoading;

  const assignSubjectValue = () => {
    return checkedSubjects?.map((rowId) => {
      const findSubject = subjects.find((ns) => ns.id === rowId);
      return { name: findSubject?.subject };
    });
  };

  const assignHandle = () => {
    toggleModal();

    assignSubjectsToClass({
      class_id: id,
      subjects: assignSubjectValue(),
    });

    // console.log({
    //   class_id: id,
    //   subjects: assignSubjectValue(),
    // });

    // navigate("/app/classes");
  };

  useEffect(() => {
    if (subjectsByClass2?.length > 0 && subjects?.length > 0) {
      let name;
      const dataIds = subjectsByClass2[0]?.subject.map((x) => {
        subjects.forEach((sb) => {
          if (sb.subject === x.name) {
            name = sb.id;
          }
        });
        // if (x.name === )
        return name;
      });

      // const dataIds = subjectsByClass2[0]?.subject.map((x) => x.id);
      setCheckedSubjects(dataIds);

      // console.log({
      //   // subjectsByClass2,
      //   dataIds,
      //   cs: checkedSubjects,
      // });
    }
  }, [subjectsByClass2]);

  useEffect(() => {
    setOnGetSubjectByClass2(true);
  }, []);

  console.log({
    // checkedSubjects,
    // subjects,
    subjectsByClass2,
    // sub: promoteStudentsValue(),
    // id,
    // dt: convertSubjectsArray(),
    // subjectData2,
    onGetSubjectByClass2,
    // id,
  });

  return (
    <div>
      {/* <DetailView
        isLoading={isLoading}
        cancelLink="/app/classes"
        pageTitle="Promote Students"
        // onFormSubmit={handleSubmit(onSubmit)} */}
      <PageSheet>
        <GoBack />
        <PageTitle>{`Assign Subject(s) to ${
          classData?.class_name ? classData?.class_name : "Class"
        }`}</PageTitle>
        {!isLoading && (
          <CustomTable2
            hasCheckBox
            checkedRows={checkedSubjects}
            centered
            setCheckedRows={setCheckedSubjects}
            isLoading={isLoading}
            columns={[
              {
                Header: "s/n",
                accessor: "new_id",
              },
              {
                Header: "Subject",
                accessor: "subject",
              },
              {
                Header: "Class",
                accessor: "class",
              },
            ]}
            data={convertSubjectsArray()}
          />
        )}
        {!isLoading && (
          <div className='d-flex align-items-end justify-content-end gap-3'>
            <div className=' mb-sm-0'>
              <Button
                type='button'
                // onClick={toggleModal}
                onClick={() => navigate("/app/classes")}
                // disabled={checkedSubjects.length === 0}
                isLoading={isLoading}
                variant='outline'
              >
                {/* <FontAwesomeIcon icon={faPaperPlane} className="" /> Save */}
                Cancel
              </Button>
            </div>
            <div className=' mb-sm-0'>
              <Button
                type='button'
                onClick={toggleModal}
                // onClick={promoteHandle}
                disabled={checkedSubjects.length === 0}
                isLoading={isLoading}
              >
                {/* <FontAwesomeIcon icon={faPaperPlane} className="" /> Save */}
                Save
              </Button>
            </div>
          </div>
        )}
      </PageSheet>
      <Prompt
        hasGroupedButtons
        groupedButtonProps={[
          { title: "Cancel", onClick: toggleModal, variant: "outline" },
          { title: "Proceed", onClick: assignHandle },
        ]}
        isOpen={modalOpen}
        toggle={toggleModal}
      >
        <p style={{ fontSize: "1.6rem" }}>Are you sure you want to save?</p>
      </Prompt>
    </div>
  );
};

export default AssignElementaryClass;
