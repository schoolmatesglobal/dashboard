import React from "react";
import PageView from "../../../components/views/table-view";
import { useGrading } from "../../../hooks/useGrading";
import { useGradePoint } from "../../../hooks/useGradePoint";

const GradePoint = () => {
  const { isLoading, deleteGrading, gradePoint } = useGradePoint();

  console.log({ gradePoint });

  return (
    <PageView
      // extraButton={true}
      // extraLink={`/app/grading/scores`}
      // extraButtonTitle='Assign Scores'
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
          Header: "Min Mark",
          accessor: "min_mark",
        },
        {
          Header: "Max Mark",
          accessor: "max_mark",
        },
        {
          Header: "Grade Point",
          accessor: "grade_point",
        },
        {
          Header: "Key Range",
          accessor: "key_range",
        },
        {
          Header: "Remark",
          accessor: "remark",
        },
      ]}
      data={gradePoint}
    />
  );
};

export default GradePoint;
