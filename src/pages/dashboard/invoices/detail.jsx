import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useForm } from "react-formid";
import { toast } from "react-toastify";
import { Col, Row, Button as Btn } from "reactstrap";
import AuthInput from "../../../components/inputs/auth-input";
import AuthSelect from "../../../components/inputs/auth-select";
import DetailView from "../../../components/views/detail-view";
import { useAcademicSession } from "../../../hooks/useAcademicSession";
import { useAppContext } from "../../../hooks/useAppContext";
import { useStudent } from "../../../hooks/useStudent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBucket, faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import StudentsResults from "../../../components/common/students-results";
import { useInvoices } from "../../../hooks/useInvoice";
import { useMutation, useQuery } from "react-query";
import queryKeys from "../../../utils/queryKeys";
import StudentsResults2 from "../../../components/common/students-results2";
import { Spinner } from "reactstrap";

const InvoiceDetail = () => {
  // const { apiServices } = useAppContext();

  function formatNumberWithCommas(number) {
    // Convert the number to a string
    // var numberString = number.toString();

    // Use regular expression to add commas
    var formattedNumber = number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return formattedNumber;
  }

  // const { studentByClass2 } = useStudent();

  const {
    apiServices,
    errorHandler,
    permission,
    user,
    invoicesList,
    getInvoiceRefetch,
  } = useInvoices();

  const { data: sessions } = useAcademicSession();
  const { isLoading: loadStudent, studentData, isEdit } = useStudent();

  // const feesDemo = [
  //   { value: "School fees", title: "School fees", price: 200000 },
  //   { value: "Uniform fees", title: "Uniform fees", price: 30000 },
  //   { value: "School Bus fees", title: "School Bus fees", price: 40000 },
  // ];

  const { id } = useParams();

  const [newId, setNewId] = useState(id);

  const [feetype, setFeetype] = useState("");
  // const [due_date, setDueDate] = useState("");

  const [amount, setAmount] = useState("");
  const [discount, setDiscount] = useState("0");
  const [fees, setFees] = useState([]);
  const [fees2, setFees2] = useState([]);
  const [feeError, setFeeError] = useState("initial");
  const [classLoading, setClassLoading] = useState(true);

  const { data: Fee, isLoading: feeLoading } = useQuery(
    [queryKeys.GET_FEE_LIST],
    apiServices.getFeeList,
    {
      onError(err) {
        apiServices.errorHandler(err);
      },
      select: apiServices.formatData,
    }
  );

  // const {
  //   data: Invoice,
  //   isLoading: invoiceLoading,
  //   refetch: getInvoiceRefetch,
  // } = useQuery(["GET_INVOICE"], apiServices.getInvoices, {
  //   onError(err) {
  //     apiServices.errorHandler(err);
  //   },
  //   select: apiServices.formatData,
  // });

  function feesDemo2() {
    const ff = Fee?.map((f, i) => {
      return {
        value: f?.feetype,
        title: f?.feetype,
        price: f?.amount,
      };
    });

    return ff;
  }

  const feesDemo = feesDemo2();

  function defaultAmount() {
    const amt = feesDemo?.find((fd) => fd?.value === feetype);
    return amt?.price;
  }

  useEffect(() => {
    setFees2([
      {
        feetype,
        amount: defaultAmount()?.toString(),
        discount,
        discount_amount: (
          Number(defaultAmount()) -
          (Number(defaultAmount()) * Number(discount)) / 100
        )?.toString(),
      },
    ]);
    if (feetype) {
      setAmount(defaultAmount());
    } else {
      setAmount("");
    }
  }, [feetype, discount]);

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
      // session: "",
      // term: "",
      admission_number: "",
      fullname: "",
      student_id: "",
      class: "",
      due_date: "",
      // feetype: "",
      // amount: "",
      // discount: "0",
      // fees: [
      //   {
      //     feetype: "",
      //     amount: "",
      //     discount: "",
      //   },
      // ],
    },
    // validation: {
    //   session: { required: true },
    //   admission_number: { required: true },
    //   fullname: { required: true },
    //   student_id: { required: true },
    //   class: { required: true },
    //   // feetype: { required: true },
    //   // amount: { required: true },
    //   // discount: { required: true },
    // },
  });

  // const { apiServices, permission } = useAppContext();

  // const studentId = id

  const { data: studentByClass2, isLoading: studentByClass2Loading } = useQuery(
    [queryKeys.GET_ALL_STUDENTS_BY_CLASS2, studentData?.present_class],
    () => apiServices.getStudentByClass2(studentData?.present_class),
    // state?.creds?.class_name
    //   ? state?.creds?.class_name
    //   : user?.class_assigned
    // apiServices.getStudentByClass2(
    //   user?.class_assigned || principalClassName
    // ),
    {
      // enabled: permission?.myStudents || user?.designation_name === "Principal",
      enabled: classLoading,
      // select: apiServices.formatData,
      select: (data) => {
        const filtered = apiServices
          .formatData(data)
          ?.filter((obj) => obj?.class === studentData?.present_class);
        // console.log({ pdata: data, state });
        return apiServices.formatData(data)?.map((obj, index) => {
          const newObj = { ...obj };
          newObj.new_id = index + 1;
          // newObj.id = index + 1;
          return newObj;
        });

        // return { ...data, options: f };
      },
      onError(err) {
        apiServices.errorHandler(err);
      },
    }
  );

  const { isLoading: getStudentLoading, data: singleStudent } = useQuery(
    ["GET_STUDENT2", newId],
    () => apiServices.getStudent(newId),
    {
      retry: 3,
      onError(err) {
        apiServices.errorHandler(err);
      },
      enabled: !!newId,
      select: apiServices.formatSingleData,
    }
  );

  const { isLoading: postInvoiceLoading, mutate: createInvoicePost } =
    useMutation(apiServices.postInvoice, {
      onSuccess() {
        toast.success("Invoice created Successfully");
      },

      onError(err) {
        apiServices.errorHandler(err);
      },
    });

  const { mutateAsync: updateInvoice, isLoading: updateInvoiceLoading } =
    useMutation(apiServices.updateInvoice, {
      onSuccess() {
        toast.success("Invoice has been updated successfully");
        getInvoiceRefetch();
      },
      onError(err) {
        apiServices.errorHandler(err);
      },
    });

  const handleUpdateInvoice = async (data) => await updateInvoice(data);

  function fi() {
    const ffs = invoicesList?.find(
      (inv) => inv?.admission_number === singleStudent?.admission_number
    );
    return ffs;
  }

  const filteredInvoice2 = fi() ?? {};
  const filteredInvoice = fi()?.fee ?? [];
  const invoiceId = fi()?.id;

  // console.log({ Fee, filteredInvoice });

  const allLoading = studentByClass2Loading || getStudentLoading;

  const onSubmit = (data) => {
    if (fees?.length === 0) {
      // setFeeError("feetype");
      toast.error(`Please add atleast one Fee type`);
      return;
    }
    if (!inputs?.due_date) {
      // setFeeError("feetype");
      toast.error(`Please add due date for invoice`);
      return;
    }
    //  else if (!inputs?.term) {
    //   toast.error(`Term field is required`);
    //   return;
    // } else if (!inputs?.session) {
    //   toast.error(`Session field is required`);
    //   return;
    // }

    // const amount = data.amount.replace(/,/g, "");
    // const discount_amount =
    //   Number(amount) - (Number(amount) * Number(discount)) / 100;

    if (filteredInvoice?.length > 0) {
      handleUpdateInvoice({
        id: invoiceId,
        due_date: data?.due_date,
        // ...data,
        fee: [...fees],
      });

      // console.log({
      //   id: invoiceId,
      //   due_date: data?.due_date,
      //   fee: [...fees],
      // });
    } else {
      createInvoicePost({
        body: {
          ...data,
          // due_date: data?.due_date,
          fee: [...fees],
        },
      });
    }

    console.log({
      ...data,
      fee: [...fees],
      // discount_amount,
    });
  };

  useEffect(() => {
    if (isEdit) {
      setInputs({
        ...inputs,
        due_date: filteredInvoice2?.due_date,
        admission_number: singleStudent?.admission_number,
        fullname: `${singleStudent?.firstname ?? ""} ${
          singleStudent?.surname ?? ""
        } ${singleStudent?.middlename ?? ""}`,
        student_id: singleStudent?.id,
        class: singleStudent?.present_class,
      });
      setFees([...filteredInvoice]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, singleStudent]);

  useEffect(() => {
    setFees([...filteredInvoice]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newId]);

  console.log({
    // studentData,
    filteredInvoice2,
    date: inputs?.due_date,
    filteredInvoice,
    invoicesList,
    // defaultAmount: defaultAmount(),
    // feeError,
    // feetype,
    // discount,
    // amount,
    fees,
    fees2,
    // feesDemo,
    user,
    // studentByClass2,
    // newId,
    singleStudent,
    invoiceId,
  });

  return (
    <div className='results-sheet'>
      {user?.designation_name !== "Student" && (
        <StudentsResults2
          studentByClassAndSession={studentByClass2}
          onProfileSelect={setNewId}
          onProfileSelect2={() => {
            setClassLoading(false);
            setFeetype("");
            setDiscount("0");
            setAmount("");
            setFees([]);
            setInputs({
              ...inputs,
              session: "",
              term: "",
            });
          }}
          // onProfileSelect={(x) => {
          //   // setStudentData(x);
          //   setNewId()
          //   // setInitGetExistingResult(true);
          // }}
          isLoading={getStudentLoading}
          studentData={singleStudent}
          // idWithComputedResult={idWithComputedResult}
        />
      )}
      <DetailView
        hasGoBack={false}
        isLoading={postInvoiceLoading || updateInvoiceLoading}
        pageTitle='Create Invoice'
        onFormSubmit={handleSubmit(onSubmit)}
      >
        {!allLoading && (
          <>
            <Row className='mb-0 mb-sm-4'>
              <Col sm='6' className='mb-4 mb-sm-0'>
                <AuthInput
                  disabled
                  // required
                  label='Student ID'
                  hasError={!!errors.student_id}
                  {...getFieldProps("student_id")}
                />
                {!!errors.student_id && (
                  <p className='error-message'>{errors.student_id}</p>
                )}
              </Col>
              <Col sm='6' className='mb-4 mb-sm-0'>
                <AuthInput
                  disabled
                  // required
                  label='Full Name'
                  hasError={!!errors.fullname}
                  {...getFieldProps("fullname")}
                />
                {!!errors.fullname && (
                  <p className='error-message'>{errors.fullname}</p>
                )}
              </Col>
            </Row>
            <Row className='mb-0 mb-sm-4'>
              <Col sm='6' className='mb-4 mb-sm-0'>
                <AuthInput
                  disabled
                  // required
                  label='Class'
                  hasError={!!errors.class}
                  {...getFieldProps("class")}
                />
                {!!errors.class && (
                  <p className='error-message'>{errors.class}</p>
                )}
              </Col>
              <Col sm='6' className='mb-4 mb-sm-0'>
                <AuthInput
                  disabled
                  // required
                  label='Admission Number'
                  hasError={!!errors.admission_number}
                  {...getFieldProps("admission_number")}
                />
                {!!errors.admission_number && (
                  <p className='error-message'>{errors.admission_number}</p>
                )}
              </Col>
            </Row>
            <hr className='my-5' />
            {fees?.map((fe, index) => (
              <Row key={index} className='my-5'>
                <Col sm='6' className='mb-4 mb-sm-0'>
                  <AuthInput
                    label='Fee Type'
                    disabled
                    value={fe.feetype}
                    // hasError={!!errors.feetype}
                    // hasError={feeError === "feetype"}
                    // {...getFieldProps("feetype")}
                  />
                  {feeError === "feetype" && (
                    <p className='error-message'>Field is required</p>
                  )}
                </Col>
                <Col sm='4' className='mb-4 mb-sm-0'>
                  <AuthInput
                    label='Amount'
                    disabled
                    // required
                    type='text'
                    min='0'
                    // hasError={!!errors.amount}
                    name='amount'
                    value={formatNumberWithCommas(fe?.amount)}
                  />
                  {/* {!!errors.amount && (
                <p className='error-message'>{errors.amount}</p>
              )} */}
                </Col>
                <Col sm='2' className='mb-4 mb-sm-0'>
                  <div className='d-flex align-items-center gap-3'>
                    <div className='flex-1'>
                      <AuthInput
                        type='number'
                        disabled
                        // required
                        min='0'
                        label='Discount (%)'
                        value={fe.discount}
                        // hasError={!!errors.discount}
                        // onChange={(e) => {
                        //   setDiscount(e.target.value);
                        // }}
                        // {...getFieldProps("discount")}
                      />
                    </div>
                    <div className=''>
                      {
                        <Btn
                          outline
                          type='button'
                          color='danger'
                          className='me-3'
                          onClick={() => {
                            const format = fees?.filter((_, k) => k !== index);
                            setFees([...format]);
                          }}
                        >
                          <FontAwesomeIcon icon={faBucket} />
                        </Btn>
                      }
                    </div>
                  </div>
                  {!!errors.discount && (
                    <p className='error-message'>{errors.discount}</p>
                  )}
                </Col>
              </Row>
            ))}
            <Row className='my-5'>
              <Col sm='6' className='mb-4 mb-sm-0'>
                {/* <AuthInput
                label='Fee Type'
                hasError={!!errors.feetype}
                {...getFieldProps("feetype")}
              /> */}
                <AuthSelect
                  label='Fee Type'
                  name='feetype'
                  value={feetype}
                  // defaultValue={fe.feetype}
                  // hasError={!!errors.feetype}
                  onChange={(e) => {
                    setFeetype(e.target.value);
                    // setFees([
                    //   {
                    //     feetype: e.target.value,
                    //     amount: defaultAmount(),
                    //     discount,
                    //   },
                    // ]);
                  }}
                  options={feesDemo}
                  // {...getFieldProps("feetype")}
                />
                {!!errors.feetype && (
                  <p className='error-message'>{errors.feetype}</p>
                )}
              </Col>
              <Col sm='4' className='mb-4 mb-sm-0'>
                <AuthInput
                  label='Amount'
                  // disabled
                  placeholder='No fee type selected'
                  readOnly
                  type='text'
                  min='0'
                  hasError={!!errors.amount}
                  name='amount'
                  value={formatNumberWithCommas(amount)}
                  // value={inputs.amount}
                  // onChange={(e) =>
                  //   apiServices.onAmountChange(
                  //     e,
                  //     handleChange,
                  //     setFieldValue,
                  //     "amount"
                  //   )
                  // }
                  // {...getFieldProps("amount")}
                />
                {!!errors.amount && (
                  <p className='error-message'>{errors.amount}</p>
                )}
              </Col>
              <Col sm='2' className='mb-4 mb-sm-0'>
                <div className='d-flex align-items-center gap-3'>
                  <div className='flex-1'>
                    <AuthInput
                      type='number'
                      placeholder='e.g  5'
                      min='0'
                      label='Discount (%)'
                      hasError={!!errors.discount}
                      onChange={(e) => {
                        setDiscount(e.target.value);
                      }}
                      value={discount}
                      // {...getFieldProps("discount")}
                    />
                  </div>
                  <div className=''>
                    <Btn
                      type='button'
                      color='primary'
                      // disabled={!fe}
                      onClick={() => {
                        if (!feetype || !discount) return;
                        setFees([...fees, ...fees2]);
                        setFeetype("");
                        setDiscount("0");
                        setAmount("");
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </Btn>
                  </div>
                </div>
                {!!errors.discount && (
                  <p className='error-message'>{errors.discount}</p>
                )}
              </Col>
            </Row>
            <Row className='my-5'>
              <Col sm='6' className='mb-4 mb-sm-0'>
                <AuthInput
                  label='Invoice Due Date'
                  required
                  type='date'
                  hasError={!!errors.due_date}
                  // value={inputs.dob}
                  {...getFieldProps("due_date")}
                />
                {/* {!!errors.due_date && <p className='error-message'>{errors.due_date}</p>} */}
              </Col>
            </Row>
            {/* <hr className='my-5' /> */}
          </>
        )}
        {allLoading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              padding: "50px 0px",
            }}
          >
            <Spinner />
          </div>
        )}
      </DetailView>
    </div>
  );
};

export default InvoiceDetail;
