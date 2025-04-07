import React, { useEffect, useState } from 'react'
import { InputPrimary, SubmitForm } from '../Inputs';
import Modal from '../Modal';
const passwordDefault = "sistema123";
function FormResetPasswordUser({statusModalReset,handleResetPassword,closeModal,resetPassword}) {
    const [reset,setReset] = useState("sistema123");
    useEffect(() => {
        setReset(passwordDefault);
    },[statusModalReset]);
    const handleSubmit = (e) => {
        e.preventDefault();
        resetPassword(reset);
    }
    const handleSaveModal = () => {
        const formResetPassword = document.querySelector("#form-reset-user");
        formResetPassword.click();
    }
  return (
    <Modal title="Restablecer usuario" status={statusModalReset} onSave={handleSaveModal} handleCloseModal={closeModal}>
        <form onSubmit={handleSubmit}>
            <InputPrimary label="Nueva contraseña" name="reset_password" inputRequired="required" value={reset} onChange={e => setReset(e.target.value)}/>
            <SubmitForm id="form-reset-user"/>
        </form>
    </Modal>
  )
}

export default FormResetPasswordUser