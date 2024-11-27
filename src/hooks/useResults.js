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

export const useResults = () => {
  const { apiServices, errorHandler, permission, user } =
    useAppContext("results");

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
  const [teacherComment, setTeacherComment] = useState("");
  const [performanceRemark, setPerformanceRemark] = useState("good");
  const [abacus, setAbacus] = useState("");
  const [filteredSubjects, setFilteredSubjects] = useState("");
  const [extraActivities, setExtraActivities] = useState([]);
  const [preActivities2, setPreActivities2] = useState([]);
  const [activateEndOfTerm, setActivateEndOfTerm] = useState(true);

  const [loading1, setLoading1] = useState(false);

  function trigger(time) {
    setLoading1(true);
    setTimeout(() => {
      setLoading1(false);
    }, time);
  }

  const { state } = useLocation();
  const studentClassName = `${studentData?.present_class}`;
  // const studentClassName = `${studentData?.present_class} ${studentData?.sub_class}`;
  const pdfExportComponent = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => pdfExportComponent.current,
  });

  const { inputs, handleChange } = useForm({
    defaultValues: {
      assessment: "first_assesment",
      midterm: "midterm",
    },
  });

  const teacherSubjects =
    user?.designation_name === "Teacher" &&
    user?.subjects?.map((x) => ({
      subject: x.name,
      score: "0",
      grade: "0",
    }));

  // console.log({ user });
  // console.log({ initGetStudentsByClass, subjects });

  const is_preschool = !!user?.is_preschool && user.is_preschool !== "false";

  const { data: academicDate, isLoading: academicDateLoading } = useQuery(
    [queryKeys.GET_ACADEMIC_DATE],
    apiServices.getResumptionDate,
    {
      onError(err) {
        errorHandler(err);
      },
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
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
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      select: apiServices.formatData,
    }
  );

  const activate =
    user?.designation_name === "Admin" || "Teacher" ? true : false;

  const { data: maxScores, isLoading: maxScoresLoading } = useQuery(
    [queryKeys.GET_MAX_SCORES],
    apiServices.getMaxScores,
    {
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: activate,
      // enabled: !is_preschool,
      onError(err) {
        errorHandler(err);
      },
      select: (data) => {
        console.log({ scoreData: data });
        return data?.data?.attributes;
        // return data?.data[0]?.attributes;
      },
    }
  );

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
        state?.creds?.class_name
          ? state?.creds?.class_name
          : user?.class_assigned,
        // state?.creds?.session,
      ],
      () =>
        apiServices.getStudentByClass2(
          chk
          //   ,
          // state?.creds?.session
        ),
      {
        enabled: initGetStudentData && !!chk,
        select: (data) => {
          const dt2 = apiServices.formatData(data);

          if (dt2?.length > 0) {
            const sst2 = dt2?.find((x) => x?.id === user?.id) ?? {};

            const studentInfo =
              user?.designation_name === "Student"
                ? dt2?.find((x) => x?.id === user?.id)
                : dt2[0];

            // console.log({
            //   dataSS: data,
            //   user,
            //   dt2,
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

  // student by class2
  const { data: studentByClass2, isLoading: studentByClass2Loading } = useQuery(
    [queryKeys.GET_ALL_STUDENTS_BY_CLASS3, user?.class_assigned],
    () =>
      apiServices.getStudentByClass2(
        state?.creds?.class_name
          ? state?.creds?.class_name
          : user?.class_assigned
      ),

    {
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: permission?.view && !!chk,
      // enabled: permission?.myStudents || user?.designation_name === "Principal",
      // select: apiServices.formatData,
      select: (data) => {
        // console.log({ pdata: data, state });
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
      studentData?.id,
      state?.creds?.term,
      state?.creds?.session,
    ],
    () =>
      apiServices.getEndOfTermResults(
        studentData?.id,
        state?.creds?.term,
        state?.creds?.session
      ),
    {
      // enabled: false,
      retry: 1,
      enabled:
        activateEndOfTerm &&
        initGetExistingSecondHalfResult &&
        !is_preschool &&
        state?.creds?.period === "Second Half",
      select: apiServices.formatData,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: false,
      // staleTime: 60000 * 30,

      onSuccess(data) {
        setInitGetSubjects(false);
        setInitGetExistingSecondHalfResult(false);

        if (data?.length > 0) {
          const ids = data?.map((x) => x.student_id);
          setIdWithComputedResult(ids);
          const res = data?.find(
            (x) =>
              x.student_id === studentData?.id &&
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

          // console.log({ studentResult, res });

          setAdditionalCreds({
            ...additionalCreds,
            ...res,
            school_opened: res?.school_opened ?? "0",
            times_present: res?.times_present ?? "0",
            times_absent: res?.times_absent ?? "0",
          });

          setSubjects(mergeSubjectAndResult2() ?? []);
          // setSubjects(studentResult);

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

          //   setSubjects(mergeSubjectAndResult2());
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
          // setSubjects([]);

          // setInitGetExistingResult(true);
          setAddMidResultAsLast(true);
        }
      },
    }
  );

  // subject by class
  const {
    data: subjectsByClass,
    isLoading: subjectsByClassLoading,
    // refetch: refetchSubjectsByClass,
  } = useQuery(
    [
      queryKeys.GET_SUBJECTS_BY_CLASS,
      state?.creds?.class_name
        ? state?.creds?.class_name
        : user?.class_assigned,
    ],
    () => apiServices.getSubjectByCampus(),
    {
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: false,
      // enabled: initGetStudentsByClass && !is_preschool,
      select: apiServices.formatData,
      onSuccess(data) {
        // console.log({ data });
        const subjectsWithGrade = data?.map((x) => ({ ...x, grade: "0" }));

        // if (subjects.length === 0) setSubjects(subjectsWithGrade);
        // setInitGetStudentsByClass(false);
        // console.log({ data, initGetStudentsByClass, subjectsWithGrade });
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
    [queryKeys.GET_PRE_SCHOOL_SUBJECTS_BY_CLASS, cn],
    () =>
      apiServices.getPreSchoolSubjectsByClass(
        state?.creds?.period,
        state?.creds?.term,
        state?.creds?.session,
        cn
      ),
    {
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled:
        is_preschool &&
        !!state?.creds?.period &&
        !!state?.creds?.term &&
        !!state?.creds?.session &&
        !!cn,
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
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: is_preschool,
      // select: apiServices.formatData,
      select: (data) => {
        const dt = apiServices.formatData(data);

        // console.log({ rdata: data, rd: dt });

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
        studentData?.id,
        state?.creds?.period,
        state?.creds?.term,
        state?.creds?.session,
      ],
      () =>
        apiServices.getCummulativeScores({
          student_id: studentData?.id,
          period: state?.creds?.period,
          term: state?.creds?.term,
          session: state?.creds?.session,
        }),
      {
        retry: 1,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        enabled: !is_preschool && state?.creds?.period === "Second Half",
        select: (data) => data?.data,
      }
    );

  const { isLoading: loadingClassAverage, data: classAverage } = useQuery(
    [
      queryKeys.GET_YEARLY_CLASS_AVERAGE,
      studentClassName,
      studentData?.id,
      state?.creds?.term,
      state?.creds?.session,
    ],
    () =>
      apiServices.getClassAverage({
        class_name: studentClassName,
        student_id: studentData?.id,
        term: state?.creds?.term,
        session: state?.creds?.session,
      }),
    {
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !is_preschool && state?.creds?.period === "Second Half",
    }
  );

  const { isLoading: loadingYearlyClassAverage, data: yearlyClassAverage } =
    useQuery(
      [queryKeys.GET_CLASS_AVERAGE, studentClassName, state?.creds?.session],
      () =>
        apiServices.getYearlyClassAverage({
          class_name: studentClassName,
          session: state?.creds?.session,
        }),
      {
        retry: 1,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        enabled:
          !is_preschool &&
          Boolean(studentClassName) &&
          state?.creds?.term === "Third Term" &&
          state?.creds?.period === "Second Half",
      }
    );

  const {
    data: subjectsByClass2,
    isLoading: subjectsByClass2Loading,
    refetch: refetchSubjectsByClass2,
  } = useQuery(
    [
      queryKeys.GET_SUBJECTS_BY_CLASS,
      state?.creds?.class_name
        ? state?.creds?.class_name
        : user?.class_assigned,
      "2",
    ],
    () => apiServices.getSubjectByCampus(),
    {
      // enabled: initGetExistingResult && !is_preschool,
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: initGetSubjects && !is_preschool,
      select: apiServices.formatData,
      onSuccess(data) {
        setInitGetSubjects(false);
        if (data?.length > 0) {
          // console.log({ allsub: data });
          const subj = data[0]?.subject?.map((x) => ({
            subject: x.name,
            score: "0",
            grade: "0",
          }));

          const fss =
            user?.designation_name === "Teacher" &&
            subj?.filter((sg) => {
              let sub = {};
              teacherSubjects?.forEach((ss) => {
                if (ss?.subject === sg?.subject) {
                  sub = ss;
                }
              });
              return sg.subject === sub?.subject;
            });

          const filteredSubj =
            user?.teacher_type === "class teacher" ? subj : fss;

          setFilteredSubjects(filteredSubj);

          setSubjects(filteredSubj ?? []);

          // console.log({ dataSS: data, subj });
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
      studentData?.id,
      state?.creds?.term,
      state?.creds?.session,
    ],
    () =>
      apiServices.getFirstAssessment(
        studentData?.id,
        state?.creds?.term,
        state?.creds?.session
      ),
    {
      // enabled: false,
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled:
        // initGetExistingResult &&
        !is_preschool &&
        userDetails?.maxScores?.has_two_assessment === 1 &&
        inputs.assessment === "first_assesment" &&
        state?.creds?.period === "First Half",
      select: apiServices.formatData,
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
              x.student_id === studentData?.id &&
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
          // setInitGetFirstAssess(false);
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
      studentData?.id,
      state?.creds?.term,
      state?.creds?.session,
      "2",
    ],
    () =>
      apiServices.getFirstAssessment(
        studentData?.id,
        state?.creds?.term,
        state?.creds?.session
      ),
    {
      // enabled: false,
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled:
        // initGetExistingResult &&
        !is_preschool &&
        userDetails?.maxScores?.has_two_assessment === 1 &&
        state?.creds?.period === "Second Half",
      select: apiServices.formatData,
      onSuccess(data) {
        // setInitGetFirstAssess(false)
        // setInitGetSubjects(false);
        // setInitGetExistingResult(false);

        if (data.length > 0) {
          const ids = data?.map((x) => x.student_id);

          setIdWithComputedResult(ids);

          const res = data?.find(
            (x) =>
              x.student_id === studentData?.id &&
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
      studentData?.id,
      state?.creds?.term,
      state?.creds?.session,
    ],
    () =>
      apiServices.getSecondAssessment(
        studentData?.id,
        state?.creds?.term,
        state?.creds?.session
      ),
    {
      retry: 1,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled:
        // initGetExistingResult &&
        !is_preschool &&
        userDetails?.maxScores?.has_two_assessment === 1 &&
        inputs.assessment === "second_assesment" &&
        state?.creds?.period === "First Half",
      select: apiServices.formatData,
      onSuccess(data) {
        // setInitGetSubjects(false);
        // setInitGetExistingResult(false);

        // console.log({ dataS: data });
        // console.log({ sres: data });

        if (data.length > 0) {
          const ids = data?.map((x) => x.student_id);

          setIdWithComputedResult(ids);

          const res = data?.find(
            (x) =>
              x.student_id === studentData?.id &&
              x.term === state?.creds?.term &&
              state?.creds?.session === x.session &&
              x.period === "First Half"
          );

          const studentResult = res?.results?.map((x) => ({
            subject: x.subject,
            score: x.score,
            grade: x.score,
          }));

          // console.log({ dataS: data, ids, studentResult });

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
      studentData?.id,
      state?.creds?.term,
      state?.creds?.session,
      "2",
    ],
    () =>
      apiServices.getSecondAssessment(
        studentData?.id,
        state?.creds?.term,
        state?.creds?.session
      ),
    {
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled:
        // initGetExistingResult &&
        !is_preschool &&
        userDetails?.maxScores?.has_two_assessment === 1 &&
        state?.creds?.period === "Second Half",
      select: apiServices.formatData,
      onSuccess(data) {
        setInitGetSubjects(false);
        setInitGetExistingResult(false);

        // console.log({ dataS: data });

        if (data.length > 0) {
          const ids = data?.map((x) => x.student_id);

          setIdWithComputedResult(ids);

          const res = data?.find(
            (x) =>
              x.student_id === studentData?.id &&
              x.term === state?.creds?.term &&
              state?.creds?.session === x.session &&
              x.period === "First Half"
          );

          const studentResult = res?.results?.map((x) => ({
            subject: x.subject,
            score: x.score,
            grade: x.score,
          }));

          // console.log({ dataS: data, ids, studentResult });

          setStudentSecondAssess(studentResult);
        }
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
      studentData?.id,
      state?.creds?.term,
      state?.creds?.session,
    ],
    () =>
      apiServices.getMidTermResult(
        studentData?.id,
        state?.creds?.term,
        state?.creds?.session
      ),
    {
      // enabled: false,
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled:
        // initGetExistingResult &&
        !is_preschool &&
        userDetails?.maxScores?.has_two_assessment === 0 &&
        state?.creds?.period === "First Half",
      select: apiServices.formatData,
      onSuccess(data) {
        // console.log({ dataS: data });
        setInitGetSubjects(false);
        setInitGetExistingResult(false);

        // console.log({ mres: data });
        // setInitGetSubjects(false);
        if (data.length > 0) {
          const ids = data?.map((x) => x.student_id);

          setIdWithComputedResult(ids);

          const res = data?.find(
            (x) =>
              x.student_id === studentData?.id &&
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

  // midterm assessment for end of term

  const { data: midtermResult2, isLoading: midtermResultLoading2 } = useQuery(
    [
      queryKeys.GET_MIDTERM,
      studentData?.id,
      state?.creds?.term,
      state?.creds?.session,
      "2",
    ],
    () =>
      apiServices.getMidTermResult(
        studentData?.id,
        state?.creds?.term,
        state?.creds?.session
      ),
    {
      // enabled: false,
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled:
        // initGetExistingResult &&
        !is_preschool &&
        userDetails?.maxScores?.has_two_assessment === 0 &&
        state?.creds?.period === "Second Half",
      select: apiServices.formatData,
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
              x.student_id === studentData?.id &&
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

          setStudentMidterm(studentResult);
        }
      },
    }
  );

  const { data: grading, isLoading: gradingLoading } = useQuery(
    [queryKeys.GET_GRADING],
    apiServices.getGrading,
    {
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
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
          userDetails?.maxScores?.has_two_assessment === 1 &&
          inputs.assessment === "first_assesment" &&
          state?.creds?.period === "First Half"
        ) {
          refetchFirstAssess();
          trigger(500);
          // refetchFirstAssess2();
        } else if (
          userDetails?.maxScores?.has_two_assessment === 1 &&
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
              student_id: studentData?.id,
            },
          ],
        }),
      {
        onSuccess() {
          if (
            userDetails?.maxScores?.has_two_assessment === 1 &&
            inputs.assessment === "first_assesment" &&
            state?.creds?.period === "First Half"
          ) {
            trigger(500);
            refetchFirstAssess();
            refetchMidtermResult();
            // refetchFirstAssess2();
          } else if (
            userDetails?.maxScores?.has_two_assessment === 1 &&
            inputs.assessment === "second_assesment" &&
            state?.creds?.period === "First Half"
          ) {
            trigger(500);
            refetchSecondAssess();
            refetchMidtermResult();
            // refetchFirstAssess2();
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
              student_id: studentData?.id,
            },
          ],
        }),
      {
        onSuccess() {
          toast.success("Result has been withheld successfully");
          if (
            userDetails?.maxScores?.has_two_assessment === 1 &&
            inputs.assessment === "first_assesment" &&
            state?.creds?.period === "First Half"
          ) {
            trigger(500);
            refetchFirstAssess();
            refetchMidtermResult();
            // refetchFirstAssess2();
          } else if (
            userDetails?.maxScores?.has_two_assessment === 1 &&
            inputs.assessment === "second_assesment" &&
            state?.creds?.period === "First Half"
          ) {
            trigger(500);
            refetchSecondAssess();
            refetchMidtermResult();
            // refetchFirstAssess2();
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
        trigger(500);
        refetchMidtermResult();
        toast.success(
          `${
            userDetails?.maxScores?.has_two_assessment === 1
              ? toastValue
              : "Mid Term"
          } Result has been computed successfully`
        );
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
      trigger(500);
      endOfTermResultsRefetch();
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
    const res = grading.find(
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
      student_id: studentData?.id,
      student_fullname: `${studentData?.surname} ${studentData?.firstname}  ${studentData?.middlename}`,
      admission_number: studentData.admission_number,
      class_name: studentClassName,
      period: state?.creds?.period,
      term: state?.creds?.term,
      session: state?.creds?.session,
      result_type:
        userDetails?.maxScores?.has_two_assessment === 1
          ? inputs.assessment
          : "midterm",
      results: subjects.map((x) => ({
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
      student_id: studentData?.id,
      student_fullname: `${studentData?.surname} ${studentData?.firstname} ${studentData?.middlename}`,
      admission_number: studentData.admission_number,
      class_name: studentClassName,
      period: state?.creds?.period,
      term: state?.creds?.term,
      session: state?.creds?.session,
      school_opened: additionalCreds?.school_opened,
      times_present: additionalCreds?.times_present,
      times_absent: additionalCreds?.times_absent,
      results: subjects?.map((x) => ({
        subject: x.subject,
        score: x.grade,
      })),
      affective_disposition: additionalCreds?.affective_disposition ?? [],
      psychomotor_skills: additionalCreds?.psychomotor_skills ?? [],
      pupil_report: additionalCreds?.pupil_report ?? [],
      psychomotor_performance: additionalCreds?.psychomotor_performance ?? [],
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
      student_id: studentData?.id,
      student_fullname: `${studentData?.surname} ${studentData?.firstname} ${studentData?.middlename}`,
      admission_number: studentData.admission_number,
      class_name: studentClassName,
      period: state?.creds?.period,
      term: state?.creds?.term,
      session: state?.creds?.session,
      // school_opened: additionalCreds?.school_opened,
      // times_present: additionalCreds?.times_present,
      // times_absent: additionalCreds?.times_absent,
      results: subjects?.map((x) => ({
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

    // console.log({ dataToSend, dataToSend2, studentData });

    if (user?.teacher_type === "class teacher") {
      if (
        !additionalCreds ||
        !teacherComment ||
        !hosComment 
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
      } else {
        addEndOfTermResult(dataToSend);
      }
    } else {
      addEndOfTermResult(dataToSend2);
    }
  };

  // const createEndOfTermResult = () => {
  //   const dataToSend = {
  //     student_id: studentData?.id,
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
    subjectsByClass2Loading ||
    midtermResultLoading ||
    addEndOfTermResultLoading ||
    firstAssessResultLoading2 ||
    addMidTermResultLoading ||
    loading1;
  // ||
  // releaseResultLoading;

  console.log({ grading, userDetails, maxScores, teacherSubjects });
  // console.log({ subjectsWithGrade, subjectsWithScoreAndGrade });

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
    // studentByClass,
    // getStudentByClassLoading,
    // mergedSubjects,
  };
};
