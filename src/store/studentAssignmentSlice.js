import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  assignmentTab: "1",
  answerQuestion: {
    question_type: "",
    // question: "",
    subject: "",
    // image: "",
    // imageName: "",
    term: "",
    period: "",
    session: "",
    subject_id: "",
    week: "",
    student_id: "",
  },
  studentSubjects: [],

  // OBJECTIVE
  setObjectiveQ: [],
  answeredObjectiveQ: [],
  answeredObjectiveQ2: [],
  objectiveSubmitted: false,
  // answeredObjectiveQ3: [],
  // markedObjectiveQ: [],

  // THEORY
  setTheoryQ: [],
  answeredTheoryQ: [],
  answeredTheoryQ2: [],
  theorySubmitted: false,
  // answeredTheoryQ3: [],

  // STUDENT RESULTS
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

export const studentAssignmentSlice = createSlice({
  name: "studentAssignment",
  initialState,
  reducers: {
    updateAssignmentTab: (state, action) => {
      state.assignmentTab = action.payload;
    },
    updateStudentSubjects: (state, action) => {
      state.studentSubjects = action.payload;
    },
    updateAnswerQuestion: (state, action) => {
      Object.assign(state.answerQuestion, action.payload);
    },
    resetAnswerQuestion: (state, action) => {
      state.answerQuestion = action.payload;
    },

    // OBJECTIVE REDUCERS
    updateObjectiveSubmitted: (state, action) => {
      state.objectiveSubmitted = action.payload;
    },
    //
    updateSetObjectiveQ: (state, action) => {
      state.setObjectiveQ = action.payload;
    },
    //
    addObjectiveAns: (state, action) => {
      const indexToUpdate = state.answeredObjectiveQ.findIndex(
        (item) => item.question === action.payload.question
      );
      if (indexToUpdate !== -1) {
        // If the item exists, replace it with action.payload
        state.answeredObjectiveQ[indexToUpdate] = action.payload;
      } else {
        // If the item doesn't exist, push it to the array
        state.answeredObjectiveQ.push(action.payload);
      }
    },
    resetAddObjectiveAns: (state, action) => {
      state.answeredObjectiveQ = [];
    },
    //
    loadObjectiveAns: (state, action) => {
      state.answeredObjectiveQ2 = action.payload;
    },
    resetLoadObjectiveAns: (state, action) => {
      state.answeredObjectiveQ2 = [];
    },

    // THEORY REDUCERS
    updateTheorySubmitted: (state, action) => {
      state.theorySubmitted = action.payload;
    },
    //
    updateSetTheoryQ: (state, action) => {
      state.setTheoryQ = action.payload;
    },
    //
    addTheoryAns: (state, action) => {
      // state.answeredTheoryQ = [action.payload];
      const indexToUpdate = state.answeredTheoryQ.findIndex(
        (item) => item.question === action.payload.question
      );

      if (indexToUpdate !== -1) {
        // If the item exists, replace it with action.payload
        state.answeredTheoryQ[indexToUpdate] = action.payload;
      } else {
        // If the item doesn't exist, push it to the array
        state.answeredTheoryQ.push(action.payload);
      }
    },
    resetTheoryAns: (state, action) => {
      state.answeredTheoryQ = [];
    },
    //
    loadTheoryAns: (state, action) => {
      state.answeredTheoryQ2 = action.payload;
    },
    resetLoadTheoryAns: (state, action) => {
      state.answeredTheoryQ2 = [];
    },

    // addObjectiveAns2: (state, action) => {
    //   const indexToUpdate = state.answeredObjectiveQ2.findIndex(
    //     (item) => item.question === action.payload.question
    //   );

    //   if (indexToUpdate !== -1) {
    //     // If the item exists, replace it with action.payload
    //     state.answeredObjectiveQ2[indexToUpdate] = action.payload;
    //   } else {
    //     // If the item doesn't exist, push it to the array
    //     state.answeredObjectiveQ2.push(action.payload);
    //   }
    // },

    // addObjectiveAns3: (state, action) => {
    //   const indexToUpdate = state.answeredObjectiveQ3.findIndex(
    //     (item) => item.question === action.payload.question
    //   );

    //   if (indexToUpdate !== -1) {
    //     // If the item exists, replace it with action.payload
    //     state.answeredObjectiveQ3[indexToUpdate] = action.payload;
    //   } else {
    //     // If the item doesn't exist, push it to the array
    //     state.answeredObjectiveQ3.push(action.payload);
    //   }
    // },

    // resetObjectiveAns3: (state, action) => {
    //   state.answeredObjectiveQ3 = [];
    // },

    // addTheoryAns2: (state, action) => {
    //   // state.answeredTheoryQ = [action.payload];
    //   const indexToUpdate = state.answeredTheoryQ2.findIndex(
    //     (item) => item.question === action.payload.question
    //   );

    //   if (indexToUpdate !== -1) {
    //     // If the item exists, replace it with action.payload
    //     state.answeredTheoryQ2[indexToUpdate] = action.payload;
    //   } else {
    //     // If the item doesn't exist, push it to the array
    //     state.answeredTheoryQ2.push(action.payload);
    //   }
    // },

    // resetTheoryAns2: (state, action) => {
    //   state.answeredTheoryQ2 = [];
    // },

    // addTheoryAns3: (state, action) => {
    //   // state.answeredTheoryQ = [action.payload];
    //   const indexToUpdate = state.answeredTheoryQ3.findIndex(
    //     (item) => item.question === action.payload.question
    //   );

    //   if (indexToUpdate !== -1) {
    //     // If the item exists, replace it with action.payload
    //     state.answeredTheoryQ3[indexToUpdate] = action.payload;
    //   } else {
    //     // If the item doesn't exist, push it to the array
    //     state.answeredTheoryQ3.push(action.payload);
    //   }
    // },

    // addMarkedObjectiveQ: (state, action) => {
    //   // state.answeredTheoryQ = [action.payload];
    //   const indexToUpdate = state.markedObjectiveQ.findIndex(
    //     (item) => item.question === action.payload.question
    //   );

    //   if (indexToUpdate !== -1) {
    //     // If the item exists, replace it with action.payload
    //     state.markedObjectiveQ[indexToUpdate] = action.payload;
    //   } else {
    //     // If the item doesn't exist, push it to the array
    //     state.markedObjectiveQ.push(action.payload);
    //   }
    // },

    // resetMarkedObjectiveQ: (state, action) => {
    //   state.markedObjectiveQ = [];
    // },
    // resetTheoryAns3: (state, action) => {
    //   state.answeredTheoryQ3 = [];
    // },

    // STUDENT RESULTS
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
  // addMarkedObjectiveQ,
  // resetMarkedObjectiveQ,
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
  // addObjectiveAns2,
  // addObjectiveAns3,
  // addTheoryAns2,
  // addTheoryAns3,
  // resetObjectiveAns,
  // resetObjectiveAns2,
  // resetTheoryAns2,
  // resetObjectiveAns3,
  // resetTheoryAns3,

  //  STUDENT RESULTS
  updateMarkedQuestion,
  //
  updateAnsweredObjResults,
  //
  updateAnsweredTheoryResults,
  //
} = studentAssignmentSlice.actions;

export const getAllStudentAssignment = (state) => state.studentAssignment;

export default studentAssignmentSlice.reducer;
