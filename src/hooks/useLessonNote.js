import { useState } from "react";
import { useQuery } from "react-query";
import queryKeys from "../utils/queryKeys";
import { useAppContext } from "./useAppContext";

import { useStudent } from "./useStudent";

import useLocalStorage from "use-local-storage";
import { useFile } from "./useFile";

export const useLessonNote = () => {
  const { apiServices, errorHandler, permission, user } =
    useAppContext("lesson-note");

  const [activeTab, setActiveTab] = useState("1");
  const [submissionTab, setSubmissionTab] = useState("2");
  const [ResultTab, setResultTab] = useState("2");

  const [obj, setObj] = useLocalStorage("obj", []);

  const [lessonNotes, setLessonNotes] = useState([]);
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

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const [createN, setCreateN] = useState({
    term: user?.term,
    period: user?.period,
    session: user?.session,
    week: "",
    class_name: `${permission?.approve ? "" : user?.class_assigned}`,
    submitted_by: `${user?.firstname} ${user?.surname}`,
    subject_id: "",
    status: "UnApproved",
    topic: "",
    description: "",
    file: "",
    file_name: "",
  });

  const handleReset = () => {
    setFile(null);
    setFileName("");
    setError("");
    document.getElementById("fileInput").value = null;
  };

  const handleDownload = () => {
    if (file) {
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (selectedFile) {
      if (!validTypes.includes(selectedFile.type)) {
        setError("Please upload a PDF or DOC file.");
        setFile(null);
        setFileName("");
        document.getElementById("fileInput").value = null;
        return;
      }

      if (selectedFile.size > 1024 * 1024) {
        setError("File size should be less than 1MB.");
        setFile(null);
        setFileName("");
        document.getElementById("fileInput").value = null;
        return;
      }

      // setCreateN((prev) => {
      //   return { ...prev, file: selectedFile, file_name: selectedFile.name };
      // });
      setFile(selectedFile);
      setFileName(selectedFile.name);

      setError("");
    }
  };

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
      retry: 3,
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

  console.log({ user });

  // console.log({ studentByClass2, studentByClassAndSession });

  return {
    user,
    createN,
    setCreateN,
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

    file,
    setFile,
    fileName,
    setFileName,
    error,
    setError,
    handleFileChange,
    handleReset,
    lessonNotes,
    setLessonNotes,
    handleDownload,
  };
};
