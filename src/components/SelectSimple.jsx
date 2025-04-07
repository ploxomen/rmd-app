import React from "react";

export default function SelectSimple({
  isRequired = false,
  value = "",
  name = "",
  onChange = () => {},
  children,
  ...other
}) {
  return (
    <select
      required={isRequired}
      value={value}
      className="disabled:cursor-not-allowed disabled:bg-[#F2F2F2] border border-gray-300 text-placeholder text-xs rounded-lg block w-full p-2.5 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500"
      id={`id${name}`}
      name={name}
      onChange={onChange}
      {...other}
    >
      {children}
    </select>
  );
}
