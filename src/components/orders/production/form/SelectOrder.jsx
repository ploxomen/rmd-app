import { ButtonPrimary } from "@/components/Buttons";
import { SelectPrimary } from "@/components/Selects";
import { ArrowPathIcon, PencilIcon } from "@heroicons/react/24/solid";
import React from "react";

export default function SelectOrder({
  listOrders = [],
  ordersSelected = [],
  error = "",
  orderIdSelect = null,
  productNotProduction = [],
  handleSelectOrder = () => {},
  handleDeleteOrder = () => {},
  getProduct = () => {},
}) {
  return (
    <>
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Órdenes de Servicio
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Selecciona las órdenes de servicio que deseas incluir.
            </p>
          </div>

          <div className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700">
            {listOrders.length} total ordenes
          </div>
        </div>
      </div>
      <div className="p-6">
        {/* COMBOBOX */}
        <SelectPrimary
          label="Seleccionar Orden de Servicio"
          name="order_services"
          onChange={(e) => handleSelectOrder(e.target.value)}
        >
          <option value="">Seleccione las ordenes</option>
          {listOrders.map((order) => (
            <option key={order.id} value={order.id}>
              {order.order_code} - {order.customer_name}
            </option>
          ))}
        </SelectPrimary>
        {/* ERROR */}
        {error && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100">
              ⚠️
            </div>
            <div>
              <p className="text-sm font-semibold text-red-800">
                No se puede agregar la orden
              </p>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              {productNotProduction.length > 0 && (
                <ul className="text-sm list-disc pl-6 mt-1 flex flex-col gap-1">
                  {productNotProduction.map((row) => (
                    <li>
                      <div className="flex gap-3 items-center">
                        <span>{row.product_name}</span>
                        <PencilIcon
                          className="size-6 text-blue-500 cursor-pointer"
                          onClick={(e) => getProduct(row.product_id)}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
        {/* ORDENES SELECCIONADAS */}
        {ordersSelected.length > 0 && (
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Órdenes seleccionadas
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Puedes eliminar una orden utilizando la X.
                </p>
              </div>

              <span className="text-xs font-medium text-slate-400">
                {ordersSelected.length} órdenes
              </span>
            </div>
            <div className="space-y-3">
              {ordersSelected.map((orderSelect) => (
                <div
                  key={orderSelect.id}
                  className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/40"
                >
                  <div className="flex items-center gap-4">
                    {/* ICONO */}
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                      📋
                    </div>

                    {/* INFORMACIÓN */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">
                          {orderSelect.order_code}
                        </span>

                        <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700">
                          Seleccionada
                        </span>
                      </div>

                      <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
                        <span>
                          <strong>Cliente:</strong> {orderSelect.customer_name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ELIMINAR */}
                  <button
                    type="button"
                    onClick={() => handleDeleteOrder(orderSelect.id)}
                    title="Eliminar orden"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-100 hover:text-red-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ESTADO VACÍO */}
        {ordersSelected.length === 0 && !error && (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
              📋
            </div>

            <p className="mt-3 text-sm font-medium text-slate-700">
              No hay órdenes seleccionadas
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Selecciona una orden desde el campo superior.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
