import React from "react";
import PageView from "../../../components/views/table-view";
import { useSkills } from "../../../hooks/useSkills";
import { useReporting } from "../../../hooks/useReporting";

const Reporting = () => {
  const { isLoading, reports, permission, deleteReport, user } = useReporting();

  const collegeReport = () => {
    if (reports?.length > 0) {
      return reports?.map((rp, i) => {
        return {
          id: i + 1,
          report_type:
            rp.report_type === "PUPIL REPORT"
              ? "AFFECTIVE REPORT"
              : rp.report_type === "PSYCHOMOTOR PERFORMANCE"
              ? "PSYCHOMOTOR REPORT"
              : rp.report_type,
          attribute: rp.attribute,
        };
      });
    } else {
      return [];
    }
  };

  // console.log({ reports, collegeReport: collegeReport() });

  return (
    <PageView
      data={user?.campus?.includes("College") ? collegeReport() : reports}
      canCreate={permission?.create}
      isLoading={isLoading}
      rowHasUpdate={permission?.update}
      rowHasDelete={permission?.delete}
      onDelete={deleteReport}
      columns={[
        {
          Header: "S/N",
          accessor: "id",
        },
        {
          Header: "Name",
          accessor: "report_type",
        },
      ]}
    />
  );
};

export default Reporting;
