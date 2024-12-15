import React from "react";
import PageView from "../../../components/views/table-view";
import { useSkills } from "../../../hooks/useSkills";
import { useNavigate, useSearchParams } from "react-router-dom";

const QRCodes = () => {
  const navigate = useNavigate();
  const { isLoading, skills, permission, deleteSkill } = useSkills();

  const qrs = [
    {
      id: "1",
      code_type: "Staff's Attendance",
    },
    {
      id: "2",
      code_type: "Student's Attendance",
    },
  ];

  // console.log({ skills });

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
          Header: "S/N",
          accessor: "id",
        },
        {
          Header: "Code Type",
          accessor: "code_type",
        },
      ]}
      action={[
        {
          title: "View QR Code",
          // onClick: (id) => navigate(`/app/qr-codes/download/5`),
          onClick: (id) => navigate(`/app/qr-codes/download/${id}`),
        },
      ]}
    />
  );
};

export default QRCodes;
