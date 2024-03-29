import React from "react";
import AuthInput from "../../../components/inputs/auth-input";
import CustomTable from "../../../components/tables/table";
import PageSheet from "../../../components/common/page-sheet";
import Button from "../../../components/buttons/button";
import { useStudentAttendance } from "../../../hooks/useStudentAttendance";

const Attendance = () => {
  const {
    isLoading,
    date,
    setDate,
    studentAttendance,
    setRetrieveAttendance,
    todayDate,
    permission,
    students,
    checkedRows,
    setCheckedRows,
    addStudentAttendance,
    addStudentAttendanceLoading,
  } = useStudentAttendance();

  return (
    <PageSheet>
      <div className="d-flex align-items-center custom-search">
        {permission?.retrieve && (
          <AuthInput
            type="date"
            wrapperClassName="custom-search-input"
            value={date}
            max={todayDate}
            onChange={({ target: { value } }) => setDate(value)}
          />
        )}
        <div className="custom-search-buttons">
          {permission?.retrieve && (
            <Button
              variant="outline"
              className="ms-2"
              disabled={!date}
              onClick={() => setRetrieveAttendance(true)}
            >
              Retrieve
            </Button>
          )}
          {permission?.save && (
            <Button
              className="ms-2"
              isLoading={addStudentAttendanceLoading}
              disabled={addStudentAttendanceLoading}
              onClick={addStudentAttendance}
            >
              Save
            </Button>
          )}
        </div>
      </div>
      <CustomTable
        hasCheckBox
        checkedRows={checkedRows}
        centered
        setCheckedRows={setCheckedRows}
        isLoading={isLoading}
        columns={[
          {
            Header: "Full Name",
            accessor: "student_fullname",
          },
          {
            Header: "Admission Number",
            accessor: "admission_number",
          },
          {
            Header: "Class",
            accessor: "class",
          }
        ]}
        data={
          !studentAttendance || studentAttendance?.length === 0
            ? students
            : studentAttendance
        }
      />
    </PageSheet>
  );
};

export default Attendance;


