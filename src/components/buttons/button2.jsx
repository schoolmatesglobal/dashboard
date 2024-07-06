import React from "react";
import { Spinner } from "reactstrap";

const Button2 = ({
  children,
  className,
  block = false,
  variant,
  isLoading = false,
  ...rest
}) => {
  const getVariant = () => {
    switch (variant) {
      case "outline":
        return variant;

      case "outline-danger":
        return variant;

      case "danger":
        return variant;

      case "success":
        return variant;

      case "dark":
        return variant;

      case "warning":
        return variant;

      case "outline-dark":
        return variant;

      case "outline-warning":
        return variant;

      default:
        return null;
    }
  };

  return (
    <button
      // className={`custom-button fs-4 ${block ? "is-block" : ""} ${
      //   getVariant() || ""
      // } ${className || ""}`}
      // {...rest}
      className={` col flex-shrink-0 d-flex align-items-center gap-2 justify-content-center ${
        getVariant() || ""} ${className || ""}`}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
};

export default Button2;
