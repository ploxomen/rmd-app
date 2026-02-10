import React from "react";
import Modal from "../Modal";
import { InputPrimary } from "../Inputs";

export default function FormModalChangeMoney({
  status = "hidden",
  form = {},
  handleSubmit = () => {},
  handleChangeValueForm = () => {},
  handleCloseModal = () => {}
}) {
  return (
    <Modal
      status={status}
      title="Establecer Tipo Cambio"
      onSave={"form-change-money"}
      handleCloseModal={handleCloseModal}
    >
      <form
        onSubmit={handleSubmit}
        id="form-change-money"
        className="grid grid-cols-12 gap-2"
      >
        <div className="col-span-12 md:col-span-6">
          <InputPrimary
            label="Fecha"
            type="date"
            name="change_day"
            inputRequired="required"
            value={form.change_day}
            onChange={handleChangeValueForm}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <InputPrimary
            label="Monto"
            type="number"
            step="0.01"
            min="0.01"
            name="change_soles"
            inputRequired="required"
            value={form.change_soles}
            onChange={handleChangeValueForm}
          />
        </div>
        {
            form.change_attempts !== 0 && (
                <div className="col-span-12"><span className="text-xs text-blue-500">Numero de intentos {form.change_attempts}</span></div>
            )
        }
      </form>
    </Modal>
  );
}
