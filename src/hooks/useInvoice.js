import { useQuery } from "react-query";
import queryKeys from "../utils/queryKeys";
import { useAppContext } from "./useAppContext";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

export const useInvoices = () => {
  const { permission, apiServices, user } = useAppContext("accounts");

  const pdfExportComponent = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => pdfExportComponent.current,
  });

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

  const isLoading = invoicesLoading;

  return {
    isLoading,
    invoicesList,
    getInvoiceRefetch,
    permission,
    user,
    apiServices,
    handlePrint,
    pdfExportComponent,
  };
};
