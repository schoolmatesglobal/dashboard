import React, { useEffect, useState } from "react";
import { useForm } from "react-formid";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { Col, Row } from "reactstrap";
import AuthInput from "../../../components/inputs/auth-input";
import AuthSelect from "../../../components/inputs/auth-select";
import DetailView from "../../../components/views/detail-view";
import { useAcademicSession } from "../../../hooks/useAcademicSession";
import { useAppContext } from "../../../hooks/useAppContext";
import { useStudent } from "../../../hooks/useStudent";
import { useInvoices } from "../../../hooks/useInvoice";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAccounts } from "../../../hooks/useAccounts";
import queryKeys from "../../../utils/queryKeys";
import { useBank } from "../../../hooks/useBank";

const PaymentEdit = () => {
  const { permission, apiServices, errorHandler } = useAppContext();
  const {
    handleSubmit,
    errors,
    getFieldProps,
    setInputs,
    inputs,
    handleChange,
  } = useForm({
    defaultValues: {
      session: "",
      term: "",
      bank_name: "",
      account_name: "",
      invoice_number: "",
      student_fullname: "",
      payment_method: "",
      amount_paid: "",
      total_amount: "",
      remark: "",
      class: "",
      admission_number: "",
      payment_type: "",
    },
  });

  const {
    bank,
    deleteBank,
    handleUpdateBank,
    isLoading: bankLoading,
  } = useBank();

  const [newBank, setNewBank] = useState([]);

  const [amount, setAmount] = useState("");

  const navigate = useNavigate();

  const { id } = useParams();

  const isEdit = !!id;

  const {
    isLoading: paymentByIdLoading,
    data: paymentById,
    refetch: refetchPaymentById,
  } = useQuery(
    [queryKeys.GET_PAYMENT_BY_ID],
    () => apiServices.getPaymentById(id),
    {
      enabled: !!id,
      retry: 1,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      // select: apiServices.formatData,
      select: (data) => {
        // console.log({ datap: data });

        // return data?.data;
        return {
          id: data?.data?.id,
          ...data?.data?.attributes,
        };
      },
    }
  );

  const {
    isLoading: paymentLoading,
    payment,
    handleUpdatePayment,
  } = useAccounts();

  // const { data: sessions } = useAcademicSession();
  // const { isLoading: loadStudent, studentData } = useStudent();
  // const {
  //   isLoading: invoicesLoading,
  //   invoicesList,
  //   // apiServices,
  //   handlePrint,
  //   pdfExportComponent,
  //   user,
  // } = useInvoices();

  // function fi() {
  //   return invoicesList?.find((iv) => iv?.id === id);
  // }

  // let calcAmount = 0;
  // let calcAmount2 = 0;

  // const filteredInvoice = fi();

  const { isLoading, mutate: createPayment } = useMutation(
    apiServices.postPayment,
    {
      onSuccess() {
        toast.success("Payment Successful");
      },

      onError(err) {
        apiServices.errorHandler(err);
      },
    }
  );

  const bankId = (function () {
    return (
      bank?.find((bk) => inputs?.account_name?.includes(bk?.bank_name))?.id ??
      ""
    );
  })();

  const onSubmit = (data) => {
    if (
      !inputs?.amount_paid ||
      !inputs?.payment_method ||
      // !inputs?.bank_name ||
      !inputs?.account_name ||
      !inputs?.payment_type
    ) {
      // setFeeError("feetype");
      toast.error(`Please add required field`);
      return;
    }
    if (
      inputs.payment_method !== "Physical Cash" &&
      (!inputs?.amount_paid || !inputs?.payment_method || !inputs?.payment_type)
    ) {
      // setFeeError("feetype");
      toast.error(`Please add required field`);
      return;
    }
    if (Number(inputs.amount_paid) > Number(amount)) {
      // setFeeError("feetype");
      toast.error(`Amount paid is greater than Outstanding Amount`);
      return;
    }
    // createPayment({
    //   student_id: filteredInvoice?.student_id,
    //   invoice_number: filteredInvoice?.id,
    //   student_fullname: filteredInvoice?.fullname,
    //   total_amount: amount,
    //   bank_name: data?.bank_name,
    //   account_name: data?.account_name,
    //   payment_method: data?.payment_method,
    //   amount_paid: data?.amount_paid,
    //   type: data?.payment_type,
    // });

    handleUpdatePayment({
      id: paymentById?.id,
      // total_amount: amount,
      bank_id: Number(bankId),
      bank_name: data?.account_name,
      account_name: data?.account_name,
      payment_method: data?.payment_method,
      amount_paid: data?.amount_paid,
      type: data?.payment_type,
    });

    // console.log({
    //   id: paymentById?.id,
    //   total_amount: amount,
    //   bank_name: data?.bank_name,
    //   account_name: data?.account_name,
    //   payment_method: data?.payment_method,
    //   amount_paid: data?.amount_paid,
    //   type: data?.payment_type,
    // });
  };

  useEffect(() => {
    if (isEdit) {
      setInputs({
        ...inputs,
        student_fullname: paymentById?.student_fullname,
        invoice_number: paymentById?.invoice_number,
        class: paymentById?.class,
        admission_number: paymentById?.admission_number,
        term: paymentById?.term,
        session: paymentById?.session,
        amount_paid: paymentById?.amount_paid,
        payment_type: paymentById?.type,
        payment_method: paymentById?.payment_method,
        account_name: paymentById?.account_name,
        bank_name: paymentById?.bank_name,

        // total_amount:
      });
    }

    setAmount(paymentById?.total_amount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentById]);

  useEffect(() => {
    if (bank?.length > 1) {
      const bk = bank?.map((bk, i) => {
        return {
          title: `${bk?.bank_name} - ${bk?.account_number} (${bk?.account_name})`,
          value: `${bk?.bank_name} - ${bk?.account_number} (${bk?.account_name})`,
        };
      });
      setNewBank(bk);
    }
  }, [bank]);

  // console.log({
  //   newBank,
  //   bank,
  //   bankId,
  //   paymentById,
  // });

  return (
    <DetailView
      isLoading={isLoading || paymentLoading || paymentByIdLoading}
      pageTitle='Edit Payment'
      onFormSubmit={handleSubmit(onSubmit)}
    >
      <Row className='mb-0 mb-sm-4'>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            disabled
            // required
            label='Invoice Number'
            // hasError={!!errors.invoice_number}
            {...getFieldProps("invoice_number")}
          />
          {/* {!!errors.invoice_number && (
            <p className="error-message">{errors.invoice_number}</p>
          )} */}
        </Col>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            disabled
            label='Student Full Name'
            // required
            // hasError={!!errors.student_fullname}
            {...getFieldProps("student_fullname")}
          />
          {/* {!!errors.student_fullname && (
            <p className="error-message">{errors.student_fullname}</p>
          )} */}
        </Col>
      </Row>
      <Row className='mb-0 mb-sm-4'>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            disabled
            // required
            label='Class'
            // hasError={!!errors.invoice_number}
            {...getFieldProps("class")}
          />
          {/* {!!errors.invoice_number && (
            <p className="error-message">{errors.invoice_number}</p>
          )} */}
        </Col>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            disabled
            label='Admission Number'
            // required
            // hasError={!!errors.student_fullname}
            {...getFieldProps("admission_number")}
          />
          {/* {!!errors.student_fullname && (
            <p className="error-message">{errors.student_fullname}</p>
          )} */}
        </Col>
      </Row>
      <Row className='mb-0 mb-sm-4'>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            disabled
            // required
            label='Term'
            // hasError={!!errors.invoice_number}
            {...getFieldProps("term")}
          />
          {/* {!!errors.invoice_number && (
            <p className="error-message">{errors.invoice_number}</p>
          )} */}
        </Col>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            disabled
            label='Session'
            // required
            // hasError={!!errors.student_fullname}
            {...getFieldProps("session")}
          />
          {/* {!!errors.student_fullname && (
            <p className="error-message">{errors.student_fullname}</p>
          )} */}
        </Col>
      </Row>
      <Row className='mb-0 mb-sm-4'>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            label='Outstanding Amount'
            // required
            value={amount}
            readOnly
            // hasError={!!errors.total_amount}
            // {...getFieldProps("total_amount")}
          />
          {/* {!!errors.total_amount && (
            <p className="error-message">{errors.total_amount}</p>
          )} */}
        </Col>

        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            label='Amount Paid'
            type='number'
            required
            min={0}
            // hasError={!!errors.amount_paid}
            {...getFieldProps("amount_paid")}
          />
          {/* {!!errors.amount_paid && (
            <p className="error-message">{errors.amount_paid}</p>
          )} */}
        </Col>
      </Row>
      <Row className='mb-0 mb-sm-4'>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthSelect
            label='Payment Method'
            required
            value={inputs.payment_method}
            name='payment_method'
            // hasError={!!errors.term}
            onChange={handleChange}
            options={[
              { value: "Bank Deposit", title: "Bank Deposit" },
              { value: "Bank Transfer", title: "Bank Transfer" },
              { value: "Physical Cash", title: "Physical Cash" },
            ]}
          />
        </Col>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthSelect
            label='Payment Type'
            required
            value={inputs.payment_type}
            name='payment_type'
            // hasError={!!errors.term}
            onChange={handleChange}
            options={[
              { value: "complete-payment", title: "Complete Payment" },
              { value: "part-payment", title: "Part Payment" },
            ]}
          />
        </Col>
      </Row>
      {inputs.payment_method !== "Physical Cash" && (
        <Row className='mb-0 mb-sm-4'>
          {/* <Col sm='6' className='mb-4 mb-sm-0'>
            <AuthInput
              label='Account Name'
              required
              // hasError={!!errors.account_name}
              {...getFieldProps("account_name")}
            />
          </Col> */}
          <Col sm='6' className='mb-4 mb-sm-0'>
            <AuthSelect
              label='Bank Name'
              required
              value={inputs.account_name}
              name='account_name'
              // hasError={!!errors.term}
              onChange={(e) => {
                handleChange(e);
              }}
              options={newBank}
            />
          </Col>
          {/* <Col sm='6' className='mb-4 mb-sm-0'>
            <AuthInput
              label='Bank Name'
              required
              // hasError={!!errors.bank_name}
              {...getFieldProps("bank_name")}
            />
          </Col> */}
        </Row>
      )}
    </DetailView>
  );
};

export default PaymentEdit;
