import {
  faCalendar,
  faPeopleLine,
  faPersonDress,
  faTimeline,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "reactstrap";
import HomeCard from "../../../components/cards/home-card";
import ProfileCard from "../../../components/cards/profile-card";
import PageTitle from "../../../components/common/title";
import { useHome } from "../../../hooks/useHome";

const Teacher = () => {
  const { isLoading, timetableData, calendarData, user, academicPeriod } = useHome();
  const navigate = useNavigate();

  

  // console.log({ userH: user, academicPeriod });

  return (
    <div className='teachers'>
      <PageTitle> Teacher {isLoading && <Spinner />}</PageTitle>
      <ProfileCard type='teacher' />
      <div className='teachers-cards-wrapper'>
        <HomeCard
          isBadge
          variant='purple'
          title='My Students'
          icon={faPeopleLine}
          onClick={() =>
            navigate("/app/students", { state: { status: "myStudents" } })
          }
        />
        <HomeCard
          isBadge
          variant='orange'
          title='Calender'
          icon={faCalendar}
          isLink
          download
          to={calendarData?.file || "/"}
          target='_blank'
        />
        <HomeCard
          isBadge
          title='Timetable'
          icon={faTimeline}
          to={timetableData?.file || "/"}
          download
          target='_blank'
          isLink
        />
        <HomeCard
          isBadge
          variant='green'
          title='Assignment'
          icon={faBook}
          to='/app/assignments'
          isLink
        />
        <HomeCard
          isBadge
          variant='pink'
          title='Dress Code'
          icon={faPersonDress}
          to='/app/dress-code'
          isLink
        />
      </div>
    </div>
  );
};

export default Teacher;
