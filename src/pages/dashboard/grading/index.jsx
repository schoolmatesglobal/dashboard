import React from "react";
import PageView from "../../../components/views/table-view";
import { useGrading } from "../../../hooks/useGrading";

const Grading = () => {
  const { isLoading, grading, deleteGrading } = useGrading();

  // console.log({ grading, permission });

  return (
    <PageView
      extraButton={true}
      extraLink={`/app/grading/scores`}
      extraButtonTitle='Assign Scores'
      rowHasUpdate
      rowHasDelete
      onDelete={deleteGrading}
      isLoading={isLoading}
      columns={[
        {
          Header: "S/N",
          accessor: "new_id",
        },
        {
          Header: "From",
          accessor: "score_from",
        },
        {
          Header: "To",
          accessor: "score_to",
        },
        {
          Header: "Grade",
          accessor: "grade",
        },
        {
          Header: "Remark",
          accessor: "remark",
        },
      ]}
      data={grading}
    />
  );
};

export default Grading;
