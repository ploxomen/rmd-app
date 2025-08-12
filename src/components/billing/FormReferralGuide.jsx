import { useFormData } from "@/hooks/useFormData";
import Modal from "../Modal";
import { InputPrimary, SubmitForm, TextareaPrimary } from "../Inputs";
import Label from "../Label";
import Select from "react-select";
import { ButtonPrimarySm } from "../Buttons";
import { PlusIcon } from "@heroicons/react/24/solid";
import TableDetailsReferGuide from "./TableDetailsReferGuide";
import { SelectPrimary } from "../Selects";

export default function FormReferralGuide({
  formData = {},
  viewModal = false,
  detailsProducts = [],
  handleAddDetail = () => {},
  listCustomers = [],
  handleClose = () => {},
  callbackResponse = () => {},
  handleChangeMaterial = () => {},
  handleDeleteDetail = () => {},
  products = [],
}) {
  const {
    form,
    setFormulario,
    setFormManual,
    handleClickSubmit,
    handleSubmitParam,
  } = useFormData({
    data: formData,
    idSubmit: "form-referral-guide-submit",
    method: formData.hasOwnProperty("id") ? "put" : "post",
    url: formData.hasOwnProperty("id")
      ? `/billing/guide-referral/${formData.id}`
      : "/billing/guide-referral",
    callbackResponse,
  });
  return (
    <Modal
      status={viewModal}
      maxWidth="max-w-[750px]"
      title={
        formData.hasOwnProperty("id")
          ? "Editar guía de remisión"
          : "Nueva guía de remisión"
      }
      onSave={(e) => handleClickSubmit()}
      handleCloseModal={handleClose}
    >
      <form
        className="grid grid-cols-12 gap-x-3 gap-y-0"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitParam({ ...form, details: detailsProducts });
        }}
      >
        <div className="col-span-6 lg:col-span-4">
          <InputPrimary
            label="Fecha emisión"
            type="date"
            inputRequired="required"
            name="guide_issue_date"
            value={form.guide_issue_date}
            onChange={(e) => setFormulario(e)}
          />
        </div>
        <div className="col-span-6 lg:col-span-4">
          <InputPrimary
            label="Fecha traslado"
            type="date"
            inputRequired="required"
            name="guide_transfer_date"
            value={form.guide_transfer_date}
            onChange={(e) => setFormulario(e)}
          />
        </div>
        <div className="col-span-6 lg:col-span-4">
          <InputPrimary
            label="N° de guía"
            type="text"
            pattern="[A-Za-z]{2}[0-9]{2}-[0-9]{1,5}"
            name="guide_issue_number"
            inputRequired="required"
            placeholder="XX00-00000"
            value={form.guide_issue_number}
            onChange={(e) => setFormulario(e)}
          />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <InputPrimary
            label="N° de Factura"
            type="text"
            name="guide_bill_number"
            value={form.guide_bill_number}
            onChange={(e) => setFormulario(e)}
          />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <SelectPrimary
            label="Tipos de movimiento"
            inputRequired="required"
            name="guide_type_motion"
            value={form.guide_type_motion}
            onChange={(e) => setFormulario(e)}
          >
            <option value="VENTA">VENTA</option>
            <option value="GARANTIA">GARANTIA</option>
            <option value="MUESTRA">MUESTRA</option>
          </SelectPrimary>
        </div>
        <div className="col-span-6 lg:col-span-6">
          <Label text="Clientes" htmlFor="guide_customer_id" required />
          <Select
            instanceId="guide_customer_id"
            placeholder="Seleccione un cliente"
            name="guide_customer_id"
            options={listCustomers}
            onChange={(e) => setFormManual("guide_customer_id", e.value)}
            menuPosition="fixed"
            value={listCustomers.filter(
              (prov) => prov.value === form.guide_customer_id
            )}
          />
        </div>
        <div className="col-span-full lg:col-span-6">
          <TextareaPrimary
            label="Dirección destino"
            name="guide_address_destination"
            inputRequired="required"
            value={form.guide_address_destination}
            onChange={(e) => setFormulario(e)}
          />
        </div>
        <div className="col-span-full lg:col-span-6">
          <TextareaPrimary
            label="Justificación"
            name="guide_justification"
            inputRequired="required"
            value={form.guide_justification}
            onChange={(e) => setFormulario(e)}
          />
        </div>
        <div className="col-span-full">
          <TextareaPrimary
            label="Observación"
            name="guide_observations"
            value={form.observations}
            onChange={(e) => setFormulario(e)}
          />
        </div>
        <div className="col-span-full mb-2 text-right">
          <ButtonPrimarySm
            onClick={(e) => handleAddDetail()}
            icon={<PlusIcon className="size-5" />}
          />
        </div>
        <div className="col-span-full overflow-x-auto">
          <TableDetailsReferGuide
            products={products}
            details={detailsProducts}
            handleDelete={handleDeleteDetail}
            handleChangeMaterial={handleChangeMaterial}
          />
        </div>
        <SubmitForm id="form-referral-guide-submit" />
      </form>
    </Modal>
  );
}
