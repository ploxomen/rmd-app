import React, { useEffect, useId, useState } from "react";
import Modal from "../Modal";
import { InputPrimary, SubmitForm, TextareaPrimary } from "../Inputs";
import CreatableSelect from 'react-select/creatable'
import Label from "../Label";
import SeccionForm from "../SeccionForm";
import apiAxios from "@/axios";
const dataForm = {
    id: null,
  store_name: "",
  store_description: "",
};
const dataSubStoreDefault = [];
function FormStore({ statusModal, closeModal, storeEdit, handleSubmitForm }) {
  const edit = Object.keys(storeEdit).length;
  const [form, setForm] = useState(dataForm);
  const [dataSubStore, setDataSubStore] = useState(dataSubStoreDefault);
  const hanbleSendModal = () => {
    const formProduct = document.querySelector("#form-store-submit");
    formProduct.click();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    handleSubmitForm({
        ...form,
        listSubStore: JSON.stringify(dataSubStore)
    })
  };
  const handleChangeForm = (e) => {
    setForm({
        ...form,
        [e.target.name]: e.target.value
    })
  }
  const handleCloseModal = () => {
    setForm(dataForm);
    setDataSubStore(dataSubStoreDefault);
    closeModal();
  }
  useEffect(()=>{
    setForm( edit ? storeEdit : dataForm);
    setDataSubStore(edit ? storeEdit.listSubStore : dataSubStoreDefault);
  },[storeEdit])
  return (
    <Modal
      status={statusModal}
      maxWidth="max-w-[750px]"
      title={form.id ? "Editar almacen" : "Nuevo almacen"}
      onSave={hanbleSendModal}
      handleCloseModal={handleCloseModal}
    >
      <form
        className="grid grid-cols-12 gap-x-3 gap-y-0"
        onSubmit={handleSubmit}
      >
        <div className="col-span-full">
          <SeccionForm title="Datos del almacen" />
        </div>
        <div className="col-span-full">
          <InputPrimary
            label="Nombre"
            type="text"
            inputRequired="required"
            name="store_name"
            value={form.store_name || ""}
            onChange={handleChangeForm}
          />
        </div>
        <div className="col-span-full">
          <TextareaPrimary
            label="Descripcion"
            name="store_description"
            value={form.store_description || ""}
            onChange={handleChangeForm}
          />
        </div>
        <div className="col-span-full">
          <SeccionForm title="Datos del sub almacen" />
        </div>
        <div className="col-span-full">
            <Label text='Sub almacenes' required htmlFor='list_sub_stores'/>
            <CreatableSelect
                isMulti
                instanceId={useId()}
                value={dataSubStore}
                onChange={e => setDataSubStore(e)}
                id="list_sub_stores"
            />
        </div>
        <SubmitForm id="form-store-submit" />
      </form>
    </Modal>
  );
}

export default FormStore;
