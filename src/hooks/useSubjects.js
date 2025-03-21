import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import queryKeys from "../utils/queryKeys";
import { useAppContext } from "./useAppContext";
import { useParams } from "react-router-dom";
import { queryOptions } from "../utils/constants";

export const useSubject = () => {
  const { apiServices, permission, user } = useAppContext("subjects");
  const { id } = useParams();

  const {
    isLoading: subjectsLoading,
    data: subjects,
    refetch: refetchSubjects,
  } = useQuery([queryKeys.GET_SUBJECTS], apiServices.getAllSubjects, {
    // select: apiServices.formatData,
    select: (data) => {
      // console.log({ data });
      return apiServices.formatData(data)?.map((obj, index) => {
        const newObj = { ...obj };
        newObj.new_id = index + 1;
        return newObj;
      });

      // return { ...data, options: f };
    },
    // retry: 1,
    // refetchOnMount: true,
    // refetchOnWindowFocus: false,
    ...queryOptions,
    onError: apiServices.errorHandler,
  });

  const { isLoading: subjectDataLoading, data: subjectData } = useQuery(
    [queryKeys.GET_SUBJECTS, id],
    () => apiServices.getSubject(id),
    {
      enabled: !!id,
      // retry: 1,
      // refetchOnMount: true,
      // refetchOnWindowFocus: false,
      ...queryOptions,
      select: apiServices.formatSingleData,
      onError: apiServices.errorHandler,
    }
  );

  const { isLoading: addSubjectLoading, mutate: addSubject } = useMutation(
    apiServices.addSubject,
    {
      onSuccess() {
        toast.success("Subject has been created successfully");
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

  const { isLoading: deleteSubjectLoading, mutate: deleteSubject } =
    useMutation(apiServices.deleteSubject, {
      onSuccess() {
        toast.success("Subject has been deleted successfully");
        refetchSubjects();
      },
      onError: apiServices.errorHandler,
    });

  const { isLoading: updateSubjectLoading, mutate: updateSubject } =
    useMutation(apiServices.updateSubject, {
      onSuccess() {
        toast.success("Subject has been updated successfully");
      },
      onError: apiServices.errorHandler,
    });

  const isLoading =
    subjectsLoading ||
    addSubjectLoading ||
    subjectDataLoading ||
    deleteSubjectLoading ||
    updateSubjectLoading ||
    addSubjectsToClassLoading;

  // console.log({ id, subjectData });

  return {
    isLoading,

    assignSubjectsToClass,
    subjects,
    permission,
    addSubject,
    subjectData,
    deleteSubject,
    updateSubject,
    isEdit: !!id,
    user,
  };
};
