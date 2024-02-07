import React from "react";
import { useQuery } from "react-query";
import PageView from "../../../components/views/table-view";
import { useAppContext } from "../../../hooks/useAppContext";
import queryKeys from "../../../utils/queryKeys";
import { useBank } from "../../../hooks/useBank";

const BankList = () => {
  const { apiServices, permission } = useAppContext();

  const { bank, deleteBank, handleUpdateBank, isLoading } = useBank();

  console.log({ bank });

  return (
    <PageView
      canCreate={permission?.create}
      isLoading={isLoading}
      onDelete={deleteBank}
      rowHasUpdate={true}
      rowHasDelete={true}
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
