import { useMutation, useQuery } from "react-query";
import queryKeys from "../utils/queryKeys";
import { useAppContext } from "./useAppContext";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export const useBank = () => {
  const { permission, apiServices, user } = useAppContext("bank");
  const { id } = useParams();


  const { createBankLoading, mutate: createBank } = useMutation(apiServices.postBank, {
    onSuccess() {
      toast.success("Bank has been created");
    },

    onError(err) {
      apiServices.errorHandler(err);
    },
  });

  const {
    data: bank,
    isLoading: bankLoading,
    refetch: refetchBank,
  } = useQuery([queryKeys.GET_BANK_LIST], apiServices.getBankList, {
    enabled: permission?.read,
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
  });

  const { isLoading: deleteBankLoading, mutate: deleteBank } = useMutation(
    apiServices.deleteBank,
    {
      onSuccess() {
        toast.success("Bank has been deleted successfully");
        refetchBank();
      },
      onError: apiServices.errorHandler,
    }
  );

  const { mutateAsync: updateBank, isLoading: updateBankLoading } = useMutation(
    apiServices.updateBank,
    {
      onSuccess() {
        toast.success("Bank has been updated successfully");
        refetchBank();
      },
      onError(err) {
        apiServices.errorHandler(err);
      },
    }
  );

  const handleUpdateBank = async (data) => await updateBank(data);

  const isLoading = bankLoading || deleteBankLoading || updateBankLoading || createBankLoading;

  console.log({ pa: permission?.read });

  return {
    isLoading,
    bank,
    createBank,
    deleteBank,
    handleUpdateBank,
    isEdit: !!id,
    permission,
    user,
    apiServices,
    id,
  };
};
