import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import validator from "validator";
import { isValidPhoneNumber } from "react-phone-number-input";
import queryKeys from "../utils/queryKeys";
import { useAppContext } from "./useAppContext";
import { useForm } from "react-formid";
import { useFile } from "./useFile";
import { useState } from "react";
import ProfileImage from "../components/common/profile-image";
import Numeral from "react-numeral";
import { useLocation } from "react-router-dom";

export const useStudent = () => {
  // const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const { apiServices, errorHandler, permission, user } =
    useAppContext("students");
  const [sortedStudents, setSortedStudents] = useState([]);
  const [admSetupPrompt, setAdmSetupPrompt] = useState(false);
  const [loadedGen, setLoadedGen] = useState(false);
  const [sorted, setSorted] = useState(false);
  const [indexStatus, setIndexStatus] = useState(
    permission?.read ? "all" : "myStudents"
  );
  const [loading1, setLoading1] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [session, setSession] = useState("");
  const [principalClassName, setPrincipalClassName] = useState("");
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [classes, setClasses] = useState({ present_class: "", sub_class: "" });
  const [sortBy, setSortBy] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const {
    handleImageChange,
    filePreview,
    base64String,
    reset: resetFile,
    fileRef,
  } = useFile();

  const isEdit = !!id;

  const {
    getFieldProps,
    inputs,
    setFieldValue,
    handleSubmit,
    errors,
    setInputs,
    handleChange,
    reset: resetForm,
  } = useForm({
    defaultValues: {
      surname: "",
      firstname: "",
      middlename: "",
      admission_number: "",
      genotype: "",
      blood_group: "A+",
      gender: "",
      dob: "",
      nationality: "Nigeria",
      state: "",
      session_admitted: "",
      class: "",
      present_class: "",
      sub_class: "",
      image: "",
      home_address: "",
      phone_number: "",
      email_address: "",
      // file: null,
      campus: "",
    },
    validation: {
      surname: { required: true },
      firstname: { required: true },
      middlename: { required: true },
      // admission_number: { required: true },
      // genotype: { required: true },
      // blood_group: { required: true },
      gender: { required: true },
      dob: { required: true },
      // nationality: { required: true },
      // state: { required: true },
      session_admitted: { required: true },
      class: { required: true },
      present_class: { required: true },
      // home_address: { required: true },
      phone_number: {
        // required: (val) => !!val || "Phone number is required",
        // isValid: (val) =>
        //   (typeof val === "string" && isValidPhoneNumber(val)) ||
        //   "Phone number is invalid",
      },
      email_address: {
        required: (val) => !!val || "Email address is required",
        isValid: (val) => validator.isEmail(val) || "Email address is invalid",
      },
      campus: { required: true },
    },
  });

  const {
    inputs: inputs2,
    setFieldValue: setFieldValue2,
    getFieldProps: getFieldProps2,
    handleSubmit: handleSubmit2,
    errors: errors2,
    setInputs: setInputs2,
  } = useForm({
    defaultValues: {
      generate_number: false,
      admission_initial: "",
    },
    validation: {
      admission_initial: { required: true },
    },
  });

  const reset = () => {
    resetFile();
    resetForm();
  };

  function trigger(time) {
    setLoading1(true);
    setTimeout(() => {
      setLoading1(false);
    }, time);
  }

  const handleSortBy = ({ target: { value } }) => {
    setSortBy(value);
  };

  const {
    isLoading: studentListLoading,
    data: students,
    refetch: refetchStudents,
  } = useQuery(
    [queryKeys.GET_ALL_STUDENTS, page],
    () => apiServices.getAllStudents(page),
    {
      enabled: permission?.read || false,
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      onError(err) {
        errorHandler(err);
      },
      select: (data) => {
        // console.log({ std: data });

        const format = apiServices.formatData(data)?.map((student, i) => {
          return {
            ...student,
            new_id: i + 1,
            image: (
              <ProfileImage src={student?.image} wrapperClassName='mx-auto' />
            ),
          };
        });

        return { ...data, data: format };
      },
    }
  );

  const { data: studentByClassAndSession, isLoading: studentByClassLoading } =
    useQuery(
      [
        queryKeys.GET_STUDENTS_BY_ATTENDANCE,
        user?.class_assigned,
        user?.session,
      ],
      () =>
        apiServices.getStudentByClassAndSession(
          user?.class_assigned,
          user?.session
        ),
      {
        retry: 1,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        enabled: permission?.myStudents || false,
        // select: apiServices.formatData,
        select: (data) => {
          return apiServices.formatData(data)?.map((obj, index) => {
            const newObj = { ...obj };
            newObj.new_id = index + 1;
            return newObj;
          });

          // return { ...data, options: f };
        },
        onError(err) {
          errorHandler(err);
        },
      }
    );

  const chk = state?.creds?.class_name
    ? state?.creds?.class_name
    : user?.class_assigned;

  // console.log({ user });

  const {
    data: studentByClass2,
    isLoading: studentByClass2Loading,
    refetch: refetchStudentByClass2,
  } = useQuery(
    [queryKeys.GET_ALL_STUDENTS_BY_CLASS2, chk],
    () => apiServices.getStudentByClass2(chk),

    {
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: permission?.myStudents && !!chk,
      // enabled: permission?.myStudents || user?.designation_name === "Principal",
      // select: apiServices.formatData,
      select: (data) => {
        // console.log({ mystd: data });
        // console.log({ pdata: data, state });
        return apiServices.formatData(data)?.map((obj, index) => {
          const newObj = { ...obj };
          newObj.new_id = index + 1;
          return newObj;
        });

        // return { ...data, options: f };
      },
      onError(err) {
        errorHandler(err);
      },
    }
  );

  const { isLoading: studentDebtorsListLoading, data: studentDebtors } =
    useQuery(
      [queryKeys.GET_ALL_STUDENTS_DEBTORS],
      apiServices.getAllStudentDebtors,
      {
        enabled: permission?.readDebtors || false,
        retry: 1,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        onError(err) {
          errorHandler(err);
        },
        select: (data) => {
          // console.log({ data });
          return apiServices.formatData(data)?.map((data) => ({
            ...data,
            amount_due: (
              <>
                &#8358;
                <Numeral value={data.amount_due || "0"} format='0,0.00' />
              </>
            ),
            amount_paid: (
              <>
                &#8358;
                <Numeral value={data.amount_paid || "0"} format='0,0.00' />
              </>
            ),
            total_amount: (
              <>
                &#8358;
                <Numeral value={data.total_amount || "0"} format='0,0.00' />
              </>
            ),
          }));
        },
      }
    );

  const { isLoading: studentCreditorsListLoading, data: studentCreditors } =
    useQuery(
      [queryKeys.GET_ALL_STUDENTS_CREDITORS],
      apiServices.getAllStudentCreditors,
      {
        enabled: permission?.readCreditors || false,
        retry: 1,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        onError(err) {
          errorHandler(err);
        },
        select: (data) => {
          return apiServices.formatData(data)?.map((data) => ({
            ...data,
            amount_due: (
              <>
                &#8358;
                <Numeral value={data.amount_due || "0"} format='0,0.00' />
              </>
            ),
            amount_paid: (
              <>
                &#8358;
                <Numeral value={data.amount_paid || "0"} format='0,0.00' />
              </>
            ),
            total_amount: (
              <>
                &#8358;
                <Numeral value={data.total_amount || "0"} format='0,0.00' />
              </>
            ),
          }));
        },
      }
    );

  // Fetch Campus List
  const {
    isLoading: campusListLoading,
    data: campusList,
    refetch: refetchCampusList,
  } = useQuery([queryKeys.GET_ALL_CAMPUSES], apiServices.getAllCampuses, {
    enabled: permission?.update || false,
    retry: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    onError(err) {
      errorHandler(err);
    },
    // select: apiServices.formatData,
    select: (data) => {
      const f = apiServices.formatData(data)?.map((x) => ({
        value: x?.name,
        title: x?.name,
      }));

      return { ...data, options: f };
    },
  });

  const {
    isLoading: getAdmissionNoSettingsLoading,
    data: getAdmissionNoSettings,
    refetch: refetchGetAdmissionNoSettings,
  } = useQuery(
    [queryKeys.GET_ADMISSION_SETTINGS],
    () => apiServices.getAdmissionNoSettings(user?.sch_id),
    {
      enabled: true,
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      onError(err) {
        errorHandler(err);
      },
      // select: apiServices.formatData,
      select: (data) => {
        console.log({ gadata: data?.data });

        // const f = apiServices.formatData(data)?.map((x) => ({
        //   value: x?.name,
        //   title: x?.name,
        // }));

        return data?.data;
      },
      onSuccess: (data) => {
        setInputs2({
          ...inputs2,
          generate_number: data?.auto_generate,
          admission_initial: data?.admission_number_initial,
        });
        setLoadedGen(data?.auto_generate);
        setInputValue(data?.admission_number_initial);
        // console.log({ data });
        setAdmSetupPrompt(false);
      },
    }
  );

  const { mutateAsync: addStudent, isLoading: addStudentLoading } = useMutation(
    apiServices.addStudent,
    {
      onSuccess() {
        toast.success("Student has been added successfully");
        reset();
        refetchStudents();
        navigate("/app/students");
      },
      onError(err) {
        errorHandler(err);
      },
    }
  );

  const {
    mutateAsync: postAdmissionNoSettings,
    isLoading: postAdmissionNoSettingsLoading,
  } = useMutation(apiServices.postAdmissionNoSettings, {
    onSuccess() {
      // reset();
      refetchGetAdmissionNoSettings();
      trigger(1000);
      toast.success("Admission No settings has been updated successfully");
    },
    onError(err) {
      errorHandler(err);
    },
  });

  const { mutateAsync: updateStudent, isLoading: updateStudentLoading } =
    useMutation(apiServices.updateStudent, {
      onSuccess() {
        refetchStudents();
        toast.success("Student has been updated successfully");
        navigate("/app/students");
        // navigate
      },
      onError(err) {
        errorHandler(err);
      },
    });

  const { mutateAsync: deleteStudent } = useMutation(
    apiServices.deleteStudent,
    {
      onSuccess() {
        toast.success("Student has been deleted successfully");
        refetchStudents();
      },
      onError(err) {
        errorHandler(err);
      },
    }
  );

  const { isLoading: getStudentBySessionLoading } = useQuery(
    [queryKeys.GET_ALL_STUDENTS_BY_SESSION, session],
    () => apiServices.getStudentBySession(session),
    {
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!session && permission?.sortSession,
      onError(err) {
        errorHandler(err);
        setSession("");
      },
      onSuccess(data) {
        const format = apiServices.formatData(data)?.map((student, index) => {
          return {
            ...student,
            new_id: index + 1,
            image: (
              <ProfileImage src={student?.image} wrapperClassName='mx-auto' />
            ),
          };
        });
        setSession("");
        setSortedStudents(format);
        setIndexStatus("all");
        setSorted(true);
      },
    }
  );

  const { isLoading: getStudentByAdmissionNumberLoading } = useQuery(
    [queryKeys.GET_ALL_STUDENTS_BY_ADMISSION_NUMBER, admissionNumber],
    () => apiServices.getStudentByAdmissionNumber(admissionNumber),
    {
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!admissionNumber && permission?.sortAdmissionNumber,
      onError(err) {
        errorHandler(err);
        setAdmissionNumber("");
      },
      onSuccess(data) {
        const format = apiServices.formatData(data)?.map((student) => {
          return {
            ...student,
            image: (
              <ProfileImage src={student?.image} wrapperClassName='mx-auto' />
            ),
          };
        });
        setAdmissionNumber("");
        setSortedStudents(format);
        setIndexStatus("all");
        setSorted(true);
      },
    }
  );

  const { data: studentByClass, isLoading: getStudentByClassLoading } =
    useQuery(
      [
        queryKeys.GET_ALL_STUDENTS_BY_CLASS,
        classes.present_class,
        classes.sub_class,
      ],
      () => apiServices.getStudentByClass(classes),
      {
        retry: 1,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        enabled: !!classes.present_class && permission?.sortStudentByClass,
        onError(err) {
          errorHandler(err);
          setClasses({ present_class: "", sub_class: "" });
        },
        onSuccess(data) {
          const format = apiServices.formatData(data)?.map((student) => {
            return {
              ...student,
              image: (
                <ProfileImage src={student?.image} wrapperClassName='mx-auto' />
              ),
            };
          });
          setClasses({ present_class: "", sub_class: "" });
          setSortedStudents(format);
          setIndexStatus("all");
          setSorted(true);
        },
      }
    );

  const { mutateAsync: withdrawStudent, isLoading: withdrawStudentLoading } =
    useMutation(apiServices.withdrawStudent, {
      onSuccess() {
        toast.success("Student has been withdrawn");
      },
      onError(err) {
        errorHandler(err);
      },
    });

  const { mutateAsync: acceptStudent, isLoading: acceptStudentLoading } =
    useMutation(apiServices.acceptStudent, {
      onSuccess() {
        toast.success("Student has been accepted");
      },
      onError(err) {
        errorHandler(err);
      },
    });

  const { mutateAsync: transferStudent, isLoading: transferStudentLoading } =
    useMutation(apiServices.transferStudent, {
      onSuccess() {
        toast.success("Student has been transferred");
      },
      onError(err) {
        errorHandler(err);
      },
    });

  const { mutateAsync: promoteStudent, isLoading: promoteStudentLoading } =
    useMutation(apiServices.promoteStudent, {
      onSuccess() {
        toast.success("Student has been promoted");
      },
      onError(err) {
        errorHandler(err);
      },
    });

  const { mutateAsync: postHealthReport, isLoading: postHealthReportLoading } =
    useMutation(apiServices.postHealthReport, {
      onSuccess() {
        toast.success("Health report has been created");
      },
      onError(err) {
        errorHandler(err);
      },
    });

  const {
    mutateAsync: postCommunicationBook,
    isLoading: postCommunicationBookLoading,
  } = useMutation(apiServices.postCommunicationBook, {
    onSuccess() {
      toast.success("Record has been created");
    },
    onError(err) {
      errorHandler(err);
    },
  });

  const { isLoading: getStudentLoading, data: singleStudent } = useQuery(
    [queryKeys.GET_STUDENT, id],
    () => apiServices.getStudent(id),
    {
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      onError(err) {
        errorHandler(err);
      },
      enabled: isEdit,
      select: apiServices.formatSingleData,
    }
  );

  const { isLoading: alumniLoading, data: graduatedStudents } = useQuery(
    [queryKeys.GET_GRADUATED_STUDENTS],
    apiServices.getAlumniList,
    {
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: permission?.alumni,
      select: (data) => {
        return apiServices.formatData(data)?.map((student, i) => {
          return {
            ...student,
            new_id: i + 1,
            image: (
              <ProfileImage src={student?.image} wrapperClassName='mx-auto' />
            ),
          };
        });
      },
      onError(err) {
        errorHandler(err);
      },
    }
  );

  const {
    isLoading: studentLoginDetailsLoading,
    data: studentLoginDetailsStudents,
  } = useQuery(
    [queryKeys.GET_STUDENT_LOGIN_DETAILS, page],
    () => apiServices.getStudentLoginDetails(page),
    {
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: permission?.studentLoginDetails,
      select: (data) => {
        // console.log({ ddsData: data });
        const dt = data?.data?.map((student, i) => {
          return {
            ...student,
            new_id: i + 1,
          };
        });
        // console.log({ ddsData: data, dt });
        return dt;
      },
      onError(err) {
        errorHandler(err);
      },
    }
  );

  const { mutate: enableStudentStatus, isLoading: enableStudentStatusLoading } =
    useMutation(apiServices.enableStudentStatus, {
      onSuccess() {
        // refetchStaffList();
        if (permission?.myStudents) {
          refetchStudentByClass2();
        }
        toast.success("Student has been enabled successfully");
        refetchStudents();
      },
      onError(err) {
        errorHandler(err);
      },
    });

  const {
    mutate: disableStudentStatus,
    isLoading: disableStudentStatusLoading,
  } = useMutation(apiServices.disableStudentStatus, {
    onSuccess() {
      // refetchStaffList();
      if (permission?.myStudents) {
        refetchStudentByClass2();
      }
      toast.success("Student has been disabled successfully");
      refetchStudents();
    },
    onError(err) {
      errorHandler(err);
    },
  });

  const { mutate: graduateStudent, isLoading: graduateStudentLoading } =
    useMutation(apiServices.graduateStudent, {
      onSuccess() {
        toast.success("Student is now an alumni");
        navigate("/app/students");
      },
      onError(err) {
        errorHandler(err);
      },
    });

  const { mutate: postBusRouting, isLoading: postBusRoutingLoading } =
    useMutation(apiServices.postBusRouting, {
      onSuccess() {
        toast.success("Student is now an alumni");
        navigate("/app/students");
      },
      onError(err) {
        errorHandler(err);
      },
    });

  const handleUpdateStudent = async (data) => await updateStudent(data);

  const handleDeleteStudent = async (data) => await deleteStudent(data);

  const isLoading =
    studentListLoading ||
    addStudentLoading ||
    updateStudentLoading ||
    getStudentLoading ||
    getStudentBySessionLoading ||
    withdrawStudentLoading ||
    studentDebtorsListLoading ||
    studentCreditorsListLoading ||
    getStudentByAdmissionNumberLoading ||
    studentByClassLoading ||
    studentByClass2Loading ||
    graduateStudentLoading ||
    alumniLoading ||
    getStudentByClassLoading ||
    studentLoginDetailsLoading ||
    acceptStudentLoading ||
    transferStudentLoading ||
    promoteStudentLoading ||
    postHealthReportLoading ||
    postBusRoutingLoading ||
    // communicationListLoading ||
    postCommunicationBookLoading ||
    campusListLoading ||
    enableStudentStatusLoading ||
    disableStudentStatusLoading ||
    getAdmissionNoSettingsLoading ||
    postAdmissionNoSettingsLoading;

  // console.log({ state, permission });

  return {
    user,
    isLoading,
    students,
    getFieldProps,
    inputs,
    setFieldValue,
    handleSubmit,
    errors,
    setInputs,
    handleChange,
    isEdit: isEdit,
    handleImageChange,
    filePreview,
    base64String,
    resetFile,
    fileRef,
    addStudent,
    setSession,
    sortedStudents,
    withdrawStudent,
    sorted,
    setSorted,
    indexStatus,
    setIndexStatus,
    studentDebtors,
    studentCreditors,
    permission,
    handleSortBy,
    sortBy,
    setSortBy,
    setAdmissionNumber,
    setClasses,
    studentByClassAndSession,
    studentByClass,
    studentByClass2,
    graduatedStudents,
    graduateStudent,
    studentLoginDetailsStudents,
    acceptStudent,
    transferStudent,
    promoteStudent,
    postHealthReport,
    apiServices,
    postBusRouting,
    // communicationList,
    postCommunicationBook,
    onDeleteStudent: handleDeleteStudent,
    onUpdateStudent: handleUpdateStudent,
    studentData: singleStudent,
    campusList,
    principalClassName,
    setPrincipalClassName,
    enableStudentStatus,
    disableStudentStatus,
    getAdmissionNoSettingsLoading,
    postAdmissionNoSettingsLoading,
    getAdmissionNoSettings,
    postAdmissionNoSettings,
    admSetupPrompt,
    setAdmSetupPrompt,
    inputs2,
    setFieldValue2,
    getFieldProps2,
    handleSubmit2,
    errors2,
    setInputs2,
    inputValue,
    setInputValue,
    loading1,
    setLoading1,
    loadedGen,
    setLoadedGen,
  };
};
