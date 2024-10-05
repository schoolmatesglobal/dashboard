import { useState } from "react";
import { useQuery } from "react-query";
import queryKeys from "../utils/queryKeys";
import { useAppContext } from "./useAppContext";

import { useStudent } from "./useStudent";

import useLocalStorage from "use-local-storage";
import { useFile } from "./useFile";

export const useFlipClass = () => {
  const { apiServices, errorHandler, permission, user } =
    useAppContext("flip-class");

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
  const [iframeUrl, setIframeUrl] = useState(null);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [base64String, setBase64String] = useState("");

  const [createN, setCreateN] = useState({
    term: "",
    period: "",
    session: "",
    week: "",
    class_name: `${permission?.approve ? "" : user?.class_assigned}`,
    class_id: "",
    subject_id: "",
    status: "UnApproved",
    topic: "",
    description: "",
    videoUrl: "",
    file: "",
    file_name: "",
    submitted_by: `${user?.firstname} ${user?.surname}`,
    date_submitted: "",
    date_approved: "",
  });

  const handleReset = () => {
    setFile(null);
    setFileName("");
    setError("");
    document.getElementById("fileInput").value = null;
    setBase64String("");
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

  const handleViewFile = (url) => {
    if (url) {
      // const url = URL.createObjectURL(file);
      window.open(url, "_blank");
      // URL.revokeObjectURL(url);
    }
  };
  // const handleViewFile = (file) => {
  //   if (file) {
  //     const url = URL.createObjectURL(file);
  //     window.open(url, "_blank");
  //     URL.revokeObjectURL(url);
  //   }
  // };

  const handleViewFile2 = (file) => {
    if (file) {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      const url = URL.createObjectURL(file);
      // console.log({ fileExtension });

      if (fileExtension === "pdf") {
        window.open(url, "_blank");
        // Delay the revocation to ensure the URL is fully opened in the new tab
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);
      } else if (fileExtension === "doc" || fileExtension === "docx") {
        const reader = new FileReader();
        reader.onload = () => {
          const base64Data = reader.result.split(",")[1];
          const blob = new Blob(
            [
              new Uint8Array(
                atob(base64Data)
                  .split("")
                  .map((char) => char.charCodeAt(0))
              ),
            ],
            { type: "application/octet-stream" }
          );
          const docUrl = URL.createObjectURL(blob);
          const viewerUrl = `https://docs.google.com/viewerng/viewer?url=${encodeURIComponent(
            docUrl
          )}&embedded=true`;
          window.open(viewerUrl, "_blank");
          // Delay the revocation to ensure the URL is fully opened in the new tab
          setTimeout(() => {
            URL.revokeObjectURL(docUrl);
          }, 1000);
        };
        reader.readAsDataURL(file);
      } else {
        alert("Unsupported file type for viewing");
      }
    }
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    const validTypes = [
      "application/pdf",
      // "application/msword",
      // "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (selectedFile) {
      if (!validTypes.includes(selectedFile.type)) {
        setError("Please upload a PDF file.");
        // setError("Please upload a PDF or DOC file.");
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

      setFile(selectedFile);
      setFileName(selectedFile.name);
      const docData = await apiServices?.convertBase64(selectedFile);
      setBase64String(docData);
      setError("");
    }
  };

  const handleFileUpdate = async (url) => {
    try {
      // Fetch the file from the URL
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Convert the response to a Blob
      const blob = await response.blob();

      // Convert the Blob to a Base64 string
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(",")[1]; // Remove the prefix "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,"
        setBase64String(base64);
      };
      reader.readAsDataURL(blob); // This will trigger the onloadend event
    } catch (error) {
      console.error("Error fetching or converting the file:", error);
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

  // console.log({ user });

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
    handleViewFile,
    selectedDocs,
    setSelectedDocs,

    base64String,
    setBase64String,
  };
};
