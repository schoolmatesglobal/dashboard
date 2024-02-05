import { useQuery } from "react-query";
import queryKeys from "../utils/queryKeys";
import { useAppContext } from "./useAppContext";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

export const useBank = () => {
  const { permission, apiServices, user } = useAppContext();

  const { data: bank, isLoading: bankLoading } = useQuery(
    [queryKeys.GET_BANK_LIST],
    apiServices.getBankList,
    {
      onError(err) {
        apiServices.errorHandler(err);
      },
      select: (data) => {
        const format = apiServices.formatData(data)?.map((bank, i) => {
          return {
            ...bank,
            sn: i + 1,
          };
        });

        return format;
      },
    }
  );

  const isLoading = bankLoading;

  return {
    isLoading,
    bank,
    permission,
    user,
    apiServices,
  };
};
