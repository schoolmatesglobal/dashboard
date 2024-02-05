import React from "react";

const InvoiceHeader = ({ user, studentImage, changeTableStyle }) => {
  // console.log({ changeTableStyle });

  return (
    <div className={``}>
      <div
        className='d-flex justify-content-between'
        // style={{ padding: "0 20px" }}
      >
        <div
          className=''
          style={{
            margin: "10px 0px",
          }}
        >
          <h3
            style={{
              fontWeight: "bold",
              color: "midnightblue",
              fontSize: "3rem",
              lineHeigth: "1rem",
              textTransform: "uppercase",
            }}
          >
            {user?.school?.schname}
          </h3>
          {user?.school?.schnmotto && (
            <p
              // className='motto'
              style={{
                fontWeight: "semi-bold",
                fontSize: "18px",
                marginTop: "10px",
                textTransform: "uppercase",
              }}
            >
              ({user?.school?.schnmotto})
            </p>
          )}
          {user?.school?.schaddr && (
            <p
              // className='address'
              style={{
                fontWeight: "bold",
                fontSize: "18px",
                marginTop: "10px",
                textTransform: "uppercase",
              }}
            >
              {user?.school?.schaddr}
            </p>
          )}
          {user?.school?.schphone && (
            <p
              // className='tel'
              style={{
                fontWeight: "semi-bold",
                fontSize: "18px",
                marginTop: "20px",
              }}
            >
              Tel: {user?.school?.schphone}
            </p>
          )}
          {user?.school?.schemail && (
            <p
              // className='tel'
              style={{
                fontWeight: "semi-bold",
                fontSize: "18px",
                marginTop: "10px",
              }}
            >
              Email: {user?.school?.schemail}
            </p>
          )}
          {user?.school?.schwebsite && (
            <p
              // className='tel'
              style={{
                fontWeight: "semi-bold",
                fontSize: "18px",
                marginTop: "10px",
              }}
            >
              Website: {user?.school?.schwebsite}
            </p>
          )}
        </div>
        <div className=''>
          {user?.school?.schlogo && (
            <img
              src={user?.school?.schlogo}
              alt='school'
              style={{
                width: "150px",
                height: "150px",
                objectFit: "contain",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceHeader;
