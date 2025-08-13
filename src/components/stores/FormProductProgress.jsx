import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import Select from "react-select";
import { InputPrimary, SubmitForm, TextareaPrimary } from "../Inputs";
import Label from "../Label";
import { formProductProgress } from "@/helpers/valueFormProductProgress";
import { optionsUnitsMeasurements } from "@/helpers/listUnitsMeasurements";
import { SelectPrimary } from "../Selects";

export default function FormProductProgress({
  products = [],
  statusModal,
  handleCloseModal,
  handleSaveHistory,
  editProductRaw,
  isEdit = false,
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
    setForm((value) => ({...value,total: (form.price_unit * form.stock).toFixed(2)}))
  },[form.price_unit,form.stock])
  useEffect(() => {
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
              unit_measurement: product.product_unit_measurement,
            }))}
            onChange={(e) => {
              setForm({
                ...form,
                product_id: e.value,
                unit_measurement: e.unit_measurement
              });
            }}
            menuPosition="fixed"
            value={products
              .filter((product) => product.product_id === form.product_id)
              .map((product) => ({
                label: product.product_name,
                value: product.product_id,
                unit_measurement: product.product_unit_measurement,
              }))}
          />
        </div>
        <div className="col-span-6">
          <InputPrimary
            label="Fecha"
            type="date"
            name="date"
            inputRequired={true}
            value={form.date || ""}
            onChange={handleChangeForm}
          />
        </div>
        <div className="col-span-6">
          <SelectPrimary
            label="Unidad medida"
            inputRequired="required"
            disabled={true}
            value={form.unit_measurement||""}
          >
            <option value="">Ninguno</option>
            {optionsUnitsMeasurements.map((unit, unitKey) => (
              <option key={unitKey} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </SelectPrimary>
        </div>
        <div className="col-span-6 md:col-span-4">
          <InputPrimary
            label="Cantidad"
            type="number"
            name="stock"
            inputRequired={true}
            value={form.stock || ""}
            onChange={handleChangeForm}
          />
        </div>
        <div className="col-span-6 md:col-span-4">
          <InputPrimary
            label="P. Unitario"
            type="number"
            slep="0.01"
            name="price_unit"
            inputRequired={true}
            value={form.price_unit || ""}
            onChange={handleChangeForm}
          />
        </div>
        <div className="col-span-6 md:col-span-4">
          <InputPrimary
            label="Total S/"
            type="number"
            disabled
            slep="0.01"
            name="total"
            inputRequired={true}
            value={form.total || ""}
            onChange={handleChangeForm}
          />
        </div>
        
        <div className="col-span-full">
          <TextareaPrimary
            label="Detalles"
            name="details"
            value={form.details || ""}
            onChange={handleChangeForm}
          />
        </div>
        <SubmitForm id="form-product-submit" />
      </form>
    </Modal>
  );
}
