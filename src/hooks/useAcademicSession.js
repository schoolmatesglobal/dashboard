import { useQuery } from "react-query";
import queryKeys from "../utils/queryKeys";
import { useAppContext } from "./useAppContext";
import { queryOptions } from "../utils/constants";

export const useAcademicSession = () => {
  const { apiServices } = useAppContext();
  return useQuery(
    [queryKeys.GET_ACADEMIC_SESSIONS],
    apiServices.getAcademicSessions,
    {
      ...queryOptions,
      select: (data) => {
        // console.log({ datam: data });
        return data?.data;
      },
      onError: apiServices.errorHandler,
    }
  );
};
