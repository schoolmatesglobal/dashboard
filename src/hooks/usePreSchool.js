import { useMutation, useQuery } from "react-query";
import { useAppContext } from "./useAppContext";
import { toast } from "react-toastify";
import queryKeys from "../utils/queryKeys";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { queryOptions } from "../utils/constants";

export const usePreSchool = () => {
  const { apiServices, permission, user } = useAppContext("pre-school");
  const [period, setPeriod] = useState({
    session: "2024/2025",
    term: "First Term",
    period: "First Half",
  });
  const [activatePreSchool, setActivatePreSchool] = useState(false);
  const [activatePreSchoolByClass, setActivatePreSchoolByClass] =
    useState(false);
  const { id } = useParams();

  const is_preschool = !!user?.is_preschool && user.is_preschool !== "false";

  const { data: preSchools, isLoading: preSchoolsLoading } = useQuery(
    [queryKeys.GET_ALL_PRE_SCHOOLS],
    apiServices.getPreSchools,
    {
      // retry: 1,
      // refetchOnMount: false,
      // refetchOnWindowFocus: false,
      ...queryOptions,
      enabled: permission?.read && is_preschool,
      select: apiServices.formatData,
      onError: apiServices.errorHandler,
    }
  );

  const cs = is_preschool && permission?.read && !!id && activatePreSchool;

  const ch = cs ?? false;

  const { data: preSchool, isLoading: preSchoolLoading } = useQuery(
    [queryKeys.GET_ALL_PRE_SCHOOLS, id],
    () => apiServices.getPreSchool(id),
    {
      // retry: 1,
      // refetchOnMount: false,
      // refetchOnWindowFocus: false,
      ...queryOptions,
      enabled: ch,
      // enabled:
      //   is_preschool &&
      //   permission?.read &&
      //   id !== undefined &&
      //   activatePreSchool,
      // select: apiServices.formatSingleData,
      select: (data) => {
        const pt = apiServices.formatSingleData(data);

        // console.log({ pdata: data, pd: pt, activatePreSchool });

        return pt;
      },
      onError: apiServices.errorHandler,
    }
  );

  const chk =
    is_preschool &&
    permission?.subject &&
    period.period !== "" &&
    period.session !== "" &&
    period.term !== "";

  const chk2 = chk ?? false;

  const {
    data: preSchoolSubjects,
    isLoading: preSchoolSubjectsLoading,
    refetch: refetchSubjects,
  } = useQuery(
    [
      queryKeys.GET_ALL_PRE_SCHOOL_SUBJECTS,
      period.period,
      period.session,
      period.term,
    ],
    () =>
      apiServices.getPreSchoolSubjects(
        period.period ?? "",
        period.term ?? "",
        period.session ?? ""
      ),
    {
      enabled: chk2,
      // retry: 1,
      // refetchOnMount: false,
      // refetchOnWindowFocus: false,
      ...queryOptions,
      select: apiServices.formatData,
      onError: apiServices.errorHandler,
    }
  );

  const className = preSchool?.name;

  // Get pre school by class
  const {
    data: preSchoolSubjectsByClass,
    isLoading: preSchoolSubjectsByClassLoading,
    refetch: refetchSubjectsByClass,
  } = useQuery(
    [
      queryKeys.GET_ALL_PRE_SCHOOL_SUBJECTS,
      period.period,
      period.term,
      period.session,
      preSchool?.name,
    ],
    () =>
      apiServices.getPreSchoolSubjectsByClass(
        period.period,
        period.term,
        period.session,
        preSchool?.name
      ),
    {
      // retry: 1,
      // refetchOnMount: true,
      // refetchOnWindowFocus: false,
      ...queryOptions,
      enabled:
        is_preschool &&
        permission?.subject &&
        !!preSchool?.name &&
        !!period.period &&
        !!period.session &&
        !!period.term,
      // &&
      // activatePreSchoolByClass,
      // select: apiServices.formatData,
      select: (data) => {
        const pps = apiServices.formatData(data);

        console.log({
          data,
          pps,
          // activatePreSchool,
          // period,
          // preSchool,
        });

        return pps;
      },
      onError: apiServices.errorHandler,
    }
  );

  const { data: preSchoolSubject, isLoading: preSchoolSubjectLoading } =
    useQuery(
      [queryKeys.GET_ALL_PRE_SCHOOL_SUBJECTS, id],
      () => apiServices.getPreSchoolSubject(id),
      {
        // retry: 1,
        // refetchOnMount: true,
        // refetchOnWindowFocus: false,
        ...queryOptions,
        enabled: permission?.subject && !!id,
        select(data) {
          const pt = apiServices.formatData(data);

          console.log({ data, pt });

          return pt;
        },
        // select: apiServices.formatData,
        onError: apiServices.errorHandler,
      }
    );

  const { mutateAsync: createPreSchool, isLoading: createPreSchoolLoading } =
    useMutation(apiServices.postPreSchool, {
      onError: apiServices.errorHandler,
      onSuccess() {
        toast.success("Pre School has been created successfully");
      },
    });

  const {
    mutateAsync: createPreSchoolSubject,
    isLoading: createPreSchoolSubjectLoading,
  } = useMutation(apiServices.postPreSchoolSubject, {
    onError: apiServices.errorHandler,
    onSuccess() {
      toast.success("Pre School Subject has been created successfully");
    },
  });

  const {
    mutateAsync: deletePreSchoolSubject,
    isLoading: deletePreSchoolSubjectLoading,
  } = useMutation(apiServices.deletePreSchoolSubjects, {
    onError: apiServices.errorHandler,
    onSuccess() {
      toast.success("Pre School Subject has been deleted successfully");
      refetchSubjects();
    },
  });

  const { mutateAsync: deletePreSchool, isLoading: deletePreSchoolLoading } =
    useMutation(apiServices.deletePreSchool, {
      onError: apiServices.errorHandler,
      onSuccess() {
        toast.success("Pre School has been deleted successfully");
        refetchSubjects();
      },
    });

  const {
    mutateAsync: editPreSchoolSubject,
    isLoading: editPreSchoolSubjectLoading,
  } = useMutation(apiServices.editPreSchoolSubject, {
    onError: apiServices.errorHandler,
    onSuccess() {
      toast.success("Pre School Subject has been updated successfully");
      refetchSubjectsByClass();
    },
  });

  const { mutateAsync: editPreSchool, isLoading: editPreSchoolLoading } =
    useMutation(apiServices.editPreSchool, {
      onError: apiServices.errorHandler,
      onSuccess() {
        toast.success("Pre School has been updated successfully");
      },
    });

  const {
    mutateAsync: postSubjectsByPreSchool,
    isLoading: postSubjectsByPreSchoolLoading,
  } = useMutation(apiServices.postSubjectsByPreSchool, {
    onError: apiServices.errorHandler,
    onSuccess() {
      toast.success("Pre School Subjects has been updated successfully");
      refetchSubjectsByClass();
    },
  });

  const isLoading =
    createPreSchoolLoading ||
    preSchoolsLoading ||
    createPreSchoolSubjectLoading ||
    preSchoolSubjectsByClassLoading ||
    deletePreSchoolSubjectLoading ||
    preSchoolSubjectLoading ||
    editPreSchoolSubjectLoading ||
    preSchoolLoading ||
    editPreSchoolLoading ||
    deletePreSchoolLoading ||
    postSubjectsByPreSchoolLoading;

  // console.log({
  //   preSchoolSubjectsByClass,
  //   tp: period,
  //   class: preSchool?.name,
  //   ps: permission?.subject,
  //   period: period.period,
  //   term: period.term,
  //   session: period.session,
  // });

  // const preSchoolSubjects2 = preSchoolSubjectsByClass
  //   ? preSchoolSubjectsByClass
  //   : [];

  // console.log({ period, pt: !!period.term, id, chk, chk2, ch });

  return {
    createPreSchool,
    isLoading,
    preSchools,
    createPreSchoolSubject,
    permission,
    preSchoolSubjectsByClass,
    preSchoolSubjects,
    // preSchoolSubjects2,
    setPeriod,
    deletePreSchoolSubject,
    editPreSchoolSubject,
    preSchool,
    editPreSchool,
    deletePreSchool,
    postSubjectsByPreSchool,
    isEdit: !!id,
    preSchoolSubject,
    activatePreSchool,
    setActivatePreSchool,
    setActivatePreSchoolByClass,
  };
};
