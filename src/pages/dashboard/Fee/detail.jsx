import React from "react";
import { useForm } from "react-formid";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { Col, Row } from "reactstrap";
import AuthInput from "../../../components/inputs/auth-input";
import DetailView from "../../../components/views/detail-view";
import { useAppContext } from "../../../hooks/useAppContext";
import AuthSelect from "../../../components/inputs/auth-select";

const FeeDetail = () => {
  const { apiServices, user } = useAppContext();

  const { isLoading, mutate: createPost } = useMutation(apiServices.postFee, {
    onSuccess() {
      toast.success("Fee has been created");
    },

    onError(err) {
      apiServices.errorHandler(err);
    },
  });

  const { handleSubmit, errors, getFieldProps, inputs, handleChange } = useForm(
    {
      defaultValues: {
        feetype: "",
        amount: "",
        term: "",
        fee_status: "",
        category: "",
      },
    }
  );

  const onSubmit = (data) => {
    createPost({
      body: {
        ...data,
        id: user.id,
      },
    });
  };

  return (
    <DetailView
      isLoading={isLoading}
      pageTitle='Create Fee'
      onFormSubmit={handleSubmit(onSubmit)}
    >
      <Row className='mb-0 mb-sm-4'>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            label='Fee Type'
            required
            hasError={!!errors.feetype}
            placeholder='e.g School fees'
            {...getFieldProps("feetype")}
          />
          {!!errors.feetype && (
            <p className='error-message'>{errors.feetype}</p>
          )}
        </Col>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            label='Amount'
            required
            min="0"
            type='number'
            hasError={!!errors.amount}
            placeholder='e.g 20000'
            {...getFieldProps("amount")}
          />
          {!!errors.amount && <p className='error-message'>{errors.amount}</p>}
        </Col>
      </Row>
      <Row className='mb-0 mb-sm-4'>
        <Col sm='6' className='mb-4 mb-sm-0'>
          {/* <AuthInput
            label="Term"
            required
            hasError={!!errors.term}
            {...getFieldProps("term")}
          /> */}
          <AuthSelect
            label='Term'
            required
            value={inputs.term}
            name='term'
            hasError={!!errors.term}
            onChange={handleChange}
            options={[
              { value: "First Term", title: "First Term" },
              { value: "Second Term", title: "Second Term" },
              { value: "Third Term", title: "Third Term" },
            ]}
          />
          {!!errors.term && <p className='error-message'>{errors.term}</p>}
        </Col>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            label='Fee Status'
            hasError={!!errors.fee_status}
            placeholder='e.g Status'
            {...getFieldProps("fee_status")}
          />
          {!!errors.fee_status && (
            <p className='error-message'>{errors.fee_status}</p>
          )}
        </Col>
      </Row>
      <Row className='mb-0 mb-sm-4'>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthInput
            label='Category'
            hasError={!!errors.category}
            placeholder='e.g Category'
            {...getFieldProps("category")}
          />
          {!!errors.category && (
            <p className='error-message'>{errors.category}</p>
          )}
        </Col>
      </Row>
    </DetailView>
  );
};

export default FeeDetail;
