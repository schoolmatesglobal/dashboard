import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTab: "1",
  classSubjects: [],

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
  //
  ObjectiveQuestions: [],
  //
  TheoryQuestions: [],
  //
  checkObjectiveQuestions: [],
  //
  checkTheoryQuestions: [],

  // CREATED
  createdQuestion: {
    question_type: "",
    question: "",
    subject: "",
    image: "",
    // imageName: "",
    term: "",
    period: "",
    session: "",
    subject_id: "",
    week: "",
  },
  //
  ObjectiveQ: [],
  //
  TheoryQ: [],

  // SUBMISSION STATE
  answeredQuestion: {
    question_type: "",
    question: "",
    subject: "",
    image: "",
    student: "",
    student_id: "",
    term: "",
    period: "",
    session: "",
    subject_id: "",
    week: "",
  },
  //
  answeredObjectiveQ: [],
  answeredTheoryQ: [],
  //
  markedObjectiveQ: [],
  markedTheoryQ: [],
  //
  markedObjectiveQ2: [],
  markedTheoryQ2: [],
  //
  objectiveMarked: false,
  theoryMarked: false,

  // RESULTS STATE
  markedQuestion: {
    question_type: "",
    question: "",
    subject: "",
    image: "",
    student: "",
    student_id: "",
    term: "",
    period: "",
    session: "",
    subject_id: "",
    week: "",
  },
  //
  answeredObjResults: [],
  answeredTheoryResults: [],
};

