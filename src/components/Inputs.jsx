
export function InputPrimary({label,type="text",name,value,onChange,inputRequired = '',...restProps}) {
    return(
        <div className="text-sm mb-2">
            <label htmlFor={`id${name}`} className="text-sm mb-1 block dark:text-white text-placeholder">
                {label}
                {inputRequired && <span className="text-red-500 font-bold pl-1">*</span>}
            </label>
            <input required={inputRequired} className="border border-gray-300 text-placeholder text-sm rounded-lg block w-full p-2.5 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500" {...restProps} id={`id${name}`} type={type} value={value} name={name} onChange={onChange}/>
        </div>
    )
}
export function InputDetailsSm({type,value,name,...restProps}) {
    return (<input className="border border-gray-300 text-placeholder text-sm rounded-lg block w-full p-1.5 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500" id={`id${name}`} {...restProps} type={type} value={value} name={name}/>)
}
export function TextareaPrimary({label,name,value,onChange,inputRequired = '',...restProps}) {
    return(
        <div className="text-sm mb-2">
            <label htmlFor={`id${name}`} className="text-sm mb-1 block dark:text-white text-placeholder">
                {label}
                {inputRequired && <span className="text-red-500 font-bold pl-1">*</span>}
            </label>
            <textarea required={inputRequired} value={value} className="border break-words border-gray-300 text-placeholder text-sm rounded-lg block w-full p-2.5 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500" {...restProps} id={`id${name}`} name={name} onChange={onChange}></textarea>
        </div>
    )
}
export function InputSearch({value,onInput,placeholder="Buscar"}) {
    return(
        <input type="search" className="border border-gray-300 text-placeholder text-sm rounded-lg block w-full p-2.5 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500" placeholder={placeholder} value={value} onInput={onInput}/>
    )
}
export function InputLogin({label,type,name,value,onChange}) {
    return(
        <div className="text-sm mb-6 relative">
            <input autoComplete="on" onChange={onChange} className={`peer p-4 text-base border ring-1 transition-all ring-inset ring-gray-300 border-gray-300 rounded-md w-full text-placeholder tracking-wide focus:ring-inset focus:ring-blue-500`} id={`id${name}`} type={type} value={value} required name={name} />
            <label htmlFor={`id${name}`} className={`select-none absolute text-placeholder text-base font-normal mx-3 top-1/2	-translate-y-1/2 left-0 transition-all peer-focus:-top-0.5 bg-white px-1 peer-focus:text-blue-500 peer-focus:text-xs peer-valid:text-xs peer-valid:-top-0.5`}>{label}</label>
        </div>
    )
}
export function Checkbox({label = "",name,checked,onChange}) {
    return (
        <>
            <input id={`id${name}`} type="checkbox" checked={checked||false} onChange={onChange} className={`w-4 h-4 text-blue-600 border-2 p-2 bg-gray-200 border-white rounded focus:ring-blue-500 dark:focus:ring-blue-600 checked:bg-blue-500 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600`}/>
            <label htmlFor={`id${name}`} className="ms-2 font-medium text-placeholder dark:text-gray-300">{label}</label>
        </>
    )
}
export function SubmitForm({id}) {
    return(
        <input hidden type="submit" id={id}/>
    )
}
