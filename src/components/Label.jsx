import React from "react";

function Label({ text , htmlFor , required = false}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm mb-1 block dark:text-white text-placeholder"
    >
      {text} {required && <span className="text-red-500 font-bold pl-1">*</span> }
    </label>
  );
}

export default Label;
