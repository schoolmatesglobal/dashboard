import axios from "axios";
import { backendAPI } from "../utils/constants";
import Helpers from "./helpers";

class APIServies extends Helpers {
  async login(body) {
    const { data } = await axios.post(`${backendAPI}/login`, { ...body });

    super.storeToken(data?.data?.token);

    return data;
  }

  async register(body) {
    const { data } = await axios.post(`${backendAPI}/register`, { ...body });

    super.storeToken(data?.data?.token);

    return data;
  }

  async getDesignation() {
    const { data } = await axios.get(`${backendAPI}/designation`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getRole() {
    const { data } = await axios.get(`${backendAPI}/role`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getAllClasses() {
    const { data } = await axios.get(`${backendAPI}/class`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async addClass(body) {
    const { data } = await axios.post(`${backendAPI}/class`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async updateClass({ id, ...body }) {
    const { data } = await axios.patch(`${backendAPI}/class/${id}`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async deleteClass(id) {
    const { data } = await axios.delete(`${backendAPI}/class/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getAllCampuses() {
    const { data } = await axios.get(`${backendAPI}/campus`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getCampus(id) {
    const { data } = await axios.get(`${backendAPI}/campus/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async addCampus(body) {
    const { data } = await axios.post(`${backendAPI}/campus`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async updateCampus({ id, ...body }) {
    const { data } = await axios.patch(`${backendAPI}/campus/${id}`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async deleteCampus(id) {
    const { data } = await axios.delete(`${backendAPI}/campus/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async toggleCampusStatus({ id, status }) {
    const { data } = await axios.patch(
      `${backendAPI}/${
        status === "disabled" ? "disablecampus" : "enablecampus"
      }/${id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async getAllStaffs(page) {
    const { data } = await axios.get(`${backendAPI}/staff?page=${page}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getAllStaffs2() {
    const { data } = await axios.get(`${backendAPI}/staff`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getStaffByClass(className) {
    const { data } = await axios.get(
      `${backendAPI}/staffbyclass/${className}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async getStudentPerformance(period, term, session, subject_id, student_id) {
    const { data } = await axios.get(
      `${backendAPI}/assignment/performance?period=${period}&term=${term}&session=${session}&student_id=${student_id}&subject_id=${subject_id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async getAllStudentPerformance(period, term, session, subject_id) {
    const { data } = await axios.get(
      `${backendAPI}/assignment/performance?period=${period}&term=${term}&session=${session}&subject_id=${subject_id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async addStaff(body) {
    const { data } = await axios.post(`${backendAPI}/staff`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async updateStaff({ id, ...body }) {
    const { data } = await axios.patch(`${backendAPI}/staff/${id}`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async assignClass({ id, body }) {
    const { data } = await axios.patch(
      `${backendAPI}/assignclass/${id}`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async deleteStaff(id) {
    const { data } = await axios.delete(`${backendAPI}/staff/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async disableStaff(id) {
    const { data } = await axios.patch(`${backendAPI}/disablestaff/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getStaff(id) {
    const { data } = await axios.get(`${backendAPI}/staff/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getStaffAttendance() {
    const { data } = await axios.get(`${backendAPI}/staffattendance`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async addStaffAttendance(body) {
    const { data } = await axios.post(`${backendAPI}/staffattendance`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async toggleStaffStatus({ id, status }) {
    const { data } = await axios.patch(
      `${backendAPI}/${
        status === "disabled" ? "disablestaff" : "enablestaff"
      }/${id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async enableStudentStatus({ student_id }) {
    const { data } = await axios.patch(
      `${backendAPI}/enablestudent/${student_id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }
  async disableStudentStatus({ student_id }) {
    const { data } = await axios.patch(
      `${backendAPI}/disablestudent/${student_id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async getAllStudents(page) {
    const { data } = await axios.get(`${backendAPI}/student?page=${page}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async addStudent(body) {
    const { data } = await axios.post(`${backendAPI}/student`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async updateStudent({ id, ...body }) {
    const { data } = await axios.patch(`${backendAPI}/student/${id}`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async deleteStudent(id) {
    const { data } = await axios.delete(`${backendAPI}/student/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getStudent(id) {
    const { data } = await axios.get(`${backendAPI}/student/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getStudentBySession(session) {
    const { data } = await axios.get(
      `${backendAPI}/studentsessionsearch/${session}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async getStudentByAdmissionNumber(admission_number) {
    const { data } = await axios.get(
      `${backendAPI}/admissionnumbersearch/${admission_number}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async getStudentByClass({ present_class }) {
    const { data } = await axios.get(
      `${backendAPI}/studentbyclass/${present_class}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );
    return data;
  }

  async getStudentByClass2(className) {
    const { data } = await axios.get(
      `${backendAPI}/studentbyclass/${className}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async withdrawStudent({ id }) {
    const { data } = await axios.patch(
      `${backendAPI}/withdrawstudent/${id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async acceptStudent({ id }) {
    const { data } = await axios.patch(
      `${backendAPI}/acceptstudent/${id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async getAllVehicles() {
    const { data } = await axios.get(`${backendAPI}/vehicle`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getAllVehicleMaintenance() {
    const { data } = await axios.get(`${backendAPI}/vehiclemaintenance`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async addVehicle(body) {
    const { data } = await axios.post(`${backendAPI}/vehicle`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async addVehicleLogs(body) {
    const { data } = await axios.post(`${backendAPI}/vehiclelog`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async updateVehicle({ id, ...body }) {
    const { data } = await axios.patch(`${backendAPI}/vehicle/${id}`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async deleteVehicle(id) {
    const { data } = await axios.delete(`${backendAPI}/vehicle/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getVehicle(id) {
    const { data } = await axios.get(`${backendAPI}/vehicle/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getAllVehicleLogs() {
    const { data } = await axios.get(`${backendAPI}/vehiclelog`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async addVehicleLog(body) {
    const { data } = await axios.post(`${backendAPI}/vehiclelog`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async addCodeOfConduct(body) {
    const { data } = await axios.post(`${backendAPI}/codeconduct`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getVendorList() {
    const { data } = await axios.get(`${backendAPI}/vendor`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async changePassword(body) {
    const { data } = await axios.post(`${backendAPI}/changepassword`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getAllStudentDebtors() {
    const { data } = await axios.get(`${backendAPI}/studentdebtors`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getAllStudentCreditors() {
    const { data } = await axios.get(`${backendAPI}/studentcreditors`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getAllIncomeReports(term, session) {
    const { data } = await axios.get(
      `${backendAPI}/incomereport/${term}/${session}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async getAllInvoiceReports(term, session) {
    const { data } = await axios.get(
      `${backendAPI}/invoicereport/${term}/${session}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async getAllExpenseReports(term, session) {
    const { data } = await axios.get(
      `${backendAPI}/expensesreport/${term}/${session}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async getAllDepartmentList() {
    const { data } = await axios.get(`${backendAPI}/department`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getDepartment(id) {
    const { data } = await axios.get(`${backendAPI}/department/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async deleteDepartment(id) {
    const { data } = await axios.delete(`${backendAPI}/department/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async createDepartment(body) {
    const { data } = await axios.post(`${backendAPI}/department`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async updateDepartment({ id, ...body }) {
    const { data } = await axios.patch(`${backendAPI}/department/${id}`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getAllOutstanding() {
    const { data } = await axios.get(`${backendAPI}/outstanding`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getPayment() {
    const { data } = await axios.get(`${backendAPI}/payment`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getPaymentById(paymentId) {
    const { data } = await axios.get(`${backendAPI}/payment/${paymentId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async postPayment(body) {
    const { data } = await axios.post(`${backendAPI}/payment`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async updatePayment({ id, ...body }) {
    const { data } = await axios.patch(`${backendAPI}/payment/${id}`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getAllExpectedIncome() {
    const { data } = await axios.get(`${backendAPI}/expectedincome`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getAllReceivedIncome() {
    const { data } = await axios.get(`${backendAPI}/receivedincome`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getAllGraduatedStudent() {
    const { data } = await axios.get(`${backendAPI}/graduatedstudent`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getAllDiscounts() {
    const { data } = await axios.get(`${backendAPI}/discount`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getAllExpenses() {
    const { data } = await axios.get(`${backendAPI}/totalexpense`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getAllAccountBalances() {
    const { data } = await axios.get(`${backendAPI}/accountbalance`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async updateProfile({ id, ...body }) {
    const { data } = await axios.patch(`${backendAPI}/profile/${id}`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });
    return data;
  }

  async getDressCode() {
    const { data } = await axios.get(`${backendAPI}/dresscode`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async addStudentAttendance(body) {
    const { data } = await axios.post(`${backendAPI}/studentattendance`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getStudentAttendance(date) {
    const { data } = await axios.get(`${backendAPI}/attendance/${date}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getAllSubjects() {
    const { data } = await axios.get(`${backendAPI}/subjects`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getSubject(id) {
    const { data } = await axios.get(`${backendAPI}/subjects/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async deleteSubject(id) {
    const { data } = await axios.delete(`${backendAPI}/subjects/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async updateSubject({ id, ...body }) {
    const { data } = await axios.patch(`${backendAPI}/subjects/${id}`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async addSubject(body) {
    const { data } = await axios.post(`${backendAPI}/subjects`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }
  async assignSubjectsToClass(body) {
    const { data } = await axios.post(`${backendAPI}/subjects-to-class`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async addTimetable(body) {
    const { data } = await axios.post(`${backendAPI}/timetable`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async addAcademicCalender(body) {
    const { data } = await axios.post(`${backendAPI}/academiccalender`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getAcademicCalender() {
    const { data } = await axios.get(`${backendAPI}/academiccalender`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getTimeTable() {
    const { data } = await axios.get(`${backendAPI}/timetable`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async addResult(body) {
    const { data } = await axios.post(`${backendAPI}/result`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async addMidTermResult(body) {
    const { data } = await axios.post(`${backendAPI}/midTermResult`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async addEndOfTermResult(body) {
    const { data } = await axios.post(`${backendAPI}/endTermResult`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getCummulativeScores({ student_id, term, period, session }) {
    const { data } = await axios.get(
      `${backendAPI}/cumulativescore/${student_id}/${period}/${term}/${session}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async getClassAverage({ class_name, term, student_id, session }) {
    const { data } = await axios.get(
      `${backendAPI}/student-average/${student_id}/${class_name}/${term}/${session}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async getYearlyClassAverage({ student_id, class_name, session }) {
    const { data } = await axios.get(
      `${backendAPI}/end-term-class-average/${student_id}/${class_name}/${session}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async addSubjectToStudent(body) {
    const { data } = await axios.post(`${backendAPI}/studentsubject`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getSchool() {
    const { data } = await axios.get(`${backendAPI}/school`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getSubjectByClass(className) {
    const { data } = await axios.get(`${backendAPI}/subject/${className}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });
    return data;
  }

  async getSubjectByClass2(id) {
    const { data } = await axios.get(`${backendAPI}/subjectby/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getSubjectByCampus() {
    const { data } = await axios.get(`${backendAPI}/subject`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getStudentByClassAndSession(className, session) {
    const { data } = await axios.get(
      `${backendAPI}/student/${session}/${className}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }
  async getDebtors(term, session) {
    const { data } = await axios.get(
      `${backendAPI}/debtors/${term}/${session}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async getCreditors(term, session) {
    const { data } = await axios.get(
      `${backendAPI}/creditors/${term}/${session}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async addMaxScores(body) {
    const { data } = await axios.post(`${backendAPI}/maximumscores`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getMaxScores() {
    const { data } = await axios.get(`${backendAPI}/maximumscores`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getResumptionDate() {
    const { data } = await axios.get(`${backendAPI}/closingresumption`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async postResumptionDate(body) {
    const { data } = await axios.post(`${backendAPI}/closingresumption`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getStudentResult(studentId, term, session) {
    const { data } = await axios.get(
      `${backendAPI}/midtermresult/${studentId}/${term}/${session}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }
  async getFirstAssessment(studentId, term, session) {
    const { data } = await axios.get(
      `${backendAPI}/result/firstassesment/${studentId}/${term}/${session}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }
  async getSecondAssessment(studentId, term, session) {
    const { data } = await axios.get(
      `${backendAPI}/result/secondassesment/${studentId}/${term}/${session}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async getMidTermResult(studentId, term, session) {
    const { data } = await axios.get(
      `${backendAPI}/midtermresult/${studentId}/${term}/${session}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async getStaffMidTermResult(studentId, term, session) {
    const { data } = await axios.get(
      `${backendAPI}/staff/midtermresult/${studentId}/${term}/${session}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async getClassPopulation() {
    const { data } = await axios.get(`${backendAPI}/classpopulation`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getPrincipalComments() {
    const { data } = await axios.get(`${backendAPI}/principalcomment`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getFeeList() {
    const { data } = await axios.get(`${backendAPI}/fee`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getBankList() {
    const { data } = await axios.get(`${backendAPI}/bank`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async postPrincipalComment({ body }) {
    const { data } = await axios.post(`${backendAPI}/principalcomment`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }
  async postBank({ body }) {
    const { data } = await axios.post(`${backendAPI}/bank`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async deleteBank(id) {
    const { data } = await axios.delete(`${backendAPI}/bank/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async updateBank({ id, ...body }) {
    const { data } = await axios.patch(`${backendAPI}/bank/${id}`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async postSetupDiscount({ body }) {
    const { data } = await axios.post(`${backendAPI}/setupdiscount`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }
  async postFee({ body }) {
    const { data } = await axios.post(`${backendAPI}/fee`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async deleteFee(id) {
    const { data } = await axios.delete(`${backendAPI}/fee/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async postVendor({ body }) {
    const { data } = await axios.post(`${backendAPI}/vendor`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async postExpense({ body }) {
    const { data } = await axios.post(`${backendAPI}/expenses`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async postMaintenance(body) {
    const { data } = await axios.post(
      `${backendAPI}/vehiclemaintenance`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async postInvoice({ body }) {
    const { data } = await axios.post(`${backendAPI}/invoice`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async updateInvoice({ id, ...body }) {
    const { data } = await axios.patch(`${backendAPI}/invoice/${id}`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getInvoices() {
    const { data } = await axios.get(`${backendAPI}/invoice`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async postChartAccount({ body }) {
    const { data } = await axios.post(`${backendAPI}/chartaccount`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getEndOfTermResults(student_id, term, session) {
    const { data } = await axios.get(
      `${backendAPI}/endtermresult/${student_id}/${term}/${session}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async getStaffEndOfTermResults(student_id, term, session) {
    const { data } = await axios.get(
      `${backendAPI}/staff/endtermresult/${student_id}/${term}/${session}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async getGrading() {
    const { data } = await axios.get(`${backendAPI}/grading`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getSingleGrading(id) {
    const { data } = await axios.get(`${backendAPI}/grading/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async updateGrading({ id, ...body }) {
    const { data } = await axios.patch(`${backendAPI}/grading/${id}`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async deleteGrading(id) {
    const { data } = await axios.delete(`${backendAPI}/grading/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getStudentFeeHistory() {
    const { data } = await axios.get(`${backendAPI}/studentfeehistory`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getStudentPreviousInvoice() {
    const { data } = await axios.get(`${backendAPI}/studentpreviousinvoice`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getStudentInvoice() {
    const { data } = await axios.get(`${backendAPI}/studentinvoice`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getStudentLoginDetails(page) {
    const { data } = await axios.get(
      `${backendAPI}/studentlogindetails?page=${page}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async getStaffLoginDetails(page) {
    const { data } = await axios.get(
      `${backendAPI}/stafflogindetails?page=${page}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async promoteStudent({ id, ...body }) {
    const { data } = await axios.patch(
      `${backendAPI}/promotestudent/${id}`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async transferStudent({ id, ...body }) {
    const { data } = await axios.patch(
      `${backendAPI}/transferstudent/${id}`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async importStudent(body) {
    const { data } = await axios.post(`${backendAPI}/studentimport`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async graduateStudent({ id }) {
    const { data } = await axios.patch(
      `${backendAPI}/graduatestudent/${id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async getAlumniList() {
    const { data } = await axios.get(`${backendAPI}/graduatedstudent`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getSchoolPopulation() {
    const { data } = await axios.get(`${backendAPI}/schoolpopulation`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getStudentPopulation() {
    const { data } = await axios.get(`${backendAPI}/studentpopulation`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getStaffPopulation() {
    const { data } = await axios.get(`${backendAPI}/staffpopulation`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getTeacherPopulation() {
    const { data } = await axios.get(`${backendAPI}/teacherpopulation`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getChartAccount() {
    const { data } = await axios.get(`${backendAPI}/chartaccount`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getCommunicationBook() {
    const { data } = await axios.get(`${backendAPI}/communicationbook`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getAcademicPeriod() {
    const { data } = await axios.get(`${backendAPI}/getacademicperiod`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async postAcademicPeriod(body) {
    const { data } = await axios.post(`${backendAPI}/academicperiod`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getCurrentAcademicPeriod() {
    const { data } = await axios.get(`${backendAPI}/current/academicperiod`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async postCurrentAcademicPeriod(body) {
    const { data } = await axios.post(
      `${backendAPI}/current/academicperiod`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async getAdmissionNoSettings(sch_id) {
    const { data } = await axios.get(
      `${backendAPI}/admission-number/settings/${sch_id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }
  async postAdmissionNoSettings(body) {
    const { data } = await axios.post(
      `${backendAPI}/admission-number/settings`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async postGrading(body) {
    const { data } = await axios.post(`${backendAPI}/grading`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async postTransferFund(body) {
    const { data } = await axios.post(`${backendAPI}/transferfund`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async postBusRouting(body) {
    const { data } = await axios.post(`${backendAPI}/busrouting`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async postCommunicationBook(body) {
    const { data } = await axios.post(`${backendAPI}/communicationbook`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async postHealthReport(body) {
    const { data } = await axios.post(`${backendAPI}/healthreport`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async postSkill(body) {
    const { data } = await axios.post(`${backendAPI}/skills`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }
  async postReport(body) {
    const { data } = await axios.post(`${backendAPI}/reports`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getSkills() {
    const { data } = await axios.get(`${backendAPI}/skills`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }
  async getReports() {
    const { data } = await axios.get(`${backendAPI}/reports`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getSkill(id) {
    const { data } = await axios.get(`${backendAPI}/skills/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }
  async getReport(id) {
    const { data } = await axios.get(`${backendAPI}/reports/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async deleteSkill(id) {
    const { data } = await axios.delete(`${backendAPI}/skills/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }
  async deleteReport(id) {
    const { data } = await axios.delete(`${backendAPI}/reports/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async editSkill({ id, ...body }) {
    const { data } = await axios.patch(`${backendAPI}/skills/${id}`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }
  async editReport({ id, ...body }) {
    const { data } = await axios.patch(`${backendAPI}/reports/${id}`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async postPreSchoolSubject(body) {
    const { data } = await axios.post(`${backendAPI}/preschoolsubject`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async postPreSchoolResult(body) {
    const { data } = await axios.post(`${backendAPI}/preschoolresult`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getPreSchoolSubjects(period, term, session) {
    const { data } = await axios.get(
      `${backendAPI}/preschoolsubject/${period}/${term}/${session}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async getPreSchoolCompiledResults(period, term, session) {
    const { data } = await axios.get(
      `${backendAPI}/computedresult/${period}/${term}/${session}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async getPreSchoolResults(studentId, period, term, session) {
    const { data } = await axios.get(
      `${backendAPI}/preschoolresult/${studentId}/${period}/${term}/${session}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  //
  async getPreSchoolSubjectsByClass(period, term, session, className) {
    const { data } = await axios.get(
      `${backendAPI}/preschoolsubjects/${period}/${term}/${session}/${className}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async deletePreSchoolSubjects(id) {
    const { data } = await axios.delete(
      `${backendAPI}/preschoolsubject/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async getPreSchoolSubject(id) {
    const { data } = await axios.get(`${backendAPI}/preschoolsubject/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async editPreSchoolSubject({ id, ...body }) {
    const { data } = await axios.patch(
      `${backendAPI}/preschoolsubject/${id}`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );
    return data;
  }

  async postSubjectsByPreSchool(body) {
    const { data } = await axios.post(
      `${backendAPI}/preschoolsubjectclass`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );
    return data;
  }

  async postPreSchool(body) {
    const { data } = await axios.post(`${backendAPI}/preschool`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getPreSchools() {
    const { data } = await axios.get(`${backendAPI}/preschool`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getPreSchool(id) {
    const { data } = await axios.get(`${backendAPI}/preschool/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async editPreSchool({ id, ...body }) {
    const { data } = await axios.patch(`${backendAPI}/preschool/${id}`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async deletePreSchool(id) {
    const { data } = await axios.delete(`${backendAPI}/preschool/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getAcademicSessions() {
    const { data } = await axios.get(`${backendAPI}/getacademicsessions`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getImportedStudents() {
    const { data } = await axios.get(`${backendAPI}/studentexcelimport`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getAllAssignedBus() {
    const { data } = await axios.get(`${backendAPI}/allassignedvehicle`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getAssignedBus() {
    const { data } = await axios.get(`${backendAPI}/assignedvehicle`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getAuditLogs() {
    const { data } = await axios.get(`${backendAPI}/audits`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getFunds() {
    const { data } = await axios.get(`${backendAPI}/getfunds`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async deleteFund(id) {
    const { data } = await axios.delete(`${backendAPI}/deletefund/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getFund(id) {
    const { data } = await axios.get(`${backendAPI}/getsinglefund/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async editFund({ id, ...body }) {
    const { data } = await axios.patch(`${backendAPI}/editfund/${id}`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getSubjectByTeacher() {
    const { data } = await axios.get(`${backendAPI}/teacher-subject`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getAssignment(period, term, session, question_type, week) {
    // const tempBackend =
    //   "https://earlyspringschoolportal.schoolmateglobal.com/esc/api";
    const { data } = await axios.get(
      `${backendAPI}/assignment/${period}/${term}/${session}/${question_type}/${week}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }
  async getAssessment(
    period,
    term,
    session,
    flip_class_id,
    question_type,
    week,
    subject_id
  ) {
    // const tempBackend =
    //   "https://earlyspringschoolportal.schoolmateglobal.com/esc/api";
    const { data } = await axios.get(
      `${backendAPI}/v2/flipclass/${period}/${term}/${session}/${flip_class_id}/${question_type}/${week}/${subject_id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async addObjectiveAssignment(body) {
    // const backendAPI =
    //   "https://earlyspringschoolportal.schoolmateglobal.com/esc/api";
    const { data } = await axios.post(
      `${backendAPI}/objective-assignment`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }
  async addObjectiveAssessment(body) {
    // const backendAPI =
    //   "https://earlyspringschoolportal.schoolmateglobal.com/esc/api";
    const { data } = await axios.post(
      `${backendAPI}/v2/flipclass/assessment/add-obj`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }
  async addTheoryAssignment(body) {
    // const backendAPI =
    //   "https://earlyspringschoolportal.schoolmateglobal.com/esc/api";
    const { data } = await axios.post(`${backendAPI}/theory-assignment`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }
  async addTheoryAssessment(body) {
    // const backendAPI =
    //   "https://earlyspringschoolportal.schoolmateglobal.com/esc/api";
    const { data } = await axios.post(
      `${backendAPI}/v2/flipclass/assessment/add-theory`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }
  async submitObjectiveAssignment(body) {
    // const backendAPI =
    //   "https://earlyspringschoolportal.schoolmateglobal.com/esc/api";
    const { data } = await axios.post(
      `${backendAPI}/objective-assignment-answer`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }
  async submitObjectiveAssessment(body) {
    // const backendAPI =
    //   "https://earlyspringschoolportal.schoolmateglobal.com/esc/api";
    const { data } = await axios.post(
      `${backendAPI}/objective-assignment-answer`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }
  async submitTheoryAssignment(body) {
    // const backendAPI =
    //   "https://earlyspringschoolportal.schoolmateglobal.com/esc/api";
    const { data } = await axios.post(
      `${backendAPI}/theory-assignment-answer`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }
  async submitMarkedObjectiveAssignment(body) {
    // const backendAPI =
    //   "https://earlyspringschoolportal.schoolmateglobal.com/esc/api";
    const { data } = await axios.post(
      `${backendAPI}/objective-assignment-mark`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }
  async submitMarkedTheoryAssignment(body) {
    // const backendAPI =
    //   "https://earlyspringschoolportal.schoolmateglobal.com/esc/api";
    const { data } = await axios.post(
      `${backendAPI}/theory-assignment-mark`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async editMarkedTheoryAssignment(body) {
    const { data } = await axios.patch(
      `${backendAPI}/update/theory/assignment/mark`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }
  async getSubmittedAssignment(period, term, session, question_type, week) {
    // const tempBackend =
    //   "https://earlyspringschoolportal.schoolmateglobal.com/esc/api";
    const { data } = await axios.get(
      `${backendAPI}/assignment-answer/${period}/${term}/${session}/${question_type}/${week}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }
  async getMarkedAssignment(period, term, session, question_type, week) {
    // const tempBackend =
    //   "https://earlyspringschoolportal.schoolmateglobal.com/esc/api";
    const { data } = await axios.get(
      `${backendAPI}/marked-assignment/${period}/${term}/${session}/${question_type}/${week}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }
  async getMarkedAssignmentByStudentId(
    student_id,
    period,
    term,
    session,
    question_type,
    week
  ) {
    // const tempBackend =
    //   "https://earlyspringschoolportal.schoolmateglobal.com/esc/api";
    const { data } = await axios.get(
      `${backendAPI}/marked-assignments/${student_id}/${period}/${term}/${session}/${question_type}/${week}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }
  async submitAssignmentResult(body) {
    const { data } = await axios.post(`${backendAPI}/assignment-result`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }
  async getAssignmentResult(period, term, session, question_type, week) {
    // const tempBackend =
    //   "https://earlyspringschoolportal.schoolmateglobal.com/esc/api";
    const { data } = await axios.get(
      `${backendAPI}/get-assignment-result/${period}/${term}/${session}/${question_type}/${week}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }
  async getAssignmentResultByStudentId(
    student_id,
    period,
    term,
    session,
    question_type,
    week
  ) {
    // const tempBackend =
    //   "https://earlyspringschoolportal.schoolmateglobal.com/esc/api";
    const { data } = await axios.get(
      `${backendAPI}/get-student-result/${student_id}/${period}/${term}/${session}/${question_type}/${week}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }
  async editObjectiveAssignment(body) {
    const { data } = await axios.patch(
      `${backendAPI}/edit-obj-assignment`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }
  async editObjectiveAssessment(body) {
    const { data } = await axios.patch(
      `${backendAPI}/v2/flipclass/assessment/edit-obj`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async publishAssignment(body) {
    const { data } = await axios.patch(
      `${backendAPI}/publish/assignment`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }
  async publishAssessment(body) {
    const { data } = await axios.patch(
      `${backendAPI}/v2/flipclass/assessment/publish`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async getUnPublishedAssignment(period, term, session, question_type) {
    const { data } = await axios.get(
      `${backendAPI}/assignment/unpublisheda/${period}/${term}/${session}/${question_type}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async editTheoryAssignment({ id, body }) {
    const { data } = await axios.patch(
      `${backendAPI}/edit-thoery-assignment/${id}`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async editTheoryAssessment({ id, body }) {
    const { data } = await axios.patch(
      `${backendAPI}/v2/flipclass/assessment/edit-theory`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }
  async deleteAssignment(id) {
    const { data } = await axios.delete(`${backendAPI}/assignment/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async deleteAssessment(id) {
    const { data } = await axios.delete(
      `${backendAPI}/v2/flipclass/assessment/delete/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  // async promoteStudents({ body }) {
  //   const { data } = await axios.patch(`${backendAPI}/promote-students`, body, {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${super.getToken()}`,
  //     },
  //   });

  //   return data;
  // }

  async promoteStudents({ ...body }) {
    const { data } = await axios.patch(`${backendAPI}/promote-students`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async addDirectorOfStudies(body) {
    const { data } = await axios.post(`${backendAPI}/add-dos`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getDirectorOfStudies() {
    const { data } = await axios.get(`${backendAPI}/dos`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async addActivities(body) {
    const { data } = await axios.post(`${backendAPI}/extra-curricular`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getActivities() {
    const { data } = await axios.get(`${backendAPI}/extra-curricular`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async deleteActivities(id) {
    const { data } = await axios.delete(
      `${backendAPI}/delete-extra-curricular/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async addPreActivities(body) {
    const { data } = await axios.post(
      `${backendAPI}/preschoolcurricular`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async getPreActivities() {
    const { data } = await axios.get(`${backendAPI}/preschoolcurricular`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async deletePreActivities(id) {
    const { data } = await axios.delete(
      `${backendAPI}/delete-preschoolcurricular/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async getBroadSheetResults(class_name, term, session) {
    const { data } = await axios.get(
      `${backendAPI}/broadsheet/${class_name}/${term}/${session}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async addCbtSetup(body) {
    const { data } = await axios.post(`${backendAPI}/v2/cbt/setup`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getCbtSetup(period, term, session, subject_id, question_type) {
    const { data } = await axios.get(
      `${backendAPI}/v2/cbt/setup/${period}/${term}/${session}/${subject_id}/${question_type}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async addCbtQuestion(body) {
    const { data } = await axios.post(
      `${backendAPI}/v2/cbt/add/question`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async getAllCbtQuestion(period, term, session, subject_id, question_type) {
    const { data } = await axios.get(
      `${backendAPI}/v2/cbt/questions/${period}/${term}/${session}/${subject_id}/${question_type}/get`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async editCbtQuestion({ id, body }) {
    const { data } = await axios.patch(
      `${backendAPI}/v2/cbt/update/question/${id}`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );
    return data;
  }

  async deleteCbtQuestion(id) {
    const { data } = await axios.delete(
      `${backendAPI}/v2/cbt/delete/question/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async submitCbtQuestion(body) {
    // const backendAPI =
    //   "https://earlyspringschoolportal.schoolmateglobal.com/esc/api";
    const { data } = await axios.post(`${backendAPI}/v2/cbt/answer/add`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async publishCbt(body) {
    const { data } = await axios.patch(`${backendAPI}/v2/cbt/publish`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getAllCbtAnswer(period, term, session, subject_id, question_type) {
    const { data } = await axios.get(
      `${backendAPI}/v2/cbt/answer/${period}/${term}/${session}/${question_type}/${subject_id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async getCbtAnswerByStudentId(
    student_id,
    period,
    term,
    session,
    question_type,
    subject_id
  ) {
    // const tempBackend =
    //   "https://earlyspringschoolportal.schoolmateglobal.com/esc/api";
    const { data } = await axios.get(
      `${backendAPI}/v2/cbt/${period}/${term}/${session}/${question_type}/${subject_id}/${student_id}/student`,

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async addCbtResult(body) {
    const { data } = await axios.post(`${backendAPI}/v2/cbt/result/add`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }

  async getCbtResultByStudentId(
    student_id,
    period,
    term,
    session,
    question_type,
    subject_id
  ) {
    // const tempBackend =
    //   "https://earlyspringschoolportal.schoolmateglobal.com/esc/api";
    const { data } = await axios.get(
      `${backendAPI}/v2/cbt/result/${student_id}/${period}/${term}/${session}/${question_type}/${subject_id}`,

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async getCbtPerformance(period, term, session, student_id, subject_id) {
    // const tempBackend =
    //   "https://earlyspringschoolportal.schoolmateglobal.com/esc/api";
    const { data } = await axios.get(
      `${backendAPI}/v2/cbt/performance?period=${period}&term=${term}&session=${session}&student_id=${student_id}&subject_id=${subject_id}`,

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async getAllCbtPerformance(period, term, session, subject_id) {
    // const tempBackend =
    //   "https://earlyspringschoolportal.schoolmateglobal.com/esc/api";
    const { data } = await axios.get(
      `${backendAPI}/v2/cbt/performance?period=${period}&term=${term}&session=${session}&subject_id=${subject_id}`,

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async addLessonNote(body) {
    const { data } = await axios.post(`${backendAPI}/v2/lessonnote/add`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });
    return data;
  }

  async getLessonNoteByClass(class_id, subject_id, week, term, session) {
    const { data } = await axios.get(
      `${backendAPI}/v2/lessonnote/${class_id}/${subject_id}/${week}/${term}/${session}`,

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async deleteLessonNote(id) {
    const { data } = await axios.delete(
      `${backendAPI}/v2/lessonnote/remove/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async editLessonNote({ id, body }) {
    const { data } = await axios.patch(
      `${backendAPI}/v2/lessonnote/edit/${id}`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );
    return data;
  }

  async approveLessonNote({ id }) {
    const { data } = await axios.patch(
      `${backendAPI}/v2/lessonnote/approve/${id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );
    return data;
  }

  async unApproveLessonNote({ id }) {
    const { data } = await axios.patch(
      `${backendAPI}/v2/lessonnote/unapprove/${id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );
    return data;
  }

  async addFlipClass(body) {
    const { data } = await axios.post(`${backendAPI}/v2/flipclass/add`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });
    return data;
  }

  async getFlipClassByClass(class_id, subject_id, week, term, session) {
    const { data } = await axios.get(
      `${backendAPI}/v2/flipclass/${class_id}/${subject_id}/${week}/${term}/${session}`,

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async deleteFlipClass(id) {
    const { data } = await axios.delete(
      `${backendAPI}/v2/flipclass/remove/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async editLFlipClass({ id, body }) {
    const { data } = await axios.patch(
      `${backendAPI}/v2/flipclass/edit/${id}`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );
    return data;
  }

  async approveLFlipClass({ id }) {
    const { data } = await axios.patch(
      `${backendAPI}/v2/flipclass/approve/${id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );
    return data;
  }

  async unApproveLFlipClass({ id }) {
    const { data } = await axios.patch(
      `${backendAPI}/v2/flipclass/unapprove/${id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );
    return data;
  }

  async addCommunicationBook(body) {
    const { data } = await axios.post(
      `${backendAPI}/v2/communicationbook`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );
    return data;
  }

  async getCommunicationBookByClass(class_id) {
    const { data } = await axios.get(
      `${backendAPI}/v2/communicationbook/${class_id}`,

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async getClosedCommunicationBookByClass(class_id) {
    const { data } = await axios.get(
      `${backendAPI}/v2/communicationbook/closed/${class_id}`,

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async editCommunicationBook({ id, body }) {
    const { data } = await axios.patch(
      `${backendAPI}/v2/communicationbook/edit/${id}`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );
    return data;
  }

  async closeCommunicationBook({ id }) {
    const { data } = await axios.patch(
      `${backendAPI}/v2/communicationbook/close/${id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );
    return data;
  }

  async addCommunicationBookReplies({ communication_book_id, body }) {
    const { data } = await axios.post(
      `${backendAPI}/v2/communicationbook/${communication_book_id}/replies`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );
    return data;
  }

  async getCommunicationBookReplies(communication_book_id) {
    const { data } = await axios.get(
      `${backendAPI}/v2/communicationbook/replies/${communication_book_id}`,

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async getUnreadCommunicationBookCount() {
    const { data } = await axios.get(
      `${backendAPI}/v2/communicationbook/unread/count`,

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async deleteCommunicationBookReplies(id) {
    const { data } = await axios.delete(
      `${backendAPI}/v2/communicationbook/reply/delete/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async editCommunicationBookReplies({ id, body }) {
    const { data } = await axios.patch(
      `${backendAPI}/v2/communicationbook/reply/edit/${id}`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );
    return data;
  }

  async releaseResult(body) {
    const { data } = await axios.patch(`${backendAPI}/release/result`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });
    return data;
  }

  async withholdResult(body) {
    const { data } = await axios.patch(`${backendAPI}/withhold/result`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });
    return data;
  }

  async addGpa(body) {
    const { data } = await axios.post(`${backendAPI}/gpa`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });
    return data;
  }

  async getAllGpa() {
    const { data } = await axios.get(
      `${backendAPI}/gpa`,

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async getGpa(id) {
    const { data } = await axios.get(
      `${backendAPI}/gpa/${id}`,

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${super.getToken()}`,
        },
      }
    );

    return data;
  }

  async updateGpa({ id, body }) {
    const { data } = await axios.patch(`${backendAPI}/gpa/${id}`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });
    return data;
  }
  async deleteGpa(id) {
    const { data } = await axios.delete(`${backendAPI}/gpa/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${super.getToken()}`,
      },
    });

    return data;
  }
}

export default APIServies;
