import React from "react";
import Button from "./button";

const ButtonGroup2 = ({ options = [], wrapperClassName, className }) => {
  return (
    <div className={`my-3 row gap-3 ${wrapperClassName || ""}`}>
      {options?.map(({ title, ...obj }, key) => (
        <Button key={key} {...obj} className={` col ${className || ""}`}>
          {title}
        </Button>
      ))}
    </div>
  );
};

export default ButtonGroup2;
