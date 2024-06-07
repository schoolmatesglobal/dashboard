import React from "react";
import ProfileImage from "./profile-image";

const CBStudentsRow = ({
  studentByClassAndSession,
  isLoading,
  onProfileSelect,
  idWithComputedResult,
  selectedStudent,
}) => {
  return (
    <div className='students-wrapper'>
      {studentByClassAndSession?.map((x) => (
        <div
          key={x?.id}
          onClick={() => {
            onProfileSelect(x);
          }}
          className='student'
        >
          <div
            className={`loader ${isLoading ? "is-loading" : ""} ${
              selectedStudent?.student_id === x?.id ? "active" : ""
            }`}
          >
            <ProfileImage src={x?.image} alt={x.firstname} gender={x?.gender} />
            {idWithComputedResult?.includes(x?.id) && (
              <div className='computed' />
            )}
          </div>
          <div>
            <p className={`${x?.id === "999" && "fw-bold"}`}>{x.firstname}</p>
            <p className={`${x?.id === "999" && "fw-bold"}`}>{x.surname}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CBStudentsRow;
