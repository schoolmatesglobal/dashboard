import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ProfileImage from "../components/common/profile-image";
import queryKeys from "../utils/queryKeys";
import { useAppContext } from "./useAppContext";
import { queryOptions } from "../utils/constants";

export const useVehicles = () => {
  const [indexStatus, setIndexStatus] = useState("all");
  const { id } = useParams();
  const { apiServices, errorHandler, permission, user } =
    useAppContext("vehicles");

  const {
    isLoading: vehiclesListLoading,
    data: vehiclesList,
    refetch: refetchVehicles,
  } = useQuery([queryKeys.GET_ALL_VEHICLES], apiServices.getAllVehicles, {
    enabled: permission?.read || false,
    // retry: 1,
    // refetchOnMount: true,
    // refetchOnWindowFocus: false,
    ...queryOptions,
    onError(err) {
      errorHandler(err);
    },
    select: apiServices.formatData,
  });

  const { isLoading: vehicleLogsListLoading, data: vehicleLogsList } = useQuery(
    [queryKeys.GET_ALL_VEHICLE_LOGS],
    apiServices.getAllVehicleLogs,
    {
      enabled: permission?.readLogs || false,
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

  const { isLoading: getAssignedBusLoading, data: assignedBusList } = useQuery(
    [queryKeys.GET_ASSIGNED_BUS],
    apiServices.getAssignedBus,
    {
      enabled:
        permission?.assignedBus ||
        ["Student"].includes(user?.designation_name) ||
        false,
      // retry: 1,
      // refetchOnMount: true,
      // refetchOnWindowFocus: false,
      ...queryOptions,
      onError(err) {
        errorHandler(err);
      },
      select: (data) =>
        apiServices.formatData(data)?.map((x) => ({
          ...x,
          conductor_image: (
            <ProfileImage src={x?.conductor_image} wrapperClassName='mx-auto' />
          ),
          driver_image: (
            <ProfileImage src={x?.driver_image} wrapperClassName='mx-auto' />
          ),
        })),
    }
  );

  const { isLoading: getAllAssignedBusLoading, data: allAssignedBusList } =
    useQuery([queryKeys.GET_ALL_ASSIGNED_BUS], apiServices.getAllAssignedBus, {
      enabled:
        permission?.allAssignedBus ||
        ["Admin"].includes(user?.designation_name) ||
        false,
      // retry: 1,
      // refetchOnMount: true,
      // refetchOnWindowFocus: false,
      ...queryOptions,
      onError(err) {
        errorHandler(err);
      },
      select: (data) =>
        apiServices.formatData(data)?.map((x) => ({
          ...x,
          conductor_image: (
            <ProfileImage src={x?.conductor_image} wrapperClassName='mx-auto' />
          ),
          driver_image: (
            <ProfileImage src={x?.driver_image} wrapperClassName='mx-auto' />
          ),
        })),
    });

  const { mutateAsync: addVehicle, isLoading: addVehicleLoading } = useMutation(
    apiServices.addVehicle,
    {
      onSuccess() {
        toast.success("Vehicle has been added successfully");
      },
      onError(err) {
        errorHandler(err);
      },
    }
  );

  const { mutateAsync: addVehicleLogs, isLoading: addVehicleLogsLoading } =
    useMutation(apiServices.addVehicleLogs, {
      onSuccess() {
        toast.success("Vehicle Log has been added successfully");
      },
      onError(err) {
        errorHandler(err);
      },
    });

  const { mutateAsync: updateVehicle, isLoading: updateVehicleLoading } =
    useMutation(apiServices.updateVehicle, {
      onSuccess() {
        toast.success("Vehicle has been updated successfully");
      },
      onError(err) {
        errorHandler(err);
      },
    });

  const { mutateAsync: deleteVehicle } = useMutation(
    apiServices.deleteVehicle,
    {
      onSuccess() {
        toast.success("Vehicle has been deleted successfully");
        refetchVehicles();
      },
      onError(err) {
        errorHandler(err);
      },
    }
  );

  const { isLoading: vehicleDataLoading, data: vehicleData } = useQuery(
    [queryKeys.GET_VEHICLE, id],
    () => apiServices.getVehicle(id),
    {
      enabled: !!id,
      // retry: 1,
      // refetchOnMount: true,
      // refetchOnWindowFocus: false,
      ...queryOptions,
      onError(err) {
        apiServices.errorHandler(err);
      },
      select: apiServices.formatSingleData,
    }
  );

  const handleUpdateVehicle = async (data) => await updateVehicle(data);

  const handleDeleteVehicle = async (data) => await deleteVehicle(data);

  const isLoading =
    addVehicleLoading ||
    updateVehicleLoading ||
    vehiclesListLoading ||
    vehicleLogsListLoading ||
    addVehicleLogsLoading ||
    getAssignedBusLoading ||
    vehicleDataLoading ||
    getAllAssignedBusLoading;

  return {
    isLoading,
    addVehicle,
    handleUpdateVehicle,
    handleDeleteVehicle,
    vehiclesList,
    vehicleLogsList,
    indexStatus,
    setIndexStatus,
    permission,
    addVehicleLogs,
    assignedBusList,
    isEdit: !!id,
    vehicleData,
    allAssignedBusList,
    user,
  };
};
