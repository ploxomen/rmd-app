import { useEffect, useState } from "react";
import { InputPrimary } from "../Inputs";
import { ButtonDanger, ButtonPrimary } from "../Buttons";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/solid";

const initialForm = {
    id:null,
    rol_name : ""
}
function FormRole({dataToEdit,sendData,setDataToEdit}) {
    const [form, setForm] = useState(initialForm);
    useEffect(()=>{
        setForm(dataToEdit ? dataToEdit : initialForm);
    },[dataToEdit]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        sendData(form);
    }
    const handleClear = () => {
        setDataToEdit(null);
    }
    return(
        <form className='w-full p-6 h-full bg-white rounded-md shadow md:w-1/3 mb-3' onSubmit={handleSubmit}>
            <InputPrimary onChange={handleChange} inputRequired={'required'} label="Nombre" type="text" name="rol_name" value={form.rol_name}/>
            <div className='text-center'>
                <ButtonPrimary type="submit" text={form.id ? "Actualizar" : "Agregar"} icon={<PlusCircleIcon className="h-5 w-5"/>}/>
                <ButtonDanger type="button" text="Cancelar" onClick={handleClear} icon={<TrashIcon className="h-5 w-5"/> }/>
            </div>
        </form>
    )
}
export default FormRole;