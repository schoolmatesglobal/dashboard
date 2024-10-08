import React from "react";
import PageView from "../../../components/views/table-view";
import { useSkills } from "../../../hooks/useSkills";

const Skills = () => {
  const { isLoading, skills, permission, deleteSkill } = useSkills();

  return (
    <PageView
      data={skills}
      canCreate={permission?.create}
      isLoading={isLoading}
      rowHasUpdate={permission?.update}
      rowHasDelete={permission?.delete}
      onDelete={deleteSkill}
      columns={[
        {
          Header: "S/N",
          accessor: "new_id",
        },
        {
          Header: "Name",
          accessor: "skill_type",
        },
      ]}
    />
  );
};

export default Skills;
