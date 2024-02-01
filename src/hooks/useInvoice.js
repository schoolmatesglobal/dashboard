import { useQuery } from "react-query";
import queryKeys from "../utils/queryKeys";
import { useAppContext } from "./useAppContext";

export const useInvoices = () => {
const { permission, apiServices, user } = useAppContext("accounts");
  const { isLoading: invoicesLoading, data: invoicesList, refetch: getInvoiceRefetch, } = useQuery(
    [queryKeys.GET_ALL_INVOICES],
    apiServices.getInvoices,
    {
      enabled: permission?.myPayment,
      select: apiServices.formatData,
    }
  );
    
    const isLoading = invoicesLoading
  return {
    isLoading,
    invoicesList,
    getInvoiceRefetch,
    permission,
    user,
    apiServices,
  };
};
