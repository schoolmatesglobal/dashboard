import React, { useEffect, useState } from "react";
import { useForm } from "react-formid";
import { useMutation } from "react-query";
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
import { useBank } from "../../../hooks/useBank";

const PaymentDetail = () => {
  const { apiServices } = useAppContext();
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
      invoice_id: "",
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

  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [newBank, setNewBank] = useState([]);

  const { paymentLoading, payment } = useAccounts();

  const {
    bank,
    deleteBank,
    handleUpdateBank,
    isLoading: bankLoading,
  } = useBank();

  // const newBank = (function () {
  //   if (bank?.length < 1) {
  //     return bank?.map((bk, i) => {
  //       return {
  //         ...bk,
  //         title: `${bk?.bank_name} - ${bk?.account_number}`,
  //         value: `${bk?.bank_name} - ${bk?.account_number}`,
  //       };
  //     });
  //   }
  // })

  const { data: sessions } = useAcademicSession();
  const { isLoading: loadStudent, studentData, isEdit } = useStudent();
  const {
    isLoading: invoicesLoading,
    invoicesList,
    // apiServices,
    handlePrint,
    pdfExportComponent,
    user,
  } = useInvoices();

  const { id } = useParams();

  function fi() {
    return invoicesList?.find((iv) => iv?.id === id);
  }

  let calcAmount = 0;
  let calcAmount2 = 0;

  const filteredInvoice = fi();

  const { isLoading, mutate: createPayment } = useMutation(
    apiServices.postPayment,
    {
      onSuccess() {
        toast.success("Payment Successful");
        navigate(-1);
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
      inputs.payment_method === "Physical Cash" &&
      (!inputs?.amount_paid || !inputs?.payment_method || !inputs?.payment_type)
    ) {
      // setFeeError("feetype");
      toast.error(`Please add required field`);
      return;
    }
    if (
      inputs.payment_method !== "Physical Cash" &&
      (!inputs?.amount_paid ||
        !inputs?.payment_method ||
        // !inputs?.bank_name ||
        !inputs?.account_name ||
        !inputs?.payment_type)
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

    if (inputs.payment_method === "Physical Cash") {
      createPayment({
        student_id: filteredInvoice?.student_id,
        invoice_id: filteredInvoice?.id,
        bank_id: Number(bankId),
        bank_name: "none",
        account_name: "none",
        student_fullname: filteredInvoice?.fullname,
        payment_method: data?.payment_method,
        amount_paid: data?.amount_paid,
        total_amount: amount,
        type: data?.payment_type,
      });
    } else {
      createPayment({
        student_id: filteredInvoice?.student_id,
        invoice_id: filteredInvoice?.id,
        bank_id: Number(bankId),
        bank_name: data?.account_name,
        account_name: data?.account_name,
        student_fullname: filteredInvoice?.fullname,
        payment_method: data?.payment_method,
        amount_paid: data?.amount_paid,
        total_amount: amount,
        type: data?.payment_type,
      });
    }
  };

  function filterPayment() {
    if (payment?.length > 0) {
      const pt = payment?.filter(
        (pi) => Number(pi?.student_id) === Number(filteredInvoice?.student_id)
      );
      return pt[0]?.payment?.map((py, i) => {
        calcAmount2 = calcAmount2 + Number(py?.amount_paid);
        return {
          ...py,
          amount_paid: `₦${apiServices.formatNumberWithCommas(
            py?.amount_paid
          )}`,
          total_amount: `₦${apiServices.formatNumberWithCommas(
            py?.total_amount
          )}`,
          sum_amount: calcAmount2,
          // sum_amount: `₦${apiServices.formatNumberWithCommas(calcAmount2)}`,
        };
      });
    } else {
      return [];
    }
  }

  const fp = filterPayment() ?? [];

  useEffect(() => {
    if (isEdit) {
      setInputs({
        ...inputs,
        student_fullname: filteredInvoice?.fullname,
        invoice_id: filteredInvoice?.invoice_no,
        class: filteredInvoice?.class,
        admission_number: filteredInvoice?.admission_number,
        term: filteredInvoice?.term,
        session: filteredInvoice?.session,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, studentData]);

  useEffect(() => {
    if (filteredInvoice?.fee?.length > 0) {
      fi()?.fee?.forEach((fi, i) => {
        calcAmount =
          (Number(calcAmount) + Number(fi?.discount_amount)).toFixed(0) ?? 0;

        let dc = fp[fp?.length - 1]?.sum_amount ?? 0;

        let cc = (calcAmount - dc).toString();

        setAmount(cc);
      });
    }
  }, [invoicesList, amount]);

  useEffect(() => {
    if (bank?.length > 0) {
      const bk = bank?.map((bk, i) => {
        return {
          title: `${bk?.bank_name} - ${bk?.account_number} (${bk?.account_name})`,
          value: `${bk?.bank_name} - ${bk?.account_number} (${bk?.account_name})`,
        };
      });
      setNewBank(bk);
    }
  }, [bank]);

  console.log({ bank, inputs, newBank });

  // console.log({
  //   newBank,
  //   filteredInvoice,
  //   amount,
  //   fp,
  //   payment,
  //   bank,
  //   bankId,
  //   inputs,
  // });

  return (
    <DetailView
      isLoading={isLoading || invoicesLoading}
      pageTitle='Make Payment'
      onFormSubmit={handleSubmit(onSubmit)}
    >
      <Row className='mb-0 mb-sm-4'>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            disabled
            // required
            label='Invoice Number'
            // hasError={!!errors.invoice_id}
            {...getFieldProps("invoice_id")}
          />
          {/* {!!errors.invoice_id && (
            <p className="error-message">{errors.invoice_id}</p>
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
            // hasError={!!errors.invoice_id}
            {...getFieldProps("class")}
          />
          {/* {!!errors.invoice_id && (
            <p className="error-message">{errors.invoice_id}</p>
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
            // hasError={!!errors.invoice_id}
            {...getFieldProps("term")}
          />
          {/* {!!errors.invoice_id && (
            <p className="error-message">{errors.invoice_id}</p>
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
            label='Outstanding Amount (₦)'
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
            label='Amount Paid (₦)'
            type='number'
            required
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

export default PaymentDetail;
