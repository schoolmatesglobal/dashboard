import React, { useEffect } from "react";
import PageView from "../../../components/views/table-view";
import { useClasses } from "../../../hooks/useClasses";
import { getActionOptions, getActionOptions2 } from "./constant";
import { useNavigate } from "react-router-dom";
import { useSubject } from "../../../hooks/useSubjects";

const Classes = () => {
  const {
    classes,
    isLoading,
    onDeleteClass,
    permission,
    setOnGetSubjectByClass2,
  } = useClasses();
  const { user } = useSubject();

  const checkForExtraButton = () => {
    if (
      user?.is_preschool === "false" &&
      // user?.designation_name === "Admin" &&
      user?.department === "Admin"
    ) {
      return true;
    } else {
      return false;
    }
  };
  const navigate = useNavigate();

 

  useEffect(() => {
    setOnGetSubjectByClass2(true);
  }, []);

  return (
    <PageView
      canCreate={permission?.create}
      rowHasUpdate={permission?.update}
      rowHasDelete={permission?.delete}
      onDelete={onDeleteClass}
      isLoading={isLoading}
      action={
        checkForExtraButton()
          ? getActionOptions2({
              permission,
              navigate,
            })
          : getActionOptions({ permission, navigate })
      }
      rowHasAction={permission?.create}
      // rowHasAction={permission?.action && indexStatus === "all"}
      columns={[
        {
          Header: "s/n",
          accessor: "new_id",
        },
        {
          Header: "Class Name",
          accessor: "class_name",
        },
        // {
        //   Header: "Sub Classes",
        //   accessor: "sub_class",
        // },
      ]}
      data={classes}
    />
  );
};

export default Classes;
