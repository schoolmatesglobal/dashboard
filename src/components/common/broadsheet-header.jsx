import React from "react";

const BroadSheetHeader = ({
  user,
  studentImage,
  additionalCreds,
  changeTableStyle,
  broadSheetResults,
}) => {
  // console.log({ broadSheetResults });
  return (
    <div
      className={`${changeTableStyle ? "school-details" : "school-details2"}`}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "end",
        }}
      >
        <div style={{ padding: "0px 30px" }}>
          {studentImage && (
            <img
              src={studentImage}
              alt='school'
              style={{
                width: "140px",
                height: "143px",
                borderRadius: "50%",
                marginBottom: "0px",
                border: "6px solid green",
              }}
            />
          )}
        </div>
      </div>
      <div
        className='image'
        style={{ marginTop: `${studentImage ? "-140px" : "0px"}` }}
      >
        {user?.school?.schlogo && (
          <img src={user?.school?.schlogo} alt='school' />
        )}
      </div>
      <div className='text'>
        <h3 className='name'>{user?.campus}</h3>
        {/* {user?.school?.schnmotto && (
          <p className='motto'>({user?.school?.schnmotto})</p>
        )} */}

        {/* <p className='address'>{user?.school?.schaddr}</p> */}
        {/* <p className='tel'>Tel: {user?.school?.schphone}</p> */}
        {/* <p className='email'>Email: {user?.school?.schemail}</p> */}
        {/* <p className='web'>Website: {user?.school?.schwebsite}</p> */}

        <p style={{ fontSize: "18px", fontWeight: "bold", marginTop: "10px" }}>
          {broadSheetResults?.class_name}
        </p>
        <p
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginTop: "20px",
            textTransform: "uppercase",
          }}
        >
          {additionalCreds?.term} {additionalCreds?.session}
        </p>
        {/* <p style={{ fontSize: "18px", fontWeight: "bold", marginTop: "30px" }}>
          BROAD SHEET
        </p> */}
      </div>
    </div>
  );
};

export default BroadSheetHeader;
