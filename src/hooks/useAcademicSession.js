import { useQuery } from "react-query";
import queryKeys from "../utils/queryKeys";
import { useAppContext } from "./useAppContext";

export const useAcademicSession = () => {
  const { apiServices } = useAppContext();
  return useQuery(
    [queryKeys.GET_ACADEMIC_SESSIONS],
    apiServices.getAcademicSessions,
    {
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      select: (data) => {
        // console.log({ datam: data });
        return data?.data;
      },
      onError: apiServices.errorHandler,
    }
  );
};
