import React from "react";
import PageView from "../../../components/views/table-view";
import { useDepartments } from "../../../hooks/useDepartments";

const Departments = () => {
  const { isLoading, departmentsList, permission, deleteDepartment } =
    useDepartments();

  return (
    <PageView
      canCreate={permission?.create}
      rowHasUpdate={permission?.update}
      rowHasDelete={permission?.delete}
      onDelete={deleteDepartment}
      isLoading={isLoading}
      columns={[
        {
          Header: "S/N",
          accessor: "new_id",
        },
        {
          Header: "Department ID",
          accessor: "department_id",
        },
        {
          Header: "Department Name",
          accessor: "department_name",
        },
      ]}
      data={departmentsList}
    />
  );
};

export default Departments;
