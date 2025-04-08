import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { homeUrl, queryOptions, userRole } from "../utils/constants";
import queryKeys from "../utils/queryKeys";
import { useAppContext } from "./useAppContext";
import { useAuthDetails } from "../stores/authDetails";

export const useAuth = (navigateOnLogin = true) => {
  const navigate = useNavigate();
  const { userDetails, setUserDetails } = useAuthDetails();
  const { updateUser, user, apiServices } = useAppContext();
  const [initiateDesignationQuery, setInitiateDesignationQuery] =
    useState(false);

  const authority = userRole(user?.designation_id);

  const isAdminPrincipal =
    (authority === "admin" ||
      authority === "principal" ||
      authority === "superadmin") ??
    false;

  const { isLoading: designationLoading } = useQuery(
    [queryKeys.GET_DESIGNATION],
    apiServices.getDesignation,
    {
      retry: 2,
      // refetchOnMount: true,
      // refetchOnWindowFocus: false,
      // ...queryOptions,
      enabled: initiateDesignationQuery,
      onSuccess(data) {
        setInitiateDesignationQuery(false);
        const { designation_name } =
          data?.data?.find((item) => item.id === user.designation_id)
            ?.attributes || {};
        const userObj =
          designation_name === "Student"
            ? { ...user, class_assigned: user?.present_class, designation_name }
            : { ...user, designation_name };
        updateUser(userObj);
        setUserDetails(userObj);
        navigateOnLogin && navigate(homeUrl[designation_name]);
      },
      onError(err) {
        // console.log({ err });
        apiServices.errorHandler(err);
      },
    }
  );

  const { mutateAsync: login, isLoading: loginLoading } = useMutation(
    apiServices.login,
    {
      onSuccess(data) {
        updateUser(data?.data?.user);
        setInitiateDesignationQuery(true);
      },
      onError(err) {
        apiServices.errorHandler2(err);
      },
    }
  );

  const { mutateAsync: register, isLoading: registerLoading } = useMutation(
    apiServices.register,
    {
      onSuccess(data) {
        updateUser(data?.data?.user);
        setInitiateDesignationQuery(true);
      },
      onError(err) {
        apiServices.errorHandler2(err);
      },
    }
  );

  const {
    data: currentAcademicPeriod,
    isLoading: currentAcademicPeriodLoading,
    refetch: refetchCurrentAcademicPeriod,
  } = useQuery(
    [queryKeys.GET_CURRENT_ACADEMIC_PERIOD],
    apiServices.getCurrentAcademicPeriod,
    {
      retry: 2,
      // refetchOnMount: true,
      // refetchOnWindowFocus: false,
      // ...queryOptions,
      enabled: initiateDesignationQuery && !isAdminPrincipal,
      select: (data) => {
        console.log({ ccDt: data, ccDt2: data?.data });

        // return data?.data;
        return data?.data;
      },
      onSuccess(data) {
        // console.log({ acDt3: data });
        if (data?.term) {
          updateUser({
            ...user,
            term: data?.term,
            session: data?.session,
            period: data?.period,
          });

          setUserDetails({
            ...userDetails,
            term: data?.term,
            session: data?.session,
            period: data?.period,
          });
        }

        // if (data?.term) {
        //   setInitiateCPeriod(false);
        // }
      },
      onError(err) {
        apiServices.errorHandler2(err);
      },
    }
  );

  console.log({ user });

  return {
    login,
    register,
    currentAcademicPeriod,
    isLoading:
      loginLoading ||
      designationLoading ||
      registerLoading ||
      currentAcademicPeriodLoading,
  };
};
