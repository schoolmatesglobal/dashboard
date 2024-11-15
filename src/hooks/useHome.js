import { useQuery } from "react-query";
import queryKeys from "../utils/queryKeys";
import { useAppContext } from "./useAppContext";
import { useAuthDetails } from "../stores/authDetails";
import { useState } from "react";

export const useHome = () => {
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

  const [initiateSession, setInitiateSession] = useState(true);
  const [initiateSchool, setInitiateSchool] = useState(true);
  const [initiatePeriod, setInitiatePeriod] = useState(true);
  const [initiateClassP, setInitiateClassP] = useState(true);
  const [initiateSchoolP, setInitiateSchoolP] = useState(true);
  const [initiateStaffP, setInitiateStaffP] = useState(true);
  const [initiateStudentP, setInitiateStudentP] = useState(true);
  const [initiateTeacherP, setInitiateTeacherP] = useState(true);
  const [initiateCPeriod, setInitiateCPeriod] = useState(true);
  const [activateCampuses, setActivateCampuses] = useState(true);
  const [activateClasses, setActivateClasses] = useState(true);
  const [activatePreschools, setActivatePreschools] = useState(true);
  const is_preschool = !!user?.is_preschool && user.is_preschool !== "false";

  const { userDetails, setUserDetails } = useAuthDetails();

  const { isLoading: outstandingLoading, data: outstanding } = useQuery(
    [queryKeys.GET_ALL_OUTSTANDING],
    apiServices.getAllOutstanding,
    {
      enabled: ["Superadmin", "Account"].includes(user?.designation_name),
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      onError(err) {
        errorHandler(err);
      },
    }
  );

  const { isLoading: expectedIncomeLoading, data: expectedIncome } = useQuery(
    [queryKeys.GET_ALL_EXPECTED_INCOME],
    apiServices.getAllExpectedIncome,
    {
      enabled: ["Superadmin", "Account"].includes(user?.designation_name),
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      onError(err) {
        errorHandler(err);
      },
    }
  );

  const { isLoading: discountLoading, data: discount } = useQuery(
    [queryKeys.GET_ALL_DISCOUNT],
    apiServices.getAllDiscounts,
    {
      enabled: ["Superadmin", "Account"].includes(user?.designation_name),
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      onError(err) {
        errorHandler(err);
      },
    }
  );
  const { isLoading: totalExpenseLoading, data: totalExpense } = useQuery(
    [queryKeys.GET_ALL_TOTAL_EXPENSES],
    apiServices.getAllExpenses,
    {
      enabled: ["Superadmin", "Account"].includes(user?.designation_name),
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      onError(err) {
        errorHandler(err);
      },
    }
  );
  const { isLoading: accountBalanceLoading, data: accountBalance } = useQuery(
    [queryKeys.GET_ALL_ACCOUNT_BALANCE],
    apiServices.getAllAccountBalances,
    {
      enabled: ["Superadmin", "Account"].includes(user?.designation_name),
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      onError(err) {
        errorHandler(err);
      },
    }
  );

  const { isLoading: receivedIncomeLoading, data: receivedIncome } = useQuery(
    [queryKeys.GET_ALL_RECEIVED_INCOME],
    apiServices.getAllReceivedIncome,
    {
      enabled: ["Superadmin", "Account"].includes(user?.designation_name),
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      onError(err) {
        errorHandler(err);
      },
    }
  );

  const { isLoading: graduatedStudentLoading, data: graduatedStudent } =
    useQuery(
      [queryKeys.GET_ALL_GRADUATED_STUDENT],
      apiServices.getAllGraduatedStudent,
      {
        enabled: ["Superadmin", "Account"].includes(user?.designation_name),
        retry: 1,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        onError(err) {
          errorHandler(err);
        },
      }
    );

  const { isLoading: schoolLoading } = useQuery(
    [queryKeys.GET_SCHOOL],
    apiServices.getSchool,
    {
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
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

  const { isLoading: academicSessionLoading } = useQuery(
    [queryKeys.GET_ACADEMIC_SESSIONS],
    apiServices.getAcademicSessions,
    {
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: initiateSession,
      select: (data) => {
        // console.log({ datam: data });
        return data?.data;
      },
      onSuccess(data) {
        setUserDetails({ ...userDetails, sessions: data });
        setInitiateSession(false);
      },
      onError: apiServices.errorHandler,
    }
  );

  const { isLoading: academicPeriodLoading } = useQuery(
    [queryKeys.GET_ACADEMIC_PERIOD],
    getAcademicPeriod,
    {
      enabled: initiatePeriod,
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      select: (data) => {
        // console.log({ acDt: data, acDt2: data?.data });

        // return data?.data;
        return data?.data[0];
      },
      onSuccess(data) {
        console.log({ acDt3: data });
        updateUser({
          ...user,
          term: data?.term,
          session: data?.session,
          period: data?.period,
        });
        setUserDetails({
          ...userDetails,
          term: data?.term,
          session: data?.session,
          period: data?.period,
        });
        if (data?.term) {
          setInitiatePeriod(false);
        }
      },
      onError(err) {
        errorHandler(err);
      },
    }
  );

  const { isLoading: classPopulationLoading } = useQuery(
    [queryKeys.GET_CLASS_POPULATION],
    apiServices.getClassPopulation,
    {
      enabled: initiateClassP && ["Teacher"].includes(user?.designation_name),
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      onSuccess(data) {
        updateUser({
          ...user,
          class_population: data,
        });
        setUserDetails({
          ...userDetails,
          class_population: data,
        });
        setInitiateClassP(false);
      },
      onError(err) {
        errorHandler(err);
      },
      select: (data) => data?.data,
    }
  );

  const { isLoading: schoolPopulationLoading, data: schoolPopulation } =
    useQuery(
      [queryKeys.GET_SCHOOL_POPULATION],
      apiServices.getSchoolPopulation,
      {
        enabled:
          initiateSchoolP &&
          ["Principal", "Account"].includes(user?.designation_name),
        retry: 1,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        onSuccess(data) {
          updateUser({
            ...user,
            school_population: data,
          });

          setUserDetails({
            ...userDetails,
            school_population: data,
          });
          setInitiateSchoolP(false);
        },
        onError(err) {
          errorHandler(err);
        },
        select: (data) => data?.data,
      }
    );

  const { isLoading: staffPopulationLoading, data: staffPopulation } = useQuery(
    [queryKeys.GET_STAFF_POPULATION],
    apiServices.getStaffPopulation,
    {
      enabled: ["Principal", "Account"].includes(user?.designation_name),
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enalbled: initiateStaffP,
      onSuccess(data) {
        updateUser({
          ...user,
          staff_population: data,
        });
        setUserDetails({
          ...userDetails,
          staff_population: data,
        });
        setInitiateStaffP(false);
      },
      onError(err) {
        errorHandler(err);
      },
      select: (data) => data?.data,
    }
  );

  const { isLoading: studentPopulationLoading, data: studentPopulation } =
    useQuery(
      [queryKeys.GET_STUDENT_POPULATION],
      apiServices.getStudentPopulation,
      {
        enabled:
          initiateStudentP &&
          ["Principal", "Account"].includes(user?.designation_name),
        retry: 1,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        onSuccess(data) {
          updateUser({
            ...user,
            student_population: data,
          });
          setUserDetails({
            ...userDetails,
            student_population: data,
          });
          setInitiateStudentP(false);
        },
        onError(err) {
          errorHandler(err);
        },
        select: (data) => data?.data,
      }
    );

  const { isLoading: teacherPopulationLoading, data: teacherPopulation } =
    useQuery(
      [queryKeys.GET_TEACHER_POPULATION],
      apiServices.getTeacherPopulation,
      {
        enabled:
          initiateTeacherP &&
          ["Principal", "Account"].includes(user?.designation_name),
        retry: 1,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        onSuccess(data) {
          updateUser({
            ...user,
            teacher_population: data,
          });
          setUserDetails({
            ...userDetails,
            teacher_population: data,
          });
          setInitiateTeacherP(false);
        },
        onError(err) {
          errorHandler(err);
        },
        select: (data) => data?.data,
      }
    );

  const { isLoading: timetableLoading, data: timetableData } = useQuery(
    [queryKeys.GET_TIME_TABLE],
    apiServices.getTimeTable,
    {
      enabled: ["Teacher", "Student"].includes(user?.designation_name),
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      onError(err) {
        errorHandler(err);
      },
      select: (data) => {
        // console.log({ dataCC: data });

        return apiServices.formatData(data)?.length
          ? apiServices.formatData(data)[
              apiServices.formatData(data)?.length - 1
            ]
          : {};
      },
    }
  );

  const { isLoading: calendarLoading, data: calendarData } = useQuery(
    [queryKeys.GET_ACADEMIC_CALENDER],
    apiServices.getAcademicCalender,
    {
      enabled: ["Teacher", "Student"].includes(user?.designation_name),
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      onError(err) {
        errorHandler(err);
      },
      select: (data) => {
        // console.log({ dataCC: data });

        return apiServices.formatData(data)?.length
          ? apiServices.formatData(data)[
              apiServices.formatData(data)?.length - 1
            ]
          : {};
      },
    }
  );

  const {
    isLoading: classListLoading,
    data: classDt,
    refetch: refetchClasses,
  } = useQuery([queryKeys.GET_ALL_CLASSES], apiServices.getAllClasses, {
    retry: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: activateClasses && !is_preschool,
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

  const { data: preSchools, isLoading: preSchoolsLoading } = useQuery(
    [queryKeys.GET_ALL_PRE_SCHOOLS],
    apiServices.getPreSchools,
    {
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: activatePreschools && is_preschool,
      select: apiServices.formatData,
      onSuccess(data) {
        // setClasses(data);
        console.log({ preschoolData: data });

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

  const {
    isLoading: currentAcademicPeriodLoading,
    refetch: refetchCurrentAcademicPeriod,
  } = useQuery(
    [queryKeys.GET_CURRENT_ACADEMIC_PERIOD],
    getCurrentAcademicPeriod,
    {
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
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
        errorHandler(err);
      },
    }
  );

  const isLoading =
    outstandingLoading ||
    expectedIncomeLoading ||
    discountLoading ||
    totalExpenseLoading ||
    accountBalanceLoading ||
    receivedIncomeLoading ||
    graduatedStudentLoading ||
    currentAcademicPeriodLoading ||
    // academicPeriodLoading ||
    academicSessionLoading ||
    schoolLoading ||
    classPopulationLoading ||
    timetableLoading ||
    calendarLoading ||
    schoolPopulationLoading ||
    staffPopulationLoading ||
    studentPopulationLoading ||
    classListLoading ||
    preSchoolsLoading ||
    campusListLoading ||
    teacherPopulationLoading;

  // console.log({ permission, userDetails });

  return {
    user,
    academicPeriod: userDetails?.academicPeriod,
    isLoading,
    outstanding,
    expectedIncome,
    graduatedStudent,
    discount,
    totalExpense,
    accountBalance,
    receivedIncome,
    timetableData,
    calendarData,
    staffPopulation,
    studentPopulation,
    teacherPopulation,
    schoolPopulation,
  };
};
