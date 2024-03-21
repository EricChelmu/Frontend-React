import React from "react";
import "../index.css";

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, type, value, onChange }) => (
  <div>
    <label className="input-form">{label}</label>
    <input type={type} value={value} onChange={onChange} />
  </div>
);

export default InputField;
