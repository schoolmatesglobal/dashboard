import React, { useEffect, useState } from "react";
import { Col, Row, Spinner } from "reactstrap";
import PageTitle from "../../../components/common/title";
import HomeCard from "../../../components/cards/home-card";
import ProfileCard from "../../../components/cards/profile-card";
import { useHome } from "../../../hooks/useHome";
import Numeral from "react-numeral";
import PieChart from "../../../components/charts/pie-chart";
import AuditCard from "../../../components/cards/audit-card";
import { useAppContext } from "../../../hooks/useAppContext";
import { useQuery } from "react-query";
import queryKeys from "../../../utils/queryKeys";
import { useAuthDetails } from "../../../stores/authDetails";
import axios from "axios";

const SuperAdmin = () => {
  const {
    isLoading,
    outstanding,
    expectedIncome,
    discount,
    totalExpense,
    accountBalance,
    receivedIncome,
  } = useHome();

  const {
    apiServices,
    user,
    updateUser,
    permission,
    apiServices: {
      importStudent,
      errorHandler,
      getSchool,
      getTimeTable,
      formatData,
      getAcademicCalender,
      handleSessionChange,
      handleSessionChange2,
      getAcademicPeriod,
      getAcademicSessions,
      getCurrentAcademicPeriod,
    },
  } = useAppContext();

  const { userDetails, setUserDetails } = useAuthDetails();


  const [initiateCPeriod, setInitiateCPeriod] = useState(true);

  


  console.log({ userDetails,  });

  return (
    <div>
      <PageTitle>Super Admin {isLoading && <Spinner />}</PageTitle>
      <ProfileCard />
      <Row className='mt-5'>
        <Col md='4' className='mb-4 col-6'>
          <HomeCard
            title='Account Balance'
            amount={
              <>
                &#8358;
                <Numeral value={accountBalance?.data || "0"} format='0,0.00' />
              </>
            }
          />
        </Col>
        <Col md='4' className='mb-4 col-6'>
          <HomeCard
            title='Received Income'
            variant='purple'
            amount={
              <>
                &#8358;
                <Numeral value={receivedIncome?.data || "0"} format='0,0.00' />
              </>
            }
          />
        </Col>
        <Col md='4' className='mb-4 col-6'>
          <HomeCard
            title='Expected Income'
            variant='orange'
            amount={
              <>
                &#8358;
                <Numeral value={expectedIncome?.data || "0"} format='0,0.00' />
              </>
            }
          />
        </Col>
        <Col md='4' className='mb-4 col-6'>
          <HomeCard
            title='Total Expense'
            variant='red'
            amount={
              <>
                &#8358;
                <Numeral value={totalExpense?.data || "0"} format='0,0.00' />
              </>
            }
          />
        </Col>
        <Col md='4' className='mb-4 col-6'>
          <HomeCard
            title='Discount'
            variant='green'
            amount={
              <>
                &#8358;
                <Numeral value={discount?.data || "0"} format='0,0.00' />
              </>
            }
          />
        </Col>
        <Col md='4' className='mb-4 col-6'>
          <HomeCard
            title='Outstanding'
            variant='pink'
            amount={
              <>
                &#8358;
                <Numeral value={outstanding?.data || "0"} format='0,0.00' />
              </>
            }
          />
        </Col>
      </Row>
      <Row className='mt-3'>
        {/* <Col sm="6" className="mb-4"> */}
        <Col className='mb-4'>
          <PieChart
            data={[
              +accountBalance?.data ?? 0,
              +receivedIncome?.data ?? 0,
              +expectedIncome?.data ?? 0,
              +totalExpense?.data ?? 0,
              +discount?.data ?? 0,
              +outstanding?.data ?? 0,
            ]}
            label={[
              "Account Balance",
              "Received Income",
              "Expected Income",
              "Total Expense",
              "Discount",
              "Outstanding",
            ]}
          />
        </Col>
        {/* <Col sm="6" className="mb-4">
          <AuditCard />
        </Col> */}
      </Row>
    </div>
  );
};

export default SuperAdmin;
