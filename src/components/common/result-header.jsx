import React from "react";

const ResultHeader = ({ user, studentImage, changeTableStyle }) => {
  // console.log({ changeTableStyle });

  return (
    <div
      className={`${changeTableStyle ? "school-details" : "school-details2"}`}
    >
      <div
        style={{
          // width: "100%",
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
                objectFit: "contain",
                objectPosition: "center",
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
          <img
            src={user?.school?.schlogo}
            alt='school'
            style={{
              width: "100%",
              height: "200px",
              marginBottom: "0px",
              objectFit: "contain",
              objectPosition: "center",
            }}
          />
        )}
      </div>
      <div className='text'>
        <h3 className='name'>{user?.school?.schname}</h3>
        {user?.school?.schnmotto && (
          <p className='motto'>({user?.school?.schnmotto})</p>
        )}

        {user?.school?.schaddr && (
          <p className='address'>{user?.school?.schaddr}</p>
        )}
        {user?.school?.schphone && (
          <p className='tel'>Tel: {user?.school?.schphone}</p>
        )}
        {user?.school?.schemail && (
          <p className='email'>Email: {user?.school?.schemail}</p>
        )}
        {user?.school?.schwebsite && (
          <p className='web'>Website: {user?.school?.schwebsite}</p>
        )}
      </div>
    </div>
  );
};

export default ResultHeader;
