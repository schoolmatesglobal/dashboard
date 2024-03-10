import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import queryKeys from "../utils/queryKeys";
import { useAppContext } from "./useAppContext";
import { useDispatch, useSelector } from "react-redux";

import {
  updateAssignmentTab,
  //
  updateStudentSubjects,
  //
  updateAnswerQuestion,
  resetAnswerQuestion,

  // OBJECTIVE
  updateObjectiveSubmitted,
  //
  updateSetObjectiveQ,
  //
  addObjectiveAns,
  resetAddObjectiveAns,
  //
  loadObjectiveAns,
  resetLoadObjectiveAns,

  // THEORY
  updateTheorySubmitted,
  //
  updateSetTheoryQ,
  //
  addTheoryAns,
  resetTheoryAns,
  //
  loadTheoryAns,
  resetLoadTheoryAns,
  //

  // RESULTS
  updateMarkedQuestion,
  //
  updateAnsweredObjResults,
  //
  updateAnsweredTheoryResults,
  getAllStudentAssignment,
  //
} from "../store/studentAssignmentSlice";

export const useStudentAssignments = () => {
  const dispatch = useDispatch();
  const {
    // assignmentTab,
    answerQuestion,
    // studentSubjects,
    // answeredObjectiveQ3,
    // answeredTheoryQ3,
    // answeredQ,
    // markedObjectiveQ,

    // OBJECTIVE
    // setObjectiveQ,
    answeredObjectiveQ,
    answeredObjectiveQ2,
    objectiveSubmitted,

    // THEORY
    // setTheoryQ,
    answeredTheoryQ,
    answeredTheoryQ2,
    theorySubmitted,

    // STUDENT RESULT
    markedQuestion,
    answeredObjResults,
    answeredTheoryResults,
  } = useSelector(getAllStudentAssignment);

  const [objectiveQ2, setObjectiveQ2] = useState([]);
  const [theoryQ2, setTheoryQ2] = useState([]);
  const [assignmentTab, setAssignmentTab] = useState('1');
  // const [studentSubjects, setStudentSubjects] = useState([]);

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

  const [assignment, setAssignment] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const { apiServices, errorHandler, permission, user } =
    useAppContext("assignments");

  const {
    option1,
    option2,
    option3,
    option4,
    ans1,
    ans2,
    ans3,
    ans4,
    answer,
    // theoryAns,
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
  } = answerQuestion;

  const student = `${user?.surname} ${user?.firstname}`;

  //// STUDENTS ACTIONS ///////

  const updateAssignmentTabFxn = (payload) => {
    dispatch(updateAssignmentTab(payload));
  };
  //
  const updateStudentSubjectsFxn = (payload) => {
    dispatch(updateStudentSubjects(payload));
  };
  //
  const updateAnswerQuestionFxn = (payload) => {
    dispatch(updateAnswerQuestion(payload));
  };
  const resetAnswerQuestionFxn = (payload) => {
    dispatch(resetAnswerQuestion(payload));
  };

  // OBJECTIVE
  const updateObjectiveSubmittedFxn = (payload) => {
    dispatch(updateObjectiveSubmitted(payload));
  };
  //
  const updateSetObjectiveQFxn = (payload) => {
    dispatch(updateSetObjectiveQ(payload));
  };
  //
  const addObjectiveAnsFxn = (payload) => {
    dispatch(addObjectiveAns(payload));
  };
  const resetAddObjectiveAnsFxn = () => {
    dispatch(resetAddObjectiveAns());
  };
  //
  const loadObjectiveAnsFxn = (payload) => {
    dispatch(loadObjectiveAns(payload));
  };
  const resetLoadObjectiveAnsFxn = () => {
    dispatch(resetLoadObjectiveAns());
  };
  //

  // THEORY
  const updateTheorySubmittedFxn = (payload) => {
    dispatch(updateTheorySubmitted(payload));
  };
  //
  const updateSetTheoryQFxn = (payload) => {
    dispatch(updateSetTheoryQ(payload));
  };
  //
  const addTheoryAnsFxn = (payload) => {
    dispatch(addTheoryAns(payload));
  };
  const resetTheoryAnsFxn = () => {
    dispatch(resetTheoryAns());
  };
  //
  const loadTheoryAnsFxn = (payload) => {
    dispatch(loadTheoryAns(payload));
  };
  const resetLoadTheoryAnsFxn = () => {
    dispatch(resetLoadTheoryAns());
  };

  // STUDENT RESULT FUNCTION
  const updateMarkedQuestionFxn = (payload) => {
    dispatch(updateMarkedQuestion(payload));
  };
  //
  const updateAnsweredObjResultsFxn = (payload) => {
    dispatch(updateAnsweredObjResults(payload));
  };
  //
  const updateAnsweredTheoryResultsFxn = (payload) => {
    dispatch(updateAnsweredTheoryResults(payload));
  };

  const queryClient = useQueryClient();

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
            // id: Number(sub.id),
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

  //// SUBMIT OBJECTIVE ASSIGNMENT ////
  const {
    mutateAsync: submitObjectiveAssignment,
    isLoading: submitObjectiveAssignmentLoading,
  } = useMutation(
    () => apiServices.submitObjectiveAssignment(answeredObjectiveQ),
    {
      onSuccess() {
        // queryClient.invalidateQueries(
        //   queryKeys.GET_ASSIGNMENT,
        //   user?.period,
        //   user?.term,
        //   user?.session,
        //   question_type
        // );
        toast.success("Objective assignment has been submitted successfully");
      },
      onError(err) {
        apiServices.errorHandler(err);
      },
    }
  );

  //// SUBMIT THEORY ASSIGNMENT ////
  const {
    mutateAsync: submitTheoryAssignment,
    isLoading: submitTheoryAssignmentLoading,
  } = useMutation(() => apiServices.submitTheoryAssignment(answeredTheoryQ), {
    onSuccess() {
      // queryClient.invalidateQueries(
      //   queryKeys.GET_ASSIGNMENT,
      //   user?.period,
      //   user?.term,
      //   user?.session,
      //   question_type
      // );
      toast.success("Theory assignment has been submitted successfully");
    },
    onError(err) {
      apiServices.errorHandler(err);
    },
  });

  const activateRetrieve = () => {
    if (subject !== "" && week !== "") {
      return true;
    } else {
      return false;
    }
  };

  /////// FETCH ANSWERED OBJECTIVE ASSIGNMENTS/////
  const {
    isLoading: answeredObjAssignmentLoading,
    refetch: refetchObjAnsweredAssignment,
  } = useQuery(
    [
      queryKeys.GET_SUBMITTED_ASSIGNMENT_STUDENT,
      user?.period,
      user?.term,
      user?.session,
      "objective",
    ],
    () =>
      apiServices.getSubmittedAssignment(
        user?.period,
        user?.term,
        user?.session,
        "objective"
      ),
    {
      retry: 3,
      // enabled: permission?.read || permission?.readClass,
      enabled: permission?.view && permission?.student_results,
      // enabled: false,
      onSuccess(data) {
        // resetLoadObjectiveAnsFxn();
        // resetAddObjectiveAnsFxn();
        const sortedBySubject = data?.filter(
          (dt) => Number(dt?.subject_id) === subject_id
        );
        const sortByStudent = sortedBySubject?.filter(
          (st) => st?.student === student
        );
        const sortByStudent2 = sortByStudent?.filter((st) => st?.week === week);

        // console.log({ obj: sortByStudent });
        // console.log({ student, sortByStudent2, data });

        if (sortByStudent2.length > 0) {
          // resetLoadObjectiveAnsFxn();
          updateObjectiveSubmittedFxn(true);
          loadObjectiveAnsFxn(sortByStudent2);
        } else if (sortByStudent2.length === 0) {
          // resetLoadObjectiveAnsFxn();
          updateObjectiveSubmittedFxn(false);
        }

        // // const sortByStudent = sortedData
        // // console.log({ sortByStudent });
        // if (question_type === "objective") {
        //   updateAnsweredObjectiveQFxn(sortByStudent);
        // } else if (question_type === "theory") {
        //   updateAnsweredTheoryQFxn(sortByStudent);
        // }
      },
      onError(err) {
        errorHandler(err);
      },
      select: apiServices.formatData,
    }
  );
  /////// FETCH ANSWERED THEORY ASSIGNMENTS /////
  const {
    isLoading: answeredTheoryAssignmentLoading,
    refetch: refetchTheoryAnsweredAssignment,
  } = useQuery(
    [
      queryKeys.GET_SUBMITTED_ASSIGNMENT_STUDENT,
      user?.period,
      user?.term,
      user?.session,
      "theory",
    ],
    () =>
      apiServices.getSubmittedAssignment(
        user?.period,
        user?.term,
        user?.session,
        "theory"
      ),
    {
      retry: 3,
      // enabled: permission?.read || permission?.readClass,
      enabled: permission?.view && permission?.student_results,
      // enabled: false,
      onSuccess(data) {
        // resetLoadTheoryAnsFxn();
        // resetTheoryAnsFxn();
        const sortedBySubject = data?.filter(
          (dt) => Number(dt?.subject_id) === subject_id
        );
        const sortByStudent = sortedBySubject?.filter(
          (st) => st?.student === student
        );
        const sortByStudent2 = sortByStudent?.filter((st) => st?.week === week);
        // console.log({ theory: sortByStudent });

        if (sortByStudent2.length > 0) {
          // resetLoadTheoryAnsFxn();
          updateTheorySubmittedFxn(true);
          loadTheoryAnsFxn(sortByStudent2);
        } else if (sortByStudent.length === 0) {
          // resetLoadTheoryAnsFxn();
          updateTheorySubmittedFxn(false);
        }
      },
      onError(err) {
        errorHandler(err);
      },
      select: apiServices.formatData,
    }
  );

  //// POST MARKED OBJECTIVE ASSIGNMENT ////
  // const {
  //   mutateAsync: submitMarkedObjectiveAssignment,
  //   isLoading: submitMarkedObjectiveAssignmentLoading,
  // } = useMutation(
  //   () => apiServices.submitMarkedObjectiveAssignment(markedObjectiveQ),
  //   // () => apiServices.submitMarkedObjectiveAssignment(),
  //   {
  //     onSuccess() {
  //       // queryClient.invalidateQueries(
  //       //   queryKeys.GET_ASSIGNMENT,
  //       //   user?.period,
  //       //   user?.term,
  //       //   user?.session,
  //       //   question_type
  //       // );
  //       toast.success("Objective assignment has been marked successfully");
  //     },
  //     onError(err) {
  //       apiServices.errorHandler(err);
  //     },
  //   }
  // );

  const questionType = [
    {
      label: "Objective",
      value: "Objective",
    },

    {
      label: "Theory",
      value: "Theory",
    },
  ];

  // const handleSortBy = ({ target: { value } }) => {
  //   setSortBy(value);
  // };

  // const isLoading = assignmentLoading || addObjectAssignmentLoading;

  // console.log({ user });

  return {
    // markedObjectiveQ,
    // addMarkedObjectiveQFxn,
    // resetMarkedObjectiveQFxn,
    // submitMarkedObjectiveAssignment,
    // submitMarkedObjectiveAssignmentLoading,
    apiServices,
    permission,
    user,
    errorHandler,
    // studentSubjects,
    //
   
    updateAssignmentTabFxn,
    //
    answerQuestion,
    updateAnswerQuestionFxn,
    resetAnswerQuestionFxn,

    // OBJECTIVE
    //
    objectiveSubmitted,
    updateObjectiveSubmittedFxn,
    //
    // setObjectiveQ,
    updateSetObjectiveQFxn,
    //
    answeredObjectiveQ,
    addObjectiveAnsFxn,
    resetAddObjectiveAnsFxn,
    //
    answeredObjectiveQ2,
    loadObjectiveAnsFxn,
    resetLoadObjectiveAnsFxn,
    //
    submitObjectiveAssignment,
    submitObjectiveAssignmentLoading,
    //
    answeredObjAssignmentLoading,
    refetchObjAnsweredAssignment,
    //

    // THEORY
    //
    theorySubmitted,
    updateTheorySubmittedFxn,
    //
    // setTheoryQ,
    updateSetTheoryQFxn,
    //
    answeredTheoryQ,
    addTheoryAnsFxn,
    resetTheoryAnsFxn,
    //
    answeredTheoryQ2,
    loadTheoryAnsFxn,
    resetLoadTheoryAnsFxn,
    //
    submitTheoryAssignment,
    submitTheoryAssignmentLoading,
    //
    answeredTheoryAssignmentLoading,
    refetchTheoryAnsweredAssignment,
    //

    // answeredObjectiveQ3,
    // answeredTheoryQ3,

    // addTheoryAnsFxn2,
    // addObjectiveAnsFxn2,
    // addTheoryAnsFxn3,
    // addObjectiveAnsFxn3,

    // answeredQ,

    // resetObjectiveAnsFxn,
    // resetObjectiveAnsFxn2,
    // resetTheoryAnsFxn2,
    // resetObjectiveAnsFxn3,
    // resetTheoryAnsFxn3,

    // STUDENTS RESULT
    updateMarkedQuestionFxn,
    //
    updateAnsweredObjResultsFxn,
    //
    updateAnsweredTheoryResultsFxn,
    //
    markedQuestion,
    //
    answeredObjResults,
    //
    answeredTheoryResults,
    //

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
  };
};
