import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import validator from "validator";
import { isValidPhoneNumber } from "react-phone-number-input";
import queryKeys from "../utils/queryKeys";
import { useAppContext } from "./useAppContext";
import { useForm } from "react-formid";
import { useFile } from "./useFile";

export const useCampus = () => {
  const { id } = useParams();
  const { apiServices, errorHandler, permission } = useAppContext("campus");

  const {
    getFieldProps,
    inputs,
    setFieldValue,
    handleSubmit,
    errors,
    setInputs,
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phoneno: "+234",
      address: "",
      state: "",
      image: "",
      campus_type: "",
      is_preschool: "false",
    },
    validation: {
      name: {
        // required: (val) => !!val || "Campus name is required",
      },
      email: {
        // required: (val) => !!val || "Email address is required",
        isValid: (val) => validator.isEmail(val) || "Email address is invalid",
      },
      address: {
        // required: (val) => !!val || "Address is required",
      },
      phoneNumber: {
        // required: (val) => !!val || "Phone number is required",
        isValid: (val) =>
          (typeof val === "string" && isValidPhoneNumber(val)) ||
          "Phone number is invalid",
      },
      // state: {
      //   required: (val) => !!val || "State is required",
      // },
      // campus_type: {
      //   required: (val) => !!val || "Campus Type is required",
      // },
    },
  });

  const {
    handleImageChange,
    filePreview,
    base64String,
    reset: resetFile,
    fileRef,
  } = useFile();

  // Fetch Campus List
  const {
    isLoading: campusListLoading,
    data: campusList,
    refetch: refetchCampusList,
  } = useQuery([queryKeys.GET_ALL_CAMPUSES], apiServices.getAllCampuses, {
    enabled: permission?.read || false,
    retry: 3,
    onError(err) {
      errorHandler(err);
    },
    select: (data) => {
      // console.log({ data });
      return apiServices.formatData(data)?.map((obj, index) => {
        const newObj = { ...obj };
        newObj.new_id = index + 1;
        return newObj;
      });

      // return { ...data, options: f };
    },
  });

  // Fetch Campus by Id
  const { isLoading: getCampusLoading, data: campusData } = useQuery(
    [queryKeys.GET_CAMPUS, id],
    () => apiServices.getCampus(id),
    {
      retry: 3,
      onError(err) {
        errorHandler(err);
      },
      enabled: !!id && (permission?.update || false),
      select: apiServices.formatSingleData,
    }
  );

  // Add Campus
  const { mutateAsync: addCampus, isLoading: addCampusLoading } = useMutation(
    apiServices.addCampus,
    {
      onSuccess() {
        toast.success("Campus has been added successfully");
        resetFile();
        reset();
      },
      onError(err) {
        errorHandler(err);
      },
    }
  );

  const { mutateAsync: updateCampus, isLoading: updateCampusLoading } =
    useMutation(apiServices.updateCampus, {
      onSuccess() {
        toast.success("Campus has been updated successfully");
      },
      onError(err) {
        errorHandler(err);
      },
    });

  const { mutateAsync: deleteCampus, isLoading: deleteCampusLoading } =
    useMutation(apiServices.deleteCampus, {
      onSuccess() {
        toast.success("Campus has been deleted successfully");
        refetchCampusList();
      },
      onError(err) {
        errorHandler(err);
      },
    });

  const { mutateAsync: toggleCampusStatus } = useMutation(
    apiServices.toggleCampusStatus,
    {
      onSuccess() {
        refetchCampusList();
        toast.success("Campus status updated successfully");
      },
      onError(err) {
        errorHandler(err);
      },
    }
  );

  const singleCampus = id ? campusList?.find((x) => x.id === id) : undefined;

  const handleUpdateCampus = async (data) =>
    await updateCampus({ ...data, id });

  const isLoading =
    addCampusLoading ||
    campusListLoading ||
    updateCampusLoading ||
    getCampusLoading ||
    deleteCampusLoading;

  return {
    permission,
    isLoading,
    campusList,
    addCampus,
    getFieldProps,
    inputs,
    setFieldValue,
    handleSubmit,
    errors,
    setInputs,
    handleImageChange,
    filePreview,
    base64String,
    resetFile,
    fileRef,
    deleteCampus,
    updateCampus: handleUpdateCampus,
    campusData: campusData || singleCampus,
    toggleCampusStatus,
    isEdit: !!id,
  };
};
