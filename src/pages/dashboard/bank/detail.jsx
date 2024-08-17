import React, { useEffect } from "react";
import { useForm } from "react-formid";

import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { Col, Row } from "reactstrap";
import AuthInput from "../../../components/inputs/auth-input";
import DetailView from "../../../components/views/detail-view";
import { useAppContext } from "../../../hooks/useAppContext";
import { useBank } from "../../../hooks/useBank";
// import { toast } from "react-toastify";

const BankDetail = () => {
  const { apiServices, user, permission } = useAppContext();

  const {
    createBank,
    bank,
    deleteBank,
    handleUpdateBank,
    isLoading: bankLoading,
    isEdit,
    id,
  } = useBank();

  const {
    handleSubmit,
    errors,
    getFieldProps,
    setInputs,
    inputs,
    handleChange,
    setFieldValue,
  } = useForm({
    defaultValues: {
      bank_name: "",
      account_name: "",
      opening_balance: "",
      account_number: "",
      account_purpose: "",
    },
  });

  function fb() {
    const bk = bank?.find((bnk) => bnk?.id === id);
    return bk;
  }

  const filteredBank = fb();

  const onSubmit = async (data) => {
    if (
      !inputs?.bank_name ||
      !inputs?.account_name ||
      !inputs?.opening_balance ||
      !inputs?.account_number
    ) {
      toast.error(`Please fill all required fields`);
      return;
    }

    if (isEdit) {
      return await handleUpdateBank({ ...data, id: filteredBank.id });
    }

    createBank({
      body: {
        ...data,
        // id: user.id,
      },
    });
  };

  useEffect(() => {
    if (isEdit) {
      setInputs({
        ...inputs,
        bank_name: filteredBank?.bank_name,
        account_name: filteredBank?.account_name,
        opening_balance: filteredBank?.opening_balance,
        account_number: filteredBank?.account_number,
        account_purpose: filteredBank?.account_purpose,
      });
    }
  }, [isEdit, bank]);

  // console.log({ bank, filteredBank, isEdit });

  return (
    <DetailView
      isLoading={bankLoading}
      pageTitle={isEdit ? "Edit Bank" : "Create Bank"}
      onFormSubmit={handleSubmit(onSubmit)}
    >
      <Row className='mb-0 mb-sm-4'>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            required
            label='Bank Name'
            placeholder='e.g Schoolmates Bank '
            hasError={!!errors.bank_name}
            {...getFieldProps("bank_name")}
          />
          {!!errors.bank_name && (
            <p className='error-message'>{errors.bank_name}</p>
          )}
        </Col>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            required
            label='Account Name'
            placeholder='e.g Schoolmates Schools'
            hasError={!!errors.account_name}
            {...getFieldProps("account_name")}
          />
          {!!errors.account_name && (
            <p className='error-message'>{errors.account_name}</p>
          )}
        </Col>
      </Row>
      <Row className='mb-0 mb-sm-4'>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            required
            type='number'
            min='0'
            label='Account Number'
            className='noSpinButtons'
            placeholder='e.g 0011223344'
            hasError={!!errors.account_number}
            {...getFieldProps("account_number")}
          />
          {!!errors.account_number && (
            <p className='error-message'>{errors.account_number}</p>
          )}
        </Col>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            required
            type='number'
            min='0'
            label='Opening Balance (₦)'
            placeholder='e.g 20000'
            className='noSpinButtons'
            hasError={!!errors.opening_balance}
            {...getFieldProps("opening_balance")}
          />
          {!!errors.opening_balance && (
            <p className='error-message'>{errors.opening_balance}</p>
          )}
        </Col>
      </Row>
      <Row className='mb-0 mb-sm-4'>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            label='Account Purpose'
            placeholder='e.g Main Account Details'
            hasError={!!errors.account_purpose}
            {...getFieldProps("account_purpose")}
          />
          {!!errors.account_purpose && (
            <p className='error-message'>{errors.account_purpose}</p>
          )}
        </Col>
      </Row>
    </DetailView>
  );
};

export default BankDetail;
