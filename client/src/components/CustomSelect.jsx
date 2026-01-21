import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

function CustomSelect({ options, value, onChange, className = "" }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full border-2 rounded-lg px-4 py-3 flex justify-between items-center bg-white"
      >
        {value}
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {open && (
        <div className={`absolute mt-2 w-full rounded-xl bg-white shadow-xl border overflow-hidden z-50 ${className}`}>
          {options.map(option => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-3 hover:bg-brand-primary/10 transition"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
export default CustomSelect;
