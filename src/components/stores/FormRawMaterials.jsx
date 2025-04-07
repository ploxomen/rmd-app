import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import Label from "../Label";
import Select from "react-select";
import { SelectPrimary } from "../Selects";
import { InputPrimary, SubmitForm, Toogle } from "../Inputs";
import { optionsUnitsMeasurements } from "@/helpers/listUnitsMeasurements";

const initialDataForm = {
  product_id: null,
  history_id: null,
  raw_provider: null,
  material_hist_date: new Date().toISOString().split("T")[0],
  material_hist_bill: "",
  material_hist_total_type_change: null,
  material_hist_total_buy: "",
  material_hist_guide: "",
  material_hist_amount: "",
  material_hist_price_buy: "",
  material_hist_name_product: null,
  material_hist_igv: true,
  material_hist_money: "PEN",
  material_hist_unit_measurement: "",
};

function FormRawMaterials({
  valueMoney,
  listProviders,
  statusModal,
  listProduct,
  handleCloseModal,
  handleValidProduct,
  handleSaveHistory,
  productEdit,
  elemetHistory = false,
}) {
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
    if (elemetHistory) {
      return setForm(
        Object.keys(productEdit).length ? productEdit : initialDataForm
      );
    }
    setForm(
      Object.keys(productEdit).length
        ? {
            ...form,
            product_id: productEdit.id,
            material_hist_unit_measurement:
              productEdit.product_unit_measurement || "",
          }
        : initialDataForm
    );
  }, [productEdit]);
  useEffect(() => {
    const typeChange = valueMoney.money || form.material_hist_total_type_change;
    const priceBuy =
      form.material_hist_money !== "PEN"
        ? typeChange * form.material_hist_price_buy
        : form.material_hist_price_buy;
    const total = priceBuy * form.material_hist_amount;
    setForm((val) => ({
      ...val,
      material_hist_total_buy: form.material_hist_igv
        ? (total * 1.18).toFixed(2)
        : total.toFixed(2),
    }));
  }, [
    form.material_hist_money,
    form.material_hist_igv,
    form.material_hist_amount,
    form.material_hist_total_type_change,
    form.material_hist_price_buy,
  ]);
  const hanbleSendModal = () => {
    const formProduct = document.querySelector("#form-product-submit");
    formProduct.click();
  };
  return (
    <Modal
      status={statusModal}
      maxWidth="max-w-[750px]"
      title={
        elemetHistory && form.history_id
          ? "Editar historial"
          : "Agregar historial"
      }
      onSave={hanbleSendModal}
      handleCloseModal={handleCloseModal}
    >
      <form
        className="grid grid-cols-12 gap-x-3 gap-y-0"
        onSubmit={handleSubmit}
      >
        <div className="col-span-6 md:col-span-4">
          <InputPrimary
            label="Fecha"
            type="date"
            inputRequired="required"
            name="material_hist_date"
            value={form.material_hist_date}
            onChange={handleChangeForm}
          />
        </div>
        <div className="col-span-6 md:col-span-4">
          <InputPrimary
            label="N° Factura"
            type="text"
            inputRequired="required"
            name="material_hist_bill"
            value={form.material_hist_bill}
            onChange={(e) => {
              if (Object.keys(productEdit).length) {
                setForm({
                  ...form,
                  material_hist_bill: e.target.value,
                });
              } else {
                setForm({
                  ...form,
                  material_hist_bill: e.target.value,
                  product_id: null,
                  material_hist_unit_measurement: "",
                });
              }
            }}
            onBlur={(e) => handleValidProduct(e.target.value)}
          />
        </div>
        <div className="col-span-6 md:col-span-4">
          <InputPrimary
            label="Guía"
            type="text"
            name="material_hist_guide"
            value={form.material_hist_guide}
            onChange={handleChangeForm}
          />
        </div>
        <div className="col-span-full mb-2">
          {!elemetHistory ? (
            <>
              <Label text="Productos" htmlFor="product_list" required />
              <Select
                instanceId="product_list"
                isDisabled={true}
                placeholder="Seleccione un producto"
                name="product_id"
                options={listProduct}
                onChange={(e) => {
                  setForm({
                    ...form,
                    product_id: e.value,
                    material_hist_unit_measurement:
                      e.product_unit_measurement || "",
                  });
                }}
                menuPosition="fixed"
                value={listProduct.filter(
                  (product) => product.value === form.product_id
                )}
              />
            </>
          ) : (
            <>
              <InputPrimary
                label="Producto"
                type="text"
                value={form.material_hist_name_product}
                inputRequired={true}
                disabled={true}
              />
            </>
          )}
        </div>
        <div className="col-span-full mb-2">
          <Label text="Proveedores" htmlFor="product_list" required />
          <Select
            instanceId="provider_list"
            placeholder="Seleccione un proveedor"
            name="provider_list"
            options={listProviders}
            onChange={(e) => {
              setForm({
                ...form,
                raw_provider: e.value,
              });
            }}
            menuPosition="fixed"
            value={listProviders.filter(
              (prov) => prov.value === form.raw_provider
            )}
          />
        </div>
        <div className="col-span-6 lg:col-span-4">
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
        <div className="col-span-6 lg:col-span-4">
          <InputPrimary
            label="Tipo cambio"
            type="number"
            min="0.1"
            step="0.01"
            inputRequired="required"
            disabled
            value={valueMoney.money || form.material_hist_total_type_change}
          />
        </div>
        <div className="col-span-6 lg:col-span-4">
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
        <div className="col-span-6 lg:col-span-4">
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
        <div className="col-span-6 lg:col-span-4">
          <InputPrimary
            label="Precio compra"
            type="number"
            min="0.01"
            step="0.01"
            inputRequired="required"
            name="material_hist_price_buy"
            value={form.material_hist_price_buy}
            onChange={handleChangeForm}
          />
        </div>
        <div className="col-span-6 lg:col-span-4">
          <InputPrimary
            label="Total S/"
            type="number"
            min="1"
            disabled={true}
            inputRequired="required"
            name="material_hist_total_buy"
            value={form.material_hist_total_buy}
            onChange={handleChangeForm}
          />
        </div>
        <div className="col-span-full">
          <div className="flex gap-x-4 gap-y-2">
            <Toogle
              text="Incluir IGV"
              onChange={(e) =>
                setForm({
                  ...form,
                  material_hist_igv: e.target.checked
                })
              }
              checked={form.material_hist_igv}
              name="material_hist_igv"
            />
          </div>
        </div>
        <SubmitForm id="form-product-submit" />
      </form>
    </Modal>
  );
}

export default FormRawMaterials;
