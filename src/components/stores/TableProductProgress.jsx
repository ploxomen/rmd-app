import React from "react";
import TableIntranet from "../TableIntranet";
import { ButtonDangerSm, ButtonPrimarySm } from "../Buttons";
import { EyeIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { optionsUnitsMeasurements } from "@/helpers/listUnitsMeasurements";

export default function TableProductProgress({
  columns = [],
  products = [],
  type = "all",
  addHistory = () => {},
  deleteHistory = () => {},
}) {
  return (
    <TableIntranet columns={columns}>
      {!products.length ? (
        <tr className="bg-white dark:bg-gray-800">
          <td colSpan="100%" className="text-center font-bold">
            No se registraron productos en curso
          </td>
        </tr>
      ) : (
        products.map((product) => (
          <tr className="bg-white dark:bg-gray-800 text-xs" key={product.product_id}>
            {/* <td className="p-1 text-center">
              {product.product_progres_created}
            </td> */}
            <td className="p-1 text-center">{product.product_code}</td>
            <td className="p-1 text-center">{product.product_name}</td>
            <td className="p-1 text-center">{optionsUnitsMeasurements.find(unit => unit.value === product.product_unit_measurement)?.label}</td>
            <td className="p-1 text-center">
              {product.product_progress_stock}
            </td>
            {
              type === "all" && <td className="p-1">
              <div className="flex gap-1 flex-wrap justify-center">
                <ButtonPrimarySm
                  onClick={e => addHistory(product.product_id,product.product_unit_measurement)}
                  icon={<PlusIcon className="w-4 h-4" />}
                  title="Agregar historial"
                />
                <Link
                  className="rounded-md relative overflow-hidden inline-flex group items-center justify-center px-2 py-1.5 cursor-pointer border-b-4 border-l-2 hover:bg-blue-600 font-semibold transition-all ease-in-out text-xs shadow-lg bg-gradient-to-tr bg-blue-500 text-white"
                  href={{
                    pathname: `history`,
                    query: {
                      product_progress: product.progress_id,
                    },
                  }}
                  title="Ver historial"
                >
                  <EyeIcon className="w-4 h-4" />
                </Link>
                <ButtonDangerSm
                  onClick={(e) => deleteHistory(product.progress_id)}
                  icon={<TrashIcon className="w-4 h-4" />}
                  title="Eliminar historial"
                />
              </div>
            </td>
            }
          </tr>
        ))
      )}
    </TableIntranet>
  );
}
