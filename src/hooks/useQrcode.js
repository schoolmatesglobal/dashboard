import { useMutation, useQuery } from "react-query";
import { useAppContext } from "./useAppContext";
import { toast } from "react-toastify";
import queryKeys from "../utils/queryKeys";
import { useParams } from "react-router-dom";

export const useQrcode = () => {
  const { apiServices, permission } = useAppContext("qr-codes");
  const { id } = useParams();

  

  return {
    // addSkill,
    // isLoading,
    // skills,
    // skill,
    // editSkill,
    // deleteSkill,
    apiServices,
    permission,
    isEdit: !!id,
  };
};
