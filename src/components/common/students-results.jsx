import React from "react";
import ProfileImage from "./profile-image";
import { useResults } from "../../hooks/useResults";

const StudentsResults = ({
  studentByClassAndSession,
  isLoading,
  studentData,
  onProfileSelect,
  idWithComputedResult,
}) => {
  // const { idWithComputedResult } = useResults();

  // console.log({ idWithComputedResult, studentData });

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
              studentData?.id === x?.id ? "active" : ""
            }`}
          >
            <ProfileImage src={x?.image} alt={x.firstname} gender={x?.gender} />
            {idWithComputedResult?.includes(x?.id) && (
              <div className='computed' />
            )}
          </div>
          <div>
            <p>{x.firstname}</p>
            <p>{x.surname}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentsResults;
