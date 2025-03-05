import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { useAppContext } from "./useAppContext";
import queryKeys from "../utils/queryKeys";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthDetails } from "../stores/authDetails";
import { queryOptions, sortArray } from "../utils/constants";

export const useGradePoint = () => {
  const { apiServices, permission, errorHandler, user } = useAppContext();
  const { id } = useParams();

  const navigate = useNavigate();

  const { userDetails, setUserDetails } = useAuthDetails();

  const activate =
    user?.designation_name === "Admin" || "Teacher" ? true : false;

  const {
    data: gradePoint,
    isLoading: gradePointLoading,
    refetch: refetchGradePoint,
  } = useQuery(["GET_ALL_GRADE_POINT"], apiServices.getAllGpa, {
    ...queryOptions,
    select: (data) => {
      // console.log({ data });
      const gpd =
        data?.data?.map((obj, index) => {
          return {
            ...obj,
            new_id: index + 1,
          };
        }) ?? [];
      const sorted = sortArray(gpd, "max_mark", "asc", "number");

      const filteredGp = gpd?.find((g) => Number(g.id) === Number(id));

      return {
        filteredGp,
        gp: sorted,
      };

      // return { ...data, options: f };
    },
    onError(err) {
      apiServices.errorHandler(err);
    },
  });

  const { mutate: deleteGrading, isLoading: deleteGradingLoading } =
    useMutation(apiServices.deleteGpa, {
      onSuccess() {
        toast.success("Grade Point has been deleted");
        // refetchGrading();
        refetchGradePoint();
      },
      onError: apiServices.errorHandler,
    });

  const { data: singleGrading, isLoading: singleGradingLoading } = useQuery(
    [queryKeys.GET_GRADING, id],
    () => apiServices.getGpa(id),
    {
      // retry: 1,
      // refetchOnMount: true,
      // refetchOnWindowFocus: false,
      ...queryOptions,
      enabled: !!id,
      select: (data) => {
        // console.log({ sdata: data });
        return data?.data;
      },
      onError(err) {
        apiServices.errorHandler(err);
      },
    }
  );

  // const { mutate: postGrading, isLoading: postGradingLoading } = useMutation(
  //   apiServices.postGrading,
  //   {
  //     onSuccess() {
  //       toast.success("Grade has been uploaded");
  //     },
  //     onError: apiServices.errorHandler,
  //   }
  // );

  const { mutate: postGradePoint, isLoading: postGradePointLoading } =
    useMutation(apiServices.addGpa, {
      onSuccess() {
        toast.success("Grade Point has been added");
        refetchGradePoint();
        navigate("/app/grade-point");
      },
      onError: apiServices.errorHandler,
    });

  const { mutate: updateGrading, isLoading: updateGradingLoading } =
    useMutation(apiServices.updateGpa, {
      onSuccess() {
        toast.success("Grade Point has been updated");
        refetchGradePoint();
        navigate("/app/grade-point");
      },
      onError: apiServices.errorHandler,
    });

  const isLoading =
    postGradePointLoading ||
    gradePointLoading ||
    // postGradingLoading ||
    // gradingLoading ||
    singleGradingLoading ||
    updateGradingLoading ||
    deleteGradingLoading;
  // addScoresLoading ||
  // scoresLoading;

  // console.log({ id, gradePoint: gradePoint.gp });

  return {
    permission,
    user,
    isLoading,
    singleGrading,
    updateGrading,
    deleteGrading,
    isEdit: !!id,
    postGradePoint,
    gradePoint,
  };
};
