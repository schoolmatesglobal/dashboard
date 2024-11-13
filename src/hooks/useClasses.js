import { useState } from "react";
import { useForm } from "react-formid";
import { useMutation, useQuery } from "react-query";
import { useParams, useNavigation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import queryKeys from "../utils/queryKeys";
import { useAppContext } from "./useAppContext";

export const useClasses = () => {
  const [classes, setClasses] = useState([]);
  const [classList, setClassList] = useState([]);
  const [onGetSubjectByClass2, setOnGetSubjectByClass2] = useState(false);
  const { id } = useParams();
  const { apiServices, errorHandler, permission, user } =
    useAppContext("classes");
  const [checkedRows, setCheckedRows] = useState([]);
  const [checkedSubjects, setCheckedSubjects] = useState([]);
  const [activateCampus, setActivateCampus] = useState(false);
  const navigate = useNavigate();

  const {
    getFieldProps,
    inputs,
    setFieldValue,
    handleSubmit,
    errors,
    setInputs,
    handleChange,
    reset,
  } = useForm({
    defaultValues: {
      class_name: "",
      sub_class: [],
      campus: "",
    },
    validation: {
      class_name: {
        required: (val) => !!val || "Class name is required",
      },
      campus: {
        required: (val) => !!val || "Campus is required",
      },
    },
  });

  // const router = useNavigation();

  const { isLoading: subjectsLoading, data: subjects } = useQuery(
    [queryKeys.GET_SUBJECTS, id],
    () => apiServices.getSubjectByClass(id),
    {
      retry: 1,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: !!id,
      select: apiServices.formatData,

      onError: apiServices.errorHandler,
    }
  );

  const getClassName = () => {
    const findSubject = classes?.find((ns) => ns.id === id);
    return findSubject?.class_name;
  };

  const { isLoading: subjectDataLoading2, data: subjectData2 } = useQuery(
    [queryKeys.GET_SUBJECTS2, id],
    () => apiServices.getSubject(id),
    {
      retry: 1,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: false,
      // enabled: !!id && onGetSubjectByClass2,
      // select: apiServices.formatSingleData,
      select: (data) => {
        // console.log({ ccData: data });
        // return data?.data?.attributes;
        // return data?.data[0]?.attributes;
      },

      onError: apiServices.errorHandler,
    }
  );

  const {
    isLoading: classListLoading,
    data: classDt,
    refetch: refetchClasses,
  } = useQuery([queryKeys.GET_ALL_CLASSES], apiServices.getAllClasses, {
    retry: 1,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: permission?.read || permission?.readClass,
    onSuccess(data) {
      setClasses(data);
      const formatClassList = data?.map((x) => ({
        ...x,
        sub_class: x.sub_class.split(",").join(", "),
      }));

      setClassList(
        formatClassList?.map((obj, index) => {
          const newObj = { ...obj };
          newObj.new_id = index + 1;
          return newObj;
        })
      );
    },
    onError(err) {
      errorHandler(err);
    },
    select: apiServices.formatData,
  });

  const { isLoading: subjectsByClassLoading2, data: subjectsByClass2 } =
    useQuery(
      [queryKeys.GET_SUBJECTS_BY_CLASS2, id],
      () => apiServices.getSubjectByClass2(id),
      {
        retry: 1,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        enabled: !!id,
        // enabled: false,
        // enabled: !!id && onGetSubjectByClass2,
        select: apiServices.formatData,
        onSuccess(data) {
          // const sg = data[0]?.subject?.map((x) => ({
          //   subject: x.name,
          //   score: "0",
          //   grade: "0",
          // }));
          // console.log({ data });

          // setSubjectsWithScoreAndGrade(sg);
          // setSubjects(sg);
          return data?.subject;
        },
        onError: apiServices.errorHandler,
      }
    );

  const {
    isLoading: addSubjectsToClassLoading,
    mutate: assignSubjectsToClass,
  } = useMutation(apiServices.assignSubjectsToClass, {
    onSuccess() {
      toast.success("Subject has been assigned successfully");
    },
    onError: apiServices.errorHandler,
  });

  const { mutateAsync: addClass, isLoading: addClassLoading } = useMutation(
    apiServices.addClass,
    {
      onSuccess() {
        toast.success("Class has been added successfully");
        reset();
        navigate(-1);
      },
      onError(err) {
        errorHandler(err);
      },
    }
  );

  const singleClass = id ? classes?.find((x) => x.id === id) : undefined;

  const newClass = {
    present_class: singleClass?.class_name,
    sub_class: singleClass?.sub_class,
  };

  // Get Students by Class
  const {
    isLoading: getStudentByClassLoading,
    data: newStudents,
    refetch: refetchGetStudentByClass,
  } = useQuery(
    [
      queryKeys.GET_ALL_STUDENTS_BY_CLASS,
      newClass.present_class,
      newClass.sub_class,
    ],
    () => apiServices.getStudentByClass(newClass),
    {
      // enabled: false,
      retry: 1,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: newClass.present_class && permission?.create,
      onError(err) {
        errorHandler(err);
        // setClasses({ present_class: "", sub_class: "" });
      },
      onSuccess(data) {
        // console.log({ data });
        // const ids = [];
        // data?.forEach((x) => {
        //   if (x?.status === "active") {
        //     ids.push(x?.id);
        //   }
        // });
        // setCheckedRows(ids);
      },
      select: (data) => {
        return apiServices.formatData(data)?.map((student) => ({
          ...student,
          student_fullname: `${student.firstname} ${student.surname} ${student.middlename}`,
          class: `${student.present_class} ${student.sub_class}`,
        }));
      },
    }
  );

  // Fetch Campus List
  const {
    isLoading: campusListLoading,
    data: campusList,
    // refetch: refetchCampusList,
  } = useQuery([queryKeys.GET_ALL_CAMPUSES], apiServices.getAllCampuses, {
    enabled: permission?.read && activateCampus,
    retry: 1,
    refetchOnMount: false,
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

  const { mutateAsync: updateClass, isLoading: updateClassLoading } =
    useMutation(apiServices.updateClass, {
      onSuccess() {
        toast.success("Class has been updated successfully");
        navigate(-1);
      },
      onError(err) {
        errorHandler(err);
      },
    });

  const { mutateAsync: deleteClass } = useMutation(apiServices.deleteClass, {
    onSuccess() {
      toast.success("Class has been deleted successfully");
      refetchClasses();
    },
    onError(err) {
      errorHandler(err);
    },
  });

  const { mutateAsync: promoteAllStudents, isLoading: promoteStudentsLoading } =
    useMutation(apiServices.promoteStudents, {
      onSuccess() {
        toast.success("Student(s) has been promoted");
        refetchGetStudentByClass();
      },
      onError(err) {
        errorHandler(err);
      },
    });

  const handleUpdateClass = async (data) => await updateClass({ ...data, id });

  // const handlePromoteStudents = async (data) => await promoteAllStudents(data);

  const handleDeleteClass = async (data) => await deleteClass(data);

  const isLoading =
    classListLoading ||
    addClassLoading ||
    updateClassLoading ||
    subjectsLoading ||
    campusListLoading ||
    getStudentByClassLoading ||
    promoteStudentsLoading ||
    subjectDataLoading2 ||
    addSubjectsToClassLoading ||
    // subjectsByClassLoading ||
    subjectsByClassLoading2;

  // console.log({ classes });
  // console.log({ id });

  return {
    isLoading,
    getFieldProps,
    inputs,
    setFieldValue,
    handleSubmit,
    errors,
    setInputs,
    handleChange,
    classes: classList,
    isEdit: !!id,
    onUpdateClass: handleUpdateClass,
    addClass,
    classData: singleClass,
    onDeleteClass: handleDeleteClass,
    permission,
    subjects,
    // subjectsByClass,
    subjectsByClass2,
    getClassName,
    campusList,
    newStudents,
    checkedRows,
    setCheckedRows,
    checkedSubjects,
    setCheckedSubjects,
    promoteAllStudents,
    assignSubjectsToClass,
    setOnGetSubjectByClass2,
    onGetSubjectByClass2,
    subjectData2,
    id,
    user,
    setActivateCampus,
  };
};
