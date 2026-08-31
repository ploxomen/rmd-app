import React from "react";
import SummaryCard from "./SummaryCard";
import { InputPrimary } from "@/components/Inputs";

export default function DetailProduct({
  products = [],
  listLabels = [],
  handleChangeAmountProduct = () => {},
}) {
  const calcHour = (productLabel, labelId, amout) => {
    const timeHour =
      productLabel.find((prev) => prev.id === labelId)?.time_origin_hours || 0;
    return amout * timeHour;
  };
  const calcRowTotal = (productLabel, amout) => {
    return productLabel.reduce((acumulador, label) => {
      return acumulador + label.time_origin_hours * amout;
    }, 0).toFixed(2);
  };
  const calcTotalGeneral = (labelId) => {
    let total = 0;
    products.forEach((item) => {
      const label = item.list_labels.find((prev) => prev.id === labelId);
      if (label) {
        const time = parseFloat(label.time_origin_hours);
        const amount = parseInt(item.amount);
        const subtotal = time * amount;
        total += subtotal;
      }
    });
    return total;
  };
  const calcTotalOfTotal = () => {
    let total = 0;
    listLabels.forEach((item) => {
      total += calcTotalGeneral(item.id);
    });
    return total;
  };
  return (
    <>
      {/* HEADER */}
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Detalle y horas de producción
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Detalle de productos y horas requeridas por proceso de producción.
            </p>
          </div>

          <div className="rounded-xl bg-slate-100 px-4 py-2 text-right">
            <p className="text-xs text-slate-500">Productos</p>

            <p className="text-lg font-bold text-slate-900">
              {products.length}
            </p>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1150px]">
          {/* CABECERA */}
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Pedido Venta
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Producto
              </th>

              <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                Cantidad
              </th>
              {listLabels.map((label) => (
                <th
                  className="border-l border-slate-200 bg-green-50 px-5 py-4 text-center"
                  key={label.id}
                >
                  <span className="text-xs font-bold text-green-700">
                    {label.name}
                  </span>

                  <span className="mt-0.5 block text-[10px] text-green-600">
                    HORAS
                  </span>
                </th>
              ))}
              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Total
              </th>
            </tr>
          </thead>

          {/* CUERPO */}
          <tbody className="divide-y divide-slate-100">
            {!products.length && (
              <tr className="transition hover:bg-slate-50">
                <td
                  className="whitespace-nowrap px-5 py-4 text-center"
                  colSpan="100%"
                >
                  <span className="text-sm text-slate-500">Lista de productos vacía</span>
                </td>
              </tr>
            )}
            {products.map((product) => (
              <tr
                key={`${product.quota_deta_id}-${product.product_id}`}
                className="transition hover:bg-slate-50"
              >
                {/* ORDEN */}
                <td className="whitespace-nowrap px-5 py-4">
                  <span className="inline-flex rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
                    {product.order_code}
                  </span>
                </td>

                {/* product */}
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-800">
                    {product.product_name}
                  </p>
                </td>

                {/* CANTIDAD */}
                <td className="px-5 py-4 text-center">
                  <InputPrimary
                    value={parseInt(product.amount)}
                    onChange={(e) =>
                      handleChangeAmountProduct(
                        product.quota_deta_id,
                        product.product_id,
                        e.target.value,
                      )
                    }
                  />
                </td>
                {listLabels.map((label) => (
                  <td
                    className="border-l border-slate-100 bg-amber-50/40 px-5 py-4 text-center"
                    key={label.id}
                  >
                    <span className="font-semibold text-amber-700">
                      {calcHour(
                        product.list_labels,
                        label.id,
                        parseInt(product.amount),
                      )}
                    </span>
                  </td>
                ))}
                {/* TOTAL */}
                <td className="px-5 py-4 text-right">
                  <span className="font-bold text-slate-900">
                    {calcRowTotal(
                      product.list_labels,
                      parseInt(product.amount),
                    ) || 0}
                  </span>
                  <span className="ml-1 text-xs text-slate-400">h</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* CARDS DE TOTALES */}
      <div className="border-t border-slate-200 bg-slate-50 p-6">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-800">
            Resumen de horas de producción
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Total acumulado por cada proceso.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {/* CARPINTERÍA */}
          {listLabels.map((row) => (
            <SummaryCard
              key={row.id}
              title={row.name}
              value={calcTotalGeneral(row.id)}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              }
            />
          ))}
          {/* SOLDADURA */}
          <SummaryCard
            title="Total previsto"
            value={calcTotalOfTotal()}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.364-6.364-2.121 2.121M7.757 16.243l-2.121 2.121m12.728 0-2.121-2.121M7.757 7.757 5.636 5.636"
                />
              </svg>
            }
          />
        </div>
      </div>
    </>
  );
}
