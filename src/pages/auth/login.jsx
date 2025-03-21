import React from "react";
import Button from "../../components/buttons/button";
import AuthInput from "../../components/inputs/auth-input";
import { useForm } from "react-formid";
// import AuthSelect from "../../components/inputs/auth-select";
import { useAuth } from "../../hooks/useAuth";
import { backendAPI } from "../../utils/constants";

const Login = () => {
  const { inputs, handleSubmit, handleChange, errors } = useForm({
    defaultValues: { username: "", password: "" },
    validation: {
      username: {
        required: true,
      },
      password: {
        required: true,
      },
    },
  });

  const { login, isLoading } = useAuth();

  const onSubmit = async (data) => {
    await login(data);
  };

  // console.log({
  //   window,
  //   href: window.location.href,
  //   backendAPI,
  //   env: process.env.NODE_ENV,
  // });

  return (
    <div className='login-page'>
      <div className='page-content-wrapper'>
        <h3 className='page-title'>Welcome!</h3>
        <p className='page-subtitle'>Enter details to login.</p>
        <form
          className='form-wrapper'
          autoComplete='off'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='form-group'>
            <AuthInput
              type='text'
              placeholder='Username'
              hasError={!!errors.username}
              value={inputs.username}
              name='username'
              onChange={handleChange}
            />
            {!!errors.username && (
              <p className='error-message'>{errors.username}</p>
            )}
          </div>
          <div className='form-group'>
            <AuthInput
              type='password'
              placeholder='Password'
              hasError={!!errors.password}
              value={inputs.password}
              name='password'
              onChange={handleChange}
            />
            {!!errors.password && (
              <p className='error-message'>{errors.password}</p>
            )}
          </div>
          <div className='form-group'>
            <Button
              block
              disabled={isLoading}
              isLoading={isLoading}
              type='submit'
            >
              Log In
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
