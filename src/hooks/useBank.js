import { useMutation, useQuery } from "react-query";
import queryKeys from "../utils/queryKeys";
import { useAppContext } from "./useAppContext";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { formatCurrency } from "../pages/dashboard/bank/constant";
import dayjs from "dayjs";

export const useBank = () => {
  const { permission, apiServices, user } = useAppContext("bank");
  const { id } = useParams();

  const navigate = useNavigate();

  const { createBankLoading, mutate: createBank } = useMutation(
    apiServices.postBank,
    {
      onSuccess() {
        toast.success("Bank has been created");
      },

      onError(err) {
        apiServices.errorHandler(err);
      },
    }
  );

  // GET BANK LIST
  const {
    data: bank,
    isLoading: bankLoading,
    refetch: refetchBank,
  } = useQuery([queryKeys.GET_BANK_LIST], apiServices.getBankList, {
    retry: 1,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: permission?.read,
    onError(err) {
      apiServices.errorHandler(err);
    },
    select: (data) => {
      const newData = data?.data?.map((item) => {
        const newPy = item?.payments?.map((it, i) => {
          return {
            ...it,
            date: dayjs(it?.date).format("D MMM YYYY h:mm A"),
            amount_paid: formatCurrency(it?.amount_paid),
            amount_paid2: it?.amount_paid,
            total_amount: formatCurrency(it?.total_amount),
            total_amount2: it?.total_amount,
            amount_due: formatCurrency(it?.amount_due),
            amount_due2: it?.amount_due,
            sn: i + 1,
          };
        });
        return {
          ...item,
          attributes: {
            ...item.attributes,
            payments: newPy,
          },
          id: item.id,
        };
      });

      const format = apiServices.formatData(data)?.map((bank, i) => {
        return {
          ...bank,
          opening_balance2: formatCurrency(bank?.opening_balance),

          sn: i + 1,
          // payments: data?.data?.payments,
        };
      });

      const format2 = newData?.map((bank, i) => {
        const bk = bank?.attributes;
        return {
          ...bk,
          opening_balance2: formatCurrency(bk?.opening_balance),

          sn: i + 1,
          id: bank?.id,
          // payments: data?.data?.payments,
        };
      });
      // console.log({ Bdata: data, dt: data?.data, format, format2, newData });

      return format2;
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
        navigate(-1);
      },
      onError(err) {
        apiServices.errorHandler(err);
      },
    }
  );

  const handleUpdateBank = async (data) => await updateBank(data);

  const isLoading =
    bankLoading || deleteBankLoading || updateBankLoading || createBankLoading;

  // console.log({ pa: permission?.read });

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
