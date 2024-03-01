import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import queryKeys from "../utils/queryKeys";
import { useAppContext } from "./useAppContext";
import { useDispatch, useSelector } from "react-redux";
import {
  addQuestionMarks,
  updateQuestionNumbers,
  sortQuestionsByNumber,
} from "../pages/dashboard/assignments/constant";
import {
  getAllTeacherDetails,
  //
  updateActiveTab,
  //
  updateClassSubjects,

  // CREATE
  updateCheckObjectiveQuestion,
  //
  updateCheckTheoryQuestion,
  //
  updateCreateQuestion,
  emptyCreateQuestion,
  //
  updateObjectiveQuestion,
  addObjectiveQuestion,
  editObjectiveQuestion,
  deleteObjectiveQuestion,
  emptyObjectiveQuestions,
  updateObjectiveQuestionsMark,
  updateObjectiveTotalQuestion,
  //
  addTheoryQuestion,
  editTheoryQuestion,
  deleteTheoryQuestion,
  emptyTheoryQuestions,
  updateTheoryTotalQuestion,

  // CREATED
  updateCreatedQuestion,
  //
  updateObjectiveQ,
  emptyObjectiveQ,
  //
  updateTheoryQ,
  emptyTheoryQ,

  // SUBMISSIONS
  updateAnsweredQuestion,
  //
  updateAnsweredObjectiveQ,
  emptyAnsweredObjectiveQ,
  //
  updateAnsweredTheoryQ,
  emptyAnsweredTheoryQ,
  //
  addObjectiveMark,
  resetObjectiveMark,
  //
  addTheoryMark,
  resetTheoryMark,
  //
  loadMarkedObjectiveAns,
  resetMarkedObjectiveAns,
  //
  loadMarkedTheoryAns,
  resetMarkedTheoryAns,
  //
  updateObjectiveMarked,
  updateTheoryMarked,

  // RESULTS
  updateMarkedQuestion,
  //
  updateAnsweredObjResults,
  //
  updateAnsweredTheoryResults,
  //
} from "../store/teacherAssignmentSlice";

import { useStudent } from "./useStudent";

