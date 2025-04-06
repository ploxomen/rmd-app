import React from "react";
import Modal from "../Modal";
import { InputPrimary, SubmitForm } from "../Inputs";
import apiAxios from "@/axios";
import { getCookie } from "@/helpers/getCookie";
import { sweetAlert } from "@/helpers/getAlert";

function FormMoney({ status, valueMoney, changeMoney, closeModal}) {
    const headers = getCookie();
  const hanbleSendModal = () => {
    const formChangeMoney = document.querySelector("#form-change-money");
    formChangeMoney.click();
  };
  const handelSubmitChangeMoney = async e => {
    e.preventDefault();
    const response = await apiAxios.post('/money/change',{
        money: valueMoney.money
    },{headers})
    if(response.data.alert){
        return sweetAlert({ title: "Alerta", text: response.data.alert, icon: "warning" });
    }
    changeMoney({
        attempt: response.data.data.change_attempts,
        money: response.data.data.change_soles,
    })
    closeModal();
    sweetAlert({ title: "Alerta", text: response.data.message, icon: "success" });

  }
  return (
    <Modal status={status} title="Establecer Tipo Cambio" onSave={hanbleSendModal} handleCloseModal={closeModal}>
      <form onSubmit={handelSubmitChangeMoney}>
        <InputPrimary
          label="Monto"
          type="number"
          step="0.01"
          min="0.01"
          name=""
          inputRequired="required"
          value={valueMoney.money}
          onChange={e => changeMoney({money : e.target.value, attempt: 0})}
        />
        <SubmitForm id="form-change-money" />
      </form>
    </Modal>
  );
}

export default FormMoney;
