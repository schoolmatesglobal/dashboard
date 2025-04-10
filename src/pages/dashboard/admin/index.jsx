import {
  faBusinessTime,
  faCalendar,
  faPeopleLine,
  faTimeline,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { useForm } from "react-formid";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { Col, Row, Spinner } from "reactstrap";
import HomeCard from "../../../components/cards/home-card";
import ProfileCard from "../../../components/cards/profile-card";
import PageTitle from "../../../components/common/title";
import AuthInput from "../../../components/inputs/auth-input";
import AuthSelect from "../../../components/inputs/auth-select";
import Prompt from "../../../components/modals/prompt";
import { useAcademicPeriod } from "../../../hooks/useAcademicPrompt";
import { useAppContext } from "../../../hooks/useAppContext";
import { useFile } from "../../../hooks/useFile";
import queryKeys from "../../../utils/queryKeys";
import { Link } from "react-router-dom";
import AuditCard from "../../../components/cards/audit-card";
import { useAuthDetails } from "../../../stores/authDetails";
import Button from "../../../components/buttons/button";
import { queryOptions, sortByAcademicSession } from "../../../utils/constants";

const Admin = () => {
  const [importStudentPrompt, setImportStudentPrompt] = useState(false);
  const [academicStatus, setAcademicStatus] = useState("Add");
  const [initiateSchool, setInitiateSchool] = useState(true);
  const [initiateGrade, setInitiateGrade] = useState(true);
  const [initiatePeriod, setInitiatePeriod] = useState(true);
  const [initiateCPeriod, setInitiateCPeriod] = useState(true);
  const [initiateSession, setInitiateSession] = useState(true);
  const [activatePreschools, setActivatePreschools] = useState(true);
  const [loading1, setLoading1] = useState(false);

  const [isValid, setIsValid] = useState(true);

  // Function to check if the input matches the "YYYY/YYYY" format
  const validateAcademicSession = (input) => {
    const regex = /^\d{4}\/\d{4}$/;
    const isMatch = regex.test(input);

    // Set the boolean to false if the input does not match the format
    setIsValid(isMatch);
  };

  const {
    user,
    updateUser,
    apiServices,
    apiServices: {
      importStudent,
      errorHandler,
      errorHandler2,
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
    permission,
  } = useAppContext();

  // function sortByAcademicSession(array) {
  //   return array.sort((a, b) => {
  //     const [startYearA, endYearA] = a.academic_session.split("/").map(Number);
  //     const [startYearB, endYearB] = b.academic_session.split("/").map(Number);

  //     // Compare start years first, if equal, compare end years
  //     if (startYearA === startYearB) {
  //       return endYearA - endYearB;
  //     }
  //     return startYearA - startYearB;
  //   });
  // }

  const { userDetails, setUserDetails } = useAuthDetails();

  const [activateClasses, setActivateClasses] = useState(true);
  const [activateCampuses, setActivateCampuses] = useState(true);
  const is_preschool = !!user?.is_preschool && user.is_preschool !== "false";

  const {
    isLoading,
    // postAcademicPeriod,
    academicPeriodPrompt,
    setAcademicPeriodPrompt,
    // postCurrentAcademicPeriod,
  } = useAcademicPeriod();

  const {
    data: academicSessions,
    isLoading: academicSessionLoading,
    refetch: refetchAcademicSession,
  } = useQuery([queryKeys.GET_ACADEMIC_SESSIONS], getAcademicSessions, {
    // retry: 1,
    // refetchOnMount: true,
    // refetchOnWindowFocus: false,
    ...queryOptions,
    enabled: initiateSession,
    select: (data) => {
      console.log({ datam: data });
      return sortByAcademicSession(data?.data);
    },
    onSuccess(data) {
      setUserDetails({
        ...userDetails,
        sessions: data,
      });
      setInitiateSession(false);
    },
    onError: errorHandler,
  });

  // const { data: maxScores, isLoading: maxScoresLoading } = useQuery(
  //   [queryKeys.GET_MAX_SCORES],
  //   apiServices.getMaxScores,
  //   {
  //     // retry: 1,
  //     // refetchOnMount: true,
  //     // refetchOnWindowFocus: false,
  //      ...queryOptions,
  //     enabled: initiateGrade,
  //     // enabled: !is_preschool,
  //     onError(err) {
  //       errorHandler(err);
  //     },
  //     select: (data) => {
  //       const dt = data?.data;
  //       console.log({ scoreData: data, dt });
  //       // console.log({ datam: data });
  //       return dt;
  //     },
  //     onSuccess: (data) => {
  //       setUserDetails({
  //         ...userDetails,
  //         maxScores: data,
  //       });
  //       setInitiateGrade(false);
  //       // return data?.data[0]?.attributes;
  //     },
  //   }
  // );

  const { isLoading: schoolLoading } = useQuery(
    [queryKeys.GET_SCHOOL],
    getSchool,
    {
      // retry: 1,
      // refetchOnMount: true,
      // refetchOnWindowFocus: false,
      ...queryOptions,
      enabled: initiateSchool,
      onSuccess(data) {
        updateUser({
          ...user,
          school: { ...data },
        });
        setUserDetails({ ...userDetails, school: { ...data } });
        setInitiateSchool(false);
      },
      onError(err) {
        errorHandler(err);
      },
      select: (data) => data?.data[0].attributes,
    }
  );

  const { isLoading: timetableLoading, data: timetableData } = useQuery(
    [queryKeys.GET_TIME_TABLE],
    getTimeTable,
    {
      // retry: 1,
      // refetchOnMount: true,
      // refetchOnWindowFocus: false,
      ...queryOptions,
      onError(err) {
        errorHandler(err);
      },
      select: (data) => {
        // console.log({ dataCC: data });

        return formatData(data)?.length
          ? formatData(data)[formatData(data)?.length - 1]
          : {};
      },
    }
  );

  const { isLoading: calendarLoading, data: calendarData } = useQuery(
    [queryKeys.GET_ACADEMIC_CALENDER],
    getAcademicCalender,
    {
      // retry: 1,
      // refetchOnMount: true,
      // refetchOnWindowFocus: false,
      ...queryOptions,
      onError(err) {
        errorHandler(err);
      },
      select: (data) => {
        // console.log({ dataCC: data });

        return formatData(data)?.length
          ? formatData(data)[formatData(data)?.length - 1]
          : {};
      },
    }
  );

  const { handleChange, inputs, errors, setFieldValue, setInputs } = useForm({
    defaultValues: {
      period: "First Half",
      session: "",
      term: "First Term",
      period2: "First Half",
      session2: "2023/2024",
      term2: "First Term",
    },
    validation: {
      period: {
        required: academicStatus === "Add" && true,
      },
      session: {
        required: academicStatus === "Add" && true,
      },
      term: {
        required: academicStatus === "Add" && true,
      },
      period2: {
        required: academicStatus === "Set" && true,
      },
      session2: {
        required: academicStatus === "Set" && true,
      },
      term2: {
        required: academicStatus === "Set" && true,
      },
    },
  });

  // const { isLoading: academicPeriodLoading } = useQuery(
  //   [queryKeys.GET_ACADEMIC_PERIOD],
  //   getAcademicPeriod,
  //   {
  //     retry: 1,
  //     refetchOnMount: true,
  //     refetchOnWindowFocus: false,
  //     enabled: initiatePeriod,
  //     select: (data) => {
  //       // console.log({ acDt: data, acDt2: data?.data });

  //       // return data?.data;
  //       return data?.data[0];
  //     },
  //     onSuccess(data) {
  //       console.log({ acDt3: data });

  //       // setInputs({
  //       //   ...inputs,
  //       //   term: data?.term,
  //       //   session: data?.session,
  //       //   period: data?.period,
  //       // });
  //       // setUserDetails({
  //       //   ...userDetails,
  //       //   term: data?.term,
  //       //   session: data?.session,
  //       //   period: data?.period,
  //       // });

  //       if (data?.term) {
  //         setInitiatePeriod(false);
  //       }
  //     },
  //     onError(err) {
  //       errorHandler(err);
  //     },
  //   }
  // );

  function trigger(time) {
    setLoading1(true);
    setTimeout(() => {
      setLoading1(false);
    }, time);
  }

  const {
    isLoading: currentAcademicPeriodLoading,
    refetch: refetchCurrentAcademicPeriod,
  } = useQuery(
    [queryKeys.GET_CURRENT_ACADEMIC_PERIOD],
    getCurrentAcademicPeriod,
    {
      // retry: 2,
      // refetchOnMount: true,
      // refetchOnWindowFocus: false,
      ...queryOptions,
      enabled: initiateCPeriod,
      select: (data) => {
        console.log({ ccDt: data, ccDt2: data?.data });

        // return data?.data;
        return data?.data;
      },
      onSuccess(data) {
        // console.log({ acDt3: data });

        updateUser({
          ...user,
          term: data?.term,
          session: data?.session,
          period: data?.period,
        });
        setInputs({
          ...inputs,
          term2: data?.term,
          session2: data?.session,
          period2: data?.period,
        });
        setUserDetails({
          ...userDetails,
          term: data?.term,
          session: data?.session,
          period: data?.period,
        });
        if (data?.term) {
          setInitiateCPeriod(false);
        }
      },
      onError(err) {
        errorHandler2(err);
      },
    }
  );

  const {
    isLoading: classListLoading,
    data: classDt,
    refetch: refetchClasses,
  } = useQuery([queryKeys.GET_ALL_CLASSES], apiServices.getAllClasses, {
    // retry: 1,
    // refetchOnMount: true,
    // refetchOnWindowFocus: false,
    ...queryOptions,
    enabled: activateClasses && !is_preschool,
    // enabled: activateClasses && !is_preschool,
    onSuccess(data) {
      // setClasses(data);
      console.log({ classesData: data });
      const formatClassList = data?.map((x) => ({
        ...x,
        sub_class: x.sub_class.split(",").join(", "),
      }));

      setUserDetails({
        ...userDetails,
        classes:
          formatClassList?.map((obj, index) => {
            const newObj = { ...obj };
            newObj.new_id = index + 1;
            return newObj;
          }) ?? [],
      });

      setActivateClasses(false);
    },
    onError(err) {
      errorHandler(err);
    },
    select: apiServices.formatData,
  });

  const { handleImageChange, base64String, fileRef, reset } = useFile([], true);

  const { mutate: uploadFile, isLoading: uploadLoading } = useMutation(
    importStudent,
    {
      onSuccess() {
        setImportStudentPrompt(false);
        reset();
        toast.success("File has been imported");
      },
      onError: errorHandler,
    }
  );

  const { data: preSchools, isLoading: preSchoolsLoading } = useQuery(
    [queryKeys.GET_ALL_PRE_SCHOOLS],
    apiServices.getPreSchools,
    {
      ...queryOptions,
      // enabled: true,
      enabled: activatePreschools && is_preschool,
      select: apiServices.formatData,
      // select: (data) => {
      //   const f = apiServices.formatData(data);
      //   console.log({ preschoolData: data?.data, f });

      //   return data?.data;
      // },
      onSuccess(data) {
        // setClasses(data);

        setUserDetails({
          ...userDetails,
          preschools: data ?? [],
        });

        setActivatePreschools(false);
      },
      onError: apiServices.errorHandler,
    }
  );

  // Fetch Campus List
  const {
    isLoading: campusListLoading,
    data: campusList,
    refetch: refetchCampusList,
  } = useQuery([queryKeys.GET_ALL_CAMPUSES], apiServices.getAllCampuses, {
    enabled: activateCampuses,
    retry: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    onError(err) {
      errorHandler(err);
    },
    // select: apiServices.formatData,
    select: (data) => {
      const f = apiServices.formatData(data)?.map((x) => ({
        value: x?.name,
        title: x?.name,
      }));

      return { ...data, options: f };
    },
    onSuccess(data) {
      // setClasses(data);
      console.log({ campusData: data });

      setUserDetails({
        ...userDetails,
        campusList: data,
      });

      setActivateCampuses(false);
    },
  });

  const { mutate: postAcademicPeriod, isLoading: postAcademicPeriodLoading } =
    useMutation(apiServices.postAcademicPeriod, {
      onSuccess() {
        setInitiateCPeriod(true);
        setInitiateSession(true);
        refetchCurrentAcademicPeriod();
        refetchAcademicSession();
        trigger(1000);
        setInputs({
          ...inputs,
          period: "First Half",
          session: "",
          term: "First Term",
        });
        setAcademicPeriodPrompt(false);
        toast.success("Academic Period has been posted successfully");
      },
      onError: apiServices.errorHandler,
    });

  const { mutate: postCurrentAcademicPeriod, isLoading: postCurrentAPLoading } =
    useMutation(apiServices.postCurrentAcademicPeriod, {
      onSuccess() {
        setInitiateCPeriod(true);
        refetchCurrentAcademicPeriod();
        trigger(1000);
        setInputs({
          ...inputs,
          period: "First Half",
          session: "",
          term: "First Term",
        });
        setAcademicPeriodPrompt(false);
        toast.success("Current Academic Period has been set successfully");
      },
      onError: apiServices.errorHandler,
    });

  useEffect(() => {
    validateAcademicSession(inputs?.session);
  }, [inputs?.session]);

  const postLoading =
    isLoading ||
    // currentAcademicPeriodLoading ||
    postAcademicPeriodLoading ||
    postCurrentAPLoading ||
    academicSessionLoading;

  const loading =
    isLoading ||
    uploadLoading ||
    schoolLoading ||
    calendarLoading ||
    timetableLoading ||
    academicSessionLoading ||
    classListLoading ||
    preSchoolsLoading ||
    // currentAcademicPeriodLoading ||
    campusListLoading ||
    // maxScoresLoading ||
    loading1;
  // academicPeriodLoading;

  // console.log({ calendarData, userDetails, permission, isValid });
  console.log({ is_preschool, user, userDetails });

  return (
    <div className='teachers' key={loading1}>
      <PageTitle>Admin {loading && <Spinner />}</PageTitle>
      <ProfileCard type='admin' />
      <Row className='my-5'>
        <Col sm='6' className='col-12'>
          <Row>
            <Col className='col-6 mb-5'>
              <HomeCard
                isBadge
                variant='orange'
                title='Import Students'
                icon={faPeopleLine}
                onClick={() => setImportStudentPrompt(!importStudentPrompt)}
              />
            </Col>
            <Col className='col-6 mb-5'>
              <HomeCard
                variant='purple'
                isBadge
                title='Calender'
                icon={faCalendar}
                isLink
                download
                to={calendarData?.file || "/"}
                target='_blank'
              />
            </Col>
            <Col className='col-6 mb-5'>
              <HomeCard
                isBadge
                title='Timetable'
                icon={faTimeline}
                to={timetableData?.file || "/"}
                download
                target='_blank'
                isLink
              />
            </Col>
            <Col className='col-6 mb-5'>
              <HomeCard
                isBadge
                variant='green'
                title='Academic Period'
                icon={faBusinessTime}
                onClick={() => setAcademicPeriodPrompt(true)}
              />
            </Col>
          </Row>
        </Col>
        <Col sm='6' className='col-12'>
          <AuditCard />
        </Col>
      </Row>
      <Prompt
        isOpen={importStudentPrompt}
        toggle={() => setImportStudentPrompt(!importStudentPrompt)}
        singleButtonProps={{
          type: "button",
          isLoading: isLoading || uploadLoading,
          disabled: isLoading || uploadLoading || !base64String,
          onClick: () => uploadFile({ files: base64String }),
        }}
        singleButtonText='Continue'
        promptHeader='Import Student'
      >
        <AuthInput
          type='file'
          className='px-0'
          wrapperClassName='border-0'
          onChange={handleImageChange}
          ref={fileRef}
          accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
        />
        <Link
          to='/app/students/imported'
          className='text-success text-decoration-none'
          style={{ fontSize: "1.2rem" }}
        >
          View file format
        </Link>
      </Prompt>
      <Prompt
        isOpen={academicPeriodPrompt}
        toggle={() => setAcademicPeriodPrompt(!academicPeriodPrompt)}
        singleButtonProps={{
          type: "button",
          isLoading: postLoading,
          disabled:
            postLoading ||
            (academicStatus === "Add" ? !inputs?.term : !inputs?.term2) ||
            (academicStatus === "Add" ? !inputs?.period : !inputs?.period2) ||
            (academicStatus === "Add" && !isValid) ||
            (academicStatus === "Add" ? !inputs.session : !inputs.session2),
          onClick: () => {
            academicStatus === "Add"
              ? postAcademicPeriod({
                  period: inputs?.period,
                  session: inputs?.session,
                  term: inputs?.term,
                })
              : postCurrentAcademicPeriod({
                  period: inputs?.period2,
                  session: inputs?.session2,
                  term: inputs?.term2,
                });
            // refetchCurrentAcademicPeriod();
            // setTimeout(() => {}, 1000);
          },
        }}
        singleButtonText={academicStatus === "Add" ? "Continue" : "Set Current"}
        promptHeader='Post Academic Period'
      >
        <div className='d-flex align-items-center justify-content-center gap-3 mb-5'>
          <Button
            className='w-auto'
            variant={`${academicStatus === "Add" ? "" : "outline"}`}
            onClick={() => setAcademicStatus("Add")}
          >
            Add
          </Button>
          <Button
            className='w-auto'
            variant={`${academicStatus === "Set" ? "" : "outline"}`}
            onClick={() => setAcademicStatus("Set")}
          >
            Set
          </Button>
        </div>
        {academicStatus === "Add" && (
          <div className=''>
            <div className='form-group mb-4'>
              <AuthSelect
                label='Period'
                value={inputs.period}
                name='period'
                hasError={!!errors.period}
                onChange={handleChange}
                options={[
                  { value: "First Half", title: "First Half/Mid Term" },
                  { value: "Second Half", title: "Second Half/End of Term" },
                ]}
              />
              {!!errors.period && (
                <p className='error-message'>{errors.period}</p>
              )}
            </div>
            <div className='form-group mb-4'>
              <AuthSelect
                label='Term'
                value={inputs.term}
                name='term'
                hasError={!!errors.term}
                onChange={handleChange}
                options={[
                  { value: "First Term", title: "First Term" },
                  { value: "Second Term", title: "Second Term" },
                  { value: "Third Term", title: "Third Term" },
                ]}
              />
              {!!errors.term && <p className='error-message'>{errors.term}</p>}
            </div>
            <div className='form-group mb-4'>
              <AuthInput
                label='Session'
                placeholder='2021/2022'
                hasError={!!errors.session}
                value={inputs.session}
                onChange={({ target: { value } }) =>
                  handleSessionChange2(value, "session", setFieldValue)
                }
              />
              {!!errors.session && (
                <p className='error-message'>{errors.session}</p>
              )}
            </div>
          </div>
        )}
        {academicStatus === "Set" && (
          <div className=''>
            <div className='form-group mb-4'>
              <AuthSelect
                label='Period'
                value={inputs.period2}
                name='period2'
                hasError={!!errors.period2}
                onChange={handleChange}
                options={[
                  { value: "First Half", title: "First Half/Mid Term" },
                  { value: "Second Half", title: "Second Half/End of Term" },
                ]}
              />
              {!!errors.period2 && (
                <p className='error-message'>{errors.period2}</p>
              )}
            </div>
            <div className='form-group mb-4'>
              <AuthSelect
                label='Term'
                value={inputs.term2}
                name='term2'
                hasError={!!errors.term2}
                onChange={handleChange}
                options={[
                  { value: "First Term", title: "First Term" },
                  { value: "Second Term", title: "Second Term" },
                  { value: "Third Term", title: "Third Term" },
                ]}
              />
              {!!errors.term2 && (
                <p className='error-message'>{errors.term2}</p>
              )}
            </div>
            <div className='form-group mb-4'>
              <AuthSelect
                label='Session'
                value={inputs.session2}
                name='session2'
                hasError={!!errors.session2}
                onChange={handleChange}
                options={(academicSessions || [])?.map((session) => ({
                  value: session?.academic_session,
                  title: session?.academic_session,
                }))}
              />
              {!!errors.session2 && (
                <p className='error-message'>{errors.session2}</p>
              )}
            </div>
          </div>
        )}
      </Prompt>
    </div>
  );
};

export default Admin;
