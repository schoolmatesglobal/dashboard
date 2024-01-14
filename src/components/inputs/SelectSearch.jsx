import React, { useRef } from "react";
import Select, { StylesConfig } from "react-select";

const SelectSearch = ({
  options,
  isSearchable,
  name,
  defaultValue,
  placeholder,
  large,
  blue,
  setValue,
  errorCheck,
}) => {
  return (
    <div
      className={`${errorCheck ? "ring ring-secondary" : ""} rounded-[10px]`}
    >
      <Select
        defaultValue={defaultValue}
        isSearchable={isSearchable}
        name={name}
        options={options}
        placeholder={placeholder}
        isClearable={false}
        //   isDisabled={isDisabled}
        //   isLoading={isLoading}
        //   isRtl={isRtl}
        theme={(theme) => ({
          ...theme,
          borderRadius: 0,
          colors: {
            ...theme.colors,
            primary: blue ? "#eff4ff" : "#01153b",
            primary25: blue ? "#eff4ff" : "#eff4ff",
            primary50: blue ? "#eff4ff" : "#eff4ff",
            primary75: blue ? "#eff4ff" : "#eff4ff",
          },
        })}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderRadius: "10px",
            fontSize: "15px",
            borderColor: state.isFocused ? "#01153b" : "#01153b",
            //   padding: '7px 7px',
            padding: large ? "7px 7px" : "3px",
          }),
        }}
        onChange={(e) => {
          setValue(e.value);
          // console.log({ value: e });
        }}
      />
    </div>
  );
};

export default SelectSearch;
