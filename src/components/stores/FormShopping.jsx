import React, { useEffect } from "react";
import Modal from "../Modal";
import { useFormData } from "@/hooks/useFormData";
import { InputPrimary, SubmitForm } from "../Inputs";
import { SelectPrimary } from "../Selects";
import Select from "react-select";
import Label from "../Label";
import { ButtonPrimarySm } from "../Buttons";
import { PlusIcon } from "@heroicons/react/24/solid";
import TableDetailShopping from "./TableDetailShopping";
import SeccionForm from "../SeccionForm";
export default function FormShopping({
  modal = "",
  providers = [],
  products = [],
  data = {},
  details = [],
  responseRequest = () => {},
  handleCloseModal = () => {},
  handleChangeValueDetail = () => {},
  handleAddDetail = () => {},
  handleDeleteDetail = () => {},
}) {
  const {
    form,
    handleClickSubmit,
    handleSubmitParam,
    setFormulario,
    setFormManual,
  } = useFormData({
    url: data?.id ? `store-shopping/${data.id}` : "store-shopping",
    data,
    method: data?.id ? "put" : "post",
    idSubmit: "form-shopping",
    callbackResponse: responseRequest
  });
  return (
    <Modal
      status={modal}
      onSave={(e) => handleClickSubmit()}
      title={data?.id ? "Editar compra" : "Agregar compra"}
      handleCloseModal={handleCloseModal}
      maxWidth="max-w-[950px]"
    >
      <form
        className="grid grid-cols-12 gap-x-3 gap-y-0"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitParam({ ...form, shopping_details: details });
        }}
      >
        <div className="col-span-full md:col-span-4">
          <SelectPrimary
            label="Tipo de compra"
            inputRequired="required"
            name="buy_type"
            value={form.buy_type}
            onChange={setFormulario}
          >
            <option value="NACIONAL">NACIONAL</option>
            <option value="IMPORTADO">IMPORTADO</option>
          </SelectPrimary>
        </div>
        <div className="col-span-full md:col-span-4">
          <SelectPrimary
            label="Moneda de compra"
            inputRequired="required"
            name="buy_type_money"
            value={form.buy_type_money}
            onChange={setFormulario}
          >
            <option value="PEN">Soles</option>
            <option value="USD">Dolares</option>
          </SelectPrimary>
        </div>
        <div className="col-span-full md:col-span-4">
          <InputPrimary
            label="N° guía"
            type="text"
            name="buy_number_guide"
            value={form.buy_number_guide}
            onChange={setFormulario}
          />
        </div>
        <div className="col-span-full md:col-span-8 mb-2">
          <Label text="Proveedores" required />
          <Select
            instanceId="provider_list"
            placeholder="Seleccione un proveedor"
            name="provider_list"
            options={providers}
            onChange={(e) => {
              setFormManual("buy_provider", e.value);
            }}
            menuPosition="fixed"
            value={providers.filter((prov) => prov.value === form.buy_provider)}
          />
        </div>
        <div className="col-span-full md:col-span-4">
          <InputPrimary
            label="RUC"
            disabled
            type="text"
            inputRequired="required"
            value={
              providers.find((prov) => prov.value === form.buy_provider)
                ?.provider_number_document
            }
          />
        </div>
        <div className="col-span-full md:col-span-4">
          <InputPrimary
            label="Fecha ingreso"
            type="date"
            inputRequired="required"
            name="buy_date"
            value={form.buy_date}
            onChange={setFormulario}
          />
        </div>
        <div className="col-span-full md:col-span-4">
          <InputPrimary
            label="Fecha factura"
            inputRequired="required"
            type="date"
            name="buy_date_invoice"
            value={form.buy_date_invoice}
            onChange={setFormulario}
          />
        </div>
        <div className="col-span-full md:col-span-4">
          <InputPrimary
            label="N° factura"
            type="text"
            name="buy_number_invoice"
            value={form.buy_number_invoice}
            onChange={setFormulario}
          />
        </div>
        {form.buy_type === "IMPORTADO" && (
          <>
            <div className="col-span-full">
              <SeccionForm title="Datos de importación ($)" />
            </div>
            <div className="col-span-full md:col-span-4">
              <InputPrimary
                label="N° DAM"
                type="text"
                inputRequired="required"
                name="imported_nro_dam"
                value={form.imported_nro_dam}
                onChange={setFormulario}
              />
            </div>
            <div className="col-span-full md:col-span-4">
              <InputPrimary
                label="Gastos de origen"
                type="text"
                inputRequired="required"
                step="0.01"
                name="imported_expenses_cost"
                value={form.imported_expenses_cost}
                onChange={setFormulario}
              />
            </div>
            <div className="col-span-full md:col-span-4">
              <InputPrimary
                label="Flete"
                type="text"
                inputRequired="required"
                step="0.01"
                name="imported_flete_cost"
                value={form.imported_flete_cost}
                onChange={setFormulario}
              />
            </div>
            <div className="col-span-full md:col-span-4">
              <InputPrimary
                label="Seguro"
                type="number"
                inputRequired="required"
                step="0.01"
                name="imported_insurance_cost"
                value={form.imported_insurance_cost}
                onChange={setFormulario}
              />
            </div>
            <div className="col-span-full md:col-span-4">
              <InputPrimary
                label="Gastos en destino"
                type="number"
                step="0.01"
                inputRequired="required"
                name="imported_destination_cost"
                value={form.imported_destination_cost}
                onChange={setFormulario}
              />
            </div>
          </>
        )}
        <div className="col-span-full mb-2 text-right">
          <ButtonPrimarySm
            onClick={(e) => handleAddDetail()}
            icon={<PlusIcon className="size-5" />}
          />
        </div>
        <div className="col-span-full overflow-x-auto">
          <TableDetailShopping
            products={products}
            details={details}
            money={form.buy_type_money}
            handleDeleteDetail={handleDeleteDetail}
            handleChangeValueDetail={handleChangeValueDetail}
          />
        </div>
        <SubmitForm id="form-shopping" />
      </form>
    </Modal>
  );
}
