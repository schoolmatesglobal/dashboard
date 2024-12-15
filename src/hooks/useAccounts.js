import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import queryKeys from "../utils/queryKeys";
import { useAppContext } from "./useAppContext";
import { useNavigate } from "react-router-dom";

export const useAccounts = () => {
  const [indexStatus, setIndexStatus] = useState("my-invoice");

  const navigate = useNavigate();

  const { id } = useParams();

  const isEdit = !!id;

  // console.log({ isEdit });
  // const [indexStatus, setIndexStatus] = useState("fee-history");
  const { permission, apiServices, errorHandler, user } =
    useAppContext("accounts");

  const { isLoading: feeHistoryLoading, data: feeHistory } = useQuery(
    [queryKeys.GET_FEE_HISTORY],
    apiServices.getStudentFeeHistory,
    {
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: permission?.feeHistory,
      select: apiServices.formatData,
    }
  );

  const { isLoading: previousInvoiceLoading, data: previousInvoice } = useQuery(
    [queryKeys.GET_PREVIOUS_INVOICE],
    apiServices.getStudentPreviousInvoice,
    {
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: permission?.previousInvoice,
      select: apiServices.formatData,
    }
  );

  const {
    isLoading: invoicesLoading,
    data: invoicesList,
    refetch: getInvoiceRefetch,
  } = useQuery([queryKeys.GET_ALL_INVOICES], apiServices.getInvoices, {
    retry: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: permission?.myPayment,
    select: apiServices.formatData,
  });

  const { isLoading: chartaccountLoading, data: chartaccountList } = useQuery(
    [queryKeys.GET_CHART_ACCOUNTS],
    apiServices.getChartAccount,
    {
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: permission?.myChartAccount,
      select: apiServices.formatData,
    }
  );

  const {
    isLoading: paymentLoading,
    data: payment,
    refetch: refetchPayment,
  } = useQuery([queryKeys.GET_PAYMENT], apiServices.getPayment, {
    retry: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: permission?.myPayment,
    // select: apiServices.formatData,
    select: (data) => {
      // console.log({ data });

      // return data?.data;
      return data?.data?.map((py, i) => {
        return {
          ...py,
          invoiceId: py?.payment[0]?.invoice_id ?? "",
          // invoice_no: getInvoiceId(py?.payment[0]?.invoice_id ?? []),
          total_amount:
            py?.payment[py?.payment?.length - 1]?.total_amount ?? "",
          // amount_paid:
          //   Number(py?.payment[py?.payment?.length - 1]?.total_amount) -
          //   Number(py?.payment[py?.payment?.length - 1]?.amount_due),

          // amount_due:
          //   `₦${apiServices.formatNumberWithCommas(
          //     py?.payment[py?.payment?.length - 1]?.amount_due?.toString()
          //   )}` ?? "",
          amount_due: py?.payment[py?.payment?.length - 1]?.amount_due ?? "",
        };
      });
    },
  });

  const { mutateAsync: updatePayment, isLoading: updatePaymentLoading } =
    useMutation(apiServices.updatePayment, {
      onSuccess(data) {
        toast.success("Payment has been updated successfully");
        navigate(-1);
      },
      onError(err) {
        errorHandler(err);
      },
    });

  const handleUpdatePayment = async (data) => await updatePayment(data);

  const isLoading =
    feeHistoryLoading ||
    previousInvoiceLoading ||
    // invoiceLoading ||
    chartaccountLoading ||
    paymentLoading ||
    updatePaymentLoading;
  // invoicesLoading;

  return {
    indexStatus,
    setIndexStatus,
    feeHistory,
    isLoading,
    previousInvoice,
    permission,
    // invoice,
    chartaccountList,
    payment,
    invoicesList,
    getInvoiceRefetch,
    user,
    apiServices,
    handleUpdatePayment,
  };
};
