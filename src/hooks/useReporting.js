import { useMutation, useQuery } from "react-query";
import { useAppContext } from "./useAppContext";
import { toast } from "react-toastify";
import queryKeys from "../utils/queryKeys";
import { useParams } from "react-router-dom";
import { queryOptions } from "../utils/constants";

export const useReporting = () => {
  const { apiServices, permission, user } = useAppContext("reporting");
  const { id } = useParams();

  const { mutateAsync: addReport, isLoading: addReportLoading } = useMutation(
    apiServices.postReport,
    {
      onSuccess() {
        toast.success("Report type has been added");
      },
      onError: apiServices.errorHandler,
    }
  );

  const {
    data: reports,
    isLoading: reportsLoading,
    refetch: refetchReports,
  } = useQuery([queryKeys.GET_ALL_REPORTS], apiServices.getReports, {
    // retry: 1,
    // refetchOnMount: true,
    // refetchOnWindowFocus: false,
    ...queryOptions,
    enabled: permission.read || false,
    onError: apiServices.errorHandler,
    select: (data) => {
      // console.log({ Rdata: data });
      return data?.data?.map((x, i) => ({
        id: x.id,
        new_id: i + 1,
        ...x.attributes,
      }));
    },
  });

  const { data: report, isLoading: reportLoading } = useQuery(
    [queryKeys.GET_ALL_REPORTS, id],
    () => apiServices.getReport(id),
    {
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: permission?.read && !!id,
      select: apiServices.formatSingleData,
      onError: apiServices.errorHandler,
    }
  );

  const { mutateAsync: editReport, isLoading: editReportLoading } = useMutation(
    apiServices.editReport,
    {
      onError: apiServices.errorHandler,
      onSuccess() {
        toast.success("Report type has been updated successfully");
      },
    }
  );

  const { mutateAsync: deleteReport, isLoading: deleteReportLoading } =
    useMutation(apiServices.deleteReport, {
      onError: apiServices.errorHandler,
      onSuccess() {
        toast.success("Report type has been deleted successfully");
        refetchReports();
      },
    });

  const isLoading =
    addReportLoading ||
    reportsLoading ||
    reportLoading ||
    editReportLoading ||
    deleteReportLoading;

  return {
    addReport,
    isLoading,
    reports,
    report,
    editReport,
    deleteReport,
    permission,
    isEdit: !!id,
    user,
  };
};
