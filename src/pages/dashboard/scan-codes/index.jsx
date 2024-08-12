import React from "react";
import PageView from "../../../components/views/table-view";
import { useSkills } from "../../../hooks/useSkills";
import { useNavigate, useSearchParams } from "react-router-dom";

const ScanCodes = () => {
  const navigate = useNavigate();
  const { isLoading, skills, permission, deleteSkill } = useSkills();

  const qrs = [
    {
      id: "1",
      code_type: "Daily Attendance",
    },
    // {
    //   id: "2",
    //   code_type: "Student's Attendance",
    // },
  ];

  console.log({ skills });

  return (
    <PageView
      data={qrs}
      canCreate={false}
      isLoading={isLoading}
      // rowHasUpdate={permission?.update}
      rowHasAction={true}
      // rowHasDelete={permission?.delete}
      // onDelete={deleteSkill}
      columns={[
        {
          Header: "id",
          accessor: "id",
        },
        {
          Header: "Scan Type",
          accessor: "code_type",
        },
      ]}
      action={[
        {
          title: "Scan QR Code",
          // onClick: (id) => navigate(`/app/qr-codes/download/5`),
          onClick: (id) => navigate(`/app/scan-codes/scan/${id}`),
        },
      ]}
    />
  );
};

export default ScanCodes;
