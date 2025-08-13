import React from "react";
import TableIntranet from "../TableIntranet";
import { ButtonDangerSm, ButtonPrimarySm } from "../Buttons";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { optionsUnitsMeasurements } from "@/helpers/listUnitsMeasurements";
import { parseMoney } from "@/helpers/utilities";

export default function TableProductProgress({
  columns = [],
  products = [],
  type = "all",
  viewHistory = () => {},
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
          <tr className="bg-white dark:bg-gray-800 text-xs" key={product.id}>
            <td className="p-1 text-center">{product.product_code}</td>
            {type === "all" && (
              <td className="p-1 text-center">
                {product.prod_prog_hist_type}
              </td>
            )}
            <td className="p-1 text-center">{product.product_name}</td>
            {type === "all" && (
              <td className="p-1 text-center">
                {product.product_progress_history_date}
              </td>
            )}

            <td className="p-1 text-center">
              {
                optionsUnitsMeasurements.find(
                  (unit) => unit.value === product.product_unit_measurement
                )?.label
              }
            </td>
            <td className="p-1 text-center">
              {product.product_progress_stock}
            </td>
            {type === "all" && (
              <>
              <td className="p-1 text-center">
                {parseMoney(product.product_progress_history_pu,'PEN')}
              </td>
              <td className="p-1 text-center">
                {parseMoney(product.product_progress_history_total,'PEN')}
              </td>
              <td className="p-1 text-center">
              {product.prod_prog_hist_bala_amou}
            </td>
            <td className="p-1 text-center">
              {parseMoney(product.prod_prog_hist_bala_cost,'PEN')}
            </td>
            <td className="p-1 text-center">
              {product.prod_prog_hist_prom_weig}
            </td>
              </>
            )}
            
            {type === "all" && (
              <td className="p-1 text-center">
                {product.product_progress_history_description}
              </td>
            )}
            <td className="p-1">
              <div className="flex gap-1 flex-wrap justify-center">
                {product.product_final_assem_id && <span>Sin acciones</span>}
                {type === "all" && !product.product_final_assem_id && (
                  <ButtonPrimarySm
                    onClick={(e) => viewHistory(product.id)}
                    icon={<PencilIcon className="w-4 h-4" />}
                    title="Editar historial"
                  />
                )}
                {type !== "all" && !product.product_final_assem_id && (
                  <Link
                    className="rounded-md relative overflow-hidden inline-flex group items-center justify-center px-2 py-1.5 cursor-pointer border-b-4 border-l-2 hover:bg-blue-600 font-semibold transition-all ease-in-out text-xs shadow-lg bg-gradient-to-tr bg-blue-500 text-white"
                    href={{
                      pathname: `history`,
                      query: {
                        product_progress: product.id,
                      },
                    }}
                    title="Ver historial"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </Link>
                )}
                {type === "all" && !product.product_final_assem_id && (
                  <ButtonDangerSm
                    onClick={(e) => deleteHistory(product.id)}
                    icon={<TrashIcon className="w-4 h-4" />}
                    title="Eliminar historial"
                  />
                )}
              </div>
            </td>
          </tr>
        ))
      )}
    </TableIntranet>
  );
}
