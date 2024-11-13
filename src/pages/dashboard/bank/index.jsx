import React from "react";
import { useQuery } from "react-query";
import PageView from "../../../components/views/table-view";
import { useAppContext } from "../../../hooks/useAppContext";
import queryKeys from "../../../utils/queryKeys";
import { useBank } from "../../../hooks/useBank";
import { useNavigate } from "react-router-dom";

const BankList = () => {
  const { apiServices, permission } = useAppContext();

  const navigate = useNavigate();

  const getActionOptions = () => {
    
    const arr = [];

    return [
      {
        title: "Views Details",
        onClick: (id) => navigate(`/app/bank/details/${id}`),
      },
    ];
  };

  const { bank, deleteBank, handleUpdateBank, isLoading } = useBank();

  // console.log({ bank });

  return (
    <PageView
      canCreate={permission?.create}
      isLoading={isLoading}
      rowHasAction={true}
      action={getActionOptions({ navigate })}
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
          accessor: "opening_balance2",
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
