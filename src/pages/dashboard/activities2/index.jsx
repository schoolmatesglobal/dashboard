import React from "react";
import PageView from "../../../components/views/table-view";
import { useActivities } from "../../../hooks/useActivities";
// import { useSubject } from "../../../hooks/useSubjects";

const ExtraCurricular2 = () => {
  const {
    isLoading,
    preActivities,
    deletePreActivity,
    permission,
   
  } = useActivities();
  

  return (
    <PageView
      canCreate={permission?.create}
      rowHasDelete={permission?.delete}
      onDelete={deletePreActivity}
      isLoading={isLoading}
      columns={[
        {
          Header: "s/n",
          accessor: "new_id",
        },
        {
          Header: "Activity",
          accessor: "name",
        },
        // {
        //   Header: "Class",
        //   accessor: "class_name",
        // },
      ]}
      data={preActivities}
    />
  );
};

export default ExtraCurricular2;
