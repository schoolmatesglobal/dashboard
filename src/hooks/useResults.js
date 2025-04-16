import { useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import queryKeys from "../utils/queryKeys";
import { useAppContext } from "./useAppContext";
import { mergeAndOverrideArrays } from "../pages/dashboard/results/constant";
import { useForm } from "react-formid";
import { useAuthDetails } from "../stores/authDetails";
import {
  queryOptions,
  toSentenceCase,
  uniqueArray,
  userRole,
} from "../utils/constants";

export const useResults = () => {
  const { apiServices, errorHandler, permission, user } =
    useAppContext("results");

  const authority = userRole(user?.designation_id);

  const mergedClass = user?.class_assigned ? user?.class_assigned : user.class;
  const isAdminPrincipal =
    (authority === "admin" ||
      authority === "principal" ||
      authority === "superadmin") ??
    false;
  const isStudent = authority === "student" ?? false;

  const { userDetails, setUserDetails } = useAuthDetails();

  const [openPrompt, setOpenPrompt] = useState(false);
  const [selectedComment, setSelectedComment] = useState("");
  const [studentRes, setStudentRes] = useState([]);

  const [hosComment, setHosComment] = useState("");
  const [comment, setComment] = useState("teacher");
  const [studentData, setStudentData] = useState({});
  const [idWithComputedResult, setIdWithComputedResult] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [initGetStudentsByClass, setInitGetStudentsByClass] = useState(true);
  const [initGetStudentData, setInitGetStudentData] = useState(true);
  const [initGetSubjects, setInitGetSubjects] = useState(true);
  // const [initGetFirstAssess, setInitGetFirstAssess] = useState(true);
  const [initGetExistingResult, setInitGetExistingResult] = useState(false);
  const [initGetExistingSecondHalfResult, setInitGetExistingSecondHalfResult] =
    useState(false);
  const [enableStudentToggle, setEnableStudentToggle] = useState(true);
  const [addMidResultAsLast, setAddMidResultAsLast] = useState(false);
  const [studentMidResult, setStudentMidResult] = useState([]);
  const [studentTwoAssess, setStudentTwoAssess] = useState([]);
  const [studentFirstAssess, setStudentFirstAssess] = useState([]);
  const [studentSecondAssess, setStudentSecondAssess] = useState([]);
  const [studentMidterm, setStudentMidterm] = useState([]);
  const [additionalCreds, setAdditionalCreds] = useState({});
  // const [additionalCreds2, setAdditionalCreds2] = useState({});
  const [teacherComment, setTeacherComment] = useState("");
  const [performanceRemark, setPerformanceRemark] = useState("good");
  const [abacus, setAbacus] = useState("");
  const [filteredSubjects, setFilteredSubjects] = useState("");
  const [extraActivities, setExtraActivities] = useState([]);
  const [preActivities2, setPreActivities2] = useState([]);
  const [activateEndOfTerm, setActivateEndOfTerm] = useState(true);

  const [computedSubjects, setComputedSubjects] = useState([]);

  const [loading1, setLoading1] = useState(false);

  function trigger(time) {
    setLoading1(true);
    setTimeout(() => {
      setLoading1(false);
    }, time);
  }

  const is_preschool = !!user?.is_preschool && user.is_preschool !== "false";

  const { data: maxScores, isLoading: maxScoresLoading } = useQuery(
    [queryKeys.GET_MAX_SCORES],
    apiServices.getMaxScores,
    {
      // retry: 1,
      // refetchOnMount: true,
      // refetchOnWindowFocus: false,
      ...queryOptions,
      enabled: !is_preschool,
      // enabled: !is_preschool,
      onError(err) {
        errorHandler(err);
      },
      select: (data) => {
        const dt = data?.data;
        // const kt = formatData(data);
        console.log({ scoreData: data, dt });
        return dt;
      },
    }
  );

  const hasOneAssess =
    maxScores?.has_two_assessment === 0 ||
    maxScores?.has_two_assessment === false ||
    maxScores?.has_two_assessment === "false";

  const { state } = useLocation();
  const studentClassName = `${studentData?.present_class}`;
  // const studentClassName = `${studentData?.present_class} ${studentData?.sub_class}`;
  const pdfExportComponent = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => pdfExportComponent.current,
  });

  const studentId = () => {
    if (isStudent) {
      return user?.id;
    } else {
      return studentData?.id;
    }
  };

  const stdId = isStudent ? user?.id : studentData?.id;

  const className = isAdminPrincipal ? state?.creds?.class_name : mergedClass;
  // const className = state?.creds?.class_name
  //   ? state?.creds?.class_name
  //   : mergedClass;

  const { inputs, handleChange } = useForm({
    defaultValues: {
      assessment: "first_assesment",
      midterm: "midterm",
    },
  });

  const teacherSubjects =
    user?.designation_name === "Teacher"
      ? user?.subjects?.map((x) => ({
          subject: x.name,
          score: "0",
          grade: "0",
        }))
      : [];

  // console.log({ user });
  // console.log({ initGetStudentsByClass, subjects });

  const findId = () => {
    const cs = userDetails.class_assigned?.toUpperCase();

    const find = userDetails?.classes?.find(
      (sb) => sb.class_name?.toUpperCase() === cs
    );
    if (find?.id) {
      return find?.id;
    } else {
      return "";
    }
  };

  const { data: academicDate, isLoading: academicDateLoading } = useQuery(
    [queryKeys.GET_ACADEMIC_DATE],
    apiServices.getResumptionDate,
    {
      onError(err) {
        errorHandler(err);
      },
      // retry: 1,
      // refetchOnMount: true,
      // refetchOnWindowFocus: false,
      ...queryOptions,
      select: (data) => data?.data?.attributes,
    }
  );

  const { data: comments, isLoading: commentsLoading } = useQuery(
    [queryKeys.GET_PRINCIPAL_COMMENTS],
    apiServices.getPrincipalComments,
    {
      onError(err) {
        errorHandler(err);
      },
      // retry: 1,
      // refetchOnMount: true,
      // refetchOnWindowFocus: false,
      ...queryOptions,
      select: apiServices.formatData,
    }
  );

  const activate =
    user?.designation_name === "Admin" || "Teacher" ? true : false;

  const classValue = () => {
    if (user?.department !== "Admin") {
      return user?.class_assigned || "";
    } else if (user?.department === "Admin") {
      // return classSelected || "";
    }
  };

  const chk = state?.creds?.class_name
    ? state?.creds?.class_name
    : user?.class_assigned;

  // const chk = state?.creds?.class_name
  //   ? state?.creds?.class_name
  //   : user?.class_assigned;

  // STUDENT BY CLASS AND SESSION
  const { data: studentByClassAndSession, isLoading: studentByClassLoading } =
    useQuery(
      [
        queryKeys.GET_STUDENTS_BY_ATTENDANCE,
        className,
        // state?.creds?.session,
      ],
      () =>
        apiServices.getStudentByClass2(
          className
          //   ,
          // state?.creds?.session
        ),
      {
        enabled: initGetStudentData && !!className,
        select: (data) => {
          const dt2 = apiServices.formatData(data);

          // console.log({
          //   dataSS: data,
          //   user,
          //   dt2,
          // });

          if (dt2?.length > 0) {
            const sst2 = dt2?.find((x) => x?.id === user?.id) ?? {};

            const studentInfo =
              user?.designation_name === "Student"
                ? dt2?.find((x) => x?.id === user?.id)
                : dt2[0];

            // console.log({
            //   studentInfo,
            //   sst2,
            // });

            return studentInfo;
          }
        },
        onSuccess(data) {
          // setInitGetStudentsByClass(true)
          setInitGetStudentData(false);

          if (enableStudentToggle) {
            if (!data) return;
            setStudentData(data);
            setEnableStudentToggle(false);
            setActivateEndOfTerm(true);
            setInitGetExistingSecondHalfResult(true);
          }
          state?.creds?.period === "First Half"
            ? setInitGetExistingResult(true)
            : setInitGetExistingSecondHalfResult(true);
        },
        onError(err) {
          errorHandler(err);
        },
      }
    );

  const chks =
    is_preschool &&
    // permission?.subject &&
    state?.creds?.period !== "" &&
    state?.creds?.session !== "" &&
    state?.creds?.term !== "";

  const chk2 = chks ?? false;

  // preschool
  const {
    data: preSchoolSubjects,
    isLoading: preSchoolSubjectsLoading,
    refetch: refetchSubjects,
  } = useQuery(
    [
      queryKeys.GET_ALL_PRE_SCHOOL_SUBJECTS,
      state?.creds.period,
      state?.creds.session,
      state?.creds.term,
    ],
    () =>
      apiServices.getPreSchoolSubjects(
        state?.creds.period ?? "",
        state?.creds.term ?? "",
        state?.creds.session ?? ""
      ),
    {
      enabled: chk2,
      // retry: 1,
      // refetchOnMount: false,
      // refetchOnWindowFocus: false,
      ...queryOptions,
      select: apiServices.formatData,
      onError: apiServices.errorHandler,
    }
  );

  // student by class2
  const { data: studentByClass2, isLoading: studentByClass2Loading } = useQuery(
    [queryKeys.GET_ALL_STUDENTS_BY_CLASS3, user?.class_assigned],
    () => apiServices.getStudentByClass2(className),

    {
      // retry: 1,
      // refetchOnMount: true,
      // refetchOnWindowFocus: false,
      ...queryOptions,
      enabled: permission?.view && !!className,
      // enabled: permission?.myStudents || user?.designation_name === "Principal",
      // select: apiServices.formatData,
      select: (data) => {
        // console.log({ pkdata: data, state });
        return apiServices.formatData(data)?.map((obj, index) => {
          const newObj = { ...obj };
          newObj.new_id = index + 1;
          return newObj;
        });

        // return { ...data, options: f };
      },
      onError(err) {
        errorHandler(err);
      },
    }
  );

  // end of term result
  const {
    isLoading: endOfTermResultsLoading,
    refetch: endOfTermResultsRefetch,
  } = useQuery(
    [
      queryKeys.GET_STUDENT_END_OF_TERM_RESULTS,
      stdId,
      state?.creds?.term,
      state?.creds?.session,
    ],
    () =>
      isStudent
        ? apiServices.getEndOfTermResults(
            stdId,
            state?.creds?.term,
            state?.creds?.session
          )
        : apiServices.getStaffEndOfTermResults(
            stdId,
            state?.creds?.term,
            state?.creds?.session
          ),
    {
      // enabled: false,
      // retry: 1,
      // refetchOnWindowFocus: false,
      // refetchOnMount: true,
      // refetchOnReconnect: false,
      ...queryOptions,
      enabled: false,
      // enabled:
      //   activateEndOfTerm &&
      //   initGetExistingSecondHalfResult &&
      //   !is_preschool &&
      //   state?.creds?.period === "Second Half",
      select(data) {
        const tt = apiServices.formatData(data);
        // console.log({
        //   hasOneAssess,
        //   data,
        //   tt,
        //   state,
        //   user,
        //   is_preschool,
        //   userDetails,
        // });
        return tt;
      },

      // staleTime: 60000 * 30,

      onSuccess(data) {
        setInitGetSubjects(false);
        setInitGetExistingSecondHalfResult(false);

        if (data?.length > 0) {
          const ids = data?.map((x) => x.student_id);
          setIdWithComputedResult(ids);
          const res = data?.find(
            (x) =>
              x.student_id === stdId &&
              x.term === state?.creds?.term &&
              state?.creds?.session === x.session &&
              state?.creds?.period === x.period
          );

          const studentResult = res?.results?.map((x) => ({
            ...x,
            grade: x.score,
          }));

          const mergeSubjectAndResult2 = () => {
            if (
              !filteredSubjects ||
              !studentResult ||
              filteredSubjects.length === 0 ||
              studentResult.length === 0
            ) {
              return filteredSubjects;
            }

            return filteredSubjects.map((subject) => {
              const result = studentResult.find(
                (r) => r.subject === subject.subject
              );

              if (result) {
                return {
                  subject: result.subject,
                  score: result.score,
                  grade: result.grade,
                };
              } else {
                return {
                  subject: subject.subject,
                  score: subject.score,
                  grade: subject.grade,
                };
              }
            });
          };

          // console.log({ data, studentResult, res });

          setAdditionalCreds({
            ...additionalCreds,
            ...res,
            school_opened: res?.school_opened ?? "0",
            times_present: res?.times_present ?? "0",
            times_absent: res?.times_absent ?? "0",
          });

          setSubjects(mergeSubjectAndResult2() ?? []);

          setTeacherComment(res?.teacher_comment);
          setHosComment(res?.hos_comment);
          setPerformanceRemark(res?.performance_remark);
          setExtraActivities(res?.extra_curricular_activities ?? []);
          setAbacus(res?.abacus?.name ?? "");

          // if (res) {
          //   // const subjectsWithGrade = studentResult?.results?.map((x) => ({
          //   //   ...x,
          //   //   grade: x.score,
          //   // }));

          //   setInitGetExistingResult(true);
          // } else {
          //   setInitGetExistingResult(true);
          //   setAddMidResultAsLast(true);
          // }
        } else {
          setAdditionalCreds({});
          setInitGetSubjects(true);
          refetchSubjectsByClass2();
          setPerformanceRemark("");
          setExtraActivities([]);

          setTeacherComment("");
          setHosComment("");
          setAbacus("");

          // setInitGetExistingResult(true);
          setAddMidResultAsLast(true);
        }
      },
    }
  );

  ///////getEndOfTermResult ///////////////
  const getEndOfTermResult = useQuery(
    [
      "GET_END_OF_TERM_RESULT",
      stdId,
      state?.creds?.term,
      state?.creds?.session,
    ],
    () =>
      isStudent
        ? apiServices.getEndOfTermResults(
            stdId,
            state?.creds?.term,
            state?.creds?.session
          )
        : apiServices.getStaffEndOfTermResults(
            stdId,
            state?.creds?.term,
            state?.creds?.session
          ),
    {
      ...queryOptions,
      enabled:
        stdId &&
        activateEndOfTerm &&
        initGetExistingSecondHalfResult &&
        state?.creds?.term &&
        state?.creds?.session &&
        state?.creds?.period === "Second Half",
      select(data) {
        if (data.data.length > 0) {
          const uniqueRes = uniqueArray(
            data?.data[0]?.attributes?.results,
            "subject"
          );
          const get =
            uniqueRes?.map((dt, i) => {
              return {
                id: i + 1,
                subject: toSentenceCase(dt.subject),
                score: dt.score,
                grade: dt.score,
              };
            }) ?? [];
          const newPP = data.data[0].attributes?.psychomotor_performance?.map(
            (ps) => {
              return {
                ...ps,
                score: {
                  value: ps.score,
                  label: ps.score,
                },
              };
            }
          );
          const newPR = data.data[0].attributes?.pupil_report?.map((ps) => {
            return {
              ...ps,
              score: {
                value: ps.score,
                label: ps.score,
              },
            };
          });
          console.log({ getD: data, get, newPP, newPR });
          return {
            ...data.data[0].attributes,
            psychomotor_performance: newPP,
            pupil_report: newPR,
            results2: get,
          };
        } else {
          return {
            results2: [],
            teacher_comment: "",
            hos_comment: "",
            status: "",
            school_opened: "0",
            times_present: "0",
            abacus: {
              name: null,
            },
            extra_curricular_activities: [],
          };
        }
      },
      onSuccess(data) {
        setAdditionalCreds({
          ...additionalCreds,
          ...data,
          school_opened: data?.school_opened ?? "0",
          times_present: data?.times_present ?? "0",
          times_absent: data?.times_absent ?? "0",
        });
      },
    }
  );

  /////////////// getSubjectByClass  /////////////
  const getSubjectByClass = useQuery(
    ["GET_SUBJECTS_BY_CLASS_COMPUTE", className],
    () => apiServices.getSubjectByCampus(),
    // () => apiServices.getSubjectByClass(className),
    {
      ...queryOptions,
      enabled: Boolean(className),
      select: (data) => {
        const uniqueSub = uniqueArray(
          data?.data[0]?.attributes?.subject,
          "name"
        );
        const fm =
          uniqueSub?.map((dt, i) => {
            return {
              // ...dt,
              id: i + 1,
              subject: toSentenceCase(dt.name),
              score: "0",
              grade: "0",
            };
          }) ?? [];

        console.log({ mdata: data, fm });

        return fm;
      },
      onSuccess(data) {},
    }
  );

  const { isLoading: subjectsByClassLoading3, data: subjectsByClass3 } =
    useQuery(
      [queryKeys.GET_SUBJECTS_BY_CLASS2, findId()],
      () => apiServices.getSubjectByClass2(findId()),
      {
        enabled: !!findId(),
        // retry: 1,
        // refetchOnMount: true,
        // refetchOnWindowFocus: false,
        ...queryOptions,
        select: (data) => {
          const newData = apiServices.formatData(data);
          return newData;
          // console.log({ data, newData });
        },
        onError: apiServices.errorHandler,
      }
    );

  // subject by class
  const {
    data: subjectsByClass,
    isLoading: subjectsByClassLoading,
    // refetch: refetchSubjectsByClass,
  } = useQuery(
    [queryKeys.GET_SUBJECTS_BY_CLASS, className],
    () => apiServices.getSubjectByCampus(),
    {
      // retry: 1,
      // refetchOnMount: true,
      // refetchOnWindowFocus: false,
      ...queryOptions,
      enabled: false,
      // enabled: initGetStudentsByClass && !is_preschool,
      select: apiServices.formatData,
      onSuccess(data) {
        // console.log({ data });
        const subjectsWithGrade = data?.map((x) => ({ ...x, grade: "0" }));
      },
    }
  );

  const cn = state?.creds?.class_name
    ? state?.creds?.class_name
    : user?.class_assigned;

  const {
    data: preSchoolSubjectsByClass,
    isLoading: preSchoolSubjectsByClassLoading,
  } = useQuery(
    [queryKeys.GET_PRE_SCHOOL_SUBJECTS_BY_CLASS, className],
    () =>
      apiServices.getPreSchoolSubjectsByClass(
        state?.creds?.period,
        state?.creds?.term,
        state?.creds?.session,
        className
      ),
    {
      // retry: 1,
      // refetchOnMount: true,
      // refetchOnWindowFocus: false,
      ...queryOptions,
      enabled:
        is_preschool &&
        !!state?.creds?.period &&
        !!state?.creds?.term &&
        !!state?.creds?.session &&
        !!className,
      // select: apiServices.formatData,
      select: (data) => {
        const dt = apiServices.formatData(data);

        // console.log({ sdata: data, sd: dt });

        return dt;
      },
    }
  );

  const {
    isLoading: preSchoolCompiledResultsLoading,
    data: preSchoolCompiledResults,
    refetch: preSchoolCompiledResultsRefetch,
  } = useQuery(
    [
      queryKeys.GET_PRE_SCHOOL_COMPILED_RESULTS,
      state?.creds?.period,
      state?.creds?.term,
      state?.creds?.session,
    ],
    () =>
      apiServices.getPreSchoolCompiledResults(
        state?.creds?.period,
        state?.creds?.term,
        state?.creds?.session
      ),
    {
      // retry: 1,
      // refetchOnMount: true,
      // refetchOnWindowFocus: false,
      ...queryOptions,
      enabled: is_preschool,
      // select: apiServices.formatData,
      select: (data) => {
        const dt = apiServices.formatData(data);

        console.log({ cpdata: data, rd: dt });

        return dt;
      },
      onSuccess(data) {
        const ids = data?.map((x) => x.student_id) ?? [];
        setIdWithComputedResult(ids);
      },
    }
  );

  const { isLoading: getCummulativeScoresLoading, data: cummulativeScores } =
    useQuery(
      [
        queryKeys.GET_RESULT_CUMMULATIVE_SCORES,
        stdId,
        state?.creds?.period,
        state?.creds?.term,
        state?.creds?.session,
      ],
      () =>
        apiServices.getCummulativeScores({
          student_id: stdId,
          period: state?.creds?.period,
          term: state?.creds?.term,
          session: state?.creds?.session,
        }),
      {
        // retry: 1,
        // refetchOnMount: true,
        // refetchOnWindowFocus: false,
        ...queryOptions,
        enabled: !is_preschool && state?.creds?.period === "Second Half",
        select: (data) => {
          const kt = data?.data;
          const uniqueRes = uniqueArray(kt, "subject")?.map((dt, i) => {
            return {
              ...dt,
              subject: toSentenceCase(dt.subject),
            };
          });
          console.log({ kt, cData: data, uniqueRes });
          return uniqueRes ?? [];
        },
      }
    );

  const { isLoading: loadingClassAverage, data: classAverage } = useQuery(
    [
      queryKeys.GET_YEARLY_CLASS_AVERAGE,
      studentClassName,
      stdId,
      state?.creds?.term,
      state?.creds?.session,
    ],
    () =>
      apiServices.getClassAverage({
        class_name: studentClassName,
        student_id: stdId,
        term: state?.creds?.term,
        session: state?.creds?.session,
      }),
    {
      // retry: 1,
      // refetchOnMount: true,
      // refetchOnWindowFocus: false,
      ...queryOptions,
      enabled: !is_preschool && state?.creds?.period === "Second Half",
    }
  );

  const { isLoading: loadingYearlyClassAverage, data: yearlyClassAverage } =
    useQuery(
      [queryKeys.GET_CLASS_AVERAGE, studentClassName, state?.creds?.session],
      () =>
        apiServices.getYearlyClassAverage({
          student_id: stdId,
          class_name: additionalCreds?.class_name,
          // class_name: studentClassName,
          session: state?.creds?.session,
        }),
      {
        // retry: 1,
        // refetchOnMount: true,
        // refetchOnWindowFocus: false,
        ...queryOptions,
        enabled:
          !is_preschool &&
          Boolean(additionalCreds?.class_name) &&
          state?.creds?.term === "Third Term" &&
          state?.creds?.period === "Second Half",
        select(data) {
          const st = apiServices.formatData(data);

          // console.log({ st, data });
          return data;
        },
      }
    );

  const {
    data: subjectsByClass2,
    isLoading: subjectsByClass2Loading,
    refetch: refetchSubjectsByClass2,
  } = useQuery(
    [queryKeys.GET_SUBJECTS_BY_CLASS, className, "2"],
    () => apiServices.getSubjectByCampus(),
    {
      // enabled: initGetExistingResult && !is_preschool,
      // retry: 1,
      // refetchOnMount: true,
      // refetchOnWindowFocus: false,
      ...queryOptions,
      enabled: initGetSubjects && !is_preschool,
      select(data) {
        const st = apiServices.formatData(data);

        const subj = st[0]?.subject?.map((x) => ({
          subject: x.name,
          score: "0",
          grade: "0",
        }));

        const fss =
          // user?.designation_name === "Teacher" &&
          teacherSubjects?.length > 0
            ? subj?.filter((sg) => {
                let sub = {};

                teacherSubjects?.forEach((ss) => {
                  if (ss?.subject === sg?.subject) {
                    sub = ss;
                  }
                });
                return sg.subject === sub?.subject;
              })
            : [];

        const filteredSubj = user?.designation_name === "Teacher" ? fss : subj;
        // const filteredSubj =
        //   user?.teacher_type === "class teacher"
        //     ? subj
        //     : user?.designation_id === "1"
        //     ? subj
        //     : fss;

        // console.log({
        //   kdata2: data,
        //   user,
        //   st,
        //   teacherSubjects,
        //   fss,
        //   filteredSubj,
        // });
        return st;
      },
      onSuccess(data) {
        // console.log({ kdata: data });
        setInitGetSubjects(false);
        if (data?.length > 0) {
          const subj = data[0]?.subject?.map((x) => ({
            subject: x.name,
            score: "0",
            grade: "0",
          }));

          const fss =
            // user?.designation_name === "Teacher" &&
            teacherSubjects?.length > 0
              ? subj?.filter((sg) => {
                  let sub = {};

                  teacherSubjects?.forEach((ss) => {
                    if (ss?.subject === sg?.subject) {
                      sub = ss;
                    }
                  });
                  return sg.subject === sub?.subject;
                })
              : [];

          const filteredSubj =
            user?.teacher_type === "class teacher"
              ? subj
              : user?.designation_id === "1"
              ? subj
              : fss;

          // console.log({ allsub: data, filteredSubj });

          setFilteredSubjects(filteredSubj ?? []);

          setSubjects(filteredSubj ?? []);

          // console.log({ dataSS: data, subj, fss });
        } else {
          setSubjects([]);
        }

        // setSubjectsWithScoreAndGrade(sg);

        // console.log({ data, sg });
        // console.log({ subjectsWithScoreAndGrade });

        // return subjectsWithScoreAndGrade;
        // if (subjects.length === 0) setSubjects(subjectsWithGrade);
        // setInitGetStudentsByClass(false);
      },
    }
  );

  // first assess result
  const {
    data: firstAssessResult,
    isLoading: firstAssessResultLoading,
    refetch: refetchFirstAssess,
  } = useQuery(
    [
      queryKeys.GET_FIRST_ASSESSMENT,
      stdId,
      state?.creds?.term,
      state?.creds?.session,
      // inputs.assessment,
    ],
    () =>
      apiServices.getFirstAssessment(
        stdId,
        state?.creds?.term,
        state?.creds?.session
      ),
    {
      // enabled: false,
      // retry: 1,
      // refetchOnMount: true,
      // refetchOnWindowFocus: false,
      ...queryOptions,
      enabled:
        // initGetExistingResult &&
        !is_preschool &&
        stdId &&
        !hasOneAssess &&
        inputs.assessment === "first_assesment" &&
        state?.creds?.period === "First Half",
      // &&
      // state?.creds?.period === "First Half",
      select: (data) => {
        const fmm = apiServices.formatData(data);
        console.log({ fdata: data, fmm });
        return fmm;
      },
      onSuccess(data) {
        // setInitGetFirstAssess(false)
        setInitGetSubjects(false);
        setInitGetExistingResult(false);

        // console.log({ fres: data });
        if (data.length > 0) {
          const ids = data?.map((x) => x.student_id);

          setIdWithComputedResult(ids);

          const res = data?.find(
            (x) =>
              x.student_id === stdId &&
              x.term === state?.creds?.term &&
              state?.creds?.session === x.session &&
              x.period === "First Half"
          );

          const studentResult = res?.results?.map((x) => ({
            subject: x.subject,
            score: x.score,
            grade: x.score,
          }));

          setStudentTwoAssess(studentResult);

          const mergeSubjectAndResult2 = () => {
            if (
              !filteredSubjects ||
              !studentResult ||
              filteredSubjects.length === 0 ||
              studentResult.length === 0
            ) {
              return filteredSubjects;
            }

            return filteredSubjects.map((subject) => {
              const result = studentResult.find(
                (r) => r.subject === subject.subject
              );

              if (result) {
                return {
                  subject: result.subject,
                  score: result.score,
                  grade: result.grade,
                };
              } else {
                return {
                  subject: subject.subject,
                  score: subject.score,
                  grade: subject.grade,
                };
              }
            });
          };

          setAdditionalCreds({
            ...additionalCreds,
            ...res,
          });

          setSubjects(mergeSubjectAndResult2() ?? []);
        } else {
          setStudentTwoAssess([]);
          setInitGetSubjects(true);
          refetchSubjectsByClass2();
          // setSubjects([]);
          // setStudentMidResult([]);
          setAdditionalCreds({});
          setTeacherComment("");
          // setHosComment("");
          // setInitGetStudentsByClass(true);
          // refetchStudentsByClass2();
        }
        // setAddMidResultAsLast(false);
      },
    }
  );

  // first assessment for end of term
  const {
    data: firstAssessResult2,
    isLoading: firstAssessResultLoading2,
    refetch: refetchFirstAssess2,
  } = useQuery(
    [
      queryKeys.GET_FIRST_ASSESSMENT,
      stdId,
      state?.creds?.term,
      state?.creds?.session,
      "2",
    ],
    () =>
      apiServices.getFirstAssessment(
        stdId,
        state?.creds?.term,
        state?.creds?.session
      ),
    {
      // enabled: false,
      // retry: 1,
      // refetchOnMount: true,
      // refetchOnWindowFocus: false,
      ...queryOptions,
      enabled:
        // initGetExistingResult &&
        !is_preschool &&
        stdId &&
        !hasOneAssess &&
        state?.creds?.period === "Second Half",
      select: (data) => {
        const fmm = apiServices.formatData(data);
        console.log({ fdata: data, fmm });
        return fmm;
      },
      onSuccess(data) {
        // setInitGetFirstAssess(false)
        // setInitGetSubjects(false);
        // setInitGetExistingResult(false);

        if (data.length > 0) {
          const ids = data?.map((x) => x.student_id);

          setIdWithComputedResult(ids);

          const res = data?.find(
            (x) =>
              x.student_id === stdId &&
              x.term === state?.creds?.term &&
              state?.creds?.session === x.session &&
              x.period === "First Half"
          );

          const studentResult = res?.results?.map((x) => ({
            subject: x.subject,
            score: x.score,
            grade: x.score,
          }));

          // console.log({ dataF: data, ids, studentResult });

          // setStudentMidResult(studentResult);
          setStudentFirstAssess(studentResult);
        }
      },
    }
  );

  // second assessment
  const {
    data: secondAssessResult,
    isLoading: secondAssessResultLoading,
    refetch: refetchSecondAssess,
  } = useQuery(
    [
      queryKeys.GET_SECOND_ASSESSMENT,
      stdId,
      state?.creds?.term,
      state?.creds?.session,
    ],
    () =>
      apiServices.getSecondAssessment(
        stdId,
        state?.creds?.term,
        state?.creds?.session
      ),
    {
      // retry: 1,
      // refetchOnMount: false,
      // refetchOnWindowFocus: false,
      ...queryOptions,
      enabled:
        // initGetExistingResult &&
        !is_preschool &&
        stdId &&
        !hasOneAssess &&
        inputs.assessment === "second_assesment" &&
        state?.creds?.period === "First Half",
      select: (data) => {
        const fmm = apiServices.formatData(data);
        console.log({ fdata: data, fmm });
        return fmm;
      },
      onSuccess(data) {
    
        if (data.length > 0) {
          const ids = data?.map((x) => x.student_id);

          setIdWithComputedResult(ids);

          const res = data?.find(
            (x) =>
              x.student_id === stdId &&
              x.term === state?.creds?.term &&
              state?.creds?.session === x.session &&
              x.period === "First Half"
          );

          const studentResult = res?.results?.map((x) => ({
            subject: x.subject,
            score: x.score,
            grade: x.score,
          }));


          setStudentTwoAssess(studentResult);

          const mergeSubjectAndResult2 = () => {
            if (
              !filteredSubjects ||
              !studentResult ||
              filteredSubjects.length === 0 ||
              studentResult.length === 0
            ) {
              return filteredSubjects;
            }

            return filteredSubjects.map((subject) => {
              const result = studentResult.find(
                (r) => r.subject === subject.subject
              );

              if (result) {
                return {
                  subject: result.subject,
                  score: result.score,
                  grade: result.grade,
                };
              } else {
                return {
                  subject: subject.subject,
                  score: subject.score,
                  grade: subject.grade,
                };
              }
            });
          };


          if (state?.creds?.period === "First Half") {
            setAdditionalCreds({
              ...additionalCreds,
              ...res,
            });
          }

          setSubjects(mergeSubjectAndResult2() ?? []);
        } else {
          setStudentTwoAssess([]);
          setInitGetSubjects(true);
          // setSubjects([]);
          // setStudentMidResult([]);
          setAdditionalCreds({});
          setTeacherComment("");
          // setHosComment("");
          // setInitGetStudentsByClass(true);
          // refetchStudentsByClass();
          refetchSubjectsByClass2();
        }
        // setAddMidResultAsLast(false);
      },
    }
  );

  // second assessment for end of term
  const {
    data: secondAssessResult2,
    isLoading: secondAssessResultLoading2,
    refetch: refetchSecondAssess2,
  } = useQuery(
    [
      queryKeys.GET_SECOND_ASSESSMENT,
      stdId,
      state?.creds?.term,
      state?.creds?.session,
      "2",
    ],
    () =>
      apiServices.getSecondAssessment(
        stdId,
        state?.creds?.term,
        state?.creds?.session
      ),
    {
      // retry: 1,
      // refetchOnMount: true,
      // refetchOnWindowFocus: false,
      ...queryOptions,
      enabled:
        // initGetExistingResult &&
        !is_preschool &&
        stdId &&
        !hasOneAssess &&
        state?.creds?.period === "Second Half",
      select: (data) => {
        const fmm2 = apiServices.formatData(data);
        console.log({ fdata2: data, fmm2 });
        return fmm2;
      },
      onSuccess(data) {
        // setInitGetSubjects(false);
        // setInitGetExistingResult(false);

        // console.log({ dataS: data });

        // if (data.length > 0) {
        //   const ids = data?.map((x) => x.student_id);

        //   setIdWithComputedResult(ids);

        //   const res = data?.find(
        //     (x) =>
        //       x.student_id === stdId &&
        //       x.term === state?.creds?.term &&
        //       state?.creds?.session === x.session &&
        //       x.period === "First Half"
        //   );

        //   const studentResult = res?.results?.map((x) => ({
        //     subject: x.subject,
        //     score: x.score,
        //     grade: x.score,
        //   }));

        //   // console.log({ dataS: data, ids, studentResult });

        //   setStudentSecondAssess(studentResult);
        // }
      },
    }
  );

  const {
    data: midtermResult,
    isLoading: midtermResultLoading,
    refetch: refetchMidtermResult,
  } = useQuery(
    [
      queryKeys.GET_MIDTERM,
      stdId,
      // studentData?.id,
      state?.creds?.term,
      state?.creds?.session,
    ],
    () =>
      isStudent
        ? apiServices.getMidTermResult(
            stdId,
            state?.creds?.term,
            state?.creds?.session
          )
        : apiServices.getStaffMidTermResult(
            stdId,
            // studentData?.id,
            state?.creds?.term,
            state?.creds?.session
          ),
    {
      // enabled: false,
      // retry: 1,
      // refetchOnMount: true,
      // refetchOnWindowFocus: false,
      ...queryOptions,
      enabled: false,
      // enabled:
      //   // initGetExistingResult &&
      //   !is_preschool && hasOneAssess && state?.creds?.period === "First Half",
      select(data) {
        const kp = apiServices.formatData(data);
        // console.log({ kdata: data, kp });
        return kp;
      },
      onSuccess(data) {
        // console.log({ dataS: data });
        setInitGetSubjects(false);
        setInitGetExistingResult(false);

        // console.log({ mres: data });
        // setInitGetSubjects(false);
        if (data?.length > 0) {
          const ids = data?.map((x) => x.student_id);

          setIdWithComputedResult(ids);

          const res = data?.find(
            (x) =>
              x.student_id === stdId &&
              x.term === state?.creds?.term &&
              state?.creds?.session === x.session &&
              x.period === "First Half"
          );

          const studentResult = res?.results?.map((x) => ({
            subject: x.subject,
            score: x.score,
            grade: x.score,
          }));

          // console.log({ dataM: data, ids, studentResult });

          setStudentTwoAssess(studentResult);

          const mergeSubjectAndResult2 = () => {
            if (
              !filteredSubjects ||
              !studentResult ||
              filteredSubjects.length === 0 ||
              studentResult.length === 0
            ) {
              return filteredSubjects;
            }

            return filteredSubjects.map((subject) => {
              const result = studentResult.find(
                (r) => r.subject === subject.subject
              );

              if (result) {
                return {
                  subject: result.subject,
                  score: result.score,
                  grade: result.grade,
                };
              } else {
                return {
                  subject: subject.subject,
                  score: subject.score,
                  grade: subject.grade,
                };
              }
            });
          };

          if (state?.creds?.period === "First Half") {
            setAdditionalCreds({
              ...additionalCreds,
              ...res,
            });
          }

          setSubjects(mergeSubjectAndResult2() ?? []);
        } else {
          setStudentTwoAssess([]);
          setInitGetSubjects(true);
          // setSubjects([]);
          // setStudentMidResult([]);
          setAdditionalCreds({});
          setTeacherComment("");
          // setHosComment("");
          // setInitGetStudentsByClass(true);
          // refetchStudentsByClass();
          refetchSubjectsByClass2();
        }
      },
    }
  );

  ///////getMidTermResult /////////////////////////////
  const getMidTermResult = useQuery(
    [
      "GET_MIDTERM",
      stdId,
      // studentData?.id,
      state?.creds?.term,
      state?.creds?.session,
      state?.creds?.period,
    ],
    () =>
      isStudent
        ? apiServices.getMidTermResult(
            stdId,
            state?.creds?.term,
            state?.creds?.session
          )
        : apiServices.getStaffMidTermResult(
            stdId,
            // studentData?.id,
            state?.creds?.term,
            state?.creds?.session
          ),
    {
      ...queryOptions,
      enabled:
        // initGetExistingResult &&
        !is_preschool,
      // !is_preschool && hasOneAssess && state?.creds?.period === "First Half",
      select(data) {
        if (data.data.length > 0) {
          const uniqueRes = uniqueArray(
            data?.data[0]?.attributes?.results,
            "subject"
          );
          const gmt =
            uniqueRes.map((dt, i) => {
              return {
                id: i + 1,
                subject: toSentenceCase(dt.subject),
                score: dt.score,
                grade: dt.score,
              };
            }) ?? [];
          console.log({ mdata: data, uniqueRes });
          return {
            ...data.data[0].attributes,
            results2: gmt,
          };
        } else {
          const newR = {
            results2: [],
          };
          return newR;
        }
      },
      // onSuccess(data) {
      //   if (state?.creds?.period === "Second Half") {
      //     setStudentMidterm(data.results2);
      //   }
      // },
    }
  );

  // midterm assessment for end of term

  const { data: midtermResult2, isLoading: midtermResultLoading2 } = useQuery(
    [
      queryKeys.GET_MIDTERM,
      stdId,
      state?.creds?.term,
      state?.creds?.session,
      "2",
    ],
    () =>
      apiServices.getMidTermResult(
        stdId,
        state?.creds?.term,
        state?.creds?.session
      ),
    {
      // enabled: false,
      // retry: 1,
      // refetchOnMount: true,
      // refetchOnWindowFocus: false,
      ...queryOptions,
      enabled: false,
      // enabled:
      //   !is_preschool && hasOneAssess && state?.creds?.period === "Second Half",
      select(data) {
        const kt = apiServices.formatData(data);

        const res = kt?.find(
          (x) =>
            x.student_id === stdId &&
            x.term === state?.creds?.term &&
            state?.creds?.session === x.session
          // x.period === "Second Half"
        );

        const studentResult = res?.results?.map((x) => ({
          subject: x.subject,
          score: x.score,
          grade: x.score,
        }));

        const mergeSubjectAndResult2 = () => {
          if (
            !filteredSubjects ||
            !studentResult ||
            filteredSubjects.length === 0 ||
            studentResult.length === 0
          ) {
            return filteredSubjects;
          } else {
            return filteredSubjects.map((subject) => {
              const result = studentResult.find(
                (r) => r.subject === subject.subject
              );

              if (result) {
                return {
                  subject: result.subject,
                  score: result.score,
                  grade: result.grade,
                };
              } else {
                return {
                  subject: subject.subject,
                  score: subject.score,
                  grade: subject.grade,
                };
              }
            });
          }
        };

        const mt =
          user?.designation_name === "Teacher"
            ? mergeSubjectAndResult2()
            : studentResult;

        // console.log({
        //   kdata3: data,
        //   kt,
        //   filteredSubjects,
        //   mergeSubjectAndResult2: mergeSubjectAndResult2(),
        //   mt,
        //   studentResult,
        // });

        return kt;
      },
      onSuccess(data) {
        // console.log({ dataS: data });
        // setInitGetSubjects(false);
        // setInitGetExistingResult(false);
        // setInitGetSubjects(false);

        if (data.length > 0) {
          const ids = data?.map((x) => x.student_id);

          setIdWithComputedResult(ids);

          const res = data?.find(
            (x) =>
              x.student_id === stdId &&
              x.term === state?.creds?.term &&
              state?.creds?.session === x.session
            // x.period === "Second Half"
          );

          const studentResult = res?.results?.map((x) => ({
            subject: x.subject,
            score: x.score,
            grade: x.score,
          }));

          const mergeSubjectAndResult2 = () => {
            if (
              !filteredSubjects ||
              !studentResult ||
              filteredSubjects.length === 0 ||
              studentResult.length === 0
            ) {
              return filteredSubjects;
            } else {
              return filteredSubjects.map((subject) => {
                const result = studentResult.find(
                  (r) => r.subject === subject.subject
                );

                if (result) {
                  return {
                    subject: result.subject,
                    score: result.score,
                    grade: result.grade,
                  };
                } else {
                  return {
                    subject: subject.subject,
                    score: subject.score,
                    grade: subject.grade,
                  };
                }
              });
            }
          };

          const mt =
            user?.designation_name === "Teacher"
              ? mergeSubjectAndResult2()
              : studentResult;

          setSubjects(mt ?? []);

          // setStudentMidterm([]);
          setStudentMidterm(mt ?? []);
        }
      },
    }
  );

  const { data: grading, isLoading: gradingLoading } = useQuery(
    [queryKeys.GET_GRADING],
    apiServices.getGrading,
    {
      // retry: 1,
      // refetchOnMount: true,
      // refetchOnWindowFocus: false,
      ...queryOptions,
      enabled: !is_preschool,
      select: apiServices.formatData,
      onError(err) {
        apiServices.errorHandler(err);
      },
    }
  );

  // Add Result
  const { mutateAsync: addResult, isLoading: addResultLoading } = useMutation(
    apiServices.addResult,
    {
      onSuccess() {
        toast.success("Result has been computed successfully");
        if (
          !hasOneAssess &&
          inputs.assessment === "first_assesment" &&
          state?.creds?.period === "First Half"
        ) {
          refetchFirstAssess();
          trigger(500);
          // refetchFirstAssess2();
        } else if (
          !hasOneAssess &&
          inputs.assessment === "second_assesment" &&
          state?.creds?.period === "First Half"
        ) {
          refetchSecondAssess();
          // refetchFirstAssess2();
        }
      },
      onError(err) {
        apiServices.errorHandler(err);
      },
    }
  );

  // Release Result
  const { mutateAsync: releaseResult, isLoading: releaseResultLoading } =
    useMutation(
      () =>
        apiServices.releaseResult({
          period: state?.creds?.period,
          term: state?.creds?.term,
          session: state?.creds?.session,
          students: [
            {
              student_id: stdId,
            },
          ],
        }),
      {
        onSuccess() {
          if (
            !hasOneAssess &&
            inputs.assessment === "first_assesment" &&
            state?.creds?.period === "First Half"
          ) {
            getMidTermResult.refetch();
            trigger(500);
            refetchFirstAssess();
            // refetchMidtermResult();

            // refetchFirstAssess2();
          } else if (
            !hasOneAssess &&
            inputs.assessment === "second_assesment" &&
            state?.creds?.period === "First Half"
          ) {
            getMidTermResult.refetch();
            trigger(500);
            refetchSecondAssess();
            // refetchMidtermResult();

            // refetchFirstAssess2();
          } else if (hasOneAssess && state?.creds?.period === "First Half") {
            getMidTermResult.refetch();
            trigger(500);
          } else {
            getEndOfTermResult.refetch();
            trigger(500);
          }
          toast.success("Result has been released successfully");
        },
        onError(err) {
          apiServices.errorHandler(err);
        },
      }
    );

  // withhold Result
  const { mutateAsync: withholdResult, isLoading: withholdResultLoading } =
    useMutation(
      () =>
        apiServices.withholdResult({
          period: state?.creds?.period,
          term: state?.creds?.term,
          session: state?.creds?.session,
          students: [
            {
              student_id: stdId,
            },
          ],
        }),
      {
        onSuccess() {
          toast.success("Result has been withheld successfully");
          if (
            !hasOneAssess &&
            inputs.assessment === "first_assesment" &&
            state?.creds?.period === "First Half"
          ) {
            getMidTermResult.refetch();
            trigger(500);
            refetchFirstAssess();
            // refetchMidtermResult();

            // refetchFirstAssess2();
          } else if (
            !hasOneAssess &&
            inputs.assessment === "second_assesment" &&
            state?.creds?.period === "First Half"
          ) {
            getMidTermResult.refetch();
            trigger(500);
            refetchSecondAssess();
            // refetchMidtermResult();

            // refetchFirstAssess2();
          } else if (hasOneAssess && state?.creds?.period === "First Half") {
            getMidTermResult.refetch();
            trigger(500);
          } else {
            getEndOfTermResult.refetch();
            trigger(500);
          }
        },
        onError(err) {
          apiServices.errorHandler(err);
        },
      }
    );

  const toastValue =
    inputs.assessment === "first_assesment"
      ? "First Assessment"
      : "Second Assessment";

  const { mutateAsync: addMidTermResult, isLoading: addMidTermResultLoading } =
    useMutation(apiServices.addMidTermResult, {
      onSuccess() {
        // trigger(500);
        // if(!hasOneAssess){
        //   refetchSecondAssess();
        //   refetchFirstAssess();
        // }
        if (
          !hasOneAssess &&
          inputs.assessment === "first_assesment" &&
          state?.creds?.period === "First Half"
        ) {
          refetchFirstAssess();
          trigger(500);
          toast.success(
            `${
              !hasOneAssess ? toastValue : "Mid Term"
            } Result has been computed successfully`
          );
          // refetchFirstAssess2();
        } else if (
          !hasOneAssess &&
          inputs.assessment === "second_assesment" &&
          state?.creds?.period === "First Half"
        ) {
          refetchSecondAssess();
          trigger(500);
          toast.success(
            `${
              !hasOneAssess ? toastValue : "Mid Term"
            } Result has been computed successfully`
          );
          // refetchFirstAssess2();
        } else {
          // refetchMidtermResult();
          getMidTermResult.refetch();
          trigger(500);
          toast.success(`Mid Term Result has been computed successfully`);
        }
      },
      onError(err) {
        apiServices.errorHandler(err);
      },
    });

  const {
    mutateAsync: addEndOfTermResult,
    isLoading: addEndOfTermResultLoading,
  } = useMutation(apiServices.addEndOfTermResult, {
    onSuccess() {
      toast.success(`End of Term Result has been computed successfully`);
      getEndOfTermResult.refetch();
      trigger(500);
      // endOfTermResultsRefetch();
    },
    onError(err) {
      apiServices.errorHandler(err);
    },
  });

  const {
    mutateAsync: addPreSchoolResult,
    isLoading: addPreSchoolResultLoading,
  } = useMutation(apiServices.postPreSchoolResult, {
    onSuccess() {
      trigger(500);
      refetchSubjects();
      preSchoolCompiledResultsRefetch();
      toast.success("Result has been computed successfully");
    },
    onError(err) {
      apiServices.errorHandler(err);
    },
  });

  // const getScoreRemark = (score) => {
  //   const res = grading?.find(
  //     (x) =>
  //       score >= Number(x?.score_from ?? 0) && score <= Number(x?.score_to ?? 0)
  //   );

  //   return res;
  // };
  const getScoreRemark = (score) => {
    const res = grading?.find(
      (x) => score >= Number(x.score_from) && score <= Number(x.score_to)
    );

    return res || { grade: "N/A", remark: "Out of range", id: null };
  };

  // console.log({ grading });

  const getTotalScores = () => {
    return additionalCreds?.results?.reduce((a, item) => {
      return a + Number(item.score);
    }, 0);
  };

  const getTotalMidScores = () => {
    return studentMidResult?.reduce((a, item) => {
      return a + Number(item.score);
    }, 0);
  };

  const removeSubject = (subject) => {
    const fd = subjects.filter((x) => x.subject !== subject);

    setSubjects(fd);
  };

  // const createMidTermResult = () => {
  //   const dataToSend = {
  //     student_id: studentData?.id,
  //     student_fullname: `${studentData?.surname} ${studentData?.firstname}  ${studentData?.middlename}`,
  //     admission_number: studentData.admission_number,
  //     class_name: studentClassName,
  //     period: state?.creds?.period,
  //     term: state?.creds?.term,
  //     session: state?.creds?.session,
  //     result_type: "first_assessment",
  //     results: subjects.map((x) => ({
  //       subject: x.subject,
  //       score: x.grade,
  //     })),
  //     teacher_comment: teacherComment,
  //     teacher_id: user?.id ?? "",
  //   };

  //   addResult(dataToSend);
  // };

  const computeMidTermResult = () => {
    const dataToSend = {
      student_id: stdId,
      student_fullname: `${studentData?.surname} ${studentData?.firstname}  ${studentData?.middlename}`,
      admission_number: studentData.admission_number,
      class_name: studentClassName,
      period: state?.creds?.period,
      term: state?.creds?.term,
      session: state?.creds?.session,
      result_type: !hasOneAssess ? inputs.assessment : "midterm",
      results: computedSubjects.map((x) => ({
        subject: x.subject,
        score: x.grade,
      })),
      teacher_comment: teacherComment,
      teacher_id: user?.id ?? "",
    };

    // console.log({ dataToSend });

    addMidTermResult(dataToSend);
  };

  // console.log({
  //   ad: additionalCreds?.affective_disposition,
  //   ps: additionalCreds?.psychomotor_skills,
  // });
  const getHos_Id = () => {
    if (comments?.length > 0) return comments[0]?.hos_id;
  };

  const createEndOfTermResult = () => {
    const dataToSend = {
      student_id: stdId,
      student_fullname: `${studentData?.surname} ${studentData?.firstname} ${studentData?.middlename}`,
      admission_number: studentData.admission_number,
      class_name: studentClassName,
      period: state?.creds?.period,
      term: state?.creds?.term,
      session: state?.creds?.session,
      school_opened: additionalCreds?.school_opened,
      times_present: additionalCreds?.times_present,
      times_absent: additionalCreds?.times_absent,
      results: computedSubjects?.map((x) => ({
        subject: x.subject,
        score: x.grade,
      })),
      affective_disposition:
        additionalCreds?.affective_disposition?.map((ac) => {
          return {
            ...ac,
            score: ac?.score?.value,
          };
        }) ?? [],
      // affective_disposition: additionalCreds?.affective_disposition ?? [],
      psychomotor_skills:
        additionalCreds?.psychomotor_skills?.map((ac) => {
          return {
            ...ac,
            score: ac?.score?.value,
          };
        }) ?? [],
      // psychomotor_skills: additionalCreds?.psychomotor_skills ?? [],
      pupil_report:
        additionalCreds?.pupil_report?.map((ac) => {
          return {
            ...ac,
            score: ac?.score?.value,
          };
        }) ?? [],
      // pupil_report: additionalCreds?.pupil_report ?? [],
      psychomotor_performance:
        additionalCreds?.psychomotor_performance?.map((ac) => {
          return {
            ...ac,
            score: ac?.score?.value,
          };
        }) ?? [],
      // psychomotor_performance: additionalCreds?.psychomotor_performance ?? [],
      teacher_comment: teacherComment,
      teacher_id: user?.id,
      hos_comment: hosComment,
      hos_id: getHos_Id(),
      performance_remark: performanceRemark,
      extra_curricular_activities: extraActivities,
      abacus: {
        name: user?.campus?.includes("College") ? "Good" : abacus,
      },
    };

    const dataToSend2 = {
      student_id: stdId,
      student_fullname: `${studentData?.surname} ${studentData?.firstname} ${studentData?.middlename}`,
      admission_number: studentData.admission_number,
      class_name: studentClassName,
      period: state?.creds?.period,
      term: state?.creds?.term,
      session: state?.creds?.session,
      // school_opened: additionalCreds?.school_opened,
      // times_present: additionalCreds?.times_present,
      // times_absent: additionalCreds?.times_absent,
      results: computedSubjects?.map((x) => ({
        subject: x.subject,
        score: x.grade,
      })),
      // affective_disposition: additionalCreds?.affective_disposition,
      // psychomotor_skills: additionalCreds?.psychomotor_skills,
      // teacher_comment: teacherComment,
      // teacher_id: user?.id,
      // hos_comment: hosComment,
      // hos_id: comments[0]?.hos_id,
      // performance_remark: performanceRemark,
    };

    if (
      !additionalCreds?.school_opened ||
      !additionalCreds?.times_present ||
      !additionalCreds ||
      !teacherComment ||
      !hosComment 
      // !performanceRemark
      // extraActivities?.length === 0
      // !performanceRemark ||
      // !additionalCreds?.affective_disposition[0]?.score ||
      // !additionalCreds?.affective_disposition[1]?.score ||
      // !additionalCreds?.affective_disposition[2]?.score ||
      // !additionalCreds?.psychomotor_skills[0]?.score ||
      // !additionalCreds?.psychomotor_skills[1]?.score ||
      // !additionalCreds?.psychomotor_skills[2]?.score
    ) {
      toast.error(`Please fill all empty fields`);
      return;
    }

    // console.log({ dataToSend, dataToSend2, studentData });

    if (user?.teacher_type === "class teacher") {
      addEndOfTermResult(dataToSend);
    } else {
      addEndOfTermResult(dataToSend2);
    }
  };

  // const createEndOfTermResult = () => {
  //   const dataToSend = {
  //     student_id: stdId,
  //     student_fullname: `${studentData?.surname} ${studentData?.firstname}  ${studentData?.middlename}`,
  //     admission_number: studentData.admission_number,
  //     class_name: studentClassName,
  //     period: state?.creds?.period,
  //     term: state?.creds?.term,
  //     session: state?.creds?.session,
  //     school_opened: additionalCreds?.school_opened,
  //     times_present: additionalCreds?.times_present,
  //     times_absent: additionalCreds?.times_absent,
  //     results: subjects.map((x) => ({
  //       subject: x.subject,
  //       score: x.grade,
  //     })),
  //     affective_disposition: additionalCreds?.affective_disposition,
  //     psychomotor_skills: additionalCreds?.psychomotor_skills,
  //     teacher_comment: teacherComment,
  //     teacher_id: user?.id,
  //     hos_comment: hosComment,
  //     hos_id: comments[0]?.hos_id,
  //     performance_remark: performanceRemark,
  //   };

  //   addResult(dataToSend);
  // };

  // console.log({ state, studentData, user, studentId: studentId(), className });

  const isLoading =
    academicDateLoading ||
    maxScoresLoading ||
    studentByClassLoading ||
    // getStudentByClassLoading ||
    subjectsByClassLoading ||
    addResultLoading ||
    commentsLoading ||
    endOfTermResultsLoading ||
    gradingLoading ||
    preSchoolSubjectsByClassLoading ||
    addPreSchoolResultLoading ||
    getCummulativeScoresLoading ||
    preSchoolCompiledResultsLoading ||
    loadingClassAverage ||
    loadingYearlyClassAverage ||
    firstAssessResultLoading ||
    secondAssessResultLoading ||
    secondAssessResultLoading2 ||
    subjectsByClass2Loading ||
    midtermResultLoading ||
    addEndOfTermResultLoading ||
    firstAssessResultLoading2 ||
    addMidTermResultLoading ||
    subjectsByClassLoading3 ||
    preSchoolSubjectsLoading ||
    loading1;
  // ||
  // releaseResultLoading;

  // console.log({
  //   userDetails,
  //   teacherSubjects,
  //   findId: findId(),
  //   subjectsByClass3,
  // });
  // console.log({ stdId });

  return {
    inputs,
    studentRes,
    setStudentRes,
    handleChange,
    isLoading,
    academicDate,
    permission,
    openPrompt,
    setOpenPrompt,
    selectedComment,
    setSelectedComment,
    teacherComment,
    setTeacherComment,
    hosComment,
    setHosComment,
    comment,
    setComment,
    maxScores,
    pdfExportComponent,
    handlePrint,
    user,
    studentData,
    setStudentData,
    setInitGetExistingResult,
    // studentResult,
    subjects,
    subjectsByClass,
    subjectsByClass2,
    setSubjects,
    getTotalScores,
    removeSubject,
    // createMidTermResult,
    additionalCreds,
    setAdditionalCreds,
    studentByClassAndSession,
    locationState: state,
    studentMidResult,
    getTotalMidScores,
    comments,
    createEndOfTermResult,
    getScoreRemark,
    idWithComputedResult,
    setInitGetExistingSecondHalfResult,
    preSchoolSubjectsByClass,
    addPreSchoolResult,
    cummulativeScores,
    preSchoolCompiledResults,
    grading,
    performanceRemark,
    setPerformanceRemark,
    classAverage,
    yearlyClassAverage,
    computeMidTermResult,
    studentTwoAssess,
    // studentSecondAssess,
    firstAssessResult,
    setInitGetSubjects,
    refetchFirstAssess,
    secondAssessResult,
    refetchSecondAssess,
    studentFirstAssess,
    studentSecondAssess,
    studentMidterm,
    extraActivities,
    setExtraActivities,
    preActivities2,
    setPreActivities2,
    abacus,
    setAbacus,
    setActivateEndOfTerm,
    initGetExistingSecondHalfResult,
    activateEndOfTerm,

    releaseResult,
    releaseResultLoading,
    withholdResult,
    withholdResultLoading,
    studentByClass2,
    subjectsByClass3,
    setIdWithComputedResult,
    preSchoolSubjects,
    mergedClass,
    isAdminPrincipal,
    isStudent,
    // studentByClass,
    // getStudentByClassLoading,
    // mergedSubjects,

    getSubjectByClass,
    getMidTermResult,
    computedSubjects,
    setComputedSubjects,
    setStudentMidterm,
    getEndOfTermResult,
    stdId,

    firstAssessResult2,
    secondAssessResult2,
  };
};
