import React from "react";
import { useQuery } from "react-query";
import PageView from "../../../components/views/table-view";
import { useAppContext } from "../../../hooks/useAppContext";
import queryKeys from "../../../utils/queryKeys";

const BankList = () => {
  const { apiServices, permission } = useAppContext();

  const { data: bank, isLoading: bankLoading } = useQuery(
    [queryKeys.GET_BANK_LIST],
    apiServices.getBankList,
    {
      onError(err) {
        apiServices.errorHandler(err);
      },
      select: (data) => {
        const format = apiServices.formatData(data)?.map((bank, i) => {
          return {
            ...bank,
            sn: i + 1,
          };
        });

        return format;
      },
    }
  );

  console.log({ bank });

  return (
    <PageView
      canCreate={permission?.create}
      isLoading={bankLoading}
      columns={[
        {
          Header: "S/N",
          accessor: "sn",
        },
        {
          Header: "Bank Name",
          accessor: "bank_name",
        },
        {
          Header: "Account Name",
          accessor: "account_name",
        },
        {
          Header: "Account Number",
          accessor: "account_number",
        },
        {
          Header: "Opening Balance",
          accessor: "opening_balance",
        },
        {
          Header: "Account Purpose",
          accessor: "account_purpose",
        },
      ]}
      data={bank}
    />
  );
};

export default BankList;