export const teacherAssignmentSlice = createSlice({
  name: "teacherAssignment",
  initialState,
  reducers: {
    updateActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    updateClassSubjects: (state, action) => {
      state.classSubjects = action.payload;
    },

    // updatePreviewAnswer: (state, action) => {
    //   state.previewAnswer = action.payload;
    // },

    // CREATE
    updateCreateQuestion: (state, action) => {
      Object.assign(state.createQuestion, action.payload);
    },
    emptyCreateQuestion: (state, action) => {
      state.createQuestion = {
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        ans1: false,
        ans2: false,
        ans3: false,
        ans4: false,
        answer: "",
        // total_marks: 0,
        // total_questions: 0,
        question_mark: 0,
        // theoryAns: "",
        questionsType: "",
        question: "",
        subject: "",
        imageUrl: "",
      };
    },
    //
    updateCheckObjectiveQuestion: (state, action) => {
      state.checkObjectiveQuestions = action.payload;
    },
    updateObjectiveQuestion: (state, action) => {
      state.ObjectiveQuestions = action.payload;
    },
    addObjectiveQuestion: (state, action) => {
      state.ObjectiveQuestions.push(action.payload);
    },
    editObjectiveQuestion: (state, action) => {
      const indexToEdit = state.ObjectiveQuestions.findIndex(
        (item) => item.question_number === action.payload.number
      );

      if (indexToEdit !== -1) {
        // If the item exists, replace it with action.payload
        Object.assign(
          state.ObjectiveQuestions[indexToEdit],
          action.payload.change
        );
      }
    },
    deleteObjectiveQuestion: (state, action) => {
      const indexToDelete = state.ObjectiveQuestions.findIndex(
        (item) => item.question_number === action.payload.number
      );

      if (indexToDelete !== -1) {
        // If the item exists, replace it with action.payload
        state.ObjectiveQuestions.splice(indexToDelete, 1);
        // state.TheoryQuestions[indexToUpdate].question = action.payload.change;
      }
      // else {
      //   // If the item doesn't exist, push it to the array
      //   state.markedObjectiveQ.push(action.payload);
      // }
    },
    emptyObjectiveQuestions: (state, action) => {
      state.ObjectiveQuestions = [];
    },
    updateObjectiveQuestionsMark: (state, action) => {
      for (let i = 0; i < state.ObjectiveQuestions.length; i++) {
        state.ObjectiveQuestions[i].question_mark = action.payload.newValue;
      }
    },
    updateObjectiveTotalQuestion: (state, action) => {
      for (let i = 0; i < state.ObjectiveQuestions.length; i++) {
        state.ObjectiveQuestions[i].total_question = action.payload.newValue;
      }
    },
    //
    updateCheckTheoryQuestion: (state, action) => {
      state.checkTheoryQuestions = action.payload;
    },
    addTheoryQuestion: (state, action) => {
      state.TheoryQuestions.push(action.payload);
    },
    editTheoryQuestion: (state, action) => {
      const indexToEdit = state.TheoryQuestions.findIndex(
        (item) => item.question_number === action.payload.number
      );

      if (indexToEdit !== -1) {
        // If the item exists, replace it with action.payload
        Object.assign(
          state.TheoryQuestions[indexToEdit],
          action.payload.change
        );
      }
    },
    deleteTheoryQuestion: (state, action) => {
      const indexToDelete = state.TheoryQuestions.findIndex(
        (item) => item.question_number === action.payload.number
      );

      if (indexToDelete !== -1) {
        // If the item exists, replace it with action.payload
        state.TheoryQuestions.splice(indexToDelete, 1);
        // state.TheoryQuestions[indexToUpdate].question = action.payload.change;
      }
      // else {
      //   // If the item doesn't exist, push it to the array
      //   state.markedObjectiveQ.push(action.payload);
      // }
    },
    emptyTheoryQuestions: (state, action) => {
      state.TheoryQuestions = [];
    },
    updateTheoryTotalQuestion: (state, action) => {
      for (let i = 0; i < state.TheoryQuestions.length; i++) {
        state.TheoryQuestions[i].total_question = action.payload.newValue;
      }
    },
    //

    // CREATED
    updateCreatedQuestion: (state, action) => {
      Object.assign(state.createdQuestion, action.payload);
    },
    //
    updateObjectiveQ: (state, action) => {
      state.ObjectiveQ = action.payload;
    },
    emptyObjectiveQ: (state, action) => {
      state.ObjectiveQ = [];
    },
    //
    updateTheoryQ: (state, action) => {
      state.TheoryQ = action.payload;
    },
    emptyTheoryQ: (state, action) => {
      state.TheoryQ = [];
    },

    // updateSubmittedQuestion: (state, action) => {
    //   Object.assign(state.submittedQuestion, action.payload);
    // },

    // addObjectiveQuestion2: (state, action) => {
    //   state.ObjectiveQuestions2.push(action.payload);
    // },
    // addTheoryQuestion2: (state, action) => {
    //   state.TheoryQuestions2.push(action.payload);
    // },

    // SUBMISSION REDUCERS
    updateAnsweredQuestion: (state, action) => {
      Object.assign(state.answeredQuestion, action.payload);
    },
    //
    updateAnsweredObjectiveQ: (state, action) => {
      state.answeredObjectiveQ = action.payload;
    },
    emptyAnsweredObjectiveQ: (state, action) => {
      state.answeredObjectiveQ = [];
    },
    //
    updateAnsweredTheoryQ: (state, action) => {
      state.answeredTheoryQ = action.payload;
    },
    emptyAnsweredTheoryQ: (state, action) => {
      state.answeredTheoryQ = [];
    },
    //
    addObjectiveMark: (state, action) => {
      const indexToUpdate = state.markedObjectiveQ.findIndex(
        (item) => item.question === action.payload.question
      );

      if (indexToUpdate !== -1) {
        // If the item exists, replace it with action.payload
        state.markedObjectiveQ[indexToUpdate] = action.payload;
      } else {
        // If the item doesn't exist, push it to the array
        state.markedObjectiveQ.push(action.payload);
      }
    },
    resetObjectiveMark: (state, action) => {
      state.markedObjectiveQ = [];
    },
    //
    addTheoryMark: (state, action) => {
      // state.answeredTheoryQ = [action.payload];
      const indexToUpdate = state.markedTheoryQ.findIndex(
        (item) => item.question === action.payload.question
      );

      if (indexToUpdate !== -1) {
        // If the item exists, replace it with action.payload
        state.markedTheoryQ[indexToUpdate] = action.payload;
      } else {
        // If the item doesn't exist, push it to the array
        state.markedTheoryQ.push(action.payload);
      }
    },
    resetTheoryMark: (state, action) => {
      state.markedTheoryQ = [];
    },
    //
    loadMarkedObjectiveAns: (state, action) => {
      state.markedObjectiveQ2 = action.payload;
    },
    resetMarkedObjectiveAns: (state, action) => {
      state.markedObjectiveQ2 = [];
    },
    //
    loadMarkedTheoryAns: (state, action) => {
      state.markedTheoryQ2 = action.payload;
    },
    resetMarkedTheoryAns: (state, action) => {
      state.markedTheoryQ2 = [];
    },
    //
    updateObjectiveMarked: (state, action) => {
      state.objectiveMarked = action.payload;
    },
    updateTheoryMarked: (state, action) => {
      state.theoryMarked = action.payload;
    },

    // RESULTS
    updateMarkedQuestion: (state, action) => {
      Object.assign(state.markedQuestion, action.payload);
    },
    //
    updateAnsweredObjResults: (state, action) => {
      state.answeredObjResults = action.payload;
    },
    //
    updateAnsweredTheoryResults: (state, action) => {
      state.answeredTheoryResults = action.payload;
    },
  },
});

export const {
  // addCreateQuestion,
  // updateSubmittedQuestion,

  updateActiveTab,
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

  // addObjectiveQuestion2,
  // addTheoryQuestion2,

  // updatePreviewAnswer,
  // emptyCreatedQuestions,
  // updateSubmissionValues,
  // emptySubmissionValues,

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
} = teacherAssignmentSlice.actions;

export const getAllTeacherDetails = (state) => state.teacherAssignment;

export default teacherAssignmentSlice.reducer;
