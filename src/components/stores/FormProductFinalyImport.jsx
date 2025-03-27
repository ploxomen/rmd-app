import React, { useEffect } from "react";
import Modal from "../Modal";
import { InputPrimary, SubmitForm } from "../Inputs";
import { useFormData } from "@/hooks/useFormData";
import Select from "react-select";
import { SelectPrimary } from "../Selects";
import { optionsUnitsMeasurements } from "@/helpers/listUnitsMeasurements";
import Label from "../Label";

export default function FormProductFinalyImport({
  formData = {},
  viewModal = false,
  listProviders = [],
  handleClose = () => {},
  callbackResponse = () => {}
}) {
  const { form, setFormulario, setFormManual, setFormObject, handleClickSubmit, handleSubmit } = useFormData({
    data: formData,
    idSubmit: "form-product-imported-submit",
    method: formData.hasOwnProperty("id") ? "put" : "post",
    url : formData.hasOwnProperty("id") ? `/products-finaly/${formData.id}`  : "/products-finaly",
    callbackResponse
  });
  return (
    <Modal
      status={viewModal}
      maxWidth="max-w-[750px]"
      title={"Agregar"}
      onSave={e => handleClickSubmit()}
      handleCloseModal={handleClose}
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
            name="product_finaly_hist_bill"
            value={form.product_finaly_hist_bill}
            onChange={(e) => setFormulario(e)}
          />
        </div>
        <div className="col-span-6">
          <InputPrimary
            label="Guía"
            type="text"
            name="product_finaly_hist_guide"
            value={form.product_finaly_hist_guide}
            onChange={(e) => setFormulario(e)}
          />
        </div>
        <div className="col-span-full mb-2">
          <InputPrimary
            label="Producto"
            type="text"
            value={form.product_name}
            inputRequired={true}
            disabled={true}
          />
        </div>
        <div className="col-span-full mb-2">
          <Label text="Proveedores" htmlFor="product_list" required />
          <Select
            instanceId="provider_list"
            placeholder="Seleccione un proveedor"
            name="provider_list"
            options={listProviders}
            onChange={(e) => setFormManual("product_finaly_provider", e.value)}
            menuPosition="fixed"
            value={listProviders.filter(
              (prov) => prov.value === form.product_finaly_provider
            )}
          />
        </div>
        <div className="col-span-6 lg:col-span-4">
          <SelectPrimary
            label="Moneda"
            inputRequired="required"
            name="product_finaly_money"
            value={form.product_finaly_money}
            onChange={(e) => setFormulario(e)}
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
            value={form.product_finaly_type_change}
            onChange={(e) => setFormulario(e)}
          />
        </div>
        <div className="col-span-6 lg:col-span-4">
          <SelectPrimary
            label="Unidad medida"
            inputRequired="required"
            disabled={true}
            name="product_finaly_unit_measurement"
            value={form.product_finaly_unit_measurement}
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
            name="product_finaly_amount"
            value={form.product_finaly_amount}
            onChange={(e) => {
              setFormObject({
                product_finaly_amount: e.target.value,
                product_finaly_total_buy:
                  e.target.value * form.product_finaly_price_buy,
              });
            }}
          />
        </div>
        <div className="col-span-6 lg:col-span-4">
          <InputPrimary
            label="Precio compra"
            type="number"
            min="1"
            step="0.01"
            inputRequired="required"
            name="product_finaly_price_buy"
            value={form.product_finaly_price_buy}
            onChange={(e) => {
              setFormObject({
                product_finaly_price_buy: e.target.value,
                product_finaly_total_buy:
                  e.target.value * form.product_finaly_amount,
              });
            }}
          />
        </div>
        <div className="col-span-6 lg:col-span-4">
          <InputPrimary
            label="Total compra"
            type="number"
            min="1"
            disabled={true}
            inputRequired="required"
            name="product_finaly_total_buy"
            value={form.product_finaly_total_buy}
          />
        </div>
        <SubmitForm id="form-product-imported-submit" />
      </form>
    </Modal>
  );
}
