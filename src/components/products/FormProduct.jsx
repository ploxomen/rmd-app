import React, { useEffect, useRef, useState } from "react";
import Modal from "../Modal";
import { InputPrimary, SubmitForm, Toogle } from "../Inputs";
import SeccionForm from "../SeccionForm";
import { SelectPrimary } from "../Selects";
import { ButtonDangerSm, ButtonPrimarySm } from "../Buttons";
import { ArrowUpTrayIcon, TrashIcon } from "@heroicons/react/24/solid";
import EditorText from "../EditorText";
import Select from "react-select";
import { optionsUnitsMeasurements } from "@/helpers/listUnitsMeasurements";
import Label from "../Label";
import { listStores } from "@/helpers/listStores";
const dataForm = {
  product_name: "",
  product_description: "",
  product_buy: "",
  product_public_customer: "",
  product_categorie: "",
  product_distributor: "",
  product_service: false,
  sub_categorie: null,
  product_store: "",
  product_label: "",
  stock_initial: "",
  type_money_initial: "PEN",
  product_label_2: "",
  product_img: null,
  product_unit_measurement: "TU",
  product_code: null,
};
function FormProduct({
  statusModal,
  closeModal,
  handleSave,
  productEdit,
  categories,
  editStock = true
}) {
  const [form, setForm] = useState(dataForm);
  const [deleteImg, setDeleteImg] = useState(false);
  const editorDescription = useRef(null);
  const [labels, setLabels] = useState([]);
  const edit = Object.keys(productEdit).length;
  useEffect(() => {
    setForm(edit ? productEdit : dataForm);
    setDeleteImg(false);
    handleStore(productEdit.product_store);
  }, [productEdit]);
  useEffect(() => {
    if (form.product_store === "PRODUCTO TERMINADO") {
      setForm((value) => ({ ...value, product_label_2: "ENSAMBLADO" }));
    }
  }, [form.product_store]);
  const hanbleSendModal = () => {
    const formProduct = document.querySelector("#form-product-submit");
    formProduct.click();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in form) {
      if (
        Object.hasOwnProperty.call(form, key) &&
        form[key] &&
        key != "product_img"
      ) {
        data.append(key, form[key]);
      }
    }
    if (form.id) {
      data.append("_method", "PUT");
      if (deleteImg) {
        data.append("delete_img", "true");
      }
    }
    data.append("product_description", editorDescription.current.getContent());
    const inputImage = document.querySelector("#upload-file");
    if (inputImage.value) {
      data.append("product_img", inputImage.files[0]);
    }
    handleSave(data);
  };
  const handleChangeForm = async (e) => {
    const key = e.target.name;
    const value = e.target.value;
    if (key == "product_service") {
      setForm({
        ...form,
        product_service: !form.product_service,
      });
      return;
    }
    console.log(key,value);
    setForm({
      ...form,
      [key]: value,
    });
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setForm({
        ...form,
        product_img: null,
      });
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({
        ...form,
        product_img: reader.result,
      });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const handleStore = (value) => {
    if (!value) {
      return setLabels([]);
    }
    listStores.forEach((store) => {
      if (store.value === value) {
        return setLabels(store.options);
      }
    });
  };
  const handleDeleteImg = () => {
    setForm({
      ...form,
      product_img: null,
    });
    document.querySelector("#upload-file").value = null;
    setDeleteImg(true);
  };
  const handleClickUpload = (e) => {
    document.querySelector("#upload-file").click();
  };
  return (
    <Modal
      status={statusModal}
      maxWidth="max-w-[750px]"
      title={edit ? "Editar producto" : "Nuevo producto"}
      onSave={hanbleSendModal}
      handleCloseModal={closeModal}
    >
      <form
        className="grid grid-cols-12 gap-x-3 gap-y-0"
        onSubmit={handleSubmit}
      >
        <div className="col-span-full">
          <SeccionForm title="Datos del producto" />
        </div>
        {form.product_code !== null && (
          <div className="col-span-full md:col-span-3">
            <InputPrimary
              label="Código"
              inputRequired="required"
              name="product_code"
              value={form.product_code || ""}
              onChange={handleChangeForm}
            />
          </div>
        )}
        <div
          className={`${
            form.product_code !== null
              ? "col-span-full md:col-span-9"
              : "col-span-full"
          }`}
        >
          <InputPrimary
            label="Producto"
            inputRequired="required"
            name="product_name"
            value={form.product_name || ""}
            onChange={handleChangeForm}
          />
        </div>
        <div className="col-span-full">
          <Toogle
            text="Establecer como servicio"
            onChange={handleChangeForm}
            checked={form.product_service}
            name="product_service"
          />
        </div>
        <div className="col-span-full mb-4">
          <EditorText
            label="Descripción"
            initialValue={form.product_description}
            id="quotation_observations"
            editorRef={editorDescription}
          />
        </div>
        {!form.product_service && (
          <>
            <div className="col-span-6">
              <InputPrimary
                label="Stock inicial"
                step="0.01"
                min="0"
                disabled={!editStock && 'disabled'}
                type="number"
                name="stock_initial"
                value={form.stock_initial || ""}
                onChange={handleChangeForm}
              />
            </div>
            <div className="col-span-6">
              <SelectPrimary
                label="Tipo moneda"
                inputRequired="required"
                disabled={!editStock && 'disabled'}
                name="type_money_initial"
                value={form.type_money_initial || "PEN"}
                onChange={handleChangeForm}
              >
                <option value="PEN">Soles (S/)</option>
                <option value="USD">Dolares ($)</option>
              </SelectPrimary>
            </div>
            <div className="col-span-6 md:col-span-4">
              <InputPrimary
                label="P. Producción"
                step="0.01"
                min="0"
                inputRequired="required"
                disabled={!editStock && 'disabled'}
                type="number"
                name="product_buy"
                value={form.product_buy || ""}
                onChange={handleChangeForm}
              />
            </div>
            <div className="col-span-6 md:col-span-4">
              <InputPrimary
                label="P. Público Cliente"
                step="0.01"
                min="0"
                type="number"
                inputRequired="required"
                name="product_public_customer"
                value={form.product_public_customer || ""}
                onChange={handleChangeForm}
              />
            </div>
            <div className="col-span-6 md:col-span-4">
              <InputPrimary
                label="P. Distribuidor"
                step="0.01"
                min="0"
                type="number"
                name="product_distributor"
                value={form.product_distributor || ""}
                onChange={handleChangeForm}
              />
            </div>
          </>
        )}
        <div className="col-span-6 md:col-span-4">
          <SelectPrimary
            label="Tipos de almacén"
            inputRequired="required"
            name="product_store"
            disabled={!editStock && 'disabled'}
            value={form.product_store || ""}
            onChange={(e) => {
              handleStore(e.target.value);
              handleChangeForm(e);
            }}
          >
            <option value="">Seleccione una opción</option>
            {listStores.map((store, keyStore) => (
              <option value={store.value} key={keyStore}>
                {store.label}
              </option>
            ))}
          </SelectPrimary>
        </div>
        <div className="col-span-6 md:col-span-4">
          <SelectPrimary
            label="Etiqueta 1"
            name="product_label"
            value={form.product_label || ""}
            onChange={handleChangeForm}
            inputRequired={
              listStores.find((list) => list.value === form.product_store)
                ? true
                : false
            }
          >
            <option value="">Seleccione una opción</option>
            {listStores
              .find((list) => list.value === form.product_store)
              ?.options.map((label, keyLabel) => (
                <option value={label.value} key={keyLabel}>
                  {label.label}
                </option>
              ))}
          </SelectPrimary>
        </div>
        <div className="col-span-6 md:col-span-4">
          <SelectPrimary
            label="Etiqueta 2"
            name="product_label_2"
            value={form.product_label_2 || ""}
            onChange={handleChangeForm}
            inputRequired={labels.length ? true : false}
          >
            <option value="">Seleccione una opción</option>
            {listStores
              .find((list) => list.value === form.product_store)
              ?.options_2.map((label, keyLabel) => (
                <option value={label.value} key={keyLabel}>
                  {label.label}
                </option>
              ))}
          </SelectPrimary>
        </div>

        <div className="col-span-6 mb-2">
          <Label text="Categoria" htmlFor="product_categorie_id" required />
          <Select
            instanceId="product_categorie_id"
            placeholder="Seleccione una opción"
            name="product_categorie"
            options={categories}
            value={categories
              .flatMap((obj) => obj.options)
              .filter((option) => option.value === form.sub_categorie)}
            onChange={(e) => setForm({ ...form, sub_categorie: e.value })}
            menuPosition="fixed"
          />
        </div>
        <div className="col-span-6">
          <SelectPrimary
            label="Unidades de medida"
            inputRequired="required"
            name="product_unit_measurement"
            value={form.product_unit_measurement || ""}
            onChange={handleChangeForm}
          >
            <option value="">Seleccione una opción</option>
            {optionsUnitsMeasurements.map((unit, unitKey) => (
              <option value={unit.value} key={unitKey}>
                {unit.label}
              </option>
            ))}
          </SelectPrimary>
        </div>
        <div className="col-span-full">
          <div className="flex gap-2 items-center">
            <input
              type="file"
              id="upload-file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
            <img
              src={form.product_img ? form.product_img : "/img/no-pictures.png"}
              alt="Imagen previa"
              width={100}
              height={100}
              loading="lazy"
            />
            <ButtonPrimarySm
              text="Subir"
              icon={<ArrowUpTrayIcon className="w-4 h-6" />}
              onClick={handleClickUpload}
            />
            {form.product_img && (
              <ButtonDangerSm
                text="Borrar"
                icon={<TrashIcon className="w-4 h-6" />}
                onClick={handleDeleteImg}
              />
            )}
          </div>
        </div>
        <SubmitForm id="form-product-submit" />
      </form>
    </Modal>
  );
}

export default FormProduct;
