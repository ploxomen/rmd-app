import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import Select from "react-select";
import { InputPrimary, SubmitForm, TextareaPrimary } from "../Inputs";
import Label from "../Label";
import { formProductProgress } from "@/helpers/valueFormProductProgress";
export default function FormProductProgress({
  products = [],
  statusModal,
  handleCloseModal,
  handleSaveHistory,
  editProductRaw,
  isEdit = false
}) {
  const [form, setForm] = useState(formProductProgress);
  const handleChangeForm = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const hanbleSendModal = () => {
    const formProduct = document.querySelector("#form-product-submit");
    formProduct.click();
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSaveHistory(form);
  };
  useEffect(() => {
    console.log(editProductRaw);
    setForm(
      editProductRaw.product_id !== null ? editProductRaw : formProductProgress
    );
  }, [editProductRaw]);
  return (
    <Modal
      status={statusModal}
      maxWidth="max-w-[750px]"
      title={form.idHistory ? "Editar registro" : "Agregar registro"}
      onSave={hanbleSendModal}
      handleCloseModal={handleCloseModal}
    >
      <form
        className="grid grid-cols-12 gap-x-3 gap-y-2"
        onSubmit={handleSubmit}
      >
        <div className="col-span-full">
          <Label text="Productos" htmlFor="product_list" required />
          <Select
            isDisabled={isEdit}
            instanceId="product_list"
            placeholder="Seleccione un producto"
            name="product_id"
            options={products.map((product) => ({
              label: product.product_name,
              value: product.product_id,
            }))}
            onChange={(e) => {
              setForm({
                ...form,
                product_id: e.value,
              });
            }}
            menuPosition="fixed"
            value={products
              .filter((product) => product.product_id === form.product_id)
              .map((product) => ({
                label: product.product_name,
                value: product.product_id,
              }))}
          />
        </div>
        <div className="col-span-6">
          <InputPrimary
            label="Fecha"
            type="date"
            name="date"
            inputRequired={true}
            value={form.date||""}
            onChange={handleChangeForm}
          />
        </div>
        <div className="col-span-6">
          <InputPrimary
            label="Cantidad"
            type="number"
            name="stock"
            inputRequired={true}
            value={form.stock||""}
            onChange={handleChangeForm}
          />
        </div>
        <div className="col-span-full">
          <TextareaPrimary
            label="Detalles"
            name="details"
            value={form.details||""}
            onChange={handleChangeForm}
          />
        </div>
        <SubmitForm id="form-product-submit" />
      </form>
    </Modal>
  );
}
