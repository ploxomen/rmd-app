import { InputPrimary, TextareaPrimary } from "@/components/Inputs";
import React from "react";

export default function DataProductionOrde({
  form = {},
  ordersSelected = [],
  handleChangeForm = () => {},
}) {
  return (
    <>
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.8"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a2 2 0 0 1 1.414.586l4.414 4.414A2 2 0 0 1 19 9.414V19a2 2 0 0 1-2 2Z"
              />
            </svg>
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">Datos de la Orden</h2>

            <p className="mt-1 text-sm text-slate-500">
              Información obtenida de las órdenes de servicio seleccionadas.
            </p>
          </div>
        </div>
      </div>
      <div className="p-6">
        {/* INFORMACIÓN DEL CLIENTE */}
        {form?.name_client && (
          <div className="mb-6 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
                {form?.name_client?.charAt(0) || "C"}
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-indigo-500">
                  Cliente
                </p>

                <p className="font-semibold text-slate-900">
                  {form?.name_client}
                </p>

                {form?.number_document && (
                  <p className="text-xs text-slate-500">
                    RUC: {form.number_document}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CAMPOS */}
        <div className="grid grid-cols-1 gap-x-2 gap-y-1 md:grid-cols-2 xl:grid-cols-4">
          {/* FECHA EMISIÓN */}
          <div>
            <InputPrimary
              label="Fecha de emisión"
              inputRequired="required"
              name="date_issue"
              onChange={handleChangeForm}
              type="date"
              value={form.date_issue}
            />
          </div>
          {/* CLIENTE */}
          <div className="col-span-2">
            <InputPrimary label="Cliente" disabled value={form.name_client} />
          </div>
          <div>
            <InputPrimary
              label="Fecha de entrega"
              inputRequired="required"
              name="date_delivery"
              type="date"
              value={form.date_delivery}
              onChange={handleChangeForm}
            />
          </div>

          <div className="col-span-full">
            <InputPrimary
              label="Dirección"
              inputRequired="required"
              name="address"
              value={form.address}
              onChange={handleChangeForm}
            />
          </div>

          {/* OBSERVACIONES */}
          <div className="md:col-span-2 xl:col-span-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Observaciones
            </label>

            <TextareaPrimary
              rows={3}
              name="observations"
              value={form.observations}
              onChange={handleChangeForm}
            />
          </div>
        </div>
        {ordersSelected.length >= 1 && (
          <div className="mt-6 border-t border-slate-100 pt-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-indigo-500" />

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Órdenes incluidas
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {ordersSelected.map((orden) => (
                <div
                  key={orden.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <span className="text-sm font-semibold text-slate-700">
                    {orden.order_code}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* ÓRDENES QUE COMPONEN LA INFORMACIÓN */}
      </div>
    </>
  );
}
