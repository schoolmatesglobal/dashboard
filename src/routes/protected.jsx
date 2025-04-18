import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../hooks/useAppContext";

const Protected = ({ children }) => {
  
  const {
    setLoginPrompt,
    user,
    apiServices: { getToken },
    logout,
  } = useAppContext();

  const [canAccess, setCanAccess] = useState(null);
  
  const token = getToken();

  const ol = Object.keys(user).length;

  useEffect(() => {

    if (!token) {
     
      logout();

    } else {
      setCanAccess(true);
    }

  }, [user, token, setLoginPrompt]);

  console.log({ token, user, ol });

  if (canAccess === null) return <div />;

  if (!canAccess) return <Navigate to='/auth' replace />;

  return children;
};

export default Protected;
