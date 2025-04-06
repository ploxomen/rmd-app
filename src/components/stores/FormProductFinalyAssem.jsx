import React, { useEffect } from "react";
import Modal from "../Modal";
import { useFormData } from "@/hooks/useFormData";
import { InputPrimary, SubmitForm, TextareaPrimary } from "../Inputs";
import TableDetailAssembled from "./TableDetailAssembled";
import { ButtonPrimarySm } from "../Buttons";
import { PlusIcon } from "@heroicons/react/24/solid";

export default function FormProductFinalyAssem({
  formData = {},
  detailsProducts = [],
  handleAddDetail = () => {},
  handleDeleteDetail = () => {},
  viewModal = false,
  handleClose = () => {},
  callbackResponse = () => {},
  products = [],
  handleChangeMaterial = () => {},
}) {
  
  const { form, setFormulario, handleClickSubmit, handleSubmitParam , setFormObject} = useFormData({
    data: formData,
    idSubmit: "form-product-assembled-submit",
    method: formData.hasOwnProperty("id") ? "put" : "post",
    url: formData.hasOwnProperty("id")
      ? `/product-finaly-extra/history/assembled/${formData.id}`
      : "/products-finaly",
    callbackResponse,
  });
  return (
    <Modal
      status={viewModal}
      maxWidth="max-w-[750px]"
      title={"Agregar"}
      onSave={(e) => handleClickSubmit()}
      handleCloseModal={handleClose}
    >
      <form
        className="grid grid-cols-12 gap-x-3 gap-y-0"
        onSubmit={ e => {
            e.preventDefault();
            handleSubmitParam({...form, details : detailsProducts});
        }}
      >
        <div className="col-span-full mb-2">
          <InputPrimary
            label="Producto"
            type="text"
            value={form.product_name}
            inputRequired={true}
            disabled={true}
          />
        </div>
        <div className="col-span-6 lg:col-span-4">
          <InputPrimary
            label="Fecha"
            type="date"
            inputRequired="required"
            disabled
            value={form.product_finaly_created}
          />
        </div>
        <div className="col-span-6 lg:col-span-4">
          <InputPrimary
            label="Precio venta"
            type="number"
            step="0.01"
            inputRequired="required"
            disabled
            value={form.product_price_client}
          />
        </div>
        <div className="col-span-6 lg:col-span-4">
          <InputPrimary
            label="Cantidad"
            type="number"
            min="1"
            inputRequired="required"
            name="product_finaly_amount"
            value={form.product_finaly_amount}
            onChange={(e) => setFormulario(e)}
          />
        </div>
        <div className="col-span-full">
          <TextareaPrimary
            label="Justificación"
            name="product_finaly_description"
            value={form.product_finaly_description}
            onChange={(e) => setFormulario(e)}
          />
        </div>
        <div className="col-span-full mb-2 text-right">
          <ButtonPrimarySm
            onClick={(e) =>
              handleAddDetail()
            }
            icon={<PlusIcon className="size-5" />}
          />
        </div>
        <div className="col-span-full">
          <TableDetailAssembled
            products={products}
            details={detailsProducts}
            handleDelete={handleDeleteDetail}
            handleChangeMaterial={handleChangeMaterial}
          />
        </div>
        <SubmitForm id="form-product-assembled-submit" />
      </form>
    </Modal>
  );
}
