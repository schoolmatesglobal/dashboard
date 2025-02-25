import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import queryKeys from "../utils/queryKeys";
import { useAppContext } from "./useAppContext";
import { useParams } from "react-router-dom";

export const useActivities = () => {
  const { apiServices, permission, user } = useAppContext("activities");
  const { id } = useParams();

  const activate =
    user?.designation_name === "Admin" || "Teacher" ? true : false;
  const activateElem = user?.is_preschool === "false" ? true : false;
  const activatePre = user?.is_preschool === "true" ? true : false;

  const {
    isLoading: activitiesLoading,
    data: activities,
    refetch: refetchActivities,
    
  } = useQuery([queryKeys.GET_ACTIVITIES], apiServices.getActivities, {
    // select: apiServices.formatData,
    retry: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: activate && activateElem,
    select: (data) => {
      // console.log({ dat: data?.data });
      // return data?.data;
      return data?.data?.map((obj, index) => {
        const newObj = { ...obj };
        newObj.new_id = index + 1;
        return newObj;
      });
    },
    onError: apiServices.errorHandler,
  });

  const { isLoading: addActivitiesLoading, mutate: addActivities } =
    useMutation(apiServices.addActivities, {
      onSuccess() {
        toast.success("Activity has been created successfully");
        refetchActivities();
      },
      onError: apiServices.errorHandler,
    });

  const { isLoading: deleteActivityLoading, mutate: deleteActivity } =
    useMutation(apiServices.deleteActivities, {
      onSuccess() {
        toast.success("Activity has been deleted successfully");
        refetchActivities();
      },
      onError: apiServices.errorHandler,
    });

  // PRESCHOOL ACTIVITIES

  const {
    isLoading: preActivitiesLoading,
    data: preActivities,
    refetch: refetchPreActivities,
  } = useQuery([queryKeys.GET_ACTIVITIES, "2"], apiServices.getPreActivities, {
    // select: apiServices.formatData,
    retry: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: activate && activatePre,
    select: (data) => {
      // console.log({ dat: data?.data });
      // return data?.data;
      return data?.data?.map((obj, index) => {
        const newObj = { ...obj };
        newObj.new_id = index + 1;
        return newObj;
      });
    },
    onError: apiServices.errorHandler,
  });

  const { isLoading: addPreActivitiesLoading, mutate: addPreActivities } =
    useMutation(apiServices.addPreActivities, {
      onSuccess() {
        toast.success("Activity has been created successfully");
        refetchPreActivities();
      },
      onError: apiServices.errorHandler,
    });

  const { isLoading: deletePreActivityLoading, mutate: deletePreActivity } =
    useMutation(apiServices.deletePreActivities, {
      onSuccess() {
        toast.success("Activity has been deleted successfully");
        refetchPreActivities();
      },
      onError: apiServices.errorHandler,
    });

  const isLoading =
    activitiesLoading ||
    addActivitiesLoading ||
    deleteActivityLoading ||
    preActivitiesLoading ||
    addPreActivitiesLoading ||
    deletePreActivityLoading;

  // console.log({ preActivities, activities });

  return {
    isLoading,
    activities,
    preActivities,
    addActivities,
    addPreActivities,
    deleteActivity,
    deletePreActivity,
    permission,
    isEdit: !!id,
    user,
  };
};
