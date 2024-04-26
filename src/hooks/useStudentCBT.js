import { useState } from "react";
import { useQuery } from "react-query";
import queryKeys from "../utils/queryKeys";
import { useAppContext } from "./useAppContext";
import { useSubject } from "./useSubjects";

export const useStudentCBT = () => {
  const {
    isOpen: sideBarIsOpen,
    toggle: toggleSideBar,
    closeSidebar,
    openSidebar,
    close,
    hideAllBars,
    setHideAllBars,
  } = useAppContext();

  const { subjects, isLoading: subjectLoading } = useSubject();

  const [objectiveQ2, setObjectiveQ2] = useState([]);
  const [theoryQ2, setTheoryQ2] = useState([]);
  const [answeredObjectiveQ, setAnsweredObjectiveQ] = useState([]);
  const [answeredObjectiveQ2, setAnsweredObjectiveQ2] = useState([]);
  const [answeredTheoryQ, setAnsweredTheoryQ] = useState([]);
  const [assignmentTab, setAssignmentTab] = useState("1");
  const [ResultTab, setResultTab] = useState("2");
  const [objectiveSubmitted, setObjectiveSubmitted] = useState(false);
  const [theorySubmitted, setTheorySubmitted] = useState(false);
  const [answerQuestion, setAnswerQuestion] = useState({
    question_type: "",
    subject: "",

    term: "",
    period: "",
    session: "",
    subject_id: "",
    week: "",
    student_id: "",
  });

  const [createQ2, setCreateQ2] = useState({
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
    question_type: "",
    question: "",
    instruction: "",
    subject: "",
    image: "",
    imageName: "",
    term: "",
    period: "",
    session: "",
    subject_id: "",
    week: "",
    hour: null,
    minute: null,
    settings_id: "",
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [showWarning, setShowWarning] = useState(true);
  const [testEnded, setTestEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [secondleft, setSecondLeft] = useState(null);
  const [hourLeft, setHourLeft] = useState(null);
  const [day, setDay] = useState(0);
  const [hour, setHour] = useState(3);
  const [minute, setMinute] = useState(30);

  const { apiServices, errorHandler, permission, user } = useAppContext("cbt");

  const className = user?.present_class;

  /////GET SUBJECTS BY STUDENT ///////
  const {
    isLoading: studentSubjectsLoading,
    refetch: refetchStudentSubjectsLoading,
    data: studentSubjects,
  } = useQuery(
    [queryKeys.GET_SUBJECTS_BY_STUDENT],
    () => apiServices.getSubjectByClass(className),
    {
      retry: 3,
      // enabled: permission?.read || permission?.readClass,
      enabled: permission?.view || permission?.results,
      // enabled: true,
      select: (data) => {
        // const ssg = apiServices.formatData(data);
        const ssg = data?.data[0]?.attributes?.subject;

        const sortSubjects = ssg?.map((sub, index) => {
          return {
            value: sub.name,
            title: sub.name,
            id: Number(sub.id),
          };
        });
        console.log({ ssg, data, sortSubjects });
        return sortSubjects ?? [];
      },
      // onSuccess(data) {
      //   const sortSubjects = data.map((sub, index) => {
      //     return {
      //       value: sub.subject,
      //       title: sub.subject,
      //       id: Number(sub.id),
      //     };
      //   });
      //   // updateStudentSubjectsFxn(sortSubjects);
      // },
      onError(err) {
        errorHandler(err);
      },
      // select: apiServices.formatData,
    }
  );

  return {
    apiServices,
    permission,
    user,
    errorHandler,

    subjects,

    objectiveQ2,
    setObjectiveQ2,
    theoryQ2,
    setTheoryQ2,
    createQ2,
    setCreateQ2,

    studentSubjectsLoading,
    refetchStudentSubjectsLoading,
    studentSubjects,

    assignmentTab,
    setAssignmentTab,

    answeredObjectiveQ,
    setAnsweredObjectiveQ,

    answeredTheoryQ,
    setAnsweredTheoryQ,

    objectiveSubmitted,
    setObjectiveSubmitted,

    answerQuestion,
    setAnswerQuestion,

    theorySubmitted,
    setTheorySubmitted,

    ResultTab,
    setResultTab,

    toggleSideBar,
    closeSidebar,

    isPlaying,
    setIsPlaying,
    showWarning,
    setShowWarning,
    testEnded,
    setTestEnded,
    timeLeft,
    setTimeLeft,
    secondleft,
    setSecondLeft,
    hourLeft,
    setHourLeft,
    day,
    hour,
    minute,
    setDay,
    setHour,
    setMinute,
  };
};
