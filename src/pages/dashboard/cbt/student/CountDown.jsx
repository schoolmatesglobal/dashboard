import { faTruckFieldUn } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useMediaQuery } from "react-responsive";
import { useStudentCBT } from "../../../../hooks/useStudentCBT";

const minuteSeconds = 60;
const hourSeconds = 3600;
const daySeconds = 86400;

const timerProps = {
  isPlaying: true,
  size: 120,
  strokeWidth: 6,
};

const renderTime = (dimension, time) => {
  return (
    <div className='d-flex flex-column text-center'>
      <div className='fs-1 fw-bold'>{time}</div>
      <div className='fs-3 fw-bold'>{dimension}</div>
    </div>
  );
};

const getTimeSeconds = (time) => (minuteSeconds - time) | 0;
const getTimeMinutes = (time) => ((time % hourSeconds) / minuteSeconds) | 0;
const getTimeHours = (time) => ((time % daySeconds) / hourSeconds) | 0;
const getTimeDays = (time) => (time / daySeconds) | 0;

const CountdownTimer = ({
  durationInMinutes,
  isPlaying,
  setIsPlaying,
  day,
  hour,
  minute,
  showWarning,
  setShowWarning,
  timeLeft,
  setTimeLeft,
  setObjectiveSubmitted,
  submitObjectiveAssignment,
  secondleft,
  setSecondLeft,
  hourLeft,
  setHourLeft,
  testEnded,
  setTestEnded,
  objectiveSubmitted,
  initialTaken,
  submitted,
  setSubmitted,
}) => {
  const { createQ2, setCreateQ2 } = useStudentCBT();

  const [key, setKey] = useState(0);

  useEffect(() => {
    // Increment the key whenever hour or minute changes
    setKey(prevKey => prevKey + 1);
  }, [hour, minute]);

  const isDesktop = useMediaQuery({ query: "(min-width: 992px)" });
  const isTablet = useMediaQuery({
    query: "(min-width: 768px, max-width: 991px)",
  });
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

 

  const startTime = Math.floor(Date.now() / 1000);





  // Convert the duration components to seconds
  const totalSeconds = 24 * 60 * 60 + hour * 60 * 60 + minute * 60;

  // use UNIX timestamp in seconds
  const endTime = startTime + totalSeconds; // use UNIX timestamp in seconds

  const remainingTime = endTime - startTime;
  const days = Math.ceil(remainingTime / daySeconds);
  const daysDuration = days * daySeconds;

 

  console.log({ createQ2, day, hour, minute });

  return (
    <div key = {
      key
    } className='flex flex-col align-items-center'>
      <div
        className='d-flex justify-content-center gap-3 px-5'
        // style={{ width: "60px", height: "60px" }}
      >
        <CountdownCircleTimer
          {...timerProps}
          colors='#11355c'
          duration={daySeconds}
          size={isMobile ? 90 : 120}
          isPlaying={isPlaying}
          initialRemainingTime={remainingTime % daySeconds}
        >
          {({ elapsedTime, color }) => {
            setHourLeft(getTimeHours(daySeconds - elapsedTime));
            return (
              <span style={{ color }}>
                {renderTime("hours", getTimeHours(daySeconds - elapsedTime))}
              </span>
            );
          }}
        </CountdownCircleTimer>
        <CountdownCircleTimer
          {...timerProps}
          colors='#367fa9'
          duration={hourSeconds}
          size={isMobile ? 90 : 120}
          isPlaying={isPlaying}
          initialRemainingTime={remainingTime % hourSeconds}
          onComplete={(totalElapsedTime) => {
            return {
              shouldRepeat: !testEnded,
            };
          }}
        >
          {({ elapsedTime, color }) => {
            setTimeout(() => {
              setTimeLeft(getTimeMinutes(hourSeconds - elapsedTime));
            }, 1000);
            return (
              <span style={{ color }}>
                {renderTime(
                  "minutes",
                  getTimeMinutes(hourSeconds - elapsedTime)
                )}
              </span>
            );
          }}
        </CountdownCircleTimer>
        <CountdownCircleTimer
          {...timerProps}
          colors='#f53a01'
          duration={minuteSeconds}
          size={isMobile ? 90 : 120}
          isPlaying={isPlaying}
          initialRemainingTime={remainingTime % minuteSeconds}
          onComplete={(totalElapsedTime) => {
            return {
              shouldRepeat: !testEnded,
            };
          }}
        >
          {/* setSecondLeft */}

          {({ elapsedTime, color }) => {
            setSecondLeft(
              Math.abs(getTimeSeconds(hourSeconds - elapsedTime) + 3480)
            );
            // console.log({ secondleft });
            return (
              <span style={{ color }}>
                {renderTime("seconds", getTimeSeconds(elapsedTime))}
              </span>
            );
          }}
        </CountdownCircleTimer>
      </div>

      {timeLeft <= 1 && hourLeft === 0 && !testEnded && isPlaying && (
        <div
          className='mt-5 d-flex justify-content-center align-items-center gap-3 bg-danger bg-opacity-10 py-4 px-4'
          style={{
            animation: "blinking 2s infinite",
          }}
        >
          <p className='fs-3 fw-bold text-danger rounded-3'>
            Time is remaining {timeLeft} min : {secondleft} sec
          </p>
        </div>
      )}

      {submitted && !testEnded && (
        <div
          className='mt-5 d-flex justify-content-center align-items-center gap-3 bg-danger bg-opacity-10 py-4 px-4'
        >
          <p className='fs-3 fw-bold text-danger rounded-3'>Test has ended.</p>
        </div>
      )}

      {submitted && testEnded && (
        <div
          className='mt-5 d-flex justify-content-center align-items-center gap-3 bg-danger bg-opacity-10 py-4 px-4'
          // style={{
          //   animation: "blinking 2s infinite",
          // }}
        >
          <p className='fs-3 fw-bold text-danger rounded-3'>Test has ended.</p>
        </div>
      )}

      {initialTaken && !submitted && (
        <div
          className='mt-5 d-flex justify-content-center align-items-center gap-3 bg-danger bg-opacity-10 py-4 px-4'
          // style={{
          //   animation: "blinking 2s infinite",
          // }}
        >
          <p className='fs-3 fw-bold text-danger rounded-3'>
            Test has been taken.
          </p>
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;
