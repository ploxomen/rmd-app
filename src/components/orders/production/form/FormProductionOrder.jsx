import React from "react";
import SelectOrder from "./SelectOrder";
import { useFormOrderProduct } from "@/hooks/orders/production/useForm";
import DataProductionOrde from "./DataProductionOrde";
import DetailProduct from "./DetailProduct";
import { ButtonPrimary } from "@/components/Buttons";

export default function FormProductionOrder({id}) {
  const {
    shortages,
    handleSelectOrder,
    products,
    form,
    labels,
    errorSelectedOrder,
    setFormulario,
    ordersSelected,
    handleDeleteOrder,
    productNotProduction,
    handleChangeAmountProduct,
    handleSubmit,
  } = useFormOrderProduct(id);
  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <SelectOrder
          listOrders={shortages.data}
          handleSelectOrder={handleSelectOrder}
          error={errorSelectedOrder}
          productNotProduction={productNotProduction}
          ordersSelected={ordersSelected}
          handleDeleteOrder={handleDeleteOrder}
        />
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <DataProductionOrde
          form={form}
          ordersSelected={ordersSelected}
          handleChangeForm={setFormulario}
        />
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <DetailProduct
          products={products}
          listLabels={labels?.data}
          handleChangeAmountProduct={handleChangeAmountProduct}
        />
        <div className="px-4 py-4">
            <ButtonPrimary type="submit" text={id ? "Actualizar" : "Generar"}/>
        </div>
      </section>
    </form>
  );
}
