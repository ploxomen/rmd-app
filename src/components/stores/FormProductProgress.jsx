import React, { useState } from "react";
import Modal from "../Modal";
import Select from "react-select";
const initialDataForm = {
    product_id: null,
    stock: null,
    date: null,
    details: ""
}
export default function FormProductProgress({ products = [], statusModal }) {
      const [form, setForm] = useState(initialDataForm);
    
  return (
    <Modal status={statusModal} maxWidth="max-w-[750px]">
      <form className="grid grid-cols-12 gap-x-3 gap-y-0">
        <div className="col-span-full">
          <Select
            instanceId="product_list"
            placeholder="Seleccione un producto"
            name="product_id"
            options={products}
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
        </div>
      </form>
    </Modal>
  );
}
