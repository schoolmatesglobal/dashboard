import { useQuery } from "react-query";
import queryKeys from "../utils/queryKeys";
import { useAppContext } from "./useAppContext";
import { useAuthDetails } from "../stores/authDetails";
import { useState } from "react";

export const useHome = () => {
  const { apiServices, errorHandler, user, updateUser } = useAppContext();

  const [initiateSchool, setInitiateSchool] = useState(true);
  const [initiatePeriod, setInitiatePeriod] = useState(true);
  const [initiateClassP, setInitiateClassP] = useState(true);
  const [initiateSchoolP, setInitiateSchoolP] = useState(true);
  const [initiateStaffP, setInitiateStaffP] = useState(true);
  const [initiateStudentP, setInitiateStudentP] = useState(true);
  const [initiateTeacherP, setInitiateTeacherP] = useState(true);

  const { userDetails, setUserDetails } = useAuthDetails();

  const { isLoading: outstandingLoading, data: outstanding } = useQuery(
    [queryKeys.GET_ALL_OUTSTANDING],
    apiServices.getAllOutstanding,
    {
      enabled: ["Superadmin", "Account"].includes(user?.designation_name),
      retry: 1,
      refetchOnMount: false,
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
      refetchOnMount: false,
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
      refetchOnMount: false,
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
      refetchOnMount: false,
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
      refetchOnMount: false,
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
      refetchOnMount: false,
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
        refetchOnMount: false,
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
      refetchOnMount: false,
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

  const { isLoading: academicPeriodLoading, data: academicPeriod } = useQuery(
    [queryKeys.GET_ACADEMIC_PERIOD],
    apiServices.getAcademicPeriod,
    {
      enabled:
        initiatePeriod &&
        ["Teacher", "Student"].includes(user?.designation_name),
      retry: 1,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      select: (data) => {
        // console.log({ ddata: data, sd: data?.data });

        // return data?.data;
        return data?.data[0];
      },
      onSuccess(data) {
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
        setInitiatePeriod(false);
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
      refetchOnMount: false,
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
        refetchOnMount: false,
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
      refetchOnMount: false,
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
        refetchOnMount: false,
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
        refetchOnMount: false,
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
      refetchOnMount: false,
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
      refetchOnMount: false,
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

  const isLoading =
    outstandingLoading ||
    expectedIncomeLoading ||
    discountLoading ||
    totalExpenseLoading ||
    accountBalanceLoading ||
    receivedIncomeLoading ||
    graduatedStudentLoading ||
    academicPeriodLoading ||
    schoolLoading ||
    classPopulationLoading ||
    timetableLoading ||
    calendarLoading ||
    schoolPopulationLoading ||
    staffPopulationLoading ||
    studentPopulationLoading ||
    teacherPopulationLoading;

  console.log({ userDetails });

  return {
    user,
    academicPeriod,
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
