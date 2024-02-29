import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import queryKeys from "../utils/queryKeys";
import { useAppContext } from "./useAppContext";

export const useAccounts = () => {
  const [indexStatus, setIndexStatus] = useState("my-invoice");

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
      enabled: permission?.feeHistory,
      select: apiServices.formatData,
    }
  );

  const { isLoading: previousInvoiceLoading, data: previousInvoice } = useQuery(
    [queryKeys.GET_PREVIOUS_INVOICE],
    apiServices.getStudentPreviousInvoice,
    {
      enabled: permission?.previousInvoice,
      select: apiServices.formatData,
    }
  );

  // const { isLoading: invoiceLoading, data: invoice } = useQuery(
  //   [queryKeys.GET_INVOICE],
  //   apiServices.getStudentInvoice,
  //   {
  //     enabled: permission?.myInvoice,
  //     select: apiServices.formatData,
  //   }
  // );

  const {
    isLoading: invoicesLoading,
    data: invoicesList,
    refetch: getInvoiceRefetch,
  } = useQuery([queryKeys.GET_ALL_INVOICES], apiServices.getInvoices, {
    enabled: permission?.myPayment,
    select: apiServices.formatData,
  });

  const { isLoading: chartaccountLoading, data: chartaccountList } = useQuery(
    [queryKeys.GET_CHART_ACCOUNTS],
    apiServices.getChartAccount,
    {
      enabled: permission?.myChartAccount,
      select: apiServices.formatData,
    }
  );

  const {
    isLoading: paymentLoading,
    data: payment,
    refetch: refetchPayment,
  } = useQuery([queryKeys.GET_PAYMENT], apiServices.getPayment, {
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
