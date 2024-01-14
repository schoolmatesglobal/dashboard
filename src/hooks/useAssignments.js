import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import queryKeys from "../utils/queryKeys";
import { useAppContext } from "./useAppContext";
import {
  addQuestionMarks,
  updateQuestionNumbers,
  updateObjectiveTotals,
  sortQuestionsByNumber,
} from "../pages/dashboard/assignments/constant";

import { useStudent } from "./useStudent";
import { useForm } from "react-formid";

const useAssignments = () => {
  const { apiServices, errorHandler, permission, user } =
    useAppContext("assignments");

  const { studentByClassAndSession } = useStudent();

  const [createQuestionPrompt, setCreateQuestionPrompt] = useState(false);
  const [menuTab, setMenuTab] = useState("1");

  const myStudents = studentByClassAndSession?.map((ms, index) => {
    return {
      value: `${ms.surname} ${ms.firstname}`,
      title: `${ms.surname} ${ms.firstname}`,
      id: Number(ms.id),
    };
  });

  const {
    getFieldProps,
    inputs,
    setFieldValue,
    handleSubmit,
    errors,
    setInputs,
    reset,
  } = useForm({
    defaultValues: {
      // CREATE
      createQuestion: {
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
      },
    },
    validation: {
      //   class_name: {
      //     required: (val) => !!val || "Class name is required",
      //   },
    },
  });

  return {
    menuTab,
    setMenuTab,
    permission,
    apiServices,
    user,
    myStudents,
    getFieldProps,
    inputs,
    setFieldValue,
    handleSubmit,
    errors,
    setInputs,
    reset,
  };
};

export default useAssignments;
