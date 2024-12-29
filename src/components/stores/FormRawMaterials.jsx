import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import Label from "../Label";
import Select from "react-select";
import { SelectPrimary } from "../Selects";
import { InputPrimary, SubmitForm, Toogle } from "../Inputs";
import { optionsUnitsMeasurements } from "@/helpers/listUnitsMeasurements";

const initialDataForm = {
  product_id: null,
  material_hist_bill: "",
  material_hist_total_buy: "",
  material_hist_guide: "",
  material_hist_amount: "",
  material_hist_price_buy: "",
  material_hist_igv: true,
  material_hist_money: "PEN",
  material_hist_unit_measurement: '',
  material_hist_total_buy: "",
};

function FormRawMaterials({ statusModal, listProduct, handleCloseModal, handleValidProduct, handleSaveHistory, productEdit}) {
  const [form, setForm] = useState(initialDataForm);
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSaveHistory(form);
  };
  const handleChangeForm = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    setForm(Object.keys(productEdit).length ? {
        ...form,
        product_id: productEdit.id,
        material_hist_unit_measurement: productEdit.product_unit_measurement||''
    } : initialDataForm)
  },[productEdit])
  const hanbleSendModal = () => {
    const formProduct = document.querySelector("#form-product-submit");
    formProduct.click();
  };
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
        <div className="col-span-6">
          <InputPrimary
            label="N° Factura"
            type="text"
            inputRequired="required"
            name="material_hist_bill"
            value={form.material_hist_bill}
            onChange={ (e) => {
                if(Object.keys(productEdit).length){
                    setForm({
                        ...form,
                        material_hist_bill: e.target.value,
                    })
                }else{
                    setForm({
                        ...form,
                        material_hist_bill: e.target.value,
                        product_id: null,
                        material_hist_unit_measurement:""
                    })
                }
                handleValidProduct(e.target.value)
            }}
          />
        </div>
        <div className="col-span-6">
          <InputPrimary
            label="Guía"
            type="text"
            name="material_hist_guide"
            value={form.material_hist_guide}
            onChange={handleChangeForm}
          />
        </div>
        <div className="col-span-full mb-2">
          <Label text="Productos" htmlFor="product_list" required />
          <Select
            instanceId="product_list"
            isDisabled={false}
            placeholder="Seleccione un producto"
            name="product_id"
            options={listProduct}
            onChange={(e) => {
                setForm({ ...form, product_id: e.value,material_hist_unit_measurement: e.product_unit_measurement||''})
            }}
            menuPosition="fixed"
            value={listProduct.filter(
              (product) => product.value === form.product_id
            )}
          />
        </div>
        <div className="col-span-6">
          <InputPrimary
            label="Cantidad"
            type="number"
            min="1"
            inputRequired="required"
            name="material_hist_amount"
            value={form.material_hist_amount}
            onChange={handleChangeForm}
          />
        </div>
        <div className="col-span-6">
          <SelectPrimary
            label="Unidad medida"
            inputRequired="required"
            disabled={true}
            name="material_hist_unit_measurement"
            value={form.material_hist_unit_measurement}
            onChange={handleChangeForm}
          >
            <option value="">Ninguno</option>
            {optionsUnitsMeasurements.map((unit, unitKey) => (
              <option key={unitKey} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </SelectPrimary>
        </div>
        <div className="col-span-6">
          <SelectPrimary
            label="Moneda"
            inputRequired="required"
            name="material_hist_money"
            value={form.material_hist_money}
            onChange={handleChangeForm}
          >
            <option value="PEN">Soles (S/)</option>
            <option value="USD">Dolares ($)</option>
          </SelectPrimary>
        </div>
        <div className="col-span-6">
          <InputPrimary
            label="Precio compra"
            type="number"
            min="1"
            steep="0.01"
            inputRequired="required"
            name="material_hist_price_buy"
            value={form.material_hist_price_buy}
            onChange={e => {
                setForm({ ...form, material_hist_price_buy: e.target.value,material_hist_total_buy: form.material_hist_igv ? (e.target.value * 1.18).toFixed(2) :  e.target.value})
            }}
          />
        </div>
        <div className="col-span-full">
          <Toogle
            text="Incluir IGV"
            onChange={e => setForm({...form, material_hist_igv: e.target.checked, material_hist_total_buy: e.target.checked ? (form.material_hist_price_buy * 1.18).toFixed(2) :  form.material_hist_price_buy})}
            checked={form.material_hist_igv}
            name="material_hist_igv"
          />
        </div>
        <div className="col-span-6">
          <InputPrimary
            label="Total compra"
            type="number"
            min="1"
            disabled={true}
            inputRequired="required"
            name="material_hist_total_buy"
            value={form.material_hist_total_buy}
            onChange={handleChangeForm}
          />
        </div>
        <SubmitForm id="form-product-submit" />
      </form>
    </Modal>
  );
}

export default FormRawMaterials;
