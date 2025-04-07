import React from 'react'
import Modal from '../Modal'
import { InputPrimary, SubmitForm } from '../Inputs'
function FormResetPasswordAdmin({statusModal,closeModal, password, setPassword, handleSubmit}) {
    const saveModal = () => {
        document.querySelector('#form-reset-password-user').click()
    }
  return (
    <Modal title="Cambio contraseña global" status={statusModal} onSave={saveModal} handleCloseModal={closeModal}>
        <form onSubmit={handleSubmit}>
            <InputPrimary label="Contraseña" name="password" inputRequired="required" value={password} onChange={e => setPassword(e.target.value)}/>
            <SubmitForm id="form-reset-password-user"/>
        </form>
    </Modal>
  )
}

export default FormResetPasswordAdmin