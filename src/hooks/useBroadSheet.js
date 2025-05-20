import { useAppContext } from "./useAppContext";
import { useReactToPrint } from "react-to-print";
import { useLocation } from "react-router-dom";
import { useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import queryKeys from "../utils/queryKeys";
import { useForm } from "react-formid";
import { queryOptions } from "../utils/constants";
import { removeDuplicates2 } from "../pages/dashboard/results/constant";

export const useBroadSheet = () => {
  const { apiServices, errorHandler, permission, user } =
    useAppContext("broadsheet");

  const { state } = useLocation();

  const pdfExportComponent = useRef(null);

  const is_preschool = !!user?.is_preschool && user.is_preschool !== "false";

  const handlePrint = useReactToPrint({
    content: () => pdfExportComponent.current,
  });

  const {
    data: broadSheetResults,
    isLoading: broadSheetResultsLoading,
    refetch: broadSheetResultsRefetch,
  } = useQuery(
    [
      queryKeys.GET_BROAD_SHEET_RESULT,
      state?.creds?.class_name
        ? state?.creds?.class_name
        : user?.class_assigned,
      state?.creds?.term,
      state?.creds?.session,
    ],
    () =>
      apiServices.getBroadSheetResults(
        state?.creds?.class_name
          ? state?.creds?.class_name
          : user?.class_assigned,
        state?.creds?.term,
        state?.creds?.session
      ),
    {
      // retry: 1,
      // refetchOnMount: true,
      // refetchOnWindowFocus: false,
      ...queryOptions,
      enabled: !is_preschool,
      select: (data) => {
        if (data) {
          let res = data?.data;

          res.forEach((sheet) => {
            sheet.student_fullname = sheet.student_fullname
              .replace(/\s+/g, " ")
              .trim();

            sheet.results.sort((resultA, resultB) => {
              const firstWordA = resultA.subject.split(" ")[0].toUpperCase();
              const firstWordB = resultB.subject.split(" ")[0].toUpperCase();

              if (firstWordA < firstWordB) {
                return -1;
              }
              if (firstWordA > firstWordB) {
                return 1;
              }

              return 0;
            });
          });

         
          res.sort((a, b) => {
            const nameA = a.student_fullname.toUpperCase();
            const nameB = b.student_fullname.toUpperCase();

            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }

            return 0;
          });

          const res2 = res.map((sr, index) => {
            return {
              sn: index + 1,
              student_id: sr.student_id,
              student_fullname: sr.student_fullname,
              results: removeDuplicates2(sr.results)?.filter((fa) => Number(fa.total_score) !== 0),
            };
          });

          const res1 = res.map((sr, index) => {
            return {
              sn: index + 1,
              student_id: sr.student_id,
              student_fullname: sr.student_fullname,
              results: sr.results,
            };
          });
          console.log({ data, res, res2 });

          return {
            results: res2,
            class_name: data?.class_name,
            teacher: data?.teacher,
          };
        } else {
          return [];
        }
      },
      // enabled:
      //   activateEndOfTerm &&
      //   initGetExistingSecondHalfResult &&
      //   !is_preschool &&
      //   state?.creds?.period === "Second Half",
      // select: apiServices.formatData,
      // refetchOnWindowFocus: false,
      // refetchOnMount: true,
      // refetchOnReconnect: false,
      // staleTime: 60000 * 30,

      // onSuccess(data) {
      //   // console.log({ dataB: data?.data });

      //   // return data?.data;
      //   // setInitGetSubjects(false);
      //   // setInitGetExistingSecondHalfResult(false);
      // },
    }
  );

  const loading = broadSheetResultsLoading;

  // console.log({ broadSheetResults, state, user });

  return {
    handlePrint,
    pdfExportComponent,
    user,
    loading,
    broadSheetResults,
    broadSheetResultsRefetch,
    // subjectsByClass3,
  };
};
