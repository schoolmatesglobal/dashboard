import React, { useEffect } from "react";
import Button from "../../components/buttons/button";
import AuthInput from "../../components/inputs/auth-input";
import { useForm } from "react-formid";
// import AuthSelect from "../../components/inputs/auth-select";
import { useAuth } from "../../hooks/useAuth";
import { backendAPI, homeUrl } from "../../utils/constants";
import { useAppContext } from "../../hooks/useAppContext";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  const {
    setLoginPrompt,
    user,
    apiServices: { getToken },
    logout,
  } = useAppContext();

  const { login, isLoading } = useAuth();

  const token = getToken();

  const onSubmit = async (data) => {
    await login(data);
  };

  // useEffect(() => {
  //   if (token) {
  //     navigate(homeUrl[user?.designation_name]);
  //     // window.location.reload();
  //   }
  // }, [token]);

  // console.log({
  //   window,
  //   href: window.location.href,
  //   backendAPI,
  //   env: process.env.NODE_ENV,
  // });

  console.log({ user, token });

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
