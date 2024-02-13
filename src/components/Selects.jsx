export function SelectPrimary({name,onChange,label,inputRequired,children,value,defaultValue}) {
    return(
        <div className="text-sm mb-3">
            <label htmlFor={`id${name}`} className="text-sm mb-1 block dark:text-white text-placeholder">
                {label}
                {inputRequired && <span className="text-red-500 font-bold pl-1">*</span>}    
            </label>
            <select required={inputRequired} defaultValue={defaultValue} value={value} className="border border-gray-300 text-placeholder text-sm rounded-lg block w-full p-2.5 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500" id={`id${name}`} name={name} onChange={onChange}>
                {children}
            </select>
        </div>
    )
}