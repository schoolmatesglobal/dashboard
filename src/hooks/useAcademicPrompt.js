import { useState } from "react";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { useAppContext } from "./useAppContext";

export const useAcademicPeriod = () => {
  const [academicPeriodPrompt, setAcademicPeriodPrompt] = useState(false);
  const { apiServices } = useAppContext();

  const { mutate: postAcademicPeriod, isLoading: postAcademicPeriodLoading } =
    useMutation(apiServices.postAcademicPeriod, {
      onSuccess() {
        toast.success("Academic Period has been posted successfully");
      },
      onError: apiServices.errorHandler,
    });

  const { mutate: postCurrentAcademicPeriod, isLoading: postCurrentAPLoading } =
    useMutation(apiServices.postCurrentAcademicPeriod, {
      onSuccess() {
        toast.success("Current Academic Period has been set successfully");
      },
      onError: apiServices.errorHandler,
    });

  const isLoading = postCurrentAPLoading || postAcademicPeriodLoading;

  return {
    postAcademicPeriod,
    postCurrentAcademicPeriod,
    isLoading,
    academicPeriodPrompt,
    setAcademicPeriodPrompt,
  };
};
