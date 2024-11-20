import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { useAppContext } from "./useAppContext";
import queryKeys from "../utils/queryKeys";
import { useParams } from "react-router-dom";

export const useGrading = () => {
  const { apiServices, permission, errorHandler, user } = useAppContext();
  const { id } = useParams();

  const activate =
    user?.designation_name === "Admin" || "Teacher" ? true : false;

  // console.log({ activate });
  // const activate = user?.designation_id === "1";

  const { mutate: addScores, isLoading: addScoresLoading } = useMutation(
    apiServices.addMaxScores,
    {
      onSuccess() {
        toast.success("Scores has been uploaded");
      },
      onError: apiServices.errorHandler,
    }
  );

  const { data: scores, isLoading: scoresLoading } = useQuery(
    [queryKeys.GET_SCORES],
    apiServices.getMaxScores,
    {
      // enabled: false,
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: activate,
      onError(err) {
        errorHandler(err);
      },
      select: (data) => {
        // console.log({ scoreData: data?.data?.attributes });
        return data?.data?.attributes;
      },
    }
  );

  const { mutate: postGrading, isLoading: postGradingLoading } = useMutation(
    apiServices.postGrading,
    {
      onSuccess() {
        toast.success("Grade has been uploaded");
      },
      onError: apiServices.errorHandler,
    }
  );

  const { mutate: updateGrading, isLoading: updateGradingLoading } =
    useMutation(apiServices.updateGrading, {
      onSuccess() {
        toast.success("Grade has been updated");
      },
      onError: apiServices.errorHandler,
    });

  const {
    data: grading,
    isLoading: gradingLoading,
    refetch: refetchGrading,
  } = useQuery([queryKeys.GET_GRADING], apiServices.getGrading, {
    retry: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    select: (data) => {
      // console.log({ data });
      return apiServices.formatData(data)?.map((obj, index) => {
        const newObj = { ...obj };
        newObj.new_id = index + 1;
        return newObj;
      });

      // return { ...data, options: f };
    },
    onError(err) {
      apiServices.errorHandler(err);
    },
  });

  const { mutate: deleteGrading, isLoading: deleteGradingLoading } =
    useMutation(apiServices.deleteGrading, {
      onSuccess() {
        toast.success("Grade has been deleted");
        refetchGrading();
      },
      onError: apiServices.errorHandler,
    });

  const { data: singleGrading, isLoading: singleGradingLoading } = useQuery(
    [queryKeys.GET_GRADING, id],
    () => apiServices.getSingleGrading(id),
    {
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!id,
      select: apiServices.formatSingleData,
      onError(err) {
        apiServices.errorHandler(err);
      },
    }
  );

  const isLoading =
    postGradingLoading ||
    gradingLoading ||
    singleGradingLoading ||
    updateGradingLoading ||
    deleteGradingLoading ||
    addScoresLoading ||
    scoresLoading;

  // console.log({ scores, activate });

  return {
    permission,
    user,
    scores,
    addScores,
    postGrading,
    isLoading,
    grading,
    singleGrading,
    updateGrading,
    deleteGrading,
    isEdit: !!id,
  };
};