export const useAssignments = () => {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("1");

  const [objectiveQ, setObjectiveQ] = useState([]);
  const [theoryQ, setTheoryQ] = useState([]);

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

  const {
    // activeTab,
    classSubjects,

    // CREATE
    createQuestion,
    ObjectiveQuestions,
    TheoryQuestions,
    checkObjectiveQuestions,
    checkTheoryQuestions,

    // CREATED
    createdQuestion,
    TheoryQ,
    ObjectiveQ,

    // SUBMISSION
    answeredQuestion,
    answeredObjectiveQ,
    answeredTheoryQ,
    markedObjectiveQ,
    markedObjectiveQ2,
    markedTheoryQ,
    markedTheoryQ2,
    objectiveMarked,
    theoryMarked,

    // RESULTS
    markedQuestion,
    answeredObjResults,
    answeredTheoryResults,
  } = useSelector(getAllTeacherDetails);

  const { apiServices, errorHandler, permission, user } =
    useAppContext("assignments");

  const { studentByClassAndSession } = useStudent();

  const [createQuestionPrompt, setCreateQuestionPrompt] = useState(false);

  const myStudents = studentByClassAndSession?.map((ms, index) => {
    return {
      value: `${ms.surname} ${ms.firstname}`,
      title: `${ms.surname} ${ms.firstname}`,
      id: Number(ms.id),
    };
  });

  ///// TEACHERS ACTIONS /////

  const updateActiveTabFxn = (payload) => {
    dispatch(updateActiveTab(payload));
  };
  //

  // CREATE FUNCTIONS
  const updateCheckObjectiveQuestionFxn = (payload) => {
    dispatch(updateCheckObjectiveQuestion(payload));
  };
  const updateCheckTheoryQuestionFxn = (payload) => {
    dispatch(updateCheckTheoryQuestion(payload));
  };

  //
  const updateCreateQuestionFxn = (payload) => {
    dispatch(updateCreateQuestion(payload));
  };
  const emptyCreateQuestionFxn = () => {
    dispatch(emptyCreateQuestion());
  };
  //
  const updateObjectiveQuestionFxn = (payload) => {
    dispatch(updateObjectiveQuestion(payload));
  };
  const addObjectiveQuestionFxn = (payload) => {
    dispatch(addObjectiveQuestion(payload));
  };
  const editObjectiveQuestionFxn = (payload) => {
    dispatch(editObjectiveQuestion(payload));
  };
  const deleteObjectiveQuestionFxn = (payload) => {
    dispatch(deleteObjectiveQuestion(payload));
  };
  const emptyObjectiveQuestionsFxn = () => {
    dispatch(emptyObjectiveQuestions());
  };
  const updateObjectiveQuestionsMarkFxn = (payload) => {
    dispatch(updateObjectiveQuestionsMark(payload));
  };
  const updateObjectiveTotalQuestionFxn = (payload) => {
    dispatch(updateObjectiveTotalQuestion(payload));
  };

  //
  const addTheoryQuestionFxn = (payload) => {
    dispatch(addTheoryQuestion(payload));
  };
  const editTheoryQuestionFxn = (payload) => {
    dispatch(editTheoryQuestion(payload));
  };
  const deleteTheoryQuestionFxn = (payload) => {
    dispatch(deleteTheoryQuestion(payload));
  };
  const emptyTheoryQuestionsFxn = () => {
    dispatch(emptyTheoryQuestions());
  };
  const updateTheoryTotalQuestionFxn = (payload) => {
    dispatch(updateTheoryTotalQuestion(payload));
  };
  //
  /////// POST OBJECTIVE ASSIGNMENT ////
  const {
    mutateAsync: addObjectiveAssignments,
    isLoading: addObjectAssignmentLoading,
  } = useMutation(
    () => apiServices.addObjectiveAssignment(finalObjectiveArray),
    {
      onSuccess() {
        queryClient.invalidateQueries(
          queryKeys.GET_ASSIGNMENT,
          user?.period,
          user?.term,
          user?.session,
          createdQuestion?.question_type
        );
        refetchAssignmentCreated();
        toast.success("Objective assignment has been created successfully");
      },
      onError(err) {
        apiServices.errorHandler(err);
      },
    }
  );
  /////// POST THEORY ASSIGNMENT //////
  const {
    mutateAsync: addTheoryAssignments,
    isLoading: addTheoryAssignmentLoading,
  } = useMutation(() => apiServices.addTheoryAssignment(finalTheoryArray), {
    onSuccess() {
      queryClient.invalidateQueries(
        queryKeys.GET_ASSIGNMENT,
        user?.period,
        user?.term,
        user?.session,
        createdQuestion?.question_type
      );
      refetchAssignmentCreated();
      toast.success("Theory assignment has been created successfully");
    },
    onError(err) {
      apiServices.errorHandler(err);
    },
  });

  // CREATED FUNCTIONS
  const updateCreatedQuestionFxn = (payload) => {
    dispatch(updateCreatedQuestion(payload));
  };
  //
  const updateObjectiveQFxn = (payload) => {
    dispatch(updateObjectiveQ(payload));
  };
  const emptyObjectiveQFxn = () => {
    dispatch(emptyObjectiveQ());
  };
  //
  const updateTheoryQFxn = (payload) => {
    dispatch(updateTheoryQ(payload));
  };
  const emptyTheoryQFxn = () => {
    dispatch(emptyTheoryQ());
  };
  // CREATED PAGE
  const activateRetrieveCreated = () => {
    if (
      createdQuestion?.subject !== "" &&
      createdQuestion?.question_type !== "" &&
      createdQuestion?.week !== ""
    ) {
      return true;
    } else {
      return false;
    }
  };
  //// FETCH ASSIGNMENTS CREATED /////////
  const {
    isLoading: assignmentLoadingCreated,
    refetch: refetchAssignmentCreated,
  } = useQuery(
    [
      queryKeys.GET_ASSIGNMENT,
      user?.period,
      user?.term,
      user?.session,
      createdQuestion?.question_type,
      "created",
    ],
    () =>
      apiServices.getAssignment(
        user?.period,
        user?.term,
        user?.session,
        createdQuestion?.question_type
      ),
    {
      retry: 3,
      refetchOnMount: true,
      staleTime: 0,
      // refetchOnWindowFocus: "always",
      // refetchInterval: 500,
      refetchIntervalInBackground: true,
      // enabled: permission?.read || permission?.readClass,
      enabled: activateRetrieveCreated() && permission?.created,
      onSuccess(data) {
        emptyObjectiveQFxn();
        emptyTheoryQFxn();
        const sortData = () => {
          const sortedData = data?.filter(
            (dt) => Number(dt?.subject_id) === createdQuestion?.subject_id
          );
          const sortedData2 = sortedData?.filter(
            (dt) => Number(dt?.week) === Number(createdQuestion?.week)
          );
          const sortedByQN = sortQuestionsByNumber(sortedData2);

          return sortedByQN;
        };
        // const sortedData = data?.filter(
        //   (dt) => Number(dt?.subject_id) === subject_id
        // );
        // const sortedData2 = sortedData?.filter(
        //   (dt) => Number(dt?.week) === Number(week)
        // );
        // const sortedByQN = sortQuestionsByNumber(sortedData2);
        // console.log({ data, subject_id });
        if (createdQuestion?.question_type === "objective") {
          // setShowNoMessage(false);
          updateObjectiveQFxn(sortData());
        } else if (createdQuestion?.question_type === "theory") {
          // setShowNoMessage(false);
          updateTheoryQFxn(sortData());
        }
      },
      onError(err) {
        errorHandler(err);
      },
      select: apiServices.formatData,
    }
  );

  // SUBMISSIONS FUNCTIONS
  const updateAnsweredQuestionFxn = (payload) => {
    dispatch(updateAnsweredQuestion(payload));
  };
  //
  const updateAnsweredObjectiveQFxn = (payload) => {
    dispatch(updateAnsweredObjectiveQ(payload));
  };
  const emptyAnsweredObjectiveQFxn = () => {
    dispatch(emptyAnsweredObjectiveQ());
  };
  //
  const updateAnsweredTheoryQFxn = (payload) => {
    dispatch(updateAnsweredTheoryQ(payload));
  };
  const emptyAnsweredTheoryQFxn = () => {
    dispatch(emptyAnsweredTheoryQ());
  };
  //
  const addObjectiveMarkFxn = (payload) => {
    dispatch(addObjectiveMark(payload));
  };
  const resetObjectiveMarkFxn = () => {
    dispatch(resetObjectiveMark());
  };
  //
  const addTheoryMarkFxn = (payload) => {
    dispatch(addTheoryMark(payload));
  };
  const resetTheoryMarkFxn = () => {
    dispatch(resetTheoryMark());
  };
  //
  const loadMarkedObjectiveAnsFxn = (payload) => {
    dispatch(loadMarkedObjectiveAns(payload));
  };
  const resetMarkedObjectiveAnsFxn = () => {
    dispatch(resetMarkedObjectiveAns());
  };
  //
  const loadMarkedTheoryAnsFxn = (payload) => {
    dispatch(loadMarkedTheoryAns(payload));
  };
  const resetMarkedTheoryAnsFxn = () => {
    dispatch(resetMarkedTheoryAns());
  };
  //
  const updateObjectiveMarkedFxn = (payload) => {
    dispatch(updateObjectiveMarked(payload));
  };
  const updateTheoryMarkedFxn = (payload) => {
    dispatch(updateTheoryMarked(payload));
  };
  //

  //  RESULTS FUNCTIONS
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
      // onSuccess(data) {
      //   console.log({ Tdata: data });
      //   const sortSubjects = data.map((sub, index) => {
      //     return {
      //       value: sub.subject,
      //       title: sub.subject,
      //       id: Number(sub.id),
      //     };
      //   });
      //   // dispatch(updateClassSubjects(sortSubjects));
      // },
      onError(err) {
        errorHandler(err);
      },
      // select: apiServices.formatData,
      select: (data) => {
        const dt = apiServices.formatData(data);

        // console.log({ sd: dt, data });

        return dt;
      },
    }
  );

  // const totalMark = addQuestionMarks(TheoryQuestions);

  // const finalTheoryArray = updateQuestionNumbers(totalMark);

  // const questionMark = updateQuestionNumbers(ObjectiveQuestions);

  // const finalObjectiveArray = updateObjectiveTotals(questionMark);

  const totalMark = addQuestionMarks(TheoryQuestions);

  // const finalTheoryArray = updateQuestionNumbers(totalMark);

  // const finalObjectiveArray = updateQuestionNumbers(ObjectiveQuestions);
  const finalObjectiveArray =
    ObjectiveQuestions.length !== 1
      ? updateQuestionNumbers(ObjectiveQuestions)
      : ObjectiveQuestions.length === 1
      ? ObjectiveQuestions
      : [];

  const finalTheoryArray =
    TheoryQuestions.length !== 1
      ? updateQuestionNumbers(TheoryQuestions)
      : TheoryQuestions.length === 1
      ? TheoryQuestions
      : [];

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

  //// POST MARKED THEORY ASSIGNMENT ///////
  const {
    mutateAsync: submitMarkedTheoryAssignment,
    isLoading: submitMarkedTheoryAssignmentLoading,
  } = useMutation(
    () => apiServices.submitMarkedTheoryAssignment(markedTheoryQ),
    {
      onSuccess() {
        // queryClient.invalidateQueries(
        //   queryKeys.GET_ASSIGNMENT,
        //   user?.period,
        //   user?.term,
        //   user?.session,
        //   question_type
        // );
        toast.success("Theory assignment has been marked successfully");
      },
      onError(err) {
        apiServices.errorHandler(err);
      },
    }
  );

  // POST MARKED OBJECTIVE ASSIGNMENT ////
  const {
    mutateAsync: submitMarkedObjectiveAssignment,
    isLoading: submitMarkedObjectiveAssignmentLoading,
  } = useMutation(
    () => apiServices.submitMarkedObjectiveAssignment(markedObjectiveQ),
    {
      onSuccess() {
        // queryClient.invalidateQueries(
        //   queryKeys.GET_ASSIGNMENT,
        //   user?.period,
        //   user?.term,
        //   user?.session,
        //   question_type
        // );
        toast.success("Objective assignment has been marked successfully");
      },
      onError(err) {
        apiServices.errorHandler(err);
      },
    }
  );

  // const displayPrompt = (status) => {
  //   setPromptStatus(status);
  //   setLoginPrompt(true);
  // };

  // const isLoading = assignmentLoading || addObjectAssignmentLoading;

  // console.log({ classSubjects });

  // console.log({
  //   finalTheoryArray,
  //   finalObjectiveArray,
  // });

  return {
    activeTab,
    setActiveTab,
    createQ,
    setCreateQ,

    objectiveQ,
    theoryQ,
    setObjectiveQ,
    setTheoryQ,
    // isLoading,
    // assignment,
    subjectsByTeacher,
    subjectsByTeacherLoading,

    // QUERIES
    submitMarkedObjectiveAssignment,
    submitMarkedObjectiveAssignmentLoading,
    //
    submitMarkedTheoryAssignment,
    submitMarkedTheoryAssignmentLoading,
    //
    addObjectiveAssignments,
    addObjectAssignmentLoading,
    //
    addTheoryAssignments,
    addTheoryAssignmentLoading,
    //

    updateActiveTabFxn,
    // activeTab,
    createQuestionPrompt,
    setCreateQuestionPrompt,
    //
    myStudents,
    classSubjects,
    apiServices,
    errorHandler,
    permission,
    user,
    //
    // submittedQuestion,

    // CREATE
    updateCheckObjectiveQuestionFxn,
    updateCheckTheoryQuestionFxn,
    checkObjectiveQuestions,
    checkTheoryQuestions,
    //
    updateCreateQuestionFxn,
    emptyCreateQuestionFxn,
    createQuestion,
    //
    updateObjectiveQuestionFxn,
    addObjectiveQuestionFxn,
    editObjectiveQuestionFxn,
    deleteObjectiveQuestionFxn,
    emptyObjectiveQuestionsFxn,
    updateObjectiveQuestionsMarkFxn,
    updateObjectiveTotalQuestionFxn,
    ObjectiveQuestions,
    //
    addTheoryQuestionFxn,
    editTheoryQuestionFxn,
    deleteTheoryQuestionFxn,
    emptyTheoryQuestionsFxn,
    updateTheoryTotalQuestionFxn,
    TheoryQuestions,
    //

    // CREATED
    updateCreatedQuestionFxn,
    createdQuestion,
    //
    updateObjectiveQFxn,
    emptyObjectiveQFxn,
    ObjectiveQ,
    //
    updateTheoryQFxn,
    emptyTheoryQFxn,
    TheoryQ,
    //
    assignmentLoadingCreated,
    refetchAssignmentCreated,

    // updateSubmittedQuestionFxn,

    // previewAnswer,
    // sorted,
    // setSorted,

    // updatePreviewAnswerFxn,

    // sortBy,
    // setSortBy,
    // indexStatus,
    // setIndexStatus,
    // questionType,
    // subjects,
    // handleSortBy,

    // createdQuestions,

    // SUBMISSION
    updateAnsweredQuestionFxn,

    //
    updateAnsweredObjectiveQFxn,
    emptyAnsweredObjectiveQFxn,
    //
    updateAnsweredTheoryQFxn,
    emptyAnsweredTheoryQFxn,
    //
    addObjectiveMarkFxn,
    resetObjectiveMarkFxn,
    //
    addTheoryMarkFxn,
    resetTheoryMarkFxn,
    //
    loadMarkedObjectiveAnsFxn,
    resetMarkedObjectiveAnsFxn,
    //
    loadMarkedTheoryAnsFxn,
    resetMarkedTheoryAnsFxn,
    //
    updateTheoryMarkedFxn,
    updateObjectiveMarkedFxn,
    //
    answeredQuestion,
    answeredObjectiveQ,
    answeredTheoryQ,
    markedObjectiveQ,
    markedObjectiveQ2,
    markedTheoryQ,
    markedTheoryQ2,
    objectiveMarked,
    theoryMarked,

    // RESULTS
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
  };
};
