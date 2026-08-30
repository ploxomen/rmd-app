import React from "react";
import SelectOrder from "./SelectOrder";
import { useFormOrderProduct } from "@/hooks/orders/production/useForm";
import DataProductionOrde from "./DataProductionOrde";
import DetailProduct from "./DetailProduct";

export default function FormProductionOrder() {
  const {
    shortages,
    handleSelectOrder,
    products,
    form,
    labels,
    errorSelectedOrder,
    ordersSelected,
    handleDeleteOrder,
    handleChangeAmountProduct
  } = useFormOrderProduct();
  return (
    <form className="flex flex-col gap-4">
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <SelectOrder
          listOrders={shortages.data}
          handleSelectOrder={handleSelectOrder}
          error={errorSelectedOrder}
          ordersSelected={ordersSelected}
          handleDeleteOrder={handleDeleteOrder}
        />
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <DataProductionOrde form={form} ordersSelected={ordersSelected} />
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <DetailProduct products={products} listLabels={labels?.data} handleChangeAmountProduct={handleChangeAmountProduct}/>
      </section>
    </form>
  );
}
