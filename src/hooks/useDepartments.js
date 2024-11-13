import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import queryKeys from "../utils/queryKeys";
import { useAppContext } from "./useAppContext";
import { useParams } from "react-router-dom";
import { useForm } from "react-formid";

export const useDepartments = () => {
  const { apiServices, errorHandler, permission } =
    useAppContext("departments");
  const { id } = useParams();

  const { handleSubmit, getFieldProps, errors, setInputs, inputs } = useForm({
    defaultValues: {
      department_id: "",
      department_name: "",
    },
    validation: {
      department_id: {
        required: true,
      },
      department_name: {
        required: true,
      },
    },
  });

  const {
    isLoading: departmentsListLoading,
    data: departmentsList,
    refetch: refetchDepartmentList,
  } = useQuery(
    [queryKeys.GET_ALL_DEPARTMENTS],
    apiServices.getAllDepartmentList,
    {
      enabled: permission?.read,
      retry: 1,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onError(err) {
        errorHandler(err);
      },
      select: (data) => {
        // console.log({ data });
        return apiServices.formatData(data)?.map((obj, index) => {
          const newObj = { ...obj };
          newObj.new_id = index + 1;
          return newObj;
        });

        // return { ...data, options: f };
      },
    }
  );

  const { isLoading: departmentDataLoading, data: departmentData } = useQuery(
    [queryKeys.GET_ALL_DEPARTMENTS, id],
    () => apiServices.getDepartment(id),
    {
      //
      // enabled: !!id,
      enabled: !!id && !!inputs.department_id,
      retry: 1,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onError(err) {
        errorHandler(err);
      },
      select: apiServices.formatSingleData,
      // select: (data) => {
      //   console.log({ deptData: data });
      //   // return data?.data;
      //   // return data?.data[0]?.attributes;
      // },
    }
  );

  const { mutate: createDepartment, isLoading: createDepartmentLoading } =
    useMutation(apiServices.createDepartment, {
      onSuccess() {
        toast.success("Department has been created");
      },
      onError: apiServices.errorHandler,
    });

  const { mutate: deleteDepartment, isLoading: deleteDepartmentLoading } =
    useMutation(apiServices.deleteDepartment, {
      onSuccess() {
        toast.success("Department has been deleted");
        refetchDepartmentList();
      },
      onError: apiServices.errorHandler,
    });

  const { mutate: updateDepartment, isLoading: updateDepartmentLoading } =
    useMutation(apiServices.updateDepartment, {
      onSuccess() {
        toast.success("Department has been updated");
      },
      onError: apiServices.errorHandler,
    });

  const isLoading =
    departmentsListLoading ||
    createDepartmentLoading ||
    updateDepartmentLoading ||
    departmentDataLoading ||
    deleteDepartmentLoading;

  return {
    isLoading,
    departmentsList,
    permission,
    createDepartment,
    updateDepartment,
    departmentData,
    deleteDepartment,
    isEdit: !!id,

    handleSubmit,
    getFieldProps,
    errors,
    setInputs,
    inputs,
  };
};
