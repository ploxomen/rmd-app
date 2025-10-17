import React from "react";
import TableIntranet from "../TableIntranet";
import { parseMoney } from "@/helpers/utilities";
import { ButtonDangerSm, ButtonPrimarySm } from "../Buttons";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

function TableHistoryMaterial({ histories, deleteHistory, viewHistory }) {
  const columns = [
    "fecha",
    "Código",
    "Tipo",
    "N° Guia de entrada",
    "justificacion",
    "Cantidad",
    "P. Uni.",
    "promedio almacen",
    "Total $",
    "Tipo cambio",
    "Total S/",
    "Usuario",
  ];
  return (
    <TableIntranet columns={columns}>
      {!histories.length ? (
        <tr className="bg-white dark:bg-gray-800">
          <td colSpan="100%" className="text-center font-bold">
            No se registraron historiales
          </td>
        </tr>
      ) : (
        histories.map((history) => (
          <tr className="bg-white dark:bg-gray-800 text-xs" key={history.id}>
            <td className="p-1 text-center">{history.material_hist_date}</td>
            <td className="p-1 text-center">
              {history.id.toString().padStart(3, "0")}
            </td>
            <td className="p-1 text-center">{history.raw_hist_type}</td>
            <td className="p-1 text-center">{history.material_hist_guide || ""}</td>
            <td className="p-1 text-center">{history.product_finaly_description || "-"}</td>
            <td className="p-1 text-center">{history.material_hist_amount}</td>
            <td className="p-1 text-center">
              {
                parseMoney(
                  history.material_hist_price_buy,
                  'PEN'
                )}
            </td>
            <td className="p-1 text-center">
              {history.raw_hist_prom_weig}
            </td>
            <td className="p-1 text-center">
              {parseMoney(history.material_hist_money === "USD" ? history.material_hist_total_buy_usd : 0, "USD") }
            </td>
            <td className="p-1 text-center">
              {
                parseMoney(
                  history.material_hist_total_type_change,
                  'PEN'
                )}
            </td>
            <td className="p-1 text-center">
              {
                parseMoney(
                  history.material_hist_total_buy_pen,
                  'PEN'
                )}
            </td>
            <td className="p-1 text-center">{history.user_name}</td>
          </tr>
        ))
      )}
    </TableIntranet>
  );
}

export default TableHistoryMaterial;
