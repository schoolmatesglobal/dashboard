import React from "react";
import { useQuery } from "react-query";
import PageView from "../../../components/views/table-view";
import { useAppContext } from "../../../hooks/useAppContext";
import queryKeys from "../../../utils/queryKeys";

const FeeList = () => {
  const { apiServices, permission } = useAppContext();

  const { data: Fee, isLoading: feeLoading } = useQuery(
    [queryKeys.GET_FEE_LIST],
    apiServices.getFeeList,
    {
      onError(err) {
        apiServices.errorHandler(err);
      },
      // select: apiServices.formatData,
      select: (data) => {
        const format = apiServices.formatData(data)?.map((student, i) => {
          return {
            ...student,
            sn: i + 1,
            amount: `₦${apiServices.formatNumberWithCommas(student?.amount)}`
          };
        });

        return format;
      },
    }
  );

  console.log({ Fee });

  return (
    <PageView
      canCreate={permission?.create}
      isLoading={feeLoading}
      columns={[
        {
          Header: "S/N",
          accessor: "sn",
        },
        {
          Header: "Campus",
          accessor: "campus",
        },
        {
          Header: "Fee Type",
          accessor: "feetype",
        },
        {
          Header: "Term",
          accessor: "term",
        },
        {
          Header: "Fee Amount",
          accessor: "amount",
        },
        // {
        //   Header: "Category",
        //   accessor: "category",
        // },
        // {
        //   Header: "Fee Status",
        //   accessor: "fee_status",
        // },
        // {
        //   Header: "Category",
        //   accessor: "category",
        // },
      ]}
      data={Fee}
    />
  );
};

export default FeeList;
