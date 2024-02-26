export function ButtonPrimary({type = "button",text,icon,onClick}) {
    return (
        <button className="rounded-md relative inline-flex group items-center justify-center px-3.5 py-2 m-1 cursor-pointer border-b-4 border-l-2 hover:bg-green-600 font-semibold transition-all ease-in-out shadow-lg bg-gradient-to-tr bg-green-500 text-white" type={type} onClick={onClick}>
            <div className="flex justify-center items-center gap-1">
                {icon}
                <span className="relative">{text}</span>
            </div>
            <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-focus:w-full group-hover:h-32 opacity-10"></span>
        </button>
    )
}
export function ButtonDanger({type="button",text,onClick,icon}) {
    return (
        <button className="rounded-md relative inline-flex group items-center justify-center px-3.5 py-2 m-1 cursor-pointer border-b-4 border-l-2 hover:bg-red-600 font-semibold transition-all ease-in-out shadow-lg bg-gradient-to-tr bg-red-500 text-white" type={type} onClick={onClick}>
            <div className="flex justify-center items-center gap-1">
                {icon}
                {text && <span className="relative">{text}</span>}
            </div>
            <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-focus:w-full group-hover:h-32 opacity-10"></span>
        </button>
    )
}
export function ButtonLogin({type,text}) {
    return (
        <button className="rounded relative w-full inline-flex group items-center justify-center px-3.5 py-2 m-1 cursor-pointer border-b-4 border-l-2 hover:bg-green-600 transition-all ease-in-out shadow-lg bg-gradient-to-tr bg-green-500 text-white" type={type}>
            <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-focus:w-full group-hover:h-32 opacity-10"></span>
            <span className="relative">{text}</span>
        </button>
    )
}
export function ButtonPrimarySm({type="button",text,onClick,icon}) {
    return (
        <button className="rounded-md relative overflow-hidden inline-flex group items-center justify-center px-2 py-1.5 cursor-pointer border-b-4 border-l-2 hover:bg-green-600 font-semibold transition-all ease-in-out text-xs shadow-lg bg-gradient-to-tr bg-green-500 text-white" type={type} onClick={onClick}>
            <div className="flex justify-center items-center gap-0.5">
                {icon}
                <span>{text}</span>
            </div>
            <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-focus:w-full group-hover:h-32 opacity-10"></span>
        </button>
    )
}
export function ButtonSecondarySm({type="button",text,onClick,icon}) {
    return (
        <button className="rounded-md relative overflow-hidden inline-flex group items-center justify-center px-2 py-1.5 cursor-pointer border-b-4 border-l-2 hover:bg-blue-600 font-semibold transition-all ease-in-out text-xs shadow-lg bg-gradient-to-tr bg-blue-500 text-white" type={type} onClick={onClick}>
            <div className="flex justify-center items-center gap-0.5">
                {icon}
                {text && <span className="relative">{text}</span>}
            </div>
            <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-focus:w-full group-hover:h-32 opacity-10"></span>
        </button>
    )
}
export function ButtonDangerSm({type="button",text,onClick,icon}) {
    return (
        <button className="rounded-md relative overflow-hidden inline-flex group items-center justify-center px-2 py-1.5 cursor-pointer border-b-4 border-l-2 hover:bg-red-600 font-semibold transition-all ease-in-out text-xs shadow-lg bg-gradient-to-tr bg-red-500 text-white" type={type} onClick={onClick}>
            <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-focus:w-full group-hover:h-32 opacity-10"></span>
            <div className="flex justify-center items-center gap-0.5">
                {icon}
                {text && <span className="relative">{text}</span>}
            </div>
        </button>
    )
}