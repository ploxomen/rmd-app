import React, { useEffect } from "react";
import Modal from "../Modal";
import { useFormData } from "@/hooks/useFormData";
import { InputPrimary, SubmitForm } from "../Inputs";
import { SelectPrimary } from "../Selects";
import Label from "../Label";
import Select from "react-select";
import { optionsUnitsMeasurements } from "@/helpers/listUnitsMeasurements";

export default function FormCommodity({
  modal = true,
  data = {},
  listProviders = [],
  moneyChange = {},
}) {
  const {
    form,
    handleSubmit,
    setFormulario,
    handleClickSubmit,
    setFormManual,
  } = useFormData({
    data,
    idSubmit: "form-commodity",
    method: data?.id ? "PUT" : "POST",
    url: "commodity",
  });
  useEffect(() => {
    setFormManual("commodi_hist_type_change", moneyChange.money);
  }, [moneyChange]);
  useEffect(() => {
    const total =
      form.commodi_hist_money === "PEN"
        ? form.commodi_hist_price_buy * form.commodi_hist_amount
        : form.commodi_hist_price_buy *
          form.commodi_hist_type_change *
          form.commodi_hist_amount;
    setFormManual("commodi_hist_total_buy", total.toFixed());
  }, [
    form.commodi_hist_price_buy,
    form.commodi_hist_amount,
    form.commodi_hist_money,
  ]);
  return (
    <Modal
      status={modal}
      onSave={(e) => handleClickSubmit}
      title={data?.id ? "Editar mercadería" : "Agregar mercadería"}
    >
      <form
        className="grid grid-cols-12 gap-x-3 gap-y-0"
        onSubmit={handleSubmit}
        id="form-commodity"
      >
        <div className="col-span-6 md:col-span-4">
          <InputPrimary
            label="Fecha"
            type="date"
            inputRequired="required"
            name="material_hist_date"
            value={form.commod_hist_date}
            onChange={setFormulario}
          />
        </div>
        <div className="col-span-6 md:col-span-4">
          <InputPrimary
            label="N° Factura"
            type="text"
            inputRequired="required"
            name="commodi_hist_bill"
            value={form.commodi_hist_bill}
            onChange={setFormulario}
          />
        </div>
        <div className="col-span-6 md:col-span-4">
          <InputPrimary
            label="Guía"
            type="text"
            name="commodi_hist_guide"
            value={form.commodi_hist_guide}
            onChange={setFormulario}
          />
        </div>
        <div className="col-span-full mb-2">
          <InputPrimary
            label="Producto"
            type="text"
            value={form.name_product}
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
            onChange={(e) => {
              setFormManual("commodity_provider", e.value);
            }}
            menuPosition="fixed"
            value={listProviders.filter(
              (prov) => prov.value === form.commodity_provider
            )}
          />
        </div>
        <div className="col-span-6 lg:col-span-4">
          <SelectPrimary
            label="Moneda"
            inputRequired="required"
            name="commodi_hist_money"
            value={form.commodi_hist_money}
            onChange={setFormulario}
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
            value={form.commodi_hist_type_change}
            step="0.01"
            inputRequired="required"
            disabled
          />
        </div>
        <div className="col-span-6 lg:col-span-4">
          <SelectPrimary
            label="Unidad medida"
            inputRequired="required"
            disabled={true}
            name="commodi_hist_unit_measurement"
            value={form.commodi_hist_unit_measurement}
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
            name="commodi_hist_amount"
            value={form.commodi_hist_amount}
            onChange={setFormulario}
          />
        </div>
        <div className="col-span-6 lg:col-span-4">
          <InputPrimary
            label="Precio unitario"
            type="number"
            min="0.01"
            step="0.01"
            inputRequired="required"
            name="commodi_hist_price_buy"
            value={form.commodi_hist_price_buy}
            onChange={setFormulario}
          />
        </div>
        <div className="col-span-6 lg:col-span-4">
          <InputPrimary
            label="Total S/"
            type="number"
            min="1"
            disabled={true}
            inputRequired="required"
            name="commodi_hist_total_buy"
            value={form.commodi_hist_total_buy}
          />
        </div>
        <SubmitForm id="form-commodity" />
      </form>
    </Modal>
  );
}
