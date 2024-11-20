import { useState } from "react";
import { useQuery } from "react-query";
import queryKeys from "../utils/queryKeys";
import { useAppContext } from "./useAppContext";

import { useStudent } from "./useStudent";

import useLocalStorage from "use-local-storage";

export const useAssignments = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [submissionTab, setSubmissionTab] = useState("2");
  const [ResultTab, setResultTab] = useState("2");

  const [obj, setObj] = useLocalStorage("obj", []);

  const [objectiveQ, setObjectiveQ] = useState([]);
  const [theoryQ, setTheoryQ] = useState([]);
  const [answeredObjQ, setAnsweredObjQ] = useState([]);
  const [markedObjQ, setMarkedObjQ] = useState([]);
  const [answeredTheoQ, setAnsweredTheoQ] = useState([]);
  const [markedTheoQ, setMarkedTheoQ] = useState([]);
  const [markedTheoQ2, setMarkedTheoQ2] = useState([]);
  const [answeredObjResults, setAnsweredObjResults] = useState([]);
  const [answeredTheoryResults, setAnsweredTheoryResults] = useState([]);
  const [objMark, setObjMark] = useState(0);

  const [answerQ, setAnswerQ] = useState({
    question_type: "",
    subject: "",
    term: "",
    period: "",
    session: "",
    subject_id: "",
    week: "",
    student_id: "",
    student: "",
  });

  const [markedQ, setMarkedQ] = useState({
    question_type: "",
    subject: "",
    term: "",
    period: "",
    session: "",
    subject_id: "",
    week: "",
    student_id: "",
    student: "",
  });

  const [performanceQ, setPerformanceQ] = useState({
    question_type: "",
    subject: "",
    term: "",
    period: "",
    session: "",
    subject_id: "",
    week: "",
    student_id: "",
    student: "",
  });

  const [createQ, setCreateQ] = useState({
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    total_mark: 0,
    theory_total_mark: 0,
    total_question: 0,
    question_mark: 0,
    question_number: 0,
    ans1: false,
    ans2: false,
    ans3: false,
    ans4: false,
    answer: "",
    // theoryAns: "",
    question_type: "",
    question: "",
    subject: "",
    image: "",
    imageName: "",
    term: "",
    period: "",
    session: "",
    subject_id: "",
    week: "",
  });

  const {
    option1,
    option2,
    option3,
    option4,
    total_mark,
    theory_total_mark,
    total_question,
    question_mark,
    question_number,
    ans1,
    ans2,
    ans3,
    ans4,
    answer,
    question_type,
    question,
    subject,
    image,
    imageName,
    term,
    period,
    session,
    subject_id,
    week,
  } = createQ;

  const { apiServices, errorHandler, permission, user } =
    useAppContext("assignments");

  const { studentByClass2 } = useStudent();

  const [createQuestionPrompt, setCreateQuestionPrompt] = useState(false);

  const myStudents = studentByClass2?.map((ms, index) => {
    return {
      value: `${ms.surname} ${ms.firstname}`,
      title: `${ms.surname} ${ms.firstname}`,
      id: Number(ms.id),
    };
  });

  ///// GET SUBJECTS BY TEACHER
  const {
    isLoading: subjectsByTeacherLoading,
    refetch: subjectsByTeacherRefetch,
    data: subjectsByTeacher,
  } = useQuery(
    [queryKeys.GET_SUBJECTS_BY_TEACHER],
    apiServices.getSubjectByTeacher,
    {
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      // enabled: permission?.read || permission?.readClass,
      enabled:
        permission?.create || permission?.created || permission?.submissions,
      onError(err) {
        errorHandler(err);
      },
      // select: apiServices.formatData,
      select: (data) => {
        const Td = apiServices.formatData(data);

        // console.log({ Td, data });

        const Td2 = Td?.map((sub, index) => {
          return {
            value: sub.subject,
            title: sub.subject,
            id: Number(sub.id),
          };
        });

        // console.log({ sd: dt, data });

        return Td2;
      },
    }
  );

  // console.log({ studentByClass2, studentByClassAndSession });

  return {
    activeTab,
    setActiveTab,
    createQ,
    setCreateQ,

    objectiveQ,
    setObjectiveQ,

    obj,
    setObj,

    theoryQ,
    setTheoryQ,

    performanceQ,
    setPerformanceQ,

    subjectsByTeacher,
    subjectsByTeacherRefetch,
    subjectsByTeacherLoading,

    createQuestionPrompt,
    setCreateQuestionPrompt,
    //
    myStudents,
    apiServices,
    errorHandler,
    permission,
    user,

    option1,
    option2,
    option3,
    option4,
    total_mark,
    theory_total_mark,
    total_question,
    question_mark,
    question_number,
    ans1,
    ans2,
    ans3,
    ans4,
    answer,
    question_type,
    question,
    subject,
    image,
    imageName,
    term,
    period,
    session,
    subject_id,
    week,

    objMark,
    setObjMark,

    answerQ,
    setAnswerQ,

    answeredObjQ,
    setAnsweredObjQ,
    answeredTheoQ,
    setAnsweredTheoQ,

    markedObjQ,
    setMarkedObjQ,

    markedTheoQ,
    setMarkedTheoQ,

    markedTheoQ2,
    setMarkedTheoQ2,

    markedQ,
    setMarkedQ,

    answeredObjResults,
    setAnsweredObjResults,
    answeredTheoryResults,
    setAnsweredTheoryResults,

    submissionTab,
    setSubmissionTab,
    ResultTab,
    setResultTab,
  };
};
