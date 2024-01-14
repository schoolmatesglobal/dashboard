import React from "react";
import PageView from "../../../components/views/table-view";
import { useClasses } from "../../../hooks/useClasses";

const ClassSubjects = () => {
  const { subjects, isLoading } = useClasses();

  const newSubjects = subjects?.length > 0 ? subjects[0]?.subject : [];

  // console.log({ subjects, newSubjects });

  return (
    <PageView
      canCreate={false}
      isLoading={isLoading}
      columns={[
        {
          Header: "id",
          accessor: "id",
        },
        {
          Header: "Subject",
          accessor: "name",
        },
        {
          Header: "Class",
          accessor: "class_name",
        },
      ]}
      data={newSubjects}
    />
    // <></>
  );
};

export default ClassSubjects;
