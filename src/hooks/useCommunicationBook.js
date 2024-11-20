import { useState } from "react";
import { useQuery } from "react-query";
import queryKeys from "../utils/queryKeys";
import { useAppContext } from "./useAppContext";

import { useStudent } from "./useStudent";

import useLocalStorage from "use-local-storage";
import { useLocation } from "react-router-dom";
import { useAuthDetails } from "../stores/authDetails";

export const useCommunicationBook = () => {
  const { userDetails, setUserDetails } = useAuthDetails();

  const { state } = useLocation();

  const [activeTab, setActiveTab] = useState("1");
  const [submissionTab, setSubmissionTab] = useState("1");
  const [ResultTab, setResultTab] = useState("1");

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
  const [classSelected, setClassSelected] = useState(
    state?.classSelected || ""
  );

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
  const [selectedStudent, setSelectedStudent] = useState({
    student_id: "",
    student: "",
    title: "",
    message: "",
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
  const [messages, setMessages] = useState([]);

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
    useAppContext("communication-book");

  const { studentByClass2 } = useStudent();

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [iframeUrl, setIframeUrl] = useState(null);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [base64String, setBase64String] = useState("");

  const [className, setClassName] = useState("");

  const handleReset = () => {
    setFile(null);
    setFileName("");
    setError("");
    document.getElementById("fileInput").value = null;
    setBase64String("");
  };

  // const handleViewFile = (url) => {
  //   if (url) {
  //     // const url = URL.createObjectURL(file);
  //     window.open(url, "_blank");
  //     // URL.revokeObjectURL(url);
  //   }
  // };
  const handleViewFile = () => {
    if (file) {
      const url = URL.createObjectURL(file);
      window.open(url, "_blank");
      URL.revokeObjectURL(url);
    }
  };

  const handleViewFile2 = (url) => {
    if (url) {
      // const url = URL.createObjectURL(file);
      window.open(url, "_blank");
      // URL.revokeObjectURL(url);
    }
  };

  const [createQuestionPrompt, setCreateQuestionPrompt] = useState(false);
  const [createSettingsPrompt, setCreateSettingsPrompt] = useState(false);

  const myStudents = studentByClass2?.map((ms, index) => {
    return {
      value: `${ms.surname} ${ms.firstname}`,
      title: `${ms.surname} ${ms.firstname}`,
      id: Number(ms.id),
    };
  });

  const classValue = () => {
    if (
      user?.designation_name === "Teacher" ||
      user?.designation_name === "Student"
    ) {
      return user?.class_assigned || "";
    } else if (
      user?.department === "Admin" ||
      user?.designation_name === "Principal"
    ) {
      return classSelected || "";
    }
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/bmp",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      // Add more image types if needed
    ];

    if (selectedFile) {
      if (!validTypes.includes(selectedFile.type)) {
        setError(
          "Please upload an file (JPEG, PNG, GIF, BMP, WEBP, PDF, DOC)."
        );
        setFile(null);
        setFileName("");
        document.getElementById("fileInput").value = null;
        return;
      }

      if (selectedFile.size > 1024 * 1024) {
        // 1MB size limit
        setError("File size should be less than 1MB.");
        setFile(null);
        setFileName("");
        document.getElementById("fileInput").value = null;
        return;
      }

      setFile(selectedFile);
      setFileName(selectedFile.name);
      const imageData = await apiServices?.convertBase64(selectedFile);
      setBase64String(imageData);
      setError("");
    }
  };

  // console.log({ userDetails });

  ///// GET STUDENT BY CLASS
  const {
    data: studentByClass,
    isLoading: studentByClassLoading,
    refetch: refetchStudentByClass,
    isRefetching: isRefetchingStudentByClass,
  } = useQuery(
    [queryKeys.GET_ALL_STUDENTS_BY_CLASS_CBT],
    () => apiServices.getStudentByClass2(classValue()),

    {
      // enabled: false,
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!className && !!classValue(),
      // enabled: permission?.myStudents || user?.designation_name === "Principal",
      // select: apiServices.formatData,
      select: (data) => {
        // console.log({ pdata: data, state });
        return (
          apiServices.formatData(data)?.map((obj, index) => {
            const newObj = { ...obj };
            newObj.new_id = index + 1;
            return newObj;
          }) ?? []
        );

        // return { ...data, options: f };
      },
      onError(err) {
        errorHandler(err);
      },
    }
  );

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

  // console.log({ classValue: classValue() });

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

    createSettingsPrompt,
    setCreateSettingsPrompt,
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

    studentByClass,
    refetchStudentByClass,
    isRefetchingStudentByClass,
    studentByClassLoading,
    selectedStudent,
    setSelectedStudent,
    classValue,

    classSelected,
    setClassSelected,

    file,
    setFile,
    fileName,
    setFileName,
    error,
    setError,
    handleFileChange,
    handleReset,
    // handleDownload,
    handleViewFile,
    handleViewFile2,
    base64String,
    setBase64String,

    messages,
    setMessages,

    className,
    setClassName,
    academicPeriod: {
      period: userDetails?.period,
      term: userDetails?.term,
      session: userDetails?.session,
      campus: userDetails?.campus,
      sch_id: userDetails?.sch_id,
    },
    // academicPeriodLoading,
  };
};
