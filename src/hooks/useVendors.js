import { useQuery } from "react-query";
import queryKeys from "../utils/queryKeys";
import { useAppContext } from "./useAppContext";
import { queryOptions } from "../utils/constants";

export const useVendors = () => {
  const { apiServices, errorHandler, permission } = useAppContext("vendors");

  const { isLoading: vendorsListLoading, data: vendorsList } = useQuery(
    [queryKeys.GET_ALL_VENDORS],
    apiServices.getVendorList,
    {
      enabled: permission?.read || false,
      // retry: 1,
      // refetchOnMount: true,
      // refetchOnWindowFocus: false,
      ...queryOptions,
      onError(err) {
        errorHandler(err);
      },
      select: apiServices.formatData,
    }
  );
  return {
    vendorsListLoading,
    vendorsList,
    permission,
  };
};
