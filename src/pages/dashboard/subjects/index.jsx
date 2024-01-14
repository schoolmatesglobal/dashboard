import React from "react";
import PageView from "../../../components/views/table-view";
import { useSubject } from "../../../hooks/useSubjects";

const Subjects = () => {
  const { subjects, permission, isLoading, deleteSubject, user } = useSubject();

  const checkForExtraButton = () => {
    if (
      user?.is_preschool === "false" &&
      user?.department === "Admin"
    ) {
      return true;
    } else {
      return false;
    }
  };

  // console.log({ user, cb: checkForExtraButton() });

  return (
    <PageView
      canCreate={permission?.create}
      extraButton={checkForExtraButton()}
      extraLink={`/app/classes`}
      extraButtonTitle="Assign to Class"
      rowHasUpdate={permission?.update}
      rowHasDelete={permission?.delete}
      onDelete={deleteSubject}
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
        // {
        //   Header: "Class",
        //   accessor: "class_name",
        // },
      ]}
      data={subjects}
    />
  );
};

export default Subjects;
